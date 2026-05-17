# onchain_operations / reward

Create reward pools and set claim conditions by Guard verification.

## Data Schema

```typescript
CallReward_Data {
  // Object reference - string (existing) or object (create new)
  object: TypedPermissionObject;
  
  claim?: string;                   // Guard object ID for claiming
  description?: string;             // Reward description
  coin_add?: CoinParam;             // Add funds
  receive?: ReceivedBalanceOrRecently; // Unwrap CoinWrapper
  
  // Add reward Guards (each specifies a claim condition)
  guard_add?: {
    guard: string;                  // Guard object ID to verify
    recipient: Recipient;           // Who receives reward
    amount: {                       // Amount (discriminated union)
      type: "GuardU64Identifier";
      value: number;                // Identifier 0-255 in Guard table
    } | {
      type: "Fixed";
      value: number;                // Fixed amount
    };
    expiration_time?: number;       // Expiration timestamp (ms)
    store_from_id?: number | null;  // Guard table storage identifier
  }[];
  
  guard_remove_expired?: boolean;   // Remove expired Guards
  guard_expiration_time?: number | null; // Lock adding new Guards until this time (ms)
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, TypedPermissionObject, CoinParam, ReceivedBalanceOrRecently, ReceivedObjectsOrRecently, Recipient.