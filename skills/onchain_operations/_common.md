# onchain_operations / Common Schemas

Shared type definitions referenced by all `onchain_operations` operation types. For design principles, execution rules, Guard submission workflow, and Value Types, see [_index.md](./_index.md).

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