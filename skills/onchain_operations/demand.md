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
    recommend: string;                   // Recommendation description (max 4000 bcs chars)
    by_guard?: NameOrAddress;            // Guard ID — pass verification via Guard
    service?: NameOrAddress;             // Service ID or name to present
  };
  
  description?: string;                  // Demand description (max 4000 bcs chars)
  location?: string;                     // Service location (max 256 bcs chars)
  
  rewards?: ObjectsOp;                   // Reward information
  
  // User feedback
  feedback?: {
    who: AccountOrMark_Address;          // User being rated
    acceptance_score?: number;           // Acceptance score (0-255)
    feedback?: string;                   // Feedback content (max 4000 bcs chars)
  }[];
  
  // Validation Guards (discriminated union)
  guards?: {
    op: "add" | "set";
    guard: ServiceGuard[];               // Guard configs to add/set
  } | {
    op: "remove";
    guard: NameOrAddress[];              // Guard IDs or names to remove
  } | {
    op: "clear";
  };
  
  owner_receive?: ReceivedObjectsOrRecently;
  um?: NameOrAddress | null;           // Contact object
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, WithPermissionObject, ObjectsOp, ServiceGuard, AccountOrMark_Address, ReceivedObjectsOrRecently.