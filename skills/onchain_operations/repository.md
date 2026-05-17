# onchain_operations / repository

Read/write database with consensus field + address as key, strongly-typed data as value.

## Data Schema

```typescript
CallRepository_Data {
  // Object reference - string (existing) or object (create new)
  object: WithPermissionObject;
  
  description?: string;             // Repository description
  
  // Policy rules
  policies?: {
    op: "add" | "set" | "remove" | "clear";
    policy?: {
      name: string;
      type_guard?: string;          // Guard for type validation
      read_guard?: string;          // Guard for read access
      consensus?: boolean;          // Whether consensus required
      write_guard?: string;         // Guard for write access
    }[];
    policy_name?: string[];         // For remove op
  };
  
  // Add data
  data_add?: {
    name: string;
    write_guard?: string;
    data: SupportedValue;
  } | {
    name: string;
    items: {
      data: {
        id: string | number;
        data: SupportedValue;
      }[];
      write_guard?: string;
    }[];
  };
  
  // Remove data
  data_remove?: {
    name: string;
    write_guard?: string;
  } | {
    name: string;
    items: {
      id: (string | number)[];
      write_guard?: string;
    }[];
  };
  
  rewards?: ObjectsOp;              // Reward operations
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, WithPermissionObject, ObjectsOp, ReceivedObjectsOrRecently.