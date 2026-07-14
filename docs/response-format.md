

# Response Format Reference (📋 MCP Output Structure)

---

## Component Overview

All WoWok MCP tool responses follow a unified output structure. This document describes the response format for on-chain operations, local operations, and query operations — including the semantic layer, error classification, and optional harness report that enrich responses for AI-driven workflows.

---

## Top-Level Structure

Every MCP tool response contains a `structuredContent` object with the following shape:

```json
{
  "result": { ... },
  "message": "Human-readable summary or hint",
  "semantic": { ... },
  "harness_report": { ... }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `result` | CallResult | Yes | Discriminated union of 5 result types — check `result.type` first |
| `message` | string | Optional | Human-readable summary; always present for error/transaction results |
| `semantic` | SemanticSummary | Optional | Business-level semantic summary; prefer this over raw result parsing |
| `harness_report` | HarnessReport | Optional | Verify + Recover loop report; present only when Harness is enabled |

---

## Result Types (CallResult)

The `result` field is a discriminated union on the `type` field. Always check `result.type` first to determine how to process the response.

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
| `submission` | array | User-submitted data for each Guard; fill these and resubmit via `call_with_submission` |

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

---

## Semantic Layer

The `semantic` field provides a business-level summary that AI agents can directly understand without parsing raw transaction data. When `semantic` is present, prefer it over raw `result` parsing.

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
| `tool` | string | MCP tool to use, if applicable |
| `prerequisite` | string | Condition that must hold before this action |
| `priority` | enum | `required`, `recommended`, `optional` |

---

## Harness Report (Opt-in)

The Harness Report is an advanced feature that provides automated Verify and Recover loops. It is opt-in via the `WOWOK_HARNESS_ENABLED=1` environment variable.

When enabled, the MCP server:
1. **Expect Loop** — Pre-declares expected results before executing the operation
2. **Verify Loop** — Compares expected vs actual results across 5 dimensions
3. **Recover Loop** — Generates a recovery strategy when verification fails

### HarnessReport

```json
{
  "verify": {
    "status": "fail",
    "mismatches": [ ... ],
    "summary": "2 mismatches found: created dimension failed, event dimension warned",
    "timestamp": "2026-07-14T10:30:00.000Z"
  },
  "recovery": {
    "strategy": "claim_faucet",
    "should_retry": true,
    "adjusted_params": { ... },
    "user_prompt": "Please switch to an account with provider permission",
    "max_attempts": 3,
    "current_attempt": 1,
    "detail": "Insufficient balance detected; claim faucet tokens then retry"
  }
}
```

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
| `strategy` | enum | `retry`, `claim_faucet`, `fill_submission`, `recreate`, `switch_account`, `query_and_retry`, `adjust_params`, `escalate_human`, `stop` |
| `should_retry` | boolean | Whether to retry the original operation after applying the strategy |
| `adjusted_params` | object | Suggested parameter adjustments for `adjust_params` strategy |
| `user_prompt` | string | Prompt to show the user when recovery is semi-automatic or manual |
| `max_attempts` | number | Maximum attempts for this error_code type |
| `current_attempt` | number | Current attempt count (1-indexed) |
| `detail` | string | Human-readable explanation of the recovery decision |

---

## How to Process Responses

### Recommended Processing Order

1. **Check `result.type`** — Determine the result variant (`transaction`, `submission`, `error`, `data`, `null`)
2. **Read `semantic` first** (if present) — The semantic summary provides business-level understanding
3. **Check `harness_report`** (if present) — When verify status is `fail`, follow the recovery strategy
4. **Fall back to `result` parsing** — Only when `semantic` is absent

### Error Handling Flow

```
result.type === "error"
  → read error_code
  → check retryable
  → follow recovery_hint
  → if harness_report present, check recovery.strategy
  → retry or escalate as indicated
```

### Guard Submission Flow

```
result.type === "submission"
  → read guard[] for required Guards
  → fill submission[] with user data
  → resubmit via call_with_submission
```

---

## Important Notes

⚠️ **Always check `result.type` first** — The 5 result variants have different fields and require different handling.

⚠️ **Prefer `semantic` over raw parsing** — When `semantic` is present, it provides business-level understanding that is more reliable than parsing raw transaction data.

⚠️ **Error classification enables programmatic recovery** — Use `error_code` and `retryable` to decide whether to retry, adjust parameters, or escalate.

⚠️ **Harness is opt-in** — The `harness_report` field is only present when `WOWOK_HARNESS_ENABLED=1`. When disabled, responses behave exactly as before.

⚠️ **Fund amounts are stringified integers** — `FundRole.amount` uses the smallest unit (e.g., nanowow for WOW tokens) as a string to avoid BigInt serialization issues.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Query](query.md)** | Data query toolkit |
| **[Proof](proof.md)** | On-chain proof objects |
| **[Messenger](messenger.md)** | Encrypted messaging system |
| **[Guard](guard.md)** | Trust verification engine |
| **[Service](service.md)** | Marketplace listings |
| **[Machine](machine.md)** | Workflow templates |
