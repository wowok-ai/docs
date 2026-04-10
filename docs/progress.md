# Progress Component (🔄 Workflow Execution)

---

## Component Overview

Progress is WoWok's workflow execution component, used to execute workflow instances created by Machine. Progress tracks the execution status of workflows, manages node transitions, and records execution history.

---

## Feature Tree

```
Progress Component
├── Advance Progress (operate)
│   ├── Execute Node Transition
│   ├── Set Hold Status
│   └── Add Operation Message
├── Manage Named Operators (namedOperator)
│   ├── Add Operator (namedOperator.op = "add")
│   ├── Remove Operator (namedOperator.op = "remove")
│   └── Clear Operators (namedOperator.op = "clear")
├── Set Task ID (task_id)
├── Manage Context Repository (context_repository)
│   ├── Add Repository (context_repository.op = "add")
│   ├── Remove Repository (context_repository.op = "remove")
│   └── Clear Repositories (context_repository.op = "clear")
└── Receive Objects (owner_receive)
```

---

## Sub-feature 1: Advance Progress (operate)

### Feature Description

Advance Progress to the next node by executing node transition operations.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `operate.operation.next_node_name` | string | Yes | Target node name |
| `operate.operation.forward` | string | Yes | Forward operation name |
| `operate.hold` | boolean | No | Whether to hold at current node |
| `operate.message` | string | No | Operation message |

### Important Notes

⚠️ **Must have permission to execute the forward operation**.

⚠️ **Must meet the threshold requirements of the forward operation**.

⚠️ **Progress can only advance to the next node defined by the forward operation**.

### Examples

#### Example 1.1: Execute Simple Node Transition

```json
{
  "operation_type": "progress",
  "data": {
    "object": {
      "name": "my_order_progress"
    },
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

#### Example 1.2: Execute Node Transition and Hold

```json
{
  "operation_type": "progress",
  "data": {
    "object": {
      "name": "my_order_progress"
    },
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

---

## Sub-feature 2: Manage Named Operators (namedOperator)

### Feature Description

Manage named operators of Progress, used for dynamic permission assignment.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `namedOperator.op` | string | Yes | Operation type: add/remove/clear |
| `namedOperator.operators` | array | Required for add | Operator list |
| `namedOperator.operators[].name` | string | Yes | Operator name |
| `namedOperator.operators[].address` | string | Yes | Operator address |
| `namedOperator.operator_names` | array | Required for remove | List of operator names to remove |

### Operation Type Description

| Operation Type | Description |
|----------|------|
| `add` | Add new operators |
| `remove` | Remove specified operators (by name) |
| `clear` | Clear all operators |

### Examples

#### Example 2.1: Add Named Operators

```json
{
  "operation_type": "progress",
  "data": {
    "object": {
      "name": "my_order_progress"
    },
    "namedOperator": {
      "op": "add",
      "operators": [
        {
          "name": "designer",
          "address": "0x1234abcd5678efgh9012ijkl3456mnop7890qrst"
        },
        {
          "name": "reviewer",
          "address": "0xabcd1234efgh5678ijkl9012mnop3456qrst7890"
        }
      ]
    }
  }
}
```

#### Example 2.2: Remove Named Operators

```json
{
  "operation_type": "progress",
  "data": {
    "object": {
      "name": "my_order_progress"
    },
    "namedOperator": {
      "op": "remove",
      "operator_names": ["old_operator"]
    }
  }
}
```

#### Example 2.3: Clear Named Operators

```json
{
  "operation_type": "progress",
  "data": {
    "object": {
      "name": "my_order_progress"
    },
    "namedOperator": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 3: Set Task ID (task_id)

### Feature Description

Set the task ID of Progress for associating with other objects.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `task_id` | string | Yes | Task ID |

### Example

```json
{
  "operation_type": "progress",
  "data": {
    "object": {
      "name": "my_order_progress"
    },
    "task_id": "task_001"
  }
}
```

---

## Sub-feature 4: Manage Context Repository (context_repository)

### Feature Description

Manage context repositories of Progress for storing workflow-related data.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `context_repository.op` | string | Yes | Operation type: add/remove/clear |
| `context_repository.repositories` | array | Required for add | Repository list |
| `context_repository.repository_names` | array | Required for remove | List of repository names to remove |

### Operation Type Description

| Operation Type | Description |
|----------|------|
| `add` | Add new repositories |
| `remove` | Remove specified repositories (by name) |
| `clear` | Clear all repositories |

### Examples

#### Example 4.1: Add Context Repositories

```json
{
  "operation_type": "progress",
  "data": {
    "object": {
      "name": "my_order_progress"
    },
    "context_repository": {
      "op": "add",
      "repositories": ["order_data", "user_data"]
    }
  }
}
```

#### Example 4.2: Remove Context Repositories

```json
{
  "operation_type": "progress",
  "data": {
    "object": {
      "name": "my_order_progress"
    },
    "context_repository": {
      "op": "remove",
      "repository_names": ["old_data"]
    }
  }
}
```

#### Example 4.3: Clear Context Repositories

```json
{
  "operation_type": "progress",
  "data": {
    "object": {
      "name": "my_order_progress"
    },
    "context_repository": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 5: Receive Objects (owner_receive)

### Feature Description

Receive objects sent to this Progress object and unwrap them to send to the permission owner.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `owner_receive.objects` | array | No | Specify list of object IDs to receive |
| `owner_receive.recent` | boolean | No | Whether to receive recent objects |

### Example

```json
{
  "operation_type": "progress",
  "data": {
    "object": {
      "name": "my_order_progress"
    },
    "owner_receive": {
      "recent": true
    }
  }
}
```

---

## Sub-feature 6: Combined Operations

### Feature Description

Execute multiple operations in one call.

### Example

#### Example 6.1: Complete Progress Operation

```json
{
  "operation_type": "progress",
  "data": {
    "object": {
      "name": "my_order_progress"
    },
    "operate": {
      "operation": {
        "next_node_name": "completed",
        "forward": "complete_order"
      },
      "hold": false,
      "message": "Order completed successfully"
    },
    "namedOperator": {
      "op": "add",
      "operators": [
        {
          "name": "final_reviewer",
          "address": "0x1234abcd5678efgh9012ijkl3456mnop7890qrst"
        }
      ]
    },
    "task_id": "order_001",
    "context_repository": {
      "op": "add",
      "repositories": ["order_history"]
    }
  }
}
```

---

## Important Notes

⚠️ **Must have permission to execute forward operations**.

⚠️ **Must meet the threshold requirements of forward operations**.

⚠️ **Progress can only advance to nodes defined by forward operations**.

⚠️ **Named operators are used for dynamic permission assignment**.

⚠️ **Task ID is used for associating with other objects**.

⚠️ **Context repositories are used for storing workflow-related data**.

⚠️ **Progress is created by Machine and cannot be created independently**.

---

## Related Components

- **Machine**: Workflow template
- **Service**: Service marketplace
- **Order**: Order management
- **Permission**: Permission management
- **Repository**: Data storage
