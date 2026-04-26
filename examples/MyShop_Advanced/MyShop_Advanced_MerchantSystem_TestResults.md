# MyShop Advanced Merchant System Test Results

## Test execution started: 2026-04-26

## Summary

This document contains test results for **Part 2: Merchant System Setup** with proper machine binding before service publishing. All tests have been executed successfully.

### Completed Test Items

| Step | Description | Status |
|------|-------------|--------|
| 1 | Create Permission Object | Success |
| 2 | Create Empty Service Object (Get Address) | Success |
| 3 | Create Guards (8 guards for Machine) | Success |
| 4 | Create Machine with Guards | Success |
| 5 | Bind Machine to Service | Success |
| 6 | Create Additional Guards for Service | Success |
| 7 | Create Arbitration Object | Success |
| 8 | Update Service and Publish | Success |
| 9 | Create Reward Object | Success |
| 10 | Add Reward Guards | Success |

### Guard Objects Created (8 total for Machine)

| # | Guard Name | Address | Purpose |
|---|------------|---------|---------|
| 1 | `guard_merkle_root_v2` | `0x8644baca380888c11a35a9687b7ceb5611cecaff6a225eeeda1d0f4af792139d` | Verify Merkle Root string length = 64 |
| 2 | `guard_service_signature_merkle_v2` | `0xa45f21fdcf987939655da059218e54197365e28bb614f7d9620531219d5886f0` | Verify service, signature, and Merkle Root |
| 3 | `guard_delivery_complete_v2` | `0x6669df3af6abbdfbe6072f354d04d059348a50a87d64a1019c4142739f6050ee` | Verify Delivery Complete node |
| 4 | `guard_wonderful_v2` | `0x42534c40643d04ec4c32821ee33681517e9f56ba5b3839c7a50d4fe2942a203a` | Verify Wonderful node |
| 5 | `guard_lost_v2` | `0xcf91f4877edc06e50bfb1132e96e6c77c66bc8ccd2dbb35457ca089f09113351` | Verify Lost node |
| 6 | `guard_return_complete_v2` | `0xcc3d931c54419e41037dc4d9b2dd344a14a84c7bdf3c113ca710b978ff84b382` | Verify Return Complete node |
| 7 | `guard_return_fail_v2` | `0x3b3c5138b9abd5d7843c449ba7e8145ee9d3899a817f0c6703539013ae0ee89c` | Verify Return Fail node |
| 8 | `guard_order_complete_v2` | `0x2b1fae955f63f688e0d03cd68601b52f392133afed106b21183775a60b29d2b8` | Verify Order Complete node |

### Additional Guards for Service (4 total)

| # | Guard Name | Address | Purpose |
|---|------------|---------|---------|
| 9 | `guard_merchant_win_v2` | `0xece766c71360200d805abb128f1fb3bf3c9e3eae366352c5de176ab5dd82c1b2` | Verify merchant winning nodes (Order Complete, Wonderful, Return Fail) |
| 10 | `guard_customer_win_v2` | `0x9e6ce67f66c3e96df6b7bb5873da3d5076b3a15bb1d12e9182419f905cebbd15` | Verify customer winning nodes (Lost, Return Complete) |
| 11 | `guard_time_10d_v2` | `0x51b290507808df00021825bb436184d34b1be27aed3590493f3d13003e0a3cb1` | Verify 10-day timeout (864000000 ms) |
| 12 | `guard_time_2d_v2` | `0x7c69cfae4c0dd64f5e4ce6fedc9053ce3b664e4f3a82d69614649d97459329c4` | Verify 2-day timeout (172800000 ms) |

### Reward Guards (1 total)

| # | Guard Name | Address | Purpose |
|---|------------|---------|---------|
| 13 | `guard_shipping_timeout_v2` | `0x8fdb3fc5f40265491111e5907bca8c4774375e2c0da38f7a2cf95ae7f03c0d94` | Verify shipping timeout for reward |

### Key Object Addresses

| Object | Name | Address |
|--------|------|---------|
| Permission | `myshop_permission_v2` | `0x4972b33431d3e1969dbbcd9e093c8052c30992492c5ceff5902b48f1a7cb11f8` |
| Service | `three_body_signature_service_v2` | `0xbfb5fe351fd114d8c77e8d163f3e440b5320aa849d417ca8d72c34762a7d71f9` |
| Machine | `myshop_advanced_machine_v2` | `0xa0b47cbec8cdb8f5358e4b3c2569de3fecb05161d2bce487cd564efa70bf81c0` |
| Arbitration | `myshop_arbitration_v2` | `0xf0fca6d3841793681de4b10ce398897b99cb1b3b59c90a670c5729d38615d7ff` |
| Reward | `myshop_reward_v2` | `0x5d4e9b75bf1b94a77c13aa60487898c5dba3b221a293f0fdd085bee9d20e277a` |

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
    "description": "Permission object for MyShop Advanced - with machine binding permission",
    "table": {
      "op": "add perm by entity",
      "entity": {"name_or_address": "myshop_merchant"},
      "index": [1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 306]
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Response:**
- Permission object created: `0x4972b33431d3e1969dbbcd9e093c8052c30992492c5ceff5902b48f1a7cb11f8`
- Name: `myshop_permission_v2` (with replaceExistName=true)
- Permission indexes added: 1010-1017, 306

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
    "network": "testnet"
  }
}
```

**Response:**
- Service object created: `0xbfb5fe351fd114d8c77e8d163f3e440b5320aa849d417ca8d72c34762a7d71f9`
- Name: `three_body_signature_service_v2` (with replaceExistName=true)
- Permission: `myshop_permission_v2`
- Published: false (intentionally left unpublished for guard creation)

**Note**: Service address recorded for Guard creation.

---

### Step 3: Create Guards (Using Service Address)

All guards verify that orders belong to the Service. Service address: `0xbfb5fe351fd114d8c77e8d163f3e440b5320aa849d417ca8d72c34762a7d71f9`

#### Guard 1: Merkle Root Verification

**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "object": {
      "name": "guard_merkle_root_v2"
    },
    "description": "Verify Merkle Root string length equals 64 characters",
    "logic": {
      "and": [
        {
          "identifier": { "input": "string", "value": "merkle_root" },
          "op": "length",
          "value": { "input": "number", "value": 64 }
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
- Guard created: `0x8644baca380888c11a35a9687b7ceb5611cecaff6a225eeeda1d0f4af792139d`

#### Guard 2: Service Signature + Merkle Root

**Request:**
```json
{
  "operation_type": "guard",
  "data": {
    "object": {
      "name": "guard_service_signature_merkle_v2"
    },
    "description": "Verify order belongs to Service, has valid signature, and Merkle Root length is 64",
    "logic": {
      "and": [
        {
          "identifier": { "input": "order", "value": "service" },
          "op": "equal",
          "value": { "input": "address", "value": "0xbfb5fe351fd114d8c77e8d163f3e440b5320aa849d417ca8d72c34762a7d71f9" }
        },
        {
          "identifier": { "input": "order", "value": "has_witness" },
          "op": "equal",
          "value": { "input": "boolean", "value": true }
        },
        {
          "identifier": { "input": "string", "value": "merkle_root" },
          "op": "length",
          "value": { "input": "number", "value": 64 }
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
- Guard created: `0xa45f21fdcf987939655da059218e54197365e28bb614f7d9620531219d5886f0`

#### Guard 3-8: Node Verification Guards

Created 6 additional guards for node verification:

| Guard | Address | Purpose |
|-------|---------|---------|
| guard_delivery_complete_v2 | 0x6669df3af6abbdfbe6072f354d04d059348a50a87d64a1019c4142739f6050ee | Verify Delivery Complete node |
| guard_wonderful_v2 | 0x42534c40643d04ec4c32821ee33681517e9f56ba5b3839c7a50d4fe2942a203a | Verify Wonderful node |
| guard_lost_v2 | 0xcf91f4877edc06e50bfb1132e96e6c77c66bc8ccd2dbb35457ca089f09113351 | Verify Lost node |
| guard_return_complete_v2 | 0xcc3d931c54419e41037dc4d9b2dd344a14a84c7bdf3c113ca710b978ff84b382 | Verify Return Complete node |
| guard_return_fail_v2 | 0x3b3c5138b9abd5d7843c449ba7e8145ee9d3899a817f0c6703539013ae0ee89c | Verify Return Fail node |
| guard_order_complete_v2 | 0x2b1fae955f63f688e0d03cd68601b52f392133afed106b21183775a60b29d2b8 | Verify Order Complete node |

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
                  "weight": 1,
                  "guard": { "guard": "0xa45f21fdcf987939655da059218e54197365e28bb614f7d9620531219d5886f0" }
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
                  "weight": 1,
                  "guard": { "guard": "0x6669df3af6abbdfbe6072f354d04d059348a50a87d64a1019c4142739f6050ee" }
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
                  "weight": 1,
                  "guard": { "guard": "0x42534c40643d04ec4c32821ee33681517e9f56ba5b3839c7a50d4fe2942a203a" }
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
                  "weight": 1,
                  "guard": { "guard": "0x2b1fae955f63f688e0d03cd68601b52f392133afed106b21183775a60b29d2b8" }
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
                  "weight": 1,
                  "guard": { "guard": "0x2b1fae955f63f688e0d03cd68601b52f392133afed106b21183775a60b29d2b8" }
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
                  "weight": 1,
                  "guard": { "guard": "0xcf91f4877edc06e50bfb1132e96e6c77c66bc8ccd2dbb35457ca089f09113351" }
                },
                {
                  "name": "Confirm Lost with Merkle Root",
                  "permissionIndex": 1011,
                  "weight": 1,
                  "guard": { "guard": "0xcf91f4877edc06e50bfb1132e96e6c77c66bc8ccd2dbb35457ca089f09113351" }
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
                  "weight": 1,
                  "guard": { "guard": "0x3b3c5138b9abd5d7843c449ba7e8145ee9d3899a817f0c6703539013ae0ee89c" }
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
                  "weight": 1,
                  "guard": { "guard": "0xcc3d931c54419e41037dc4d9b2dd344a14a84c7bdf3c113ca710b978ff84b382" }
                },
                {
                  "name": "Confirm Return Received",
                  "permissionIndex": 1011,
                  "weight": 1,
                  "guard": { "guard": "0xcc3d931c54419e41037dc4d9b2dd344a14a84c7bdf3c113ca710b978ff84b382" }
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
                  "weight": 1,
                  "guard": { "guard": "0xcc3d931c54419e41037dc4d9b2dd344a14a84c7bdf3c113ca710b978ff84b382" }
                },
                {
                  "name": "Confirm Return Received",
                  "permissionIndex": 1011,
                  "weight": 1,
                  "guard": { "guard": "0xcc3d931c54419e41037dc4d9b2dd344a14a84c7bdf3c113ca710b978ff84b382" }
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
- Machine object created: `0xa0b47cbec8cdb8f5358e4b3c2569de3fecb05161d2bce487cd564efa70bf81c0`
- Name: `myshop_advanced_machine_v2` (with replaceExistName=true)
- Permission: `myshop_permission_v2`
- Nodes added: 11 nodes with guards for multi-path workflow

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
    "network": "testnet"
  }
}
```

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
          "guard": "guard_merchant_win_v2",
          "sharing": [
            {
              "who": {"Signer": "signer"},
              "sharing": 10000,
              "mode": "Rate"
            }
          ]
        },
        {
          "guard": "guard_customer_win_v2",
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
- Service updated and published: `0x489f...b6ae`
- Machine: `myshop_advanced_machine_v2` (already bound)
- Published: true
- Added:
  - Sales: "The Three-Body Problem + Author Signature"
  - Arbitrations: `myshop_arbitration_v2`
  - Order allocators: `guard_merchant_win_v2`, `guard_customer_win_v2`
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
