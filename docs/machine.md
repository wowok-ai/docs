# Machine Component (⚙️ Workflow Templates)

---

## Component Overview

The Machine component is WoWok's workflow automation engine, used to design and deploy automated workflow templates that define how services are delivered. Machines consist of nodes (workflow states) and forwards (operations that move the workflow forward), with permission checks and optional Guard validations.

> **Note**: Use the `machineNode2file` tool (see [Sub-feature 19](#sub-feature-19-export-node-definitions-with-machinenode2file)) to export existing Machine node definitions from the blockchain to a JSON or Markdown file for editing and reuse. Pair with [Sub-feature 11](#sub-feature-11-complete-node-replacement-via-file-json_or_markdown_file) to quickly build new workflows from existing ones.

### Permission Index Guide for Forward Operations

When defining forward operations in Machine nodes, the `permissionIndex` field specifies who can execute that forward. **Important**: The permission index for forward operations is NOT the same as Machine management permissions (200-208).

**Valid permissionIndex values for forward operations:**

1. **User-defined permissions (1000-65535)** - Recommended for business-specific workflow operations
   - Must be granted to operators via the Permission component before use
   - Each Progress instance shares the same operators
   - Example: Use 1000 for "confirm_order", 1001 for "deliver_goods"

2. **Built-in permissions (100-450+)** - Use appropriate built-in permissions for common operations
   - Repository: 100-105 (repository.new, repository.description, etc.)
   - Reward: 150-157 (reward.new, reward.description, etc.)
   - Service: 300-320 (service.new, service.description, etc.)
   - And more...

**NOT for forward operations:**
- Machine management permissions (200-208): These control Machine object operations (create, modify nodes, publish), NOT workflow transitions
- Progress management permissions (220-225): These control Progress object operations, NOT workflow transitions

**Alternative to permissionIndex:**
- Use `namedOperator` instead of `permissionIndex` for Progress-specific operator assignments
- Each Progress instance can have different operators for the same namedOperator namespace

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Object Management** | Reference or create Machine objects | Initialize workflow templates, reference existing workflows | Foundation for all Machine operations - defines which workflow to modify |
| **Set Description** | Add or update Machine description | Document workflow purpose, business rules | Improves workflow discoverability and maintainability |
| **Repository Management** | Attach or detach Repository objects | Store workflow-related data, configuration | Enables data persistence and sharing across workflow instances |
| **Node Operations** | Add/modify/remove/clear workflow nodes | Design workflow state transitions | Core of workflow design - defines the states and connections |
| **Node File Replacement** | Complete node replacement from file | Bulk updates, template reuse | Efficient way to manage complex workflows |
| **Export Node Definitions** | Export node definitions to JSON/Markdown file | Reuse workflows, backup, documentation | Extract node definitions from any on-chain Machine to quickly build new workflows |
| **Progress Generation** | Create new Progress instances | Start workflow execution | Converts templates into active running workflows |
| **Pause/Resume** | Control new Progress generation | Temporarily stop workflow creation | Manages workflow availability during updates |
| **Publish Machine** | Lock nodes for production use | Finalize workflow before deployment | Prevents accidental modifications to active workflows |
| **Owner Receive** | Unwrap and send received objects | Distribute assets, deliverables | Ensures proper asset flow to workflow owners |
| **Contact Object** | Set or remove contact reference | Link communication channels | Enables messaging and coordination |

---

## Schema Tree (4-Level Structure)

```
machine
├── operation_type: "machine"
├── data
│   ├── object
│   │   ├── Option 1: Name or Address (string)
│   │   │   └── [machine_name or machine_id]
│   │   └── Option 2: Named Object with Permission
│   │       ├── name (string, optional)
│   │       ├── tags (array of strings, optional)
│   │       ├── onChain (boolean, optional)
│   │       ├── replaceExistName (boolean, optional)
│   │       └── permission
│   │           ├── Option 1: Name or Address (string)
│   │           │   └── [permission_name or permission_id]
│   │           └── Option 2: Named Object with Description
│   │               ├── name (string, optional)
│   │               ├── tags (array of strings, optional)
│   │               ├── onChain (boolean, optional)
│   │               ├── replaceExistName (boolean, optional)
│   │               └── description (string, optional)
│   ├── description (string, optional)
│   ├── repository (object, optional)
│   │   ├── Option 1: op: "add" or "set"
│   │   │   └── objects (array of strings)
│   │   ├── Option 2: op: "remove"
│   │   │   └── objects (array of strings)
│   │   └── Option 3: op: "clear"
│   ├── node (object, optional)
│   │   ├── Option 1: Node Operations
│   │   │   ├── op: "add"
│   │   │   │   └── nodes (array)
│   │   │   │       └── [machine_node]
│   │   │   │           ├── name (string)
│   │   │   │           └── pairs (array)
│   │   │   ├── op: "set"
│   │   │   │   └── nodes (array)
│   │   │   │       └── [machine_node]
│   │   │   │           ├── name (string)
│   │   │   │           └── pairs (array)
│   │   │   ├── op: "remove"
│   │   │   │   └── nodes (array of strings)
│   │   │   ├── op: "clear"
│   │   │   ├── op: "exchange"
│   │   │   │   ├── node_one (string)
│   │   │   │   └── node_other (string)
│   │   │   ├── op: "rename"
│   │   │   │   ├── node_name_old (string)
│   │   │   │   └── node_name_new (string)
│   │   │   ├── op: "remove prior node"
│   │   │   │   └── pairs (array)
│   │   │   ├── op: "add forward"
│   │   │   │   └── data (array)
│   │   │   └── op: "remove forward"
│   │   │       └── data (array)
│   │   └── Option 2: json_or_markdown_file (string)
│   ├── progress_new (object, optional)
│   │   ├── task (string, optional)
│   │   ├── repository (object, optional)
│   │   ├── progress_namedOperator (object, optional)
│   │   │   ├── op: "add" | "set" | "remove"
│   │   │   ├── name (string)
│   │   │   └── operators (object)
│   │   └── namedNew (object, optional)
│   │       ├── name (string, optional)
│   │       ├── tags (array of strings, optional)
│   │       ├── onChain (boolean, optional)
│   │       └── replaceExistName (boolean, optional)
│   ├── pause (boolean, optional)
│   ├── publish (boolean, optional)
│   ├── owner_receive (transfer received coins or NFT objects to owner, optional)
│   │   ├── Option 1: "recently" (string) - receive all recent objects
│   │   ├── Option 2: Array of received objects
│   │   │   └── [{ id: "object_id", type: "object_type" }]
│   │   └── Option 3: Received balance object
│   │       ├── balance (number or string)
│   │       ├── token_type (string)
│   │       └── received (array of received items)
│   └── um (Contact object, optional)
│       ├── Option 1: Contact object name or ID (string)
│       └── Option 2: null (to unbind contact)
├── json_or_markdown_file (string, optional)
├── env (optional, execution environment)
│   ├── account (string, optional) - account name or address, empty string for default
│   ├── network (string, optional) - "testnet" or "mainnet"
│   ├── permission_guard (array, optional) - list of permission guard IDs
│   ├── no_cache (boolean, optional) - disable caching
│   └── referrer (string, optional) - referrer ID
└── submission (optional, submission data)
    ├── type (string) - fixed value "submission"
    ├── guard (array) - list of guards to verify
    │   └── [{ object: "guard_id", impack: boolean }]
    └── submission (array) - submission data for guards
        └── [{ guard: "guard_id", submission: [guard_submission_items] }]
            └── guard_submission_items
                ├── identifier (number, 0-255) - Guard table item identifier
                ├── b_submission (boolean) - whether this item requires submission
                ├── value_type (number | string) - value type (e.g., 6 or "U64" for U64 type)
                ├── **value (any) - submitted value**
                └── name (string, optional) - item name
```

---

### ⚠️ Important Note About Submission

If the execution returns a `submission` field in the response, it indicates that additional Guard verification data is required. You must:

1. Complete all required submission data within the `submission` structure
2. Resubmit the operation with the completed submission data
3. **Do not modify any other parts of the structure** - only fill in the required submission values

The submission structure will specify which Guard objects need verification and what data needs to be provided for each Guard table item.

**Query Value Types**: Use the `wowok_buildin_info` tool with `{ "info": "value types" }` to query all supported value types with their numeric and string representations. This helps you understand what `value_type` values are valid for submission data.

---

## Complete Tool Call Structure

Machine operations use the following top-level structure:

```json
{
  "operation_type": "machine",
  "data": { ... },
  "json_or_markdown_file": "string (optional)",
  "env": { ... },
  "submission": { ... }
}
```

**Important**: The `json_or_markdown_file` field is at the top level, not inside `data`. This is a file path containing node definitions for complete replacement of all nodes.

---

## Constraint Constants

| Constant Name | Value | Description |
|---------------|-------|-------------|
| `nameMaxLength` | 64 | Maximum name length (BCS characters) |
| `weightMin` | 0 | Minimum forward weight |
| `weightMax` | 65535 | Maximum forward weight |
| `thresholdMax` | 4294967295 | Maximum threshold value (U32) |
| `permissionIndexMin` | 1000 | Minimum custom permission index |
| `permissionIndexMax` | 65535 | Maximum custom permission index |

---

## Machine Node Structure

A Machine consists of nodes and their connections:

### Node Structure

```json
{
  "name": "node_name",
  "pairs": [
    {
      "prev_node": "previous_node_name",
      "threshold": 1,
      "forwards": [
        {
          "name": "forward_name",
          "namedOperator": "namespace_name",
          "permissionIndex": 300,
          "weight": 1,
          "guard": {
            "guard": "guard_object_id"
          }
        }
      ]
    }
  ]
}
```

**Forward Permissions (MUST specify ONE):**
- `namedOperator`: Namespace (for Progress-specific operators)
- `permissionIndex`: Permission index (shared across all Progress objects)

---

## Sub-feature 1: Create Machine Object

### Feature Description

Create a new Machine object. You can set the name, tags, description, and optionally specify or create a Permission object for access control.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `operation_type` | string | Yes | Operation type | Fixed value "machine" |
| `data.object` | object/string | Yes | Object reference | For new object, provide { name, permission, ... } |
| `data.object.name` | string | No | Machine name | Max 64 BCS characters, cannot start with '0x' |
| `data.object.tags` | array | No | Tag list | String array |
| `data.object.onChain` | boolean | No | Whether to publish on-chain | true=public; false/undefined=local only (default) |
| `data.object.replaceExistName` | boolean | No | Whether to replace existing name | true=force replace; false=error if name exists (default) |
| `data.object.permission` | object/string | No | Permission object | Existing Permission ID/name OR new Permission config |
| `data.description` | string | No | Machine description | Explain the purpose and workflow |
| `env.account` | string | No | Use specified account | Empty string '' uses default account |
| `env.network` | enum | No | Network selection | "localnet" or "testnet" |

### Important Notes

⚠️ **Machine can create Progress objects only after publishing!** Make sure your workflow is complete before publishing.

⚠️ **After publishing, nodes cannot be modified!** Double-check your node definitions before publishing.

⚠️ **Permission object is optional but recommended!** Use Permission to control who can operate the Machine.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 1.1: Create Minimal Machine (no name, auto Permission)

**Prompt**: Create a basic Machine without a name, using an automatically created Permission object. Don't add any nodes yet.

```json
{
  "operation_type": "machine",
  "data": {
    "object": {}
  }
}
```

#### Example 1.2: Create Named Machine with Tags

**Prompt**: Create a Machine named "design_workflow" with tags ["design", "service", "workflow"], add a description explaining this is a design service workflow, and store the name locally (not on-chain).

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "design_workflow",
      "tags": ["design", "service", "workflow"],
      "onChain": false
    },
    "description": "Design service workflow - manages the complete lifecycle from order creation to delivery"
  }
}
```

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": {
    "type": "transaction",
    "digest": "...",
    "objectChanges": [
      {
        "type": "Machine",
        "object": "0xec7a...0d51",
        "version": "301932",
        "change": "created"
      },
      {
        "type": "Permission",
        "object": "0x4203...1097",
        "version": "301932",
        "change": "created"
      }
    ]
  }
}
```

#### Example 1.3: Create Machine with Existing Permission

**Prompt**: Create a Machine named "service_workflow", and use the existing Permission object "team_permission" for access control.

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "service_workflow",
      "permission": "team_permission"
    }
  }
}
```

#### Example 1.4: Create Machine and New Permission Together

**Prompt**: Create a Machine named "marketing_workflow" and a new Permission object named "marketing_perm" at the same time. The Permission should have tags ["marketing", "team"].

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "marketing_workflow",
      "permission": {
        "name": "marketing_perm",
        "tags": ["marketing", "team"]
      }
    }
  }
}
```

#### Example 1.5: Create Public Machine (on-chain name)

**Prompt**: Create a Machine named "public_design_flow", publish its name on-chain so everyone can reference it, and add a clear description.

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "public_design_flow",
      "onChain": true
    },
    "description": "Public design workflow template - can be referenced by any service"
  }
}
```

---

## Sub-feature 2: Add Nodes (op: "add")

### Feature Description

Add nodes to a Machine. Each node represents a state in the workflow, with connections (pairs) to previous nodes and forward operations.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.node.op` | string | Yes | Operation type | Fixed value "add" |
| `data.node.nodes` | array | Yes | Node array | MachineNode array |
| `data.node.nodes[].name` | string | Yes | Node name | Unique identifier |
| `data.node.nodes[].pairs` | array | Yes | Node connections | Array of {prev_node, threshold, forwards} |
| `data.node.nodes[].pairs[].prev_node` | string | Yes | Previous node name | - |
| `data.node.nodes[].pairs[].threshold` | number | Yes | Threshold | Min 0, max 4294967295 |
| `data.node.nodes[].pairs[].forwards` | array | Yes | Forward operations | Array of {name, permission, weight} |
| `data.node.bReplace` | boolean | No | Replace existing | true=replace; false=merge (default) |

### Important Notes

⚠️ **Node names must be unique!** Duplicate node names will cause errors.

⚠️ **Use bReplace=true only when intended!** This will completely replace existing nodes with the same name.

⚠️ **Threshold is the total weight required!** When the sum of forward weights meets or exceeds threshold, the workflow advances.

⚠️ **Two Permission Modes for Forwards:**
- **`permissionIndex`**: Uses Permission object's permission indexes. All Progress instances share the same operators (recommended for fixed workflows). First define the permissionIndex in the Permission object.
- **`namedOperator`**: Uses named operator spaces. Each Progress instance can set different operators independently (recommended for flexible workflows). Use `progress_namedOperator` to manage operators for specific Progress instances.

#### Understanding the Init Node (Empty String "")

When designing workflow nodes, you need to understand how the **init node** (empty string `""`) works:

- **What is the init node?** The empty string `""` represents the initial/starting state of a workflow. It does not need to be defined as a separate node in the nodes table.
- **How to use it?** When defining the first node of your workflow, set `prev_node: ""` to indicate that this node can be reached from the initial state.
- **How does Progress start?** When a Progress object is created, its `current` field is set to `""` (init node). To advance to the first actual node, you need a forward defined with `prev_node: ""`.

**Example**: If your first node is "requirement", define it like this:
```json
{
  "name": "requirement",
  "pairs": [
    {
      "prev_node": "",  // Connects from init node
      "threshold": 1,
      "forwards": [
        {
          "name": "start_project",
          "permissionIndex": 1000,
          "weight": 1
        }
      ]
    }
  ]
}
```

**Common Mistake**: Defining a node with `"pairs": []` means no node can transition to it, making it unreachable from the init state. Always ensure your starting node has at least one pair with `prev_node: ""`.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 2.1: Add Starting Node with Init Connection

**Prompt**: Add a starting node named "created" to "design_workflow". Connect it from the init node (empty string) so Progress can reach it when starting.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "created",
          "pairs": [
            {
              "prev_node": "",
              "threshold": 1,
              "forwards": [
                {
                  "name": "start",
                  "permissionIndex": 1000,
                  "weight": 1
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

> **Note**: The `prev_node: ""` indicates this node can be reached from the init node. Without this, the node would be unreachable when Progress starts.

#### Example 2.2: Add Node with Single Forward

**Prompt**: Add a node named "confirmed" to "design_workflow". Connect it from "created" with a forward called "confirm_order" using permission index 1000 (user-defined permission), weight 1, threshold 1.

> **Note**: Permission index for forward operations can be:
> - **User-defined permissions**: 1000-65535 (recommended for business-specific operations)
> - **Built-in permissions**: Any valid `BuiltinPermissionIndex` value (100-450+)
> 
> **Important**: Built-in permission index 200-208 are for **Machine management operations** (like creating machines, modifying nodes), NOT for forward operations within a workflow. For forward operations, use user-defined permissions (1000+) or other appropriate built-in permissions.
> 
> **Common Built-in Permission Indexes**:
> - Repository: 100-105
> - Reward: 150-157
> - Machine (management): 200-208
> - Progress (management): 220-225
> - Service: 300-320
> - Arbitration: 350-368
> - Demand: 400-408

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "confirmed",
          "pairs": [
            {
              "prev_node": "created",
              "threshold": 1,
              "forwards": [
                {
                  "name": "confirm_order",
                  "permissionIndex": 1000,
                  "weight": 1
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

#### Example 2.3: Add Node with Guard Validation

**Prompt**: Add a "delivered" node with a forward that requires Guard validation. Use the "delivery_guard" Guard object.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "delivered",
          "pairs": [
            {
              "prev_node": "confirmed",
              "threshold": 1,
              "forwards": [
                {
                  "name": "confirm_delivery",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": {
                    "guard": "delivery_guard"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

#### Example 2.4: Add Node with Named Operator

**Prompt**: Add a "processing" node using namedOperator "operator" instead of permissionIndex. This allows each Progress instance to have different operators.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "processing",
          "pairs": [
            {
              "prev_node": "confirmed",
              "threshold": 1,
              "forwards": [
                {
                  "name": "start_processing",
                  "namedOperator": "operator",
                  "weight": 1
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

#### Example 2.5: Add Multiple Nodes at Once

**Prompt**: Add three nodes ("preparing", "shipping", "completed") in a single operation to create a complete delivery workflow.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "preparing",
          "pairs": [
            {
              "prev_node": "confirmed",
              "threshold": 1,
              "forwards": [
                {
                  "name": "start_preparing",
                  "permissionIndex": 1002,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "shipping",
          "pairs": [
            {
              "prev_node": "preparing",
              "threshold": 1,
              "forwards": [
                {
                  "name": "start_shipping",
                  "permissionIndex": 1003,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "completed",
          "pairs": [
            {
              "prev_node": "shipping",
              "threshold": 1,
              "forwards": [
                {
                  "name": "complete_order",
                  "permissionIndex": 1004,
                  "weight": 1
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

---

## Sub-feature 3: Set Nodes (op: "set")

### Feature Description

Set (replace) existing nodes in a Machine. Use `bReplace` flag to control whether to replace or merge.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.node.op` | string | Yes | Operation type | Fixed value "set" |
| `data.node.nodes` | array | Yes | Node array | MachineNode array |
| `data.node.bReplace` | boolean | No | Replace mode | true=replace existing; false=merge (default) |

### Examples

#### Example 3.1: Replace Existing Node

**Prompt**: Replace the "confirmed" node with updated forward configuration. Set bReplace to true.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "set",
      "nodes": [
        {
          "name": "confirmed",
          "pairs": [
            {
              "prev_node": "created",
              "threshold": 2,
              "forwards": [
                {
                  "name": "confirm_order",
                  "permissionIndex": 1000,
                  "weight": 1
                },
                {
                  "name": "admin_confirm",
                  "permissionIndex": 1005,
                  "weight": 1
                }
              ]
            }
          ]
        }
      ],
      "bReplace": true
    }
  }
}
```

---

## Sub-feature 4: Remove Nodes (op: "remove")

### Feature Description

Remove one or more nodes from a Machine by their names.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.node.op` | string | Yes | Operation type | Fixed value "remove" |
| `data.node.nodes` | array | Yes | Node names to remove | Array of strings |

### Examples

#### Example 4.1: Remove Single Node

**Prompt**: Remove the "temp_node" node from "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "remove",
      "nodes": ["temp_node"]
    }
  }
}
```

#### Example 4.2: Remove Multiple Nodes

**Prompt**: Remove "temp_node1" and "temp_node2" from "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "remove",
      "nodes": ["temp_node1", "temp_node2"]
    }
  }
}
```

---

## Sub-feature 5: Clear All Nodes (op: "clear")

### Feature Description

Remove all nodes from a Machine. Use with caution!

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.node.op` | string | Yes | Operation type | Fixed value "clear" |

### Examples

#### Example 5.1: Clear All Nodes

**Prompt**: Clear all nodes from "design_workflow". This will remove the entire workflow structure.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 6: Exchange Nodes (op: "exchange")

### Feature Description

Swap the positions of two nodes in the workflow. This exchanges all their connections and forwards.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.node.op` | string | Yes | Operation type | Fixed value "exchange" |
| `data.node.node_one` | string | Yes | First node name | - |
| `data.node.node_other` | string | Yes | Second node name | - |

### Examples

#### Example 6.1: Exchange Two Nodes

**Prompt**: Exchange the positions of "preparing" and "shipping" nodes in "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "exchange",
      "node_one": "preparing",
      "node_other": "shipping"
    }
  }
}
```

---

## Sub-feature 7: Rename Node (op: "rename")

### Feature Description

Rename a node while preserving all its connections and forwards.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.node.op` | string | Yes | Operation type | Fixed value "rename" |
| `data.node.node_name_old` | string | Yes | Current node name | - |
| `data.node.node_name_new` | string | Yes | New node name | Max 64 BCS characters |

### Examples

#### Example 7.1: Rename Node

**Prompt**: Rename "confirmed" node to "validated" in "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "rename",
      "node_name_old": "confirmed",
      "node_name_new": "validated"
    }
  }
}
```

---

## Sub-feature 8: Remove Prior Node (op: "remove prior node")

### Feature Description

Remove specific previous node connections from a node. This removes the edge between two nodes without deleting the nodes themselves.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.node.op` | string | Yes | Operation type | Fixed value "remove prior node" |
| `data.node.pairs` | array | Yes | Pairs to remove | Array of {prior_node_name, node_name} |

### Examples

#### Example 8.1: Remove Single Prior Connection

**Prompt**: Remove the connection from "created" to "confirmed" in "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "remove prior node",
      "pairs": [
        {
          "prior_node_name": ["created"],
          "node_name": "confirmed"
        }
      ]
    }
  }
}
```

---

## Sub-feature 9: Add Forward (op: "add forward")

### Feature Description

Add forward operations to existing node connections. This adds new transition options without removing existing ones.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.node.op` | string | Yes | Operation type | Fixed value "add forward" |
| `data.node.data` | array | Yes | Forward data | Array of {prior_node_name, node_name, forward, threshold} |

### Examples

#### Example 9.1: Add Single Forward

**Prompt**: Add a new forward "urgent_confirm" from "created" to "confirmed" with permission index 1006.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add forward",
      "data": [
        {
          "prior_node_name": "created",
          "node_name": "confirmed",
          "forward": [
            {
              "name": "urgent_confirm",
              "permissionIndex": 1006,
              "weight": 1
            }
          ],
          "threshold": 1
        }
      ]
    }
  }
}
```

#### Example 9.2: Add Multiple Forwards

**Prompt**: Add forwards to multiple node connections at once.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add forward",
      "data": [
        {
          "prior_node_name": "created",
          "node_name": "confirmed",
          "forward": [
            {
              "name": "standard_confirm",
              "permissionIndex": 1000,
              "weight": 1
            }
          ],
          "threshold": 1
        },
        {
          "prior_node_name": "confirmed",
          "node_name": "processing",
          "forward": [
            {
              "name": "auto_process",
              "permissionIndex": 1007,
              "weight": 1
            }
          ],
          "threshold": 1
        }
      ]
    }
  }
}
```

---

## Sub-feature 10: Remove Forward (op: "remove forward")

### Feature Description

Remove specific forward operations from node connections.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.node.op` | string | Yes | Operation type | Fixed value "remove forward" |
| `data.node.data` | array | Yes | Forward data to remove | Array of {prior_node_name, node_name, forward_name} |

### Examples

#### Example 10.1: Remove Single Forward

**Prompt**: Remove the "urgent_confirm" forward from the connection between "created" and "confirmed".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "remove forward",
      "data": [
        {
          "prior_node_name": "created",
          "node_name": "confirmed",
          "forward_name": ["urgent_confirm"]
        }
      ]
    }
  }
}
```

---

## Sub-feature 11: Complete Node Replacement via File (json_or_markdown_file)

### Feature Description

Replace all nodes in a Machine by loading node definitions from a JSON or Markdown file. This is useful for bulk updates and template reuse.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.node.json_or_markdown_file` | string | Yes | File path | Path to JSON or Markdown file containing node array |

### File Format

The file must contain a JSON array of node objects:

```json
[
  {
    "name": "node1",
    "pairs": [...]
  },
  {
    "name": "node2",
    "pairs": [...]
  }
]
```

### Examples

#### Example 11.1: Replace Nodes from JSON File

**Prompt**: Replace all nodes in "design_workflow" with nodes defined in "workflow_v2.json".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "json_or_markdown_file": "/path/to/workflow_v2.json"
    }
  }
}
```

#### Example 11.2: Replace Nodes from Markdown File

**Prompt**: Replace all nodes using a Markdown file that contains the node definitions in a JSON code block.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "json_or_markdown_file": "/path/to/workflow_doc.md"
    }
  }
}
```

---

## Sub-feature 12: Set Description

### Feature Description

Add or update the description of a Machine object.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.description` | string | Yes | Description text | Max description length |

### Examples

#### Example 12.1: Set Description

**Prompt**: Update the description of "design_workflow" to explain its purpose.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "description": "Design service workflow - manages the complete lifecycle from order creation to delivery, including confirmation, preparation, shipping, and completion stages."
  }
}
```

---

## Sub-feature 13: Manage Repository

### Feature Description

Attach or detach Repository objects to a Machine for consensus data management.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.repository.op` | string | Yes | Operation type | "add", "set", "remove", "clear" |
| `data.repository.objects` | array | Conditional | Repository IDs | Required for add/set/remove |

### Examples

#### Example 13.1: Add Repositories

**Prompt**: Add "config_repo" and "data_repo" to "design_workflow" for consensus data storage.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "repository": {
      "op": "add",
      "objects": ["config_repo", "data_repo"]
    }
  }
}
```

#### Example 13.2: Set Repositories (Replace All)

**Prompt**: Replace all repositories with just "new_config_repo".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "repository": {
      "op": "set",
      "objects": ["new_config_repo"]
    }
  }
}
```

#### Example 13.3: Remove Repositories

**Prompt**: Remove "config_repo" from "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "repository": {
      "op": "remove",
      "objects": ["config_repo"]
    }
  }
}
```

#### Example 13.4: Clear All Repositories

**Prompt**: Remove all repositories from "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "repository": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 14: Create Progress

### Feature Description

Create a new Progress instance from a published Machine. Progress represents an active execution of the workflow template.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.progress_new` | object | Yes | Progress creation config | - |
| `data.progress_new.task` | string/null | No | Task object to bind | Optional task binding |
| `data.progress_new.repository` | object | No | Context repositories | Repository configuration |
| `data.progress_new.progress_namedOperator` | object | No | Named operators | Operator assignment |
| `data.progress_new.namedNew` | object | No | Name for new Progress | Naming configuration |

### Important Notes

⚠️ **Machine must be published!** Only published Machines can create Progress objects.

⚠️ **Named operators are Progress-specific!** Each Progress can have different operators for the same namedOperator namespace.

### Examples

#### Example 14.1: Create Simple Progress

**Prompt**: Create a new Progress from "design_workflow" without any special configuration.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "progress_new": {}
  }
}
```

#### Example 14.2: Create Named Progress

**Prompt**: Create a Progress named "order_12345" with tags ["urgent", "vip"].

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "progress_new": {
      "namedNew": {
        "name": "order_12345",
        "tags": ["urgent", "vip"]
      }
    }
  }
}
```

#### Example 14.3: Create Progress with Named Operators

**Prompt**: Create a Progress and assign "alice" and "bob" as operators for the "operator" namespace.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "progress_new": {
      "namedNew": {
        "name": "order_12346"
      },
      "progress_namedOperator": {
        "op": "set",
        "name": "operator",
        "operators": {
          "entities": [
            {"name_or_address": "alice"},
            {"name_or_address": "bob"}
          ]
        }
      }
    }
  }
}
```

#### Example 14.4: Create Progress with Context Repositories

**Prompt**: Create a Progress and attach "order_data_repo" as context repository.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "progress_new": {
      "namedNew": {
        "name": "order_12347"
      },
      "repository": {
        "op": "add",
        "objects": ["order_data_repo"]
      }
    }
  }
}
```

---

## Sub-feature 15: Pause Machine

### Feature Description

Pause or resume a Machine to control whether new Progress instances can be created.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.pause` | boolean | Yes | Pause state | true=pause; false=resume |

### Examples

#### Example 15.1: Pause Machine

**Prompt**: Pause "design_workflow" to temporarily stop new Progress creation.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "pause": true
  }
}
```

#### Example 15.2: Resume Machine

**Prompt**: Resume "design_workflow" to allow new Progress creation again.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "pause": false
  }
}
```

---

## Sub-feature 16: Publish Machine

### Feature Description

Publish a Machine to lock its nodes and enable Progress creation. **Warning**: After publishing, nodes cannot be modified!

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.publish` | boolean | Yes | Publish state | Must be true to publish |

### Important Notes

⚠️ **IRREVERSIBLE OPERATION!** Once published, nodes cannot be modified. Make sure your workflow is complete.

⚠️ **Required for Progress creation!** Only published Machines can create Progress objects.

### Examples

#### Example 16.1: Publish Machine

**Prompt**: Publish "design_workflow" to finalize the workflow and enable Progress creation.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "publish": true
  }
}
```

---

## Sub-feature 17: Owner Receive

### Feature Description

Receive and unwrap objects (coins, NFTs) that have been sent to the Machine object.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.owner_receive` | string/array/object | Yes | Receive configuration | "recently" or object list |

### Examples

#### Example 17.1: Receive All Recent Objects

**Prompt**: Receive all recently sent objects to "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "owner_receive": "recently"
  }
}
```

#### Example 17.2: Receive Specific Objects

**Prompt**: Receive specific objects by their IDs.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "owner_receive": [
      {"id": "0x1234...", "type": "0x2::coin::Coin<0x2::wow::WOW>"},
      {"id": "0x5678...", "type": "0x2::nft::NFT"}
    ]
  }
}
```

---

## Sub-feature 18: Manage Contact (UM)

### Feature Description

Set or remove a Contact object reference for the Machine. Contact objects enable messaging and coordination for the workflow.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.um` | string/null | Yes | Contact object reference | Contact object name/ID, or null to remove |

### Examples

#### Example 18.1: Set Contact Object

**Prompt**: Set "dev_team_contact" as the contact object for "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "um": "dev_team_contact"
  }
}
```

#### Example 18.2: Remove Contact Object

**Prompt**: Remove the contact object reference from "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "um": null
  }
}
```

---

## Sub-feature 19: Export Node Definitions with machineNode2file

### Feature Description

Export a Machine object's node definitions from the blockchain to a local JSON or Markdown file. This allows you to backup, document, or reuse workflow definitions.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `operation_type` | string | Yes | Operation type | Fixed value "machineNode2file" |
| `machine` | string | Yes | Machine name or ID | - |
| `file_path` | string | Yes | Output file path | Absolute or relative path |
| `format` | string | No | Output format | "json" (default) or "markdown" |
| `env.account` | string | No | Account to use | Empty string for default |
| `env.network` | string | No | Network | "localnet" or "testnet" |

### Examples

#### Example 19.1: Export to JSON File

**Prompt**: Export node definitions from "software_dev_workflow" to a JSON file.

```json
{
  "operation_type": "machineNode2file",
  "machine": "software_dev_workflow",
  "file_path": "d:\\wowok\\docs\\exported_nodes.json",
  "format": "json",
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "file_path": "d:\\wowok\\docs\\exported_nodes.json",
  "format": "json",
  "machine_object": "software_dev_workflow",
  "node_count": 8
}
```

#### Example 19.2: Export to Markdown File

**Prompt**: Export node definitions to a Markdown file for documentation.

```json
{
  "operation_type": "machineNode2file",
  "machine": "software_dev_workflow",
  "file_path": "d:\\wowok\\docs\\workflow_nodes.md",
  "format": "markdown",
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}

### Important Notes

⚠️ **File format**: JSON files contain the raw node array. Markdown files wrap the JSON in a code block for documentation purposes.

⚠️ **Reuse**: Exported files can be used with `json_or_markdown_file` (Sub-feature 11) to quickly create new workflows based on existing ones.

---

## Real-World Example: Software Development Lifecycle (SDLC) Workflow

This section demonstrates a complete, real-world implementation of a software development workflow using the Machine component. All examples have been tested and executed on the WoWok testnet.

### Project Overview

**Project Name**: Software Development Lifecycle Workflow  
**Use Case**: Managing the complete process from requirements gathering to production deployment  
**Team Structure**:
- Product Manager (pm_alice) - Requirements approval
- Architect (arch_bob) - Design approval  
- Development Lead (dev_lead_carol) - Code review and deployment
- Test Lead (test_lead_dave) - Testing approval
- Customer (customer_eve) - UAT approval

### Workflow Design

```
requirement → design → development → code_review → testing → uat → deployment → completed
```

**8 Nodes, 7 Transitions**:
1. **requirement** - Starting state, connects from init node (empty string `prev_node: ""`)
2. **design** - Architecture design phase (requires PM approval)
3. **development** - Implementation phase (requires Architect approval)
4. **code_review** - Code review phase (uses namedOperator for flexible developer assignment)
5. **testing** - QA testing phase (requires Dev Lead approval)
6. **uat** - User Acceptance Testing (requires Test Lead approval)
7. **deployment** - Production deployment (requires Customer approval)
8. **completed** - Final state (requires Dev Lead approval)

> **Note on Init Node**: The empty string `""` represents the initial node in a workflow. When creating the first node in your workflow, use `prev_node: ""` to indicate it can be reached from the initial state. Progress objects start at the init node (`current: ""`) when created.

### Prerequisites

Before creating the Machine workflow, you need to:

1. **Create Team Accounts** (see [Account Operations](../account.md))
2. **Create Permission Object** with custom permission indexes (see [Permission Component](permission.md))
3. **Create Guard Objects** for validation (see [Guard Component](guard.md))

---

## Step-by-Step Implementation

### Step 1: Create Team Accounts

Create accounts for each team member:

```json
{
  "operation_type": "account",
  "data": {
    "gen": {
      "name": "pm_alice"
    }
  }
}
```

**Execution Result**:
```json
{
  "gen": {
    "address": "0xd3a1e00fb2401dadf0f5c229f8993b5a8934552b1dc2b1cd719f5d9e2aeff33d",
    "name": "pm_alice"
  }
}
```

Repeat for other team members:
- `arch_bob` → `0xf6f8...ed15`
- `dev_lead_carol` → `0xad42...7220`
- `test_lead_dave` → `0x3102...0b09`
- `customer_eve` → `0xfa01...dbcd`

> **Note**: Get test coins from the faucet for each account using the `faucet` operation.

---

### Step 2: Create Permission Object

Create a Permission object to manage workflow access control:

```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "dev_team_permission",
      "tags": ["development", "team", "workflow"]
    },
    "description": "Permission object for software development team workflow"
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "type": "Permission",
  "object": "0x24828d09b0e5f9ca8ce899420952399ad40b722185a57669cb6792012d68174c",
  "version": "5",
  "change": "created"
}
```

---

### Step 3: Assign Custom Permission Indexes

Assign user-defined permission indexes (1000-1004) to team members:

**Permission 1000 - Product Manager (Requirement Approval)**:
```json
{
  "operation_type": "permission",
  "data": {
    "object": "dev_team_permission",
    "table": {
      "op": "add perm by index",
      "index": 1000,
      "entity": {
        "entities": [{"name_or_address": "pm_alice"}]
      }
    },
    "remark": {
      "op": "set",
      "index": 1000,
      "remark": "Product Manager - Requirement approval permission"
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Permission 1001 - Architect (Design Approval)**:
```json
{
  "operation_type": "permission",
  "data": {
    "object": "dev_team_permission",
    "table": {
      "op": "add perm by index",
      "index": 1001,
      "entity": {
        "entities": [{"name_or_address": "arch_bob"}]
      }
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Permission 1002 - Development Lead (Code Review & Deployment)**:
```json
{
  "operation_type": "permission",
  "data": {
    "object": "dev_team_permission",
    "table": {
      "op": "add perm by index",
      "index": 1002,
      "entity": {
        "entities": [{"name_or_address": "dev_lead_carol"}]
      }
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Permission 1003 - Test Lead (Testing Approval)**:
```json
{
  "operation_type": "permission",
  "data": {
    "object": "dev_team_permission",
    "table": {
      "op": "add perm by index",
      "index": 1003,
      "entity": {
        "entities": [{"name_or_address": "test_lead_dave"}]
      }
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Permission 1004 - Customer (UAT Approval)**:
```json
{
  "operation_type": "permission",
  "data": {
    "object": "dev_team_permission",
    "table": {
      "op": "add perm by index",
      "index": 1004,
      "entity": {
        "entities": [{"name_or_address": "customer_eve"}]
      }
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

---

### Step 4: Create Guard Object

Create an always-true Guard for workflow transitions:

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "dev_workflow_guard",
      "tags": ["guard", "workflow", "development"]
    },
    "description": "Always true guard for development workflow transitions",
    "table": [
      {
        "identifier": 0,
        "value_type": "Bool",
        "b_submission": false,
        "value": true
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_equal",
        "nodes": [
          {"type": "identifier", "identifier": 0},
          {"type": "identifier", "identifier": 0}
        ]
      }
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "type": "Guard",
  "object": "0x6ee9163dd90aaf44402674100d136d86eeea0e42e68036db2ed41d61a27ce48a",
  "version": "519377",
  "change": "created"
}
```

---

### Step 5: Create Machine Object

Create the Machine with the Permission object:

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "software_dev_workflow",
      "permission": "dev_team_permission",
      "tags": ["development", "workflow", "sdlc"],
      "onChain": true
    },
    "description": "Software Development Lifecycle Workflow - manages the complete process from requirements to deployment"
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "type": "Machine",
  "object": "0xb494336e61f4de62bc646fdb9612ec200d268f4e9407dc71127983ee0cff4324",
  "version": "519690",
  "change": "created"
}
```

---

### Step 6: Add Workflow Nodes

Add all 8 nodes with their connections:

```json
{
  "operation_type": "machine",
  "data": {
    "object": "software_dev_workflow",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "requirement",
          "pairs": [
            {
              "prev_node": "",
              "threshold": 1,
              "forwards": [
                {
                  "name": "start_project",
                  "permissionIndex": 1000,
                  "weight": 1,
                  "guard": {
                    "guard": "dev_workflow_guard"
                  }
                }
              ]
            }
          ]
        },
        {
          "name": "design",
          "pairs": [
            {
              "prev_node": "requirement",
              "threshold": 1,
              "forwards": [
                {
                  "name": "submit_design",
                  "permissionIndex": 1000,
                  "weight": 1,
                  "guard": {
                    "guard": "dev_workflow_guard"
                  }
                }
              ]
            }
          ]
        },
        {
          "name": "development",
          "pairs": [
            {
              "prev_node": "design",
              "threshold": 1,
              "forwards": [
                {
                  "name": "start_development",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": {
                    "guard": "dev_workflow_guard"
                  }
                }
              ]
            }
          ]
        },
        {
          "name": "code_review",
          "pairs": [
            {
              "prev_node": "development",
              "threshold": 1,
              "forwards": [
                {
                  "name": "submit_code",
                  "namedOperator": "developer",
                  "weight": 1,
                  "guard": {
                    "guard": "dev_workflow_guard"
                  }
                }
              ]
            }
          ]
        },
        {
          "name": "testing",
          "pairs": [
            {
              "prev_node": "code_review",
              "threshold": 1,
              "forwards": [
                {
                  "name": "approve_code",
                  "permissionIndex": 1002,
                  "weight": 1,
                  "guard": {
                    "guard": "dev_workflow_guard"
                  }
                }
              ]
            }
          ]
        },
        {
          "name": "uat",
          "pairs": [
            {
              "prev_node": "testing",
              "threshold": 1,
              "forwards": [
                {
                  "name": "pass_testing",
                  "permissionIndex": 1003,
                  "weight": 1,
                  "guard": {
                    "guard": "dev_workflow_guard"
                  }
                }
              ]
            }
          ]
        },
        {
          "name": "deployment",
          "pairs": [
            {
              "prev_node": "uat",
              "threshold": 1,
              "forwards": [
                {
                  "name": "approve_uat",
                  "permissionIndex": 1004,
                  "weight": 1,
                  "guard": {
                    "guard": "dev_workflow_guard"
                  }
                }
              ]
            }
          ]
        },
        {
          "name": "completed",
          "pairs": [
            {
              "prev_node": "deployment",
              "threshold": 1,
              "forwards": [
                {
                  "name": "deploy_production",
                  "permissionIndex": 1002,
                  "weight": 1,
                  "guard": {
                    "guard": "dev_workflow_guard"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "type": "Machine",
  "object": "0xb494336e61f4de62bc646fdb9612ec200d268f4e9407dc71127983ee0cff4324",
  "version": "519691",
  "change": "mutated",
  "nodes_created": 8
}
```

---

### Step 7: Export Node Definitions to File

Export the node definitions for reuse:

```json
{
  "operation_type": "machineNode2file",
  "machine": "software_dev_workflow",
  "file_path": "d:\\wowok\\docs\\exported_nodes.json",
  "format": "json",
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "file_path": "d:\\wowok\\docs\\exported_nodes.json",
  "format": "json",
  "machine_object": "software_dev_workflow",
  "node_count": 8
}
```

The exported file contains the complete node array:
```json
[
  {
    "name": "requirement",
    "pairs": [
      {
        "prev_node": "",
        "threshold": 1,
        "forwards": [
          {
            "name": "start_project",
            "permissionIndex": 1000,
            "weight": 1,
            "guard": {
              "guard": "0x6ee9...e48a",
              "retained_submission": []
            }
          }
        ]
      }
    ]
  },
  {
    "name": "design",
    "pairs": [
      {
        "prev_node": "requirement",
        "threshold": 1,
        "forwards": [
          {
            "name": "submit_design",
            "permissionIndex": 1000,
            "weight": 1,
            "guard": {
              "guard": "0x6ee9...e48a",
              "retained_submission": []
            }
          }
        ]
      }
    ]
  }
  // ... more nodes
]
```

---

### Step 8: Create New Machine from Exported File

Create a modified workflow by editing the exported file and creating a new Machine:

**Modified File** (`modified_nodes.json`):
Add a `security_audit` node between `code_review` and `testing`:

```json
{
  "name": "security_audit",
  "pairs": [
    {
      "prev_node": "code_review",
      "threshold": 1,
      "forwards": [
        {
          "name": "pass_code_review",
          "permissionIndex": 1002,
          "weight": 1,
          "guard": {
            "guard": "0x6ee9...e48a",
            "retained_submission": []
          }
        }
      ]
    }
  ]
}
```

Create new Machine with file-based node setup:

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "secure_dev_workflow",
      "permission": "dev_team_permission",
      "tags": ["security", "development", "workflow"],
      "onChain": true
    },
    "description": "Secure Software Development Workflow with Security Audit - enhanced version with security review phase",
    "node": {
      "json_or_markdown_file": "d:\\wowok\\docs\\modified_nodes.json"
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "type": "Machine",
  "object": "0x0588cfaad10957a7da3c27c2d59c4dddeead333bbc495d37f35051655e282b9f",
  "version": "522600",
  "change": "created"
}
```

---

### Step 9: Publish Machine

Publish the Machine to enable Progress creation:

```json
{
  "operation_type": "machine",
  "data": {
    "object": "software_dev_workflow",
    "publish": true
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "type": "Machine",
  "object": "0xb494336e61f4de62bc646fdb9612ec200d268f4e9407dc71127983ee0cff4324",
  "version": "522602",
  "change": "mutated",
  "published": true
}
```

---

### Step 10: Create Progress Instances

Create a Progress instance for Project Alpha:

```json
{
  "operation_type": "machine",
  "data": {
    "object": "software_dev_workflow",
    "progress_new": {
      "namedNew": {
        "name": "project_alpha",
        "tags": ["project", "alpha", "mobile_app"]
      },
      "progress_namedOperator": {
        "op": "set",
        "name": "developer",
        "operators": {
          "entities": [{"name_or_address": "dev_lead_carol"}]
        }
      }
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "type": "Progress",
  "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
  "version": "523546",
  "change": "created"
}
```

Create another Progress with a different developer:

```json
{
  "operation_type": "machine",
  "data": {
    "object": "secure_dev_workflow",
    "progress_new": {
      "namedNew": {
        "name": "project_beta",
        "tags": ["project", "beta", "web_app"]
      },
      "progress_namedOperator": {
        "op": "set",
        "name": "developer",
        "operators": {
          "entities": [{"name_or_address": "arch_bob"}]
        }
      }
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "type": "Progress",
  "object": "0x732b6a680f1824df4ef8d54d0ecf1c194bfdd1cee7a683dece2768f56fe59100",
  "version": "523848",
  "change": "created"
}
```

---

## Summary of Created Objects

| Object Type | Name | Address | Purpose |
|-------------|------|---------|---------|
| **Permission** | dev_team_permission | 0x2482...174c | Access control for workflow |
| **Guard** | dev_workflow_guard | 0x6ee9...e48a | Validation for transitions |
| **Machine** | software_dev_workflow | 0xb494...4324 | Standard SDLC workflow (8 nodes) |
| **Machine** | secure_dev_workflow | 0x0588...2b9f | Enhanced workflow with security audit (9 nodes) |
| **Progress** | project_alpha | 0x5255...9cb4 | Mobile app project instance |
| **Progress** | project_beta | 0x732b...9100 | Web app project instance |
