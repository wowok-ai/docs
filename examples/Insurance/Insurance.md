# Insurance Service Example

A complete example demonstrating how to create an outdoor accident insurance service using WoWok protocol. This insurance service is designed to be purchased by travel service providers as part of a travel package (supply chain sub-order).

> **View Actual Execution Results**: See [Insurance_TestResults.md](Insurance_TestResults.md) for real testnet execution results with actual object addresses and transaction outputs.

---

## Core Requirements & Features

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| **Insurance Claims** | Process insurance claims with time-lock verification | Machine with Start -> Complete workflow |
| **Time-Lock Guard** | Prevent premature claim completion | Guard using Order + convert_witness(TypeOrderProgress) to verify clock > progress.current_time + lock_duration |
| **Supply Chain Integration** | Support sub-order creation by travel service providers | Order can be created by authorized agents (travel_provider) |
| **Permission Control** | Role-based access for insurance operations | Permission object with custom indexes for claim processing |

### Key Design Decisions

1. **Time-Lock via Witness Conversion**: The Complete node Guard uses `convert_witness: 100` (TypeOrderProgress) to convert the submitted Order ID into its associated Progress object, then queries `progress.current_time` to verify the time-lock condition.
2. **Simple Two-Node Workflow**: Insurance claims follow a straightforward Start -> Complete path, keeping the workflow simple and predictable.
3. **Order ID as Submission**: The Order ID is submitted at runtime (`b_submission: true`) and used for witness conversion.
4. **Machine Creation Pattern**: Machine must be created first, then nodes added separately, then published. Creating machine with nodes and publish in one transaction does not work correctly.

---

## Overview

This example demonstrates:

- **Insurance Service Setup**: Permission, Guard, Machine, and Service creation
- **Time-Lock Guard**: Using Order + convert_witness to access Progress data
- **Workflow Automation**: Machine-driven claim processing

---

## Architecture

### System Components

```
------------------------------------------------------------------
|                    Insurance Service System                      |
|------------------------------------------------------------------|
|                                                                  |
|  +-----------------+    +-----------------+                     |
|  |   Permission    |    |     Guard       |                     |
|  | (insurance_     |    | (insurance_     |                     |
|  |  permission)    |    |  complete_guard)|                     |
|  +--------+--------+    +--------+--------+                     |
|           |                      |                              |
|           v                      v                              |
|  +-----------------+    +-----------------+                     |
|  |    Machine      |    |    Service      |                     |
|  | (insurance_     |<---| (insurance_     |                     |
|  |  machine)       |    |  service)       |                     |
|  +-----------------+    +-----------------+                     |
|                                                                  |
|  Workflow: Start -> Complete (Time-Lock Guard)                  |
|                                                                  |
------------------------------------------------------------------
```

### Claim Workflow

```
+----------+         +--------------+
|  Start   |-------->|   Complete   |
|          |         | (Time-Lock)  |
+----------+         +--------------+
```

**Guard Logic**:
```
clock > progress.current_time + 1000ms
(progress accessed via Order + convert_witness=TypeOrderProgress)
```

---

## Prerequisites

Before running this example, ensure you have:

1. An account named `insurance_provider_v1` with sufficient WOW tokens
2. Access to the WoWok MCP server

### Create Insurance Provider Account

**Prompt**: Create a new account named "insurance_provider_v1" for the insurance service provider.

```json
{
  "gen": {
    "name": "insurance_provider_v1",
    "replaceExistName": true
  }
}
```

### Get Test Tokens

**Prompt**: Request testnet WOW tokens for account "insurance_provider_v1".

```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "insurance_provider_v1"
  }
}
```

---

## Step 1: Create Permission Object

Create a Permission object to manage access control for the insurance service.

**Prompt**: Create a Permission object named "insurance_permission" for the insurance service.

```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "insurance_permission_v1",
      "replaceExistName": true
    },
    "description": "Permission for outdoor accident insurance service",
    "table": {
      "op": "add perm by entity",
      "entity": {"name_or_address": "insurance_provider_v1"},
      "index": [1000, 1001, 1002, 1003, 1004, 1005]
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

---

## Step 2: Create Time-Lock Complete Guard

Create a Guard that verifies the time-lock condition for claim completion. The Guard uses the submitted Order ID with `convert_witness: 100` (TypeOrderProgress) to access the associated Progress object and query `progress.current_time`.

**Guard Logic**:
```
clock > progress.current_time + 1000
```

**Prompt**: Create a Guard named "insurance_complete_guard" for time-lock verification on claim completion.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "insurance_complete_guard_v1",
      "tags": ["insurance", "time-lock", "complete"],
      "replaceExistName": true
    },
    "description": "Time-lock guard for insurance claim completion. Requires current clock > progress.current_time + 1000ms (1 second for TESTING; in production set to reasonable duration like 8 hours). Progress is accessed via Order with convert_witness=TypeOrderProgress(100).",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "value": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "name": "Order ID (submitted at runtime)"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": 1000
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_as_u256_greater",
        "nodes": [
          {
            "type": "context",
            "context": "Clock"
          },
          {
            "type": "calc_number_add",
            "nodes": [
              {
                "type": "query",
                "query": "progress.current_time",
                "object": {
                  "identifier": 0,
                  "convert_witness": 100
                },
                "parameters": []
              },
              {
                "type": "identifier",
                "identifier": 1
              }
            ]
          }
        ]
      }
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Guard Table**:

| identifier | b_submission | value_type | value | Purpose |
|------------|-------------|-----------|-------|---------|
| 0 | **true** | Address | 0x0...0 (placeholder) | Order ID submitted at runtime, converted to Progress via convert_witness |
| 1 | false | U64 | 1000 | Time-lock duration in ms (1 second for testing) |

> **Important**: `1000` ms (1 second) is for testing only. In production, set to a reasonable duration (e.g., 8 hours = 28800000 ms).

---

## Step 3: Create Withdraw Guard for Order Allocators

Create a Guard that allows the insurance provider to withdraw funds after the order reaches the Complete node.

**Prompt**: Create a Guard named "insurance_withdraw_guard" for order fund allocation.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "insurance_withdraw_guard_v1",
      "tags": ["insurance", "withdraw"],
      "replaceExistName": true
    },
    "description": "Allow insurance provider to withdraw funds after order is completed.",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_id"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "Complete",
        "name": "complete_node"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_equal",
        "nodes": [
          {
            "type": "query",
            "query": "progress.current",
            "object": {
              "identifier": 0,
              "convert_witness": 100
            },
            "parameters": []
          },
          {
            "type": "identifier",
            "identifier": 1
          }
        ]
      }
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

---

## Step 4: Create, Configure and Publish Machine

Create a Machine with workflow nodes and publish it in a single transaction. **IMPORTANT**: Machine nodes must be added during creation (in the same transaction) before publishing. Adding nodes after creation in separate transactions may not persist correctly.

**Prompt**: Create a Machine named "insurance_machine" with the claim processing workflow and publish it.

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "insurance_machine_v1",
      "permission": "insurance_permission_v1",
      "replaceExistName": true
    },
    "description": "Insurance claim processing workflow: Start -> Complete (with time-lock guard)",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "Start",
          "pairs": [
            {
              "prev_node": "",
              "threshold": 0,
              "forwards": [
                {
                  "name": "start_claim",
                  "permissionIndex": 1000,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "Complete",
          "pairs": [
            {
              "prev_node": "Start",
              "threshold": 1,
              "forwards": [
                {
                  "name": "complete_claim",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": {
                    "guard": "insurance_complete_guard_v1"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    "publish": true
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Workflow Nodes**:

| Node | Forward | Guard | Description |
|------|---------|-------|-------------|
| Start | start_claim -> Start | - | Enter the Start node from initial state |
| Complete | complete_claim -> Complete | insurance_complete_guard_v1 | Complete the claim after time-lock verification |

---

## Step 7: Create and Publish Service

Create the insurance service with machine, order_allocators, sales, and publish in a single transaction.

> **Important**: Service must include `order_allocators` when publishing. After publishing, `machine`, `order_allocators`, and `arbitrations` become immutable.

**Prompt**: Create and publish a Service named "insurance_service" with machine, order allocation, and insurance product.

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "insurance_service_v1",
      "type_parameter": "0x2::wow::WOW",
      "permission": "insurance_permission_v1",
      "replaceExistName": true
    },
    "description": "Outdoor accident insurance for Iceland travel. Provides coverage for ice scooting and other outdoor activities.",
    "machine": "insurance_machine_v1",
    "order_allocators": {
      "description": "Insurance order revenue allocation",
      "threshold": 0,
      "allocators": [
        {
          "guard": "insurance_withdraw_guard_v1",
          "sharing": [
            {
              "who": {"Signer": "signer"},
              "sharing": 10000,
              "mode": "Rate"
            }
          ]
        }
      ]
    },
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "Outdoor Accident Insurance",
          "price": 100000000,
          "stock": 1000,
          "suspension": false,
          "wip": "",
          "wip_hash": ""
        }
      ]
    },
    "publish": true
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

---

## Step 8: Unpause Service

Unpause the service to allow order creation.

**Prompt**: Unpause "insurance_service".

```json
{
  "operation_type": "service",
  "data": {
    "object": "insurance_service",
    "pause": false
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

---

## Step 9: Verify Service Configuration

Query the service to verify all configurations are correct.

**Prompt**: Query "insurance_service" to verify configuration.

```json
{
  "query_type": "onchain_objects",
  "objects": ["insurance_service"]
}
```

---

## Step 10: Test Order Creation and Progress

### 10.1 Create Insurance Order

Create an order on the insurance service using the `order_new` field of the `service` operation. In production, this would be done by the travel service provider as a supply chain sub-order.

**Prompt**: Create an order on "insurance_service" using account "insurance_provider".

```json
{
  "operation_type": "service",
  "data": {
    "object": "insurance_service",
    "order_new": {
      "buy": {
        "items": [
          {
            "name": "Outdoor Accident Insurance",
            "stock": 1,
            "wip_hash": ""
          }
        ],
        "total_pay": {
          "balance": 100000000
        }
      },
      "namedNewOrder": {
        "name": "test_insurance_order_v1",
        "replaceExistName": true
      }
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

### 10.2 Advance Progress: Initial -> Start

First, advance the progress from initial state to Start node.

**Prompt**: Advance progress to Start node.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "<insurance_progress_id>",
    "operate": {
      "operation": {
        "next_node_name": "Start",
        "forward": "start_claim"
      }
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

### 10.3 Advance Progress: Start -> Complete

Wait at least 1 second after entering Start node, then advance the progress to Complete with the Order ID as submission.

**Prompt**: Advance progress to Complete, submitting the Order ID. Wait 1 second before executing.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "<insurance_progress_id>",
    "operate": {
      "operation": {
        "next_node_name": "Complete",
        "forward": "complete_claim"
      }
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "insurance_complete_guard_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "insurance_complete_guard_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "<insurance_order_id>"
          }
        ]
      }
    ]
  }
}
```

> **Note**: Replace `<insurance_progress_id>` and `<insurance_order_id>` with actual values from step 10.1.

---

## Execution Checklist

- [ ] Create `insurance_provider` account
- [ ] Get test tokens for `insurance_provider`
- [ ] Step 1: Create `insurance_permission`
- [ ] Step 2: Create `insurance_complete_guard`
- [ ] Step 3: Create `insurance_withdraw_guard`
- [ ] Step 4: Create `insurance_machine` (without nodes)
- [ ] Step 5: Add nodes to Machine (Start, Complete)
- [ ] Step 6: Publish Machine
- [ ] Step 7: Create and publish `insurance_service` (with machine, order_allocators, sales)
- [ ] Step 8: Unpause Service
- [ ] Step 9: Verify Service configuration
- [ ] Step 10.1: Create test insurance order
- [ ] Step 10.2: Advance progress Initial -> Start
- [ ] Step 10.3: Wait 1s, then advance progress Start -> Complete
