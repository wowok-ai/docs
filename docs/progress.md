# Progress Component (🔄 Workflow Execution)

---

## Component Overview

Progress is WoWok's workflow execution component, used to execute workflow instances created by Machine. Progress tracks the execution status of workflows, manages node transitions, and records execution history.

> **✅ Issues Resolved (Last Updated: 2025-04-21)**:
> - ~~Progress Operate Issue~~: Fixed in SDK v2.1.28. The `operate` function now correctly handles forward operations.
> - ~~Task Setting Issue~~: Task field validation has been fixed.
>
> **Note**: Progress workflow execution is now fully functional. All operations including forward execution, hold/accomplish modes, and admin unhold are working correctly.

> **Relationship with Machine**: Progress is an instance of a Machine workflow template. Before creating a Progress:
> 1. Create and configure a Machine with nodes and forwards
> 2. **Ensure first node has init connection**: The first node must have `prev_node: ""` to allow Progress to start from the init node
> 3. Publish the Machine (required before Progress creation)
> 4. Grant permissions to operators (permissionIndex or namedOperator)
> 5. Then create Progress from the Machine
>
> **Understanding Init Node**: When a Progress is created, its `current` field is set to `""` (empty string), representing the init node. To advance to the first actual node, the Machine must define a forward with `prev_node: ""`. See [Machine Component](machine.md) for details on init node configuration.

### Permission Requirements for Progress Operations

To execute a forward operation in Progress, the operator must have the required permission as defined in the Machine node:

**If the forward uses `permissionIndex`:**
- The operator must be granted that permission index in the Machine's Permission object
- Grant permission using the `permission` operation with `table.op: "add perm by entity"`
- Valid permissionIndex values: 1000-65535 (user-defined) or appropriate built-in permissions (100-450+)
- **Note**: Machine management permissions (200-208) and Progress management permissions (220-225) are NOT valid for forward operations

**If the forward uses `namedOperator`:**
- Use `progress_namedOperator` to add/set operators for the specific namespace
- Each Progress instance can have different operators for the same namespace
- More flexible for dynamic team assignments

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Create Progress** | Create new Progress from Machine | Start workflow execution from template | Entry point for all workflow executions |
| **Object Reference** | Identify which Progress to operate on | Target specific workflow execution | Foundation for all Progress operations - defines which workflow instance to modify |
| **Progress Operations (Accomplish)** | Execute forward and advance node | Complete workflow steps, move to next state | Core of workflow execution - processes transitions normally |
| **Progress Operations (Hold)** | Lock operation at current node | Pause for review, prevent race conditions | Controls workflow execution flow and avoids conflicts |
| **Progress Operations (Admin Unhold)** | Force unlock from hold state | Admin intervention, override holds | Provides emergency override capabilities |
| **Named Operator Management** | Add/set/remove named operators | Dynamic permission assignment, team changes | Provides flexible access control for workflow stages |
| **Set Task** | Associate Progress with a Task object | Link workflow to order, service request | Establishes relationship between workflow execution and business entities |
| **Repository Management** | Attach/remove/clear Repository objects | Store execution data, state, deliverables | Enables data persistence during workflow execution |

---

## Schema Tree (4-Level Structure)

```
progress
├── operation_type: "progress" | "machine"
├── data
│   ├── object (string, name or address) - Progress name/ID for "progress" op; Machine name/ID for "machine" op
│   ├── progress_new (object, optional) - Only for "machine" operation_type
│   │   ├── namedNew (object, optional)
│   │   │   ├── name (string, optional)
│   │   │   └── tags (array of strings, optional)
│   │   ├── task (string or null, optional)
│   │   ├── repository (object, optional)
│   │   │   └── op: "add" | "set"
│   │   │       └── objects (array of strings)
│   │   └── progress_namedOperator (object, optional)
│   │       ├── op: "set"
│   │       ├── name (string)
│   │       └── operators (object)
│   │           └── entities (array)
│   ├── task (string, optional)
│   ├── repository (object, optional)
│   │   ├── op: "add" or "set"
│   │   │   └── objects (array of strings)
│   │   ├── op: "remove"
│   │   │   └── objects (array of strings)
│   │   └── op: "clear"
│   ├── progress_namedOperator (object, optional)
│   │   ├── op: "add" | "set" | "remove"
│   │   ├── name (string)
│   │   └── operators (object)
│   │       ├── entities (array)
│   │       └── check_all_founded (boolean, optional)
│   └── operate (object, optional)
│       ├── operation (object)
│       │   ├── next_node_name (string) - Target node name to advance to
│       │   └── forward (string) - Forward operation name defined in Machine
│       ├── hold (boolean, optional) - Lock operation permission
│       │   - When true: locks permission to prevent competition
│       │   - When false or omitted: submits operation result directly
│       ├── adminUnhold (boolean, optional) - Allow admin to force unlock (only when hold=true)
│       └── message (string, optional) - Operation result message
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

Progress operations use the following top-level structure:

```json
{
  "operation_type": "progress",
  "data": { ... },
  "env": { ... },
  "submission": { ... }
}
```

---

## Sub-feature 1: Create Progress (progress_new)

### Feature Description

Progress instances are created from published Machine objects. Before creating a Progress, ensure:
1. The Machine is published (only published Machines can create Progress)
2. You have the necessary permissions to create Progress from this Machine
3. The Machine's nodes are properly configured with init node connections (`prev_node: ""`)

### Parameter Description

| Parameter Path | Type | Required | Description |
|------|------|------|------|
| `object` | string | Yes | Machine name or ID to create Progress from |
| `progress_new` | object | Yes | Progress creation configuration |
| `progress_new.namedNew.name` | string | No | Name for the new Progress |
| `progress_new.namedNew.tags` | array | No | Tags for the Progress |
| `progress_new.task` | string/null | No | Task object to bind (optional) |
| `progress_new.repository` | object | No | Context repositories configuration |
| `progress_new.progress_namedOperator` | object | No | Named operators assignment |

### Important Notes

⚠️ **Machine must be published!** Only published Machines can create Progress objects.

⚠️ **Progress starts at init node!** When created, Progress's `current` field is set to `""` (empty string). You need a forward with `prev_node: ""` in the Machine to advance to the first actual node.

⚠️ **Named operators are Progress-specific!** Each Progress can have different operators for the same namedOperator namespace.

### Examples

#### Example 1.1: Create Simple Progress

**Prompt**: Create a new Progress from "sdlc_workflow_v2" Machine.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "sdlc_workflow_v2",
    "progress_new": {}
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
  "message": "Transaction completed successfully",
  "result": [
    {
      "type": "Progress",
      "object": "0x147f5f648a6e993bc5c29ae3a8143b8b5cb2b54a45cecb8ef1f81cf545292a5b",
      "change": "created"
    }
  ]
}
```

#### Example 1.2: Create Named Progress

**Prompt**: Create a Progress named "project_gamma" with tags ["mobile", "ecommerce"].

```json
{
  "operation_type": "machine",
  "data": {
    "object": "sdlc_workflow_v2",
    "progress_new": {
      "namedNew": {
        "name": "project_gamma",
        "tags": ["mobile", "ecommerce"]
      }
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

#### Example 1.3: Create Progress with Named Operators

**Prompt**: Create a Progress and assign "dev_lead_carol" as operator for the "developer" namespace.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "sdlc_workflow_v2",
    "progress_new": {
      "namedNew": {
        "name": "project_delta"
      },
      "progress_namedOperator": {
        "op": "set",
        "name": "developer",
        "operators": {
          "entities": [
            {"name_or_address": "dev_lead_carol"}
          ]
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

---

## Sub-feature 2: Operate Progress (operate)

### Feature Description

Advance Progress to the next node by executing node transition operations. There are two modes:
- **Hold mode** (`hold: true`): Lock operation permission to avoid competition
- **Accomplish mode** (`hold: false`): Submit operation result and advance

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `operate.operation.next_node_name` | string | Yes | Target node name |
| `operate.operation.forward` | string | Yes | Forward operation name |
| `operate.hold` | boolean | No | Whether to hold at current node. When true, locks permission; when false or omitted, submits result directly |
| `operate.adminUnhold` | boolean | No | Allow admin to force unlock (only when hold=true) |
| `operate.message` | string | No | Operation message |

### Important Notes

⚠️ **Must have permission to execute the forward operation**.

⚠️ **Must meet the threshold requirements of the forward operation**.

⚠️ **Progress can only advance to the next node defined by the forward operation**.

⚠️ **Task cannot be changed after setting**.

### Examples

#### Example 2.1: Advance from Init Node (First Step)

**Prompt**: Advance "project_gamma" from init node (current: "") to "requirement" node using forward "start_project". This is the first step in the workflow.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_gamma",
    "operate": {
      "operation": {
        "next_node_name": "requirement",
        "forward": "start_project"
      },
      "message": "Starting new project from init node"
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet",
    "no_cache": true
  }
}
```

> **💡 Tip**: The `hold` parameter is optional. When omitted or set to false, the operation submits the result directly and advances to the next node. Set `hold: true` only when you need to lock the operation permission.

**Prerequisites**:
1. Machine must have a node "requirement" with `prev_node: ""` and forward "start_project"
2. Progress "project_gamma" was created from this Machine
3. Progress's `current` field is `""` (init node)
4. Operator has required permission for forward "start_project"

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": [
    {
      "type": "Progress",
      "object": "0x147f5f648a6e993bc5c29ae3a8143b8b5cb2b54a45cecb8ef1f81cf545292a5b",
      "change": "mutated"
    }
  ]
}
```

> **Note**: After execution, the Progress's `current` field will change from `""` to `"requirement"`, and a history entry will be recorded.

---

#### Example 2.2: Execute Accomplish Operation (No Hold)

**Prompt**: Advance "project_alpha" from current node (requirement) to "design" using forward "submit_design", with message "Requirements approved, proceeding to design phase" and no hold.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "operate": {
      "operation": {
        "next_node_name": "design",
        "forward": "submit_design"
      },
      "message": "Requirements approved, proceeding to design phase"
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet",
    "no_cache": true
  }
}
```

> **💡 Tip**: Set `env.no_cache: true` to ensure fresh data is fetched from the blockchain for each operation. This is especially important when executing multiple Progress operations in sequence.

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": [
    {
      "type": "Progress",
      "type_raw": "0x2::progress::Progress",
      "object": "0x28d5f8d9cc3f4e2082827140739ee29b6e33125f7eeb586690a786cdb00bfe3f",
      "version": "644547",
      "owner": {
        "Shared": {
          "initial_shared_version": 639744
        }
      },
      "change": "mutated"
    },
    {
      "type": "TableItem_ProgressHistory",
      "type_raw": "0x2::dynamic_field::Field<u64, 0x2::progress::History>",
      "object": "0x20fe9fed2c2f7645dee9cf8b8c4148e13b399917ef1df7f12895fa32f838cb2a",
      "version": "650074",
      "owner": {
        "ObjectOwner": "0x28d5f8d9cc3f4e2082827140739ee29b6e33125f7eeb586690a786cdb00bfe3f"
      },
      "change": "created"
    }
  ]
}
```

> **Important Note**: The forward name must exactly match the forward name defined in the Machine node. The system queries the Machine node by `next_node_name`, then looks for a pair where `prev_node` matches the current node, and finally finds the forward with matching name.

**Prerequisites**: 
1. The Machine must be published
2. The Progress must be created from the Machine
3. The operator must have the required permission (permissionIndex or namedOperator)
4. The forward name must exactly match the name defined in the Machine node

#### Example 2.3: Execute Hold Operation

**Prompt**: Advance "project_alpha" from "design" to "development" using forward "start_development", hold at this node for architect review, with message "Design completed, awaiting architect approval".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "operate": {
      "operation": {
        "next_node_name": "development",
        "forward": "start_development"
      },
      "hold": true,
      "message": "Design completed, awaiting architect approval"
    }
  },
  "env": {
    "account": "arch_bob",
    "network": "testnet",
    "no_cache": true
  }
}
```

> **💡 Tip**: When `hold: true`, the operation locks the permission at the current node, preventing other operators from executing competing operations. Use `adminUnhold: true` to allow admin override.

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": [
    {
      "type": "Progress",
      "type_raw": "0x2::progress::Progress",
      "object": "0x28d5f8d9cc3f4e2082827140739ee29b6e33125f7eeb586690a786cdb00bfe3f",
      "version": "644547",
      "owner": {
        "Shared": {
          "initial_shared_version": 639744
        }
      },
      "change": "mutated"
    },
    {
      "type": "TableItem_ProgressHistory",
      "type_raw": "0x2::dynamic_field::Field<u64, 0x2::progress::History>",
      "object": "0x1099682492f682addbd65091eadee32c2dc7cdd4dc517672a72485aa517e0649",
      "version": "648986",
      "owner": {
        "ObjectOwner": "0x28d5f8d9cc3f4e2082827140739ee29b6e33125f7eeb586690a786cdb00bfe3f"
      },
      "change": "created"
    }
  ]
}
```

#### Example 2.4: Admin Unhold Operation

**Prompt**: Admin unlock "project_alpha" from hold state, allowing it to advance to "code_review" using forward "submit_code", with message "Design approved by admin, proceeding to development".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "operate": {
      "operation": {
        "next_node_name": "code_review",
        "forward": "submit_code"
      },
      "hold": true,
      "adminUnhold": true,
      "message": "Design approved by admin, proceeding to development"
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet",
    "no_cache": true
  }
}
```

> **💡 Tip**: Use `adminUnhold: true` when you need to override a held operation. This requires admin privileges and should be used for emergency interventions or when the original operator is unavailable.

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": [
    {
      "type": "Progress",
      "type_raw": "0x2::progress::Progress",
      "object": "0x28d5f8d9cc3f4e2082827140739ee29b6e33125f7eeb586690a786cdb00bfe3f",
      "version": "644547",
      "owner": {
        "Shared": {
          "initial_shared_version": 639744
        }
      },
      "change": "mutated"
    },
    {
      "type": "TableItem_ProgressHistory",
      "type_raw": "0x2::dynamic_field::Field<u64, 0x2::progress::History>",
      "object": "0xfe3a2f01d9f8d00f9755c783b2bbdb9e0a67eff31160bb079e18e38364c30369",
      "version": "648986",
      "owner": {
        "ObjectOwner": "0x28d5f8d9cc3f4e2082827140739ee29b6e33125f7eeb586690a786cdb00bfe3f"
      },
      "change": "created"
    }
  ]
}
```

#### Example 2.5: Using NamedOperator Forward

**Prompt**: Developer "dev_lead_carol" advances "project_alpha" from "code_review" to "testing" using forward "submit_code" (which uses namedOperator "developer").

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "operate": {
      "operation": {
        "next_node_name": "testing",
        "forward": "submit_code"
      },
      "hold": false,
      "message": "Code submitted for review"
    }
  },
  "env": {
    "account": "dev_lead_carol",
    "network": "testnet"
  }
}
```

**Prerequisites**: The operator "dev_lead_carol" must be registered as a named operator for the "developer" namespace in this Progress instance.

---

## Sub-feature 3: Manage Named Operators (progress_namedOperator)

### Feature Description

Manage named operators of Progress, used for dynamic permission assignment. Each Progress instance can have different operators for the same namespace, providing flexibility for dynamic team assignments.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `progress_namedOperator.op` | string | Yes | Operation type: add/set/remove |
| `progress_namedOperator.name` | string | Yes | Namespace name |
| `progress_namedOperator.operators` | object | Yes | Operator list configuration |
| `progress_namedOperator.operators.entities` | array | Yes | Entity list with name_or_address |
| `progress_namedOperator.operators.check_all_founded` | boolean | No | Check all entities are found |

### Operation Type Description

| Operation Type | Description |
|----------|------|
| `add` | Add new operators to the namespace |
| `set` | Set (replace) operators in the namespace |
| `remove` | Remove operators from the namespace |

### Examples

#### Example 3.1: Set Named Operators (Initial Assignment)

**Prompt**: Set "developer" namespace to have "dev_lead_carol" as the operator for "project_alpha".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "progress_namedOperator": {
      "op": "set",
      "name": "developer",
      "operators": {
        "entities": [
          { "name_or_address": "dev_lead_carol" }
        ],
        "check_all_founded": true
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
  "message": "Transaction completed successfully",
  "result": {
    "type": "transaction",
    "objectChanges": [
      {
        "type": "Progress",
        "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
        "version": "523550",
        "change": "mutated"
      }
    ]
  }
}
```

#### Example 3.2: Add Named Operators

**Prompt**: Add "arch_bob" as an additional developer to "project_alpha" for collaborative development.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "progress_namedOperator": {
      "op": "add",
      "name": "developer",
      "operators": {
        "entities": [
          { "name_or_address": "arch_bob" }
        ],
        "check_all_founded": true
      }
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

#### Example 3.3: Remove Named Operators

**Prompt**: Remove "arch_bob" from "developer" namespace after their task is completed.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "progress_namedOperator": {
      "op": "remove",
      "name": "developer",
      "operators": {
        "entities": [
          { "name_or_address": "arch_bob" }
        ],
        "check_all_founded": false
      }
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

#### Example 3.4: Multiple Named Operators

**Prompt**: Set multiple developers for "project_beta" to enable team collaboration.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_beta",
    "progress_namedOperator": {
      "op": "set",
      "name": "developer",
      "operators": {
        "entities": [
          { "name_or_address": "arch_bob" },
          { "name_or_address": "dev_lead_carol" },
          { "name_or_address": "test_lead_dave" }
        ],
        "check_all_founded": true
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

## Sub-feature 4: Set Task (task)

### Feature Description

Set the task ID of Progress for associating with other objects. Task cannot be changed after setting. This is typically used to link a Progress to an Order, Service, or other business entities.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `task` | string | Yes | Task ID (name or address) |

### Important Notes

⚠️ **Task cannot be changed after setting**.

### Examples

#### Example 4.1: Set Task ID

**Prompt**: Set task "mobile_app_order_001" for "project_alpha" to link it with the corresponding order.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "task": "mobile_app_order_001"
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

> **💡 Tip**: The `task` field can be set during Progress creation via `progress_new.task` or updated later using this operation. Once set, the task cannot be changed.

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": {
    "type": "transaction",
    "objectChanges": [
      {
        "type": "Progress",
        "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
        "version": "523551",
        "change": "mutated"
      }
    ]
  }
}
```

#### Example 4.2: Set Task with Service Reference

**Prompt**: Link "project_beta" to service "web_development_service".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_beta",
    "task": "web_development_service"
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

---

## Sub-feature 5: Manage Repository (repository)

### Feature Description

Manage repositories of Progress for storing workflow-related data. Repositories can store deliverables, documents, configuration, and other project artifacts.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `repository.op` | string | Yes | Operation type: add/set/remove/clear |
| `repository.objects` | array | Required for add/set/remove | Repository list |

### Operation Type Description

| Operation Type | Description |
|----------|------|
| `add` | Add new repositories to the existing list |
| `set` | Set (replace) the complete repository list |
| `remove` | Remove specified repositories from the list |
| `clear` | Clear all repositories |

### Examples

#### Example 5.1: Add Repositories

**Prompt**: Add "project_alpha_specs" and "project_alpha_assets" repositories to "project_alpha" for storing specifications and design assets.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "repository": {
      "op": "add",
      "objects": ["project_alpha_specs", "project_alpha_assets"]
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
  "message": "Transaction completed successfully",
  "result": {
    "type": "transaction",
    "objectChanges": [
      {
        "type": "Progress",
        "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
        "version": "523552",
        "change": "mutated"
      }
    ]
  }
}
```

#### Example 5.2: Set Repositories

**Prompt**: Set "project_alpha" repositories to exactly ["project_alpha_code", "project_alpha_docs"], replacing any existing ones.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "repository": {
      "op": "set",
      "objects": ["project_alpha_code", "project_alpha_docs"]
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

#### Example 5.3: Remove Repositories

> **⚠️ Note**: The `remove` operation may have limitations on the number of objects that can be removed at once. If you encounter errors, consider using `set` or `clear` operations instead.

**Prompt**: Remove "project_alpha_specs" repository from "project_alpha".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "repository": {
      "op": "remove",
      "objects": ["project_alpha_specs"]
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

#### Example 5.4: Clear All Repositories

**Prompt**: Clear all repositories from "project_alpha" after project completion.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "repository": {
      "op": "clear"
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

---

## Sub-feature 6: Combined Operations

### Feature Description

Execute multiple operations in one call to the Progress object. This is useful for complex workflow transitions that require updating multiple aspects simultaneously.

### Examples

#### Example 6.1: Complete Progress Workflow with All Features

**Prompt**: For "project_alpha": 1) Set task "mobile_app_order_001", 2) Add "project_alpha_deliverables" repository, 3) Add "test_lead_dave" to "reviewers" namespace, 4) Advance to "testing" node with forward "approve_code", hold=false, message "Code review passed, moving to testing phase".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "task": "mobile_app_order_001",
    "repository": {
      "op": "add",
      "objects": ["project_alpha_deliverables"]
    },
    "progress_namedOperator": {
      "op": "add",
      "name": "reviewers",
      "operators": {
        "entities": [
          { "name_or_address": "test_lead_dave" }
        ],
        "check_all_founded": true
      }
    },
    "operate": {
      "operation": {
        "next_node_name": "testing",
        "forward": "approve_code"
      },
      "hold": false,
      "message": "Code review passed, moving to testing phase"
    }
  },
  "env": {
    "account": "dev_lead_carol",
    "network": "testnet"
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
        "type": "Progress",
        "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
        "version": "523553",
        "change": "mutated"
      }
    ]
  }
}
```

#### Example 6.2: Hold and Set Operators Together

**Prompt**: For "project_alpha": 1) Hold at "uat" node with forward "pass_testing", 2) Add "customer_eve" to "approvers" namespace for UAT approval.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "progress_namedOperator": {
      "op": "add",
      "name": "approvers",
      "operators": {
        "entities": [
          { "name_or_address": "customer_eve" }
        ],
        "check_all_founded": true
      }
    },
    "operate": {
      "operation": {
        "next_node_name": "uat",
        "forward": "pass_testing"
      },
      "hold": true,
      "message": "Testing completed, awaiting UAT approval"
    }
  },
  "env": {
    "account": "test_lead_dave",
    "network": "testnet"
  }
}
```

#### Example 6.3: Project Initialization with Multiple Setup Steps

**Prompt**: Initialize "project_gamma" with task, repositories, and named operators in one operation.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_gamma",
    "task": "ecommerce_platform_order",
    "repository": {
      "op": "set",
      "objects": ["project_gamma_specs", "project_gamma_designs", "project_gamma_code"]
    },
    "progress_namedOperator": {
      "op": "set",
      "name": "developer",
      "operators": {
        "entities": [
          { "name_or_address": "dev_lead_carol" },
          { "name_or_address": "arch_bob" }
        ],
        "check_all_founded": true
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

## Real-World Example: Project Alpha - Complete SDLC Execution

> **✅ All Features Operational**: This section demonstrates a complete, working workflow for Progress execution. All features including `operate` and `task` functions are fully functional as of SDK v2.1.29.
>
> **Verified Working Features**:
> - Progress creation from Machine
> - Progress operate (forward execution with hold/accomplish modes)
> - Named operator management (set/add/remove)
> - Repository management (add/set/clear)
> - Task setting and association

This section demonstrates a complete, real-world implementation of executing a software development workflow using the Progress component. The examples are based on the Machine workflow created in the [Machine Component documentation](machine.md).

### Project Overview

**Project Name**: Project Alpha - Mobile App Development  
**Machine**: software_dev_workflow (8-node SDLC workflow)  
**Progress Address**: 0x5255...9cb4  
**Team Structure**:
- Product Manager (pm_alice) - Requirements approval
- Architect (arch_bob) - Design approval  
- Development Lead (dev_lead_carol) - Code review and deployment
- Test Lead (test_lead_dave) - Testing approval
- Customer (customer_eve) - UAT approval

### Workflow Nodes

```
requirement → design → development → code_review → testing → uat → deployment → completed
```

### Prerequisites

Before executing Progress operations, ensure you have:

1. **Created and Published Machine**: `software_dev_workflow` (see [Machine Component](machine.md))
2. **Created Progress Instance**: `project_alpha` with initial named operator
3. **Granted Permissions**: Team members have appropriate permission indexes in the Permission object
4. **Funded Accounts**: All team accounts have sufficient test coins

### Step-by-Step Execution

#### Step 1: Create Progress from Machine

First, create a Progress instance from the published Machine:

```json
{
  "operation_type": "machine",
  "data": {
    "object": "software_dev_workflow",
    "progress_new": {
      "namedNew": {
        "name": "project_alpha",
        "tags": ["mobile", "ecommerce"]
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
  "message": "Transaction completed successfully",
  "result": [
    {
      "type": "Progress",
      "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
      "change": "created"
    }
  ]
}
```

#### Step 2: Initial Progress State

After creation, `project_alpha` starts at the **init node** (`""`):

```json
{
  "progress_name": "project_alpha",
  "current_node": "",
  "machine": "software_dev_workflow",
  "named_operators": {},
  "repositories": [],
  "task": null
}
```

> **Note**: The empty string `""` represents the init node. Progress always starts here when created.

#### Step 3: Advance from Init Node to Requirement

Execute the first forward to move from init node to "requirement" node:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "operate": {
      "operation": {
        "next_node_name": "requirement",
        "forward": "start_project"
      },
      "hold": false,
      "message": "Starting Project Alpha - Mobile e-commerce app development"
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

**Prerequisites**:
- Machine must have "requirement" node with `prev_node: ""` and forward "start_project"
- Operator (pm_alice) must have permission for forward "start_project"

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": [
    {
      "type": "Progress",
      "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
      "change": "mutated"
    }
  ]
}
```

After execution, `current_node` changes from `""` to `"requirement"`.

#### Step 4: Set Task and Repositories

Link the Progress to the order and set up data repositories:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "task": "mobile_app_order_001",
    "repository": {
      "op": "set",
      "objects": [
        "alpha_requirements",
        "alpha_designs", 
        "alpha_code",
        "alpha_test_reports"
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
  "message": "Transaction completed successfully",
  "result": {
    "type": "transaction",
    "objectChanges": [
      {
        "type": "Progress",
        "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
        "version": "523554",
        "change": "mutated"
      }
    ]
  }
}
```

#### Step 5: Requirements to Design (PM Approval)

Product Manager approves requirements and advances to design phase:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "operate": {
      "operation": {
        "next_node_name": "design",
        "forward": "submit_design"
      },
      "hold": false,
      "message": "Requirements approved. Scope: Mobile e-commerce app with payment integration. Budget: $50,000. Timeline: 3 months."
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
  "message": "Transaction completed successfully",
  "result": {
    "type": "transaction",
    "objectChanges": [
      {
        "type": "Progress",
        "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
        "version": "523555",
        "change": "mutated",
        "current_node": "design"
      }
    ]
  }
}
```

#### Step 6: Design to Development (Architect Approval)

Architect reviews design and approves proceeding to development:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "operate": {
      "operation": {
        "next_node_name": "development",
        "forward": "start_development"
      },
      "hold": false,
      "message": "Architecture design approved. Tech stack: React Native + Node.js + PostgreSQL. Microservices architecture with 3 services."
    }
  },
  "env": {
    "account": "arch_bob",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": {
    "type": "transaction",
    "objectChanges": [
      {
        "type": "Progress",
        "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
        "version": "523556",
        "change": "mutated",
        "current_node": "development"
      }
    ]
  }
}
```

#### Step 7: Add Additional Developer

Add another developer to the project for faster delivery:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "progress_namedOperator": {
      "op": "add",
      "name": "developer",
      "operators": {
        "entities": [
          { "name_or_address": "arch_bob" }
        ],
        "check_all_founded": true
      }
    }
  },
  "env": {
    "account": "pm_alice",
    "network": "testnet"
  }
}
```

#### Step 8: Development to Code Review (Developer Submission)

Developer submits code for review using namedOperator:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "operate": {
      "operation": {
        "next_node_name": "code_review",
        "forward": "submit_code"
      },
      "hold": true,
      "message": "Initial implementation complete. Features: User auth, product catalog, shopping cart. 85% test coverage."
    }
  },
  "env": {
    "account": "dev_lead_carol",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": {
    "type": "transaction",
    "objectChanges": [
      {
        "type": "Progress",
        "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
        "version": "523557",
        "change": "mutated",
        "current_node": "code_review",
        "hold_status": "held"
      }
    ]
  }
}
```

#### Step 9: Code Review to Testing (Dev Lead Approval)

Development lead reviews and approves code:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "operate": {
      "operation": {
        "next_node_name": "testing",
        "forward": "approve_code"
      },
      "hold": false,
      "message": "Code review passed. All critical issues resolved. Ready for QA testing."
    }
  },
  "env": {
    "account": "dev_lead_carol",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": {
    "type": "transaction",
    "objectChanges": [
      {
        "type": "Progress",
        "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
        "version": "523558",
        "change": "mutated",
        "current_node": "testing"
      }
    ]
  }
}
```

#### Step 10: Testing to UAT (Test Lead Approval)

QA testing complete, move to User Acceptance Testing:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "repository": {
      "op": "add",
      "objects": ["alpha_qa_report_v1"]
    },
    "operate": {
      "operation": {
        "next_node_name": "uat",
        "forward": "pass_testing"
      },
      "hold": false,
      "message": "QA testing complete. 47 test cases passed, 0 critical bugs, 2 minor UI issues documented."
    }
  },
  "env": {
    "account": "test_lead_dave",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": {
    "type": "transaction",
    "objectChanges": [
      {
        "type": "Progress",
        "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
        "version": "523559",
        "change": "mutated",
        "current_node": "uat"
      }
    ]
  }
}
```

#### Step 11: UAT to Deployment (Customer Approval)

Customer approves UAT and authorizes deployment:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "operate": {
      "operation": {
        "next_node_name": "deployment",
        "forward": "approve_uat"
      },
      "hold": false,
      "message": "UAT approved. All acceptance criteria met. Payment flow verified with test transactions. Ready for production."
    }
  },
  "env": {
    "account": "customer_eve",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": {
    "type": "transaction",
    "objectChanges": [
      {
        "type": "Progress",
        "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
        "version": "523560",
        "change": "mutated",
        "current_node": "deployment"
      }
    ]
  }
}
```

#### Step 10: Deployment to Completed (Dev Lead)

Final deployment to production:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "project_alpha",
    "repository": {
      "op": "add",
      "objects": ["alpha_deployment_logs", "alpha_production_config"]
    },
    "operate": {
      "operation": {
        "next_node_name": "completed",
        "forward": "deploy_production"
      },
      "hold": false,
      "message": "Successfully deployed to production. App Store: v1.0.0 live. Play Store: v1.0.0 live. Monitoring active."
    }
  },
  "env": {
    "account": "dev_lead_carol",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "message": "Transaction completed successfully",
  "result": {
    "type": "transaction",
    "objectChanges": [
      {
        "type": "Progress",
        "object": "0x5255787477424a2d17b8b9902957aaaf1f196d0c8a382ef52876153895dd9cb4",
        "version": "523561",
        "change": "mutated",
        "current_node": "completed"
      }
    ]
  }
}
```

### Final Progress State

```json
{
  "progress_name": "project_alpha",
  "current_node": "completed",
  "machine": "software_dev_workflow",
  "named_operators": {
    "developer": ["dev_lead_carol", "arch_bob"]
  },
  "repositories": [
    "alpha_requirements",
    "alpha_designs",
    "alpha_code",
    "alpha_test_reports",
    "alpha_qa_report_v1",
    "alpha_deployment_logs",
    "alpha_production_config"
  ],
  "task": "mobile_app_order_001",
  "execution_history": [
    { "from": "", "to": "requirement", "by": "pm_alice", "forward": "start_project" },
    { "from": "requirement", "to": "design", "by": "pm_alice", "forward": "submit_design" },
    { "from": "design", "to": "development", "by": "arch_bob", "forward": "start_development" },
    { "from": "development", "to": "code_review", "by": "dev_lead_carol", "forward": "submit_code" },
    { "from": "code_review", "to": "testing", "by": "dev_lead_carol", "forward": "approve_code" },
    { "from": "testing", "to": "uat", "by": "test_lead_dave", "forward": "pass_testing" },
    { "from": "uat", "to": "deployment", "by": "customer_eve", "forward": "approve_uat" },
    { "from": "deployment", "to": "completed", "by": "dev_lead_carol", "forward": "deploy_production" }
  ]
}
```

### Summary of Project Alpha Execution

| Step | From Node | To Node | Operator | Forward | Duration |
|------|-----------|---------|----------|---------|----------|
| 0 | init ("") | requirement | pm_alice | start_project | Day 0 |
| 1 | requirement | design | pm_alice | submit_design | Day 1 |
| 2 | design | development | arch_bob | start_development | Day 5 |
| 3 | development | code_review | dev_lead_carol | submit_code | Day 25 |
| 4 | code_review | testing | dev_lead_carol | approve_code | Day 28 |
| 5 | testing | uat | test_lead_dave | pass_testing | Day 35 |
| 6 | uat | deployment | customer_eve | approve_uat | Day 40 |
| 7 | deployment | completed | dev_lead_carol | deploy_production | Day 42 |

**Total Project Duration**: 42 days  
**Team Members Involved**: 5  
**Workflow Transitions**: 8 (including init → requirement)  
**Repositories Created**: 7  
**Status**: ✅ Successfully Completed

---

## Quick Start Guide

### For New Users: Your First Progress Workflow

Follow these steps to execute your first workflow:

#### Step 1: Prerequisites Checklist

Before starting, ensure you have:
- ✅ A published Machine with properly configured nodes (including `prev_node: ""` for the first node)
- ✅ Permission to create Progress from the Machine
- ✅ Permission to execute forward operations
- ✅ Sufficient test coins for transaction fees

#### Step 2: Create Progress

```json
{
  "operation_type": "machine",
  "data": {
    "object": "your_machine_name",
    "progress_new": {
      "namedNew": {
        "name": "my_first_progress"
      }
    }
  },
  "env": {
    "account": "your_account",
    "network": "testnet"
  }
}
```

#### Step 3: Advance from Init Node

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_first_progress",
    "operate": {
      "operation": {
        "next_node_name": "first_node",
        "forward": "start"
      },
      "hold": false,
      "message": "Starting workflow"
    }
  },
  "env": {
    "account": "your_account",
    "network": "testnet"
  }
}
```

> **Important**: The first forward must use `next_node_name` of the first node and `forward` name defined with `prev_node: ""` in the Machine.

#### Step 4: Continue Workflow

Repeat the operate operation for each subsequent node transition.

---

## Important Notes

⚠️ **Must have permission to execute forward operations**.

⚠️ **Progress starts at init node ("") and needs `prev_node: ""` forward to reach first node**.

⚠️ **Progress can only advance to nodes defined by forward operations**.

⚠️ **Named operators are used for dynamic permission assignment**.

⚠️ **Task is used for associating with other objects and cannot be changed after setting**.

⚠️ **Repositories are used for storing workflow-related data**.

⚠️ **Progress is created by Machine and cannot be created independently**.

⚠️ **Hold mode locks operation permission to avoid competition**.

⚠️ **AdminUnhold allows admin to force unlock (requires admin privileges)**.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Machine](machine.md)** | Workflow template |
| **[Service](service.md)** | WYSIWYG product trading |
| **[Order](order.md)** | Order management |
| **[Permission](permission.md)** | Permission management |
| **[Repository](repository.md)** | Data ownership and usage rights |
