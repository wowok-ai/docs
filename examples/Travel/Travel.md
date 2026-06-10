# Iceland Travel Service Example

A complete example demonstrating how to create an Iceland travel service using WoWok protocol. This service integrates weather-dependent activities, insurance sub-orders, and multi-node workflow management.

> **Note**: All steps in this document have been tested and verified to work correctly with the WoWok MCP server.

---

## Core Requirements & Features

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| **Weather-Dependent Activities** | Ice scooting requires sunny weather | Guard queries weather Repository for the activity date |
| **Insurance Sub-Order** | Travel provider purchases insurance as supply chain sub-order | Machine forward creates insurance Order via Progress |
| **Multi-Node Workflow** | Start -> Buy Insurance -> SPA -> Ice Scooting -> Complete | Machine with 5 nodes and conditional paths |
| **Time-Lock Completion** | Prevent premature order completion | Guard using Order + convert_witness(TypeOrderProgress) |
| **Cancellation Support** | Allow order cancellation before completion | Cancel forward with permission-based access |
| **Arbitration** | Dispute resolution for order conflicts | Arbitration object bound to Service |

---

## Prerequisites

Before running this example, ensure you have:

1. An account named `travel_provider_v1` with sufficient WOW tokens
2. An account named `weather_provider_v1` with sufficient WOW tokens
3. An account named `alice_v1` (test customer) with sufficient WOW tokens
4. Access to the WoWok MCP server

### Create Accounts

**Prompt**: Create accounts for travel provider, weather provider, and test customer.

```json
{
  "gen": {
    "name": "travel_provider_v1",
    "replaceExistName": true
  }
}
```

```json
{
  "gen": {
    "name": "weather_provider_v1",
    "replaceExistName": true
  }
}
```

```json
{
  "gen": {
    "name": "alice_v1",
    "replaceExistName": true
  }
}
```

### Get Test Tokens

**Prompt**: Request testnet WOW tokens for all accounts.

```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "travel_provider_v1"
  }
}
```

```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "weather_provider_v1"
  }
}
```

```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "alice_v1"
  }
}
```

---

## Step 0: Setup Weather Data

Before creating the travel service, set up the weather Repository with recent 5-day weather data.

### 0.1 Calculate Weather Timestamps

Use the following JavaScript to calculate future 5-day UTC timestamps:

```js
const DAY_MS = 86400000;
const now = Date.now();
const todayStart = Math.floor(now / DAY_MS) * DAY_MS;
// Future 5 days UTC day start timestamps (for testing weather-dependent activities)
for (let i = 1; i <= 5; i++) {
  const ts = todayStart + i * DAY_MS;
  console.log(`Day ${i}: ${ts} (${new Date(ts).toISOString()})`);
}
```

### 0.2 Create Weather Permission

**Prompt**: Create a Permission object named "weather_permission_v1".

```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "weather_permission_v1",
      "replaceExistName": true
    },
    "description": "Weather repository permission"
  },
  "env": {
    "account": "weather_provider_v1",
    "network": "testnet"
  }
}
```

### 0.3 Create Weather Repository with Policies

**Prompt**: Create a Repository named "weather_repo_v2" with "Condition" policy.

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "weather_repo_v2",
      "permission": "weather_permission_v1",
      "replaceExistName": true
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
    "account": "weather_provider_v1",
    "network": "testnet"
  }
}
```

### 0.4 Add Weather Data

Add 5 days of weather data. The last day is "rainy" to test the weather check Guard's rejection behavior.

**Prompt**: Add weather data to "weather_repo_v2" with policy "Condition".

```json
{
  "operation_type": "repository",
  "data": {
    "object": "weather_repo_v2",
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
    "account": "weather_provider_v1",
    "network": "testnet"
  }
}
```

> **Note**: Replace `<DAY1_TIMESTAMP>` through `<DAY5_TIMESTAMP>` with actual values from step 0.1.

---

## Step 1: Create Permission Object

Create a Permission object to manage access control for the travel service.

**Prompt**: Create a Permission object named "travel_permission_v1" for the travel service.

```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "travel_permission_v1",
      "tags": ["travel", "iceland", "tourism"],
      "replaceExistName": true
    },
    "description": "Permission for Iceland travel service"
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

---

## Step 2: Create Arbitration Object

Create an Arbitration object for dispute resolution.

**Prompt**: Create an Arbitration named "travel_arbitration_v1".

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "travel_arbitration_v1",
      "permission": "travel_permission_v1",
      "replaceExistName": true
    },
    "description": "Arbitration for Iceland travel service disputes"
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

---

## Step 3: Create Guards

### 3.1 Weather Check Guard

Creates a Guard that verifies weather data exists for a given date.

**Guard Logic**:
```
repository.data has("Condition", convert_number_address(activity_date))
```

**Prompt**: Create a Guard named "weather_check_guard_v1" for weather condition verification.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "weather_check_guard_v1",
      "tags": ["weather", "check", "travel"],
      "replaceExistName": true
    },
    "description": "Weather check guard for ice scooting activity. Checks if weather data exists for the activity date.",
    "table": [
      {
        "identifier": 0,
        "b_submission": false,
        "value_type": "Address",
        "value": "weather_repo_v2",
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
        "value": 0,
        "name": "Activity date timestamp (submitted at runtime)"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "query",
        "query": "repository.data has",
        "object": {
          "identifier": 0
        },
        "parameters": [
          {
            "type": "identifier",
            "identifier": 1
          },
          {
            "type": "convert_number_address",
            "node": {
              "type": "identifier",
              "identifier": 2
            }
          }
        ]
      }
    }
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

**Guard Table**:

| identifier | b_submission | value_type | value | Purpose |
|------------|-------------|-----------|-------|---------|
| 0 | false | Address | weather_repo_v2 | Weather Repository to query |
| 1 | false | String | "Condition" | Repository policy name |
| 2 | **true** | U64 | 0 (placeholder) | Activity date timestamp, submitted at runtime |

### 3.2 Travel Complete Guard (Time-Lock)

Creates a Guard that verifies the time-lock condition for order completion.

**Guard Logic**:
```
clock > progress.current_time + 1000
(progress accessed via Order + convert_witness=TypeOrderProgress)
```

**Prompt**: Create a Guard named "travel_complete_guard_v1" for time-lock verification.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "travel_complete_guard_v1",
      "tags": ["travel", "time-lock", "complete"],
      "replaceExistName": true
    },
    "description": "Time-lock guard for travel order completion. Requires current clock > progress.current_time + 1000ms.",
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
        "value": 1000,
        "name": "Time-lock duration in ms"
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
    "account": "travel_provider_v1",
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

### 3.3 Travel Cancel Guard

Creates a Guard that allows order cancellation. This Guard always passes (returns true), as cancellation is controlled by permission-based access.

**Prompt**: Create a Guard named "travel_cancel_guard_v1" for order cancellation.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "travel_cancel_guard_v1",
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
      "type": "node",
      "node": {
        "type": "identifier",
        "identifier": 0
      }
    }
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

---

## Step 4: Create Machine with Workflow

Create a Machine to define the travel service workflow with all nodes and forwards.

**Prompt**: Create a Machine named "travel_machine_v1" with the complete travel workflow.

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "travel_machine_v1",
      "permission": "travel_permission_v1",
      "replaceExistName": true
    },
    "description": "Iceland travel service workflow: (init) -> Buy Insurance -> SPA -> Ice Scooting -> Complete/Cancel",
    "node": {
      "op": "add",
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
                  "permissionIndex": 1000
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
                  "permissionIndex": 1000
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
                  "permissionIndex": 1000,
                  "guard": {
                    "guard": "travel_complete_guard_v1",
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
                  "permissionIndex": 1000,
                  "guard": {
                    "guard": "travel_cancel_guard_v1",
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
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

---

## Step 5: Create Travel Service

Create and publish the travel service.

> **Important**: The Service requires `order_allocators` to be set for publication. Service must be created in three steps:
> 1. Create Service (unpublished)
> 2. Configure order_allocators
> 3. Publish Service

### 5.1 Create Service (Unpublished)

**Prompt**: Create a Service named "travel_service_v1" (without publishing).

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "travel_service_v1",
      "permission": "travel_permission_v1",
      "replaceExistName": true
    },
    "description": "Iceland travel service: Blue Lagoon SPA + Glacier Ice Scooting.",
    "machine": "travel_machine_v1",
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
      "objects": ["travel_arbitration_v1"]
    },
    "publish": false
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

### 5.2 Configure Order Allocators

**Prompt**: Configure order_allocators for the Service (without publishing).

```json
{
  "operation_type": "service",
  "data": {
    "object": "travel_service_v1",
    "order_allocators": {
      "description": "Travel order revenue allocation",
      "threshold": 0,
      "allocators": [
        {
          "guard": "travel_complete_guard_v1",
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
    "publish": false
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

### 5.3 Publish Service

**Prompt**: Publish the Service to make it available for orders.

```json
{
  "operation_type": "service",
  "data": {
    "object": "travel_service_v1",
    "publish": true
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
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
| `allocators[].sharing` | array | Array of sharing rules |
| `allocators[].sharing[].who` | object | Recipient object: `{"Signer": "signer"}` for order signer |
| `allocators[].sharing[].sharing` | number | Amount in basis points (10000 = 100%) |
| `allocators[].sharing[].mode` | string | Allocation mode ("Rate" or "Amount") |
| `allocators[].fix` | string (optional) | Fixed amount to allocate ("0" = none) |
| `allocators[].max` | string \| null (optional) | Maximum amount (null = no limit) |

---

## Step 6: Create Allocation Guards (Optional but Recommended)

Create Guards for different revenue allocation scenarios. These Guards are used in `order_allocators` to determine fund distribution based on order progress state.

### 6.1 Merchant Victory Guard (100% to Service)

Checks if order progress current node is "Complete". If passed, merchant receives 100% of funds.

**Prompt**: Create Guard "merchant_victory_guard_v1".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "merchant_victory_guard_v1",
      "tags": ["merchant", "victory", "complete"],
      "replaceExistName": true
    },
    "description": "Guard for merchant victory: checks if order progress current node is Complete. If passed, merchant receives 100% of funds.",
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
        "value_type": "String",
        "value": "Complete",
        "name": "Complete node name"
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
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

### 6.2 No Ice Scooting Guard (80% Service, 20% Refund)

Checks if progress current is "Cancel" or "Ice Scooting". If passed, merchant gets 80%, user gets 20% refund.

**Prompt**: Create Guard "no_ice_scooting_guard_v1".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "no_ice_scooting_guard_v1",
      "tags": ["user", "cancel", "ice_scooting"],
      "replaceExistName": true
    },
    "description": "Guard for user not participating in ice scooting: checks if progress current is Cancel or Ice Scooting. If passed, merchant gets 80%, user gets 20% refund.",
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
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_or",
        "nodes": [
          {
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
          },
          {
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
                "identifier": 2
              }
            ]
          }
        ]
      }
    }
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

### 6.3 No SPA Guard (5% Service, 95% Refund)

Checks if progress current is "SPA". If passed, merchant gets 5%, user gets 95% refund.

**Prompt**: Create Guard "no_spa_guard_v1".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "no_spa_guard_v1",
      "tags": ["user", "cancel", "spa"],
      "replaceExistName": true
    },
    "description": "Guard for user not participating in SPA: checks if progress current is SPA. If passed, merchant gets 5%, user gets 95% refund.",
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
        "value_type": "String",
        "value": "SPA",
        "name": "SPA node name"
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
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

---

## Step 7: Progress Operations (Order Workflow)

After a customer places an order, the service provider operates the Progress to move through the workflow nodes.

### 7.1 Progress to Buy Insurance

Move from initial node ("") to "Buy Insurance" node.

**Prompt**: Operate progress to move to Buy Insurance node.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "alice_travel_progress_v1",
    "operate": {
      "operation": {
        "next_node_name": "Buy Insurance",
        "forward": "buy_insurance"
      }
    }
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

### 7.2 Progress to SPA

Move from "Buy Insurance" to "SPA" node.

**Prompt**: Operate progress to move to SPA node.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "alice_travel_progress_v1",
    "operate": {
      "operation": {
        "next_node_name": "SPA",
        "forward": "go_spa"
      }
    }
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

### 7.3 Progress to Ice Scooting

Move from "SPA" to "Ice Scooting" node.

**Prompt**: Operate progress to move to Ice Scooting node.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "alice_travel_progress_v1",
    "operate": {
      "operation": {
        "next_node_name": "Ice Scooting",
        "forward": "go_ice_scooting"
      }
    }
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

### 7.4 Complete Trip

Move from "Ice Scooting" to "Complete" node (requires time-lock guard).

**Prompt**: Operate progress to complete the trip.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "alice_travel_progress_v1",
    "operate": {
      "operation": {
        "next_node_name": "Complete",
        "forward": "complete_trip"
      }
    }
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

### 7.5 Cancel Trip

Move from "Ice Scooting" to "Cancel" node.

**Prompt**: Operate progress to cancel the trip.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "alice_travel_progress_v1",
    "operate": {
      "operation": {
        "next_node_name": "Cancel",
        "forward": "cancel_trip"
      }
    }
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

**Progress Operation Structure**:

| Field | Type | Description |
|-------|------|-------------|
| `object` | string | Progress object name/ID |
| `operate.operation.next_node_name` | string | Target node name to move to |
| `operate.operation.forward` | string | Forward name defined in Machine |

---

## Known Issues

None. All documented steps have been tested and verified to work correctly via MCP server.

---

## Best Practices

### 1. Machine Node Configuration

- Use `node.op: "add"` with `nodes` array (not `data`)
- Each forward must have either `permissionIndex` or `namedOperator`
- Guard references use object format: `{ guard: "guard_name", retained_submission: [] }`

### 2. Service Sales Format

Use object format with operation:
```json
{
  "op": "add",
  "sales": [
    {
      "name": "...",
      "price": "...",
      "stock": "...",
      "suspension": false,
      "wip": "",
      "wip_hash": ""
    }
  ]
}
```

### 3. Service Arbitrations Format

Use object format with operation:
```json
{
  "op": "add",
  "objects": ["arbitration_name"]
}
```

### 4. Repository Data Format

Use `data_add` with nested structure:
```json
{
  "name": "policy_name",
  "items": [
    {
      "data": [
        {"id": ..., "data": "..."}
      ]
    }
  ]
}
```

### 5. Guard Query Types

- For existence checks: use `"repository.data has"`
- For value retrieval: use `"repository.data"` (may have limitations)
- For progress time: use `"progress.current_time"` with `convert_witness: 100`

### 6. Progress Operations

- Use `operate.operation` structure with `next_node_name` and `forward` fields
- `object` field specifies the Progress name/ID
- `forward` must match the forward name defined in the Machine node
- Example structure:
```json
{
  "operation_type": "progress",
  "data": {
    "object": "progress_name",
    "operate": {
      "operation": {
        "next_node_name": "TargetNode",
        "forward": "forward_name"
      }
    }
  },
  "env": {...}
}
```
