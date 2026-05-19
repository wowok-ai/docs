# onchain_operations / allocation

Define token distribution plans with payment scheduling and Guard-triggered distribution.

> **Schema**: `CallAllocation_Data` is a **union** of two variants — CREATE or OPERATE.

## Data Schema

```typescript
CallAllocation_Data = 
  // CREATE: Create a new Allocation object
  | {
      object: TypeNamedObject;         // CREATE with {name, type_parameter?}
      allocators: Allocators;          // Fund allocator rules
      coin: CoinParam;                 // Asset to allocate
      payment_info: PaymentInfo;       // Payment record info
    }
  // OPERATE: Operate on existing Allocation object
  | {
      object: NameOrAddress;                  // Allocation object ID or name
      received_coins?: ReceivedBalanceOrRecently;  // Unwrap received CoinWrappers into pending balance
      alloc_by_guard?: NameOrAddress;    // Verify Guard and execute fund allocation
    };
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, TypeNamedObject, Allocators, CoinParam, PaymentInfo, ReceivedBalanceOrRecently.