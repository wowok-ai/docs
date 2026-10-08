


# Response Format Reference (📋 MCP Output Structure)

---

## Component Overview

All WoWok MCP responses come from a **single unified tool** named `wowok`. The AI calls `wowok({ tool: "<sub-tool>", data: {<params>} })`, and the handler pre-validates parameters, dispatches to the appropriate sub-tool, and wraps the result in a uniform envelope. This document describes that envelope, the inner result variants, the semantic layer, error classification, and the optional harness report.

---

## Architecture: Single Unified `wowok` Tool

The MCP server registers exactly **one tool** (`wowok`) with MCP clients. The 34 sub-tools (onchain_operations, account_operation, query_toolkit, etc.) live in an internal `TOOL_REGISTRY` and are dispatched by the `wowok` handler.

### Why a Single Tool?

| Problem with Multi-Tool | Solution with Single Tool |
|-------------------------|---------------------------|
| 34 tools × full schemas (several MB) in `tools/list` — overflows AI context | One `wowok` tool with a minimal display schema (~2 KB) |
| AI must choose the right tool from 34 options — frequent mis-selection | Only one tool to call; AI specifies the sub-tool by name in `data.tool` |
| Schema mismatches return cryptic SDK `-32602` errors | Handler returns the correct schema + actionable errors for self-correction |

### Call Format

```json
{
  "tool": "<sub-tool-name>",
  "data": { "<sub-tool parameters>" }
}
```

**Accepted aliases (deprecated but supported):**
- `tool_name` / `name` → normalized to `tool`
- `args` / `params` → normalized to `data`
- Inline params: `{ "tool": "<sub-tool>", <param1>: ..., <param2>: ... }` (auto-wrapped into `data`)

**Example:**
```json
{
  "tool": "schema_query",
  "data": { "action": "get", "name": "onchain_operations" }
}
```

---

## Top-Level Envelope

Every `wowok` tool response contains a `structuredContent` object with this shape:

```json
{
  "result": {
    "status": "success | pending | error | schema_mismatch",
    "outcome": "executed | pending_input | failed",
    "data": { ... },
    "errors": [ ... ]
  },
  "schema": null | {
    "input": { ... },
    "tool": "<sub-tool-name>"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `result` | object | Yes | Wrapper containing `status`, optional `outcome`, sub-tool payload (`data`), and optional `errors`/`hint` |
| `result.status` | enum | Yes | `success` \| `pending` \| `error` \| `schema_mismatch` — determines how to process the response. `pending` means the operation was **NOT** executed and needs caller action (never treat it as success) |
| `result.outcome` | enum | Optional | Transaction-level discriminant surfaced by outcome-discriminated sub-tools (`onchain_operations`, `bridge_operation`): `executed` \| `pending_input` \| `failed`. Always agrees with `status`: `executed` → `success`, `pending_input` → `pending`, `failed` → `error` |
| `result.data` | object | Conditional | Sub-tool's structured result; present on `success` and `pending` (and `error` when the sub-tool returned a structured error) |
| `result.errors` | string[] | Conditional | Present on `error` and `schema_mismatch` — specific validation or runtime errors |
| `result.structured_errors` | object[] | Optional | Present on `schema_mismatch` — machine-readable errors, each with `path`, `code`, `message`, `suggestion`, for programmatic self-correction |
| `result.hint` | string | Optional | Present on `schema_mismatch` and unknown-sub-tool errors — instructions to fix and retry |
| `result.suggestions` | string[] | Optional | Present when the sub-tool name was unknown — closest matches |
| `result.received` | any | Optional | Present on `schema_mismatch` when `tool` was missing — echoes the received input |
| `result.error_code` \| `result.retryable` \| `result.recovery_hint` | — | Optional | Surfaced at envelope level on `error` when the sub-tool returned a classified error (mirrors the inner error fields — a caller can branch on retryability without unwrapping `data`) |
| `schema` | object \| null | Yes | Schema payload on mismatch; `null` on success/error |

---

## Status Variants

### status: "success"

The sub-tool executed successfully. `result.data` contains the sub-tool's structured content (the outcome-discriminated `CallOutput` described in the next section).

```json
{
  "result": {
    "status": "success",
    "outcome": "executed",
    "data": {
      "outcome": "executed",
      "result": {
        "type": "transaction",
        "digest": "0xabc...",
        "effects": { ... },
        "objectChanges": [ ... ]
      },
      "message": "Service published successfully",
      "semantic": { ... }
    }
  },
  "schema": null
}
```

### status: "pending"

The operation was **NOT** executed — caller input is required. This is the envelope-level projection of `outcome: "pending_input"`: the operation may be blocked by a Guard that needs submission data (`result.type === "submission"`) or by the ConfirmGate (`result.type === "pending_confirmation"`). **Nothing is on chain yet** — never treat `pending` as success.

```json
{
  "result": {
    "status": "pending",
    "outcome": "pending_input",
    "data": {
      "outcome": "pending_input",
      "result": {
        "type": "pending_confirmation",
        "preview": { ... },
        "rule_id": "publish_immutable"
      },
      "message": "ConfirmGate: publish-level operation requires confirmation"
    }
  },
  "schema": null
}
```

**Recommended handling:** read `result.data.result.type` — for `submission`, fill the submission and re-invoke (see [Guard Submission Flow](#guard-submission-flow)); for `pending_confirmation`, present the preview and re-invoke the same call with `env.confirmed = true`.

### status: "error"

The sub-tool handler returned an error (runtime failure, on-chain rejection, etc.). `result.errors` lists the error messages; `result.data` may also carry the sub-tool's structured error payload. Classified errors additionally surface `error_code`, `retryable`, and `recovery_hint` at the envelope level.

```json
{
  "result": {
    "status": "error",
    "outcome": "failed",
    "data": { ... },
    "errors": ["Insufficient balance for gas"],
    "error_code": "insufficient_balance",
    "retryable": true,
    "recovery_hint": "Claim faucet tokens then retry"
  },
  "schema": null
}
```

### status: "schema_mismatch"

The input parameters did not match the sub-tool's Zod schema. The response includes the **correct schema** so the AI can fix parameters and retry — **no separate `schema_query` call is needed**.

```json
{
  "result": {
    "status": "schema_mismatch",
    "errors": [
      "data: Expected object, received string",
      "Unknown field(s): invalid_field"
    ],
    "hint": "Fix your parameters based on the schema below and retry. CACHE THIS SCHEMA for future onchain_operations calls — you don't need to query it again."
  },
  "schema": {
    "input": {
      "type": "object",
      "properties": {
        "operation_type": { "type": "string", "enum": ["permission", "service", ...] },
        "data": { ... },
        "env": { ... }
      },
      "required": ["operation_type", "data"]
    },
    "tool": "onchain_operations"
  }
}
```

**Recommended handling:**
1. Read `schema.input` carefully.
2. Fix the parameters in your next `wowok` call.
3. **Cache** the schema in your context for future calls to the same sub-tool.

When `result.structured_errors` is present, prefer it for programmatic fixing — each entry carries a precise `path`, a `code` (e.g. `schema_validation_error`, `duplicate_field`), a human-readable `message`, and a `suggestion` describing the fix.

> **Note:** For `onchain_operations`, the mismatch response automatically returns the operation-type-specific sub-schema (e.g. `onchain_operations_service`) when `operation_type` is present in the input — giving you the exact field requirements for that operation.

### Unknown Sub-Tool

If the `tool` field references a name that is not registered, the response includes `suggestions` with closest matches:

```json
{
  "result": {
    "status": "error",
    "errors": ["Unknown sub-tool: onchain_op"],
    "hint": "Available sub-tools: onchain_operations, account_operation, ... Did you mean: onchain_operations?",
    "suggestions": ["onchain_operations"]
  },
  "schema": null
}
```

### Missing `tool` Field

If the call omits the `tool` field entirely, the response returns the unified `wowok` display schema so the AI can learn the expected call format:

```json
{
  "result": {
    "status": "schema_mismatch",
    "errors": ["Missing 'tool' field. Received keys: action, name"],
    "hint": "Provide 'tool' (one of: onchain_operations, account_operation, ...) and 'data' (sub-tool parameters).",
    "received": { "action": "get", "name": "onchain_operations" }
  },
  "schema": {
    "input": { "type": "object", "properties": { "tool": { ... }, "data": { ... } } },
    "tool": "wowok"
  }
}
```

---

## Inner Sub-Tool Payload (result.data)

When `result.status === "success"` or `"pending"`, `result.data` contains the sub-tool's structured content — an **outcome-discriminated** object:

```json
{
  "outcome": "executed",
  "result": { ... },
  "message": "Human-readable summary or hint",
  "semantic": { ... }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `outcome` | enum | Yes | `executed` \| `pending_input` \| `failed` — check this **first**. Only `failed` ever carries `recovery` or `diagnosis`; `pending_input` means the operation was not executed (supply the missing submission/confirmation and re-invoke) |
| `result` | CallResult | Yes | Discriminated union of 6 result types — check `result.type` first |
| `message` | string | Optional | Human-readable summary; always present for error/transaction results |
| `semantic` | SemanticSummary | Optional | Business-level semantic summary; prefer this over raw result parsing |
| `recovery` | RecoveryAction | Conditional | **Always present when `outcome === "failed"`** — the Recover Loop's chosen strategy; consult it before retrying |
| `diagnosis` | VerifyReport | Optional | Failure-path verify report; present on `failed` when an expectation was declared — explains **why** the outcome fell short (complements `recovery`, which says **what to do next**) |
| `schema_warning` | SchemaWarning | Optional | Schema compatibility warning; present only when `client_schema_version` is provided in `env` and a mismatch is detected |

> **Note:** The sub-tool payload shape varies slightly across sub-tools. Query sub-tools (`query_toolkit`, `onchain_table_data`, `schema_query`) return their own structured results inside `result.data`. The outcome-discriminated payload above applies to `onchain_operations`, `account_operation`, `local_mark_operation`, `local_info_operation`, `messenger_operation`, `wip_file`, `guard2file`, `machineNode2file`, and `bridge_operation`.

---

## Result Types (CallResult)

The inner `result` field (inside `result.data.result`) is a discriminated union on the `type` field. Always check `result.type` first to determine how to process the response.

### type: "transaction"

Returned when an on-chain transaction is submitted and confirmed.

```json
{
  "type": "transaction",
  "digest": "0xabc...",
  "effects": { ... },
  "objectChanges": [ ... ]
}
```

### type: "submission"

Returned when Guard verification is required before the operation can proceed. Fill the `submission` array and resubmit.

```json
{
  "type": "submission",
  "guard": [
    {
      "object": "my-delivery-guard",
      "impack": true
    }
  ],
  "submission": [
    {
      "guard": "my-delivery-guard",
      "submission": [
        { "field": "delivery_proof", "value": "Qm..." }
      ]
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `guard` | array | Guard objects to verify, each with `object` (name/ID) and `impack` (whether result affects final logic) |
| `submission` | array | User-submitted data for each Guard. Fill these and re-invoke the **same** `wowok` call with the filled submission placed at the **top level** of the operation input (sibling of `tool`/`data`) — e.g. `{ "tool": "onchain_operations", "data": { ... }, "submission": { "type": "submission", "guard": [ ... ], "submission": [ ... ] } }`. Placing it inside `data` also works, but provide it in exactly ONE place (both triggers a clear error) |

### type: "error"

Returned when the operation fails. Includes structured error classification for programmatic recovery.

```json
{
  "type": "error",
  "error": "Insufficient balance for gas",
  "error_code": "insufficient_balance",
  "retryable": true,
  "recovery_hint": "Claim faucet tokens then retry",
  "related_object": "0x123..."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `error` | string | Human-readable error message |
| `error_code` | enum | Error classification (see table below) |
| `retryable` | boolean | Whether the same call can be retried as-is |
| `recovery_hint` | string | Recovery suggestion for AI or user |
| `related_object` | string | Object ID related to the error, if any |

#### Error Codes

| error_code | retryable | Description | Recovery Strategy |
|------------|-----------|-------------|-------------------|
| `invalid_parameter` | false | Input validation failed | Fix the parameter and retry |
| `guard_rejected` | false | Guard verification rejected the submission | Review Guard requirements and resubmit |
| `state_conflict` | false | Object state doesn't allow this operation | Query current state and adjust |
| `insufficient_balance` | true | Not enough tokens for gas/payment | Claim faucet tokens and retry |
| `object_not_found` | false | Referenced object doesn't exist | Verify object ID or name |
| `permission_denied` | false | Account lacks required permissions | Switch to an authorized account |
| `immutable_violation` | false | Attempted to modify an immutable object | Object cannot be changed after publish |
| `network_error` | true | RPC/network connectivity issue | Retry after a brief wait |
| `unknown` | varies | Unclassified error | Check error message for details |

### type: "data"

Returned by query operations. Contains an array of object records.

```json
{
  "type": "data",
  "data": [
    {
      "id": "0xabc...",
      "objectType": "0x2::service::Service",
      "change": "created"
    }
  ]
}
```

### type: "null"

Returned when the operation completes successfully but produces no output data.

```json
{
  "type": "null"
}
```

### type: "pending_confirmation"

Returned when the **ConfirmGate** blocks the operation before execution. The operation was **NOT** submitted on-chain. Read the `preview` to understand what would happen, then re-call with `env.confirmed = true` to proceed (or modify/cancel).

```json
{
  "type": "pending_confirmation",
  "preview": {
    "level": "publish",
    "operation": "service",
    "object": "my-shop",
    "network": "testnet",
    "account": "",
    "immutable_after": ["machine", "order_allocators"],
    "warnings": ["Using default account (env.account=\"\")"],
    "irreversible": false
  },
  "rule_id": "publish_immutable"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `preview` | OperationPreview | Preview of the operation awaiting confirmation |
| `preview.level` | enum | `none` \| `standard` \| `amount` \| `publish` \| `irreversible` — severity of the confirmation |
| `preview.operation` | string | `operation_type` that triggered the gate |
| `preview.object` | string \| object \| null | Object name/ID involved (string for existing, object for new creation) |
| `preview.network` | string | Network in use |
| `preview.account` | string | Signing account (`""` = default) |
| `preview.amount` | object | Amount info for `amount`-level confirmations (value, token, human_readable, recipient) |
| `preview.immutable_after` | string[] | Fields that become immutable after this op (for `publish` level) |
| `preview.warnings` | string[] | Default-value warnings |
| `preview.irreversible` | boolean | True when the operation cannot be reverted |
| `rule_id` | string | ID of the confirmation rule that matched |

**Recommended handling:**
1. Read `preview.level` to understand the severity.
2. Present the preview to the user (or decide autonomously for `standard` level).
3. If proceeding: re-invoke the **same** `wowok` call with `env.confirmed = true`.
4. If canceling: do nothing (the operation was never executed).

---

## Semantic Layer

The inner `semantic` field (inside `result.data.semantic`) provides a business-level summary that AI agents can directly understand without parsing raw transaction data. When `semantic` is present, prefer it over raw `result` parsing.

### SemanticSummary

```json
{
  "intent": "publish_service",
  "status": "success",
  "summary": "Successfully published Service my-shop with Machine bound",
  "created": [ ... ],
  "modified": [ ... ],
  "released": [ ... ],
  "events": [ ... ],
  "next_actions": [ ... ],
  "warnings": [ ... ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `intent` | string | Inferred user intent (snake_case, e.g., `publish_service`, `create_order`) |
| `status` | enum | Business-level status: `success`, `partial`, `failed`, `pending_input` |
| `summary` | string | One-sentence human-readable summary of what happened |
| `created` | ObjectRole[] | Objects newly created in this operation |
| `modified` | ObjectRole[] | Objects mutated in this operation |
| `released` | FundRole[] | Fund movements in this operation |
| `events` | EventSemantic[] | On-chain events annotated with business semantics |
| `next_actions` | NextAction[] | Recommended next actions to drive the workflow forward |
| `warnings` | string[] | Business-level warnings |

### ObjectRole

Describes an object with its business role and relationship in the dependency graph.

```json
{
  "id": "0xa1d4...",
  "name": "my-shop",
  "role": "Service",
  "relation": {
    "parent": "0x123...",
    "relation_type": "machine_of"
  },
  "immutable": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Object ID (64-hex with 0x prefix) |
| `name` | string \| null | Local mark name if assigned, else null |
| `role` | enum | Business role: `Permission`, `Guard`, `Machine`, `Progress`, `Service`, `Order`, `Allocation`, `Arbitration`, `ArbCase`, `Messenger`, `Contact`, `Demand`, `Reward`, `Personal`, `Repository`, `Treasury`, `Discount`, `Other` |
| `relation` | object | Relationship to parent object |
| `relation.parent` | string \| null | Parent object ID |
| `relation.relation_type` | enum | `machine_of`, `guard_of`, `allocator_of`, `permission_of`, `progress_of`, `allocation_of`, `arb_of`, `other` |
| `immutable` | boolean | Whether the object has entered an immutable state |

### FundRole

Describes a fund movement with its business role.

```json
{
  "amount": "-10000000000",
  "coinType": "0x2::wow::WOW",
  "role": "payment",
  "from": "0xabc...",
  "to": "0xdef..."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `amount` | string | Amount change as stringified integer (smallest unit). Negative=spend, positive=receive |
| `coinType` | string | Coin type tag (format: `{address}::{module}::{struct}`) |
| `role` | enum | `payment`, `refund`, `change`, `compensation`, `reward`, `gas`, `deposit`, `release`, `other` |
| `from` | string \| null | Sender address if known |
| `to` | string \| null | Recipient address if known |

### EventSemantic

Annotates an on-chain event with business semantics.

```json
{
  "event_type": "0x2::service::ServicePublishedEvent",
  "business_meaning": "Service has been published and is now immutable",
  "category": "lifecycle",
  "related_object": "0x123...",
  "side_effect": "Customers can now place orders against this Service"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `event_type` | string | Raw on-chain event type tag |
| `business_meaning` | string | Human-readable business meaning |
| `category` | enum | `lifecycle`, `state_change`, `fund_flow`, `permission`, `guard`, `other` |
| `related_object` | string | Object ID the event relates to, if extractable |
| `side_effect` | string | Side effect description for AI |

### NextAction

A recommended next action with priority and rationale.

```json
{
  "action": "add sales products",
  "reason": "Service has no products; customers cannot order",
  "tool": "onchain_operations",
  "prerequisite": "Service must be created first",
  "priority": "required"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `action` | string | Recommended next action |
| `reason` | string | Why this action is recommended |
| `tool` | string | Sub-tool to use (passed as `data.tool` in the next `wowok` call), if applicable |
| `prerequisite` | string | Condition that must hold before this action |
| `priority` | enum | `required`, `recommended`, `optional` |

---

## Harness: Verify & Recover Loops (Opt-in)

The Harness is an advanced feature that provides automated Verify and Recover loops. It is opt-in via the `WOWOK_HARNESS_ENABLED=1` environment variable.

When enabled, the MCP server:
1. **Expect Loop** — Pre-declares expected results before executing the operation
2. **Verify Loop** — Compares expected vs actual results across 5 dimensions
3. **Recover Loop** — Generates a recovery strategy when verification fails

### Where the Results Surface

There is **no separate `harness_report` field** — the loop results are folded into the outcome-discriminated payload:

- **`recovery`** (RecoveryAction) — attached by the handler to **every** `outcome: "failed"` payload, regardless of the Harness flag. Consult it before retrying.
- **`diagnosis`** (VerifyReport) — attached to `outcome: "failed"` payloads when an expectation was declared at dispatch. It is the failure-path Verify output and explains the gap between expectation and outcome. Present only when the Harness is enabled.
- For legacy `{status}`-shape sub-tools (not outcome-discriminated), the Recover Loop surfaces its guidance as a non-blocking warning in the response text instead of a structured field.

### VerifyReport

| Field | Type | Description |
|-------|------|-------------|
| `status` | enum | `pass`, `warn`, `fail` — `fail` blocks progress, `warn` is advisory |
| `mismatches` | VerifyMismatch[] | List of mismatches found; empty when status is `pass` |
| `summary` | string | Human-readable summary of the verify result |
| `timestamp` | string | ISO 8601 timestamp when verify ran |

### VerifyMismatch

| Field | Type | Description |
|-------|------|-------------|
| `dimension` | enum | `created`, `modified`, `released`, `state`, `event` |
| `expected` | string | What the Expect Loop declared |
| `actual` | string | What actually happened |
| `severity` | enum | `pass`, `warn`, `fail` — `fail` blocks progress |
| `detail` | string | Human-readable explanation of the mismatch |

### RecoveryAction

| Field | Type | Description |
|-------|------|-------------|
| `strategy` | enum | `retry`, `claim_faucet`, `fill_submission`, `recreate`, `switch_account`, `query_and_retry`, `adjust_params`, `escalate_human`, `stop`, `wait_and_retry` — 10 strategies matching the `error_code` table |
| `should_retry` | boolean | Whether to retry the original operation after applying the strategy |
| `adjusted_params` | object | Suggested parameter adjustments for `adjust_params` strategy |
| `user_prompt` | string | Prompt to show the user when recovery is semi-automatic or manual |
| `max_attempts` | number | Maximum attempts for this error_code type |
| `current_attempt` | number | Current attempt count (1-indexed) |
| `detail` | string | Human-readable explanation of the recovery decision |

---

## How to Process Responses

### Recommended Processing Order

1. **Check `result.status`** — Determine the envelope status (`success`, `pending`, `error`, `schema_mismatch`). `pending` = the operation was NOT executed and needs caller action
2. **If `schema_mismatch`** — Read `schema.input` (and `structured_errors` when present), fix parameters, cache the schema, and retry the `wowok` call
3. **If `error`** — Read `result.errors` and the surfaced `error_code`/`retryable`/`recovery_hint`; follow the recovery guidance
4. **If `success` or `pending`** — Drill into `result.data`:
   - Read `result.data.outcome` first when present (`executed`, `pending_input`, `failed`)
   - Read `result.data.semantic` (if present) for business-level understanding
   - Check `result.data.result.type` (`transaction`, `submission`, `error`, `data`, `null`, `pending_confirmation`)
   - On `failed`: consult `result.data.recovery` (always present) and `result.data.diagnosis` (when present)
   - Fall back to `result.data.result` parsing only when `semantic` is absent

### Schema Mismatch Flow (Self-Correcting)

```
result.status === "schema_mismatch"
  → read result.errors for specific field issues
  → read schema.input (the correct JSON schema for the sub-tool)
  → CACHE the schema in context for future calls to the same sub-tool
  → fix parameters
  → retry wowok({ tool: schema.tool, data: {fixed params} })
```

### Error Handling Flow

```
result.status === "error"
  → read result.errors
  → if result.data.result.type === "error":
      → read error_code
      → check retryable
      → follow recovery_hint
      → if harness_report present, check recovery.strategy
  → retry or escalate as indicated
```

### Guard Submission Flow

```
result.status === "success"
  → result.data.result.type === "submission"
  → read guard[] for required Guards
  → fill submission[] with user data
  → resubmit via call_with_submission
```

---

## Important Notes

⚠️ **Single tool entry point** — The MCP server exposes only one tool (`wowok`). All 17 sub-tools are dispatched via `wowok({ tool, data })`.

⚠️ **Check `result.status` first** — The envelope status (`success`/`error`/`schema_mismatch`) determines the response shape before you look at the inner `result.data`.

⚠️ **Schema mismatches are self-correcting** — On mismatch, the response includes the correct schema; no need to call `schema_query` separately. Cache the schema to avoid repeated mismatches.

⚠️ **Prefer `semantic` over raw parsing** — When `semantic` is present inside `result.data`, it provides business-level understanding that is more reliable than parsing raw transaction data.

⚠️ **Error classification enables programmatic recovery** — Use `error_code` and `retryable` (inside `result.data.result`) to decide whether to retry, adjust parameters, or escalate.

⚠️ **Harness is opt-in** — The `harness_report` field is only present when `WOWOK_HARNESS_ENABLED=1`. When disabled, responses behave exactly as before.

⚠️ **Fund amounts are stringified integers** — `FundRole.amount` uses the smallest unit (e.g., nanowow for WOW tokens) as a string to avoid BigInt serialization issues.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Schema Query](schema-query.md)** | Meta-tool for looking up sub-tool and operation schemas |
| **[Query](query.md)** | Data query toolkit |
| **[Proof](proof.md)** | On-chain proof objects |
| **[Messenger](messenger.md)** | Encrypted messaging system |
| **[Guard](guard.md)** | Trust verification engine |
| **[Service](service.md)** | Marketplace listings |
| **[Machine](machine.md)** | Workflow templates |
