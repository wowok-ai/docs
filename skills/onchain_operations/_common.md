# onchain_operations / Common Types

Shared types referenced by all `onchain_operations` operation types.

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
| `TypedPermissionObject` | `service`, `treasury` | `{ name?, tags?, permission?, type_parameter }` | `string` |
| `WithPermissionObject` | `machine`, `reward`, `arbitration`, `repository`, `demand`, `contact` | `{ name?, tags?, permission? }` | `string` |
| `DescriptionObject` | `permission` | `{ name?, tags?, description? }` | `string` |
| `NormalObject` | `permission` | `{ name?, tags? }` | `string` |

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

| Order | Fields | Purpose |
|-------|--------|---------|
| 1 | `object` | Create or resolve reference |
| 2 | `description`, `location` | Metadata |
| 3 | `permission`, `repository` | Structural bindings |
| 4 | `node`, `sales`, `rewards` | Runtime behavior |
| 5 | `publish` | Finalize (immutable after) |
| 6 | `owner_receive` | Fund transfers |

**AI Guidelines**:
1. Check schema field order against user's intended operation sequence
2. If schema order conflicts with intent, split into multiple sequential calls
3. When uncertain, use incremental steps rather than single batch operation

## CallEnv

```typescript
CallEnv {
  account?: string;              // Operating account (empty = default)
  permission_guard?: string[];   // Permission Guard ID list
  no_cache?: boolean;            // Disable cache
  network?: "localnet" | "testnet" ; // Target network
  referrer?: string;             // Referrer ID
}
```

## SubmissionCall

```typescript
SubmissionCall {
  type: "submission";
  guard: {
    object: string;    // Guard object name or ID
    impack: boolean;   // Whether affects final outcome
  }[];
  submission: {
    guard: string;     // Guard object name or ID
    submission: {
      identifier: number;        // 0-255
      b_submission: boolean;     // Whether user submission is required
      value_type: ValueType;     // Expected type
      value?: SupportedValue;    // User-provided value (optional)
      name: string;              // Name/description (default: "")
      object_type?: ObjectType;  // Object type when value is Address
    }[];
  }[];
}
```

---

## Common Sub-Schemas

### TypedPermissionObject

```typescript
TypedPermissionObject = 
  | string                          // Object ID or name (existing)
  | {
      name?: string;                // Name for new object
      tags?: string[];              // Tags for discoverability
      onChain?: boolean;            // Register name on-chain
      replaceExistName?: boolean;   // Force claim existing name
      type_parameter: string;       // Token type parameter (default: "0x2::wow::WOW")
      permission?: DescriptionObject;  // Permission for the new object
    };
```

### WithPermissionObject

```typescript
WithPermissionObject = 
  | string                           // Existing object ID or name
  | {
      name?: string;
      tags?: string[];
      onChain?: boolean;
      replaceExistName?: boolean;
      permission?: DescriptionObject;
    };
```

### DescriptionObject

```typescript
DescriptionObject = 
  | string                           // Existing object ID or name
  | {
      name?: string;
      tags?: string[];
      onChain?: boolean;
      replaceExistName?: boolean;
      description?: string;
    };
```

### NormalObject

```typescript
NormalObject = 
  | string                           // Existing object ID or name
  | {
      name?: string;
      tags?: string[];
      onChain?: boolean;
      replaceExistName?: boolean;
    };
```

### NamedObject

```typescript
NamedObject {
  name?: string;
  tags?: string[];
  onChain?: boolean;
  replaceExistName?: boolean;
}
```

### CoinParam

```typescript
CoinParam = 
  | { balance: string | number }     // Amount (can include unit like "10WOW")
  | { coin: string };                // Specific coin object ID
```

### ObjectsOp

```typescript
ObjectsOp = {
  op: "add" | "set" | "remove";
  objects: string[];
} | {
  op: "clear";
};
```

### AccountOrMark_Address

```typescript
AccountOrMark_Address = {
  name_or_address?: string;
  local_mark_first?: boolean;
};
```

### ManyAccountOrMark_Address

```typescript
ManyAccountOrMark_Address = {
  entities: AccountOrMark_Address[];
  check_all_founded?: boolean;
};
```

### ReceivedBalanceOrRecently

```typescript
ReceivedBalanceOrRecently = 
  | {
      balance: string | number;  // Balance amount
      token_type: string;        // Token type
      received: {                // Unwrapped coin objects
        id: string;              // CoinWrapper object ID
        balance: string | number; // Amount
        payment: string;         // Info string, usually the payment object ID @any
      }[];
    }
  | "recently";                  // Shortcut: automatically unwrap most recently received CoinWrapper
```

### ReceivedObjectsOrRecently

```typescript
ReceivedObjectsOrRecently = 
  | {
      id: string;                // Object ID
      type: string;              // Object type
      content_raw?: any;         // Raw content (optional)
    }[]
  | ReceivedBalanceOrRecently;   // Or: empty/clear then receive CoinWrapper objects
```

---

## Value Types

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

---

### Recipient
Used by `service` (order allocators), `reward` (guard recipients), and `allocation` (who field).

```typescript
Recipient =
  | { GuardIdentifier: number }
  | { Entity: AccountOrMark_Address }
  | { Signer: "signer" }
```