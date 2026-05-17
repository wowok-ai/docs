# onchain_operations / allocation

Create distribution plans to auto-distribute funds to multiple recipients.

## Data Schema

```typescript
// Allocation has TWO modes — discriminated by object format

// MODE 1: Create a new Allocation with allocators
CallAllocation_Create {
  object: {
    name?: string;                 // Object name
    tags?: string[];               // Tags
    onChain?: boolean;             // Public on-chain name
    replaceExistName?: boolean;    // Force claim name
    type_parameter?: string;       // Token type (default: "0x2::wow::WOW")
  };
  allocators: {
    description: string;           // Allocator list description
    threshold: number;             // Trigger threshold
    allocators: {
      guard: string;               // Guard object ID — allocation triggers on verify
      sharing: {
        who: Recipient;            // Recipient specification
        sharing: number;           // Amount or rate
        mode: "Amount" | "Rate" | "Surplus";
      }[];
      fix?: number;                // Fixed amount per recipient
      max?: number | null;         // Maximum allocation amount
    }[];
  };
  coin: CoinParam;                 // Initial funding
  payment_info: {
    remark?: string;
    index?: number;
  };
}

// MODE 2: Operate existing Allocation
CallAllocation_Operate {
  object: string;                  // Allocation object ID or name (required)
  received_coins?: ReceivedBalanceOrRecently; // Unwrap CoinWrapper
  alloc_by_guard?: string;         // Verify Guard and trigger allocation
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, CoinParam, Recipient, ReceivedBalanceOrRecently.