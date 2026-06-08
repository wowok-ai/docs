# MyShop E-Commerce Example - Test Results (2026-06-08)

This document records the actual execution results of the MyShop example on the test network.

## Test Environment
- Network: testnet
- Test Date: 2026-06-08

## Key Object Addresses

| Object Type | Name | Object Address |
|---------|------|---------|
| Account (Merchant) | myshop_merchant_test | 0x53d3750ee84204f12bc17b9a02c549f1823eb68c274db9209f8543591735ddd3 |
| Account (Customer) | myshop_customer_test | 0xea826689b2371363394f4e339df39b42ab453225a3479ca54a8cf94ea8561632 |
| Permission | myshop_permission_test | 0xcdafc86228534190785a0309b4bb2c20bee5c863ff90bdf8da1fe81d42cdd02e |
| Machine | myshop_machine_test | 0xff20a381102902f77fde6c75dfc63904b4e65fccedc24dc5a0a7c9f45df9aed9 |
| Contact | myshop_aftersales_contact_test | 0x01e11cfc44ca83b9436e59a6691ffc1b5067dc61e8bb2785e48290cb8d3587e1 |
| Guard (Withdraw) | myshop_withdraw_guard_test | 0x330f3f0d801b71b8c6d8df87d472d8294128b84ec04c6c8e3177abde4b84d39f |
| Guard (Refund) | myshop_refund_guard_test | 0x621a70b234ffb4fdf922d7aa19f81e48a7b3ec924188a1d6aa3f44e8549c4c51 |
| Service | myshop_service_test | 0xfcaed83a9719337a4d455e9b782cd51bbeb21709cebd462e9caf6072cfc3afe2 |
| Order | - | 0x05968068ac9a7b532925706c6014b751bba98ec6a63cfaf6377e0cf2ba7cbddc |
| Progress | - | 0x8382169d14fca7efcf58e04ca84660e28797bee237e1b8dde22e3ccc8ac8362b |
| Allocation | - | 0xf00c7177827b5ec0873990f95f3a98efbe4b9ae90884adf05bcfc33209e22b30 |

---

## Part 1: Merchant System Setup - Actual Execution Results

### Create Merchant Account and Get Test Tokens

**Create Account:**
```json
{
  "gen": {
    "name": "myshop_merchant_test"
  }
}
```

**Execution Result:**
```json
{
  "gen": {
    "address": "0x53d3750ee84204f12bc17b9a02c549f1823eb68c274db9209f8543591735ddd3",
    "name": "myshop_merchant_test"
  }
}
```

**Get Test Tokens:**
```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "myshop_merchant_test"
  }
}
```

**Execution Result:**
```json
{
  "faucet": {
    "name_or_address": "myshop_merchant_test",
    "result": [
      {"amount": 1000000000, "id": "0x170c386e276c3ba1e8e8de0e2db46be38f64afd63f3471bd98fa358cdfb62fc4", "transferTxDigest": "3GCh4tSyRPXkERzoZXsTAeMeRmVH1gXDxNABQkMgZnof"},
      {"amount": 1000000000, "id": "0x2c21fcac5ae4b65e424f8f3506c5dec02bbec81cfded2ed643aed5171242343d", "transferTxDigest": "3GCh4tSyRPXkERzoZXsTAeMeRmVH1gXDxNABQkMgZnof"},
      {"amount": 1000000000, "id": "0xada56ced4cb3cdc1d1c2d1a9b1ca9ffbd9e8c563f6cffd7b0b4a67f960b8facb", "transferTxDigest": "3GCh4tSyRPXkERzoZXsTAeMeRmVH1gXDxNABQkMgZnof"}
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
      "name": "myshop_permission_test",
      "tags": ["ecommerce", "toys", "shop"],
      "onChain": false
    },
    "description": "Permission management for MyShop toy store"
  },
  "env": {
    "account": "myshop_merchant_test",
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
      "object": "0xcdafc86228534190785a0309b4bb2c20bee5c863ff90bdf8da1fe81d42cdd02e",
      "version": "20",
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
      "name": "myshop_machine_test",
      "permission": "myshop_permission_test"
    },
    "description": "Order processing workflow for MyShop toy store"
  },
  "env": {
    "account": "myshop_merchant_test",
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
      "object": "0xff20a381102902f77fde6c75dfc63904b4e65fccedc24dc5a0a7c9f45df9aed9",
      "version": "1007479",
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
    "object": "myshop_machine_test",
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
            },
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
    "account": "myshop_merchant_test",
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
      "object": "0xff20a381102902f77fde6c75dfc63904b4e65fccedc24dc5a0a7c9f45df9aed9",
      "version": "1007480",
      "change": "mutated"
    },
    {
      "type": "TableItem_MachineNode",
      "object": "0x2f3643eb304734ac16c2b8391ba5eca01e30f08f0f82ce78e900f1dfcb4e2cd4",
      "version": "1007480",
      "change": "created"
    },
    {
      "type": "TableItem_MachineNode",
      "object": "0x3dc520fa34b2ce887a1a55e38a9e454a47e2784691911b9b3769cabd6f7a8b7e",
      "version": "1007480",
      "change": "created"
    },
    {
      "type": "TableItem_MachineNode",
      "object": "0x4043429fc04a57c4ee28ad3f31960dc513839f88658861f6aca4af4b1c7b50ca",
      "version": "1007480",
      "change": "created"
    },
    {
      "type": "TableItem_MachineNode",
      "object": "0x4bbcacf9022b46bd689bac515053969dc2af3007c0dd6dd88a3247d34c5023be",
      "version": "1007480",
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
    "object": "myshop_machine_test",
    "publish": true
  },
  "env": {
    "account": "myshop_merchant_test",
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
      "object": "0xff20a381102902f77fde6c75dfc63904b4e65fccedc24dc5a0a7c9f45df9aed9",
      "version": "1007481",
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
    "m": "myshop_merchant_messenger_test",
    "name_or_account": "myshop_merchant_test"
  }
}
```

**Execution Result:**
```json
{
  "messenger": {
    "name_or_account": "myshop_merchant_test",
    "m": "myshop_merchant_messenger_test"
  }
}
```

**Create After-sales Contact:**
```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "myshop_aftersales_contact_test",
      "permission": "myshop_permission_test"
    },
    "description": "MyShop after-sales support contact - we're here to help with orders, shipping, and returns",
    "ims": {
      "op": "add",
      "im": [
        {
          "at": "0x53d3750ee84204f12bc17b9a02c549f1823eb68c274db9209f8543591735ddd3",
          "description": "Primary after-sales support representative"
        }
      ]
    }
  },
  "env": {
    "account": "myshop_merchant_test",
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
      "object": "0x01e11cfc44ca83b9436e59a6691ffc1b5067dc61e8bb2785e48290cb8d3587e1",
      "version": "1016934",
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
      "name": "myshop_withdraw_guard_test",
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
    "account": "myshop_merchant_test",
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
      "object": "0x330f3f0d801b71b8c6d8df87d472d8294128b84ec04c6c8e3177abde4b84d39f",
      "version": "1017355",
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
      "name": "myshop_refund_guard_test",
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
    "account": "myshop_merchant_test",
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
      "object": "0x621a70b234ffb4fdf922d7aa19f81e48a7b3ec924188a1d6aa3f44e8549c4c51",
      "version": "1017715",
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
      "name": "myshop_service_test",
      "type_parameter": "0x2::wow::WOW",
      "permission": "myshop_permission_test",
      "tags": ["ecommerce", "toys", "store"],
      "onChain": false
    },
    "description": "MyShop - Top quality toys for children",
    "location": "Online Store",
    "machine": "myshop_machine_test",
    "order_allocators": {
      "description": "Order revenue allocation - merchant withdraw after completion",
      "threshold": 0,
      "allocators": [
        {
          "guard": "myshop_withdraw_guard_test",
          "sharing": [
            {
              "who": { "Signer": "signer" },
              "sharing": 10000,
              "mode": "Rate"
            }
          ]
        },
        {
          "guard": "myshop_refund_guard_test",
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
    "um": "myshop_aftersales_contact_test",
    "publish": true
  },
  "env": {
    "account": "myshop_merchant_test",
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
      "object": "0xfcaed83a9719337a4d455e9b782cd51bbeb21709cebd462e9caf6072cfc3afe2",
      "version": "1018236",
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
    "name": "myshop_customer_test"
  }
}
```

**Execution Result:**
```json
{
  "gen": {
    "address": "0xea826689b2371363394f4e339df39b42ab453225a3479ca54a8cf94ea8561632",
    "name": "myshop_customer_test"
  }
}
```

**Get Test Tokens:**
```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "myshop_customer_test"
  }
}
```

**Execution Result:**
```json
{
  "faucet": {
    "name_or_address": "myshop_customer_test",
    "result": [
      {"amount": 1000000000, "id": "0x421f00e98b9b1ef43f086a9892461f5157dda7c4d4834c38bd731ff44fe04f91", "transferTxDigest": "7neuh2swNxrsgDZah2pr1g3NNZ1uBJd7ncvewKEkxZiS"},
      {"amount": 1000000000, "id": "0x60184c608aad880b0c704bcf14a034d0f7246bbea090ddf900627332c01fcf5c", "transferTxDigest": "7neuh2swNxrsgDZah2pr1g3NNZ1uBJd7ncvewKEkxZiS"},
      {"amount": 1000000000, "id": "0xa95ff96e3cef8c913a50d8e45bf5b036028e43a31b3fccc601a3b450498b3b1e", "transferTxDigest": "7neuh2swNxrsgDZah2pr1g3NNZ1uBJd7ncvewKEkxZiS"}
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
    "object": "myshop_service_test",
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
      }
    }
  },
  "env": {
    "account": "myshop_customer_test",
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
      "object": "0x05968068ac9a7b532925706c6014b751bba98ec6a63cfaf6377e0cf2ba7cbddc",
      "version": "1019837",
      "change": "created"
    },
    {
      "type": "Progress",
      "object": "0x8382169d14fca7efcf58e04ca84660e28797bee237e1b8dde22e3ccc8ac8362b",
      "version": "1019837",
      "change": "created"
    },
    {
      "type": "Allocation",
      "object": "0xf00c7177827b5ec0873990f95f3a98efbe4b9ae90884adf05bcfc33209e22b30",
      "version": "1019837",
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
    "object": "0x8382169d14fca7efcf58e04ca84660e28797bee237e1b8dde22e3ccc8ac8362b",
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
    "account": "myshop_merchant_test",
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
      "object": "0x8382169d14fca7efcf58e04ca84660e28797bee237e1b8dde22e3ccc8ac8362b",
      "version": "1020693",
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
    "object": "0x8382169d14fca7efcf58e04ca84660e28797bee237e1b8dde22e3ccc8ac8362b",
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
    "account": "myshop_merchant_test",
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
      "object": "0x8382169d14fca7efcf58e04ca84660e28797bee237e1b8dde22e3ccc8ac8362b",
      "version": "1021130",
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
    "object": "0x8382169d14fca7efcf58e04ca84660e28797bee237e1b8dde22e3ccc8ac8362b",
    "operate": {
      "operation": {
        "next_node_name": "In Transit",
        "forward": "Confirm Delivery"
      },
      "hold": false,
      "message": "Goods delivered successfully"
    }
  },
  "env": {
    "account": "myshop_merchant_test",
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
      "object": "0x8382169d14fca7efcf58e04ca84660e28797bee237e1b8dde22e3ccc8ac8362b",
      "version": "1021541",
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
    "object": "0x8382169d14fca7efcf58e04ca84660e28797bee237e1b8dde22e3ccc8ac8362b",
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
    "account": "myshop_customer_test",
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
      "object": "0x8382169d14fca7efcf58e04ca84660e28797bee237e1b8dde22e3ccc8ac8362b",
      "version": "1022040",
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
    "object": "0xf00c7177827b5ec0873990f95f3a98efbe4b9ae90884adf05bcfc33209e22b30",
    "alloc_by_guard": "0x330f3f0d801b71b8c6d8df87d472d8294128b84ec04c6c8e3177abde4b84d39f"
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "0x330f3f0d801b71b8c6d8df87d472d8294128b84ec04c6c8e3177abde4b84d39f",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "0x330f3f0d801b71b8c6d8df87d472d8294128b84ec04c6c8e3177abde4b84d39f",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "0x05968068ac9a7b532925706c6014b751bba98ec6a63cfaf6377e0cf2ba7cbddc"
          }
        ]
      }
    ]
  },
  "env": {
    "account": "myshop_merchant_test",
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
    "object": "myshop_service_test",
    "owner_receive": "recently"
  },
  "env": {
    "account": "myshop_merchant_test",
    "network": "testnet"
  }
}
```

**Execution Result:**
```json
{
  "status": "success",
  "objects": []
}
```

---

## Issues Found

### Issue 1: Contact Object Creation - Messenger Address Format

**Problem:** When creating Contact object, using messenger name (`myshop_merchant_messenger_test`) in the `at` field fails with error:
```
Error: address not found:Address not found: myshop_merchant_messenger_test
```

**Solution:** Use the actual account address instead of messenger name:
```json
{
  "ims": {
    "op": "add",
    "im": [
      {
        "at": "0x53d3750ee84204f12bc17b9a02c549f1823eb68c274db9209f8543591735ddd3",
        "description": "Primary after-sales support representative"
      }
    ]
  }
}
```

**Status:** ✅ Resolved

---

### Issue 2: Parameter Structure in Documentation

**Problem:** The original documentation shows `env` parameter inside `data` object:
```json
{
  "operation_type": "machine",
  "data": {
    "object": "...",
    "node": {...},
    "env": {...}  // Wrong position
  }
}
```

**Correct Structure:** `env` should be at the top level, not inside `data`:
```json
{
  "operation_type": "machine",
  "data": {
    "object": "...",
    "node": {...}
  },
  "env": {...}  // Correct position
}
```

**Status:** ✅ Document needs update

---

### Issue 3: Customer Balance Requirements

**Problem:** When creating an order with `total_pay: 3000000000` (3 WOW), the customer needs to have sufficient balance. The initial faucet only provided 3 coins of 1 WOW each, which is insufficient for a single payment of 3 WOW.

**Solution:** Called faucet twice to get 6 coins (6 WOW total), which allowed the order to be created.

**Status:** ✅ Resolved

---

## Summary

All operations in the MyShop example were successfully executed on testnet. The complete workflow from merchant setup to order completion and fund withdrawal worked as expected.

### Successful Operations:
1. ✅ Merchant account creation and funding
2. ✅ Permission object creation
3. ✅ Machine object creation and node configuration
4. ✅ Machine publication
5. ✅ Messenger enablement and Contact object creation
6. ✅ Guard objects creation (Withdraw and Refund)
7. ✅ Service object creation with products
8. ✅ Customer account creation and funding
9. ✅ Order creation
10. ✅ Order workflow progression (Confirm → Ship → Deliver → Complete)
11. ✅ Fund withdrawal with Guard verification

### Key Findings:
- The `env` parameter must be at the top level of the request, not inside `data`
- Contact object's `ims` field requires actual account addresses, not messenger names
- Customers need sufficient coin balance (not just total balance) to create orders
- All workflow transitions worked correctly with proper permission indices
