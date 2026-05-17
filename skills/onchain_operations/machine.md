# onchain_operations / machine

Design and deploy automated workflow templates (Machines) that define how services are delivered.

## Data Schema

```typescript
CallMachine_Data {
  // Object reference - string (existing) or object (create new)
  object: WithPermissionObject;
  
  // Generate new Progress
  progress_new?: {
    task?: string | null;           // Task ID
    repository?: ObjectsOp;         // Repository list
    progress_namedOperator?: {      // Manage namespace operators
      op: "add" | "set" | "remove";
      name: string;
      operators: ManyAccountOrMark_Address;
    };
    namedNew?: NamedObject;         // Name for new Progress
  };
  
  description?: string;             // Machine description
  repository?: ObjectsOp;           // Consensus repositories
  
  // Node operations - TWO MODES (mutually exclusive)
  node?: 
    // Mode 1: Incremental operations
    | {
        op: "add" | "set";
        nodes: MachineNode[];
        bReplace?: boolean;
      }
    | { op: "remove"; nodes: string[] }
    | { op: "clear" }
    | { op: "exchange"; node_one: string; node_other: string }
    | { op: "rename"; node_name_old: string; node_name_new: string }
    | { op: "remove prior node"; pairs: NodeRemovePriorNodeData[] }
    | { op: "add forward"; data: NodeAddForwardData[] }
    | { op: "remove forward"; data: NodeRemoveForwardData[] }
    // Mode 2: Complete replacement from file
    | { json_or_markdown_file: string };
  
  pause?: boolean;                  // Pause new Progress
  publish?: boolean;                // Publish (nodes immutable)
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}

// MachineNode definition
MachineNode {
  name: string;                     // Node name (initial is "")
  pairs: {
    prior_node: string;             // Previous node ("" for entry)
    forwards: {
      name: string;                 // Forward name
      namedOperator?: string;       // Per-Progress namespace
      permissionIndex?: number;     // Shared permission index
      weight: number;               // Forward weight
      guard?: string;               // Optional Guard
    }[];
    threshold?: number;             // Weight threshold
  }[];
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, WithPermissionObject, ObjectsOp, NamedObject, ManyAccountOrMark_Address, ReceivedObjectsOrRecently.