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

A persona is scoped by **account × industry × role** and has two layers.
There are **seven role slots** — `merchant`, `customer`, `supplier`,
`collaborator`, `arbitrator`, `demander` (RFP issuer), and `prospect`
(pre-purchase due diligence) — and one identity can hold several of them at once.

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

## 🎭 Role Slots (`profiles`) — One Identity, Seven Lenses

Every persona layer (`long_term` **and** `current`) may carry a `profiles` map with one
**RoleProfile** per role slot. Only the profile of the conversation's **active role** is
injected into the AI context — switching roles swaps the whole behavioral lens, not just a
label:

| Slot | Who plays it | Structured sections used |
|------|--------------|--------------------------|
| `merchant` | Service store owner / seller | `merchant` (`posture`: `volume`/`balanced`/`margin`, `pricing_style`, `service_style`, `communication`, `growth_focus`) |
| `customer` | Buyer who places orders | `tastes` (`materials`/`colors`/`styles`/`tags`/`brands`/`avoid`), `consumption` (`frequency`, `price_band`, `decision_speed`, `channels`, `repeat_orientation`, `avg_order_range`, `notes`) |
| `prospect` | Potential buyer in pre-order due diligence | same buyer sections as `customer` |
| `supplier` | Sub-order provider fulfilling a Demand | `supplier` (`min_order`, `lead_time`, `settlement_terms`, `categories`, `capacity`) |
| `collaborator` | Staff / named operator advancing workflows | `collaborator` (`scope_discipline`, `notifications`, `working_hours`, `advance_style`) |
| `arbitrator` | Dispute adjudicator | `arbitrator` (`case_types`, `response_speed`, `ruling_style`) |
| `demander` | RFP / Demand issuer | `demander` (`award_weights`, `pilot_budget`, `rfp_openness`, `decision_basis`) |

Every slot also accepts a free-form `preferences` extension bag. Unknown sections are
preserved on read-modify-write, so pack- or user-specific data is never lost.

### Built-in curated personalities

Even with an **empty** `profiles` map, each role carries a code-canonical curated
personality (`archetype`, motivations, communication tone, executable `value_levers`,
typical `game_moves` with hard taboos, path preferences, win/loss signals). Curated moves
may only bind to real MCP sub-tools or on-chain mechanisms — a test asserts the catalog can
never drift into unexecutable advice. Your stored profile **refines** the curated
personality; it does not disable its taboos.

### Merge semantics

`profiles` merge like the rest of the persona — **arrays union-dedup, nested objects
deep-merge, scalars are overridden by the higher-priority layer** — but, unlike `policy`,
profiles do **not** participate in the tighten-only lattice: they are cheaply correctable
preferences, so a `current`-layer profile may freely adjust a `long_term` one.

### Active role — persona role vs. session override

- The persona's own role (`role` field on the record) is what `get` resolves by default and
  what the curated personality + active profile are injected for.
- A `get` call may pass `role` to view the same identity **through another slot's lens**
  without rewriting the stored persona. The desktop client uses this for its per-conversation
  role switcher ("Follow persona" vs. an explicit role), persisted on the conversation row.
- Editing a slot never switches the active role; the two are independent controls.

```json
{
  "long_term": {
    "profiles": {
      "merchant": {
        "merchant": {
          "posture": "balanced",
          "pricing_style": "value"
        }
      },
      "customer": {
        "tastes": { "materials": ["titanium"], "colors": ["black"] },
        "consumption": { "frequency": "regular", "price_band": "premium" }
      }
    }
  }
}
```

> The merchant strategic **`posture`** (`volume` / `balanced` / `margin`) doubles as the
> weighting input for the [Strategy Review](strategy-review.md) scorecard. The safety floor
> (never price below cost, keep compensation funded, …) is non-negotiable at every posture —
> posture only reweights metrics above that floor.

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
| `apply` | Apply free-text conversation experience into the `current` layer (smart-merge, never touches `long_term`). Input is `context: string` — not a structured delta. |
| `apply_delta` | Merge a **structured** machine-generated delta (e.g. a confirmed strategy-review proposal) into `current` only. Server-guarded: `policy`/`overrides` are rejected, `long_term` is never written, arrays union with existing values; the merged record is fully re-validated. |
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

### Apply a confirmed structured delta into current (server-guarded merge)

```json
{
  "tool": "persona_operation",
  "data": {
    "action": "apply_delta",
    "scope": "account",
    "account": "london_guide",
    "delta": {
      "profiles": { "merchant": { "merchant": { "posture": "margin" } } }
    }
  }
}
```

The response carries the full post-merge `persona`, the resolved `effective`
persona, and the `applied` delta. A delta containing `policy` or `overrides`
is rejected outright; only the `current` layer changes.

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
  or the in-chat persona JSON editor. A current-layer delta carrying either key is rejected
  outright (`AI_DELTA_FORBIDDEN_KEYS`), including the persona `profiles.merchant.merchant.posture`
  proposal emitted by the [Strategy Review](strategy-review.md) card: the review itself
  stores nothing, and its proposal is merged into `current` only after an explicit per-card
  approval; declining writes nothing.
- `set` **replaces the whole stored record** — every structured writer must read the stored
  persona first and send `role` / `industries` / `long_term` / `current` back together, or
  untouched slices are lost. `apply` is the only smart-merge path and targets `current` only.
- Legacy SQLite keys (`rules.confirm_mode`, audit, daily budget, allowlist) are migrated into
  the system persona once (missing fields only) and kept as read fallback.

---

## 🔗 Related

- [Industry Pack](industry-pack.md) — industry-level default personas via the `personae` layer
- [Strategy Review](strategy-review.md) — chain-signal scorecard whose approved proposals merge into the persona `current` layer
- [Stage 1: Account](stage-01-introduction.md) — local wallet & account identity
- [Personal](personal.md) — on-chain personal portal (public profile, likes/dislikes)

---

**[← Return to Main Directory](../README.md)**
