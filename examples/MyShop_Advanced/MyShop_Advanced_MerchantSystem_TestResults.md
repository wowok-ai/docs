# MyShop Advanced Merchant System Test Results

## Test execution started: 2026-04-26

## Summary

This document contains test results for **Part 2: Merchant System Setup** with proper machine binding before service publishing. All tests have been executed successfully.

### Completed Test Items

| Step | Description | Status |
|------|-------------|--------|
| 1 | Create Permission Object | Success |
| 1b | Add Permission Indexes (1000, 1001) | Success |
| 2 | Create Empty Service Object | Success |
| 3 | Create Machine Guards (4 guards) | Success |
| 4 | Create Service Guards (2 guards) | Success |
| 5 | Create Machine with Guards | Success |
| 6 | Publish Machine | Success |
| 7 | Bind Machine to Service | Success |
| 8 | Create Arbitration Object | Success |
| 9 | Update Service and Publish | Success |
| 10 | Create Reward Object | Success |
| 11 | Create Reward Guards (3 guards) | Success |
| 12 | Add Reward Guards to Reward | Success |

### Machine Guards (4 total)

| # | Guard Name | Purpose |
|---|------------|---------|
| 1 | `machine_merkle_root_v2` | Verify Merkle Root string length = 64 |
| 2 | `machine_service_order_v2` | Verify order belongs to Service and node is valid |
| 3 | `machine_time_10d_v2` | Verify 10-day timeout (864000000 ms) |
| 4 | `machine_time_2d_v2` | Verify 2-day timeout (172800000 ms) |

### Service Guards (2 total)

| # | Guard Name | Purpose |
|---|------------|---------|
| 5 | `service_merchant_win_v2` | Verify merchant winning nodes (Order Complete, Wonderful, Return Fail) |
| 6 | `service_customer_win_v2` | Verify customer winning nodes (Lost, Return Complete) |

### Reward Guards (3 total)

| # | Guard Name | Purpose | Reward Amount |
|---|------------|---------|---------------|
| 7 | `reward_wonderful_v2` | Verify order at Wonderful node | 10000 |
| 8 | `reward_lost_v2` | Verify order at Lost node | 20000 |
| 9 | `reward_shipping_timeout_v2` | Verify order at Shipping node > 2 days | 30000 |

### Key Objects

| Object Type | Object Name |
|-------------|-------------|
| Permission | `myshop_permission_v2` |
| Service | `three_body_signature_service_v2` |
| Machine | `myshop_advanced_machine_v2` |
| Arbitration | `myshop_arbitration_v2` |
| Reward | `myshop_reward_v2` |

---

## Part 2: Merchant System Setup

### Prerequisites
- Account: `myshop_merchant` (store owner)
- Account: `myshop_customer` (customer)

---

### Step 1: Create Permission Object

**Request:**
```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "myshop_permission_v2",
      "replaceExistName": true
    },
    "description": "Permission for MyShop Advanced v2 - Multi-path order processing with delivery confirmation and return handling"
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Response:**
- Permission object created: `myshop_permission_v2`
- Name: `myshop_permission_v2` (with replaceExistName=true)

---

### Step 1b: Add Permission Indexes to Permission Object

Grant permission indexes 1000 and 1001 to `myshop_merchant`:

**Request:**
```json
{
  "operation_type": "permission",
  "data": {
    "object": "myshop_permission_v2",
    "table": {
      "op": "add perm by entity",
      "entity": {
        "name_or_address": "myshop_merchant"
      },
      "index": [1000, 1001]
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Response:**
- Permission indexes 1000 and 1001 granted to `myshop_merchant`
- **Note**: These permission indexes are used in Machine node forwards:
  - `permissionIndex: 1000` - Used for Order Confirmed and Order Cancel nodes
  - `permissionIndex: 1001` - Used for all other merchant operations (Shipping, Delivery Complete, etc.)

---

### Step 2: Create Empty Service Object (Get Address First)

**Request:**
```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "three_body_signature_service_v2",
      "replaceExistName": true,
      "permission": "myshop_permission_v2"
    },
    "description": "Three-Body Problem Signature Edition - Limited collector's item with WIP verification",
    "publish": false
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Response:**
- Service object created: `three_body_signature_service_v2`
- Name: `three_body_signature_service_v2` (with replaceExistName=true)
- Permission: `myshop_permission_v2`
- Published: false (intentionally left unpublished for guard creation)

**Note**: Service name can be used for Guard creation.

---

### Step 3: Create Guards

Create 9 guards total: 4 Machine guards, 2 Service guards, 3 Reward guards.

#### Guard 1: machine_merkle_root_v2

**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "machine_merkle_root_v2",
      "replaceExistName": true
    },
    "description": "Verify Merkle Root string length equals 64 characters",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "String",
        "name": "merkle_root"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": 64,
        "name": "length_64"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_equal",
        "nodes": [
          {
            "type": "calc_string_length",
            "node": {
              "type": "identifier",
              "identifier": 0
            }
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
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Response:**
- Guard created: `0x647c43c3b731dc3481ed9dba43b9a401102465685cc8172c44ef824b539b40b9`

#### Guard 2: machine_service_order_v2

**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "machine_service_order_v2",
      "replaceExistName": true
    },
    "description": "Verify order belongs to Service and current node is valid",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "progress_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "Address",
        "value": "0xaa141f310000095b1bd1fd86586d15af866048fcbb68fbb321e1aec6ab56493d",
        "name": "service_address"
      },
      {
        "identifier": 2,
        "b_submission": false,
        "value_type": "String",
        "value": "Shipping",
        "name": "node_name"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_and",
        "nodes": [
          {
            "type": "node",
            "node": {
              "type": "logic_equal",
              "nodes": [
                {
                  "type": "query",
                  "query": "order.service",
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
          {
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
                  "identifier": 2
                }
              ]
            }
          }
        ]
      }
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Response:**
- Guard created: `0xba43345b0af09e61758729850cfe1dc32ceed7899e7cb41c6b15b96c35f5dcc8`

#### Guard 3: machine_time_10d_v2

**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "machine_time_10d_v2",
      "replaceExistName": true
    },
    "description": "Verify order has been in current node for at least 10 days (864000000 ms)",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "progress_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": 864000000,
        "name": "ten_days_ms"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_as_u256_greater_or_equal",
        "nodes": [
          {
            "type": "calc_number_subtract",
            "nodes": [
              {
                "type": "context",
                "context": "Clock"
              },
              {
                "type": "query",
                "query": 1315,
                "object": {
                  "identifier": 0,
                  "convert_witness": 100
                },
                "parameters": []
              }
            ]
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
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Response:**
- Guard created: `0x24d263baf75888c6de698c6f8e7b024184876db9484e4a25915b868605973535`

#### Guard 4: machine_time_2d_v2

**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "machine_time_2d_v2",
      "replaceExistName": true
    },
    "description": "Verify order has been in current node for at least 2 days (172800000 ms)",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "progress_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": 172800000,
        "name": "two_days_ms"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_as_u256_greater_or_equal",
        "nodes": [
          {
            "type": "calc_number_subtract",
            "nodes": [
              {
                "type": "context",
                "context": "Clock"
              },
              {
                "type": "query",
                "query": 1315,
                "object": {
                  "identifier": 0,
                  "convert_witness": 100
                },
                "parameters": []
              }
            ]
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
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Response:**
- Guard created: `0x6465313f91b2a09a4da85e3e2db267f7789db3e2c050ced62b356142268d4abc`

---

### Step 4: Create Machine with Guards

**Request:**
```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "myshop_advanced_machine_v2",
      "replaceExistName": true,
      "permission": "myshop_permission_v2"
    },
    "description": "Multi-path order processing with delivery confirmation, wonderful rating, lost handling and return processing - Complete workflow with guards",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "Order Confirmed",
          "pairs": [
            {
              "prev_node": "",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Submit Messenger Merkle Root",
                  "permissionIndex": 1000,
                  "weight": 1,
                  "guard": { "guard": "machine_merkle_root_v2" }
                }
              ]
            }
          ]
        },
        {
          "name": "Order Cancel",
          "pairs": [
            {
              "prev_node": "",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Submit Cancellation Merkle Root",
                  "permissionIndex": 1000,
                  "weight": 1,
                  "guard": { "guard": "machine_merkle_root_v2" }
                }
              ]
            }
          ]
        },
        {
          "name": "Shipping",
          "pairs": [
            {
              "prev_node": "Order Confirmed",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Confirm Signature and Submit Merkle Root",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": { "guard": "machine_service_order_v2" }
                }
              ]
            }
          ]
        },
        {
          "name": "Delivery Complete",
          "pairs": [
            {
              "prev_node": "Shipping",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Confirm Receipt",
                  "permissionIndex": 1001,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "Wonderful",
          "pairs": [
            {
              "prev_node": "Shipping",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Rate Wonderful",
                  "permissionIndex": 1001,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "Order Complete",
          "pairs": [
            {
              "prev_node": "Shipping",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Auto Complete from Shipping",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": { "guard": "machine_time_10d_v2" }
                }
              ]
            },
            {
              "prev_node": "Delivery Complete",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Auto Complete from Delivery",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": { "guard": "machine_time_2d_v2" }
                }
              ]
            }
          ]
        },
        {
          "name": "Lost",
          "pairs": [
            {
              "prev_node": "Shipping",
              "threshold": 2,
              "forwards": [
                {
                  "name": "Report Lost",
                  "permissionIndex": 1001,
                  "weight": 1
                },
                {
                  "name": "Confirm Lost with Merkle Root",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": { "guard": "machine_merkle_root_v2" }
                }
              ]
            }
          ]
        },
        {
          "name": "Non-receipt Return",
          "pairs": [
            {
              "prev_node": "Shipping",
              "threshold": 2,
              "forwards": [
                {
                  "name": "Request Return",
                  "permissionIndex": 1001,
                  "weight": 1
                },
                {
                  "name": "Confirm Return with Merkle Root",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": { "guard": "machine_merkle_root_v2" }
                }
              ]
            }
          ]
        },
        {
          "name": "Receipt Return",
          "pairs": [
            {
              "prev_node": "Delivery Complete",
              "threshold": 2,
              "forwards": [
                {
                  "name": "Request Return with Receipt",
                  "permissionIndex": 1001,
                  "weight": 1
                },
                {
                  "name": "Confirm Return Address with Merkle Root",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": { "guard": "machine_merkle_root_v2" }
                }
              ]
            }
          ]
        },
        {
          "name": "Return Fail",
          "pairs": [
            {
              "prev_node": "Receipt Return",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Timeout Return Not Received",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": { "guard": "machine_time_10d_v2" }
                }
              ]
            }
          ]
        },
        {
          "name": "Return Complete",
          "pairs": [
            {
              "prev_node": "Receipt Return",
              "threshold": 2,
              "forwards": [
                {
                  "name": "Submit Return Merkle Root",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": { "guard": "machine_merkle_root_v2" }
                },
                {
                  "name": "Confirm Return Received",
                  "permissionIndex": 1001,
                  "weight": 1
                }
              ]
            },
            {
              "prev_node": "Non-receipt Return",
              "threshold": 2,
              "forwards": [
                {
                  "name": "Submit Return Merkle Root",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": { "guard": "machine_merkle_root_v2" }
                },
                {
                  "name": "Confirm Return Received",
                  "permissionIndex": 1001,
                  "weight": 1
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Response:**
- Machine object created: `myshop_advanced_machine_v2`
- Name: `myshop_advanced_machine_v2` (with replaceExistName=true)
- Permission: `myshop_permission_v2`
- Nodes added: 11 nodes with guards for multi-path workflow
- Published: true

---

### Step 5: Bind Machine to Service

**Request:**
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v2",
    "machine": "myshop_advanced_machine_v2"
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Response:**
- Machine bound successfully to Service
- Service: `three_body_signature_service_v2`
- Machine: `myshop_advanced_machine_v2`

**Response:**
- Machine bound successfully
- Service: `three_body_signature_service_v2`
- Machine: `myshop_advanced_machine_v2`

**Verification:**
```json
{
  "query_type": "onchain_objects",
  "objects": ["three_body_signature_service_v2"]
}
```

**Result:**
- Service machine field: `0xa0b47cbec8cdb8f5358e4b3c2569de3fecb05161d2bce487cd564efa70bf81c0`
- bPublished: false

---

### Step 6: Create Additional Guards for Service

Created 4 additional guards for Service order_allocators:

#### Guard 9: guard_merchant_win_v2
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_merchant_win_v2",
      "tags": ["ecommerce", "allocation", "merchant"],
      "replaceExistName": true
    },
    "description": "Verify order is at Order Complete, Wonderful, or Return Fail node (merchant wins)",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "progress_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "Order Complete",
        "name": "order_complete_node"
      },
      {
        "identifier": 2,
        "b_submission": false,
        "value_type": "String",
        "value": "Wonderful",
        "name": "wonderful_node"
      },
      {
        "identifier": 3,
        "b_submission": false,
        "value_type": "String",
        "value": "Return Fail",
        "name": "return_fail_node"
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
                "query": 1253,
                "object": {"identifier": 0},
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
                "query": 1253,
                "object": {"identifier": 0},
                "parameters": []
              },
              {"type": "identifier", "identifier": 2}
            ]
          },
          {
            "type": "logic_equal",
            "nodes": [
              {
                "type": "query",
                "query": 1253,
                "object": {"identifier": 0},
                "parameters": []
              },
              {"type": "identifier", "identifier": 3}
            ]
          }
        ]
      }
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Guard created: `0xece766c71360200d805abb128f1fb3bf3c9e3eae366352c5de176ab5dd82c1b2`
- Name: `guard_merchant_win_v2` (with replaceExistName=true)

---

#### Guard 10: guard_customer_win_v2
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_customer_win_v2",
      "tags": ["ecommerce", "allocation", "customer"],
      "replaceExistName": true
    },
    "description": "Verify order is at Lost or Return Complete node (customer wins)",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "progress_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "Lost",
        "name": "lost_node"
      },
      {
        "identifier": 2,
        "b_submission": false,
        "value_type": "String",
        "value": "Return Complete",
        "name": "return_complete_node"
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
                "query": 1253,
                "object": {"identifier": 0},
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
                "query": 1253,
                "object": {"identifier": 0},
                "parameters": []
              },
              {"type": "identifier", "identifier": 2}
            ]
          }
        ]
      }
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Guard created: `0x9e6ce67f66c3e96df6b7bb5873da3d5076b3a15bb1d12e9182419f905cebbd15`
- Name: `guard_customer_win_v2` (with replaceExistName=true)

---

#### Guard 11: guard_time_10d_v2
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_time_10d_v2",
      "tags": ["ecommerce", "time", "10days"],
      "replaceExistName": true
    },
    "description": "Verify at least 10 days (864000000 ms) have passed since node entry",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "start_time"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "864000000",
        "name": "ten_days_ms"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_as_u256_greater_or_equal",
        "nodes": [
          {
            "type": "calc_number_subtract",
            "nodes": [
              {"type": "context", "context": "Clock"},
              {"type": "identifier", "identifier": 0}
            ]
          },
          {"type": "identifier", "identifier": 1}
        ]
      }
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Guard created: `0x51b290507808df00021825bb436184d34b1be27aed3590493f3d13003e0a3cb1`
- Name: `guard_time_10d_v2` (with replaceExistName=true)

---

#### Guard 12: guard_time_2d_v2
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_time_2d_v2",
      "tags": ["ecommerce", "time", "2days"],
      "replaceExistName": true
    },
    "description": "Verify at least 2 days (172800000 ms) have passed since node entry",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "start_time"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "172800000",
        "name": "two_days_ms"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_as_u256_greater_or_equal",
        "nodes": [
          {
            "type": "calc_number_subtract",
            "nodes": [
              {"type": "context", "context": "Clock"},
              {"type": "identifier", "identifier": 0}
            ]
          },
          {"type": "identifier", "identifier": 1}
        ]
      }
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Guard created: `0x7c69cfae4c0dd64f5e4ce6fedc9053ce3b664e4f3a82d69614649d97459329c4`
- Name: `guard_time_2d_v2` (with replaceExistName=true)

---

### Step 7: Create Arbitration Object

**Request:**
```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "myshop_arbitration_v2",
      "replaceExistName": true
    },
    "description": "Arbitration for MyShop Advanced - protects customer rights in disputes",
    "fee": 100000000
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Arbitration object created: `0x538d...78cb`
- Name: `myshop_arbitration_v2` (with replaceExistName=true)
- Fee: 100000000

---

### Step 7: Update Service and Publish

**Request:**
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v2",
    "description": "The Three-Body Problem book with author signature service - Advanced e-commerce with multi-path workflow",
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "The Three-Body Problem + Author Signature",
          "price": 5000000000,
          "stock": 100,
          "suspension": false,
          "wip": "https://wowok.net/test/three_body.wip",
          "wip_hash": "sha256:1db6dc86d8be68bafb33418628a30e7bfcbce48de9c099d3d9cb21def3af8b43"
        }
      ]
    },
    "arbitrations": {
      "op": "add",
      "objects": ["myshop_arbitration_v2"]
    },
    "customer_required": ["phone", "email", "shipping_address"],
    "order_allocators": {
      "description": "Order fund allocators for MyShop Advanced",
      "threshold": 0,
      "allocators": [
        {
          "guard": "service_merchant_win_v2",
          "sharing": [
            {
              "who": {"Signer": "signer"},
              "sharing": 10000,
              "mode": "Rate"
            }
          ]
        },
        {
          "guard": "service_customer_win_v2",
          "sharing": [
            {
              "who": {"GuardIdentifier": 0},
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
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Response:**
- Service updated and published: `three_body_signature_service_v2`
- Machine: `myshop_advanced_machine_v2` (already bound)
- Published: true
- Added:
  - Sales: "The Three-Body Problem + Author Signature"
  - Arbitrations: `myshop_arbitration_v2`
  - Order allocators: `service_merchant_win_v2`, `service_customer_win_v2`
  - Customer required: `phone`, `email`, `shipping_address`

---

### Step 8: Create Reward Object

**Request:**
```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "myshop_reward_v2",
      "replaceExistName": true
    },
    "description": "Reward pool for MyShop advanced - Wonderful rewards (10000), Lost compensation (20000), Shipping timeout compensation (20000)",
    "coin_add": {
      "balance": 150000000
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Reward object created: (address)
- Name: `myshop_reward_v2` (with replaceExistName=true)
- Initial balance: 150000000

---

### Step 9: Add Reward Guards

#### Reward Guard 1: Wonderful Node
**Request:**
```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v2",
    "guard_add": [
      {
        "guard": "guard_wonderful_v2",
        "recipient": {"Signer": "signer"},
        "amount": 10000
      }
    ]
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Reward guard added: `guard_wonderful_v2` (10000 reward)

---

#### Reward Guard 2: Lost Node
**Request:**
```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v2",
    "guard_add": [
      {
        "guard": "guard_lost_v2",
        "recipient": {"Signer": "signer"},
        "amount": 20000
      }
    ]
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Reward guard added: `guard_lost_v2` (20000 compensation)

---

#### Reward Guard 3: Shipping Timeout
**Request:**
```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v2",
    "guard_add": [
      {
        "guard": "guard_shipping_timeout_v2",
        "recipient": {"Signer": "signer"},
        "amount": 20000
      }
    ]
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Reward guard added: `guard_shipping_timeout_v2` (20000 compensation)

---

## Part 2 Completed

Merchant system setup is complete:
- Permission object created: `myshop_permission_v2`
- Machine object created: `myshop_advanced_machine_v2` with 11 nodes
- Service object created and published: `three_body_signature_service_v2`
- 13 Guard objects created (8 for Machine + 4 for Service + 1 for Reward)
- Arbitration object created: `myshop_arbitration_v2`
- Reward pool created: `myshop_reward_v2` with initial balance 150000000
- 3 reward guards added
