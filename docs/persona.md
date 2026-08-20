# Persona — Account & Industry Business Persona

---

**Sub-tool**: `persona_operation`
**Scope**: Local (SQLite) — never mutates chain state.

---

## 🎯 What Is a Persona?

A **persona** is the AI's understanding of **who you are** and **how you operate** in
business. It makes WoWok a personalizable business carrier: instead of a one-size-fits-all
platform, you teach the AI your long-term identity and your current negotiation stance, and
it negotiates, recommends, and executes **your way**.

A persona is scoped by **account × industry × role** (merchant / customer / supplier /
collaborator / arbitrator / prospect) and has two layers:

| Layer | Meaning | Who can write |
|-------|---------|---------------|
| `long_term` | Who you are: `identity` (self_description, region, languages), stable `preferences`, red lines | **User-driven only** — only `set` may touch it, and only when the payload explicitly carries `long_term` |
| `current` | How you play this round: `strategy`, `requirements`, `rules`, `spec`, per-turn `preferences` | Smart-updatable — `apply` (conversation experience) and `sync` (account behavior) write ONLY `current` |

**Priority chain (low → high):** `system < industry default (base) < account`, and
`long_term < current`. The account's `current` layer always wins.

> **Note**: Personas shape AI behavior locally — they never touch the chain by themselves.
> Industry-level default personas come from the industry pack's `personae` layer (see
> [Industry Pack](industry-pack.md)).

---

## 📞 Call Format

All operations go through the unified `wowok` tool:

```
wowok({ tool: "persona_operation", data: { action: "<action>", ... } })
```

---

## ⚙️ Actions

| Action | Description |
|--------|-------------|
| `get` | Resolve the effective persona for an account/industry/role (with context text + injection). |
| `list` | List stored personas + all industry default personas. |
| `set` | Set a persona layer (the ONLY action that may write `long_term`, user-driven). |
| `analyze` | Analyze a conversation context and return persona suggestions. |
| `apply` | Apply conversation experience into the `current` layer (smart-merge, never touches `long_term`). |
| `sync` | Merge account behavior (experience layer) into `current`. |
| `remove` | Delete a persona (account scope or system scope). |
| `strategy` | Resolve strategy statements → infrastructure levers (producer-side concept; merchant role only). |
| `region_hint` | Read locally-stored delivery address as a region hint; `propose` creates a consent-gated save proposal. |

---

## ✨ Examples

### Set your long-term identity + current strategy (merchant)

```json
{
  "tool": "persona_operation",
  "data": {
    "action": "set",
    "scope": "account",
    "account": "london_guide",
    "role": "merchant",
    "industries": ["travel"],
    "long_term": {
      "identity": {
        "self_description": "London tour guide, 10 years in the UK",
        "region": "UK",
        "languages": ["en", "zh"]
      },
      "preferences": { "trust_sensitivity": ["high"] }
    },
    "current": {
      "strategy": [
        "Release funds per service day (not upfront).",
        "Rest on Tuesday and Wednesday."
      ],
      "requirements": ["must have arbitration"],
      "rules": ["Never promise refunds larger than 30% without evidence."]
    }
  }
}
```

### Get the effective persona for a role

```json
{
  "tool": "persona_operation",
  "data": { "action": "get", "account": "london_guide", "industry": "travel", "role": "merchant" }
}
```

### Apply conversation experience into current (never touches long_term)

```json
{
  "tool": "persona_operation",
  "data": { "action": "apply", "scope": "account", "account": "london_guide", "context": "The customer asked for a discount on a multi-day booking..." }
}
```

---

## 🔗 Related

- [Industry Pack](industry-pack.md) — industry-level default personas via the `personae` layer
- [Stage 1: Account](stage-01-introduction.md) — local wallet & account identity
- [Personal](personal.md) — on-chain personal portal (public profile, likes/dislikes)

---

**[← Return to Main Directory](../README.md)**
