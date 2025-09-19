# Machine Object: Your Workflow Blueprint Designer

> "Create reusable workflow templates that define how complex processes flow from start to finish, with automatic execution through Progress instances"

**MCP Tool**: [`wowok_machine_mcp_server`](https://www.npmjs.com/package/wowok_machine_mcp_server)

## How to Use This Documentation

### Document Structure
**Part 1: Machine Template (Sections 1-6)**
- **[Overview](#overview)**: Machine concepts and Progress relationship
- **[Core Parameters](#core-parameters)**: Machine template configuration options
- **[Data Types & Formats](#data-types--formats)**: Technical reference for workflow structures
- **[Integration Patterns](#integration-patterns)**: How Machine coordinates with other objects
- **[Machine Examples](#machine-examples)**: Template configuration examples

**Part 2: Progress Operations (Sections 7-9)**
- **[Progress Operations](#progress-operations)**: Complete Progress technical reference
- **[Complete Workflow Examples](#complete-workflow-examples)**: End-to-end implementation
- **[Common Issues & Troubleshooting](#common-issues--troubleshooting)**: Problem resolution

### Navigation by Need
| I need to... | Go to section |
|--------------|---------------|
| Understand Machine vs Progress difference | [Overview](#overview) |
| Create basic workflow template | [Core Parameters → Node Management](#3-node-management) |
| See simplest working example | [Machine Examples](#machine-examples) |
| Add advanced workflow rules | [Core Parameters → Forward Configuration](#4-forward-configuration) |
| Execute workflow instances | [Progress Operations](#progress-operations) |
| Connect with other objects | [Integration Patterns](#integration-patterns) |
| Fix broken workflows | [Common Issues & Troubleshooting](#common-issues--troubleshooting) |

---

## Overview

### Definition
Machine objects create reusable workflow blueprints for multi-step business processes. Like a restaurant's standard operating procedure, one Machine template can guide unlimited workflow executions with different people and data.

Instead of manually coordinating each approval process, Machine automates workflow logic while Progress instances handle actual execution.

### Core Capabilities
- **Workflow Template Creation**: Define multi-step processes with branching logic and approval requirements
- **Progress Instance Generation**: Launch executable workflow instances from your template
- **Cross-Object Coordination**: Integrate Service objects, Guard verification, and Repository data within workflows

### Machine vs Progress Relationship
Think of Machine as a workflow recipe and Progress as cooking a specific meal:
- **Machine**: The recipe defining ingredients, steps, and timing
- **Progress**: Actually cooking Tuesday's dinner following that recipe

One Machine can generate unlimited Progress instances - for example, an "Order Fulfillment" Machine creates separate Progress instances for each customer order, each following the same workflow steps but with different participants and data.

### Workflow Implementation Process
1. **Design**: Map your business process into Machine nodes and approvals
2. **Test**: Verify workflow logic with sample executions
3. **Deploy**: Publish Machine to enable real business usage
4. **Execute**: Launch Progress instances for actual work completion

**Notes**:
- **Immutability**: Published Machines cannot modify node structure
- **Modification Path**: Use clone operation to create modified versions of existing Machines
- **Gas Optimization**: Complex Machine creation requires significant gas - design thoroughly before deployment

---

## Core Parameters

### 1. Account & Object Identification

**Note**: All Machine operations require `account` parameter to specify transaction signer. If omitted, current active account is used.

#### Object Reference (Existing Machine)
```json
{
  "object": "existing_machine_name_or_address"
}
```

#### Object Creation (New Machine)
```json
{
  "object": {
    "name": "order_fulfillment_machine",
    "onChain": true,
    "permission": "business_permission_object",
    "tags": ["orders", "fulfillment", "customer-service"],
    "useAddressIfNameExist": false
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Optional | Machine template identifier |
| `onChain` | boolean | Optional | Whether metadata visible on blockchain |
| `permission` | string/object | Required | Permission object controlling Machine management |
| `tags` | string[] | Optional | Workflow categorization labels |
| `useAddressIfNameExist` | boolean | Optional | Name conflict resolution |

---

### 2. Basic Configuration

```json
{
  "description": "Order processing workflow from receipt to delivery with customer approval steps",
  "endpoint": "https://api.example.com/progress-integration",
  "bPublished": false,
  "bPaused": false
}
```

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `description` | string | Human-readable workflow purpose | None |
| `endpoint` | string | HTTPS API for Progress integration callbacks | None |
| `bPublished` | boolean | Enable Progress creation (makes Machine immutable) | false |
| `bPaused` | boolean | Temporarily disable new Progress creation | false |

**Publishing Strategy**: Keep `bPublished: false` during design and testing. Set `true` only when workflow is finalized - published Machines cannot modify node structure.

**API Integration**: The `endpoint` receives callbacks for Progress operations with format: `"?&machine={machine_id}&progress={progress_id}"`

---
### 3. Node Management

Node management defines workflow structure through interconnected stages and transition rules.

#### Nodes Operation Structure
Define workflow stages and their connections through layered parameter configuration.

```json
{
  "nodes": {
    "op": "add",
    "data": [...]
  }
}
```
**Operation Mechanics**: `op` specifies modification type (add/remove/rename), `data` contains node configurations for the operation.

#### Node Definition Structure
Each node represents a workflow stage with connection rules.

```json
{
  "name": "stage_name",
  "pairs": [...]
}
```
**Node Mechanics**: Progress operations reference `name` to identify target stage. `pairs` array defines prerequisite stages and advancement requirements.

#### Connection Logic Structure
Each pair defines transition rules between workflow stages.

```json
{
  "prior_node": "previous_stage",
  "threshold": 2,
  "forwards": [...]
}
```
**Connection Mechanics**: Workflow can only reach this stage after `prior_node` completion. Requires `threshold` weight points from `forwards` execution to advance further.

#### Forward Operation Structure
Each forward defines an executable operation with access control and weight contribution.

```json
{
  "name": "operation_name",
  "permission": 1001,
  "namedOperator": "role_name",
  "weight": 1
}
```
**Operation Mechanics**: Progress execution references `name`. System validates `permission` index and `namedOperator` binding before allowing execution. Successful execution contributes `weight` toward threshold.

#### Threshold and Weight Logic
Weight points accumulate from executed forwards until threshold reached, then workflow advances.

```json
{
  "threshold": 2,
  "forwards": [
    {"weight": 1},
    {"weight": 1}
  ]
}
```
**Accumulation**: Each executed forward contributes its weight value. When total weight ≥ threshold, workflow advances to target node and weight counter resets.

**Partial Completion**: Operations with insufficient total weight remain pending at current node until threshold satisfied.

**Concurrent Execution**: Multiple forwards can execute simultaneously. Weight accumulation is atomic per operation.

#### Complete Node Structure Example
Simple two-stage workflow demonstrating all structural concepts:

```json
{
  "nodes": {
    "op": "add",
    "data": [
      {
        "name": "stage_a",
        "pairs": [{
          "prior_node": "",
          "threshold": 1,
          "forwards": [{
            "name": "advance_operation",
            "permission": 1001,
            "namedOperator": "role_template",
            "weight": 1
          }]
        }]
      },
      {
        "name": "stage_b",
        "pairs": [{
          "prior_node": "stage_a",
          "threshold": 1,
          "forwards": []
        }]
      }
    ]
  }
}
```
**Implementation**: Workflow advances from stage_a to stage_b when user with permission 1001 and role_template binding executes advance_operation.

#### Additional Node Operations

**Remove Nodes**:
```json
{
  "nodes": {
    "op": "remove",
    "names": ["node_name"]
  }
}
```

**Rename Nodes**:
```json
{
  "nodes": {
    "op": "rename node",
    "data": [{
      "old": "current_name",
      "new": "updated_name"
    }]
  }
}
```

#### Parameter Reference Tables

**Node Structure Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Required | Unique identifier for workflow stage |
| `pairs` | array | Required | Connection definitions to other nodes |

**Connection Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prior_node` | string | Required | Previous stage name ("" for initial node) |
| `threshold` | number | Required | Weight points needed to advance |
| `forwards` | array | Required | Available operations from this stage |

**Forward Operation Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Required | Operation identifier for Progress execution |
| `permission` | number ≥1000 | Required | Custom permission index required |
| `namedOperator` | string | Required | Role template for address binding |
| `weight` | number ≥1 | Required | Points contributed toward threshold |

For advanced forward parameters (Guards, Service suppliers), see [Forward Configuration](#4-forward-configuration).

---

### 4. Forward Configuration

Forward configuration defines advanced operation parameters beyond basic workflow structure.

#### Advanced Forward Parameters
For basic understanding of permission and namedOperator concepts, see [Node Management](#3-node-management).

This section covers advanced forward parameters:
```json
{
  "name": "confirm_order",
  "permission": 1001,
  "namedOperator": "customer_service",
  "weight": 1,
  "guard": "business_hours_guard",
  "suppliers": [
    {
      "service": "inventory_check_service",
      "bRequired": true
    },
    {
      "service": "payment_verification_service",
      "bRequired": false
    }
  ]
}
```

#### Guard Integration
**Guard objects provide additional verification conditions beyond permission checks:**
- **Purpose**: Verify complex business conditions (time windows, location requirements, document verification)
- **Execution**: Guard verification runs alongside permission validation
- **Failure**: If Guard verification fails, operation is blocked regardless of permissions
- **Use Cases**: Working hours restrictions, manager presence requirements, quality approval gates

#### Service Suppliers Integration
**Suppliers enable workflow coordination with Service objects:**
- **Required Services** (`bRequired: true`): All must provide orders during operation execution
- **Optional Services** (`bRequired: false`): Exactly one must be selected from the optional group
- **Execution Logic**: Progress operations must provide Order objects from supplier services
- **Use Cases**: Multi-vendor coordination, service dependency management

#### Threshold and Weight Logic
**Weight accumulation controls workflow advancement:**
- **Single Approval**: `threshold: 1`, any forward with `weight: 1` can advance
- **Dual Approval**: `threshold: 2`, need two forwards with `weight: 1` each
- **Weighted Vote**: Manager `weight: 2`, Staff `weight: 1`, `threshold: 3` = Manager + Staff OR three Staff
- **Partial Progress**: Operations with insufficient weight remain pending until threshold reached

#### Service Suppliers Configuration
```json
"suppliers": [
  {"service": "required_service", "bRequired": true},
  {"service": "optional_service_1", "bRequired": false},
  {"service": "optional_service_2", "bRequired": false}
]
```

**Supplier Execution Logic**: All required services (`bRequired: true`) must provide orders + exactly one optional service (`bRequired: false`) must be selected during Progress execution.

#### Add Forward Operations
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
          "namedOperator": "shipping_team",
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

### 5. Advanced Features

#### Consensus Repository Management
Link Repository objects for shared data across all Progress instances:

```json
{
  "consensus_repository": {
    "op": "add",
    "objects": ["customer_data_repo", "standard_procedures_repo"]
  }
}
```

**Use Case**: Customer information, standard procedures, quality metrics that all workflow executions reference.

#### Machine Cloning
Create Machine variants with modified structure:

```json
{
  "clone_new": {
    "namedNew": {
      "name": "express_order_machine",
      "onChain": true,
      "tags": ["express", "priority"]
    }
  }
}
```

**Use Case**: Create variations of existing workflows (express vs standard processing).

#### Network Configuration
```json
{
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```

---

## Data Types & Formats

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

## Integration Patterns

### Machine + Service Integration
**Service Purchase Triggers Progress**: When customers purchase Services that reference Machine workflows, Progress instances are automatically created to track service delivery through Machine-defined steps.

**Supplier Coordination**: Machine workflows can require specific Service objects as suppliers, enabling automatic coordination between multiple service providers within single workflow execution.

### Machine + Repository Integration
**Consensus Repository**: Link Repository objects to Machine for shared data across all Progress instances - customer information, standard procedures, quality metrics that all workflow executions reference.

**Progress Context Repository**: Individual Progress instances can have dedicated Repository for instance-specific communication, file sharing, and collaboration data.

### Machine + Guard Integration
**Workflow Gate Conditions**: Guards verify complex business conditions before workflow advancement - time windows, location requirements, document verification, multi-party approval through external systems.

**Operation-Level Verification**: Each forward operation can have Guard verification, enabling conditional workflow paths based on real-time verification (working hours, manager presence, quality approval).

### Common Machine Patterns

| Pattern | Machine Design | Use Case |
|---------|----------------|----------|
| **Sequential Approval** | Linear nodes, threshold=1 | Document workflows, task chains |
| **Multi-Party Approval** | Single node, threshold>1 | Contract signatures, fund releases |
| **Escalation Workflow** | Branching with timeout/override paths | Approval with manager escalation |
| **Service Coordination** | Nodes with required suppliers | Multi-vendor project management |

---

## Machine Examples

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
                  "namedOperator": "contract_author",
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

---

## Progress Operations

The following sections cover Progress instance operations that execute workflows defined in Machine templates. For Machine template configuration, see [Core Parameters](#core-parameters).

### Understanding Progress Instances
Progress objects are independent workflow execution instances that track specific task completion through Machine-defined steps. Each Progress follows the Machine template but has unique participants, data, and execution history.

**Key Concepts**:
- **Instance Independence**: Each Progress tracks separate workflow execution
- **Operator Binding**: Template roles (namedOperator) bound to actual addresses
- **Execution State**: Current node, completed operations, pending approvals
- **Task Association**: Optional link to Order, custom object, or business entity

### Progress Instance Creation
```json
{
  "progress_new": {
    "namedNew": {
      "name": "contract_abc123_progress", 
      "onChain": true,
      "tags": ["contract", "client_xyz", "urgent"]
    },
    "task_address": "contract_abc123_object"
  }
}
```

**Parameters**:
- `task_address`: Optional reference to related business object (Order, custom object)
- Progress inherits Machine's node structure and forward rules
- Initial node is automatically set to first node with `prior_node: ""`

### Operator Binding
```json
{
  "progress_namedOperator": {
    "progress": "contract_abc123_progress",
    "data": [
      {
        "name": "contract_author",
        "operators": [
          {
            "name_or_address": "alice_legal_writer",
            "local_mark_first": true
          }
        ]
      },
      {
        "name": "legal_team",
        "operators": [
          {
            "name_or_address": "bob_legal_reviewer",
            "local_mark_first": true
          },
          {
            "name_or_address": "carol_compliance",
            "local_mark_first": true
          }
        ]
      }
    ]
  }
}
```

**Operator Binding Logic**:
- `name` must match `namedOperator` defined in Machine forwards
- Multiple operators can be bound to same role (any bound operator can execute)
- Bound operators must have required permissions for their operations

### Workflow Execution
```json
{
  "progress_next": {
    "progress": "contract_abc123_progress", 
    "operation": {
      "next_node_name": "ready_to_sign",
      "forward": "legal_approve"
    },
    "deliverable": {
      "msg": "Legal review completed - contract terms comply with company policy and regulatory requirements",
      "orders": ["legal_service_order_789"]
    }
  }
}
```

**Execution Parameters**:
- `next_node_name`: Target node defined in Machine template
- `forward`: Operation name matching Machine forward definition
- `msg`: Required description of work completed
- `orders`: Optional Order objects from supplier services

**Execution Logic**:
- System verifies operator has required permission
- Guard verification performed if forward specifies guard
- Weight contributed toward target node threshold
- Progress advances when threshold reached

### Context Management
```json
{
  "progress_context_repository": {
    "progress": "contract_abc123_progress",
    "repository": "contract_communication_repo"
  }
}
```

**Context Repository**: Provides dedicated data storage for this Progress instance - documents, communications, file attachments specific to this workflow execution.

### Parent-Child Relationships
```json
{
  "progress_parent": {
    "progress": "sub_contract_progress",
    "parent": {
      "parent_id": "main_project_progress",
      "parent_session_id": 0,
      "operation": {
        "next_node_name": "subcontract_completed",
        "forward": "complete_subcontract"
      }
    }
  }
}
```

**Hierarchical Workflows**: Create nested Progress structures where sub-tasks completion triggers advancement in parent workflow.

### Hold/Resume Operations
```json
{
  "progress_hold": {
    "progress": "contract_abc123_progress",
    "operation": {
      "next_node_name": "ready_to_sign", 
      "forward": "business_approve"
    },
    "bHold": true,
    "adminUnhold": false
  }
}
```

**Hold Management**:
- `bHold: true`: Temporarily prevent specific operation execution
- `bHold: false`: Resume normal operation
- `adminUnhold: true`: Admin override to force resume

### Task Assignment
```json
{
  "progress_task": {
    "progress": "contract_abc123_progress",
    "task_address": "updated_contract_object"
  }
}
```

**Task Updates**: Change or set the business object associated with Progress execution.

---

## Complete Workflow Examples

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
                  "namedOperator": "shipping_team",
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

## Common Issues & Troubleshooting

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