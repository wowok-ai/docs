# onchain_operations / progress

Track and manage active workflows in real-time.

> **Note**: Progress is **MODIFY-only** — Progress objects are created via `machine.progress_new`, not directly.

## Data Schema

```typescript
CallProgress_Data {
  object: string;                   // Progress ID or name (required) — MODIFY only
  task?: string | null;             // Target task ID
  repository?: ObjectsOp;           // Context repositories
  
  // Manage namespace operators
  progress_namedOperator?: {
    op: "add" | "set" | "remove";
    name: string;
    operators: ManyAccountOrMark_Address;
  };
  
  // Advance workflow
  operate?: {
    operation: {
      next_node_name: string;       // Target node
      forward: string;              // Forward name
    };
    hold?: boolean;                 // Lock permission
    adminUnhold?: boolean;          // Allow admin unlock
    message?: string;               // Operation note
  };
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, ObjectsOp, ManyAccountOrMark_Address.