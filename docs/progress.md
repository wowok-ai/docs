# Progress Component (🔄 Workflow Execution)

---

## Component Overview

Progress is WoWok's workflow execution component, used to execute workflow instances created by Machine. Progress tracks the execution status of workflows, manages node transitions, and records execution history.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Object Reference** | Identify which Progress to operate on | Target specific workflow execution | Foundation for all Progress operations - defines which workflow instance to modify |
| **Set Task** | Associate Progress with a Task object | Link workflow to order, service request | Establishes relationship between workflow execution and business entities |
| **Repository Management** | Attach/remove/clear Repository objects | Store execution data, state, deliverables | Enables data persistence during workflow execution |
| **Named Operator Management** | Add/set/remove named operators | Dynamic permission assignment, team changes | Provides flexible access control for workflow stages |
| **Progress Operations (Accomplish)** | Execute forward and advance node | Complete workflow steps, move to next state | Core of workflow execution - processes transitions normally |
| **Progress Operations (Hold)** | Lock operation at current node | Pause for review, prevent race conditions | Controls workflow execution flow and avoids conflicts |
| **Progress Operations (Admin Unhold)** | Force unlock from hold state | Admin intervention, override holds | Provides emergency override capabilities |

---

## Schema Tree (4-Level Structure)

```
progress
├── operation_type: "progress"
├── data
│   ├── object (string, name or address)
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
│       │   ├── next_node_name (string)
│       │   └── forward (string)
│       ├── hold: true
│       │   ├── adminUnhold (boolean, optional)
│       │   └── message (string, optional)
│       └── hold: false
│           └── message (string, optional)
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

## Sub-feature 1: Operate Progress (operate)

### Feature Description

Advance Progress to the next node by executing node transition operations. There are two modes:
- **Hold mode** (`hold: true`): Lock operation permission to avoid competition
- **Accomplish mode** (`hold: false`): Submit operation result and advance

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `operate.operation.next_node_name` | string | Yes | Target node name |
| `operate.operation.forward` | string | Yes | Forward operation name |
| `operate.hold` | boolean | Yes | Whether to hold at current node |
| `operate.adminUnhold` | boolean | No | Allow admin to force unlock (only when hold=true) |
| `operate.message` | string | No | Operation message |

### Important Notes

⚠️ **Must have permission to execute the forward operation**.

⚠️ **Must meet the threshold requirements of the forward operation**.

⚠️ **Progress can only advance to the next node defined by the forward operation**.

⚠️ **Task cannot be changed after setting**.

### Examples

#### Example 1.1: Execute Accomplish Operation (No Hold)

**Prompt**: Advance "my_order_progress" from current node to "designing" using forward "start_design", with message "Start design work" and no hold.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "operate": {
      "operation": {
        "next_node_name": "designing",
        "forward": "start_design"
      },
      "hold": false,
      "message": "Start design work"
    }
  }
}
```

#### Example 1.2: Execute Hold Operation

**Prompt**: Advance "my_order_progress" from current node to "reviewing" using forward "submit_for_review", hold at this node, with message "Submitted for review, waiting for confirmation".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "operate": {
      "operation": {
        "next_node_name": "reviewing",
        "forward": "submit_for_review"
      },
      "hold": true,
      "message": "Submitted for review, waiting for confirmation"
    }
  }
}
```

#### Example 1.3: Admin Unhold Operation

**Prompt**: Admin unlock "my_order_progress" from hold state, allowing it to advance to "completed" using forward "approve_review", with message "Review approved, admin unlocked".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "operate": {
      "operation": {
        "next_node_name": "completed",
        "forward": "approve_review"
      },
      "hold": true,
      "adminUnhold": true,
      "message": "Review approved, admin unlocked"
    }
  }
}
```

---

## Sub-feature 2: Manage Named Operators (progress_namedOperator)

### Feature Description

Manage named operators of Progress, used for dynamic permission assignment.

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

#### Example 2.1: Add Named Operators

**Prompt**: Add operators "designer_alice" and "designer_bob" to the "designers" namespace for "my_order_progress".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "progress_namedOperator": {
      "op": "add",
      "name": "designers",
      "operators": {
        "entities": [
          { "name_or_address": "designer_alice" },
          { "name_or_address": "designer_bob" }
        ],
        "check_all_founded": true
      }
    }
  }
}
```

#### Example 2.2: Set Named Operators

**Prompt**: Set "reviewers" namespace to have exactly "reviewer_charlie" and "reviewer_david" for "my_order_progress".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "progress_namedOperator": {
      "op": "set",
      "name": "reviewers",
      "operators": {
        "entities": [
          { "name_or_address": "reviewer_charlie" },
          { "name_or_address": "reviewer_david" }
        ],
        "check_all_founded": true
      }
    }
  }
}
```

#### Example 2.3: Remove Named Operators

**Prompt**: Remove "designer_alice" from "designers" namespace for "my_order_progress".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "progress_namedOperator": {
      "op": "remove",
      "name": "designers",
      "operators": {
        "entities": [
          { "name_or_address": "designer_alice" }
        ],
        "check_all_founded": false
      }
    }
  }
}
```

---

## Sub-feature 3: Set Task (task)

### Feature Description

Set the task ID of Progress for associating with other objects. Task cannot be changed after setting.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `task` | string | Yes | Task ID (name or address) |

### Important Notes

⚠️ **Task cannot be changed after setting**.

### Example

#### Example 3.1: Set Task ID

**Prompt**: Set task "order_task_001" for "my_order_progress".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "task": "order_task_001"
  }
}
```

---

## Sub-feature 4: Manage Repository (repository)

### Feature Description

Manage repositories of Progress for storing workflow-related data.

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

#### Example 4.1: Add Repositories

**Prompt**: Add "order_data" and "user_data" repositories to "my_order_progress".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "repository": {
      "op": "add",
      "objects": ["order_data", "user_data"]
    }
  }
}
```

#### Example 4.2: Set Repositories

**Prompt**: Set "my_order_progress" repositories to exactly ["design_data", "review_data"], replacing any existing ones.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "repository": {
      "op": "set",
      "objects": ["design_data", "review_data"]
    }
  }
}
```

#### Example 4.3: Remove Repositories

**Prompt**: Remove "old_data" repository from "my_order_progress".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "repository": {
      "op": "remove",
      "objects": ["old_data"]
    }
  }
}
```

#### Example 4.4: Clear All Repositories

**Prompt**: Clear all repositories from "my_order_progress".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "repository": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 5: Combined Operations

### Feature Description

Execute multiple operations in one call to the Progress object.

### Examples

#### Example 5.1: Complete Progress Workflow with All Features

**Prompt**: For "my_order_progress": 1) Set task "order_123", 2) Add "order_history" repository, 3) Add "quality_checker" to "reviewers" namespace, 4) Advance to "completed" node with forward "complete_order", hold=false, message "Order completed successfully".

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "task": "order_123",
    "repository": {
      "op": "add",
      "objects": ["order_history"]
    },
    "progress_namedOperator": {
      "op": "add",
      "name": "reviewers",
      "operators": {
        "entities": [
          { "name_or_address": "quality_checker" }
        ],
        "check_all_founded": true
      }
    },
    "operate": {
      "operation": {
        "next_node_name": "completed",
        "forward": "complete_order"
      },
      "hold": false,
      "message": "Order completed successfully"
    }
  }
}
```

#### Example 5.2: Hold and Set Operators Together

**Prompt**: For "my_order_progress": 1) Hold at "reviewing" node with forward "submit_for_review", 2) Add "final_approver" to "approvers" namespace.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_order_progress",
    "progress_namedOperator": {
      "op": "add",
      "name": "approvers",
      "operators": {
        "entities": [
          { "name_or_address": "final_approver" }
        ],
        "check_all_founded": true
      }
    },
    "operate": {
      "operation": {
        "next_node_name": "reviewing",
        "forward": "submit_for_review"
      },
      "hold": true,
      "message": "Awaiting final approval, operators updated"
    }
  }
}
```

---

## Important Notes

⚠️ **Must have permission to execute forward operations**.

⚠️ **Progress can only advance to nodes defined by forward operations**.

⚠️ **Named operators are used for dynamic permission assignment**.

⚠️ **Task is used for associating with other objects and cannot be changed after setting**.

⚠️ **Repositories are used for storing workflow-related data**.

⚠️ **Progress is created by Machine and cannot be created independently**.

⚠️ **Hold mode locks operation permission to avoid competition**.

⚠️ **AdminUnhold allows admin to force unlock (requires admin privileges)**.

---

## Related Components

- **Machine**: Workflow template
- **Service**: Service marketplace
- **Order**: Order management
- **Permission**: Permission management
- **Repository**: Data storage
