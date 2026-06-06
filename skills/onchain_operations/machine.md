# onchain_operations / machine

Design and deploy automated workflow templates (Machines) that define how services are delivered.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Machine uses `WithPermissionObject`: object shape = CREATE, string = MODIFY.

## Data Schema

```typescript
CallMachine_Data {
  // Object reference - string (existing) or object (create new)
  // See _common.md: WithPermissionObject
  object: WithPermissionObject;
  
  // Generate new Progress
  progress_new?: {
    task?: string | null;             // Task ID bound to Progress
    repository?: ObjectsOp;           // Repository list
    progress_namedOperator?: {        // Manage namespace operators
      op: "add" | "set" | "remove";
      name: string;                   // Namespace name (non-empty)
      operators: ManyAccountOrMark_Address;
    };
    namedNew?: NamedObject;           // Name for new Progress
  };
  
  description?: string;               // Machine description
  repository?: ObjectsOp;             // Consensus repositories
  
  // Node operations - TWO MODES (mutually exclusive)
  node?: 
    // Mode 1: Incremental operations
    | {
        op: "add" | "set";
        nodes: MachineNode[];         // Node array
        bReplace?: boolean;           // Whether to replace existing
      }
    | { op: "remove"; nodes: string[] }       // Node names to delete
    | { op: "clear" }
    | { op: "exchange"; node_one: string; node_other: string } // Swap two nodes
    | { op: "rename"; node_name_old: string; node_name_new: string } // Rename node
    | { op: "remove prior node"; pairs: { prior_node_name: string[]; node_name: string; }[] } // Delete prev→next pairs
    | { op: "add forward"; data: {
        prior_node_name: string;      // Previous node name
        node_name: string;            // Next node name
        forward: {
          name: string;               // Operation name
          namedOperator?: string | null;     // Per-Progress namespace operator (null or empty "" = order permission)
          permissionIndex?: number | null;   // Shared permission index
          weight: number;             // Forward weight (0-65535)
        }[];
        threshold?: number | null;    // Weight threshold (int >= 0)
      }[] }
    | { op: "remove forward"; data: {
        prior_node_name: string;
        node_name: string;
        forward_name: string[];       // Operation names to delete
      }[] }
    // Mode 2: Complete replacement from file
    | { json_or_markdown_file: string };
  
  pause?: boolean;                    // Pause new Progress
  publish?: boolean;                  // Publish (nodes immutable after)
  owner_receive?: ReceivedObjectsOrRecently;
  um?: NameOrAddress | null;          // Contact object ID or name
}

// MachineNode definition (referenced by node operations)
// For the canonical MachineNodeNodeSchema, see MCP source at src/schema/query
MachineNode {
  name: string;                       // Node name
  pairs: {
    prior_node: string;               // Previous node name ("" for entry)
    forwards: {
      name: string;                   // Forward name
      namedOperator?: string;         // Per-Progress namespace
      permissionIndex?: number;       // Shared permission index
      weight: number;                 // Forward weight
      guard?: MachineForwardGuard;    // { guard: string; retained_submission?: number[] }
    }[];
    threshold?: number;               // Weight threshold (null = any single forward triggers)
  }[];
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, WithPermissionObject, NamedObject, ObjectsOp, ManyAccountOrMark_Address, ReceivedObjectsOrRecently.