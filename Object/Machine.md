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
Machine object defines node structures and transition rules for workflow execution, specifying workflow stages, operation permissions, and threshold requirements.

Machine defines workflow parameters, while Progress instances execute workflows with bound operators and task data.

### Core Capabilities
- **Node Structure Management**: Create, modify, and organize workflow stages with dependency rules
- **Forward Operation Configuration**: Define approval buttons that move workflow forward. Set who can click each button, what role they play, and how many approval points each click contributes.
- **Message Delivery System**: Forwards can store messages and data for Progress instances to retrieve during execution
- **Flexible Operator Assignment**: Each Progress instance can assign different or same qualified operators to the same workflow roles for flexible management
- **Multi-Service Reusability**: Same Machine template can be referenced by multiple Service objects with different operator configurations
- **Cross-Object Integration**: Reference Service objects, Guard verification, and Repository data within operations. Parent-child Progress relationships enable supply chain management.

### Workflow Implementation Process
The typical workflow implementation follows these steps:
1. **Configure**: Define Machine node structures, operation permissions, and Guard verification rules
2. **Publish**: Set `bPublished: true` to enable Progress creation (Machine becomes immutable after publishing)
3. **Test**: Create Progress instances to verify all workflow branches work as expected
4. **Production**: Bind Machine to Service objects or deploy to production environment after successful testing
**Notes**:
- **Immutability**: Published Machines cannot modify.
- **Modification Path**: Use clone operation to create a new modified versions of existing Machines
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

Build your workflow by creating workflow stages (nodes) and connecting them with operations. Each node represents a workflow stage with specific requirements that must be met before advancing to the next stage.

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

### Individual Node Configuration

Define a single workflow node with its connections, threshold requirements, and available operations:

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
| `threshold` | number ≥0 | **Required** | Minimum weight points required for advancement - see [Threshold Logic](#7-threshold-and-weight-logic) |
| `forwards` | array | **Required** | Available operations that can be executed from this stage connection |

**Node Connection Logic**: Each `pairs` entry creates a connection from `prior_node` to this node. Multiple pairs allow a single node to be reached from different previous stages, enabling branching and merging workflow paths.

### Forward Operation Configuration

Forward operations define executable actions that advance workflow between nodes. Each forward specifies required permissions, weight contribution toward threshold, and optional Guard verification.

```json
{
   "name": "approve_order",  // Operation identifier for Progress execution
   "permission": 1001,  // Custom permission index ≥1000 - if Guard is also set inside permission, must satisfy both Guards in permission and forward.
   "namedOperator": "order_processor",  // Role template name for operator binding - users with permission OR bound operators can execute (union)
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
| `permission` | number ≥1000 | Option | Custom permission index from Permission object - determines who can execute |
| `namedOperator` | string | Optional | Role template name for operator binding - Progress instances map actual addresses to this role |
| `weight` | number ≥1 | **Required** | Points contributed toward threshold when operation executes successfully |
| `guard` | string | Optional | Guard object address for additional verification - see [Guard Object Documentation](Guard.md#guard-data-concepts) |
| `suppliers` | array | Optional | Service objects for multi-vendor coordination - see Service Suppliers Configuration |

**Access Control Requirements**: At least one of `guard`, `permission`, or `namedOperator` must be specified for each forward operation.

### Service Suppliers Configuration

Service suppliers coordinate workflow operations with external Service objects during forward execution.

```json
 "suppliers": [
   {"service": "inventory_check_service", "bRequired": true},  // Must provide order
   {"service": "express_shipping", "bRequired": false},  // Optional choice A
   {"service": "standard_shipping", "bRequired": false}  // Optional choice B
 ]
```

**Supplier Execution Logic**: 
- All services with `bRequired: true` must provide orders
- From services with `bRequired: false`, at least one must be selected
- Example: 1 required service + 2 optional services = minimum 2 orders total (1 required + at least 1 from optional group)
- **Use Cases**: Multi-vendor coordination, service dependency management, flexible service combinations within workflows

### Threshold and Weight Logic

Weight accumulation controls workflow advancement between nodes. Forward operations contribute weight points toward the target node's threshold requirement.

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
- **Weighted Vote**: One person has 2 weight, two others have 1 weight each, threshold = 3 → decision requires the 2-weight person plus at least one other
- **Flexible Authority**: Two people have 1 weight each, one manager has 2 weight, threshold = 2 → enables both collaboration (1+1) and executive override (manager alone)
- **Partial Progress**: Operations with insufficient weight remain pending at current node until threshold satisfied

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

| Field | Purpose | Content Examples |
|-------|---------|------------------|
| `msg` | Store any data for communication in the progress | Links, text, parameters, status information |
| `orders` | Reference supplier services | Order objects from required/optional services |

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

---

## Part 2: Progress Operations

## 5. Progress Operations

Progress operations execute workflows defined by Machine templates. For Machine-Progress relationship concepts, see [Overview](#overview).

**Key Concepts**:
- **Instance Independence**: Each Progress tracks separate workflow execution
- **Operator Binding**: Template roles (namedOperator) bound to actual operator addresses
- **Execution State**: Current node, completed operations, pending approvals
- **Task Association**: Optional link to Order, custom object, or business entity (cannot be unbound once set)

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

Operator binding assigns specific entity to Machine template roles for individual Progress execution. Each Progress instance can have same or different operators while following the same workflow rules.

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

> 💡 **AI Prompt Tip**: "Today my customer is ABC Corp, delivery driver is John Smith, and manager is Alice Johnson. Please assign operators for my progress_order_12345."

### Workflow Execution Operations

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

**Branch Selection**: Same node can lead to different next nodes through different forward operations. Each forward has independent conditions and leads to specific target nodes. Since operations are atomic, Progress can only advance to one target node per execution.When a node has multiple forward operations, you must specify exactly which forward to execute.

**Example**: From "ticket_purchased" node → either "normal_service" (through "start_service" forward) OR "refund_process" (through "request_refund" forward). Each forward has different permission/Guard requirements.
---

## 6. Execution Management

### Progress Context Management

Link Repository objects to Progress instances for execution-specific data storage. No limit on number of Repository objects that can be linked.

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

Set parent Progress as management label for organizational purposes. Parent Progress serves as administrative tag without functional workflow impact.

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

**Hold Authority**: When someone holds a Progress operation (to prevent task grabbing), only the original holder can release the hold state, or administrators can override using `adminUnhold: true`.

### Task Assignment Updates

Set business object binding for manually created Progress instances. Once bound, task association cannot be changed or removed.

```json
{
  "data": {
  "progress_task": {
       "progress": "order_abc123_progress",  // Target Progress instance  
       "task_address": "order_abc456"  // Business object to bind - cannot be unbound once set
    }
  }
}
```

**Task Binding Rules**:
- **Manual Progress**: Created from Machine template - can manually bind task using `progress_task`
- **Service Progress**: Created from Service purchase - automatically binds to Order object
- **Binding Permanence**: Once task is bound, it cannot be changed or removed

---

## 8. Complete Examples

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

### Data Type Enumerations

| Data Type | Values | Description |
|-----------|--------|-------------|
| **Boolean** | `true`, `false` | Logical values (bPublished, bPaused) |
| **Network** | `"sui mainnet"`, `"sui testnet"`, `"wowok mainnet"`, `"wowok testnet"` | Blockchain network selection |
| **Session Retention** | `"always"`, `"session"` | Network configuration persistence |
| **Address Resolution** | `true`, `false` | Local mark vs account name priority |
| **Visibility** | `true`, `false` | On-chain metadata visibility |

### Machine Parameter Constraints

| Parameter | Min Value | Max Value | Special Rules |
|-----------|-----------|-----------|---------------|
| `threshold` | `1` | No limit | Must be ≥ 1 for node activation |
| `weight` | `0` | No limit | Must be ≥ 0 for forward operations |
| `permissionIndex` | `0` | No limit | 0=no permission, ≥1000=business permission |
| `guardId` | `1` | `255` | Guard identifier within Guard object |
| `message_length` | `0` | No limit | Forward message content length |

### Default Values Summary

| Parameter Category | Common Defaults |
|-------------------|-----------------|
| **Boolean Flags** | `false` (onChain, bPublished, bPaused, local_mark_first) |
| **Arrays** | `[]` (tags, forwards, serviceSuppliers) |
| **Strings** | `""` (name), `null` (machine) |
| **Numbers** | `1` (threshold), `0` (weight, permissionIndex) |
| **Objects** | `null` (machine reference) |

### Basic Node Structure Reference

| Pattern | Structure | Use Case |
|---------|-----------|----------|
| **Linear** | A → B → C, threshold=1 per node | Document review, sequential tasks |
| **Parallel** | A → (B1 + B2) → C, threshold=2 at C | Dual-signature requirements |
| **Branching** | A → B1 or B2, different forwards | Approval vs rejection paths |
| **Weighted** | Multiple forwards with different weights | Hierarchical approval systems |

**Visual Workflow Patterns**:

```mermaid
graph TD
    subgraph "Linear Pattern"
        A1[Order Received] -->|threshold=1| B1[Order Validated]
        B1 -->|threshold=1| C1[Order Shipped]
    end
    
    subgraph "Parallel Pattern"
        A2[Contract Draft] --> B2[Legal Review]
        A2 --> B3[Business Review]
        B2 -->|weight=1| C2[Ready to Sign]
        B3 -->|weight=1| C2
        C2 -.->|threshold=2| D2[Contract Signed]
    end
    
    subgraph "Branching Pattern"
        A3[Payment Received] -->|approve_forward| B4[Service Started]
        A3 -->|reject_forward| B5[Refund Process]
    end
    
    subgraph "Weighted Pattern"
        A4[Budget Request] -->|manager_approve: weight=2| B6[Approved]
        A4 -->|staff_approve: weight=1| B6
        B6 -.->|threshold=2| C4[Budget Released]
    end
```
---

## Part 4: Reference Materials


## 10. Real Implementation Examples

### Flower Delivery Machine: Complete Workflow

**Business Case**: Jake's flower delivery service with automatic payment protection and refund mechanisms.

**Machine Structure**: 8-node workflow handling order confirmation, product verification, delivery completion, and exception handling with price upgrade loops.

```json
// Actual deployed Machine configuration - tested and functional
{
  "account": "delivery_provider",
  "data": {
    "object": {
      "name": "flower_delivery_machine_v4_simplified",
      "permission": "errand_delivery_permission",
      "onChain": true,
      "tags": ["flower", "delivery", "errand"]
    },
    "description": "Flower delivery workflow with 8 core nodes and price upgrade mechanism",
    "nodes": {
      "op": "add",
      "data": [
        {
          "name": "order_confirmation",
          "pairs": [{
            "prior_node": "",
            "threshold": 1,
            "forwards": [{
              "name": "confirm_order_details",
              "namedOperator": "delivery_person",
              "weight": 1
            }]
          }]
        },
        {
          "name": "product_confirmation", 
          "pairs": [
            {
              "prior_node": "order_confirmation",
              "threshold": 2,
              "forwards": [
                {
                  "name": "upload_product_photo",
                  "namedOperator": "delivery_person", 
                  "weight": 1
                },
                {
                  "name": "buyer_confirm_purchase",
                  "namedOperator": "buyer",
                  "weight": 1
                }
              ]
            },
            {
              "prior_node": "price_upgrade",
              "threshold": 2,
              "forwards": [
                {
                  "name": "upload_product_photo",
                  "namedOperator": "delivery_person",
                  "weight": 1
                },
                {
                  "name": "buyer_confirm_purchase", 
                  "namedOperator": "buyer",
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "price_upgrade",
          "pairs": [{
            "prior_node": "order_confirmation",
            "threshold": 1,
            "forwards": [{
              "name": "buyer_agree_upgrade",
              "namedOperator": "buyer",
              "weight": 1,
              "suppliers": [{
                "service": "flower_delivery_extra_fee_service",
                "bRequired": false
              }]
            }]
          }]
        }
      ]
    }
  }
}
```

**Key Implementation Features**:
- **Dual Approval**: `threshold: 2` requires both delivery person and buyer confirmation
- **Price Upgrade Loop**: Enables cost adjustments with buyer approval and supplier service integration
- **Role-Based Access**: Different `namedOperator` roles for different participants
- **Service Integration**: Uses `suppliers` mechanism for extra fee handling

**Deployed Address**: `0x49415465ca622f1cb42e3867f7211a844e57993af8cf5143326023a1eed8b301`

### LA28 Olympic Volunteer Machine: Multi-Stage Verification

**Business Case**: Olympic volunteer lifecycle management with triple verification and nested service architecture.

**Machine Structure**: 7-node workflow with triple Guard verification, supplier mechanism for task assignment, and hierarchical approval system.

```json
// Actual LA28 Machine configuration - managing 100,000 volunteer applications
{
  "account": "la28_organizer",
  "data": {
    "object": {
      "name": "LA28 Main Machine Final Correct Configuration",
      "permission": "LA28_Owner",
      "onChain": true,
      "tags": ["LA28", "volunteer", "olympic"]
    },
    "description": "LA28 volunteer lifecycle management with triple verification and supplier mechanism",
    "nodes": {
      "op": "add", 
      "data": [
        {
          "name": "Application",
          "pairs": [{
            "prior_node": "",
            "threshold": 3,
            "forwards": [
              {
                "name": "Basic Qualification Verification",
                "permission": 1001,
                "namedOperator": "system_verifier",
                "weight": 1,
                "guard": "LA28_Basic_Qualification_Guard"
              },
              {
                "name": "Professional Skill Verification", 
                "permission": 1001,
                "namedOperator": "system_verifier",
                "weight": 1,
                "guard": "LA28_Professional_Skill_Guard"
              },
              {
                "name": "Position Matching Verification",
                "permission": 1001, 
                "namedOperator": "system_verifier",
                "weight": 1,
                "guard": "LA28_Position_Matching_Guard"
              }
            ]
          }]
        },
        {
          "name": "Task Assignment",
          "pairs": [{
            "prior_node": "Application Approved",
            "threshold": 1,
            "forwards": [{
              "name": "Assign Specific Task",
              "permission": 1003,
              "namedOperator": "team_lead",
              "weight": 1,
              "suppliers": [{
                "service": "LA28_Subservice_Language_Assistance",
                "bRequired": false
              }]
            }]
          }]
        }
      ]
    }
  }
}
```

**Key Implementation Features**:
- **Triple Verification**: `threshold: 3` requires all three Guard verifications to pass
- **Guard Integration**: Each forward uses different Guard for qualification, skill, and position matching
- **Supplier Mechanism**: Task assignment requires selecting from available sub-services
- **Hierarchical Roles**: Different permission levels (1001, 1003) for different approval stages

**Deployed Address**: `0xfdce0ac5cba309d3bd3d36de352e5946f1022d22a263048f57f577dbac578449`

### Guard Verification in Practice

**Real Witness Usage**: LA28 basic qualification verification

```json
// Actual witness data for LA28 qualification check
{
  "witness": {
    "guards": ["0x3af6b8079bac66f164de2fa327aa89a16014c243342241b703bc297bdc287c68"],
    "witness": [
      {
        "guard": "0x3af6b8079bac66f164de2fa327aa89a16014c243342241b703bc297bdc287c68",
        "identifier": 1,
        "type": 101,
        "witness": "0xvolunteer_address_here",  // Volunteer's address for qualification lookup
        "cmd": [],
        "cited": 1,
        "witnessTypes": []
      }
    ]
  }
}
```

**Guard Logic**: Checks Repository data to verify `qualification_status == "approved"` for the provided volunteer address.

**Repository Query**: Uses query function 113 to retrieve string data from address + field combination.

For complete Guard implementation details, see [Guard Object Documentation](Guard.md#complete-examples).

For detailed Guard and Witness functionality, see [Guard Object Documentation](Guard.md).

---