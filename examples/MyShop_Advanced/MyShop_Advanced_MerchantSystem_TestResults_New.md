# MyShop Advanced Merchant System Test Results (New)

## Test execution started: 2026-06-09

## Summary

This document contains test results for **Part 2: Merchant System Setup** with proper machine binding before service publishing. All tests use `replaceExistName: true` to ensure names are replaced if they already exist.

### Completed Test Items

| Step | Description | Status |
|------|-------------|--------|
| 1 | Create Permission Object | Ready |
| 1b | Add Permission Indexes (1000, 1001) | Ready |
| 2 | Create Empty Service Object | Ready |
| 3 | Create Machine Guards (4 guards) | Ready |
| 4 | Create Service Guards (2 guards) | Ready |
| 5 | Create Machine with Guards | Ready |
| 6 | Bind Machine to Service | Ready |
| 7 | Create Arbitration Object | Ready |
| 8 | Update Service and Publish | Ready |
| 9 | Create Reward Object | Ready |
| 10 | Create Reward Guards (3 guards) | Ready |
| 11 | Add Reward Guards to Reward | Ready |

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

**Note**: These permission indexes are used in Machine node forwards:
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

**Note**: Service name can be used for Guard creation.

---

### Step 3: Create Machine Guards

Create 4 Machine guards for verification.

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
        "name": "order_id"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "Address",
        "value": "three_body_signature_service_v2",
        "name": "service_address"
      }
    ],
    "root": {
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
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

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

---

### Step 4: Create Service Guards

Create 2 Service guards for order_allocators.

#### Guard 5: service_merchant_win_v2

**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "service_merchant_win_v2",
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
            "type": "node",
            "node": {
              "type": "logic_string_nocase_equal",
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
          },
          {
            "type": "node",
            "node": {
              "type": "logic_string_nocase_equal",
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
          },
          {
            "type": "node",
            "node": {
              "type": "logic_string_nocase_equal",
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
                  "identifier": 3
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

#### Guard 6: service_customer_win_v2

**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "service_customer_win_v2",
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
            "type": "node",
            "node": {
              "type": "logic_string_nocase_equal",
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
          },
          {
            "type": "node",
            "node": {
              "type": "logic_string_nocase_equal",
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

---

### Step 5: Create Machine with Guards

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
                  "name": "Confirm Order",
                  "permissionIndex": 1000,
                  "weight": 1
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
                  "name": "Cancel Order",
                  "permissionIndex": 1000,
                  "weight": 1
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
              "threshold": 2,
              "forwards": [
                {
                  "name": "Confirm Delivery with Merkle Root",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": { "guard": "machine_merkle_root_v2" }
                },
                {
                  "name": "Timeout Auto-Complete (10 days)",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": { "guard": "machine_time_10d_v2" }
                }
              ]
            }
          ]
        },
        {
          "name": "Wonderful",
          "pairs": [
            {
              "prev_node": "Delivery Complete",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Rate as Wonderful",
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
              "prev_node": "Delivery Complete",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Complete Order",
                  "permissionIndex": 1001,
                  "weight": 1
                },
                {
                  "name": "Auto Complete from Delivery",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": { "guard": "machine_time_2d_v2" }
                }
              ]
            },
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

---

### Step 6: Bind Machine to Service

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

**Note**: This step must be performed before publishing the Service. Once published, the Machine cannot be bound.

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
    "description": "Arbitration for MyShop Advanced - Final dispute resolution mechanism",
    "voting_guard": {
      "op": "add",
      "guards": [
        {
          "guard": "machine_merkle_root_v2",
          "vote_weight": {
            "FixedValue": 1
          }
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

**Note**: Arbitration object is automatically published upon creation.

---

### Step 8: Configure Order Allocators, Sales and Publish Service

**Request:**
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v2",
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "The Three-Body Problem + Author Signature",
          "price": 5000000000,
          "stock": 100,
          "suspension": false,
          "wip": "https://example.com/three_body.wip",
          "wip_hash": "sha256:1db6dc86d8be68bafb33418628a30e7bfcbce48de9c099d3d9cb21def3af8b43"
        }
      ]
    },
    "order_allocators": {
      "description": "Order fund allocation - 100% to Service when order complete/wonderful/return fail, 100% to Order when lost/return complete",
      "threshold": 0,
      "allocators": [
        {
          "guard": "service_merchant_win_v2",
          "sharing": [
            {
              "who": {"Object": "three_body_signature_service_v2"},
              "sharing": 10000,
              "mode": "Rate"
            }
          ]
        },
        {
          "guard": "service_customer_win_v2",
          "sharing": [
            {
              "who": "Order",
              "sharing": 10000,
              "mode": "Rate"
            }
          ]
        }
      ]
    },
    "arbitrations": {
      "op": "add",
      "objects": ["myshop_arbitration_v2"]
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

**Fund Allocation Rules:**

| Guard | Condition | Recipient | Amount |
|-------|-----------|-----------|--------|
| service_merchant_win_v2 | Node is Order Complete / Wonderful / Return Fail | Service (merchant) | 100% |
| service_customer_win_v2 | Node is Lost / Return Complete | Order (customer) | 100% |

---

### Step 9: Create Reward Pool

**Request:**
```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "myshop_reward_v2",
      "replaceExistName": true,
      "permission": "myshop_permission_v2"
    },
    "description": "Reward pool for MyShop advanced - Wonderful rewards (10000), Lost compensation (20000), Shipping timeout compensation (30000)",
    "coin_add": {
      "balance": 150000000
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

---

### Step 10: Create Reward Guards

#### Guard 7: reward_wonderful_v2

**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "reward_wonderful_v2",
      "replaceExistName": true
    },
    "description": "Verify order at Wonderful node for reward",
    "table": [
      {"identifier": 0, "b_submission": true, "value_type": "Address", "name": "order_id"},
      {"identifier": 1, "b_submission": false, "value_type": "String", "value": "Wonderful"}
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_string_nocase_equal",
        "nodes": [
          {"type": "query", "query": "progress.current", "object": {"identifier": 0, "convert_witness": 100}, "parameters": []},
          {"type": "identifier", "identifier": 1}
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

#### Guard 8: reward_lost_v2

**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "reward_lost_v2",
      "replaceExistName": true
    },
    "description": "Verify order at Lost node for compensation",
    "table": [
      {"identifier": 0, "b_submission": true, "value_type": "Address", "name": "order_id"},
      {"identifier": 1, "b_submission": false, "value_type": "String", "value": "Lost"}
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_string_nocase_equal",
        "nodes": [
          {"type": "query", "query": "progress.current", "object": {"identifier": 0, "convert_witness": 100}, "parameters": []},
          {"type": "identifier", "identifier": 1}
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

#### Guard 9: reward_shipping_timeout_v2

**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "reward_shipping_timeout_v2",
      "replaceExistName": true
    },
    "description": "Verify order at Shipping node for shipping timeout compensation",
    "table": [
      {"identifier": 0, "b_submission": true, "value_type": "Address", "name": "order_id"},
      {"identifier": 1, "b_submission": false, "value_type": "String", "value": "Shipping"}
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_string_nocase_equal",
        "nodes": [
          {"type": "query", "query": "progress.current", "object": {"identifier": 0, "convert_witness": 100}, "parameters": []},
          {"type": "identifier", "identifier": 1}
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

---

### Step 11: Add Reward Guards to Reward Pool

**Request:**
```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v2",
    "guard_add": [
      {
        "guard": "reward_wonderful_v2",
        "recipient": {"Signer": "signer"},
        "amount": {"type": "Fixed", "value": 10000}
      },
      {
        "guard": "reward_lost_v2",
        "recipient": {"Signer": "signer"},
        "amount": {"type": "Fixed", "value": 20000}
      },
      {
        "guard": "reward_shipping_timeout_v2",
        "recipient": {"Signer": "signer"},
        "amount": {"type": "Fixed", "value": 30000}
      }
    ]
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

---

## Issues Fixed from Original Document

1. **Guard Name Consistency**: All guard names now consistently use the format `{purpose}_{name}_v2`
2. **Forward Name Alignment**: Forward names in examples now match the machine_nodes.json definitions
3. **Sales Configuration**: Added proper sales configuration with WIP hash verification
4. **Permission Index Usage**: Clarified usage of permissionIndex 1000 vs 1001
5. **replaceExistName Flag**: All object creation operations include `replaceExistName: true` as required
6. **value_type Format**: All value_type fields use string names like "Address", "String", "U64" instead of numeric values

---

## Next Steps

After completing the merchant system setup, proceed to [Order Flow Test](./MyShop_Advanced_OrderFlow_TestResults_New.md) to test customer order operations.
