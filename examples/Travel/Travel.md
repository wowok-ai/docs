# Iceland Travel Service Example

A complete example demonstrating how to create an Iceland travel service using WoWok protocol. This service integrates weather-dependent activities, insurance sub-orders, and multi-node workflow management.

---

## ⚠️ Running Principle

> **Run the example in full every time (repeatable).** This example uses `replaceExistName: true` on all object creations — each run generates new objects with new addresses. If you skip build steps, operations may silently act on orphaned objects from previous runs, producing incorrect results. Old objects' configurations do not reflect the current document version.

- **Execution order**: Run all build/setup steps in sequence before testing any customer or order flow. Do not skip steps — each depends on objects created by prior steps.
- **Prerequisites**: `travel_provider`, `weather_provider`, and `alice` (test customer) with sufficient WOW for gas. All on-chain operations require `env.confirmed: true`.

### 🔐 Two-Step Confirmation Flow (Production Safety)

This example sets `env.confirmed: true` on irreversible operations (e.g., `publish: true` on Machine) for brevity. In real deployments, follow the two-step flow enforced by the ConfirmGate safety layer:

1. **Phase 1 — Preview**: Call the tool **without** `env.confirmed`. The server returns `{ status: "pending_confirmation", confirmation_text: "..." }` containing the full operation summary, risk assessment, and irreversible-action warnings.
2. **Phase 2 — Confirm**: Review `confirmation_text` with the user. Only after explicit user approval, call the tool again **with** `env.confirmed: true` to actually execute the on-chain transaction.

> Skipping Phase 1 means the user never sees the risk summary before gas is spent. Always preview first, then confirm.

---

> **💡 Call Format**: All WoWok operations go through a single unified `wowok` tool. The AI calls `wowok({ tool: "<sub-tool>", data: {<params>} })`. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](../../docs/response-format.md) for details.

## Core Requirements & Features

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| **Weather Data Query** | Demonstrate querying weather Repository | Guard checks if weather data exists for a given date |
| **Multi-Node Workflow** | Start -> Buy Insurance -> SPA -> Ice Scooting -> Complete | Machine with 5 nodes and conditional paths |
| **Time-Lock Completion** | Prevent premature order completion | Guard using Order + convert_witness(TypeOrderProgress) |
| **Cancellation Support** | Allow order cancellation from Ice Scooting node | Cancel forward with permission-based access |
| **Arbitration** | Dispute resolution for order conflicts | Arbitration object bound to Service |
| **Revenue Allocation** | Distribute funds based on progress state | Three allocation Guards for different refund scenarios |

---

## Prerequisites

Before running this example, ensure you have:

1. An account named `travel_provider` with sufficient WOW tokens
2. An account named `weather_provider` with sufficient WOW tokens
3. An account named `alice` (test customer) with sufficient WOW tokens
4. Access to the WoWok MCP server

### Create Accounts

**Prompt**: Create accounts for travel provider, weather provider, and test customer.

```json
{
  "tool": "account_operation",
  "data": {
    "gen": {
      "name": "travel_provider",
      "replaceExistName": true
    }
  }
}
```

```json
{
  "tool": "account_operation",
  "data": {
    "gen": {
      "name": "weather_provider",
      "replaceExistName": true
    }
  }
}
```

```json
{
  "tool": "account_operation",
  "data": {
    "gen": {
      "name": "alice",
      "replaceExistName": true
    }
  }
}
```

### Get Test Tokens

**Prompt**: Request testnet WOW tokens for all accounts.

```json
{
  "tool": "account_operation",
  "data": {
    "faucet": {
      "network": "testnet",
      "name_or_address": "travel_provider"
    }
  }
}
```

```json
{
  "tool": "account_operation",
  "data": {
    "faucet": {
      "network": "testnet",
      "name_or_address": "weather_provider"
    }
  }
}
```

```json
{
  "tool": "account_operation",
  "data": {
    "faucet": {
      "network": "testnet",
      "name_or_address": "alice"
    }
  }
}
```

---

## Environment Parameters

All on-chain operations in this example use the following `env` fields:

| Field | Value | Purpose |
|-------|-------|---------|
| `network` | `"testnet"` | Target network |
| `account` | Account name | Signer account for the transaction |
| `no_cache` | `true` | Bypass local cache to avoid stale reads during sequential object creation. Without this, operations that depend on recently created objects may fail with "object not found". |
| `confirmed` | `true` | Explicitly confirm the on-chain transaction (MCP ConfirmGate). Required for all write operations. |

Additionally, `onChain: true` is required when an object's name needs to be resolved across different accounts (see Step 0.3).

---

## Step 0: Setup Weather Data

Before creating the travel service, set up the weather Repository with the next 5 days of weather data. The weather data is keyed by timestamp, and the `weather_check_guard` (Step 3.1) will query this repository at runtime when the customer enters the "Ice Scooting" node (Step 7.3). You must use timestamps that are valid at the time you run this example.

### 0.1 Calculate Weather Timestamps

The weather record `id` is a UTC timestamp (in milliseconds). It must be **aligned to UTC 00:00:00** so that the same timestamp can be reproduced and submitted later in Step 7.3. Run the following JavaScript (also available as `calc-weather-timestamps.js` in this example folder):

```js
const DAY_MS = 86400000; // 24 * 60 * 60 * 1000
const now = Date.now();
// Align to UTC 00:00:00 of today, then compute the next 5 days.
// Repository data is keyed by timestamp, so the submitted activity date
// must match exactly the id used when adding weather data.
const todayStart = Math.floor(now / DAY_MS) * DAY_MS;
for (let i = 1; i <= 5; i++) {
  const ts = todayStart + i * DAY_MS;
  console.log(`Day ${i}: ${ts} (${new Date(ts).toISOString()})`);
}
```

**Sample output** (run on 2026-07-08 — re-run the script to get current values for your test time):

```
Day 1: 1783555200000 (2026-07-09T00:00:00.000Z)
Day 2: 1783641600000 (2026-07-10T00:00:00.000Z)
Day 3: 1783728000000 (2026-07-11T00:00:00.000Z)
Day 4: 1783814400000 (2026-07-12T00:00:00.000Z)
Day 5: 1783900800000 (2026-07-13T00:00:00.000Z)
```

> **Important**: Always re-run the script at test time — the timestamps depend on the current date. Copy the 5 printed values; they will be used in Step 0.4 (as repository data `id`) and Step 7.3 (as the submitted `activity_date`). The two must match exactly, otherwise the Guard query `repository.data has("Condition", convert_number_address(activity_date))` will return false.

### 0.2 Create Weather Permission

**Prompt**: Create a Permission object named "weather_permission".

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "permission",
    "data": {
      "object": {
        "name": "weather_permission",
        "replaceExistName": true
      },
      "description": "Weather repository permission"
    },
    "env": {
      "account": "weather_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

### 0.3 Create Weather Repository with Policies

**Prompt**: Create a Repository named "weather_repo" with "Condition" policy.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "repository",
    "data": {
      "object": {
        "name": "weather_repo",
        "permission": "weather_permission",
        "replaceExistName": true,
        "onChain": true
      },
      "description": "Weather data repository for Iceland travel activities",
      "policies": {
        "op": "add",
        "policy": [
          {
            "name": "Condition",
            "description": "Weather condition policy for activity dates",
            "write_guard": [],
            "id_from": "None",
            "value_type": "String"
          }
        ]
      }
    },
    "env": {
      "account": "weather_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

> **Note**: `onChain: true` is required here because `weather_repo` is created by the `weather_provider` account, but its name will be referenced in the Guard table (Step 3.1) by the `travel_provider` account. Without `onChain: true`, the name is stored locally only on `weather_provider`'s device and cannot be resolved by `travel_provider`. When `onChain: true` is set, the name is published on-chain and becomes publicly visible, allowing cross-account name resolution.

### 0.4 Add Weather Data

Add 5 days of weather data. The `weather_check_guard` (Step 3.1) only verifies that a record **exists** for the activity date (via `repository.data has`), so all 5 days will pass the Guard regardless of the condition value. The "rainy" value on Day 5 is informational only — to actually reject based on weather condition, you would need a Guard that queries `repository.data` and compares the value, which is more complex and not used in this example.

**Prompt**: Add weather data to "weather_repo" with policy "Condition".

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "repository",
    "data": {
      "object": "weather_repo",
      "data_add": {
        "name": "Condition",
        "items": [
          {
            "data": [
              {"id": <DAY1_TIMESTAMP>, "data": "sunny"},
              {"id": <DAY2_TIMESTAMP>, "data": "sunny"},
              {"id": <DAY3_TIMESTAMP>, "data": "sunny"},
              {"id": <DAY4_TIMESTAMP>, "data": "sunny"},
              {"id": <DAY5_TIMESTAMP>, "data": "rainy"}
            ]
          }
        ]
      }
    },
    "env": {
      "account": "weather_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

> **Note**: Replace `<DAY1_TIMESTAMP>` through `<DAY5_TIMESTAMP>` with the actual values from Step 0.1. The `id` field is the timestamp (as a number) that keys the weather record — it must **exactly match** the timestamp you submit later in Step 7.3.

---

## Step 1: Create Permission Object

Create a Permission object to manage access control for the travel service. Add permission indices for the travel_provider account.

**Prompt**: Create a Permission object named "travel_permission" for the travel service.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "permission",
    "data": {
      "object": {
        "name": "travel_permission",
        "tags": ["travel", "iceland", "tourism"],
        "replaceExistName": true
      },
      "description": "Permission for Iceland travel service",
      "table": {
        "op": "add perm by entity",
        "entity": {"name_or_address": "travel_provider"},
        "index": [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 306]
      }
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

> **Note**: Permission indices 1000-1009 are used for different workflow forwards. Index 306 is a reserved administrative permission. The travel_provider account is granted all these permissions.

---

## Step 2: Create Arbitration Object

Create an Arbitration object for dispute resolution.

**Prompt**: Create an Arbitration named "travel_arbitration".

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "arbitration",
    "data": {
      "object": {
        "name": "travel_arbitration",
        "permission": "travel_permission",
        "replaceExistName": true
      },
      "description": "Arbitration for Iceland travel service disputes"
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

---

## Step 2.5: Create Service (Unpublished)

Create the Service without publishing to obtain its address for Guard creation. The Service address is required by the allocator Guards (Step 3.4–3.6) to verify `order.service == travel_service` (R-C3-05 cross-service theft protection).

**Prompt**: Create Service "travel_service" with permission "travel_permission", do not publish.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "service",
    "data": {
      "object": {
        "name": "travel_service",
        "permission": "travel_permission",
        "replaceExistName": true
      },
      "description": "Iceland travel service: Blue Lagoon SPA + Glacier Ice Scooting.",
      "pause": false
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

**Record the Service address** - it will be needed for allocator Guard creation (Step 3.4–3.6) to bind `order.service` verification.

---

### Step 2.6: Create Treasury (Merchant Revenue Aggregation)

Create a Treasury object to aggregate merchant revenue. The Treasury uses the **same Permission** as the Service (`travel_permission`) for consistency — a single permission organization governs both fund collection and service operations.

**Prompt**: Create Treasury "travel_treasury" with permission "travel_permission", type parameter "0x2::wow::WOW".

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "treasury",
    "data": {
      "object": {
        "name": "travel_treasury",
        "type_parameter": "0x2::wow::WOW",
        "permission": "travel_permission",
        "replaceExistName": true
      },
      "description": "Treasury for aggregating travel service merchant revenue. Uses the same Permission as the Service (travel_permission) for consistency — a single permission organization governs both fund collection and service operations."
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

> **Treasury-First Rule**: Following the fund-flow design pattern established in the Insurance and MyShop_Advanced examples, merchant revenue flows to `travel_treasury` (not directly to the Service address). This:
> 1. **Aggregates public funds** for operational distribution and accounting
> 2. **Makes allocators inherently safe** (R-C3-06) — funds always flow to the fixed Treasury regardless of caller, so no Signer binding is needed in the Guard
> 3. **Uses permission consistency** — Treasury and Service share `travel_permission`, ensuring unified governance

---

## Step 3: Create Guards

Create all Guards needed for the workflow and fund allocation. Guards are immutable once created, so create them before the Machine and Service.

> **Prerequisite**: The Service must be created (unpublished) in Step 2.5 first, because the allocator Guards (3.4–3.6) reference the Service address to verify `order.service == travel_service` (R-C3-05 cross-service theft protection).

### 3.1 Weather Check Guard

Creates a Guard that verifies weather data exists for a given date. This Guard is bound to the "go_ice_scooting" forward (entering the weather-dependent Ice Scooting activity) to ensure the activity date has a weather record in the repository.

**Guard Logic**:
```
repository.data has("Condition", convert_number_address(activity_date))
```

**Prompt**: Create a Guard named "weather_check_guard" for weather condition verification.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "guard",
    "data": {
      "namedNew": {
        "name": "weather_check_guard",
        "tags": ["weather", "check", "travel"],
        "replaceExistName": true
      },
      "description": "Weather check guard for ice scooting activity. Checks if weather data exists for the activity date.",
      "table": [
        {
          "identifier": 0,
          "b_submission": false,
          "value_type": "Address",
          "value": "weather_repo",
          "name": "Weather Repository address"
        },
        {
          "identifier": 1,
          "b_submission": false,
          "value_type": "String",
          "value": "Condition",
          "name": "Repository policy name"
        },
        {
          "identifier": 2,
          "b_submission": true,
          "value_type": "U64",
          "name": "Activity date timestamp (submitted at runtime)"
        }
      ],
      "root": {
        "type": "query",
        "query": "repository.data has",
        "object": {"identifier": 0},
        "parameters": [
          {"type": "identifier", "identifier": 1},
          {
            "type": "convert_number_address",
            "node": {"type": "identifier", "identifier": 2}
          }
        ]
      }
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

**Guard Table**:

| identifier | b_submission | value_type | value | Purpose |
|------------|-------------|-----------|-------|---------|
| 0 | false | Address | weather_repo | Weather Repository to query |
| 1 | false | String | "Condition" | Repository policy name |
| 2 | **true** | U64 | 0 (placeholder) | Activity date timestamp, submitted at runtime |

### 3.2 Travel Complete Guard (Time-Lock)

Creates a Guard that verifies the time-lock condition for order completion.

**Guard Logic**:
```
clock > progress.current_time + 1000
(progress accessed via Order + convert_witness="OrderProgress")
```

**Prompt**: Create a Guard named "travel_complete_guard" for time-lock verification.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "guard",
    "data": {
      "namedNew": {
        "name": "travel_complete_guard",
        "tags": ["travel", "time-lock", "complete"],
        "replaceExistName": true
      },
      "description": "Time-lock guard for travel order completion. Requires current clock > progress.current_time + 1000ms.",
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
          "value": 1000,
          "name": "Time-lock duration in ms"
        }
      ],
      "root": {
        "type": "logic_as_u256_greater",
        "nodes": [
          {"type": "context", "context": "Clock"},
          {
            "type": "calc_number_add",
            "nodes": [
              {
                "type": "query",
                "query": "progress.current_time",
                "object": {"identifier": 0, "convert_witness": "OrderProgress"},
                "parameters": []
              },
              {"type": "identifier", "identifier": 1}
            ]
          }
        ]
      }
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

**Guard Table**:

| identifier | b_submission | value_type | value | Purpose |
|------------|-------------|-----------|-------|---------|
| 0 | **true** | Address | 0x0...0 (placeholder) | Order ID submitted at runtime, converted to Progress via convert_witness |
| 1 | false | U64 | 1000 | Time-lock duration in ms (1 second for testing) |

> **Important**: `1000` ms (1 second) is for testing only. In production, set to a reasonable duration (e.g., 8 hours = 28800000 ms).

### 3.3 Travel Cancel Guard

Creates a Guard that allows order cancellation. This Guard always passes (returns true), as cancellation is controlled by permission-based access.

**Prompt**: Create a Guard named "travel_cancel_guard" for order cancellation.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "guard",
    "data": {
      "namedNew": {
        "name": "travel_cancel_guard",
        "tags": ["travel", "cancel"],
        "replaceExistName": true
      },
      "description": "Cancel guard for travel orders. Always passes - cancellation is controlled by permission-based access.",
      "table": [
        {
          "identifier": 0,
          "b_submission": false,
          "value_type": "Bool",
          "value": true,
          "name": "Always true"
        }
      ],
      "root": {
        "type": "identifier",
        "identifier": 0
      }
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

### 3.4 Merchant Victory Guard (100% to Treasury)

Checks if order progress current node is "Complete" AND order belongs to this service. If passed, merchant (Treasury) receives 100% of funds.

**Prompt**: Create Guard "merchant_victory_guard".

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "guard",
    "data": {
      "namedNew": {
        "name": "merchant_victory_guard",
        "tags": ["merchant", "victory", "complete", "level3-scene-combined"],
        "replaceExistName": true
      },
      "description": "Guard for merchant victory: checks if order progress current node is Complete AND order belongs to travel_service. VERIFIER CONSTRAINT LEVEL 3 (scene-combined): No Signer binding needed because the allocator uses sharing.who=Entity (travel_treasury) — funds always flow to the Treasury regardless of caller (R-C3-06 safe). Two-fold verification: (1) order at Complete node, (2) order belongs to this service (prevents cross-service theft, R-C3-05).",
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
          "value_type": "String",
          "value": "Complete",
          "name": "Complete node name"
        },
        {
          "identifier": 2,
          "b_submission": false,
          "value_type": "Address",
          "value": "travel_service",
          "name": "Service address (this service)"
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
                "object": {"identifier": 0, "convert_witness": "OrderProgress"},
                "parameters": []
              },
              {"type": "identifier", "identifier": 1}
            ]
          },
          {
            "type": "logic_equal",
            "nodes": [
              {"type": "query", "query": "order.service", "object": {"identifier": 0}, "parameters": []},
              {"type": "identifier", "identifier": 2}
            ]
          }
        ]
      }
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

**Guard Explanation (Two-fold Verification — Level 3 Scene-Combined):**
- **Table Item 0**: Order address (submitted at runtime)
- **Table Item 1**: Constant string "Complete" (merchant win node name)
- **Table Item 2**: Constant address `travel_service` (this service's on-chain address)
- **Condition 1 — Complete Node**: `logic_equal[query(progress.current, witness="OrderProgress"), identifier[1]]` — verifies the order is at the Complete node
- **Condition 2 — Service Ownership**: `logic_equal[query("order.service"), identifier[2]]` — verifies the submitted Order's `service` field equals `travel_service`, **preventing cross-service theft** where someone submits another service's order (R-C3-05)
- **root**: `logic_and` of both conditions — all must pass for allocation to proceed

> **Risk Elimination (R-C3-05 + R-C3-06) — Level 3 Scene-Combined Design**:
> - **R-C3-05 (Cross-service theft)**: Eliminated by the Service Ownership check (Condition 2). An attacker cannot submit another service's order because `order.service` won't match `travel_service`.
> - **R-C3-06 (Fund theft via Signer)**: Eliminated by the scene itself — the allocator uses `"who": {"Entity": {"name_or_address": "travel_treasury"}}` (funds flow to the fixed Treasury address). Funds go to a fixed recipient regardless of caller, so **no Signer binding is needed**. This is the Level 3 scene-combined pattern.

### 3.5 No Ice Scooting Guard (80% Treasury, 20% Refund)

Checks if progress current is "Cancel" or "Ice Scooting" AND order belongs to this service. If passed, merchant (Treasury) gets 80%, user gets 20% refund.

**Prompt**: Create Guard "no_ice_scooting_guard".

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "guard",
    "data": {
      "namedNew": {
        "name": "no_ice_scooting_guard",
        "tags": ["user", "cancel", "ice_scooting", "level3-scene-combined"],
        "replaceExistName": true
      },
      "description": "Guard for user not participating in ice scooting: checks if progress current is Cancel or Ice Scooting AND order belongs to travel_service. VERIFIER CONSTRAINT LEVEL 3 (scene-combined): No Signer binding needed because the allocator uses sharing.who=Entity (travel_treasury) for merchant portion and sharing.who=GuardIdentifier(0) for customer refund (escrow to Order address). Two-fold verification: (1) order at Cancel/Ice Scooting node, (2) order belongs to this service (prevents cross-service theft, R-C3-05).",
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
          "value_type": "String",
          "value": "Cancel",
          "name": "Cancel node name"
        },
        {
          "identifier": 2,
          "b_submission": false,
          "value_type": "String",
          "value": "Ice Scooting",
          "name": "Ice Scooting node name"
        },
        {
          "identifier": 3,
          "b_submission": false,
          "value_type": "Address",
          "value": "travel_service",
          "name": "Service address (this service)"
        }
      ],
      "root": {
        "type": "logic_and",
        "nodes": [
          {
            "type": "logic_or",
            "nodes": [
              {
                "type": "logic_equal",
                "nodes": [
                  {
                    "type": "query",
                    "query": "progress.current",
                    "object": {"identifier": 0, "convert_witness": "OrderProgress"},
                    "parameters": []
                  },
                  {"type": "identifier", "identifier": 1}
                ]
              },
              {
                "type": "logic_equal",
                "nodes": [
                  {
                    "type": "query",
                    "query": "progress.current",
                    "object": {"identifier": 0, "convert_witness": "OrderProgress"},
                    "parameters": []
                  },
                  {"type": "identifier", "identifier": 2}
                ]
              }
            ]
          },
          {
            "type": "logic_equal",
            "nodes": [
              {"type": "query", "query": "order.service", "object": {"identifier": 0}, "parameters": []},
              {"type": "identifier", "identifier": 3}
            ]
          }
        ]
      }
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

**Guard Explanation (Two-fold Verification — Level 3 Scene-Combined):**
- **Table Item 0**: Order address (submitted at runtime)
- **Table Items 1-2**: Constant strings "Cancel" and "Ice Scooting" (node names)
- **Table Item 3**: Constant address `travel_service` (this service's on-chain address)
- **Condition 1 — Cancel/Ice Scooting Node**: `logic_or` of two `logic_equal` checks against `query(progress.current, witness="OrderProgress")` — verifies the order is at Cancel or Ice Scooting node
- **Condition 2 — Service Ownership**: `logic_equal[query("order.service"), identifier[3]]` — verifies the submitted Order's `service` field equals `travel_service`, **preventing cross-service theft** (R-C3-05)
- **root**: `logic_and` of both conditions — all must pass for allocation to proceed

> **Risk Elimination (R-C3-05 + R-C3-06) — Level 3 Scene-Combined Design**:
> - **R-C3-05 (Cross-service theft)**: Eliminated by the Service Ownership check (Condition 2). An attacker cannot submit another service's order because `order.service` won't match `travel_service`.
> - **R-C3-06 (Fund theft via Signer)**: Eliminated by the scene itself — the merchant portion uses `"who": {"Entity": {"name_or_address": "travel_treasury"}}` (funds flow to the fixed Treasury address), and the customer refund uses `"who": {"GuardIdentifier": 0}` (funds flow to the Order object's address as escrow). Neither portion flows to the caller's wallet, so **no Signer binding is needed**.

### 3.6 No SPA Guard (5% Treasury, 95% Refund)

Checks if progress current is "SPA" AND order belongs to this service. If passed, merchant (Treasury) gets 5%, user gets 95% refund.

**Prompt**: Create Guard "no_spa_guard".

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "guard",
    "data": {
      "namedNew": {
        "name": "no_spa_guard",
        "tags": ["user", "cancel", "spa", "level3-scene-combined"],
        "replaceExistName": true
      },
      "description": "Guard for user not participating in SPA: checks if progress current is SPA AND order belongs to travel_service. VERIFIER CONSTRAINT LEVEL 3 (scene-combined): No Signer binding needed because the allocator uses sharing.who=Entity (travel_treasury) for merchant portion and sharing.who=GuardIdentifier(0) for customer refund (escrow to Order address). Two-fold verification: (1) order at SPA node, (2) order belongs to this service (prevents cross-service theft, R-C3-05).",
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
          "value_type": "String",
          "value": "SPA",
          "name": "SPA node name"
        },
        {
          "identifier": 2,
          "b_submission": false,
          "value_type": "Address",
          "value": "travel_service",
          "name": "Service address (this service)"
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
                "object": {"identifier": 0, "convert_witness": "OrderProgress"},
                "parameters": []
              },
              {"type": "identifier", "identifier": 1}
            ]
          },
          {
            "type": "logic_equal",
            "nodes": [
              {"type": "query", "query": "order.service", "object": {"identifier": 0}, "parameters": []},
              {"type": "identifier", "identifier": 2}
            ]
          }
        ]
      }
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

**Guard Explanation (Two-fold Verification — Level 3 Scene-Combined):**
- **Table Item 0**: Order address (submitted at runtime)
- **Table Item 1**: Constant string "SPA" (node name)
- **Table Item 2**: Constant address `travel_service` (this service's on-chain address)
- **Condition 1 — SPA Node**: `logic_equal[query(progress.current, witness="OrderProgress"), identifier[1]]` — verifies the order is at the SPA node
- **Condition 2 — Service Ownership**: `logic_equal[query("order.service"), identifier[2]]` — verifies the submitted Order's `service` field equals `travel_service`, **preventing cross-service theft** (R-C3-05)
- **root**: `logic_and` of both conditions — all must pass for allocation to proceed

> **Risk Elimination (R-C3-05 + R-C3-06) — Level 3 Scene-Combined Design**:
> - **R-C3-05 (Cross-service theft)**: Eliminated by the Service Ownership check (Condition 2). An attacker cannot submit another service's order because `order.service` won't match `travel_service`.
> - **R-C3-06 (Fund theft via Signer)**: Eliminated by the scene itself — the merchant portion uses `"who": {"Entity": {"name_or_address": "travel_treasury"}}` (funds flow to the fixed Treasury address), and the customer refund uses `"who": {"GuardIdentifier": 0}` (funds flow to the Order object's address as escrow). Neither portion flows to the caller's wallet, so **no Signer binding is needed**.

---

## Step 4: Create and Publish Machine

Create a Machine to define the travel service workflow with all nodes and forwards. The Machine must be published before it can be bound to a Service.

> **Important**: In the Machine node structure, each node's `pairs` define how to ENTER that node. The `prev_node` specifies the source node, and `forwards` are the operation names used to advance from `prev_node` to this node.

**Prompt**: Create and publish a Machine named "travel_machine" with the complete travel workflow.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "machine",
    "data": {
      "object": {
        "name": "travel_machine",
        "permission": "travel_permission",
        "replaceExistName": true
      },
      "description": "Iceland travel service workflow: (init) -> Buy Insurance -> SPA -> Ice Scooting -> Complete/Cancel",
      "node": {
        "op": "add",
        "bReplace": true,
        "nodes": [
          {
            "name": "Buy Insurance",
            "pairs": [
              {
                "prev_node": "",
                "threshold": 1,
                "forwards": [
                  {
                    "name": "buy_insurance",
                    "weight": 1,
                    "permissionIndex": 1000
                  }
                ]
              }
            ]
          },
          {
            "name": "SPA",
            "pairs": [
              {
                "prev_node": "Buy Insurance",
                "threshold": 1,
                "forwards": [
                  {
                    "name": "go_spa",
                    "weight": 1,
                    "permissionIndex": 1001
                  }
                ]
              }
            ]
          },
          {
            "name": "Ice Scooting",
            "pairs": [
              {
                "prev_node": "SPA",
                "threshold": 1,
                "forwards": [
                  {
                    "name": "go_ice_scooting",
                    "weight": 1,
                    "permissionIndex": 1004,
                    "guard": {
                      "guard": "weather_check_guard",
                      "retained_submission": []
                    }
                  }
                ]
              }
            ]
          },
          {
            "name": "Complete",
            "pairs": [
              {
                "prev_node": "Ice Scooting",
                "threshold": 1,
                "forwards": [
                  {
                    "name": "complete_trip",
                    "weight": 1,
                    "permissionIndex": 1002,
                    "guard": {
                      "guard": "travel_complete_guard",
                      "retained_submission": []
                    }
                  }
                ]
              }
            ]
          },
          {
            "name": "Cancel",
            "pairs": [
              {
                "prev_node": "Ice Scooting",
                "threshold": 1,
                "forwards": [
                  {
                    "name": "cancel_trip",
                    "weight": 1,
                    "permissionIndex": 1003,
                    "guard": {
                      "guard": "travel_cancel_guard",
                      "retained_submission": []
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
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

**Machine Workflow Diagram**:

```
("") --buy_insurance--> [Buy Insurance] --go_spa--> [SPA] --go_ice_scooting--[weather_check]--> [Ice Scooting]
                                                                                                  |
                                                                                                  +--complete_trip--[time-lock]--> [Complete]
                                                                                                  +--cancel_trip-------------> [Cancel]
```

**Node Pair Structure**:

| Node | prev_node | Forward | Permission Index | Guard |
|------|-----------|---------|-----------------|-------|
| Buy Insurance | "" (entry) | buy_insurance | 1000 | - |
| SPA | Buy Insurance | go_spa | 1001 | - |
| Ice Scooting | SPA | go_ice_scooting | 1004 | weather_check_guard |
| Complete | Ice Scooting | complete_trip | 1002 | travel_complete_guard |
| Cancel | Ice Scooting | cancel_trip | 1003 | travel_cancel_guard |

> **Note**: The `prev_node` field uses an empty string `""` to denote the entry point. Each node defines how to enter it from a previous node. The `threshold` field (required) specifies the minimum forward weight needed to trigger node advancement.

---

## Step 5: Configure and Publish Service

Configure the travel service (created unpublished in Step 2.5) with all bindings and publish it. The Service requires:
- Machine binding (must be published first)
- Sales items (product listing)
- Arbitration binding
- Order allocators (fund distribution rules — merchant funds flow to `travel_treasury`)
- `pause: false` and `publish: true` to make it active

**Prompt**: Configure and publish the Service named "travel_service".

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "service",
    "data": {
      "object": {
        "name": "travel_service",
        "permission": "travel_permission",
        "replaceExistName": true
      },
      "description": "Iceland travel service: Blue Lagoon SPA + Glacier Ice Scooting.",
      "machine": "travel_machine",
      "sales": {
        "op": "add",
        "sales": [
          {
            "name": "Iceland Travel Package",
            "price": "500000000",
            "stock": "99",
            "suspension": false,
            "wip": "",
            "wip_hash": ""
          }
        ]
      },
      "arbitrations": {
        "op": "add",
        "objects": ["travel_arbitration"]
      },
      "order_allocators": {
        "description": "Travel order revenue allocation based on progress state",
        "threshold": 0,
        "allocators": [
          {
            "guard": "merchant_victory_guard",
            "fix": "0",
            "sharing": [
              {
                "who": {"Entity": {"name_or_address": "travel_treasury"}},
                "sharing": 10000,
                "mode": "Rate"
              }
            ]
          },
          {
            "guard": "no_ice_scooting_guard",
            "fix": "0",
            "sharing": [
              {
                "who": {"Entity": {"name_or_address": "travel_treasury"}},
                "sharing": 8000,
                "mode": "Rate"
              },
              {
                "who": {"GuardIdentifier": 0},
                "sharing": 2000,
                "mode": "Rate"
              }
            ]
          },
          {
            "guard": "no_spa_guard",
            "fix": "0",
            "sharing": [
              {
                "who": {"Entity": {"name_or_address": "travel_treasury"}},
                "sharing": 500,
                "mode": "Rate"
              },
              {
                "who": {"GuardIdentifier": 0},
                "sharing": 9500,
                "mode": "Rate"
              }
            ]
          }
        ]
      },
      "pause": false,
      "publish": true
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

**order_allocators Field Reference**:

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Description of the allocation strategy |
| `threshold` | number | Minimum threshold for allocation (0 = no minimum) |
| `allocators` | array | Array of allocator configurations |
| `allocators[].guard` | string | Guard name/ID that must pass for this allocation |
| `allocators[].fix` | string | Fixed amount per recipient ("0" = none) |
| `allocators[].sharing` | array | Array of sharing rules |
| `allocators[].sharing[].who` | object | Recipient: `{"Entity": {...}}` for fixed address, `{"GuardIdentifier": N}` for Guard table index, `{"Signer": "signer"}` for caller |
| `allocators[].sharing[].sharing` | number | Amount in basis points (10000 = 100%) |
| `allocators[].sharing[].mode` | string | Allocation mode ("Rate" or "Amount") |

**Recipient Types**:

| Type | Syntax | Resolves To | Use Case |
|------|--------|-------------|----------|
| `Entity` | `{"Entity": {"name_or_address": "travel_treasury"}}` | The named Treasury address | Merchant receipts (Treasury object — Treasury-first rule) |
| `GuardIdentifier` | `{"GuardIdentifier": 0}` | Address from Guard table index 0 (submitted at runtime) | Customer refunds (Order ID submitted to Guard) |
| `Signer` | `{"Signer": "signer"}` | The caller of `alloc_by_guard` | When caller should receive all funds (**⚠️ R-C3-06 Risk**: unsafe without Guard Signer binding) |

> **Important**: All allocation Guards (merchant_victory_guard, no_ice_scooting_guard, no_spa_guard) have `identifier: 0` as a submission field accepting the Order ID at runtime. `{"GuardIdentifier": 0}` resolves to this submitted Order ID, so funds are sent to the Order object — the customer (Order builder) can then withdraw.

> **Treasury-First Rule**: Merchant funds flow to `travel_treasury` (not `travel_service`) following the fund-flow design pattern. This makes all allocators inherently safe (R-C3-06) — funds go to a fixed Treasury regardless of caller, so no Signer binding is needed in the Guards. Combined with the R-C3-05 service ownership check in each Guard, the allocators are protected against both cross-service theft and fund theft via Signer.

**Allocation Logic**:

| Guard | Condition | Treasury Receives | Customer Receives | Verifier Level |
|-------|-----------|-------------------|-------------------|----------------|
| merchant_victory_guard | Progress is "Complete" + order.service verified | 100% (Entity → travel_treasury) | 0% | Level 3 (scene-combined) |
| no_ice_scooting_guard | Progress is "Cancel" or "Ice Scooting" + order.service verified | 80% (Entity → travel_treasury) | 20% (GuardIdentifier: 0 → Order) | Level 3 (scene-combined) |
| no_spa_guard | Progress is "SPA" + order.service verified | 5% (Entity → travel_treasury) | 95% (GuardIdentifier: 0 → Order) | Level 3 (scene-combined) |

---

## Step 6: Place Order (Customer Purchase)

The customer (Alice) purchases the travel package. This creates an Order, a Progress (initialized at the entry node ""), and an Allocation object automatically.

**Prompt**: Alice purchases the Iceland Travel Package from the service.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "service",
    "data": {
      "object": "travel_service",
      "order_new": {
        "buy": {
          "items": [
            {
              "name": "Iceland Travel Package",
              "stock": "1",
              "wip_hash": ""
            }
          ],
          "total_pay": {"balance": "500000000"}
        },
        "namedNewOrder": {
          "name": "alice_travel_order",
          "replaceExistName": true
        },
        "namedNewProgress": {
          "name": "alice_travel_progress",
          "replaceExistName": true
        },
        "namedNewAllocation": {
          "name": "alice_travel_allocation",
          "replaceExistName": true
        }
      }
    },
    "env": {
      "account": "alice",
      "network": "testnet",
      "no_cache": true,
      "confirmed": true
    }
  }
}
```

> **Note**: The `total_pay.balance` of `500000000` equals 0.5 WOW (1 WOW = 10^9 base units). The customer account must have sufficient balance. The operation creates three named objects: Order, Progress, and Allocation.

---

## Step 7: Progress Operations (Order Workflow)

The service provider advances the Progress through the workflow nodes. Each operation moves the Progress from the current node to the next node via a specified forward.

> **Important**: Add `"no_cache": true` to the `env` field for all Progress operations to avoid stale cache issues.

### 7.1 Progress to Buy Insurance

Move from initial node ("") to "Buy Insurance" node.

**Prompt**: Operate progress to move to Buy Insurance node.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "progress",
    "data": {
      "object": "alice_travel_progress",
      "operate": {
        "operation": {
          "next_node_name": "Buy Insurance",
          "forward": "buy_insurance"
        }
      }
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true
    }
  }
}
```

### 7.2 Progress to SPA

Move from "Buy Insurance" to "SPA" node.

**Prompt**: Operate progress to move to SPA node.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "progress",
    "data": {
      "object": "alice_travel_progress",
      "operate": {
        "operation": {
          "next_node_name": "SPA",
          "forward": "go_spa"
        }
      }
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true
    }
  }
}
```

### 7.3 Progress to Ice Scooting (with Weather Guard Submission)

Move from "SPA" to "Ice Scooting" node. This forward has a Guard (`weather_check_guard`) that verifies weather data exists in the repository for the activity date. You must submit the activity date timestamp (one of the sunny-day timestamps from Step 0.1) at runtime.

**Prompt**: Operate progress to move to Ice Scooting node with weather Guard submission.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "progress",
    "data": {
      "object": "alice_travel_progress",
      "operate": {
        "operation": {
          "next_node_name": "Ice Scooting",
          "forward": "go_ice_scooting"
        }
      }
    },
    "submission": {
      "type": "submission",
      "guard": [
        {
          "object": "weather_check_guard",
          "impack": true
        }
      ],
      "submission": [
        {
          "guard": "weather_check_guard",
          "submission": [
            {
              "identifier": 2,
              "b_submission": true,
              "value_type": "U64",
              "value": <ACTIVITY_DATE_TIMESTAMP>,
              "name": "Activity date timestamp"
            }
          ]
        }
      ]
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true
    }
  }
}
```

> **Note**: Replace `<ACTIVITY_DATE_TIMESTAMP>` with one of the sunny-day timestamps from Step 0.1 (e.g., `1783555200000` for Day 1). The timestamp **must exactly match** the `id` used when adding weather data to the repository in Step 0.4 — Repository data is keyed by timestamp, and the Guard queries `repository.data has("Condition", convert_number_address(activity_date))`.
>
> **Key**: Only `identifier: 2` (the activity date) is submitted at runtime. Identifiers 0 (weather_repo) and 1 ("Condition") are fixed in the Guard table and do not need to be submitted. The `submission` field is at the **top level** of the input (alongside `data` and `env`), NOT inside `data`.

### 7.4 Complete Trip (with Guard Submission)

Move from "Ice Scooting" to "Complete" node. This forward has a Guard (`travel_complete_guard`) that requires the Order ID to be submitted for time-lock verification.

**Prompt**: Operate progress to complete the trip with Guard submission.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "progress",
    "data": {
      "object": "alice_travel_progress",
      "operate": {
        "operation": {
          "next_node_name": "Complete",
          "forward": "complete_trip"
        }
      }
    },
    "submission": {
      "type": "submission",
      "guard": [
        {
          "object": "travel_complete_guard",
          "impack": true
        }
      ],
      "submission": [
        {
          "guard": "travel_complete_guard",
          "submission": [
            {
              "identifier": 0,
              "b_submission": true,
              "value_type": "Address",
              "value": "<ORDER_OBJECT_ID>",
              "name": "Order ID"
            }
          ]
        }
      ]
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true
    }
  }
}
```

> **Note**: Replace `<ORDER_OBJECT_ID>` with the actual Order object ID (e.g., `0x7cc9f2228e130c2f6b585bb9c4666fd4d03252d38048355678f46e31b682eb38`). You can query the Progress object to find the `task` field which contains the Order ID.
>
> **Key**: The `submission` field is at the **top level** of the input (alongside `data` and `env`), NOT inside `data`. The `impack: true` means the Guard verification result affects the final outcome.

### 7.5 Cancel Trip (Alternative Path)

> **Note**: This is an **alternative** to Step 7.4. Once the trip is Completed, it cannot be Cancelled (and vice versa). Use this path only if cancelling from the "Ice Scooting" node.

**Prompt**: Operate progress to cancel the trip with Guard submission.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "progress",
    "data": {
      "object": "alice_travel_progress",
      "operate": {
        "operation": {
          "next_node_name": "Cancel",
          "forward": "cancel_trip"
        }
      }
    },
    "submission": {
      "type": "submission",
      "guard": [
        {
          "object": "travel_cancel_guard",
          "impack": true
        }
      ],
      "submission": [
        {
          "guard": "travel_cancel_guard",
          "submission": []
        }
      ]
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true
    }
  }
}
```

> **Note**: The `travel_cancel_guard` always passes (returns true), so no submission data is needed. The empty `submission: []` is sufficient.

**Progress Operation Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `data.object` | string | Progress object name/ID |
| `data.operate.operation.next_node_name` | string | Target node name to move to |
| `data.operate.operation.forward` | string | Forward name defined in Machine |
| `submission` | object | Guard verification data (top-level, required when forward has Guard) |
| `env.no_cache` | boolean | Set to `true` to avoid stale cache issues |

---

## Step 8: Execute Fund Allocation

After the Progress reaches a terminal state (Complete or Cancel), execute the fund allocation. This operation verifies the allocation Guard and distributes funds according to the `order_allocators` configured in Step 5.

**Anyone can call this operation** — the caller does not need to be the merchant or the customer. The Guard verification determines which allocator's sharing rules apply, and funds are distributed to the recipients defined in those rules.

### 8.1 Query the Order ID

The allocation Guard requires the Order ID as a submission (identifier: 0). Query the Progress object to find the `task` field, which contains the Order ID.

**Prompt**: Query the Progress object to get the Order ID.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "progress",
    "data": {
      "object": "alice_travel_progress"
    },
    "env": {
      "network": "testnet",
      "no_cache": true
    }
  }
}
```

> **Note**: The response includes a `task` field containing the Order object ID. Copy this value for the allocation submission.

### 8.2 Execute Allocation (Merchant Victory Path)

When the Progress is "Complete", the `merchant_victory_guard` passes, and 100% of funds go to the Service object.

**Prompt**: Execute fund allocation with the merchant_victory_guard, submitting the Order ID.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "allocation",
    "data": {
      "object": "alice_travel_allocation",
      "alloc_by_guard": "merchant_victory_guard"
    },
    "submission": {
      "type": "submission",
      "guard": [
        {
          "object": "merchant_victory_guard",
          "impack": true
        }
      ],
      "submission": [
        {
          "guard": "merchant_victory_guard",
          "submission": [
            {
              "identifier": 0,
              "b_submission": true,
              "value_type": "Address",
              "value": "<ORDER_OBJECT_ID>",
              "name": "Order ID"
            }
          ]
        }
      ]
    },
    "env": {
      "account": "travel_provider",
      "network": "testnet",
      "no_cache": true
    }
  }
}
```

> **Note**: Replace `<ORDER_OBJECT_ID>` with the actual Order object ID from Step 8.1.
>
> **Two-phase submission**: If the first call returns a submission prompt (without executing), re-call with the `submission` field populated as shown above.

### 8.3 Execute Allocation (Refund Paths)

For refund scenarios (Cancel or SPA), use the corresponding Guard. The same submission structure applies — the Order ID is submitted to identifier 0.

**Cancel/Ice Scooting path** (80% Service, 20% Order):

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "allocation",
    "data": {
      "object": "alice_travel_allocation",
      "alloc_by_guard": "no_ice_scooting_guard"
    },
    "submission": {
      "type": "submission",
      "guard": [{"object": "no_ice_scooting_guard", "impack": true}],
      "submission": [{
        "guard": "no_ice_scooting_guard",
        "submission": [{"identifier": 0, "b_submission": true, "value_type": "Address", "value": "<ORDER_OBJECT_ID>", "name": "Order ID"}]
      }]
    },
    "env": {"account": "travel_provider", "network": "testnet", "no_cache": true, "confirmed": true}
  }
}
```

**SPA path** (5% Service, 95% Order):

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "allocation",
    "data": {
      "object": "alice_travel_allocation",
      "alloc_by_guard": "no_spa_guard"
    },
    "submission": {
      "type": "submission",
      "guard": [{"object": "no_spa_guard", "impack": true}],
      "submission": [{
        "guard": "no_spa_guard",
        "submission": [{"identifier": 0, "b_submission": true, "value_type": "Address", "value": "<ORDER_OBJECT_ID>", "name": "Order ID"}]
      }]
    },
    "env": {"account": "travel_provider", "network": "testnet", "no_cache": true, "confirmed": true}
  }
}
```

### 8.4 Verify Allocation Result

After allocation, query the Allocation and Payment objects to verify the fund distribution.

**Prompt**: Query the Allocation object to verify the balance and payment records.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "allocation",
    "data": {
      "object": "alice_travel_allocation"
    },
    "env": {
      "network": "testnet",
      "no_cache": true
    }
  }
}
```

> **Expected result**: The Allocation `balance` should be 0 (all funds distributed), and the `payment` array should contain the Payment object ID(s) created by the allocation.

**Allocation Operation Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `data.object` | string | Allocation object name/ID |
| `data.alloc_by_guard` | string | Guard name/ID to verify (determines which allocator's rules apply) |
| `submission` | object | Guard submission data (Order ID at identifier 0) |
| `env.no_cache` | boolean | Set to `true` to avoid stale cache issues |

> **Important**: `alloc_by_guard` accepts Guard names (e.g., `"merchant_victory_guard"`) or Guard object IDs. The Guard must exist in the Allocation's `allocators` list. Only the first Guard that passes (first-Guard-wins) triggers fund distribution.

---

## Best Practices

### 1. Guard Root Format

Guards use a direct GuardNode as the `root` field — no wrapper needed:
```json
"root": {
  "type": "logic_equal",
  "nodes": [...]
}
```

### 2. Machine Node Structure

Each node's `pairs` define how to **enter** that node. The `prev_node` specifies the source, and `forwards` are the operations to advance:
```json
{
  "name": "TargetNode",
  "pairs": [{
    "prev_node": "SourceNode",
    "threshold": 1,
    "forwards": [{"name": "forward_name", "weight": 1, "permissionIndex": 1000}]
  }]
}
```

- Use `prev_node` (not `prior_node`)
- `threshold` is required for every pair
- Consolidate forwards with the same `prev_node` into one pair

### 3. Machine Publish Before Service

The Machine must be published (`"publish": true`) before binding it to a Service. Unpublished Machines cannot be referenced by Services.

### 4. Service Creation in One Step

Create the Service with all configurations — including `pause: false` and `publish: true` — in a single operation:
```json
{
  "pause": false,
  "publish": true,
  "order_allocators": {...},
  "sales": {...},
  "machine": "...",
  "arbitrations": {...}
}
```

### 5. Guard Submission for Progress

When a forward has a Guard, the Progress operation requires a `submission` field at the **top level** (not inside `data`):
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "progress",
    "data": {...},
    "submission": {
      "type": "submission",
      "guard": [{"object": "guard_name", "impack": true}],
      "submission": [{
        "guard": "guard_name",
        "submission": [{"identifier": 0, "b_submission": true, "value_type": "Address", "value": "0x...", "name": "Order ID"}]
      }]
    },
    "env": {"no_cache": true, ...}
  }
}
```

### 6. Cache Management

Add `"no_cache": true` to the `env` field for all Progress operations and queries after mutations to avoid stale cache issues.

### 7. Weather Data Timestamps

Weather data in the Repository is keyed by timestamp (`id`). The `weather_check_guard` queries `repository.data has("Condition", convert_number_address(activity_date))` — the `activity_date` submitted at runtime in Step 7.3 **must exactly match** the `id` used when adding data in Step 0.4.

- Always align timestamps to UTC 00:00:00 (`Math.floor(now / DAY_MS) * DAY_MS`) so they are reproducible.
- Re-run `calc-weather-timestamps.js` at test time — the values depend on the current date.
- The Guard only checks data **existence**, not the condition value. A "rainy" day will still pass. To reject by condition value, use a Guard querying `repository.data` with a value comparison.

### 8. Order Placement

Customers place orders using the `order_new` field in the Service operation. This automatically creates Order, Progress, and Allocation objects:
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "service",
    "data": {
      "object": "service_name",
      "order_new": {
        "buy": {
          "items": [{"name": "Product", "stock": "1", "wip_hash": ""}],
          "total_pay": {"balance": "price_amount"}
        },
        "namedNewOrder": {"name": "order_name", "replaceExistName": true},
        "namedNewProgress": {"name": "progress_name", "replaceExistName": true},
        "namedNewAllocation": {"name": "allocation_name", "replaceExistName": true}
      }
    },
    "env": {"account": "customer", "network": "testnet", "no_cache": true, "confirmed": true}
  }
}
```
