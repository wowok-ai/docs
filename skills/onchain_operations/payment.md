# onchain_operations / payment

Send instant, irreversible coin transfers to any wallet address.

> **Note**: Payment is **CREATE-only** and immutable — Payments cannot be modified after creation.

## Data Schema

```typescript
CallPayment_Data {
  // Object reference — CREATE only (Payment is immutable)
  object: {
    name?: string;                 // Object name
    tags?: string[];               // Tags
    onChain?: boolean;             // Public on-chain name
    replaceExistName?: boolean;    // Force claim name
    type_parameter?: string;       // Token type (default: "0x2::wow::WOW")
  };
  
  revenue: {                       // Array of payment recipients
    recipient: AccountOrMark_Address; // Who receives payment
    amount: CoinParam;             // Payment amount
  }[];
  
  info: {                          // Payment metadata
    remark?: string;               // Payment remark
    index?: number;                // Payment index
  };
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, CoinParam, AccountOrMark_Address.