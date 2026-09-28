#!/usr/bin/env node
/**
 * Free-model discovery watcher — server-side half of the dynamic free-model
 * architecture.
 *
 * Free-tier providers (OpenRouter, Pollinations, ...) rotate their free model
 * lists every few weeks. This script:
 *
 *   1. fetches each source's PUBLIC model catalog (no credentials),
 *   2. normalizes + ranks it (tool-calling models first, then newest),
 *   3. smoke-tests anonymous (keyless) sources with a real minimal request,
 *   4. rewrites ONLY the managed free-source entries in LLM.json.
 *
 * All commercial/BYOK provider entries are preserved untouched. The updated
 * LLM.json is committed by the scheduled GitHub Actions workflow and reaches
 * every installed client through the existing remote-preset sync (GitHub raw
 * CDN + per-client cache), i.e. zero servers to operate.
 *
 * Exit code 0 always; "changed=yes|no" in the output tells the workflow
 * whether a commit is needed.
 *
 * Usage:
 *   node scripts/discover-free-models.mjs [--no-probe]
 *
 * --no-probe  Skip keyless smoke probes (or set SKIP_PROBE=1).
 */

import { readFile, writeFile } from "node:fs/promises";

const CONFIG_PATH = new URL("../LLM.json", import.meta.url);
const FETCH_TIMEOUT_MS = 15_000;
const PROBE_TIMEOUT_MS = 30_000;
const runProbe =
  !process.argv.includes("--no-probe") && process.env.SKIP_PROBE !== "1";

// -- HTTP helpers ------------------------------------------------------------

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** True when a keyless minimal chat completion succeeds. */
async function probeAnonymousChat(baseUrl, modelId) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
        stream: false,
      }),
      signal: controller.signal,
    });
    if (res.status === 429) {
      // Rate-limited right now does not mean the model is gone — keep it.
      console.log(`  probe ${modelId}: rate-limited (429), keeping`);
      return true;
    }
    if (!res.ok) {
      console.log(`  probe ${modelId}: HTTP ${res.status}, dropping`);
      return false;
    }
    console.log(`  probe ${modelId}: OK`);
    return true;
  } catch (err) {
    console.log(`  probe ${modelId}: ${err.name ?? "error"}, keeping (network inconclusive)`);
    return true;
  } finally {
    clearTimeout(timer);
  }
}

// -- Source adapters ---------------------------------------------------------

async function discoverOpenRouter() {
  const json = await fetchJson("https://openrouter.ai/api/v1/models");
  if (!Array.isArray(json.data)) return [];
  const models = json.data
    .filter((m) => m && typeof m === "object")
    .filter(
      (m) =>
        Number(m.pricing?.prompt) === 0 &&
        Number(m.pricing?.completion) === 0,
    )
    // Exclude media-generation models (audio/image/video outputs) — the
    // catalog includes free music/image generators that cannot chat.
    .filter((m) => {
      const outputs = m.architecture?.output_modalities;
      if (!Array.isArray(outputs) || outputs.length === 0) return true;
      return outputs.every((o) => o === "text");
    })
    .map((m) => ({
      modelId: String(m.id),
      tools: Array.isArray(m.supported_parameters)
        && m.supported_parameters.includes("tools"),
      reasoning:
        Array.isArray(m.supported_parameters)
        && m.supported_parameters.some(
          (p) => typeof p === "string" && p.includes("reasoning"),
        ),
      contextWindow:
        typeof m.context_length === "number" ? m.context_length : undefined,
      createdAt: typeof m.created === "number" ? m.created : undefined,
    }));
  models.sort(
    (a, b) =>
      Number(b.tools) - Number(a.tools) ||
      (b.createdAt ?? 0) - (a.createdAt ?? 0) ||
      (b.contextWindow ?? 0) - (a.contextWindow ?? 0),
  );
  return models;
}

async function discoverPollinations() {
  const raw = await fetchJson("https://text.pollinations.ai/models");
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && typeof m === "object")
    .map((m) => ({
      modelId: String(m.name),
      tools: !!m.tools,
      reasoning: !!m.reasoning,
    }));
}

// -- Main --------------------------------------------------------------------

async function main() {
  const raw = await readFile(CONFIG_PATH, "utf8");
  const config = JSON.parse(raw);
  if (!Array.isArray(config.providers)) throw new Error("LLM.json has no providers array");

  const failures = [];

  // Pollinations — keyless; catalog + live anonymous probe.
  let pollinations = [];
  try {
    pollinations = await discoverPollinations();
  } catch (err) {
    failures.push(`Pollinations: ${err.message ?? err}`);
  }
  if (runProbe) {
    for (const m of pollinations) {
      const alive = await probeAnonymousChat(
        "https://text.pollinations.ai/openai",
        m.modelId,
      );
      if (!alive) m.dead = true;
    }
    pollinations = pollinations.filter((m) => !m.dead);
  }

  // OpenRouter — public catalog; anonymous chat is impossible upstream.
  let openRouter = [];
  try {
    openRouter = await discoverOpenRouter();
  } catch (err) {
    failures.push(`OpenRouter: ${err.message ?? err}`);
  }

  let changed = false;

  for (const provider of config.providers) {
    if (provider.name === "Pollinations Free" && pollinations.length > 0) {
      const ids = pollinations.map((m) => m.modelId);
      if (JSON.stringify(provider.models ?? []) !== JSON.stringify(ids)) {
        provider.models = ids;
        changed = true;
      }
      // Keep the curated default while offered; else take the first.
      if (!ids.includes(provider.defaultModel)) {
        provider.defaultModel = ids[0];
        changed = true;
      }
    }

    if (provider.name === "OpenRouter" && openRouter.length > 0) {
      const ids = openRouter.map((m) => m.modelId);
      if (JSON.stringify(provider.models ?? []) !== JSON.stringify(ids)) {
        provider.models = ids;
        changed = true;
      }
      if (!ids.includes(provider.defaultModel)) {
        provider.defaultModel = ids[0];
        changed = true;
      }
    }
  }

  if (failures.length > 0) {
    console.log("source failures (kept previous config for those sources):");
    for (const f of failures) console.log(`  - ${f}`);
  }

  if (!changed) {
    console.log("changed=no");
    return;
  }

  config.lastUpdated = new Date().toISOString().slice(0, 10);
  const output = `${JSON.stringify(config, null, 2)}\n`;
  await writeFile(CONFIG_PATH, output, "utf8");
  console.log(
    `changed=yes (Pollinations: ${pollinations.length}, OpenRouter free: ${openRouter.length})`,
  );
}

main().catch((err) => {
  console.error("discovery failed:", err);
  // Never fail the CI job — a retry happens on the next schedule.
  process.exit(0);
});
