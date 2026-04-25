# MyShop E-Commerce Example - Test Results

This document records the actual execution results of the MyShop example on the test network.

## Test Environment
- Network: testnet
- Test Date: 2026-04-23

## Key Object Addresses

| Object Type | Name | Object Address |
|---------|------|---------|
| Permission | myshop_permission_v2 | 0x0e012c5ba54054c6e06eed7b93bc3bba60f6e3b66c80b24abb75140f93909862 |
| Machine | myshop_machine_v2 | 0x923bf3f2868ab0996b996bf3ac2f550f91e2d33a8a5ccbf12b2a9b32bcf16aac |
| Contact | myshop_aftersales_contact_v2 | 0x855af9c1e9062ed7f52fd6097672c8a2646a05663dcb54c7dfb2d7c9777bf53b |
| Guard (Withdraw) | myshop_withdraw_guard_v2 | 0x7fe608af6107967d67b521d5bfbba726961adc167c94e64bbda643230c8c91ea |
| Guard (Refund) | myshop_refund_guard_v2 | 0x6147c72a27cba367d7893899c0a9b662be4aec663b758a31cf3c243775b2bda4 |
| Service | myshop_service_v2 | 0xc02e33863f3ba28a50bc63175dcb5ec97b875a2bef76b3e63b0347f716119755 |
| Order | - | 0x497ea4f7a5bb098802c23deedd8ed7122d6b501979394ce111aa66432d2ba0ca |
| Progress | - | 0xf7ecd7bae7bfdea1f0d98c95d1a8880e9a762f26f371ce2bc76e88fc8734472f |
| Allocation | - | 0x248f01d944de8f6712ec06f9b4c54f93fe4132e5323488b2d24c83d7487069de |

---

## Part 1: Merchant System Setup - Actual Execution Results

### Create Merchant Account and Get Test Tokens

**Create Account:**
```json
{
  "gen": {
    "name": "myshop_merchant"
  }
}
```

**Execution Result:**
```json
{
  "gen": {
    "address": "0x73e1bfdf5a31fef3ad36e8fcb1e43919ff60d8bac0df3b698a30275727ba708a",
    "name": "myshop_merchant"
  }
}
```

**Get Test Tokens:**
```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "myshop_merchant"
  }
}
```

**Execution Result:**
```json
{
  "faucet": {
    "name_or_address": "myshop_merchant",
    "result": [
      {"amount": 1000000000, "id": "0x0e4ed708f741f6316ec8518cc3a5d38f82b393f9c2c379a59c3a05f98fc79d0e", "transferTxDigest": "BnY6tvUHKRFf1VWCMtDTpwM5E2Rv2znWpon94YoZwVWx"},
      {"amount": 1000000000, "id": "0x48da5d683a211d3209b410d266d1b8dec631a1ae27103d927f039e01f7a12d61", "transferTxDigest": "BnY6tvUHKRFf1VWCMtDTpwM5E2Rv2znWpon94YoZwVWx"},
      {"amount": 1000000000, "id": "0x4d237c6cd6e0bad3dd0baaeb2e93d7e2b3ef1725ff0783d78c4aca35be7fd23d", "transferTxDigest": "BnY6tvUHKRFf1VWCMtDTpwM5E2Rv2znWpon94YoZwVWx"},
      {"amount": 1000000000, "id": "0xd98f8d78927a62e46f8e5755922179ae4ccb54e892e92e6067cdfd75493403cd", "transferTxDigest": "BnY6tvUHKRFf1VWCMtDTpwM5E2Rv2znWpon94YoZwVWx"},
      {"amount": 1000000000, "id": "0xe5f05d93eb33243a9e78a5d19988669caca88f85a2fe2bddf96bc94aa147ad50", "transferTxDigest": "BnY6tvUHKRFf1VWCMtDTpwM5E2Rv2znWpon94YoZwVWx"}
    ],
    "network": "testnet"
  }
}
```

---

### Step 1: Create Permission Object

**Prompt:**
```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "myshop_permission_v2",
      "tags": ["ecommerce", "toys", "shop"],
      "onChain": false
    },
    "description": "Permission management for MyShop toy store"
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Permission",
      "object": "0x0e012c5ba54054c6e06eed7b93bc3bba60f6e3b66c80b24abb75140f93909862",
      "version": "4",
      "change": "created"
    }
  ]
}
```

---

### Step 2: Create Machine Object

**Prompt:**
```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "myshop_machine_v2",
      "permission": "myshop_permission_v2"
    },
    "description": "Order processing workflow for MyShop toy store"
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Machine",
      "object": "0x923bf3f2868ab0996b996bf3ac2f550f91e2d33a8a5ccbf12b2a9b32bcf16aac",
      "version": "3025",
      "change": "created"
    }
  ]
}
```

---

### Step 4: Add Workflow Nodes

**Prompt:**
```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_machine_v2",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "Order Confirmation",
          "pairs": [
            {
              "prev_node": "",
              "threshold": 0,
              "forwards": [
                {
                  "name": "Confirm Order",
                  "permissionIndex": 1000,
                  "weight": 1
                },
                {
                  "name": "Cancel Order",
                  "namedOperator": "",
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
              "prev_node": "Order Confirmation",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Ship Goods",
                  "permissionIndex": 1001,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "In Transit",
          "pairs": [
            {
              "prev_node": "Shipping",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Confirm Delivery",
                  "permissionIndex": 1002,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "Completed",
          "pairs": [
            {
              "prev_node": "In Transit",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Complete Order",
                  "namedOperator": "",
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

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Machine",
      "object": "0x923bf3f2868ab0996b996bf3ac2f550f91e2d33a8a5ccbf12b2a9b32bcf16aac",
      "version": "3026",
      "change": "mutated"
    },
    {
      "type": "TableItem_MachineNode",
      "object": "0x365626f8167be817ea88e734c2de101be39c3ca40bf6fabdf08a0a552e7115da",
      "version": "3026",
      "change": "created"
    },
    {
      "type": "TableItem_MachineNode",
      "object": "0x37d8351ff12d2ac9e7b5028f7f4ddf5ede4548a14d9435dae14e2f28f716650f",
      "version": "3026",
      "change": "created"
    },
    {
      "type": "TableItem_MachineNode",
      "object": "0x98541c550f729dc1c9b22990e0554469147a294a7b336ad6b0eb021236921587",
      "version": "3026",
      "change": "created"
    },
    {
      "type": "TableItem_MachineNode",
      "object": "0xe7e82b99cd6f89c7bdae3ad776cadfe6650591d9b5b32fc73513a210ad20afdf",
      "version": "3026",
      "change": "created"
    }
  ]
}
```

---

### Step 5: Publish Machine

**Prompt:**
```json
{
  "operation_type": "machine",
  "data": {
    "object": "0x923bf3f2868ab0996b996bf3ac2f550f91e2d33a8a5ccbf12b2a9b32bcf16aac",
    "publish": true
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Machine",
      "object": "0x923bf3f2868ab0996b996bf3ac2f550f91e2d33a8a5ccbf12b2a9b32bcf16aac",
      "version": "3027",
      "change": "mutated"
    }
  ]
}
```

---

### Step 5.1: Create Contact Object

**Enable Merchant Messenger:**
```json
{
  "messenger": {
    "m": "myshop_merchant_messenger",
    "name_or_account": "myshop_merchant"
  }
}
```

**Execution Result:**
```json
{
  "messenger": {
    "name_or_account": "myshop_merchant",
    "m": "myshop_merchant_messenger"
  }
}
```

**Create After-sales Contact:**
```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "myshop_aftersales_contact_v2",
      "permission": "myshop_permission_v2"
    },
    "description": "MyShop after-sales support contact - we're here to help with orders, shipping, and returns",
    "ims": {
      "op": "add",
      "im": [
        {
          "at": "myshop_aftersales",
          "description": "Primary after-sales support representative"
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

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Contact",
      "object": "0x855af9c1e9062ed7f52fd6097672c8a2646a05663dcb54c7dfb2d7c9777bf53b",
      "version": "4902",
      "change": "created"
    }
  ]
}
```

---

### Step 6: Create Guards

**Create Withdraw Guard:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "myshop_withdraw_guard_v2",
      "tags": ["ecommerce", "withdraw", "merchant"]
    },
    "description": "Verify order is completed before merchant can withdraw funds. Submit order object ID.",
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
        "value": "Completed",
        "name": "completed_node"
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

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Guard",
      "object": "0x7fe608af6107967d67b521d5bfbba726961adc167c94e64bbda643230c8c91ea",
      "version": "5349",
      "change": "created"
    }
  ]
}
```

**Create Refund Guard:**
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "myshop_refund_guard_v2",
      "tags": ["ecommerce", "refund", "customer"]
    },
    "description": "Allow refund for orders not yet shipped. Submit order object ID.",
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
        "value": "Order Confirmation",
        "name": "confirmation_node"
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

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Guard",
      "object": "0x6147c72a27cba367d7893899c0a9b662be4aec663b758a31cf3c243775b2bda4",
      "version": "5557",
      "change": "created"
    }
  ]
}
```

---

### Step 7: Create Service

**Prompt:**
```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "myshop_service_v2",
      "type_parameter": "0x2::wow::WOW",
      "permission": "myshop_permission_v2",
      "tags": ["ecommerce", "toys", "store"],
      "onChain": false
    },
    "description": "MyShop - Top quality toys for children",
    "location": "Online Store",
    "machine": "myshop_machine_v2",
    "order_allocators": {
      "description": "Order revenue allocation - merchant withdraw after completion",
      "threshold": 0,
      "allocators": [
        {
          "guard": "myshop_withdraw_guard_v2",
          "sharing": [
            {
              "who": { "Signer": "signer" },
              "sharing": 10000,
              "mode": "Rate"
            }
          ]
        },
        {
          "guard": "myshop_refund_guard_v2",
          "sharing": [
            {
              "who": { "GuardIdentifier": 0 },
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
          "name": "Play Purse Set 35PCS",
          "price": 3000000000,
          "stock": 100,
          "suspension": false,
          "wip": "",
          "wip_hash": ""
        },
        {
          "name": "Little Girls Purse with Accessories",
          "price": 5000000000,
          "stock": 50,
          "suspension": false,
          "wip": "",
          "wip_hash": ""
        },
        {
          "name": "Tree House Building Set",
          "price": 2000000000,
          "stock": 75,
          "suspension": false,
          "wip": "",
          "wip_hash": ""
        }
      ]
    },
    "um": "myshop_aftersales_contact_v2",
    "publish": true
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Service",
      "object": "0xc02e33863f3ba28a50bc63175dcb5ec97b875a2bef76b3e63b0347f716119755",
      "version": "6201",
      "change": "created"
    }
  ]
}
```

---

## Part 2: Customer Order Flow - Actual Execution Results

### Create Customer Account and Get Test Tokens

**Create Customer Account:**
```json
{
  "gen": {
    "name": "myshop_customer"
  }
}
```

**Execution Result:**
```json
{
  "gen": {
    "address": "0x6e958763a706cf15bf6634b2081f34558cf0630c550d05f10617cf5cb46dd94d",
    "name": "myshop_customer"
  }
}
```

**Get Test Tokens:**
```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "myshop_customer"
  }
}
```

**Execution Result:**
```json
{
  "faucet": {
    "name_or_address": "myshop_customer",
    "result": [
      {"amount": 1000000000, "id": "0x0254c8997c90a19e4babeea92f3994e0c2795367ffe2f6d3b6951bd1d7161867", "transferTxDigest": "2NeYkqnGPT314LHV8sWF2SJiBDXCrrZkJ3DnFXu18J4T"},
      {"amount": 1000000000, "id": "0x1fa57c6c53425f35193fafa3d6c627fa86e7afae57ccf61720f300b63b909b3d", "transferTxDigest": "2NeYkqnGPT314LHV8sWF2SJiBDXCrrZkJ3DnFXu18J4T"},
      {"amount": 1000000000, "id": "0x831360612991b2f21b5a6d52abf2f73312699a1af8c98defb0436d307179c42c", "transferTxDigest": "2NeYkqnGPT314LHV8sWF2SJiBDXCrrZkJ3DnFXu18J4T"},
      {"amount": 1000000000, "id": "0xb6e2ed2bef2472058a56a078c454eae200b5b1d5c94e3960b10a326b46c70025", "transferTxDigest": "2NeYkqnGPT314LHV8sWF2SJiBDXCrrZkJ3DnFXu18J4T"},
      {"amount": 1000000000, "id": "0xdb08fa88b37da303bf85cdd13fa63980c5e2ac4a411ffae959eb6196679192ad", "transferTxDigest": "2NeYkqnGPT314LHV8sWF2SJiBDXCrrZkJ3DnFXu18J4T"}
    ],
    "network": "testnet"
  }
}
```

---

### Step 2: Create Order

**Prompt:**
```json
{
  "operation_type": "service",
  "data": {
    "object": "myshop_service_v2",
    "order_new": {
      "buy": {
        "items": [
          {
            "name": "Play Purse Set 35PCS",
            "stock": 1,
            "wip_hash": ""
          }
        ],
        "total_pay": {
          "balance": 3000000000
        }
      },
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet"
  }
}
```

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Order",
      "object": "0x497ea4f7a5bb098802c23deedd8ed7122d6b501979394ce111aa66432d2ba0ca",
      "version": "6809",
      "change": "created"
    },
    {
      "type": "Progress",
      "object": "0xf7ecd7bae7bfdea1f0d98c95d1a8880e9a762f26f371ce2bc76e88fc8734472f",
      "version": "6809",
      "change": "created"
    },
    {
      "type": "Allocation",
      "object": "0x248f01d944de8f6712ec06f9b4c54f93fe4132e5323488b2d24c83d7487069de",
      "version": "6809",
      "change": "created"
    }
  ]
}
```

---

### Step 5: Merchant Confirms Order

**Prompt:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "0xf7ecd7bae7bfdea1f0d98c95d1a8880e9a762f26f371ce2bc76e88fc8734472f",
    "operate": {
      "operation": {
        "next_node_name": "Order Confirmation",
        "forward": "Confirm Order"
      },
      "hold": false,
      "message": "Order confirmed by merchant"
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Progress",
      "object": "0xf7ecd7bae7bfdea1f0d98c95d1a8880e9a762f26f371ce2bc76e88fc8734472f",
      "version": "7967",
      "change": "mutated"
    }
  ]
}
```

---

### Step 6: Merchant Ships Goods

**Prompt:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "0xf7ecd7bae7bfdea1f0d98c95d1a8880e9a762f26f371ce2bc76e88fc8734472f",
    "operate": {
      "operation": {
        "next_node_name": "Shipping",
        "forward": "Ship Goods"
      },
      "hold": false,
      "message": "Goods shipped via express delivery"
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Progress",
      "object": "0xf7ecd7bae7bfdea1f0d98c95d1a8880e9a762f26f371ce2bc76e88fc8734472f",
      "version": "9468",
      "change": "mutated"
    }
  ]
}
```

---

### Step 7: Confirm Delivery

**Prompt:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "0xf7ecd7bae7bfdea1f0d98c95d1a8880e9a762f26f371ce2bc76e88fc8734472f",
    "operate": {
      "operation": {
        "next_node_name": "In Transit",
        "forward": "Confirm Delivery"
      },
      "hold": false,
      "message": "Goods delivered"
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Progress",
      "object": "0xf7ecd7bae7bfdea1f0d98c95d1a8880e9a762f26f371ce2bc76e88fc8734472f",
      "version": "9672",
      "change": "mutated"
    }
  ]
}
```

---

### Step 8: Customer Completes Order

**Prompt:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "0xf7ecd7bae7bfdea1f0d98c95d1a8880e9a762f26f371ce2bc76e88fc8734472f",
    "operate": {
      "operation": {
        "next_node_name": "Completed",
        "forward": "Complete Order"
      },
      "hold": false,
      "message": "Order received and completed"
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Progress",
      "object": "0xf7ecd7bae7bfdea1f0d98c95d1a8880e9a762f26f371ce2bc76e88fc8734472f",
      "version": "9881",
      "change": "mutated"
    }
  ]
}
```

---

### Step 9: Merchant Withdraws Funds

**9.1 Activate Allocation:**
```json
{
  "operation_type": "allocation",
  "data": {
    "object": "0x248f01d944de8f6712ec06f9b4c54f93fe4132e5323488b2d24c83d7487069de",
    "alloc_by_guard": "0x7fe608af6107967d67b521d5bfbba726961adc167c94e64bbda643230c8c91ea"
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "0x7fe608af6107967d67b521d5bfbba726961adc167c94e64bbda643230c8c91ea",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "0x7fe608af6107967d67b521d5bfbba726961adc167c94e64bbda643230c8c91ea",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "0x497ea4f7a5bb098802c23deedd8ed7122d6b501979394ce111aa66432d2ba0ca"
          }
        ]
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

**Execution Result:**
```json
{
  "status": "success"
}
```

**9.2 Withdraw:**
```json
{
  "operation_type": "service",
  "data": {
    "object": "myshop_service_v2",
    "owner_receive": "recently"
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Execution Result:**
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Service",
      "object": "0xc02e33863f3ba28a50bc63175dcb5ec97b875a2bef76b3e63b0347f716119755",
      "change": "mutated"
    }
  ]
}
```

---

## Test Summary

All test steps have been successfully completed:

1. ✅ Merchant account creation and test token acquisition
2. ✅ Permission object creation
3. ✅ Machine object creation and workflow node addition
4. ✅ Machine publication
5. ✅ Contact object creation
6. ✅ Guards creation (withdraw and refund)
7. ✅ Service creation and publication
8. ✅ Customer account creation and test token acquisition
9. ✅ Order creation
10. ✅ Order flow: Confirm → Ship → Deliver → Complete
11. ✅ Merchant withdrawal

All object addresses and transaction details have been recorded in this document.

## Key Findings

- Use `env.no_cache: true` to avoid validation errors caused by caching
- Progress operations require the Progress object ID, not the Order object ID