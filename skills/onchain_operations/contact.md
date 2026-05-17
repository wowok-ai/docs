# onchain_operations / contact

Manage on-chain instant messaging contact profiles.

## Data Schema

```typescript
CallContact_Data {
  // Object reference - string (existing) or object (create new)
  object: WithPermissionObject;
  
  my_status?: string;               // Status message
  description?: string;             // Contact description
  location?: string;                // Location
  
  // IM contact list (discriminated union)
  ims?: {
    op: "add" | "set";
    im: {                           // Contact entries
      at: string;                   // IM address
      description?: string;         // Optional note
    }[];
  } | {
    op: "remove";
    im: string[];                   // Addresses/names to remove
  } | {
    op: "clear";
  };
  
  owner_receive?: ReceivedObjectsOrRecently;
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, WithPermissionObject, ReceivedObjectsOrRecently.