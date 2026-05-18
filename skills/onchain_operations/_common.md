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

## CallEnv

```typescript
CallEnv {
  account?: string;              // Operating account (empty = default)
  permission_guard?: string[];   // Permission Guard ID list
  no_cache?: boolean;            // Disable cache
  network?: "localnet" | "testnet"; // Target network
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

### NamedObject

```typescript
NamedObject {
  name?: string;            // Object name (max 64 bcs chars, must not start with '0x')
  tags?: string[];           // Tags for discoverability
  onChain?: boolean;         // Register name on-chain (public)
  replaceExistName?: boolean; // Force claim existing name
}
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

### TypeNamedObject

```typescript
TypeNamedObject = 
  | string                           // Existing object ID or name
  | {
      name?: string;
      tags?: string[];
      onChain?: boolean;
      replaceExistName?: boolean;
      type_parameter?: string;           // Token type (default: "0x2::wow::WOW")
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

### TypedDescriptionObject

```typescript
TypedDescriptionObject = 
  | string                           // Existing object ID or name
  | {
      name?: string;
      tags?: string[];
      onChain?: boolean;
      replaceExistName?: boolean;
      type_parameter?: string;           // Token type (default: "0x2::wow::WOW")
    };
```

### CoinParam

```typescript
CoinParam = 
  | { balance: string | number }     // Amount (can include unit like "10WOW")
  | { coin: string };                // Specific coin object ID
```

### ObjectsOp

```typescript
ObjectsOp = 
  | {
      op: "add" | "set";
      objects: string[];             // List of object IDs or names
    }
  | {
      op: "remove";
      objects: string[];             // List of object IDs or names to remove
    }
  | {
      op: "clear";
    };
```

### AccountOrMark_Address

```typescript
AccountOrMark_Address {
  name_or_address?: string;       // Account name, address (0x...), or mark name
  local_mark_first?: boolean;     // Prioritize local marks first
}
```

### ManyAccountOrMark_Address

```typescript
ManyAccountOrMark_Address {
  entities: AccountOrMark_Address[];  // Batch of account/address lookups
  check_all_founded?: boolean;        // Abort if any ID not found
}
```

### GuardTableItem

```typescript
GuardTableItem {
  identifier: number;             // 0-255
  b_submission: boolean;          // Whether user submission is required
  value_type: ValueType;          // Expected type
  value?: SupportedValue;         // Default value (if b_submission=false)
  name: string;                   // Description (default: "")
}

// Note: GuardTableItem may also include:
//   object_type?: ObjectType;    // Object type when value is Address
```

### Recipient

```typescript
Recipient = 
  | { GuardIdentifier: number }           // Get recipient from Guard table index
  | { Entity: AccountOrMark_Address }     // Explicit entity ID
  | { Signer: "signer" };                 // Current transaction signer
```

### Amount

```typescript
Amount = 
  | {
      type: "GuardU64Identifier";
      value: number;              // Guard table identifier (0-255) for u64 amount
    }
  | {
      type: "Fixed";
      value: string | number;     // Fixed amount value
    };
```

### PaymentInfo

```typescript
PaymentInfo {
  for_object?: string | null;     // Payment for a specific object ID
  for_guard?: string | null;      // Payment to satisfy Guard verification
  remark: string;                 // Payment record remark
  index: string | number;         // Payment record index
}
```

### ServiceSale

```typescript
ServiceSale {
  name: string;                   // Product or service name
  price: string | number;         // Price
  stock: string | number;         // Stock quantity
  suspension: boolean;            // Whether suspended
  wip: string;                    // HTTP URL of WIP file
  wip_hash: string;               // WIP file hash (empty = auto-use WIP hash)
}
```

### ServiceBuyItem

```typescript
ServiceBuyItem {
  name: string;                   // Product or service name
  stock: string | number;         // Quantity to purchase
  wip_hash: string;               // WIP file hash of the item
}
```

### Discount

```typescript
Discount {
  name: string;                       // Discount name
  discount_type: 0 | 1;               // 0 = RATES (percentage), 1 = FIXED
  discount_value: string | number;    // Discount value
  benchmark?: number | string;        // Minimum amount for discount to apply
  time_ms_start?: number;             // Start time (milliseconds)
  time_ms_end?: number;               // End time (milliseconds)
  count?: number;                     // Usage count limit
  recipient: ManyAccountOrMark_Address; // Recipient specification
  transferable?: boolean;             // Whether recipient can transfer
}
```

### ServiceGuard

```typescript
ServiceGuard {
  guard: string;                                  // Guard object ID
  service_identifier?: number | null;              // Guard table identifier for service
}
```

### RewardGuard

```typescript
RewardGuard {
  guard: string;                              // Guard object ID or name
  recipient: Recipient;                       // Who receives the reward
  amount: Amount;                             // Reward amount
  expiration_time?: number;                   // Expiration time (ms)
  store_from_id?: number | null;              // Guard table index for record storage
}
```

### AmountFromDepositGuard

```typescript
AmountFromDepositGuard {
  guard: string;                      // Guard object ID or name
  identifier?: number | null;         // Guard table index for deposit amount limit (null = unlimited)
  store_from_id?: number | null;      // Guard table index for record storage
}
```

### AmountFromWithdrawGuard

```typescript
AmountFromWithdrawGuard {
  guard: string;                      // Guard object ID or name
  identifier: number;                 // Guard table index for withdrawable amount
  store_from_id?: number | null;      // Guard table index for record storage
}
```

### VotingGuard / VoteWeight

```typescript
VoteWeight = 
  | { GuardIdentifier: number }           // Voting weight from Guard table index
  | { FixedValue: number };               // Fixed voting weight (0-65535)

VotingGuard {
  guard: string;                    // Voting Guard object ID
  vote_weight: VoteWeight;          // Voting weight configuration
}
```

### AllocationSharing

```typescript
AllocationSharing {
  who: Recipient;                   // Recipient specification
  sharing: string | number;         // Allocation amount or rate
  mode: "Amount" | "Rate" | "Surplus"; // Allocation mode
}
```

### Allocator

```typescript
Allocator {
  guard: string;                        // Guard object ID — allocation triggers on verify
  sharing: AllocationSharing[];         // Fund allocation items
  fix?: string | number;                // Fixed amount per recipient
  max?: string | number | null;         // Maximum allocation amount
}
```

### Allocators

```typescript
Allocators {
  description: string;              // Allocator list description
  threshold: string | number;       // Trigger threshold
  allocators: Allocator[];          // Fund allocator list
}
```

### ReceivedBalanceOrRecently

```typescript
ReceivedBalanceOrRecently = 
  | {
      balance: string | number;  // Balance amount
      token_type: string;        // Token type (e.g., "CoinWrapper<0x2::wow::WOW>")
      received: {
        id: string;              // Received CoinWrapper object ID
        balance: string | number; // Amount
        payment: string;         // Payment object ID
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
  | {
      balance: string | number;
      token_type: string;
      received: { id: string; balance: string | number; payment: string; }[];
    }
  | "recently";
```

### QueryReceivedResult

```typescript
QueryReceivedResult {
  result: 
    | {
        balance: string | number;
        token_type: string;
        received: { id: string; balance: string | number; payment: string; }[];
      }
    | {
        id: string;
        type: string;
        content_raw?: any;
      }[];
}
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