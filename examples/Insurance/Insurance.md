# Insurance Service Example

A complete example demonstrating how to create an outdoor accident insurance service using WoWok protocol. This insurance service is designed to be purchased by travel service providers as part of a travel package (supply chain sub-order).

---

## ⚠️ Running Principle

> **Run the example in full every time (repeatable).** This example uses `replaceExistName: true` on all object creations — each run generates new objects with new addresses. If you skip build steps, operations may silently act on orphaned objects from previous runs, producing incorrect results. Old objects' configurations do not reflect the current document version.

- **Execution order**: Run all build/setup steps in sequence before testing any claim or order flow. Do not skip steps — each depends on objects created by prior steps.
- **Prerequisites**: `insurance_provider_v1` with sufficient WOW for gas. All on-chain operations require `env.confirmed: true`.

---

> **💡 Call Format**: All WoWok operations go through a single unified `wowok` tool. The AI calls `wowok({ tool: "<sub-tool>", data: {<params>} })`. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](../../docs/response-format.md) for details.

## Core Requirements & Features

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| **Insurance Claims** | Process insurance claims with time-lock verification | Machine with Start -> Complete workflow |
| **Time-Lock Guard** | Prevent premature claim completion | Guard using Order + convert_witness(TypeOrderProgress) to verify clock > progress.current_time + lock_duration |
| **Supply Chain Integration** | Support sub-order creation by travel service providers | Order can be created by authorized agents (travel_provider) |
| **Permission Control** | Role-based access for insurance operations | Permission object with custom indexes for claim processing |
| **Safe Fund Allocation** | Merchant revenue collection without theft risk | 2 alternative allocators with `sharing.who = {"Entity": ...}` (funds flow to fixed Treasury or personal address) |

### Key Design Decisions

1. **Time-Lock via Witness Conversion**: The Complete node Guard uses `convert_witness: "OrderProgress"` (TypeOrderProgress) to convert the submitted Order ID into its associated Progress object, then queries `progress.current_time` to verify the time-lock condition.
2. **Simple Two-Node Workflow**: Insurance claims follow a straightforward Start -> Complete path, keeping the workflow simple and predictable.
3. **Order ID as Submission**: The Order ID is submitted at runtime (`b_submission: true`) and used for witness conversion.
4. **Machine Creation Pattern**: Machine can be created with nodes and published in a single transaction (as shown in this example).
5. **Entity Sharing for Fund Safety**: Order allocators use `sharing.who = {"Entity": "address"}` instead of `{"Signer": "signer"}`. Funds always flow to a fixed address (Treasury or personal) regardless of who triggers the allocation — even if the Guard is somehow bypassed, an attacker cannot redirect funds to themselves. This eliminates the fatal fund-theft risk of Signer sharing.
6. **Project Binding as Defense-in-Depth**: Each withdraw Guard verifies `order.service == insurance_service_v1` (query 1563) to ensure the submitted Order belongs to this Service, preventing cross-service order theft.
7. **Permission Consistency**: The Treasury object uses the same Permission (`insurance_permission_v1`) as the Service, ensuring a single consistent permission organization governs all insurance operations.

---

## Overview

This example demonstrates:

- **Insurance Service Setup**: Permission, Treasury, Guard, Machine, and Service creation
- **Time-Lock Guard**: Using Order + convert_witness to access Progress data
- **Safe Fund Allocation**: Two alternative merchant collection approaches via Entity sharing
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
|  |    Treasury     |    |    Machine      |                     |
|  | (insurance_     |    | (insurance_     |                     |
|  |  treasury)      |    |  machine)       |                     |
|  +--------+--------+    +--------+--------+                     |
|           |                      |                              |
|           v                      v                              |
|  +-----------------+    +-----------------+                     |
|  | withdraw guards |    |    Service      |                     |
|  | (treasury +     |<---| (insurance_     |                     |
|  |  personal)      |    |  service)       |                     |
|  +-----------------+    +-----------------+                     |
|                                                                  |
|  Workflow: Start -> Complete (Time-Lock Guard)                  |
|  Allocators: 2 Entity-sharing approaches (first-match-wins)     |
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
(progress accessed via Order + convert_witness="OrderProgress")
```

### Fund Allocation Flow (2 Alternative Approaches)

```
Order reaches Complete
        |
        v
   Allocation triggered
        |
   +----+----+
   |         |
   v         v
Approach 1: Approach 2:
Treasury   Personal
guard      guard
   |         |
   v         v
Entity:    Entity:
insurance_ insurance_
treasury   provider
```

> **first-match-wins**: Allocators execute the FIRST Allocator whose Guard passes. Listing both approaches in one Service illustrates the 2 design options; in production you would typically pick ONE approach (delete the other allocator).

---

## Prerequisites

Before running this example, ensure you have:

1. An account named `insurance_provider_v1` with sufficient WOW tokens
2. Access to the WoWok MCP server

### Create Insurance Provider Account

**Prompt**: Create a new account named "insurance_provider_v1" for the insurance service provider.

```json
{
  "tool": "account_operation",
  "data": {
    "gen": {
      "name": "insurance_provider_v1",
      "replaceExistName": true
    }
  }
}
```

### Get Test Tokens

**Prompt**: Request testnet WOW tokens for account "insurance_provider_v1".

```json
{
  "tool": "account_operation",
  "data": {
    "faucet": {
      "network": "testnet",
      "name_or_address": "insurance_provider_v1"
    }
  }
}
```

> **Best Practice — `no_cache: true`**: When building multiple interdependent objects in one session, set `"no_cache": true` in the `env` object of every on-chain operation to ensure fresh chain state. The examples below omit it for brevity.

---

## Step 1: Create Permission Object

Create a Permission object to manage access control for the insurance service. The Permission must include all permission indexes that will be used in the Machine workflow.

**Prompt**: Create a Permission object named "insurance_permission" for the insurance service.

```json
{
  "tool": "onchain_operations",
  "data": {
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
}
```

> **Important**: The `index` array must include all permission indexes used in Machine forwards:
> - `1000`: for `start_claim` forward (Start node)
> - `1001`: for `complete_claim` forward (Complete node)
> - Additional indexes for future operations
>
> Without these permissions, advancing Progress will fail with `MoveAbort code: 7`.

---

## Step 2: Create Treasury Object

Create a Treasury object to aggregate insurance service revenue (public funds for operations and distribution). The Treasury uses the same Permission as the Service (`insurance_permission_v1`) — this ensures a single consistent permission organization governs both fund collection and service operations.

**Prompt**: Create a Treasury object named "insurance_treasury" for aggregating insurance revenue.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "treasury",
    "data": {
      "object": {
        "name": "insurance_treasury_v1",
        "type_parameter": "0x2::wow::WOW",
        "permission": "insurance_permission_v1",
        "replaceExistName": true
      },
      "description": "Treasury for aggregating insurance service revenue (public funds for operations and distribution). Uses the same Permission as the Service for consistency."
    },
    "env": {
      "account": "insurance_provider_v1",
      "network": "testnet"
    }
  }
}
```

> **Important — Permission Consistency**: The Treasury's Permission should match the Service's Permission (`insurance_permission_v1`). Using different Permissions for Treasury and Service means different permission organizations govern fund collection vs service operations — this is a minor design risk. Keep them consistent unless you have a specific reason to separate them.

---

## Step 3: Create Time-Lock Complete Guard

Create a Guard that verifies the time-lock condition for claim completion. The Guard uses the submitted Order ID with `convert_witness: "OrderProgress"` (TypeOrderProgress) to access the associated Progress object and query `progress.current_time`.

**Guard Logic**:
```
clock > progress.current_time + 1000
```

**Prompt**: Create a Guard named "insurance_complete_guard" for time-lock verification on claim completion.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "guard",
    "data": {
      "namedNew": {
        "name": "insurance_complete_guard_v1",
        "tags": ["insurance", "time-lock", "complete"],
        "replaceExistName": true
      },
      "description": "Time-lock guard for insurance claim completion. Requires current clock > progress.current_time + 10000ms (10 seconds for TESTING; in production set to reasonable duration like 8 hours). Progress is accessed via Order with convert_witness=\"OrderProgress\"(100).",

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
                "query": "progress.current_time",
                "object": {
                  "identifier": 0,
                  "convert_witness": "OrderProgress"
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
}
```

**Guard Table**:

| identifier | b_submission | value_type | value | Purpose |
|------------|-------------|-----------|-------|---------|
| 0 | **true** | Address | (submitted at runtime) | Order ID submitted at runtime, converted to Progress via convert_witness |
| 1 | false | U64 | 10000 | Time-lock duration in ms (10 seconds for testing) |

> **Important**: `10000` ms (10 seconds) is for testing only. In production, set to a reasonable duration (e.g., 8 hours = 28800000 ms).

---

## Step 4: Create Withdraw Guards for Order Allocators

Create **two** withdraw Guards — one for each merchant collection approach. Both Guards share identical root/table logic (order at Complete node + project binding) but differ in `description` to indicate their distinct purposes. Allocators require unique Guard addresses, so two Guard objects are needed.

**Guard Logic** (identical for both):
```
logic_and[
  query("progress.current") == "Complete",   // order is at Complete node
  query("order.service") == insurance_service_v1        // order belongs to THIS service
]
```

**Risk Elimination**:
- **Project binding** (query 1563): prevents cross-service order theft — an attacker cannot submit another Service's completed Order to trigger allocation.
- **Entity sharing** (configured in Step 6): funds flow to a fixed address regardless of caller — no Signer binding needed in the Guard.

### 4.1 Treasury Collection Guard

**Prompt**: Create a Guard named "insurance_withdraw_guard_treasury" for Treasury fund collection.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "guard",
    "data": {
      "namedNew": {
        "name": "insurance_withdraw_guard_treasury_v1",
        "tags": ["insurance", "withdraw", "treasury"],
        "replaceExistName": true
      },
      "description": "Allow fund allocation to Treasury after order is completed. RISK ELIMINATION: order must be at Complete node AND belong to insurance_service_v1 (prevents cross-service theft). Funds flow to fixed Treasury Entity (safe — no Signer binding needed).",
      "table": [
        {
          "identifier": 0,
          "b_submission": true,
          "value_type": "Address",
          "object_type": "Order",
          "name": "order_id (Order object submitted at runtime)"
        },
        {
          "identifier": 1,
          "b_submission": false,
          "value_type": "String",
          "value": "Complete",
          "name": "Expected Complete node name (case-sensitive)"
        },
        {
          "identifier": 2,
          "b_submission": false,
          "value_type": "Address",
          "value": "insurance_service_v1",
          "name": "Expected service address (prevents cross-service fund theft)"
        }
      ],
      "root": {
        "type": "logic_and",
        "nodes": [
          {
            "type": "logic_equal",
            "nodes": [
              {
                "type": "query",
                "query": "progress.current",
                "object": {
                  "identifier": 0,
                  "convert_witness": "OrderProgress"
                },
                "parameters": []
              },
              {
                "type": "identifier",
                "identifier": 1
              }
            ]
          },
          {
            "type": "logic_equal",
            "nodes": [
              {
                "type": "query",
                "query": "order.service",
                "object": {
                  "identifier": 0
                },
                "parameters": []
              },
              {
                "type": "identifier",
                "identifier": 2
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
}
```

### 4.2 Personal Collection Guard

**Prompt**: Create a Guard named "insurance_withdraw_guard_personal" for personal fund collection.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "guard",
    "data": {
      "namedNew": {
        "name": "insurance_withdraw_guard_personal_v1",
        "tags": ["insurance", "withdraw", "personal"],
        "replaceExistName": true
      },
      "description": "Allow fund allocation to personal collection address after order is completed. RISK ELIMINATION: order must be at Complete node AND belong to insurance_service_v1. Funds flow to fixed personal Entity (safe — no Signer binding needed).",
      "table": [
        {
          "identifier": 0,
          "b_submission": true,
          "value_type": "Address",
          "object_type": "Order",
          "name": "order_id (Order object submitted at runtime)"
        },
        {
          "identifier": 1,
          "b_submission": false,
          "value_type": "String",
          "value": "Complete",
          "name": "Expected Complete node name (case-sensitive)"
        },
        {
          "identifier": 2,
          "b_submission": false,
          "value_type": "Address",
          "value": "insurance_service_v1",
          "name": "Expected service address (prevents cross-service fund theft)"
        }
      ],
      "root": {
        "type": "logic_and",
        "nodes": [
          {
            "type": "logic_equal",
            "nodes": [
              {
                "type": "query",
                "query": "progress.current",
                "object": {
                  "identifier": 0,
                  "convert_witness": "OrderProgress"
                },
                "parameters": []
              },
              {
                "type": "identifier",
                "identifier": 1
              }
            ]
          },
          {
            "type": "logic_equal",
            "nodes": [
              {
                "type": "query",
                "query": "order.service",
                "object": {
                  "identifier": 0
                },
                "parameters": []
              },
              {
                "type": "identifier",
                "identifier": 2
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
}
```

**Guard Table** (identical for both guards):

| identifier | b_submission | value_type | value | Purpose |
|------------|-------------|-----------|-------|---------|
| 0 | **true** | Address | (submitted at runtime) | Order ID submitted at runtime, converted to Progress via convert_witness="OrderProgress" |
| 1 | false | String | "Complete" | Expected node name (case-sensitive) |
| 2 | false | Address | insurance_service_v1 | Expected Service address (project binding — prevents cross-service fund theft) |

> **Why 2 Guards?** Allocators require unique Guard addresses. The 2 Guards have identical root/table logic but different `description` and `tags` to indicate their distinct purposes (Treasury collection vs personal collection). In production you would typically pick ONE approach and delete the other Guard + Allocator.

---

## Step 5: Create, Configure and Publish Machine

Create a Machine with workflow nodes and publish it in a single transaction.

> **IMPORTANT**: 
> - Machine nodes are added during creation in the same transaction
> - Once published, Machine nodes become immutable and cannot be modified
> - If you need to change nodes after publishing, you must create a new Machine

**Prompt**: Create a Machine named "insurance_machine" with the claim processing workflow and publish it.

```json
{
  "tool": "onchain_operations",
  "data": {
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
}
```

**Workflow Nodes**:

| Node | Forward | Guard | Description |
|------|---------|-------|-------------|
| Start | start_claim -> Start | - | Enter the Start node from initial state |
| Complete | complete_claim -> Complete | insurance_complete_guard_v1 | Complete the claim after time-lock verification |

---

## Step 6: Create and Publish Service

Create the insurance service with machine, order_allocators (2 alternative approaches), sales, and publish in a single transaction.

> **Important**: 
> - Service must include `order_allocators` when publishing
> - After publishing, `machine`, `order_allocators`, and `arbitrations` become immutable
> - Ensure the Machine is properly configured before creating the Service

**Prompt**: Create and publish a Service named "insurance_service_v1" with machine, order allocation, and insurance product.

```json
{
  "tool": "onchain_operations",
  "data": {
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
        "description": "Insurance order revenue allocation — 2 alternative merchant collection approaches (first-match-wins means only the first passing allocator executes)",
        "threshold": 0,
        "allocators": [
          {
            "guard": "insurance_withdraw_guard_treasury_v1",
            "sharing": [
              {
                "who": {"Entity": "insurance_treasury_v1"},
                "sharing": 10000,
                "mode": "Rate"
              }
            ]
          },
          {
            "guard": "insurance_withdraw_guard_personal_v1",
            "sharing": [
              {
                "who": {"Entity": "insurance_provider_v1"},
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
            "wip": "https://cdn.jsdelivr.net/gh/wowok-ai/docs@main/wip-examples/three_body.wip",
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
}
```

> **Important — Fund Allocation Safety**: 
> - `mode: "Rate"` represents Rate allocation mode (valid values: `"Amount"`, `"Rate"`, `"Surplus"`)
> - `who: {"Entity": "name_or_address"}` — funds flow to a FIXED address (Treasury or personal). This is the SAFE pattern: even if the Guard is somehow bypassed or an attacker submits a forged Order, funds still go to the fixed Entity — the attacker cannot redirect funds to themselves.
> - **NEVER use `who: {"Signer": "signer"}` for merchant collection** — this means funds flow to whoever calls the allocation. Combined with a Guard that only checks order status (no Signer binding), anyone can submit any completed Order and steal 100% of funds.
> - **2 allocators = 2 alternative approaches**: first-match-wins means only the FIRST allocator whose Guard passes will execute. In production, pick ONE approach (Treasury OR personal) and delete the other. Listing both here illustrates the 2 design options.
> - **Permission consistency**: the Treasury uses `insurance_permission_v1` (same as Service) — keep Permissions consistent unless you have a specific reason to separate them.
> - `wip_hash: ""` (empty string) means the system will automatically extract and use the hash from within the WIP file (`meta.hash` field). The WIP file at the `wip` URL must be a valid JSON file in WIP format. Do NOT use the SHA-256 of the file bytes as `wip_hash` — it must be the `meta.hash` value inside the WIP JSON, or empty string for auto-extraction.

---

## Step 7: Unpause Service (Optional)

> **Note**: A newly created Service is **not paused by default**. This step is only needed if you explicitly paused the service earlier. You can safely skip this step and proceed to Step 8.

Unpause the service to allow order creation.

**Prompt**: Unpause "insurance_service_v1".

```json
{
  "tool": "onchain_operations",
  "data": {
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
}
```

---

## Step 8: Verify Service Configuration

Query the service to verify all configurations are correct.

**Prompt**: Query "insurance_service_v1" to verify configuration.

```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "onchain_objects",
    "objects": ["insurance_service_v1"],
    "network": "testnet"
  }
}
```

---

## Step 9: Test Order Creation and Progress

### 9.1 Create Insurance Order

Create an order on the insurance service using the `order_new` field of the `service` operation. In production, this would be done by the travel service provider as a supply chain sub-order.

**Prompt**: Create an order on "insurance_service_v1" using account "insurance_provider_v1".

```json
{
  "tool": "onchain_operations",
  "data": {
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
        },
        "namedNewAllocation": {
          "name": "insurance_test_alloc_v1",
          "replaceExistName": true
        },
        "namedNewProgress": {
          "name": "insurance_test_progress_v1",
          "replaceExistName": true
        }
      }
    },
    "env": {
      "account": "insurance_provider_v1",
      "network": "testnet"
    }
  }
}
```

> **Named Objects**: The `namedNewOrder`, `namedNewAllocation`, and `namedNewProgress` fields assign local names to the created objects. You can reference them by name (e.g., `"test_insurance_order_v1"`, `"insurance_test_alloc_v1"`, `"insurance_test_progress_v1"`) in subsequent operations instead of using raw on-chain IDs.
>
> **Optional — Query the Order**: To verify the order or obtain on-chain object IDs:
> ```json
> {
>   "tool": "query_toolkit",
>   "data": {
>     "query_type": "onchain_objects",
>     "objects": ["test_insurance_order_v1"],
>     "network": "testnet",
>     "no_cache": true
>   }
> }
> ```
> The response includes `progress` and `allocation` fields with the on-chain object IDs.

### 9.2 Advance Progress: Initial -> Start

First, advance the progress from initial state to Start node.

**Prompt**: Advance progress to Start node.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "order",
    "data": {
      "object": "test_insurance_order_v1",
      "progress": {
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
}
```

> **Note**: 
> - Both `next_node_name` and `forward` fields are required in the operation object
> - Use simple forward name (e.g., `"start_claim"`) without node prefix. The system automatically resolves the path from current node
> - The Progress is advanced via the Order object's `progress` field, using the Order name as reference

### 9.3 Advance Progress: Start -> Complete

Wait at least 10 seconds after entering Start node, then advance the progress to Complete with the Order ID as submission.

> **Two-Phase Submission Loop**: When a forward has a Guard that requires user submission (`b_submission: true`), the MCP server uses a two-phase approach:
> 
> **Phase 1**: Call WITHOUT the `submission` field at root level. The server will return a `submission` prompt containing the Guard addresses and submission structure that needs to be filled.
> 
> **Phase 2**: Call WITH the `submission` field at root level, populated with the `value` fields from the Phase 1 prompt. The prompt shows which `identifier` expects a value of which `value_type`.

**Phase 1 Prompt**: Call progress operation WITHOUT `submission` field.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "order",
    "data": {
      "object": "test_insurance_order_v1",
      "progress": {
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
}
```

The server will return a `submission` prompt like:

```json
{
  "result": {
    "status": "success",
    "data": {
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
  },
  "schema": null
}
```

> **Note**: The Phase 1 response returns `value_type` as a numeric enum ID (e.g., `1` = Address). When filling in Phase 2, you can use either the numeric form (`1`) or the string name (`"Address"`) — both are accepted.

**Phase 2**: Fill in the `value` field with the Order ID and resubmit. The `submission` field must be placed at the **root level** of the request (sibling to `operation_type`, `data`, and `env`).

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "order",
    "data": {
      "object": "test_insurance_order_v1",
      "progress": {
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
              "name": "Order ID (submitted at runtime)",
              "object_type": "Order",
              "value": "test_insurance_order_v1"
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
}
```

> **⚠️ Important**: 
> - The `submission` field must be at the **root level** of the request (sibling to `operation_type`, `data`, and `env`), NOT nested inside `data` or `progress.operation`.
> - The `guard` objects in the submission use on-chain addresses (not names), as returned by the Phase 1 response. Replace `0x1508ded8...` with the actual guard address from your Phase 1 response.
> - The `value` field accepts either an on-chain object ID or a named object reference (e.g., `"test_insurance_order_v1"`). Keep the other fields (`identifier`, `value_type`, `name`, `object_type`) as returned by Phase 1.
> - The Order is referenced by its name (`"test_insurance_order_v1"`) in the `data.object` field.
> - Both `next_node_name` and `forward` fields are required in the operation object.
> - Use simple forward name `"complete_claim"` without node prefix.

---

## Step 10: Withdraw Funds via Allocation

After the Progress reaches the Complete node, funds can be withdrawn using one of the withdraw Guards. This example uses the Treasury collection Guard (`insurance_withdraw_guard_treasury_v1`). To use the personal collection approach instead, substitute `insurance_withdraw_guard_personal_v1`.

The Guard verifies:
1. `progress.current == "Complete"` (query 1253) via the submitted Order ID with `convert_witness: "OrderProgress"` (TypeOrderProgress)
2. `order.service == insurance_service_v1` (query 1563) — project binding prevents cross-service order theft

The Allocation object was created automatically when the Order was placed (Step 9.1). Query the Order to obtain the Allocation object ID — it is in the `allocation` field of the Order object.

> **Fund Flow**: With `sharing.who = {"Entity": "insurance_treasury_v1"}`, 100% of the order amount flows to the Treasury object regardless of who triggers the allocation. The caller cannot redirect funds — this is the safe Entity-sharing pattern.

> **Two-Phase Submission**: The `alloc_by_guard` operation also uses two-phase submission when the Guard has `b_submission: true` fields, just like the Progress operation in Step 9.3.

### 10.1 Phase 1: Request Submission Prompt

Call the allocation operation WITHOUT the `submission` field to obtain the Guard submission structure.

**Prompt**: Withdraw funds from allocation "insurance_test_alloc_v1" using Treasury withdraw guard.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "allocation",
    "data": {
      "object": "insurance_test_alloc_v1",
      "alloc_by_guard": "insurance_withdraw_guard_treasury_v1"
    },
    "env": {
      "account": "insurance_provider_v1",
      "network": "testnet"
    }
  }
}
```

The server will return a `submission` prompt like:

```json
{
  "result": {
    "status": "success",
    "data": {
      "type": "submission",
      "guard": [
        { "object": "0xfb8bed2f...", "impack": true }
      ],
      "submission": [
        {
          "guard": "0xfb8bed2f...",
          "submission": [
            {
              "identifier": 0,
              "b_submission": true,
              "value_type": "Address",
              "name": "order_id (Order object submitted at runtime)",
              "object_type": "Order"
            }
          ]
        }
      ]
    }
  },
  "schema": null
}
```

### 10.2 Phase 2: Submit with Order ID

Fill in the `value` field with the Order ID (or Order name) and resubmit. The `submission` field must be placed at the **root level** of the request.

**Prompt**: Withdraw funds from allocation with Order ID submission.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "allocation",
    "data": {
      "object": "insurance_test_alloc_v1",
      "alloc_by_guard": "insurance_withdraw_guard_treasury_v1"
    },
    "submission": {
      "type": "submission",
      "guard": [
        {
          "object": "0xfb8bed2f...",
          "impack": true
        }
      ],
      "submission": [
        {
          "guard": "0xfb8bed2f...",
          "submission": [
            {
              "identifier": 0,
              "b_submission": true,
              "value_type": "Address",
              "name": "order_id (Order object submitted at runtime)",
              "object_type": "Order",
              "value": "test_insurance_order_v1"
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
}
```

> **⚠️ Important**: 
> - Replace `0xfb8bed2f...` with the actual `insurance_withdraw_guard_treasury_v1` address from your Phase 1 response.
> - The `value` field accepts either an on-chain object ID or a named object reference (e.g., `"test_insurance_order_v1"`).
> - The `sharing` configuration (`{"Entity": "insurance_treasury_v1"}` at 100% Rate) determines where funds flow. Funds go to the fixed Treasury address regardless of who calls the allocation — this is the safe Entity-sharing pattern that prevents fund theft.
> - After a successful withdrawal, the Allocation `balance` becomes `0` and a Payment object is created as an immutable record.

---

## Troubleshooting

### MoveAbort code: 7 (Guard Verification Failed)

When advancing Progress, if you get `abort code: 7 (Verify failed)`, the Guard condition was not satisfied. For the time-lock Guard:
- Wait longer than the time-lock duration (10000ms = 10 seconds) before advancing to Complete
- Verify the submitted Order ID is correct and corresponds to the Progress being advanced

For the withdraw Guard:
- Verify the Order's Progress is at the "Complete" node (case-sensitive — "Complete" ≠ "complete")
- Verify the Order belongs to `insurance_service_v1` (project binding check via query 1563)

### Forward validation failed

If you see `Connection from current node "" to target node "Complete" does not exist`, use simple forward names without node prefix:
- ✅ Correct: `"forward": "start_claim"`
- ❌ Incorrect: `"forward": "Start.start_claim"`

### Missing required field 'next_node_name'

The progress operation requires both `next_node_name` and `forward` fields in the operation object:
```json
{
  "operation": {
    "next_node_name": "Start",
    "forward": "start_claim"
  }
}
```

### Data not found / stale data

If queries return old data after successful transactions:
- Use `no_cache: true` parameter for critical queries
- Wait for transaction confirmation before the next operation

### Machine modification failed

Published Machine nodes are immutable (`MoveAbort code: 3`). Create a new Machine with the correct configuration if changes are needed.

---

## Execution Checklist

- [ ] Create `insurance_provider_v1` account
- [ ] Get test tokens for `insurance_provider_v1`
- [ ] Step 1: Create `insurance_permission_v1` with all required indexes
- [ ] Step 2: Create `insurance_treasury_v1` (same Permission as Service)
- [ ] Step 3: Create `insurance_complete_guard_v1` (time-lock)
- [ ] Step 4: Create `insurance_withdraw_guard_treasury_v1` + `insurance_withdraw_guard_personal_v1` (project binding)
- [ ] Step 5: Create `insurance_machine_v1` with nodes and publish
- [ ] Step 6: Create and publish `insurance_service_v1` (with machine, 2 Entity-sharing allocators, sales)
- [ ] Step 7: Unpause Service (Optional — skip if service was never paused)
- [ ] Step 8: Verify Service configuration
- [ ] Step 9.1: Create test insurance order
- [ ] Step 9.2: Advance progress Initial -> Start
- [ ] Step 9.3: Advance progress Start -> Complete with submission (wait 10s after Step 9.2)
- [ ] Step 10: Withdraw funds via Allocation (alloc_by_guard with Treasury or personal withdraw guard)
