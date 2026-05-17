# onchain_operations / treasury

Create and manage treasury for team funds with deposit/withdrawal rules.

## Data Schema

```typescript
CallTreasury_Data {
  // Object reference - string (existing) or object (create new)
  object: TypedPermissionObject;
  
  description?: string;             // Treasury description
  receive?: ReceivedBalanceOrRecently; // Receive CoinWrapper
  
  // Deposit funds
  deposit?: {
    coin: CoinParam;
    by_external_deposit_guard?: string;
    payment_info: {
      remark?: string;
      index?: number;
    };
    namedNewPayment?: NamedObject;
  };
  
  // Withdraw funds
  withdraw?: {
    amount: { fixed: number } | { by_external_withdraw_guard: string };
    recipient: AccountOrMark_Address;
    payment_info: {
      remark?: string;
      index?: number;
    };
    namedNewPayment?: NamedObject;
  };
  
  // External deposit Guards (discriminated union)
  external_deposit_guard?: {
    op: "add" | "set";
    guards: {                      // Array of Guard configs (REQUIRED for add/set)
      guard: string;               // Guard object ID or name
      identifier?: number | null;  // Guard table index for deposit amount limit (null = unlimited)
      store_from_id?: number | null; // Guard table index for record storage
    }[];
  } | {
    op: "remove";
    guards: string[];              // Guard IDs/names to remove (REQUIRED)
  } | {
    op: "clear";
  };
  
  // External withdraw Guards (discriminated union)
  external_withdraw_guard?: {
    op: "add" | "set";
    guards: {                      // Array of Guard configs (REQUIRED for add/set)
      guard: string;               // Guard object ID or name
      identifier?: number | null;  // Guard table index for withdrawal amount limit (null = unlimited)
      store_from_id?: number | null; // Guard table index for record storage
    }[];
  } | {
    op: "remove";
    guards: string[];              // Guard IDs/names to remove (REQUIRED)
  } | {
    op: "clear";
  };
  
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, TypedPermissionObject, CoinParam, NamedObject, AccountOrMark_Address, ReceivedBalanceOrRecently, ReceivedObjectsOrRecently.