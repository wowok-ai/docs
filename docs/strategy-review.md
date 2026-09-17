# Strategy Review — Chain-Signal Scorecard & Persona Proposals

---

**Sub-tool**: `strategy_review_operation`
**Scope**: Local (SQLite snapshot store) + chain reads — never mutates chain state and never writes the persona on its own.

---

## 🎯 What It Does

The strategy review turns **on-chain evidence** into a periodic business check-up for one
`(account, industry)`:

1. **Collect** fresh evidence from real WoWok read surfaces (orders, market metrics,
   discovery, arbitration score, account events).
2. **Score** 13 catalog metrics on a 0–100 anchored scale, reweighted by the merchant's
   strategic **posture** (`volume` / `balanced` / `margin`), and compute period-over-period
   deltas against the latest stored snapshot.
3. **Review** the score through the industry's curated strategy catalog (see
   [Industry Pack](industry-pack.md)) into findings, recommendations, and **at most two**
   persona `current`-layer proposals.

Nothing in step 3 is ever applied automatically. A proposal is merged into the persona
**only** after explicit per-proposal confirmation (in the desktop client, the review card's
Approve button); declining writes nothing. Both decisions are recorded in the conversation
as a `strategy_review` decision card.

> Evidence failures degrade. A metric whose source fails or returns no evidence is reported
> as `unavailable` / `error` — it is **never zero-filled** — and the overall score is
> renormalized over the metrics that actually have anchored values.

---

## 📞 Call Format

All operations go through the unified `wowok` tool:

```
wowok({ tool: "strategy_review_operation", data: { action: "<action>", ... } })
```

---

## ⚙️ Actions

| Action | Persists? | Description |
|--------|-----------|-------------|
| `collect` | One append-only local snapshot | Gather fresh evidence, score nothing, return the raw collection and store it as the baseline for future deltas. Storage failure is fail-soft (`stored: false`, `storage_error` returned, collection never lost). |
| `review` | **Nothing** | Gather fresh evidence, diff against the latest stored snapshot, score under the persona posture, and assemble the full review (scorecard, findings, recommendations, proposals). |
| `list_snapshots` | No | List stored snapshot summaries (`id`, `posture`, `collected_at`, `created_at`) for `account` + `industry`. |

`account` and `industry` are required for every action.

---

## 🌲 Input Schema

```
strategy_review_operation
├── action (required) — "collect" | "review" | "list_snapshots"
├── account (required) — chain account address; scope of evidence + snapshots
├── industry (required) — education | rental | freelance | subscription | travel | retail
│                        or any pack-registered industry id
├── posture (optional) — "volume" | "balanced" | "margin";
│                        defaults to the effective persona's merchant posture, then "balanced"
├── network (optional) — "testnet" (default) | "mainnet"
├── limit (optional) — max records per evidence query, integer 1–200
├── no_cache (optional, boolean) — bypass fetcher caches
└── discovery_terms (optional, string[]) — override bilingual competitor/service search terms
```

The input object is `.strict()` — unknown fields are rejected.

---

## 📊 Metric Catalog (13)

| Metric id | What it measures |
|-----------|------------------|
| `order_count` | Account's observed orders in the window |
| `completed_count` | Completed orders (volume anchor) |
| `completion_rate` | Completed ÷ observed orders |
| `repeat_customer_rate` | Share of orders from returning customers |
| `dispute_rate` | Disputed ÷ observed orders (guardrail metric, >5% triggers a proposal) |
| `dd_to_order_rate` | Demand discovery → order conversion |
| `market_recent_orders` | Market recent order count (contextual) |
| `market_recent_gmv` | Market recent GMV (contextual) |
| `supply_demand_ratio` | Suppliers/services relative to open demands |
| `market_active_services` | Currently active services in the market |
| `competitor_count` | Competitors enumerated via discovery terms |
| `arbitration_trust_score` | Account's arbitration trust score (feeds the advisor as `trust_score`) |
| `open_attention_count` | Open attention / market-event items for the account |

Each scored metric returns `{ id, label, status, value, weight, score, delta }`:

- `status` — `ok` | `unavailable` | `error`;
- `weight` — the posture-specific weight **actually applied** (weights renormalize over the
  available anchored metrics, so unavailable metrics never shrink the score unfairly);
- `score` — 0–100, or `null` for contextual / unavailable metrics;
- `delta` — `{ id, from, to, change, direction: "up"|"down"|"flat", improved: boolean|null }`
  against the previous snapshot (`null` when there is no history).

The scorecard's `overall` is the 0–100 renormalized total, or `null` when no
scorable metric has evidence — shown as `n/a`, never as zero. It is also
`null` unless at least one available anchored metric is **shop-performance
evidence** (`order_count`, `completion_rate`, `repeat_customer_rate`,
`dispute_rate`, `dd_to_order_rate`, `arbitration_trust_score`):
market-environment signals alone (order flow, supply/demand, competitor
density, attention backlog) report a market temperature, not a grade of the
shop, so a shop with no observed orders can never read 100/100.

### Evidence sources (fail-soft fetchers)

`market_operations` · `order_flow` · `market_metrics` · `discover_services` ·
`arbitration_score` · `account_events`. A failing source lists itself in `errors`; the
metrics it alone supplies move to `unavailable`; the rest of the review proceeds.

---

## 🔁 Cadence & the AI Nudge

Review cadence comes from the industry strategy catalog's competitor-watch setting:

| Cadence | Industries |
|---------|-----------|
| 7 days | education, retail, subscription |
| 14 days | rental, freelance |
| 30 days | travel |
| 7 days (default) | unknown / pack-registered industries |

When a review is due, the merchant AI context receives a one-line soft nudge
(`reviewNudgeLine`) — for example, *"strategy review due (last review 9d ago; cadence every
7d) — suggest strategy_review_operation action='review'"*. The line explicitly ends with
**"suggestion only; do NOT call it without the user's go-ahead"** — nothing is
auto-invoked.

The `cadence` block in a review reports `cadence_days`, `days_since_last`, `due`, and
`next_review_after`.

---

## 🧩 Recommendations & Proposals

`recommendations` are deterministic advice from the strategy catalog: the posture-appropriate
pricing model (catalog default for `balanced`; acquisition-oriented model id for `volume`;
premium/protection-oriented for `margin`), 1–3 next moves driven by lifecycle stage and
metrics (cold start / dispute >5% / repeat <25% beyond cold start), the competitor-watch
rhythm, and the first hard guardrail of the chosen posture playbook.

`proposals` contains **0–2** persona deltas. Evidence-driven proposals (risk
gates, retention) take priority; the cosmetic `adopt_posture` nudge is emitted
last so the two-proposal cap never drops a risk/retention signal. Every
proposal has `target_layer: "current"` and
`apply_via: { tool: "persona_operation", action: "apply_delta" }`. Approval
calls `persona_operation` with `action: "apply_delta"`, `scope: "account"`,
`account`, and the structured `delta`: the MCP server performs the guarded
CURRENT-layer merge itself (arrays union, objects deep-merge, scalars
overwrite), re-validates the whole record, and never touches `long_term`.
Each delta is asserted current-safe (`policy` / `overrides` are rejected — see
[Persona](persona.md) safety policy). Note this is **not** the free-text
`apply` action: passing a structured delta to `apply` (which expects
`context: string`) is a schema error.

| Proposal id | Trigger | Delta |
|-------------|---------|-------|
| `adopt_posture` | No merchant posture exists in the effective persona yet | Sets `profiles.merchant.merchant.posture` so advice stays stable across sessions |
| `tighten_evidence_guards` | `dispute_rate > 0.05` | Appends one dated `strategy[]` line: tighten pre-delivery evidence guards, pause promotions |
| `repeat_reward_focus` | `repeat_customer_rate < 0.25` with `order_count ≥ 5` (and no dispute trigger) | Appends one dated `strategy[]` line: repeat/referral reward over price cuts |

---

## ✨ Examples

### Collect a baseline snapshot

```json
{
  "tool": "strategy_review_operation",
  "data": {
    "action": "collect",
    "account": "0xabc…",
    "industry": "education",
    "network": "testnet"
  }
}
```

Result: `{ result: { action: "collect", snapshot_id: "ss_…", stored: true, posture: "balanced", collection: { … } } }`

### Run a review under an explicit posture

```json
{
  "tool": "strategy_review_operation",
  "data": {
    "action": "review",
    "account": "0xabc…",
    "industry": "education",
    "posture": "volume"
  }
}
```

Result (abridged):

```json
{
  "result": {
    "action": "review",
    "previous_snapshot_id": "ss_lz8k…",
    "review": {
      "account": "0xabc…",
      "industry": "education",
      "posture": "volume",
      "generated_at": 1760000000000,
      "scorecard": {
        "posture": "volume",
        "overall": 72,
        "scored_metric_count": 4,
        "metric_scores": [
          { "id": "dispute_rate", "label": "Dispute rate", "status": "ok",
            "value": 0.03, "weight": 0.3, "score": 81,
            "delta": { "id": "dispute_rate", "from": 0.04, "to": 0.03, "change": -0.01, "direction": "down", "improved": true } }
        ],
        "unavailable": ["competitor_count"]
      },
      "cadence": { "cadence_days": 7, "days_since_last": 9, "due": true, "next_review_after": null },
      "summary": "# Strategy review — education (volume) …",
      "findings": ["Dispute rate: 0.03; change -0.01 (improved) [score 81/100]"],
      "recommendations": ["pricing model: Trial-class conversion price (stage: cold_start)", "…"],
      "proposals": [
        { "id": "adopt_posture", "rationale": "…", "target_layer": "current",
          "delta": { "profiles": { "merchant": { "merchant": { "posture": "volume" } } } },
          "apply_via": { "tool": "persona_operation", "action": "apply_delta", "note": "…" } }
      ],
      "unavailable": ["competitor_count"]
    }
  }
}
```

### List stored snapshots

```json
{
  "tool": "strategy_review_operation",
  "data": { "action": "list_snapshots", "account": "0xabc…", "industry": "rental" }
}
```

---

## 🖥️ Desktop Client

- The chat header's chart action runs a review in a modal: industry defaults to the
  persona's first registered industry; posture defaults to the persona default.
- The card shows overall score, posture/cadence headline, the metric table with value /
  delta / score, findings, recommendations, and proposal cards with a previewable delta.
- **Approve** merges the proposal delta into the persona `current` layer via a
  read-modify-write of the full stored record (`long_term` untouched) and appends a
  persisted `strategy_review` decision card to the conversation.
- **Decline** performs **no** persona write; the decision is still recorded in the
  conversation as the audit trail. Decision cards are UI-only — they are excluded from LLM
  history.
- Industry folders' right-click **Adopt strategy to my persona** action is the separate,
  user-initiated long-term adoption flow (see [Industry Pack](industry-pack.md)).

---

## 🔗 Related

- [Persona](persona.md) — where approved proposals land (`current` layer), and where the merchant posture lives
- [Industry Pack](industry-pack.md) — the six-industry strategy catalog, posture playbooks, cadence, and long-form tactical manuals
- [Trust Score](trust-score.md) — per-service trust/risk assessment (a complementary, pre-purchase read)
- [Response Format](response-format.md) — MCP result envelope and error classification

---

**[← Return to Main Directory](../README.md)**
