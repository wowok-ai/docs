# onchain_operations / payment

Token payment (transfer) operations with detailed remarks.

> **Note**: Payment is **CREATE-only** — it issues immutable payment records. No `submission` field.

## Data Schema

```typescript
CallPayment_Data {
  object: TypeNamedObject;             // CREATE new payment object with {name, type_parameter?}
  
  revenue: {
    recipient: AccountOrMark_Address;  // Payment recipient
    amount: CoinParam;                 // Payment amount
  }[];
  
  info: PaymentInfo;                   // Payment record info
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, TypeNamedObject, CoinParam, PaymentInfo, AccountOrMark_Address.