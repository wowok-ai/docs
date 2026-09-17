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

## 🛡️ Safety Policy (the first user defaults in persona)

Confirmation posture and other safety defaults live **inside the persona** instead of
hard-coded client settings, so they are readable, editable, comparable across accounts,
and merged with the same priority chain as the rest of the persona. Two layer fields
carry them (both optional, both user-driven on `long_term`):

```json
"long_term": {
  "policy": {
    "confirm": {
      "mode": "streamlined",
      "batch_standard": false,
      "session_remember": ["account_switch"],
      "intent_bypass": true
    },
    "budget": { "daily_wow": "1000" },
    "allowlist": ["0x…"],
    "audit": true
  },
  "overrides": {
    "client.account_switch": "prompt",
    "confirm.default_values": "auto"
  }
}
```

### `policy.confirm.mode` — the three confirmation postures

| Mode | Behavior |
|------|----------|
| `full` | Confirm every matched safety rule. |
| `streamlined` | **Default.** Only risky / irreversible actions interrupt; routine (`standard`) rules pass. |
| `quiet` | Like `streamlined`, plus an approved **account switch is remembered once per session**. |

- `batch_standard` — when several **independent routine** tool calls run in one turn,
  present them as a single merged confirmation card. Fail-closed operations are never batched.
- `session_remember` — rule ids whose approval is remembered for the session (currently `account_switch`).
- `intent_bypass` — an explicit in-message instruction ("yes, do it") satisfies a routine prompt.
- `budget.daily_wow` — daily spend ceiling as a string; `null` means no ceiling.
- `allowlist` — addresses always treated as trusted.
- `audit` — keep the safety audit trail.

### `overrides` — tune a single rule

A map of **rule id → value**: `auto` (silent) · `warn` (allow with notice) · `prompt` (ask
every time) · `block` (always refuse). Only whitelisted ids are accepted; `get` returns the
catalog and the current values under `controls.overrides` (with each rule's `default` and
`allowed` values), plus `controls.locked_rules` — the fail-closed rules that **cannot be
relaxed in any mode**.

### Hard floor & merge semantics

- The policy can never reach the fail-closed floor: **amount / publish / irreversible**
  confirmations always prompt (except the explicitly user-tunable publish override), and the
  small-amount fund-approval policy and the global confirm-gate kill switch are untouched.
- `current`-layer policy may only **tighten** `long_term` (quieter → stricter, override
  severity can only rise, budgets can only shrink, audit can only be enabled, intent bypass
  can only be disabled). The system persona's `long_term` remains the user's durable default.
- The AI write paths (`analyze` / `apply` / `sync` / `distill`) never emit `policy` or
  `overrides` — they are user-driven values, edited via `set`, the client Settings screen,
  or the in-chat persona JSON editor.
- Legacy SQLite keys (`rules.confirm_mode`, audit, daily budget, allowlist) are migrated into
  the system persona once (missing fields only) and kept as read fallback.

---

## 🔗 Related

- [Industry Pack](industry-pack.md) — industry-level default personas via the `personae` layer
- [Stage 1: Account](stage-01-introduction.md) — local wallet & account identity
- [Personal](personal.md) — on-chain personal portal (public profile, likes/dislikes)

---

**[← Return to Main Directory](../README.md)**
