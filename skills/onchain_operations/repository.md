# onchain_operations / repository

Read/write database with consensus field + address as key, strongly-typed data as value.

## Data Schema

```typescript
CallRepository_Data {
  // Object reference - string (existing) or object (create new)
  object: WithPermissionObject;
  
  description?: string;             // Repository description
  
  // Policy rules (discriminated by op)
  policies?: {
    op: "add" | "set";
    policy: PolicyRule[];
  } | {
    op: "remove";
    policy: string[];               // Policy names to remove
  } | {
    op: "clear";
  };
  
  // Add data (discriminated union)
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
  
  // Remove data (discriminated union)
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

### PolicyRule

```typescript
PolicyWriteGuard {
  guard: string;                       // Guard object ID
  id_from_submission?: number;         // Guard table index for data ID (omit = user specifies)
  data_from_submission?: number;       // Guard table index for data value (omit = user specifies)
}

PolicyRule {
  name: string;                        // Policy rule name
  description: string;                 // Policy rule description
  write_guard: PolicyWriteGuard[];     // Guard list for write verification
  quote_guard?: string | null;         // Guard for on-chain quote verification (null = no verification required)
  id_from: 0 | 1 | 2 | "None" | "Clock" | "Signer" | "none" | "clock" | "signer";
                                       // Data ID source: 0/None = user-specified, 1/Clock = timestamp, 2/Signer = signer ID
  value_type: ValueType;               // Type of data value
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, WithPermissionObject, ValueType, ObjectsOp, ReceivedObjectsOrRecently.