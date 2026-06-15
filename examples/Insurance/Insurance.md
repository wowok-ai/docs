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
4. **Machine Creation Pattern**: Machine can be created with nodes and published in a single transaction (as shown in this example).

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

Create a Permission object to manage access control for the insurance service. The Permission must include all permission indexes that will be used in the Machine workflow.

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

> **Important**: The `index` array must include all permission indexes used in Machine forwards:
> - `1000`: for `start_claim` forward (Start node)
> - `1001`: for `complete_claim` forward (Complete node)
> - Additional indexes for future operations
>
> Without these permissions, advancing Progress will fail with `MoveAbort code: 7`.

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
    "description": "Time-lock guard for insurance claim completion. Requires current clock > progress.current_time + 10000ms (10 seconds for TESTING; in production set to reasonable duration like 8 hours). Progress is accessed via Order with convert_witness=TypeOrderProgress(100).",

    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "Order ID (submitted at runtime)"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": 10000
      }
    ],
    "root": {
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
              "query": 1272,
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
| 0 | **true** | Address | (submitted at runtime) | Order ID submitted at runtime, converted to Progress via convert_witness |
| 1 | false | U64 | 10000 | Time-lock duration in ms (10 seconds for testing) |

> **Important**: `10000` ms (10 seconds) is for testing only. In production, set to a reasonable duration (e.g., 8 hours = 28800000 ms).

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
      "type": "logic_equal",
      "nodes": [
        {
          "type": "query",
          "query": 1253,
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
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

---

## Step 4: Create, Configure and Publish Machine

Create a Machine with workflow nodes and publish it in a single transaction.

> **IMPORTANT**: 
> - Machine nodes are added during creation in the same transaction
> - Once published, Machine nodes become immutable and cannot be modified
> - If you need to change nodes after publishing, you must create a new Machine

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

## Step 5: Create and Publish Service

Create the insurance service with machine, order_allocators, sales, and publish in a single transaction.

> **Important**: 
> - Service must include `order_allocators` when publishing
> - After publishing, `machine`, `order_allocators`, and `arbitrations` become immutable
> - Ensure the Machine is properly configured before creating the Service

**Prompt**: Create and publish a Service named "insurance_service_v1" with machine, order allocation, and insurance product.

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

> **Important**: 
> - `mode: "Rate"` represents Rate allocation mode (valid values: `"Amount"`, `"Rate"`, `"Surplus"`)
> - `who: {"Signer": "signer"}` represents the transaction signer

---

## Step 6: Unpause Service

Unpause the service to allow order creation.

**Prompt**: Unpause "insurance_service_v1".

```json
{
  "operation_type": "service",
  "data": {
    "object": "insurance_service_v1",
    "pause": false
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

---

## Step 7: Verify Service Configuration

Query the service to verify all configurations are correct.

**Prompt**: Query "insurance_service_v1" to verify configuration.

```json
{
  "query_type": "onchain_objects",
  "objects": ["insurance_service_v1"],
  "network": "testnet"
}
```

---

## Step 8: Test Order Creation and Progress

### 8.1 Create Insurance Order

Create an order on the insurance service using the `order_new` field of the `service` operation. In production, this would be done by the travel service provider as a supply chain sub-order.

**Prompt**: Create an order on "insurance_service_v1" using account "insurance_provider_v1".

```json
{
  "operation_type": "service",
  "data": {
    "object": "insurance_service_v1",
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

### 8.2 Advance Progress: Initial -> Start

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

> **Note**: 
> - Both `next_node_name` and `forward` fields are required in the operation object
> - Use simple forward name (e.g., `"start_claim"`) without node prefix. The system automatically resolves the path from current node
> - The Progress object ID can be obtained by querying the Order object (it has a `progress` field)

### 8.3 Advance Progress: Start -> Complete

Wait at least 10 seconds after entering Start node, then advance the progress to Complete with the Order ID as submission.

> **Two-Phase Submission Loop**: When a forward has a Guard that requires user submission (`b_submission: true`), the MCP server uses a two-phase approach:
> 
> **Phase 1**: Call WITHOUT the `submission` field at root level. The server will return a `submission` prompt containing the Guard addresses and submission structure that needs to be filled.
> 
> **Phase 2**: Call WITH the `submission` field at root level, populated with the `value` fields from the Phase 1 prompt. The prompt shows which `identifier` expects a value of which `value_type`.

**Phase 1 Prompt**: Call progress operation WITHOUT `submission` field.

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
  }
}
```

The server will return a `submission` prompt like:

```json
{
  "type": "submission",
  "guard": [
    { "object": "0x1508ded8...", "impack": true }
  ],
  "submission": [
    {
      "guard": "0x1508ded8...",
      "submission": [
        {
          "identifier": 0,
          "b_submission": true,
          "value_type": "Address",
          "name": "Order ID (submitted at runtime)",
          "object_type": "Order"
        }
      ]
    }
  ]
}
```

**Phase 2**: Fill in the `value` field with the Order ID and resubmit. The `submission` field must be placed at the **root level** of the request (sibling to `operation_type`, `data`, and `env`).

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
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "0x1508ded8...",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "0x1508ded8...",
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
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

> **⚠️ Important**: 
> - The `submission` field must be at the **root level** of the request (sibling to `operation_type`, `data`, and `env`), NOT nested inside `data` or `operate.operation`.
> - The `guard` objects in the submission use on-chain addresses (not names), as returned by the Phase 1 prompt.
> - The `value` field must be populated with the actual Order ID. The `value_type` is `"Address"` (string), which is the readable form of the enum value `1`.
> - Replace `<insurance_progress_id>` and `<insurance_order_id>` with actual values from step 8.1.
> - Both `next_node_name` and `forward` fields are required in the operation object.
> - Use simple forward name `"complete_claim"` without node prefix.

---

## Troubleshooting

### Error: MoveAbort code: 7 (Guard Verification Failed)

**Symptom**: When advancing Progress, you get `MoveAbort in 4th command, abort code: 7 (Verify failed), in '0x2::passport::result_for_permission'`

**Cause**: The Guard's verification logic returned `false`. In the passport module, `result_for_permission()` calls `result()` which asserts `self.result == true`, aborting with `E_VERIFY_FAILED` (code 7). This means the Guard condition (e.g., time-lock: `clock > progress.current_time + lock_duration`) was not satisfied.

**Solution**: 
1. Wait longer than the time-lock duration before retrying
2. Verify the time-lock duration is correct (10000ms = 10 seconds)
3. Check that the submitted Order ID is correct and corresponds to the Progress being advanced

**Technical Detail**: The error path is:
```
result_for_permission() → assert!(result()) → E_VERIFY_FAILED
  ↓
result() → returns self.result (false)
  ↓
verify() → verify_guard() returned false → guard_info.impack=true → set self.result=false
```

### Error: Forward validation failed

**Symptom**: `Connection from current node "" to target node "Complete" does not exist`

**Cause**: Using incorrect forward path format.

**Solution**: Use simple forward names without node prefix:
- ✅ Correct: `"forward": "start_claim"`
- ❌ Incorrect: `"forward": "Start.start_claim"`
- ❌ Incorrect: `"forward": ".start_claim"`

### Error: Missing required field 'next_node_name'

**Symptom**: `Input validation error: Invalid arguments for tool onchain_operations: Required at path ["data","operate","operation","next_node_name"]`

**Cause**: The progress operation requires both `next_node_name` and `forward` fields.

**Solution**: Include both fields in the operation object:
```json
{
  "operation": {
    "next_node_name": "Start",
    "forward": "start_claim"
  }
}
```

### Error: Data not found / stale data

**Symptom**: Query returns old data after successful transactions.

**Cause**: MCP server caches query results; chain data needs time to reach consensus.

**Solution**: 
- Add 5-second delays between operations
- Use `no_cache: true` parameter for critical queries
- Wait for transaction confirmation before next operation

### Error: Machine modification failed

**Symptom**: `MoveAbort code: 3` when trying to modify Machine nodes.

**Cause**: Published Machine nodes are immutable.

**Solution**: Create a new Machine with the correct configuration if changes are needed.

---

## Execution Checklist

- [ ] Create `insurance_provider_v1` account
- [ ] Get test tokens for `insurance_provider_v1`
- [ ] Step 1: Create `insurance_permission_v1` with all required indexes
- [ ] Step 2: Create `insurance_complete_guard_v1`
- [ ] Step 3: Create `insurance_withdraw_guard_v1`
- [ ] Step 4: Create `insurance_machine_v1` with nodes and publish
- [ ] Step 5: Create and publish `insurance_service_v1` (with machine, order_allocators, sales)
- [ ] Step 6: Unpause Service
- [ ] Step 7: Verify Service configuration
- [ ] Step 8.1: Create test insurance order
- [ ] Step 8.2: Advance progress Initial -> Start (wait 5s after)
- [ ] Step 8.3: Advance progress Start -> Complete with submission
