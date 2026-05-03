# Iceland Travel Service Example

A complete example demonstrating how to create an Iceland travel service using WoWok protocol. This service integrates weather-dependent activities, insurance sub-orders, and multi-node workflow management.

> **View Actual Execution Results**: See [Travel_TestResults.md](Travel_TestResults.md) for real testnet execution results with actual object addresses and transaction outputs.

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

### Key Design Decisions

1. **Weather Data via Repository**: Weather conditions are stored in a Repository object with policy "Condition". Each day's weather is keyed by UTC timestamp (converted to Address via `convert_number_address`).
2. **Insurance as Sub-Order**: The "Buy Insurance" node creates a sub-order on the insurance service, linking the two workflows.
3. **Time-Lock via Witness Conversion**: The Complete node Guard uses `convert_witness: 100` (TypeOrderProgress) to access Progress data from the submitted Order.
4. **Dynamic Time Calculation**: Weather data timestamps are calculated dynamically based on current time, ensuring the example is always testable.

---

## Overview

This example demonstrates:

- **Travel Service Setup**: Permission, Arbitration, Guards, Machine, and Service creation
- **Weather Data Management**: Repository with weather conditions for activity validation
- **Insurance Integration**: Supply chain sub-order for insurance purchase
- **Multi-Node Workflow**: Complex workflow with weather-dependent paths
- **Time-Lock Guards**: Using Order + convert_witness for Progress data access

---

## Architecture

### System Components

```
+--------------------------------------------------------------------------+
|                        Iceland Travel Service System                      |
+--------------------------------------------------------------------------+
|                                                                          |
|  +--------------+  +--------------+  +--------------+  +--------------+  |
|  |  Permission  |  |  Arbitration |  |   Guards     |  |  Repository  |  |
|  |  (travel_    |  |  (travel_    |  |  (weather_   |  |  (weather_   |  |
|  |   permission)|  |   arbitration)|  |   check,     |  |   repo)      |  |
|  +------+-------+  +------+-------+  |   complete,  |  +------+-------+  |
|         |                |           |   cancel)    |         |          |
|         v                v           +------+-------+         |          |
|  +--------------+  +--------------+         |                 |          |
|  |   Machine    |  |   Service    |         |                 |          |
|  |  (travel_    |<-|  (travel_    |         |                 |          |
|  |   machine)   |  |   service)   |         |                 |          |
|  +--------------+  +--------------+         |                 |          |
|                                              |                 |          |
|  Workflow:                                   |                 |          |
|  Start -> Buy Insurance -> SPA -> Ice Scooting |                 |          |
|                                    |         |                 |          |
|                         +----------+---------+----------+      |          |
|                         |                               |      |          |
|                         v                               v      |          |
|                    +----------+                   +----------+ |          |
|                    | Complete |                   |  Cancel  | |          |
|                    |(TimeLock)|                   |          | |          |
|                    +----------+                   +----------+ |          |
|                                                                          |
+--------------------------------------------------------------------------+
```

### Workflow Diagram

```
                              +-------------+
                              |    Start    |
                              +------+------+
                                     |
                                     v
                              +-------------+
                              |Buy Insurance| ---> Creates sub-order on insurance service
                              +------+------+
                                     |
                                     v
                              +-------------+
                              |     SPA     |
                              +------+------+
                                     |
                                     v
                              +-------------+
                              |Ice Scooting | ---> Weather check Guard (sunny required)
                              +------+------+
                                     |
                         +-----------+-----------+
                         |                       |
                         v                       v
                  +-------------+         +-------------+
                  |  Complete   |         |   Cancel    |
                  | (Time-Lock) |         |             |
                  +-------------+         +-------------+
```

---

## Prerequisites

Before running this example, ensure you have:

1. An account named `travel_provider_v1` with sufficient WOW tokens
2. An account named `weather_provider_v1` with sufficient WOW tokens
3. An account named `alice_v1` (test customer) with sufficient WOW tokens
4. The Insurance service from [Insurance/Insurance.md](../Insurance/Insurance.md) already deployed
5. Access to the WoWok MCP server

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

Use the following JavaScript to calculate recent 5-day UTC timestamps:

```js
const DAY_MS = 86400000;
const now = Date.now();
const todayStart = Math.floor(now / DAY_MS) * DAY_MS;
// Recent 5 days UTC day start timestamps (from 4 days ago to today)
for (let i = 4; i >= 0; i--) {
  const ts = todayStart - i * DAY_MS;
  console.log(`Day ${5-i}: ${ts} (${new Date(ts).toISOString()})`);
}
```

### 0.2 Create Weather Permission

First, create a Permission object for the weather repository.

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

Create the weather repository with the "Condition" policy included during creation (this avoids the need to add policies later, which had issues in testing).

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

**Prompt**: Add weather data to "weather_repo_v2" with policy "Condition". Use the timestamps calculated in step 0.1.

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
            {"id": 1777334400000, "data": "sunny"},
            {"id": 1777420800000, "data": "sunny"},
            {"id": 1777507200000, "data": "sunny"},
            {"id": 1777593600000, "data": "sunny"},
            {"id": 1777680000000, "data": "rainy"}
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

> **Note**: Replace the timestamps with actual values from step 0.1. The last day is "rainy" to demonstrate weather-dependent activity rejection.

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
      "replaceExistName": true
    },
    "description": "Permission for Iceland travel service",
    "table": {
      "op": "add perm by entity",
      "entity": {"name_or_address": "travel_provider_v1"},
      "index": [1000, 1001, 1002, 1003, 1004, 1005]
    }
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

> **Note**: This guard demonstrates how to query repository data using a timestamp converted to an address. You can test it using `gen_passport` with a timestamp from step 0.1.

**Prompt**: Create a Guard named "weather_check_guard_v1" for weather condition verification.

Creates a Guard that verifies weather conditions for a given date. Queries the weather Repository for the specified date and checks if the condition matches the expected value.

**Guard Logic**:
```
repository.data("Condition", convert_number_address(activity_date)) == expected_weather
```

**Prompt**: Create a Guard named "weather_check_guard" for weather condition verification.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "weather_check_guard_v1",
      "tags": ["weather", "check", "travel"],
      "replaceExistName": true
    },
    "description": "Weather check guard for ice scooting activity. Queries weather Repository for the activity date and verifies the condition is 'sunny'. The activity date is submitted at runtime.",
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
      },
      {
        "identifier": 3,
        "b_submission": false,
        "value_type": "String",
        "value": "sunny",
        "name": "Expected weather condition"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_equal",
        "nodes": [
          {
            "type": "query",
            "query": "repository.data",
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
          },
          {
            "type": "identifier",
            "identifier": 3
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

> **Note**: We use the repository name "weather_repo_v2" directly (the MCP server resolves names to addresses automatically). If you need the raw address, you can query it using `onchain_objects` with the name.

**Guard Table**:

| identifier | b_submission | value_type | value | Purpose |
|------------|-------------|-----------|-------|---------|
| 0 | false | Address | weather_repo address | Weather Repository to query |
| 1 | false | String | "Condition" | Repository policy name |
| 2 | **true** | U64 | 0 (placeholder) | Activity date timestamp, submitted at runtime |
| 3 | false | String | "sunny" | Expected weather condition |

### 3.2 Travel Complete Guard (Time-Lock)

Creates a Guard that verifies the time-lock condition for order completion.

**Guard Logic**:
```
clock > progress.current_time + 1000
(progress accessed via Order + convert_witness=TypeOrderProgress)
```

**Prompt**: Create a Guard named "travel_complete_guard" for time-lock verification.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "travel_complete_guard_v1",
      "tags": ["travel", "time-lock", "complete"],
      "replaceExistName": true
    },
    "description": "Time-lock guard for travel order completion. Requires current clock > progress.current_time + 1000ms (1 second for TESTING; in production set to reasonable duration like 8 hours). Progress is accessed via Order with convert_witness=TypeOrderProgress(100).",
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

**Prompt**: Create a Guard named "travel_cancel_guard" for order cancellation.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "travel_cancel_guard_v1",
      "tags": ["travel", "cancel"],
      "replaceExistName": true
    },
    "description": "Cancel guard for travel orders. Always passes - cancellation is controlled by permission-based access (only authorized operators can execute the cancel forward).",
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

**Prompt**: Create a Machine named "travel_machine" with the complete travel workflow.

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "travel_machine_v1",
      "permission": "travel_permission_v1",
      "replaceExistName": true
    },
    "description": "Iceland travel service workflow: Start -> Buy Insurance -> SPA -> Ice Scooting -> Complete/Cancel",
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
                  "name": "buy_insurance",
                  "permissionIndex": 1000,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "Buy Insurance",
          "pairs": [
            {
              "prev_node": "Start",
              "threshold": 1,
              "forwards": [
                {
                  "name": "go_ice_scooting",
                  "permissionIndex": 1001,
                  "weight": 1
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
                  "name": "go_ice_scooting",
                  "permissionIndex": 1002,
                  "weight": 1
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
                  "name": "complete_trip",
                  "permissionIndex": 1003,
                  "weight": 1,
                  "guard": {
                    "guard": "travel_complete_guard_v1"
                  }
                },
                {
                  "name": "cancel_trip",
                  "permissionIndex": 1004,
                  "weight": 1,
                  "guard": {
                    "guard": "travel_cancel_guard_v1"
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
              "forwards": []
            }
          ]
        },
        {
          "name": "Cancel",
          "pairs": [
            {
              "prev_node": "Ice Scooting",
              "threshold": 1,
              "forwards": []
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

**Workflow Nodes**:

| Node | Forward | Guard | PermissionIndex | Description |
|------|---------|-------|-----------------|-------------|
| Start | buy_insurance -> Buy Insurance | - | 1000 | Enter Start node from initial state |
| Buy Insurance | go_ice_scooting -> SPA | - | 1001 | Proceed to SPA |
| SPA | go_ice_scooting -> Ice Scooting | - | 1002 | Proceed to ice scooting |
| Ice Scooting | complete_trip -> Complete | travel_complete_guard_v1 | 1003 | Complete trip (time-lock) |
| Ice Scooting | cancel_trip -> Cancel | travel_cancel_guard_v1 | 1004 | Cancel trip |
| Complete | (endpoint) | - | - | Final state |
| Cancel | (endpoint) | - | - | Cancelled state |

---

## Step 5: Create and Publish Service

Create the travel service with Machine, Arbitration, sales, and order_allocators, then publish in a single transaction.

**Prompt**: Create and publish "travel_service" with all bindings and sales.

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "travel_service_v1",
      "type_parameter": "0x2::wow::WOW",
      "permission": "travel_permission_v1",
      "replaceExistName": true
    },
    "description": "Iceland travel service: Blue Lagoon SPA + Glacier Ice Scooting. Includes outdoor accident insurance.",
    "machine": "travel_machine_v1",
    "arbitrations": {
      "op": "add",
      "objects": ["travel_arbitration_v1"]
    },
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "Iceland Travel Package",
          "price": 500000000,
          "stock": 100,
          "suspension": false,
          "wip": "",
          "wip_hash": ""
        }
      ]
    },
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
    "publish": true
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

> **Note**: The `order_allocators` field is required for publishing a Service. It defines how order revenue is allocated. In this example, we use a simple allocator with the travel_complete_guard.

---

## Step 6: Unpause Service

Unpause the service to allow order creation.

**Prompt**: Unpause "travel_service".

```json
{
  "operation_type": "service",
  "data": {
    "object": "travel_service",
    "pause": false
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

---

## Step 7: Verify Service Configuration

Query the service to verify all configurations are correct.

**Prompt**: Query "travel_service" to verify configuration.

```json
{
  "operation_type": "query_toolkit",
  "data": {
    "query_type": "onchain_objects",
    "objects": ["travel_service"],
    "no_cache": true
  },
  "env": {
    "network": "testnet"
  }
}
```

---

## Step 8: Test Order Creation and Progress

### 8.1 Create Travel Order (as Customer Alice)

Create an order on the travel service as the test customer.

**Prompt**: Create an order on "travel_service" using account "alice".

```json
{
  "operation_type": "service",
  "data": {
    "object": "travel_service",
    "order_new": {
      "buy": {
        "items": [
          {
            "name": "Iceland Travel Package",
            "stock": 1,
            "wip_hash": ""
          }
        ],
        "total_pay": {
          "balance": 500000000
        }
      },
      "namedNewOrder": {
        "name": "test_travel_order_v1",
        "replaceExistName": true
      }
    }
  },
  "env": {
    "account": "alice_v1",
    "network": "testnet"
  }
}
```

> **Note**: This creates an Order, Progress, and Allocation. Save the returned object IDs for the next steps.

### 8.2 Advance Progress: Initial -> Start

First, advance the progress from initial state to Start node.

**Prompt**: Advance progress to Start node.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "<travel_progress_id>",
    "operate": {
      "operation": {
        "next_node_name": "Start",
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

### 8.3 Advance Progress: Start -> Buy Insurance

**Prompt**: Advance progress from Start to Buy Insurance.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "<travel_progress_id>",
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

### 8.4 Advance Progress: Buy Insurance -> SPA

**Prompt**: Advance progress from Buy Insurance to SPA.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "<travel_progress_id>",
    "operate": {
      "operation": {
        "next_node_name": "SPA",
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

### 8.5 Advance Progress: SPA -> Ice Scooting

**Prompt**: Advance progress from SPA to Ice Scooting.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "<travel_progress_id>",
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

### 8.6 Advance Progress: Ice Scooting -> Complete (Time-Lock)

Wait at least 1 second after the last progress update, then advance to Complete with the Order ID as submission.

**Prompt**: Advance progress to Complete, submitting the Order ID. Wait 1 second before executing.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "<travel_progress_id>",
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
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "travel_complete_guard_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "travel_complete_guard_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "<travel_order_id>"
          }
        ]
      }
    ]
  }
}
```

> **Note**: Replace `<travel_progress_id>` and `<travel_order_id>` with actual values from step 8.1.

---

## Step 9: Test Weather Check Guard (Optional)

Test the weather check Guard independently to verify weather data is correctly stored.

**Prompt**: Test "weather_check_guard" with a sunny day timestamp.

```json
{
  "operation_type": "gen_passport",
  "data": {
    "guard": "weather_check_guard",
    "info": {
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
              "value": 1745884800000
            }
          ]
        }
      ]
    }
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

> **Note**: Replace the timestamp with one of the sunny day timestamps from step 0.1 (DAY1-DAY4). This should pass.

Test with a rainy day to verify rejection:

**Prompt**: Test "weather_check_guard" with a rainy day timestamp.

```json
{
  "operation_type": "gen_passport",
  "data": {
    "guard": "weather_check_guard",
    "info": {
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
              "value": 1746230400000
            }
          ]
        }
      ]
    }
  },
  "env": {
    "account": "travel_provider_v1",
    "network": "testnet"
  }
}
```

> **Note**: Replace the timestamp with the rainy day timestamp (DAY5). This should fail because the weather is "rainy", not "sunny".

---

## Execution Checklist

- [ ] Create `travel_provider`, `weather_provider`, `alice` accounts
- [ ] Get test tokens for all accounts
- [ ] Step 0.1: Calculate weather timestamps
- [ ] Step 0.2: Create `weather_repo` Repository
- [ ] Step 0.3: Add "Condition" policy to repository
- [ ] Step 0.4: Add weather data (5 days)
- [ ] Step 1: Create `travel_permission`
- [ ] Step 2: Create `travel_arbitration`
- [ ] Step 3.1: Create `weather_check_guard` (update weather_repo address)
- [ ] Step 3.2: Create `travel_complete_guard`
- [ ] Step 3.3: Create `travel_cancel_guard`
- [ ] Step 4: Create `travel_machine` (with nodes including Complete/Cancel, published)
- [ ] Step 5: Create and publish `travel_service` (with machine, arbitration, sales, order_allocators)
- [ ] Step 6: Unpause Service
- [ ] Step 7: Verify Service configuration
- [ ] Step 8.1: Create test travel order (as alice)
- [ ] Step 8.2: Advance Initial -> Start
- [ ] Step 8.3: Advance Start -> Buy Insurance
- [ ] Step 8.4: Advance Buy Insurance -> SPA
- [ ] Step 8.5: Advance SPA -> Ice Scooting
- [ ] Step 8.6: Wait 1s, advance Ice Scooting -> Complete
- [ ] Step 9: Test weather check Guard (sunny passes, rainy fails)

---

## Best Practices

### 1. Machine Node Configuration

Ensure at least one node has a pair with `prev_node: ""` (empty string). This defines the entry point from the initial state where Progress starts with `current: ""`.

### 2. Service Publish Requires order_allocators

Always include the `order_allocators` field when publishing a Service. This defines how order revenue is distributed.

### 3. Progress Operation Format

Use the `operate` field with `operation` object containing `next_node_name` and `forward`, not the `task` field.

### 4. Repository Data Policy

When creating a Repository, include policies in the initial `policies` field instead of adding them later (this avoids "Invalid policy name" errors).

### 5. Submission Format

Ensure submission items include `b_submission: true` for values submitted at runtime during progress advancement.

---

## See Also

- [Insurance Example](../Insurance/Insurance.md) - The insurance service used as sub-order
- [WOWOK Documentation](../../skills/WOWOK.md) - Core WoWok protocol documentation
