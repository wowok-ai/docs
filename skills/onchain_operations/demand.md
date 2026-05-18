# onchain_operations / demand

Create and manage Demand objects for service procurement with Guard validation.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Demand uses `WithPermissionObject`: object shape = CREATE, string = MODIFY.

## Data Schema

```typescript
CallDemand_Data {
  // Object reference - string (existing) or object (create new)
  // See _common.md: WithPermissionObject
  object: WithPermissionObject;
  
  // Recommend a Service to the Demand
  present?: {
    recommend: string;                   // Recommendation description
    by_guard?: string;                   // Guard ID — pass verification via Guard
    service?: string;                    // Service ID or name to present
  };
  
  description?: string;                  // Demand description
  location?: string;                     // Service location
  
  rewards?: ObjectsOp;                   // Reward information
  
  // User feedback
  feedback?: {
    who: AccountOrMark_Address;          // User being rated
    acceptance_score?: number;           // Acceptance score (0-255)
    feedback?: string;                   // Feedback content
  }[];
  
  // Validation Guards (discriminated union)
  guards?: {
    op: "add" | "set";
    guard: ServiceGuard[];               // Guard configs to add/set
  } | {
    op: "remove";
    guard: string[];                     // Guard IDs or names to remove
  } | {
    op: "clear";
  };
  
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;                    // Contact object
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, WithPermissionObject, ObjectsOp, ServiceGuard, AccountOrMark_Address, ReceivedObjectsOrRecently.