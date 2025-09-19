# Machine Object: Your Workflow Blueprint Designer

> "Create reusable workflow templates that define how complex processes flow from start to finish, with automatic execution through Progress instances"

**MCP Tool**: [`wowok_machine_mcp_server`](https://www.npmjs.com/package/wowok_machine_mcp_server)

## How to Use This Documentation

### Document Structure
**Part 1: Machine Template Design (Sections 1-4)**
- **[Overview](#overview)**: Machine concepts and Progress relationship
- **[Basic Configuration](#basic-configuration)**: Account, Object, and Control Parameters
- **[Node Architecture](#node-architecture)**: Complete node structure and operation design
- **[Advanced Features](#advanced-features)**: Repository integration, cloning, and complex scenarios

**Part 2: Progress Operations (Sections 5-6)**
- **[Progress Operations](#progress-operations)**: Complete Progress technical reference
- **[Execution Management](#execution-management)**: Hold/Resume, Context, Parent-Child relationships

**Part 3: Implementation & Integration (Sections 7-9)**
- **[Integration Patterns](#integration-patterns)**: How Machine coordinates with other objects
- **[Complete Examples](#complete-examples)**: End-to-end implementation scenarios
- **[Data Types & Technical Reference](#data-types--technical-reference)**: Technical specifications

**Part 4: Reference Materials (Section 10-11)**
- **[Common Issues & Troubleshooting](#common-issues--troubleshooting)**: Problem resolution
- **[Configuration Reference](#configuration-reference)**: Witness parameters and advanced settings


### Navigation by Need
| I need to... | Go to section |
|--------------|---------------|
| Understand Machine vs Progress difference | [Overview](#overview) |
| Create basic workflow template | [Node Architecture → Node Structure](#node-structure-definition) |
| See simplest working example | [Complete Examples → Minimal Working Machine](#minimal-working-machine) |
| Add advanced workflow rules | [Node Architecture → Forward Operations](#forward-operation-configuration) |
| Execute workflow instances | [Progress Operations](#progress-operations) |
| Connect with other objects | [Integration Patterns](#integration-patterns) |
| Fix broken workflows | [Common Issues & Troubleshooting](#common-issues--troubleshooting) |

---

## Part 1: Machine Template Design

## 1. Overview

### Definition
Machine objects define node structures and transition rules for workflow execution, specifying workflow stages, operation permissions, and threshold requirements.

Machine defines workflow parameters, while Progress instances execute workflows with bound operators and task data.

### Core Capabilities
- **Node Structure Management**: Create, modify, and organize workflow stages with dependency rules
- **Forward Operation Configuration**: Define approval buttons that move workflow forward. Set who can click each button, what role they play, and how many approval points each click contributes.
- **Message Delivery System**: Forwards can store messages and data for Progress instances to retrieve during execution
- **Flexible Operator Assignment**: Each individual Progress instance can assign different qualified operators to the same workflow roles for flexible management
- **Multi-Service Reusability**: Same Machine template can be referenced by multiple Service objects with different operator configurations
- **Cross-Object Integration**: Reference Service objects, Guard verification, and Repository data within operations

### Machine vs Progress Relationship
There are two objects in this document. Machine defines workflow structure, while Progress instances execute workflow steps with bound operators and task data.

**Structure Definition**: Machine contains node definitions and transition rules. Progress instances follow Machine template structure but operate with specific operator bindings and execution context.

**Independent Execution**: Each Progress instance tracks separate workflow execution with unique participants, data, and execution history.

### Workflow Implementation Process
The typical workflow implementation follows these steps:
1. **Configure**: Define Machine node structures and operation permissions
2. **Test**: Create Progress instances to verify workflow logic
3. **Publish**: Set `bPublished: true` to enable Progress creation
4. **Execute**: Launch Progress instances for workflow execution

**Notes**:
- **Immutability**: Published Machines cannot modify node structure
- **Modification Path**: Use clone operation to create modified versions of existing Machines
- **Issue Response**: Set `bPaused: true` on Machine or Progress to halt execution and prevent further issues

---

## 2. Basic Configuration

### Account & Object Identification

**Note**: All Machine operations require `account` parameter to specify transaction signer. If omitted, current active account is used.

#### Top-Level Structure
```json
{
  "account": "workflow_manager",  // Leave blank to use the default account
  "data": {
    // Workflow structure and execution rules - see Node Architecture section
  }
}
```

`account` specifies the transaction signer address for Machine operations.

`data` contains Machine workflow configuration - node structures, operation permissions, and execution rules.

#### Machine Object Reference

**Operating on Existing Machine**:
```json
{
  "data": {
    "object": "existing_machine_name_or_address"  // Reference by name or blockchain address
  }
}
```
。
**Creating New Machine**:
```json
{
  "data": {
    "object": {
       "name": "workflow_machine",  // Local identifier for easy reference
       "onChain": true,  // Make metadata publicly visible on blockchain
       "permission": "permission_object",  // Permission object address (auto-created if omitted)
       "tags": ["workflow", "automation"],  // Categorization labels
      "useAddressIfNameExist": false  // Name conflict resolution: false = rename original, true = use address
    }
  }
}
```

**Object Creation Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Optional | Local identifier that makes referencing easier in future operations |
| `onChain` | boolean | Optional (default: false) | Whether name and tags are publicly visible on blockchain |
| `permission` | string/object | Optional | Permission object managing workflow access control - creates default if omitted |
| `tags` | string[] | Optional | Labels for organizing and categorizing workflow templates |
| `useAddressIfNameExist` | boolean | Optional (default: false) | Conflict resolution: false = keep new name, rename original; true = use address instead |

### Machine Control Parameters

```json
{
  "data": {
     "description": "Order processing workflow with multi-stage approval",  
     "bPublished": false,
     "bPaused": false,
     "endpoint": "https://api.example.com/workflow-callbacks"
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `description` | string | Optional | Human-readable explanation of workflow purpose |
| `bPublished` | boolean | `false` | Set `true` to enable Progress creation (immutable after publish) |
| `bPaused` | boolean | `false` | Set `true` to halt new Progress instances (emergency brake) |
| `endpoint` | string | Optional | HTTPS URL for Progress status updates with auto-appended parameters |
| `session.network` | string | Required | Target blockchain: `sui mainnet`, `sui testnet`, `wowok mainnet`, `wowok testnet` |
| `session.retentive` | string | `always` | Persistence scope: `always` = device-wide, `session` = current program only |
---

## 3. Node Architecture

### Node Management

Build your workflow by creating approval stages (nodes) and connecting them with operations. Each node represents a step where work waits for approval before moving forward.

**Common Node Operations**:

```json
{
  "data": {
    "nodes": {
      "op": "add",
      "bReplace": false,  // false: add nodes to existing structure, true: completely replace all existing nodes
      "data": [
        // Node definitions - see Node Structure section below
      ]
    }
  }
}
```
| Operation | Purpose | Parameters | Use Case |
|-----------|---------|------------|----------|
| `add` | Create new workflow stages | `data` array with node definitions | Building initial workflow or adding new approval stages |
| `remove` | Delete workflow stages | `names` array with node names | Removing obsolete stages from workflow |
| `rename node` | Change stage names | `data` array with old/new name pairs | Updating stage names for clarity |
| `remove pair` | Delete stage connections | `pairs` array with connection specifications | Breaking workflow paths between stages |
| `add forward` | Add operations to connections | `data` array with forward definitions | Adding new approval operations to existing stage connections |
| `remove forward` | Delete specific operations | `data` array with forward specifications | Removing outdated operations from workflow |

### Node Structure Definition

**What it is**: Each node represents a workflow stage with specific approval requirements and available operations. Nodes connect to form your complete workflow path from start to finish.

```json
{
    "name": "approval_stage",
     "pairs": [
     {
       "prior_node": "order_received",  // Previous stage name (use "" for initial node)
       "threshold": 2,  // Minimum approval points needed to advance
      "forwards": [
        // Available operations from this stage - see Forward Operations
      ]
    }
  ]
}
```

**Node Structure Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | **Required** | Unique stage identifier that Progress instances use to track current position |
| `prior_node` | string | **Required** | Previous stage name creating workflow sequence - use `""` for initial starting node |
| `threshold` | number ≥0 | **Required** | Minimum weight points required for advancement - see Threshold Logic |
| `forwards` | array | **Required** | Available operations that can be executed from this stage connection |

**Node Connection Logic**: Each `pairs` entry creates a connection from `prior_node` to this node. Multiple pairs allow a single node to be reached from different previous stages, enabling branching and merging workflow paths.

### Forward Operation Configuration

Forward operations define executable actions that advance workflow between nodes. Each forward specifies required permissions, weight contribution toward threshold, and optional Guard verification.

Progress instances execute forwards by validating operator permissions, running Guard checks if specified, and accumulating weight toward the target node's advancement threshold.

```json
{
   "name": "approve_order",  // Operation identifier for Progress execution
   "permission": 1001,  // Custom permission index ≥1000
   "namedOperator": "order_processor",  // Role template name for operator binding
   "weight": 2,  // Points contributed toward threshold advancement
   "guard": "business_hours_guard",  // Optional Guard verification
   "suppliers": [  // Optional Service coordination requirements
     {
       "service": "inventory_check_service",  // Service object address or name
      "bRequired": true  // true = must provide order, false = optional choice
    }
  ]
}
```

**Forward Operation Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | **Required** | Operation identifier that Progress instances reference during execution |
| `permission` | number ≥1000 | **Required** | Custom permission index from Permission object - determines who can execute |
| `namedOperator` | string | **Required** | Role template name for operator binding - Progress instances map actual addresses to this role |
| `weight` | number ≥1 | **Required** | Points contributed toward threshold when operation executes successfully |
| `guard` | string | Optional | Guard object address for additional verification - see [Guard Object Documentation](Guard.md#guard-data-concepts) |
| `suppliers` | array | Optional | Service objects for multi-vendor coordination - see Service Suppliers Configuration |

**Permission Logic**: Only addresses with the specified permission index can execute this forward. Permission object manages who has which permissions, enabling role-based workflow access control.

### Service Suppliers Configuration

Service suppliers coordinate workflow operations with external Service objects during forward execution.

`bRequired: true` services must all provide orders. `bRequired: false` services require exactly one selection from the group.

```json
 "suppliers": [
   {"service": "inventory_check_service", "bRequired": true},  // Must provide order
   {"service": "express_shipping", "bRequired": false},  // Optional choice A
   {"service": "standard_shipping", "bRequired": false}  // Optional choice B
 ]
```

**Supplier Execution Logic**: 
- **Required Services** (`bRequired: true`): All must provide orders during operation execution - if any required service fails to provide an order, the operation fails
- **Optional Services** (`bRequired: false`): Exactly one must be selected from the optional group - enables choice between alternatives like shipping methods or payment processors
- **Use Cases**: Multi-vendor coordination, service dependency management, flexible service selection within workflows

### Threshold and Weight Logic

Weight accumulation controls workflow advancement between nodes. Forward operations contribute weight points toward the target node's threshold requirement.

Progress instances execute forwards to accumulate weight. When accumulated weight reaches threshold value, workflow advances to target node and weight counter resets.

```json
{
  "threshold": 2,  // Minimum points needed to advance
  "forwards": [
    {"name": "manager_approve", "weight": 1},  // Contributes 1 point
    {"name": "legal_approve", "weight": 1}    // Contributes 1 point
  ]
}
```

**Accumulation Examples**:
- **Single Approval**: `threshold: 1`, any forward with `weight: 1` can advance workflow immediately
- **Dual Approval**: `threshold: 2`, need two forwards with `weight: 1` each, or one forward with `weight: 2`
- **Weighted Vote**: Manager `weight: 2`, Staff `weight: 1`, `threshold: 3` = Manager + Staff OR three Staff members
- **Partial Progress**: Operations with insufficient weight remain pending at current node until threshold satisfied

**Concurrent Execution**: Multiple forwards can execute simultaneously from the same stage. Weight accumulation is atomic per operation, enabling parallel approvals that contribute toward the same threshold.

#### Message Delivery System
Forwards can store messages and data for Progress instances to retrieve during execution.

```json
{
  "deliverable": {
    "msg": "Operation completed with details",
    "orders": ["service_order_1", "service_order_2"]
  }
}
```

**Message Storage**: `msg` field stores human-readable descriptions of completed work.

**Order Integration**: `orders` array contains Order objects from supplier services for Progress tracking.

### Additional Node Operations

**Remove Nodes**:
```json
{
  "nodes": {
    "op": "remove",
    "names": ["node_name_1", "node_name_2"]
  }
}
```

**Rename Nodes**:
```json
{
  "nodes": {
    "op": "rename node",
    "data": [
      {
        "old": "current_name",
        "new": "updated_name"
      }
    ]
  }
}
```

**Remove Node Connections**:
```json
{
  "nodes": {
    "op": "remove pair",
    "pairs": [
      {
        "prior_node_name": "source_node",
        "node_name": "target_node"
      }
    ]
  }
}
```

**Add Forward Operations**:
```json
{
  "nodes": {
    "op": "add forward",
    "data": [
      {
        "prior_node_name": "order_confirmed",
        "node_name": "order_shipped",
        "threshold": 1,
        "forward": {
          "name": "ship_order",
          "permission": 1004,
          "namedOperator": "shipping_coordinator",
          "weight": 1,
          "guard": "warehouse_hours_guard"
        }
      }
    ]
  }
}
```

**Remove Forward Operations**:
```json
{
  "nodes": {
    "op": "remove forward",
    "data": [
      {
        "prior_node_name": "order_confirmed",
        "node_name": "order_shipped", 
        "forward_name": "ship_order"
      }
    ]
  }
}
```

---

## 4. Advanced Features

Advanced features for complex workflow scenarios: link shared data repositories across all Progress instances, create workflow template variations, and manage multi-service coordination requirements.

### Repository Integration
```json
{
  "data": {
    "consensus_repository": {
      "op": "add",
      "objects": ["shared_data_repo", "standards_repo"]
    }
  }
}
```

**Repository Function**: Shared data accessible across all Progress instances executing this Machine template.

`consensus_repository` operations: `add`, `remove`, `set`, `removeall` for managing shared Repository objects.

For detailed Repository functionality, see [Repository Object Documentation](Repository.md).

### Machine Cloning
```json
{
  "data": {
    "clone_new": {
      "namedNew": {
         "name": "cloned_machine",
         "onChain": true,
         "tags": ["cloned", "variant"],
        "useAddressIfNameExist": false
      }
    }
  }
}
```

**Use Case**: Create variations of existing workflows (express vs standard processing). `clone_new` creates Machine copy then modify configuration.

**Multi-Service Reusability**: Same Machine template can be referenced by multiple Service objects, each with different operator configurations and supplier requirements.

---

## Part 2: Progress Operations

## 5. Progress Operations

Progress operations execute workflows defined by Machine templates. For Machine-Progress relationship concepts, see [Overview](#overview).

**Key Concepts**:
- **Instance Independence**: Each Progress tracks separate workflow execution
- **Operator Binding**: Template roles (namedOperator) bound to actual operator addresses
- **Execution State**: Current node, completed operations, pending approvals
- **Task Association**: Optional link to Order, custom object, or business entity

### Progress Instance Creation

Creates new Progress instances for workflow execution. Each Progress instance starts at the Machine's initial node with clean execution state, ready for operator binding and workflow execution.

```json
{
  "data": {
    "progress_new": {
      "namedNew": {
         "name": "order_12345_progress",  // Unique identifier for this workflow execution
         "onChain": true,  // Make execution history publicly visible
         "tags": ["urgent", "customer_vip"],  // Labels for tracking and filtering
        "useAddressIfNameExist": false  // Name conflict resolution behavior
      },
      "task_address": "order_abc123"  // Optional link to business object being processed
    }
  }
}
```

**Task Association**: `task_address` creates a bidirectional link between Progress execution and your business object (like an Order, Contract, or Project). This enables automatic task tracking and provides workflow context for external systems monitoring progress.

### Operator Binding Configuration

Operator binding assigns specific addresses to Machine template roles for individual Progress execution. Each Progress instance can have different operators while following the same workflow rules.

Progress instances require operator assignment before workflow execution can begin.

```json
{
  "data": {
    "progress_namedOperator": {
       "progress": "order_abc123_progress",  // Target Progress instance
       "data": [
         {
           "name": "order_approver",  // Must match namedOperator from Machine forwards
           "operators": [
             {
               "name_or_address": "alice_manager",  // Actual address or local name
              "local_mark_first": true  // Search local names before blockchain addresses
            }
          ]
        },
        {
           "name": "quality_checker",  // Another role from Machine template
           "operators": [
             {
               "name_or_address": "bob_qa_lead",
              "local_mark_first": true
            },
             {
               "name_or_address": "carol_qa_specialist",  // Multiple operators for same role
              "local_mark_first": true
            }
          ]
        }
      ]
    }
  }
}
```

**Operator Assignment Rules**:
- **Role Names**: `name` must match the role defined in Machine (like "delivery_driver", "customer_service")
- **Multiple People**: You can assign multiple people to the same role - any of them can execute the operations
- **Different Tasks, Different People**: Each Progress can have completely different teams while using the same workflow rules

💡 **AI Prompt Tip**: "Today my customer is ABC Corp, delivery driver is John Smith, and manager is Alice Johnson. Please assign operators for my progress_order_12345."

### Workflow Execution Operations

Workflow execution advances Progress from current node to target node by executing specified forward operations. System validates operator permissions, Guard conditions, and supplier requirements before contributing weight toward threshold advancement.

```json
{
  "data": {
    "progress_next": {
       "progress": "order_abc123_progress",  // Target Progress instance
       "operation": {
         "next_node_name": "order_validated",  // Target stage from Machine definition
         "forward": "manager_approve"  // Forward operation name from Machine
       },
       "deliverable": {
         "msg": "Order approved - inventory confirmed, payment verified, customer credit check passed",  // Description of completed work
         "orders": ["inventory_check_order", "credit_verification_order"]  // Service orders from suppliers
       }
    }
  }
}
```

**Execution Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `next_node_name` | string | **Required** | Target node name from Machine definition |
| `forward` | string | **Required** | Forward operation name that must match Machine forward configuration |
| `msg` | string | Optional | Attach any message while forwarding progress like link, text or specific parameter defined in repository for dynamic requirement. It stores in Progress Object. |
| `orders` | array | Optional | Order objects from supplier services required by this forward operation |

**Execution Flow Checklist**:
- [ ] Operator with the right permissions
- [ ] Guard verification passes (if required)
- [ ] Supplier orders are provided (if required)

Forward completes after these are met.
When forward weight meets current node's threshold, Progress advances to the specified node.

---

## 6. Execution Management

### Progress Context Management

Progress context management links Repository objects to individual Progress instances for execution-specific data storage - documents, communications, and collaboration data unique to this workflow execution.

```json
{
  "data": {
    "progress_context_repository": {
       "progress": "order_abc123_progress",  // Target Progress instance
       "repository": "order_abc123_documents"  // Repository for this execution's data, or null to remove
    }
  }
}
```


### Parent-Child Workflow Relationships

Create hierarchical Progress structures. Child Progress completion automatically triggers specified forward operation in parent Progress.

```json
{
  "data": {
    "progress_parent": {
       "progress": "contract_review_subprocess",  // Child Progress instance
       "parent": {
         "parent_id": "main_contract_progress",  // Parent Progress instance
        "parent_session_id": 0,  // Parent session identifier
        "operation": {
         "next_node_name": "contract_approved",  // Target node in parent workflow
         "forward": "complete_legal_review"  // Forward operation to execute in parent
        }
      }
    }
  }
}
```

Set `"parent": null` to remove existing parent relationship.

**Hierarchical Workflows**: Create nested Progress structures where sub-tasks completion triggers advancement in parent workflow.

### Progress Hold/Resume Controls

Temporarily prevent specific operations from executing. Admin override can force resume regardless of hold state.

```json
{
  "data": {
    "progress_hold": {
       "progress": "order_abc123_progress",  // Target Progress instance
       "operation": {
         "next_node_name": "order_shipped",  // Target stage for the held operation
         "forward": "ship_product"  // Specific forward operation to hold/resume
       },
      "bHold": true,  // true = prevent execution, false = allow execution
      "adminUnhold": false  // true = admin override to force resume regardless of bHold
    }
  }
}
```

**Hold Control Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `bHold` | boolean | true: prevents operation execution, false: resumes normal operation |
| `adminUnhold` | boolean | true: admin override to force operation resumption regardless of hold state |

**Hold Management**:
- `bHold: true`: Temporarily prevent specific operation execution
- `bHold: false`: Resume normal operation
- `adminUnhold: true`: Admin override to force resume

### Task Assignment Updates

Change or set the business object associated with Progress execution during workflow runtime.

```json
{
  "data": {
    "progress_task": {
       "progress": "order_abc123_progress",  // Target Progress instance
       "task_address": "updated_order_abc456"  // New business object to associate, or null to remove
    }
  }
}
```

**Task Updates**: Change or set the business object associated with Progress execution.

---

## Part 3: Implementation & Integration

## 7. Integration Patterns

### Machine + Service Integration
**Service Purchase Triggers Progress**: When customers purchase Services that reference Machine workflows, Progress instances are automatically created to track service delivery through Machine-defined steps.

**Supplier Coordination**: Machine workflows can require specific Service objects as suppliers, enabling automatic coordination between multiple service providers within single workflow execution.

### Machine + Repository Integration
**Consensus Repository**: Link Repository objects to Machine for shared data across all Progress instances - customer information, standard procedures, quality metrics that all workflow executions reference.

**Progress Context Repository**: Individual Progress instances can have dedicated Repository for instance-specific communication, file sharing, and collaboration data.

### Machine + Guard Integration
**Workflow Gate Conditions**: Guards verify complex business conditions before workflow advancement - time windows, location requirements, document verification, multi-party approval through external systems.

**Operation-Level Verification**: Each forward operation can have Guard verification, enabling conditional workflow paths based on real-time verification (working hours, manager presence, quality approval).

### Progress Status Management
**Status Tracking**: Progress instances maintain execution state including current node, completed operations, and pending approvals. External systems can query Progress status through Repository context or endpoint callbacks.

**State Transitions**: Progress advancement is atomic - either forward execution succeeds completely (permissions validated, Guards passed, weight accumulated) or fails without state change.

### Common Machine Patterns

| Pattern | Machine Design | Use Case |
|---------|----------------|----------|
| **Sequential Approval** | Linear nodes, threshold=1 | Document workflows, task chains |
| **Multi-Party Approval** | Single node, threshold>1 | Contract signatures, fund releases |
| **Escalation Workflow** | Branching with timeout/override paths | Approval with manager escalation |
| **Service Coordination** | Nodes with required suppliers | Multi-vendor project management |

---

## 8. Complete Examples

### Minimal Working Machine
```json
{
  "account": "user",
  "data": {
    "object": {
      "name": "basic_approval",
      "permission": "team_permission"
    },
    "nodes": {
      "op": "add",
      "data": [
        {
          "name": "start",
          "pairs": [{
            "prior_node": "",
            "threshold": 1,
            "forwards": [{
              "name": "approve",
              "permission": 1001,
              "namedOperator": "approver",
              "weight": 1
            }]
          }]
        },
        {
          "name": "done",
          "pairs": [{"prior_node": "start", "threshold": 1, "forwards": []}]
        }
      ]
    }
  }
}
```

### Multi-Approval Workflow
```json
{
  "account": "workflow_manager",
  "data": {
    "object": {
      "name": "contract_signing_machine",
      "onChain": true,
      "permission": "legal_permission",
      "tags": ["contract", "legal", "signature"]
    },
    "description": "Contract approval requiring both legal and business approval",
    "nodes": {
      "op": "add", 
      "data": [
        {
          "name": "draft_complete",
          "pairs": [
            {
              "prior_node": "",
              "threshold": 1,
              "forwards": [
                {
                  "name": "submit_for_approval",
                  "permission": 1001,
                  "namedOperator": "legal_reviewer",
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "ready_to_sign",
          "pairs": [
            {
              "prior_node": "draft_complete",
              "threshold": 2,
              "forwards": [
                {
                  "name": "legal_approve",
                  "permission": 1002,
                  "namedOperator": "legal_team",
                  "weight": 1,
                  "guard": "legal_review_guard"
                },
                {
                  "name": "business_approve", 
                  "permission": 1003,
                  "namedOperator": "business_owner",
                  "weight": 1,
                  "guard": "budget_approval_guard"
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

**Demonstrates**: Threshold=2 requiring both legal team AND business owner approval, with Guard integration for additional verification conditions.

### End-to-End Business Process
Complete workflow from Machine creation to business execution:
**Step 1: Create Machine Template**
```json
{
  "account": "business_owner",
  "data": {
    "object": {
      "name": "order_fulfillment_machine",
      "onChain": true,
      "permission": "business_permission",
      "tags": ["orders", "fulfillment", "customer-service"]
    },
    "description": "Complete order processing from receipt to delivery",
    "nodes": {
      "op": "add",
      "data": [
        {
          "name": "order_received",
          "pairs": [
            {
              "prior_node": "",
              "threshold": 1,
              "forwards": [
                {
                  "name": "validate_order",
                  "permission": 1001,
                  "namedOperator": "order_processor",
                  "weight": 1,
                  "suppliers": [
                    {
                      "service": "inventory_check_service",
                      "bRequired": true
                    },
                    {
                      "service": "payment_verification_service",
                      "bRequired": true
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "order_validated",
          "pairs": [
            {
              "prior_node": "order_received",
              "threshold": 2,
              "forwards": [
                {
                  "name": "customer_confirm",
                  "permission": 1002,
                  "namedOperator": "customer",
                  "weight": 1
                },
                {
                  "name": "manager_approve",
                  "permission": 1003,
                  "namedOperator": "fulfillment_manager",
                  "weight": 1,
                  "guard": "high_value_order_guard"
                }
              ]
            }
          ]
        },
        {
          "name": "ready_to_ship",
          "pairs": [
            {
              "prior_node": "order_validated",
              "threshold": 1,
              "forwards": [
                {
                  "name": "ship_order",
                  "permission": 1004,
                  "namedOperator": "shipping_coordinator",
                  "weight": 1,
                  "suppliers": [
                    {
                      "service": "shipping_service",
                      "bRequired": true
                    }
                  ]
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

**Step 2: Publish Machine and Create Progress**
```json
{
  "account": "business_owner",
  "data": {
    "object": "order_fulfillment_machine",
    "bPublished": true,
    "progress_new": {
      "namedNew": {
        "name": "order_xyz789_progress",
        "onChain": true,
        "tags": ["customer_john", "high_value"]
      },
      "task_address": "order_xyz789"
    }
  }
}
```

**Step 3: Bind Operators and Execute Workflow**
```json
{
  "account": "business_owner",
  "data": {
    "object": "order_fulfillment_machine",
    "progress_namedOperator": {
      "progress": "order_xyz789_progress",
      "data": [
        {
          "name": "order_processor",
          "operators": [
            {
              "name_or_address": "alice_processor",
              "local_mark_first": true
            }
          ]
        },
        {
          "name": "customer",
          "operators": [
            {
              "name_or_address": "john_customer",
              "local_mark_first": true
            }
          ]
        },
        {
          "name": "fulfillment_manager",
          "operators": [
            {
              "name_or_address": "bob_manager",
              "local_mark_first": true
            }
          ]
        }
      ]
    },
    "progress_next": {
      "progress": "order_xyz789_progress",
      "operation": {
        "next_node_name": "order_validated",
        "forward": "validate_order"
      },
      "deliverable": {
        "msg": "Order validation complete - inventory confirmed (5 units available), payment verified ($299.99 processed)",
        "orders": ["inventory_check_order_456", "payment_verification_order_789"]
      }
    }
  }
}
```

**Expected Results**:
- Machine template created with 3-node approval workflow
- Progress instance created for specific order xyz789
- alice_processor, john_customer, bob_manager bound to their roles
- Workflow advanced from "order_received" to "order_validated" with supplier service verification
- Next step requires both customer confirmation AND manager approval (threshold=2)

### Complex Service Coordination Workflow
**Multi-Service Integration Example**
```json
{
  "account": "project_manager",
  "data": {
    "object": {
      "name": "website_development_machine",
      "onChain": true,
      "permission": "project_permission",
      "tags": ["development", "multi-vendor", "website"]
    },
    "description": "Website development coordinating design, development, and hosting services",
    "nodes": {
      "op": "add",
      "data": [
        {
          "name": "project_started",
          "pairs": [
            {
              "prior_node": "",
              "threshold": 1,
              "forwards": [
                {
                  "name": "gather_requirements",
                  "permission": 1001,
                  "namedOperator": "project_lead",
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "requirements_complete",
          "pairs": [
            {
              "prior_node": "project_started",
              "threshold": 3,
              "forwards": [
                {
                  "name": "design_approve",
                  "permission": 1002,
                  "namedOperator": "design_team",
                  "weight": 1,
                  "suppliers": [
                    {
                      "service": "ui_design_service",
                      "bRequired": true
                    }
                  ]
                },
                {
                  "name": "development_approve",
                  "permission": 1003,
                  "namedOperator": "dev_team",
                  "weight": 1,
                  "suppliers": [
                    {
                      "service": "web_development_service",
                      "bRequired": true
                    }
                  ]
                },
                {
                  "name": "hosting_approve",
                  "permission": 1004,
                  "namedOperator": "infrastructure_team",
                  "weight": 1,
                  "suppliers": [
                    {
                      "service": "hosting_service",
                      "bRequired": false
                    },
                    {
                      "service": "cdn_service",
                      "bRequired": false
                    }
                  ]
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

**Key Features Demonstrated**:
- **Multi-Party Coordination**: threshold=3 requires all three teams (design, development, infrastructure) to approve
- **Service Integration**: Each team must engage specific Service objects for their work
- **Flexible Service Selection**: Infrastructure team can choose between hosting_service OR cdn_service (bRequired: false)
- **Parallel Execution**: All three forwards can be executed simultaneously, but all must complete for workflow advancement

---

## 9. Data Types & Technical Reference

### Address Format Options
All address fields follow consistent format:
- **External Address**: `"name_or_address": "0x1234..."` 
- **Named Address**: `"name_or_address": "alice_manager"`
- **Resolution Priority**: `"local_mark_first": true/false`

### Permission Requirements
- **Machine Management**: Requires Permission object with Machine management permissions (index ≥600)
- **Forward Operations**: Named operators must have assigned permissions for their workflow steps (custom permissions ≥1000)
- **Publishing**: Only Permission admins can publish Machines

### Basic Node Structure Reference

| Pattern | Structure | Use Case |
|---------|-----------|----------|
| **Linear** | A → B → C, threshold=1 per node | Document review, sequential tasks |
| **Parallel** | A → (B1 + B2) → C, threshold=2 at C | Dual-signature requirements |
| **Branching** | A → B1 or B2, different forwards | Approval vs rejection paths |
| **Weighted** | Multiple forwards with different weights | Hierarchical approval systems |

---

## Part 4: Reference Materials

## 10. Common Issues & Troubleshooting

### Machine Creation Failures
**Problem**: "Permission object not found" or "Schema validation error"  
**Solutions**:
1. Create Permission object first with Machine management permissions (index ≥600)
2. Verify all node names are unique and prior_node references exist
3. Ensure permission indexes in forwards are ≥1000 (custom permissions)
4. Check that all referenced Guard and Service objects exist

### Node Structure Errors
**Problem**: "Invalid node relationship" or "Threshold/weight mismatch"  
**Solutions**:
1. Verify threshold values match intended approval logic (threshold ≤ sum of available weights)
2. Check prior_node names exactly match existing node names
3. Ensure initial nodes use `"prior_node": ""`
4. Test workflow logic before publishing - published Machines cannot modify structure

**Problem**: "Unreachable threshold" - Progress stuck at node  
**Solutions**:
1. Check that sum of available forward weights ≥ threshold value
2. Verify bound operators have required permissions for available forwards
3. Ensure Guard conditions can be satisfied if specified in forwards
4. Consider reducing threshold or adding additional forward operations

### Progress Creation Failures  
**Problem**: "Machine not published" or "Operator binding failed"  
**Solutions**:
1. Set `bPublished: true` on Machine before creating Progress instances
2. Verify named operators match exactly between Machine definition and Progress binding
3. Ensure bound operator addresses have required permissions for their workflow steps
4. Check that supplier services exist and are published if referenced in forwards

### Workflow Execution Issues
**Problem**: "Operation blocked" or "Threshold not met"  
**Solutions**:
1. Verify bound operators have correct permissions for the operation they're trying to execute
2. Check Guard verification if operations require additional conditions
3. Ensure correct operation.next_node_name and operation.forward match Machine definition
4. Confirm supplier orders are provided if forwards require bRequired services

### Service Supplier Errors
**Problem**: "Supplier verification failed" or "Required service missing"  
**Solutions**:
1. Verify all bRequired: true services have corresponding orders in deliverable
2. Ensure exactly one bRequired: false service is selected (not zero, not multiple)
3. Check that referenced Service objects are published and accessible
4. Confirm Order objects are valid and belong to specified services

**Development Tip**: Design and test Machine workflows thoroughly before publishing. Use Development → Testing → Publishing progression. Keep JSON configurations for reference and troubleshooting.

---

## 11. Configuration Reference

### Witness Parameters

The transaction requires submission of certain information in order to meet the verification conditions set by Guard. When an operation requires verification of a witness, it returns a structure that can hold the witness. The signatory needs to complete the structure containing the "witness" information and then resubmit the transaction.

```json
{
  "witness": {
    "guards": ["guard_object_address"],
    "witness": [
      {
        "guard": "guard_object_address",
        "identifier": 1,
        "type": 101,
        "witness": "witness_value",
        "cmd": [{"cmd": 1}],
        "cited": 1,
        "witnessTypes": [35]
      }
    ]
  }
}
```

For detailed Guard and Witness functionality, see [Guard Object Documentation](Guard.md).

---