# onchain_operations / demand

Post service requests with reward pools on-chain.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Demand uses `WithPermissionObject`: object shape = CREATE, string = MODIFY.

## Data Schema

```typescript
CallDemand_Data {
  // Object reference - string (existing) or object (create new)
  // See _common.md: WithPermissionObject
  object: WithPermissionObject;
  
  // Recommend Service to Demand
  present?: {
    recommend: string;             // Recommendation text
    by_guard?: string;             // Guard to verify through
    service?: string;              // Service ID or name
  };
  
  description?: string;             // Demand description
  location?: string;                // Demand location
  
  rewards?: ObjectsOp;              // Reward operations
  
  // Service Guard list (discriminated union)
  guards?: {
    op: "add" | "set";
    guard: {
      guard: string;               // Guard object ID
      service_identifier?: number | null; // Service identifier in Guard
    }[];
  } | {
    op: "remove";
    guard: string[];               // Guard IDs/names to remove
  } | {
    op: "clear";
  };
  
  // Feedback on presenters (array — multiple feedback entries)
  feedback?: {
    who: AccountOrMark_Address;    // Presenter's account
    acceptance_score?: number;     // 0-255 acceptance score
    feedback?: string;             // Feedback content
  }[];
  
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, WithPermissionObject, ObjectsOp, AccountOrMark_Address, ReceivedObjectsOrRecently.