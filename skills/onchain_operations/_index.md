# onchain_operations / Index

> **Structure**: [Operation Table](#operation-table) · [CREATE vs MODIFY](#create-vs-modify-pattern) · [Top-Level Structure](#top-level-structure) · [Guard Submission](#guard-submission-mechanism) · [Field Execution Order](#field-execution-order) · [Value Types](#value-types)
>
> Common schemas (CallEnv, SubmissionCall, sub-schemas like NamedObject, CoinParam, Recipient, etc.) are in [_common.md](./_common.md).

## Operation Table

16 discriminated operation types. Each links to its schema file.

| operation_type | File | Description |
|---|---|---|
| `service` | [service.md](./service.md) | Create/manage product listings, pricing, discounts, bind workflows, customer purchases via order_new |
| `machine` | [machine.md](./machine.md) | Design/deploy workflow templates with node/forward structures |
| `progress` | [progress.md](./progress.md) | Track active workflows, advance through nodes |
| `repository` | [repository.md](./repository.md) | Consensus database with typed policies and data read/write |
| `arbitration` | [arbitration.md](./arbitration.md) | Transparent on-chain arbitration, dispute/vote/resolve lifecycle |
| `contact` | [contact.md](./contact.md) | On-chain IM contact profiles |
| `treasury` | [treasury.md](./treasury.md) | Team fund management with deposit/withdraw Guard rules |
| `reward` | [reward.md](./reward.md) | Reward pools with Guard-verified claiming |
| `allocation` | [allocation.md](./allocation.md) | Auto-distribution plans to multiple recipients |
| `permission` | [permission.md](./permission.md) | Access control indices for object operations |
| `guard` | [guard.md](./guard.md) | Programmable boolean validation rules (recursive GuardNode tree) |
| `personal` | [personal.md](./personal.md) | PUBLIC on-chain identity — everything permanently visible |
| `payment` | [payment.md](./payment.md) | Irreversible coin transfers to wallets |
| `demand` | [demand.md](./demand.md) | Service request postings with reward pools |
| `order` | [order.md](./order.md) | Order lifecycle: progress, arbitration, refunds, ownership |
| `gen_passport` | [gen_passport.md](./gen_passport.md) | Immutable verified credentials after Guard validation |

---

## CREATE vs MODIFY Pattern

All on-chain object operations use a **unified discriminated pattern** for CREATE vs MODIFY:

```typescript
// CREATE: object is an object with configuration
object: {
  name?: string;           // Optional name for the new object
  tags?: string[];         // Optional tags
  onChain?: boolean;       // Whether to register name on-chain (public)
  replaceExistName?: boolean;  // Force claim existing name
  permission?: DescriptionObject;  // Permission (string or new object)
  type_parameter?: string; // Token type (e.g., "0x2::wow::WOW")
}

// MODIFY: object is a string referencing existing object
object: "<object_name_or_id>"  // Existing object name (local mark) or on-chain ID
```

### Key Rule

| Format | Meaning | Example |
|--------|---------|---------|
| **String** | Reference EXISTING object | `object: "my-service"` or `object: "0x1234..."` |
| **Object** | CREATE NEW object | `object: { name: "my-service", permission: "..." }` |

### Type Mapping

| Type | Used By | CREATE Shape | MODIFY Shape |
|------|---------|--------------|--------------|
| `TypedPermissionObject` | `service`, `arbitration`, `treasury`, `reward` | `{ name?, tags?, onChain?, replaceExistName?, type_parameter, permission? }` | `string` |
| `WithPermissionObject` | `machine`, `repository`, `demand`, `contact` | `{ name?, tags?, onChain?, replaceExistName?, permission? }` | `string` |
| `TypedDescriptionObject` | *(not directly used by operations)* | `{ name?, tags?, onChain?, replaceExistName?, type_parameter }` | `string` |
| `TypeNamedObject` | `allocation` (CREATE), `payment` | `{ name?, tags?, onChain?, replaceExistName?, type_parameter? }` | N/A |
| `DescriptionObject` | `permission` field of other types | `{ name?, tags?, onChain?, replaceExistName?, description? }` | `string` |
| `NormalObject` | `permission` | `{ name?, tags?, onChain?, replaceExistName? }` | `string` |
| `NamedObject` | `namedNew*`, `guard.namedNew` | `{ name?, tags?, onChain?, replaceExistName? }` | N/A |

### Guard Exception

`guard` operation is **CREATE-only** and immutable. Guards cannot be modified after creation. Create new Guard to update logic.

---

## Top-Level Structure

Most operations follow this standard wrapper:

```typescript
OnchainOperations {
  operation_type: string;     // One of 16 types
  data: object;               // Type-specific data (required)
  env?: CallEnv;              // Optional environment
  submission?: SubmissionCall; // Optional Guard submission data
}
```

### Exceptions

| Operation | Structure | Notes |
|-----------|-----------|-------|
| `gen_passport` | `{ guard, info?, env? }` | FLAT — no `data` wrapper, no `submission` |
| `guard` | `{ data, env? }` | No `submission` field |
| `payment` | `{ data, env? }` | No `submission` field |
| `personal` | `{ data, env? }` | No `submission` field |

---

## Guard Submission Mechanism

When calling `onchain_operations`, the tool returns one of the following:

- **Direct Result**: The operation completes immediately. Returns a transaction result, data, or error. No additional steps needed.
- **Submission Required**: Returns `type: "submission"` — the operation triggered a Guard requiring user-provided data. A second call is needed to complete it.

### Direct Result Pattern

Most operations return a direct result when no Guard submission is required:

```
onchain_operations({ operation_type: "<type>", data: { ... } })
→ Returns transaction result or error directly
```

### Submission Required Pattern

When the operation triggers a Guard whose table contains entries with **`b_submission: true`**, the tool does **not** return a transaction result immediately. Instead, it returns a **`type: "submission"`** response containing the Guard's data requirements.

This is the **only scenario** where a second call is required to complete an operation.

**Two-Step Flow**:

```
Step 1 — Initial Call
├── onchain_operations (e.g., service, machine, progress, order, etc.)
└── Response: { type: "submission", ... }
    ├── guard: [{ object, impack }] — Guards requiring verification
    └── submission: [{ guard, submission: [{ identifier, value_type, value?, name }] }]
        ↑ You ONLY fill the `value` field. Do NOT modify other fields.

Step 2 — Re-submit with Completed Data
├── Same operation data (unchanged)
└── Add top-level `submission` field:
    {
      "type": "submission",
      "guard": [{ "object": "guard_name", "impack": true }],
      "submission": [{
        "guard": "guard_name",
        "submission": [
          { "identifier": 0, "value_type": "String", "value": "your_data_here" }
        ]
      }]
    }
```

**Critical Rules**:
- **Only fill `value`**: The template has `identifier`, `value_type`, `name` pre-filled. You ONLY supply the `value` field matching the `value_type`. Never modify `identifier`, `value_type`, or `name`.
- **Value type matching**: `value_type` indicates the expected type (`String`, `Address`, `U64`, `Bool`, etc.). The `value` must match exactly.
- **Impack flag**: `impack: true` means this Guard's result affects the final outcome. All `impack=true` Guards must pass for the operation to proceed.
- **All fields required**: Fill every entry in the `submission` array. Incomplete submission data causes a validation error.
- **Do not change other fields**: The `data` and `env` portions of the original call must remain identical.

**Common Submission Scenarios**:
- **Merkle Root proof**: `value_type: "String"`, value = hex string.
- **Progress/Order address**: `value_type: "Address"`, value = object name or ID.

---

## Field Execution Order

**Rule**: Schema field order determines execution order, regardless of JSON field order.

**AI Guidelines**:
1. Check schema field order against user's intended operation sequence
2. If schema order conflicts with intent, split into multiple sequential calls
3. When uncertain, use incremental steps rather than single batch operation

---

## Value Types

All Guard `value_type` fields and `GuardTableItem.value_type` use these types:

| Type | ID | Description |
|------|-----|-------------|
| Bool | 0 | Boolean true/false |
| Address | 1 | Object or account address |
| String | 2 | UTF-8 string |
| U8 | 3 | 8-bit unsigned integer |
| U16 | 4 | 16-bit unsigned integer |
| U32 | 5 | 32-bit unsigned integer |
| U64 | 6 | 64-bit unsigned integer |
| U128 | 7 | 128-bit unsigned integer |
| U256 | 8 | 256-bit unsigned integer |
| VecBool | 9 | Vector of booleans |
| VecAddress | 10 | Vector of addresses |
| VecString | 11 | Vector of strings |
| VecU8 | 12 | Vector of U8 |
| VecU16 | 13 | Vector of U16 |
| VecU32 | 14 | Vector of U32 |
| VecU64 | 15 | Vector of U64 |
| VecU128 | 16 | Vector of U128 |
| VecU256 | 17 | Vector of U256 |
| VecVecU8 | 18 | Vector of VecU8 |