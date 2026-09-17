# Industry Pack — Inject Your Industry Experience & Skills

---

**Sub-tool**: `industry_pack_operation`
**Scope**: Local (filesystem `.wowok/industry/` + in-memory registry) — never mutates chain state.

---

## 🎯 What Is an Industry Pack?

An **industry pack** is a distributable, versionable unit of one industry's business
intelligence. It lets you make WoWok a **personalizable business carrier**: you inject your
industry experience and skills, and the AI uses them as its operating manual from the very
next turn.

Each pack lives in its own folder under the industry root
(`.wowok/industry/<industry>/`) and is **exactly two files** (v2 merged layout):

| File | Content |
|------|---------|
| `pack.json` | Machine-checkable **settings only** — one section per layer (no comments). |
| `playbook.md` | Human strategy, tone, and field-tested experience — read by the AI as context; **overrides** built-in industry data for this account. |

> Legacy multi-file layouts (`manifest.json` + `match.json` + `personae/` …) are still read
> for backward compatibility, but new scaffolds always produce the v2 merged layout.

### pack.json layers

| Layer | What it configures |
|-------|--------------------|
| `manifest` | Pack metadata: `name` (must match folder), `version` (bump to signal upgrade), `display_name`, `layers` (remove a layer name to disable it). |
| `match` | Category-match rules: `hard_constraints`, `soft_weights`, `pricing_rules`, `highlight_fields`, `geo_mode`, `calendar_mode`. |
| `personae` | Per-role AI personas (`merchant`, `customer`, `supplier`, `collaborator`, `arbitrator`, `prospect`) — long-term identity + current strategy. |
| `dispute` | SLA tiers + fault assignment (`sla_tiers[]`, `fault_rules[]`). |
| `compliance` | Pre-checkout requirements: `prepay_mode`, `qualification[]`, `disclosure[]`, `refund_window`. |
| `supply` | Supplier-side qualification: `supplier_qualification[]`, `first_order_policy`, `redundancy_required`. |
| `rules` | Declarative machine-checked rules (`{ id, when, then, message }`) compiled into the evaluation engine. |
| `mode` | Deep IndustryMode shape (machine_shape / guards / allocator) — scaffolded separately when needed. |

### Strategy knowledge — two channels

Commercial strategy for the six built-in industries (`education`, `rental`,
`freelance`, `subscription`, `travel`, `retail`) ships through **two deliberately separate
channels**:

| Channel | What it carries | Where it lives |
|---------|-----------------|----------------|
| **Structured strategy catalog** (code-canonical) | Pricing models (`wowok_levers` whitelist-checked to real objects), `volume`/`balanced`/`margin` posture playbooks with hard guardrails, competitor-watch dimensions + review cadence, acquisition channels, unit-economics formulas with sourced anchors, curated success patterns, red lines | MCP package constants (`INDUSTRY_STRATEGIES`) — zero filesystem dependency; packs/programs may replace an entry through `registerIndustryStrategy()` (pack entry wins, built-ins are never mutated) |
| **Long-form tactical manual** | The full English handbook narrative for the industry — rationale, scripts, campaign calendars | Released to `<industry>/strategy-manual.md` (see sentinel rules below); readable in the client Industry drawer |

`strategy-manual.md` is a **third file you will see inside a built-in pack folder**, but it
is not part of the editable two-file pack contract. It is released by the runtime on every
scan with a versioned sentinel header:

```
<!-- builtin:strategy-manual:v<n>:<sha16> -->
```

Release rules (your edits always win):

- file missing → released copy is written;
- sentinel present, body unmodified → auto-updated when the built-in version bumps;
- sentinel present **and** body edited → never overwritten (you own it);
- no sentinel at all → treated as your own file, never touched.

`playbook.md` remains **your** strategy layer; `strategy-manual.md` is curated baseline
reading. When the file is absent (read-only disk, deleted, standalone MCP), tools fall back
to the code constants — the released file is an edit surface and convenience, never the
source of truth.

The structured catalog feeds the deterministic strategy advisor (lifecycle stage from
order count: 0/5/20/50 → cold_start/growing/mature/optimization) and the
[Strategy Review](strategy-review.md) scorecard (cadence, posture weights, proposals).
From the client Industry drawer you can also **Adopt strategy to my persona** on a
top-level pack folder: it unions the industry into the persona's `industries`, records the
merchant `posture` in `long_term.profiles.merchant.merchant.posture`, and leaves a dated
adoption marker in the `current` layer.

---

## 📞 Call Format

All operations go through the unified `wowok` tool:

```
wowok({ tool: "industry_pack_operation", data: { action: "<action>", ... } })
```

---

## ⚙️ Actions

| Action | Description |
|--------|-------------|
| `scaffold` | Generate a pristine pack skeleton (`<name>/pack.json` + `<name>/playbook.md`). |
| `list` | List registered packs. |
| `scan` | Seed the built-in industry templates + re-register every pack under the default directory (also runs automatically after a save). |
| `resolve` | Return the industry root directory. |
| `list_files` | List files under the industry root (industry tree). |
| `read_file` / `write_file` | Read / write a file under the industry root (path required; path-escape protected). |
| `get` | Return registered layer data for an industry (mode/match/personae/dispute/compliance/supply/rules/playbook). |
| `diff` | Compare registered vs on-disk manifest version/layers (upgrade signal). |
| `reset` | Restore a file or an entire pack folder to the pristine template (data-loss warning). |
| `create_file` / `create_dir` / `delete_file` / `copy` / `move` / `rename` | File operations under the industry root. |

---

## 🔄 How Changes Take Effect

```
Edit (Industry drawer / FileEditor) → Save to disk
        → industry_pack_operation scan (auto after save)
        → scanDefaultIndustryPacks():
            ① seed built-in templates (idempotent, never overwrites your content)
            ② re-register layers into the AI registry + SQLite cache
            ③ compile declarative rules into the evaluation engine
        → Next AI chat turn reasons against your edited rules
```

- **Meaningful-content gate**: empty scaffold templates never override built-in industry
  data — only real user content is registered.
- **Reset**: right-click any file / pack folder in the Industry drawer and choose *Reset*
  to restore the pristine template (whole pack, single file, or virtual persona paths).
- Built-in industries: `retail`, `freelance`, `rental`, `education`, `travel`, `subscription`
  (+ `general` fallback). Scaffold any new industry name (snake_case).

---

## ✨ Examples

### Scaffold a new industry pack

```json
{
  "tool": "industry_pack_operation",
  "data": { "action": "scaffold", "name": "london_tour" }
}
```

### Read the travel pack's playbook

```json
{
  "tool": "industry_pack_operation",
  "data": { "action": "read_file", "path": "travel/playbook.md" }
}
```

### Write your pricing rule into the travel pack's match section

```json
{
  "tool": "industry_pack_operation",
  "data": {
    "action": "write_file",
    "path": "travel/pack.json",
    "content": "{ ... your edited pack.json with match.pricing_rules ... }"
  }
}
```

### Reset a pack back to the pristine template

```json
{
  "tool": "industry_pack_operation",
  "data": { "action": "reset", "path": "travel" }
}
```

---

## 🔗 Related

- [Persona](persona.md) — the `personae` layer of a pack supplies industry-level default personas
- [Strategy Review](strategy-review.md) — chain-signal scorecard + current-layer proposals powered by the strategy catalog
- [Stage 5: Business Components](stage-05-business.md) — business objects you configure
- [Project](project.md) — deploy the objects you configure with your pack rules

---

**[← Return to Main Directory](../README.md)**
