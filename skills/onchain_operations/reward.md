# onchain_operations / reward

Create and manage token rewards with Guards and distribution rules.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Reward uses `TypedPermissionObject`: object shape = CREATE, string = MODIFY.

## Data Schema

```typescript
CallReward_Data {
  // Object reference - string (existing) or object (create new)
  // See _common.md: TypedPermissionObject
  object: TypedPermissionObject;
  
  claim?: string;                          // Guard object ID — verify Guard to trigger reward distribution
  
  description?: string;                    // Reward description
  
  coin_add?: CoinParam;                    // Add amount to Reward object
  
  // Unwrap received CoinWrappers and store in pending balance
  receive?: ReceivedBalanceOrRecently;
  
  guard_add?: RewardGuard[];               // Add Guard to Reward object
  
  guard_remove_expired?: boolean;          // Whether to remove expired Guards
  
  guard_expiration_time?: number | null;   // Expiration time (ms) — blocks new Guard additions until expired
  
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;                      // Contact object
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, TypedPermissionObject, CoinParam, RewardGuard, ReceivedBalanceOrRecently, ReceivedObjectsOrRecently.