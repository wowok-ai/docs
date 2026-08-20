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
- [Stage 5: Business Components](stage-05-business.md) — business objects you configure
- [Project](project.md) — deploy the objects you configure with your pack rules

---

**[← Return to Main Directory](../README.md)**
