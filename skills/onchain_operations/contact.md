# onchain_operations / contact

Create Contact objects linking social signals to on-chain rewards.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Contact uses `WithPermissionObject`: object shape = CREATE, string = MODIFY.

## Data Schema

```typescript
CallContact_Data {
  // Object reference - string (existing) or object (create new)
  // See _common.md: WithPermissionObject
  object: WithPermissionObject;
  
  my_status?: string;                    // Set your status message in this contact list (max 64 bcs chars)
  description?: string;                  // Contact object description or public information (max 4000 bcs chars)
  location?: string;                     // Physical or virtual location information (max 256 bcs chars)
  
  // IM contact list operations (discriminated union)
  ims?: {
    op: "add" | "set";
    im: {
      at: NameOrAddress;                 // Contact address or name for IM
      description?: string;              // Optional description (max 256 bcs chars)
    }[];
  } | {
    op: "remove";
    im: NameOrAddress[];                 // Contact addresses or names to remove
  } | {
    op: "clear";
  };
  
  owner_receive?: ReceivedObjectsOrRecently;
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, WithPermissionObject, ReceivedObjectsOrRecently.