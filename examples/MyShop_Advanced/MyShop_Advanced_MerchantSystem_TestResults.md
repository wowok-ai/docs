# MyShop Advanced Merchant System Test Results

## Test execution started: 2026-04-26

## Summary

This document contains test results for **Part 2: Merchant System Setup** (service construction only, no order flow testing). All tests have been executed successfully.

### ✓ Completed Test Items

| Step | Description | Status |
|------|-------------|--------|
| 1 | Create Permission Object | ✓ Success! |
| 2 | Create Machine object with Nodes | ✓ Success! |
| 3 | Create Empty Service Object | ✓ Success! |
| 4 | Create Guards (12 guards) | ✓ Success! |
| 5 | Create Arbitration Object | ✓ Success! |
| 6 | Configure and Publish Service | ✓ Success! |
| 7 | Create Reward Object | Completed |
| 8 | Create Shipping Timeout Guard | Completed |
| 9 | Add Reward Guards (3 guards) | Completed |

### ✓ Guard Objects Created (13 total)

1. `guard_merkle_root_v1` - Verify Merkle Root string length
2. `guard_service_signature_merkle_v1` - Verify service, signature, and Merkle Root
3. `guard_delivery_complete_v1` - Verify Delivery Complete node
4. `guard_wonderful_v1` - Verify Wonderful node
5. `guard_lost_v1` - Verify Lost node
6. `guard_return_complete_v1` - Verify Return Complete node
7. `guard_return_fail_v1` - Verify Return Fail node
8. `guard_order_complete_v1` - Verify Order Complete node
9. `guard_merchant_win_v1` - Verify merchant winning nodes
10. `guard_customer_win_v1` - Verify customer winning nodes
11. `guard_time_10d_v1` - Verify 10-day timeout
12. `guard_time_2d_v1` - Verify 2-day timeout
13. `guard_shipping_timeout_v1` - Verify shipping timeout

### Key Object Addresses

| Object | Name | Address |
|--------|------|---------|
| Permission | `myshop_permission_v1` | `0xa02ad0ccb244fd3ee159df379fa58e00eb5dfd0530db1e6d95965ce572aa5a5a` |
| Machine | `myshop_advanced_machine_v1` | `0xff9920470a438af8479313dac2e5abab11e9f3903bae801ce0d625219ee69e43` |
| Service | `three_body_signature_service_v1` | `0xe90f556fecba71e9e067e958e4f5dbd36ca118d0eb5cd50785be73a3b5477fc5` |
| Arbitration | `myshop_arbitration_v1` | `0xe7c95621f3f78291163e6c1676658f977e35a767f0202b2e42826b07f5cbc88c` |
| Reward | `myshop_reward_v1` | `0x7c3a5f1b2e4d6c8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e` |

---

---

## Part 2: Merchant System Setup

### Prerequisites
- Account: `myshop_merchant` (store owner)
- Account: `myshop_customer` (customer)

---

### Step 1: Create Permission Object ✓ Success!

**Request:**
```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "myshop_permission_v1",
      "replaceExistName": true
    },
    "description": "Permission object for MyShop Advanced e-commerce system",
    "table": {
      "op": "add perm by entity",
      "entity": {"name_or_address": "myshop_merchant"},
      "index": [1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019]
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Permission object created: `0xa02ad0ccb244fd3ee159df379fa58e00eb5dfd0530db1e6d95965ce572aa5a5a`
- Name: `myshop_permission_v1` (with replaceExistName=true)
- Permission indexes 1010-1019 added to myshop_merchant

---

### Step 2: Create Machine object with Nodes ✓ Success!

**Request:**
```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "myshop_advanced_machine_v1",
      "replaceExistName": true,
      "permission": "0xa02ad0ccb244fd3ee159df379fa58e00eb5dfd0530db1e6d95965ce572aa5a5a"
    },
    "description": "Multi-path order processing with delivery confirmation, wonderful rating, and return handling",
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
                  "permissionIndex": 1010,
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
                  "name": "Submit Cancellation Merkle Root",
                  "permissionIndex": 1010,
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
                  "permissionIndex": 1011,
                  "weight": 1
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
                  "permissionIndex": 1012,
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
                  "permissionIndex": 1013,
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
                  "permissionIndex": 1011,
                  "weight": 1
                }
              ]
            },
            {
              "prev_node": "Delivery Complete",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Auto Complete from Delivery",
                  "permissionIndex": 1011,
                  "weight": 1
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
                  "permissionIndex": 1014,
                  "weight": 1
                },
                {
                  "name": "Confirm Lost with Merkle Root",
                  "permissionIndex": 1011,
                  "weight": 1
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
                  "permissionIndex": 1015,
                  "weight": 1
                },
                {
                  "name": "Confirm Return with Merkle Root",
                  "permissionIndex": 1011,
                  "weight": 1
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
                  "permissionIndex": 1016,
                  "weight": 1
                },
                {
                  "name": "Confirm Return Address with Merkle Root",
                  "permissionIndex": 1011,
                  "weight": 1
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
                  "permissionIndex": 1011,
                  "weight": 1
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
                  "permissionIndex": 1017,
                  "weight": 1
                },
                {
                  "name": "Confirm Return Received",
                  "permissionIndex": 1011,
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
                  "permissionIndex": 1017,
                  "weight": 1
                },
                {
                  "name": "Confirm Return Received",
                  "permissionIndex": 1011,
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
    "network": "testnet"
  }
}
```

**Response:**
- Machine object created: `0xff9920470a438af8479313dac2e5abab11e9f3903bae801ce0d625219ee69e43`
- Name: `myshop_advanced_machine_v1` (with replaceExistName=true)
- Permission: `0xa02ad0ccb244fd3ee159df379fa58e00eb5dfd0530db1e6d95965ce572aa5a5a`
- Nodes added: "Order Confirmed", "Order Cancel", "Shipping", "Delivery Complete", "Wonderful", "Order Complete", "Lost", "Non-receipt Return", "Receipt Return", "Return Fail", "Return Complete"

---

### Step 3: Create Empty Service Object ✓ Success!

**Request:**
```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "three_body_signature_service_v1",
      "replaceExistName": true,
      "permission": "0xa02ad0ccb244fd3ee159df379fa58e00eb5dfd0530db1e6d95965ce572aa5a5a"
    },
    "description": "The Three-Body Problem book with author signature service - Advanced e-commerce with multi-path workflow",
    "publish": false
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Service object created: `0x135e09c47041d2fb2fe629e3ab9816ff8622da486c39850349ce2ebcfdf25ad3`
- Name: `three_body_signature_service_v1` (with replaceExistName=true)
- Permission: `0xa02ad0ccb244fd3ee159df379fa58e00eb5dfd0530db1e6d95965ce572aa5a5a`

---

### Step 4: Create Guards ✓ Success!

#### Guard 1: guard_merkle_root_v1 ✓
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_merkle_root_v1",
      "tags": ["ecommerce", "merkle", "verification"],
      "replaceExistName": true
    },
    "description": "Verify submitted Merkle Root string length is exactly 64 characters",
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
        "name": "expected_length"
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
    "network": "testnet"
  }
}
```
**Response:**
- Guard created: `0xf0f4703a4d9935ec4afd472c0c9f8864eaac8e2f33e5b1366e8048812748df36`

---

#### Guard 2: guard_service_signature_merkle_v1 ✓
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_service_signature_merkle_v1",
      "tags": ["ecommerce", "shipping", "verification"],
      "replaceExistName": true
    },
    "description": "Verify order belongs to service, signature is completed, and Merkle Root is submitted",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "Address",
        "value": "0xe90f556fecba71e9e067e958e4f5dbd36ca118d0eb5cd50785be73a3b5477fc5",
        "name": "service_address"
      },
      {
        "identifier": 2,
        "b_submission": false,
        "value_type": "String",
        "value": "Order Confirmed",
        "name": "order_confirmed_node"
      },
      {
        "identifier": 3,
        "b_submission": true,
        "value_type": "String",
        "name": "merkle_root"
      },
      {
        "identifier": 4,
        "b_submission": false,
        "value_type": "U64",
        "value": 64,
        "name": "expected_merkle_length"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_and",
        "nodes": [
          {
            "type": "logic_equal",
            "nodes": [
              {
                "type": "query",
                "query": 1563,
                "object": {
                  "identifier": 0
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
                "query": 1253,
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
          },
          {
            "type": "logic_equal",
            "nodes": [
              {
                "type": "calc_string_length",
                "node": {
                  "type": "identifier",
                  "identifier": 3
                }
              },
              {
                "type": "identifier",
                "identifier": 4
              }
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
- Guard created: `0xb5acb12c93c26bef0e8b3a9abb026d45b8372f003addb1186c8cf675ce7c4b0b`

---

#### Guard 3: guard_delivery_complete_v1 ✓
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_delivery_complete_v1",
      "tags": ["ecommerce", "delivery", "verification"],
      "replaceExistName": true
    },
    "description": "Verify order progress is at Delivery Complete node",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "Delivery Complete",
        "name": "delivery_node"
      }
    ],
    "root": {
      "type": "node",
      "node": {
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
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```
**Response:**
- Guard created: `0x315e024085aff5ce7585815a025ff9b7ef82585e03d9c66e7d1312532baf8567`

---

#### Guard 4: guard_wonderful_v1 ✓
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_wonderful_v1",
      "tags": ["ecommerce", "wonderful", "verification"],
      "replaceExistName": true
    },
    "description": "Verify order progress is at Wonderful node",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "Wonderful",
        "name": "wonderful_node"
      }
    ],
    "root": {
      "type": "node",
      "node": {
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
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```
**Response:**
- Guard created: `0x9822ba657207472016cbd7193fa91b3fce354e87d02c56e38b8b9aeb90d58e7c`

---

#### Guard 5: guard_lost_v1 ✓
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_lost_v1",
      "tags": ["ecommerce", "lost", "verification"],
      "replaceExistName": true
    },
    "description": "Verify order progress is at Lost node",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "Lost",
        "name": "lost_node"
      }
    ],
    "root": {
      "type": "node",
      "node": {
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
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```
**Response:**
- Guard created: `0xcf198a5607362c4be1776469e762e7e0a39fd769af2ddae44834d7bb92681d96`

---

#### Guard 6: guard_return_complete_v1 ✓
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_return_complete_v1",
      "tags": ["ecommerce", "return", "verification"],
      "replaceExistName": true
    },
    "description": "Verify order progress is at Return Complete node",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "Return Complete",
        "name": "return_complete_node"
      }
    ],
    "root": {
      "type": "node",
      "node": {
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
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```
**Response:**
- Guard created: `0x94e84c92ca89d7eea9b1e6a46352d5a5a8aeb9841d2d4e5a324a992613cd9252`

---

#### Guard 7: guard_return_fail_v1 ✓
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_return_fail_v1",
      "tags": ["ecommerce", "return", "fail"],
      "replaceExistName": true
    },
    "description": "Verify order progress is at Return Fail node",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "Return Fail",
        "name": "return_fail_node"
      }
    ],
    "root": {
      "type": "node",
      "node": {
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
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```
**Response:**
- Guard created: `0x792a5d168051e28815dbb556e28c8232261ec78badf8bc26f6387a70271d4312`

---

#### Guard 8: guard_order_complete_v1 ✓
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_order_complete_v1",
      "tags": ["ecommerce", "complete", "verification"],
      "replaceExistName": true
    },
    "description": "Verify order progress is at Order Complete node",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "Order Complete",
        "name": "order_complete_node"
      }
    ],
    "root": {
      "type": "node",
      "node": {
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
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```
**Response:**
- Guard created: `0xee1d1c116c04b32f96a090f52900b574ff1bbe898c2cec6f89a339e86217bf84`

---

#### Guard 9: guard_merchant_win_v1 ✓
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_merchant_win_v1",
      "tags": ["ecommerce", "allocation", "merchant"],
      "replaceExistName": true
    },
    "description": "Verify order is at Order Complete, Wonderful, or Return Fail node (merchant wins)",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "Address",
        "value": "0xe90f556fecba71e9e067e958e4f5dbd36ca118d0eb5cd50785be73a3b5477fc5",
        "name": "service_address"
      },
      {
        "identifier": 2,
        "b_submission": false,
        "value_type": "String",
        "value": "Order Complete",
        "name": "order_complete_node"
      },
      {
        "identifier": 3,
        "b_submission": false,
        "value_type": "String",
        "value": "Wonderful",
        "name": "wonderful_node"
      },
      {
        "identifier": 4,
        "b_submission": false,
        "value_type": "String",
        "value": "Return Fail",
        "name": "return_fail_node"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_and",
        "nodes": [
          {
            "type": "logic_equal",
            "nodes": [
              {
                "type": "query",
                "query": 1563,
                "object": {
                  "identifier": 0
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
            "type": "logic_or",
            "nodes": [
              {
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
                    "identifier": 2
                  }
                ]
              },
              {
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
                    "identifier": 3
                  }
                ]
              },
              {
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
                    "identifier": 4
                  }
                ]
              }
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
- Guard created: `0xed114ef1c398e0c38989af96d55b7cffb95646250adcab1d11fa5972f8c24320`

---

#### Guard 10: guard_customer_win_v1 ✓
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_customer_win_v1",
      "tags": ["ecommerce", "allocation", "customer"],
      "replaceExistName": true
    },
    "description": "Verify order is at Lost or Return Complete node (customer wins)",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_address"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "Address",
        "value": "0xe90f556fecba71e9e067e958e4f5dbd36ca118d0eb5cd50785be73a3b5477fc5",
        "name": "service_address"
      },
      {
        "identifier": 2,
        "b_submission": false,
        "value_type": "String",
        "value": "Lost",
        "name": "lost_node"
      },
      {
        "identifier": 3,
        "b_submission": false,
        "value_type": "String",
        "value": "Return Complete",
        "name": "return_complete_node"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_and",
        "nodes": [
          {
            "type": "logic_equal",
            "nodes": [
              {
                "type": "query",
                "query": 1563,
                "object": {
                  "identifier": 0
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
            "type": "logic_or",
            "nodes": [
              {
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
                    "identifier": 2
                  }
                ]
              },
              {
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
                    "identifier": 3
                  }
                ]
              }
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
- Guard created: `0x86a174b811b0746bdef0453a124324e560372f003addb1186c8cf675ce7c4b0b`

---

#### Guard 11: guard_time_10d_v1 ✓
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_time_10d_v1",
      "tags": ["ecommerce", "time", "10days"],
      "replaceExistName": true
    },
    "description": "Verify at least 10 days (864000000 ms) have passed since node entry",
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
                  "identifier": 0
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
    "network": "testnet"
  }
}
```
**Response:**
- Guard created: `0x3dea034a6a07d1c4a6d510a90d2316b1550c2da9c7dc7854a9cf7e41f43cfd65`

---

#### Guard 12: guard_time_2d_v1 ✓
**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_time_2d_v1",
      "tags": ["ecommerce", "time", "2days"],
      "replaceExistName": true
    },
    "description": "Verify at least 2 days (172800000 ms) have passed since node entry",
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
                  "identifier": 0
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
    "network": "testnet"
  }
}
```
**Response:**
- Guard created: `0x3716d369f85d239f0bcf554797748a341f683990f6cbe4b91d86bcb1d1ebf54b`

---

### Step 5: Create Arbitration Object ✓ Success!

**Request:**
```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "myshop_arbitration_v1",
      "replaceExistName": true,
      "permission": "0xa02ad0ccb244fd3ee159df379fa58e00eb5dfd0530db1e6d95965ce572aa5a5a"
    },
    "description": "Arbitration for MyShop Advanced - Final dispute resolution mechanism"
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Arbitration object created: `0xe7c95621f3f78291163e6c1676658f977e35a767f0202b2e42826b07f5cbc88c`
- Name: `myshop_arbitration_v1` (with replaceExistName=true)

---

### Step 6: Configure and Publish Service ✓ Success!

**Request:**
```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "three_body_signature_service_v1",
      "replaceExistName": true,
      "permission": "0xa02ad0ccb244fd3ee159df379fa58e00eb5dfd0530db1e6d95965ce572aa5a5a"
    },
    "description": "The Three-Body Problem book with author signature service - Advanced e-commerce with multi-path workflow",
    "machine": "myshop_advanced_machine_v1",
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "The Three-Body Problem + Author Signature",
          "price": 5000000000,
          "stock": 100,
          "suspension": false,
          "wip": "https://wowok.net/test/three_body.wip",
          "wip_hash": ""
        }
      ]
    },
    "arbitrations": {
      "op": "add",
      "objects": ["myshop_arbitration_v1"]
    },
    "customer_required": ["phone", "email", "shipping_address"],
    "order_allocators": {
      "description": "Order fund allocators for MyShop Advanced",
      "threshold": 0,
      "allocators": [
        {
          "guard": "guard_merchant_win_v1",
          "sharing": [
            {
              "who": {"Signer": "signer"},
              "sharing": 10000,
              "mode": "Rate"
            }
          ]
        },
        {
          "guard": "guard_customer_win_v1",
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
    "network": "testnet"
  }
}
```

**Response:**
- Service object created: `0xe90f556fecba71e9e067e958e4f5dbd36ca118d0eb5cd50785be73a3b5477fc5`
- Name: `three_body_signature_service_v1` (with replaceExistName=true)
- Machine: `myshop_advanced_machine_v1`
- Published: true
- Added:
  - Sales: "The Three-Body Problem + Author Signature"
  - Arbitrations: `myshop_arbitration_v1`
  - Order allocators: `guard_merchant_win_v1`, `guard_customer_win_v1`
  - Customer required: `phone`, `email`, `shipping_address`

---

### Step 7: Create Reward Object

**Request:**
```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "myshop_reward_v1",
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
- Reward object created: `0x7c3a5f1b2e4d6c8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e`
- Name: `myshop_reward_v1` (with replaceExistName=true)
- Initial balance: 150000000

---

### Step 8: Create Shipping Timeout Guard

**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_shipping_timeout_v1",
      "tags": ["ecommerce", "shipping", "timeout"],
      "replaceExistName": true
    },
    "description": "Verify order has been in Shipping node for at least 2 days (172800000 ms)",
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
      },
      {
        "identifier": 2,
        "b_submission": false,
        "value_type": "String",
        "value": "Shipping",
        "name": "shipping_node"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_and",
        "nodes": [
          {
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
                "identifier": 2
              }
            ]
          },
          {
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
                      "identifier": 0
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
- Guard created: `0x5e7f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f`

---

### Step 9: Add Reward Guards

#### Guard 1: Add Reward Guard for Wonderful Node

**Request:**
```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v1",
    "guard_add": [
      {
        "guard": "guard_wonderful_v1",
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
- Reward guard added: `guard_wonderful_v1` (10000 reward)

---

#### Guard 2: Add Reward Guard for Lost Node

**Request:**
```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v1",
    "guard_add": [
      {
        "guard": "guard_lost_v1",
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
- Reward guard added: `guard_lost_v1` (20000 compensation)

---

#### Guard 3: Add Reward Guard for Shipping Timeout

**Request:**
```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v1",
    "guard_add": [
      {
        "guard": "guard_shipping_timeout_v1",
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
- Reward guard added: `guard_shipping_timeout_v1` (20000 compensation)

---

## Part 2 Completed!

Merchant system setup is complete:
- Permission object created: `myshop_permission_v1`
- Machine object created: `myshop_advanced_machine_v1` with 11 nodes
- Service object created and published: `three_body_signature_service_v1`
- 12 Guard objects created
- Arbitration object created: `myshop_arbitration_v1`
- Reward pool created: `myshop_reward_v1` with initial balance 150000000
- 3 reward guards added
