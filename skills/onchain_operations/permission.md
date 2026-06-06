# onchain_operations / permission

Define who can perform which operations on WoWok objects.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Permission uses `NormalObject`: object shape = CREATE, string = MODIFY.

## Data Schema

```typescript
CallPermission_Data {
  // Object reference - string (existing) or object (create new)
  // See _common.md: NormalObject
  object?: NormalObject;
  
  description?: string;               // Permission description (max 4000 bcs chars)
  
  // Remark operations (discriminated union)
  remark?: {
    op: "set";
    index: number;                    // Permission index (REQUIRED)
    remark: string;                   // Permission remark (REQUIRED)
  } | {
    op: "remove";
    index: number;                    // Permission index (REQUIRED)
  } | {
    op: "clear";
  };
  
  // Permission table operations (discriminated union)
  table?: {
    // Permission-centric: assign ONE permission to MANY entities
    op: "add perm by index" | "set perm by index" | "remove perm by index";
    index: number;                    // Permission index
    entity: ManyAccountOrMark_Address;
  } | {
    // Entity-centric: assign MANY permissions to ONE entity
    op: "add perm by entity" | "set perm by entity" | "remove perm by entity";
    entity: AccountOrMark_Address;
    index: number[];                  // Permission indices
  };
  
  // Advanced entity operations (requires admin)
  entity?: {
    op: "swap" | "replace" | "copy";
    entity1: AccountOrMark_Address;
    entity2: AccountOrMark_Address;
  } | {
    op: "del";
    entity: AccountOrMark_Address;
  };
  
  // Admin management (builder/owner only)
  admin?: {
    op: "add" | "remove" | "set";
    addresses: ManyAccountOrMark_Address;
  };
  
  apply?: NameOrAddress[];            // Object IDs to apply permission to
  builder?: AccountOrMark_Address;    // Set/transfer ownership
  owner_receive?: ReceivedObjectsOrRecently;
  um?: NameOrAddress | null;          // Contact object ID or name
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, NormalObject, AccountOrMark_Address, ManyAccountOrMark_Address, ReceivedObjectsOrRecently.