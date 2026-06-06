# onchain_operations / treasury

Create secure shared pools for managing deposits, withdrawals, and fund allocation scheduling.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Treasury uses `TypedPermissionObject`: object shape = CREATE, string = MODIFY.

## Data Schema

```typescript
CallTreasury_Data {
  // Object reference - string (existing) or object (create new)
  // See _common.md: TypedPermissionObject
  object: TypedPermissionObject;
  
  description?: string;                     // Treasury description (max 4000 bcs chars)
  
  // Unwrap and deposit received CoinWrappers
  receive?: ReceivedBalanceOrRecently;
  
  // Deposit to Treasury
  deposit?: {
    coin: CoinParam;                        // Asset to deposit
    by_external_deposit_guard?: string;     // Deposit via Guard verification (not Permission)
    payment_info: PaymentInfo;
    namedNewPayment?: NamedObject;          // Name for new Payment object
  };
  
  // Withdraw from Treasury
  withdraw?: {
    amount: 
      | { fixed: string | number }          // Fixed amount (Permission-based)
      | { by_external_withdraw_guard: string }; // Guard-based (amount from Guard index)
    recipient: AccountOrMark_Address;       // Recipient ID or account
    payment_info: PaymentInfo;
    namedNewPayment?: NamedObject;          // Name for new Payment object
  };
  
  // External deposit Guard operations
  external_deposit_guard?: {
    op: "add" | "set";
    guards: AmountFromDepositGuard[];       // Deposit Guard list
  } | {
    op: "remove";
    guards: NameOrAddress[];                // Guard IDs or names to remove
  } | {
    op: "clear";
  };
  
  // External withdraw Guard operations
  external_withdraw_guard?: {
    op: "add" | "set";
    guards: AmountFromWithdrawGuard[];      // Withdraw Guard list
  } | {
    op: "remove";
    guards: NameOrAddress[];                // Guard IDs or names to remove
  } | {
    op: "clear";
  };
  
  owner_receive?: ReceivedObjectsOrRecently;
  um?: NameOrAddress | null;                 // Contact object ID or name
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, TypedPermissionObject, CoinParam, NamedObject, PaymentInfo, AccountOrMark_Address, AmountFromDepositGuard, AmountFromWithdrawGuard, ReceivedBalanceOrRecently, ReceivedObjectsOrRecently.