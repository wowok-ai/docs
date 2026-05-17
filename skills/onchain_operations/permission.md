# onchain_operations / permission

Define who can perform which operations on WoWok objects.

## Data Schema

```typescript
CallPermission_Data {
  // Object reference - string (existing) or object (create new)
  object?: NormalObject;
  
  description?: string;             // Permission description
  
  // Permission table operations
  table?: {
    op: "add perm by index" | "set perm by index" | "remove perm by index";
    index: number;                  // Permission index
    entity: ManyAccountOrMark_Address;
  } | {
    op: "add perm by entity" | "set perm by entity" | "remove perm by entity";
    entity: AccountOrMark_Address;
    index: number[];
  };
  
  // Remark operations
  remark?: {
    op: "set" | "remove" | "clear";
    index?: number;
    remark?: string;
  };
  
  apply?: string[];                 // Objects to apply permission to
  builder?: AccountOrMark_Address;  // Set/transfer ownership
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, NormalObject, AccountOrMark_Address, ManyAccountOrMark_Address, ReceivedObjectsOrRecently.