# Machine Component (⚙️ Workflow Templates)

---

## Component Overview

The Machine component is WoWok's workflow automation engine, used to design and deploy automated workflow templates that define how services are delivered. Machines consist of nodes (workflow states) and forwards (operations that move the workflow forward), with permission checks and optional Guard validations.

> **Note**: Use the `machineNode2file` tool (see [Sub-feature 20](#sub-feature-20-export-node-definitions-with-machinenode2file)) to export existing Machine node definitions from the blockchain to a JSON or Markdown file for editing and reuse. Pair with [Sub-feature 11](#sub-feature-11-complete-node-replacement-via-file-json_or_markdown_file) to quickly build new workflows from existing ones.

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
│   ├── owner_receive (optional)
│   │   ├── Option 1: "recently"
│   │   ├── Option 2: Array of received objects
│   │   └── Option 3: Received balance object
│   └── um (string or null, optional)
├── json_or_markdown_file (string, optional)
├── env (object, optional)
│   ├── account (string, optional)
│   ├── permission_guard (array of strings, optional)
│   ├── no_cache (boolean, optional)
│   ├── network (string, optional)
│   └── referrer (string, optional)
└── submission (object, optional)
```

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
          "guard": "guard_object_id"
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
      "tags": ["design", "service", "workflow"]
    },
    "description": "Design service workflow - manages the complete lifecycle from order creation to delivery"
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

### Return Result

Returns transaction block information.

---

### Examples

#### Example 2.1: Add Single Node with No Connections

**Prompt**: Add a node named "created" to "design_workflow". This is the starting node, so it has no previous node connections.

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
          "pairs": []
        }
      ]
    }
  }
}
```

#### Example 2.2: Add Node with Single Forward

**Prompt**: Add a node named "confirmed" to "design_workflow". Connect it from "created" with a forward called "confirm_order" using permission index 300, weight 1, threshold 1.

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
                  "permissionIndex": 300,
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

#### Example 2.3: Add Multiple Nodes at Once

**Prompt**: Add three nodes to "design_workflow" in one call: "designing", "reviewing", and "completed". Connect them sequentially with appropriate forwards.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "designing",
          "pairs": [
            {
              "prev_node": "confirmed",
              "threshold": 1,
              "forwards": [
                {
                  "name": "start_design",
                  "permissionIndex": 300,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "reviewing",
          "pairs": [
            {
              "prev_node": "designing",
              "threshold": 1,
              "forwards": [
                {
                  "name": "submit_for_review",
                  "permissionIndex": 300,
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
              "prev_node": "reviewing",
              "threshold": 1,
              "forwards": [
                {
                  "name": "approve_and_complete",
                  "permissionIndex": 300,
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

#### Example 2.4: Add Node with Multiple Forwards (Branch)

**Prompt**: Add a "reviewing" node with two forwards: "approve" going to "completed" and "request_revision" going to "revising". Use permission index 300 for both.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "revising",
          "pairs": [
            {
              "prev_node": "reviewing",
              "threshold": 1,
              "forwards": [
                {
                  "name": "request_revision",
                  "permissionIndex": 300,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "reviewing",
          "pairs": [
            {
              "prev_node": "designing",
              "threshold": 1,
              "forwards": [
                {
                  "name": "approve",
                  "permissionIndex": 300,
                  "weight": 1
                },
                {
                  "name": "request_revision",
                  "permissionIndex": 300,
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
              "prev_node": "reviewing",
              "threshold": 1,
              "forwards": [
                {
                  "name": "approve",
                  "permissionIndex": 300,
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

#### Example 2.5: Add Node with NamedOperator (Progress-specific)

**Prompt**: Add a "delivering" node connected from "reviewing", using a namedOperator "delivery_team" instead of a permission index. This allows each Progress to have different operators.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "delivering",
          "pairs": [
            {
              "prev_node": "reviewing",
              "threshold": 1,
              "forwards": [
                {
                  "name": "start_delivery",
                  "namedOperator": "delivery_team",
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

#### Example 2.6: Add Node with Guard Validation

**Prompt**: Add a "completed" node that requires Guard verification. Use the Guard "payment_verified" to ensure payment is received before completing.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "completed",
          "pairs": [
            {
              "prev_node": "delivering",
              "threshold": 1,
              "forwards": [
                {
                  "name": "complete_order",
                  "permissionIndex": 300,
                  "weight": 1,
                  "guard": "payment_verified"
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

Set nodes, similar to "add" but with semantic difference indicating intentional setting rather than incremental adding.

### Parameter Description

Same as "add" operation.

### Important Notes

Same as "add" operation.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 3.1: Set Nodes with bReplace=true

**Prompt**: Completely replace the "reviewing" node definition with a new version. Set bReplace=true to ensure the old node is replaced.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "set",
      "nodes": [
        {
          "name": "reviewing",
          "pairs": [
            {
              "prev_node": "designing",
              "threshold": 1,
              "forwards": [
                {
                  "name": "approve",
                  "permissionIndex": 300,
                  "weight": 1
                },
                {
                  "name": "minor_revision",
                  "permissionIndex": 300,
                  "weight": 1
                },
                {
                  "name": "major_revision",
                  "permissionIndex": 300,
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

Remove nodes from a Machine by name.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.node.op` | string | Yes | Operation type | Fixed value "remove" |
| `data.node.nodes` | array | Yes | Node names to remove | Array of strings |

### Important Notes

⚠️ **Removing nodes may break the workflow!** Ensure remaining nodes still form a valid workflow.

⚠️ **Connections to/from removed nodes are also removed!** You may need to reconfigure remaining nodes.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 4.1: Remove Single Node

**Prompt**: Remove the node named "temporary_node" from "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "remove",
      "nodes": ["temporary_node"]
    }
  }
}
```

#### Example 4.2: Remove Multiple Nodes

**Prompt**: Remove nodes named "old_step1" and "old_step2" from "design_workflow" in one call.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "remove",
      "nodes": ["old_step1", "old_step2"]
    }
  }
}
```

---

## Sub-feature 5: Clear All Nodes (op: "clear")

### Feature Description

Remove ALL nodes from a Machine, leaving it empty.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.node.op` | string | Yes | Operation type | Fixed value "clear" |

### Important Notes

⚠️ **This deletes ALL nodes!** Only use when you want to completely rebuild the workflow.

⚠️ **Published Machines cannot clear nodes!** This operation only works on unpublished Machines.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 5.1: Clear All Nodes

**Prompt**: Remove ALL nodes from "design_workflow" to start fresh with a new workflow design.

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

## Sub-feature 6: Exchange Node Positions (op: "exchange")

### Feature Description

Exchange the positions of two nodes in the Machine's internal ordering.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.node.op` | string | Yes | Operation type | Fixed value "exchange" |
| `data.node.node_one` | string | Yes | First node name | - |
| `data.node.node_other` | string | Yes | Second node name | - |

### Important Notes

⚠️ **This only affects internal ordering!** Workflow logic (connections) remains unchanged.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 6.1: Exchange Two Nodes

**Prompt**: Exchange the positions of "reviewing" and "designing" nodes in "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "exchange",
      "node_one": "reviewing",
      "node_other": "designing"
    }
  }
}
```

---

## Sub-feature 7: Rename Node (op: "rename")

### Feature Description

Rename a node while preserving all its connections and configuration.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.node.op` | string | Yes | Operation type | Fixed value "rename" |
| `data.node.node_name_old` | string | Yes | Old node name | Must exist |
| `data.node.node_name_new` | string | Yes | New node name | Must not exist |

### Important Notes

⚠️ **All references are automatically updated!** Connections pointing to the old name will point to the new name.

⚠️ **New name must not conflict!** If the new name already exists, the operation will fail.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 7.1: Rename a Node

**Prompt**: Rename the node "reviewing" to "client_review" in "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "rename",
      "node_name_old": "reviewing",
      "node_name_new": "client_review"
    }
  }
}
```

---

## Sub-feature 8: Remove Prior Node Connections (op: "remove prior node")

### Feature Description

Remove the connection from a previous node to a node, while keeping the node itself.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.node.op` | string | Yes | Operation type | Fixed value "remove prior node" |
| `data.node.pairs` | array | Yes | Pairs to remove | Array of {prior_node_name array, node_name} |

### Important Notes

⚠️ **This removes connections, not nodes!** The target node remains, but loses connections from specified previous nodes.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 8.1: Remove Single Prior Node Connection

**Prompt**: Remove the connection from "created" to "confirmed" in "design_workflow". The "confirmed" node should remain.

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

#### Example 8.2: Remove Multiple Prior Node Connections

**Prompt**: Remove connections from both "reviewing" and "revising" to "completed" node.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "remove prior node",
      "pairs": [
        {
          "prior_node_name": ["reviewing", "revising"],
          "node_name": "completed"
        }
      ]
    }
  }
}
```

---

## Sub-feature 9: Add Forwards (op: "add forward")

### Feature Description

Add forward operations to existing node connections without recreating the entire node.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.node.op` | string | Yes | Operation type | Fixed value "add forward" |
| `data.node.data` | array | Yes | Forward data array | See structure below |
| `data.node.data[].prior_node_name` | string | Yes | Previous node name | - |
| `data.node.data[].node_name` | string | Yes | Target node name | - |
| `data.node.data[].forward` | array | Yes | Forwards to add | Array of {name, permission, weight} |
| `data.node.data[].threshold` | number | Conditional | New threshold | Required if changing threshold |

### Important Notes

⚠️ **This adds to existing forwards!** It doesn't replace them. Use "remove forward" first if needed.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 9.1: Add Single Forward to Existing Connection

**Prompt**: Add a new forward "cancel" from "created" to "cancelled" node. Use permission index 300, weight 1, threshold 1.

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
          "node_name": "cancelled",
          "forward": [
            {
              "name": "cancel",
              "permissionIndex": 300,
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

#### Example 9.2: Add Multiple Forwards at Once

**Prompt**: Add two forwards to the "reviewing" node: "minor_revision" going to "revising", and "escalate" going to "manager_review".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add forward",
      "data": [
        {
          "prior_node_name": "reviewing",
          "node_name": "revising",
          "forward": [
            {
              "name": "minor_revision",
              "permissionIndex": 300,
              "weight": 1
            }
          ],
          "threshold": 1
        },
        {
          "prior_node_name": "reviewing",
          "node_name": "manager_review",
          "forward": [
            {
              "name": "escalate",
              "permissionIndex": 300,
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

## Sub-feature 10: Remove Forwards (op: "remove forward")

### Feature Description

Remove specific forward operations from node connections.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.node.op` | string | Yes | Operation type | Fixed value "remove forward" |
| `data.node.data` | array | Yes | Forward removal data | See structure below |
| `data.node.data[].prior_node_name` | string | Yes | Previous node name | - |
| `data.node.data[].node_name` | string | Yes | Target node name | - |
| `data.node.data[].forward_name` | array | Yes | Forward names to remove | Array of strings |

### Important Notes

⚠️ **Only removes specified forwards!** Other forwards on the same connection remain.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 10.1: Remove Single Forward

**Prompt**: Remove the forward named "old_operation" from the connection between "created" and "confirmed".

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
          "forward_name": ["old_operation"]
        }
      ]
    }
  }
}
```

#### Example 10.2: Remove Multiple Forwards

**Prompt**: Remove forwards named "option_a" and "option_b" from the connection between "reviewing" and "revising".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "remove forward",
      "data": [
        {
          "prior_node_name": "reviewing",
          "node_name": "revising",
          "forward_name": ["option_a", "option_b"]
        }
      ]
    }
  }
}
```

---

## Sub-feature 11: Complete Node Replacement via File (json_or_markdown_file)

### Feature Description

Completely replace ALL nodes by loading from a JSON or Markdown file. This is equivalent to "clear" followed by "add" with bReplace=true.

**Two ways to use:**
1. **Top-level field**: `json_or_markdown_file` at the same level as `data`
2. **Inside data**: `data.node.json_or_markdown_file`

> **Tip**: Use [Sub-feature 20](#sub-feature-20-export-node-definitions-with-machinenode2file) to export node definitions from existing Machines, then import them here to quickly build new workflows!

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `operation_type` | string | Yes | Operation type | Fixed value "machine" |
| `data.object` | string/object | Yes | Machine name or ID | - |
| `json_or_markdown_file` | string | Conditional | File path (TOP LEVEL) | Alternative to data.node |
| `data.node.json_or_markdown_file` | string | Conditional | File path (inside data) | Either this OR top-level |

### File Format Requirements

**JSON File (RECOMMENDED):**
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

**Markdown File:**
```markdown
```json
[
  {
    "name": "node1",
    "pairs": [...]
  }
]
```
```

### Important Notes

⚠️ **THIS COMPLETELY REPLACES ALL NODES!** This is a destructive operation - all existing nodes are removed and replaced with the file content.

⚠️ **File must contain a node ARRAY!** Not an operation object with "op" field.

⚠️ **Published Machines cannot use this!** Only works on unpublished Machines.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 11.1: Replace Nodes via Top-Level File

**Prompt**: Completely replace all nodes in "design_workflow" by loading from the file "d:/wowok/design_workflow_nodes.json". Use the top-level json_or_markdown_file field.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow"
  },
  "json_or_markdown_file": "d:/wowok/design_workflow_nodes.json"
}
```

#### Example 11.2: Replace Nodes via data.node Field

**Prompt**: Completely replace all nodes in "design_workflow" using the file "design_nodes.md" specified inside the data.node field.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "json_or_markdown_file": "design_nodes.md"
    }
  }
}
```

---

## Sub-feature 12: Set Repository List

### Feature Description

Set, add, remove, or clear the list of consensus repositories for the Machine.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.repository.op` | string | Yes | Operation type | "add" \| "set" \| "remove" \| "clear" |
| `data.repository.objects` | array | Conditional | Object IDs/names | Required for add/set/remove |

### Important Notes

⚠️ **Repositories store consensus data!** Used for storing workflow state that requires agreement.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 12.1: Add Repository

**Prompt**: Add the repository "design_data_repo" to "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "repository": {
      "op": "add",
      "objects": ["design_data_repo"]
    }
  }
}
```

#### Example 12.2: Set Repository List (Replace)

**Prompt**: Set the complete repository list for "design_workflow" to ["design_repo", "assets_repo"], replacing any existing repositories.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "repository": {
      "op": "set",
      "objects": ["design_repo", "assets_repo"]
    }
  }
}
```

#### Example 12.3: Remove Repository

**Prompt**: Remove "old_repo" from "design_workflow's" repository list.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "repository": {
      "op": "remove",
      "objects": ["old_repo"]
    }
  }
}
```

#### Example 12.4: Clear All Repositories

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

## Sub-feature 13: Publish Machine

### Feature Description

Publish the Machine, making it available for creating Progress objects. After publishing, nodes can no longer be modified.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.publish` | boolean | Yes | Publish flag | Must be true |

### Important Notes

⚠️ **PUBLISHING IS IRREVERSIBLE!** After publishing, you cannot modify nodes, add/remove forwards, etc.

⚠️ **Verify workflow before publishing!** Check all nodes, connections, permissions, and Guards.

⚠️ **Progress objects can only be created after publishing!** You must publish before the Machine is usable.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 13.1: Publish Machine

**Prompt**: Publish "design_workflow" so that Progress objects can be created. This locks the node definitions.

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

## Sub-feature 14: Pause/Resume Machine

### Feature Description

Pause or resume the generation of new Progress objects. When paused, no new Progress can be created, but existing Progress continues to work.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.pause` | boolean | Yes | Pause flag | true=pause; false=resume |

### Important Notes

⚠️ **Only affects NEW Progress objects!** Existing Progress objects continue to operate normally.

⚠️ **This can be toggled!** Unlike publishing, pausing can be undone by setting pause=false.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 14.1: Pause Machine

**Prompt**: Pause "design_workflow" to temporarily prevent creation of new Progress objects.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "pause": true
  }
}
```

#### Example 14.2: Resume Machine

**Prompt**: Resume "design_workflow" to allow creation of new Progress objects again.

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

## Sub-feature 15: Generate New Progress Object

### Feature Description

Create a new Progress object from the Machine. Progress represents an active execution of the workflow.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | Must be PUBLISHED |
| `data.progress_new` | object | Yes | Progress configuration | - |
| `data.progress_new.task` | string | No | Task object ID/name | - |
| `data.progress_new.repository` | object | No | Repository operations | Same format as data.repository |
| `data.progress_new.namedNew` | object | No | Progress naming | {name, tags, onChain, replaceExistName} |
| `data.progress_new.progress_namedOperator` | object | No | Named operator management | {op, name, operators} |

### Important Notes

⚠️ **Machine must be PUBLISHED!** You cannot create Progress from an unpublished Machine.

⚠️ **Progress has its own lifecycle!** Progress objects track the active state of a workflow execution.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 15.1: Create Minimal Progress

**Prompt**: Create a new Progress object from "design_workflow" without additional configuration.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "progress_new": {}
  }
}
```

#### Example 15.2: Create Named Progress with Task

**Prompt**: Create a Progress object named "order_123_progress", bind it to task "order_123", and add tags ["active", "design"].

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "progress_new": {
      "task": "order_123",
      "namedNew": {
        "name": "order_123_progress",
        "tags": ["active", "design"]
      }
    }
  }
}
```

#### Example 15.3: Create Progress with Named Operators

**Prompt**: Create a Progress and add "delivery_team" named operators: "delivery_person_1" and "delivery_person_2".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "progress_new": {
      "progress_namedOperator": {
        "op": "add",
        "name": "delivery_team",
        "operators": {
          "entities": [
            { "name_or_address": "delivery_person_1" },
            { "name_or_address": "delivery_person_2" }
          ]
        }
      }
    }
  }
}
```

---

## Sub-feature 16: Owner Receive Assets

### Feature Description

Unwrap CoinWrapper objects and other received objects, sending them to the Permission object's owner.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.owner_receive` | object | Yes | Receive configuration | {recent: true} OR {objects: [...]} |
| `data.owner_receive.recent` | boolean | Conditional | Receive recent objects | Either this OR objects |
| `data.owner_receive.objects` | array | Conditional | Specific object IDs | Either this OR recent |

### Important Notes

⚠️ **Assets go to Permission owner!** Not the Machine operator.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 16.1: Receive Recent Objects

**Prompt**: Receive all recently received objects for "design_workflow" and send them to the owner.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "owner_receive": "recently"
  }
}
```

#### Example 16.2: Receive Specific Normal Objects

**Prompt**: Receive specific objects with IDs ["0xabc123...", "0xdef456..."] from "design_workflow".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "owner_receive": [
      {
        "id": "0xabc123...",
        "type": "object"
      },
      {
        "id": "0xdef456...",
        "type": "object"
      }
    ]
  }
}
```

---

## Sub-feature 17: Set Contact Object

### Feature Description

Set or clear the contact object (um) for the Machine.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.um` | string/null | Yes | Contact object | String (ID/name) or null to clear |

### Return Result

Returns transaction block information.

---

### Examples

#### Example 17.1: Set Contact Object

**Prompt**: Set the contact object for "design_workflow" to "team_messenger".

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "um": "team_messenger"
  }
}
```

#### Example 17.2: Clear Contact Object

**Prompt**: Remove the contact object from "design_workflow" by setting um to null.

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

## Sub-feature 18: Set Description

### Feature Description

Set or update the Machine's description.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `data.object` | string/object | Yes | Machine name or ID | - |
| `data.description` | string | Yes | Description text | - |

### Return Result

Returns transaction block information.

---

### Examples

#### Example 18.1: Set Description

**Prompt**: Update the description of "design_workflow" to explain it's a complete design service workflow with 8 nodes and client review steps.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "description": "Complete design service workflow - includes order creation, confirmation, design, client review, revisions, delivery, and completion. Supports both approval and revision paths."
  }
}
```

---

## Sub-feature 19: Combined Operations

### Feature Description

Perform multiple operations in a single call, such as creating a Machine, adding nodes, setting repositories, and publishing in one transaction.

### Important Notes

⚠️ **Order matters!** Operations are executed in the order they appear in the schema.

⚠️ **Can't publish and modify nodes together!** Once you set publish=true, node modifications in the same call may fail or be ignored.

### Return Result

Returns transaction block information.

---

### Examples

#### Example 19.1: Complete Workflow Setup in One Call

**Prompt**: Create a complete workflow in one call: 1) Create Machine named "full_design_flow", 2) Add 4 nodes (created, confirmed, designing, completed), 3) Add repository "design_repo", 4) Set description.

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "full_design_flow",
      "tags": ["complete", "design", "workflow"]
    },
    "description": "Complete design workflow with all essential steps",
    "repository": {
      "op": "add",
      "objects": ["design_repo"]
    },
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "created",
          "pairs": []
        },
        {
          "name": "confirmed",
          "pairs": [
            {
              "prev_node": "created",
              "threshold": 1,
              "forwards": [
                {
                  "name": "confirm",
                  "permissionIndex": 300,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "designing",
          "pairs": [
            {
              "prev_node": "confirmed",
              "threshold": 1,
              "forwards": [
                {
                  "name": "start_design",
                  "permissionIndex": 300,
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
              "prev_node": "designing",
              "threshold": 1,
              "forwards": [
                {
                  "name": "complete",
                  "permissionIndex": 300,
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

## Sub-feature 20: Export Node Definitions with machineNode2file

### Feature Description

Use the `machineNode2file` tool to export a Machine object's node definition from the blockchain to a local JSON or Markdown file. The exported file can be edited and used to create new Machine objects, enabling workflow reuse and rapid template creation.

**Core Benefits:**
- Quickly extract node definitions from ANY on-chain Machine
- Edit and refine exported files offline
- Use exported files with "Node File Replacement" to build new workflows
- Create workflow templates and backups

### Schema Tree (4-Level Structure)

```
machineNode2file (Machine Node to File)
├── machine (required)
│   └── [Machine name or Address/ID]
├── file_path (required)
│   └── [Output file path]
├── format (optional)
│   ├── "json" (default)
│   └── "markdown"
└── env (optional)
    ├── account (optional)
    ├── permission_guard (optional)
    ├── no_cache (optional)
    ├── network (optional)
    └── referrer (optional)
```

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `machine` | string | Yes | Machine object ID or name to export | Use name (preferred) or ID |
| `file_path` | string | Yes | Output file path | Absolute or relative path |
| `format` | enum | No | Output format | "json" (default) or "markdown" |
| `env.account` | string | No | Use specified account | Empty string '' uses default account |
| `env.network` | enum | No | Network selection | "localnet" or "testnet" |
| `env.no_cache` | boolean | No | Disable caching | true=bypass cache |

### Important Notes

⚠️ **This is a read-only operation!** Does not modify any on-chain state.

⚠️ **Use names instead of 0x addresses!** Reference Machines by name for clarity.

⚠️ **Exported file matches node structure!** The output format is compatible with "Node File Replacement" (Sub-feature 11).

### Return Result

Returns the exported file path, format, Machine object, and node count:

```json
{
  "result": {
    "status": "success",
    "data": {
      "file_path": "d:/wowok/exported_nodes.json",
      "format": "json",
      "machine_object": "design_workflow",
      "node_count": 8
    }
  }
}
```

---

### Examples

#### Example 20.1: Export to JSON (Default Format)

**Prompt**: Export the node definition from "design_workflow" to the file "d:/wowok/exported_nodes.json".

```json
{
  "machine": "design_workflow",
  "file_path": "d:/wowok/exported_nodes.json"
}
```

#### Example 20.2: Export to Markdown Format

**Prompt**: Export "design_workflow" nodes to "design_nodes.md" in Markdown format for documentation and sharing.

```json
{
  "machine": "design_workflow",
  "file_path": "design_nodes.md",
  "format": "markdown"
}
```

#### Example 20.3: Export with Custom Network

**Prompt**: Export "public_template" Machine from testnet to "template_backup.json".

```json
{
  "machine": "public_template",
  "file_path": "template_backup.json",
  "format": "json",
  "env": {
    "network": "testnet"
  }
}
```

#### Example 20.4: Workflow Reuse Pattern

**Prompt**: Export "proven_workflow" nodes, edit to create a new variant, then use Sub-feature 11 to import into a new Machine.

Step 1: Export
```json
{
  "machine": "proven_workflow",
  "file_path": "workflow_template.json"
}
```

Step 2: Edit `workflow_template.json` (modify nodes as needed)

Step 3: Import into new Machine (see Sub-feature 11)
```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "new_workflow_variant"
    }
  },
  "json_or_markdown_file": "workflow_template.json"
}
```

---

## Best Practices

### 1. Design Workflow Before Publishing

Map out your complete workflow on paper or a diagram before creating nodes. Verify all paths make sense.

### 2. Use Meaningful Node Names

Choose descriptive names like "client_review" instead of "step3" to make the workflow self-documenting.

### 3. Plan Permission Strategy

Decide whether to use `permissionIndex` (shared across all Progress) or `namedOperator` (Progress-specific) based on your use case.

### 4. Use Guards for Critical Steps

Add Guard verification to important transitions (like payment before completion) for additional security.

### 5. Set Thresholds Thoughtfully

Thresholds enable multi-signature workflows. Use threshold > 1 when multiple approvals are needed.

### 6. Test on Unpublished Machine

Add all nodes, test the logic, and verify connections BEFORE publishing. You can't change nodes after publishing.

### 7. Use Export and Import for Workflow Reuse

Export proven workflows using [Sub-feature 20](#sub-feature-20-export-node-definitions-with-machinenode2file), then import them via [Sub-feature 11](#sub-feature-11-complete-node-replacement-via-file-json_or_markdown_file) to quickly create new workflow variants. This pattern eliminates redundant work and ensures consistency across similar workflows.

### 8. Add Clear Descriptions

Document what the Machine does, what each node represents, and any special considerations.

---

## Important Notes

⚠️ **PUBLISHING IS IRREVERSIBLE!** Nodes cannot be modified after publishing.

⚠️ **Machine must be published to create Progress!** Unpublished Machines are only for design.

⚠️ **Node names must be unique!** Duplicate names cause errors.

⚠️ **Choose ONE permission type per forward!** Either `namedOperator` OR `permissionIndex`, not both.

⚠️ **Threshold is compared against total forward weight!** When sum(forward weights) >= threshold, workflow advances.

⚠️ **json_or_markdown_file replaces ALL nodes!** This is a destructive operation.

⚠️ **Pause only affects NEW Progress!** Existing Progress continues normally.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Progress](progress.md)** | Order progress - executes the Machine workflow (active instances) |
| **[Service](service.md)** | WYSIWYG product trading - binds Machine workflows to service offerings |
| **[Permission](permission.md)** | Permission management - manages access control for Machine operations |
| **[Repository](repository.md)** | Data ownership and usage rights - stores consensus data for workflow state |
| **[Guard](guard.md)** | Trust verification engine - provides additional validation for forward operations |
