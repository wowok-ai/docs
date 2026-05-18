# onchain_operations / Common Types

Shared types referenced by all `onchain_operations` operation types.

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