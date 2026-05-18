# onchain_operations / progress

Track and manage active workflows in real-time.

> **Note**: Progress is **MODIFY-only** — Progress objects are created via `machine.progress_new`, not directly.

## Data Schema

```typescript
CallProgress_Data {
  object: string;                     // Progress ID or name (required) — MODIFY only
  
  task?: string;                      // Task ID (cannot be changed after setting)
  repository?: ObjectsOp;             // Context repositories
  
  // Manage namespace operators
  progress_namedOperator?: {
    op: "add" | "set" | "remove";
    name: string;                     // Namespace name (non-empty)
    operators: ManyAccountOrMark_Address;
  };
  
  // Advance workflow
  operate?: {
    operation: {
      next_node_name: string;         // Target node name
      forward: string;                // Forward (operation) name
    };
    hold?: boolean;                   // Lock operation permission
    adminUnhold?: boolean;            // Allow admin to force unlock
    message?: string;                 // Operation note
  };
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, ObjectsOp, ManyAccountOrMark_Address.