# MyShop Advanced Order Flow Test Results (New)

## Test execution started: 2026-06-09

---

## Test Overview

### Test Objective
Validate all order flow scenarios in the MyShop Advanced e-commerce system, including:
- **Wonderful Branch**: Customer rates wonderful after shipping
- **Delivery Branch**: Standard delivery confirmation flow
- **Lost Branch**: Package lost scenario
- **Return Branch**: Product return scenarios (Receipt Return & Non-receipt Return)
- **Order Cancel**: Order cancellation before shipping

### Test Environment
- **Network**: Testnet
- **Service**: `three_body_signature_service_v2`
- **Machine**: `myshop_advanced_machine_v2`
- **Permission**: `myshop_permission_v2`
- **Arbitration**: `myshop_arbitration_v2`
- **Reward**: `myshop_reward_v2`

### Test Accounts
| Account | Role |
|---------|------|
| myshop_merchant | Store Owner |
| myshop_customer | Customer |

### Reference Guards
| Guard Name | Purpose |
|------------|---------|
| **Machine Guards** | |
| machine_merkle_root_v2 | Verify Merkle Root string length = 64 |
| machine_service_order_v2 | Verify order belongs to Service and current node is valid |
| machine_time_10d_v2 | Verify 10-day timeout (864000000 ms) for auto-completion |
| machine_time_2d_v2 | Verify 2-day timeout (172800000 ms) for auto-completion |
| **Service Guards** | |
| service_merchant_win_v2 | Verify order at merchant winning nodes (Order Complete, Wonderful, Return Fail) |
| service_customer_win_v2 | Verify order at customer winning nodes (Lost, Return Complete) |
| **Reward Guards** | |
| reward_wonderful_v2 | Verify order at Wonderful node for 10000 reward |
| reward_lost_v2 | Verify order at Lost node for 20000 compensation |
| reward_shipping_timeout_v2 | Verify order at Shipping node > 2 days for 30000 compensation |

---

## Machine Node Structure

```
"" (Start)
  ├── Confirm Order ──> "Order Confirmed"
  │                      │
  │                      ├── Confirm Signature and Submit Merkle Root ──> "Shipping"
  │                      │                                                   │
  │                      │                                                   ├── Confirm Delivery with Merkle Root ──> "Delivery Complete"
  │                      │                                                   │                          │
  │                      │                                                   │                          └── Auto Complete from Delivery ──> "Order Complete" [END: Merchant Wins]
  │                      │                                                   │
  │                      │                                                   ├── Rate as Wonderful ──> "Wonderful" [END: Customer Claims Reward]
  │                      │                                                   │
  │                      │                                                   ├── Auto Complete from Shipping ──> "Order Complete" [END: Merchant Wins]
  │                      │                                                   │
  │                      │                                                   ├── Report Lost ──> "Lost" [END: Customer Claims Compensation]
  │                      │                                                   │    └── Confirm Lost with Merkle Root (dual-sig)
  │                      │                                                   │
  │                      │                                                   ├── Request Return ──> "Non-receipt Return"
  │                      │                                                   │    └── Confirm Return with Merkle Root (dual-sig)
  │                      │                                                   │         │
  │                      │                                                   │         ├── Submit Return Merkle Root ──> "Return Complete" [END: Customer Wins]
  │                      │                                                   │         │    └── Confirm Return Received (dual-sig)
  │                      │                                                   │         │
  │                      │                                                   │         └── Submit Return Merkle Root ──> "Return Complete" [END: Customer Wins]
  │                      │                                                   │              └── Confirm Return Received (dual-sig)
  │                      │                                                   │
  │                      │                                                   └── Request Return with Receipt ──> "Receipt Return"
  │                      │                                                        └── Confirm Return Address with Merkle Root (dual-sig)
  │                      │                                                             │
  │                      │                                                             ├── Timeout Return Not Received ──> "Return Fail" [END: Merchant Wins]
  │                      │                                                             │
  │                      │                                                             ├── Submit Return Merkle Root ──> "Return Complete" [END: Customer Wins]
  │                      │                                                             │    └── Confirm Return Received (dual-sig)
  │                      │                                                             │
  │                      │                                                             └── Submit Return Merkle Root ──> "Return Complete" [END: Customer Wins]
  │                      │                                                                  └── Confirm Return Received (dual-sig)
  │                      │
  └── Cancel Order ──> "Order Cancel" [END: Order Cancelled]
```

### End States (Terminal Nodes)
| Node | Description | Fund Allocation | Reward/Compensation |
|------|-------------|-----------------|---------------------|
| **Order Complete** | Order completed successfully | 100% Merchant | None |
| **Wonderful** | Customer rated wonderful | 100% Merchant | Customer: 10,000 WOW |
| **Lost** | Package lost reported | 100% Customer | Customer: 20,000 WOW |
| **Return Complete** | Return processed successfully | 100% Customer | None |
| **Return Fail** | Return rejected/timeout | 100% Merchant | None |
| **Order Cancel** | Order cancelled before shipping | 100% Customer | None |

---

## Test Scenarios

### Path 1: Order Cancel
**Flow**: Start → Order Cancel
**Description**: Order is cancelled by merchant before shipping
**Expected**: Order Cancelled, funds returned to customer

### Path 2: Standard Delivery
**Flow**: Start → Order Confirmed → Shipping → Delivery Complete → Order Complete
**Description**: Standard delivery flow with customer confirmation
**Expected**: Order Complete, merchant wins allocation

### Path 3: Wonderful Rating
**Flow**: Start → Order Confirmed → Shipping → Wonderful
**Description**: Customer rates wonderful after shipping
**Expected**: Wonderful node, customer can claim 10,000 WOW reward

### Path 4: Lost Package
**Flow**: Start → Order Confirmed → Shipping → Lost
**Description**: Package reported lost (dual-signature)
**Expected**: Lost node, customer wins allocation + 20,000 WOW compensation

### Path 5: Non-receipt Return → Complete
**Flow**: Start → Order Confirmed → Shipping → Non-receipt Return → Return Complete
**Description**: Return without receipt, successfully completed
**Expected**: Return Complete, customer wins allocation

### Path 6: Receipt Return → Complete
**Flow**: Start → Order Confirmed → Shipping → Delivery Complete → Receipt Return → Return Complete
**Description**: Return with receipt, successfully completed
**Expected**: Return Complete, customer wins allocation

### Path 7: Receipt Return → Fail (Timeout)
**Flow**: Start → Order Confirmed → Shipping → Delivery Complete → Receipt Return → Return Fail
**Description**: Return with receipt, timeout waiting for return
**Expected**: Return Fail, merchant wins allocation

---

## Test Execution

### Path 1: Order Cancel

#### Step 1: Create Order

**Request:**
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v2",
    "order_new": {
      "buy": {
        "items": [
          {
            "name": "The Three-Body Problem + Author Signature",
            "stock": 1,
            "wip_hash": "sha256:1db6dc86d8be68bafb33418628a30e7bfcbce48de9c099d3d9cb21def3af8b43"
          }
        ],
        "total_pay": {
          "balance": 5000000000
        },
        "order_info": "To my dear friend - keep exploring the universe"
      },
      "namedNewOrder": {
        "name": "test_cancel_order_v2",
        "replaceExistName": true
      },
      "namedNewAllocation": {
        "name": "test_cancel_allocation_v2",
        "replaceExistName": true
      },
      "namedNewProgress": {
        "name": "test_cancel_progress_v2",
        "replaceExistName": true
      }
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

#### Step 2: Cancel Order

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_cancel_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Order Cancel",
        "forward": "Cancel Order"
      },
      "hold": false,
      "message": "Order cancelled by merchant before shipping"
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

### Path 2: Standard Delivery

#### Step 1: Create Order

**Request:**
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v2",
    "order_new": {
      "buy": {
        "items": [
          {
            "name": "The Three-Body Problem + Author Signature",
            "stock": 1,
            "wip_hash": "sha256:1db6dc86d8be68bafb33418628a30e7bfcbce48de9c099d3d9cb21def3af8b43"
          }
        ],
        "total_pay": {
          "balance": 5000000000
        }
      },
      "namedNewOrder": {
        "name": "test_delivery_order_v2",
        "replaceExistName": true
      },
      "namedNewAllocation": {
        "name": "test_delivery_allocation_v2",
        "replaceExistName": true
      },
      "namedNewProgress": {
        "name": "test_delivery_progress_v2",
        "replaceExistName": true
      }
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

#### Step 2: Confirm Order

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Order Confirmed",
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

#### Step 3: Start Shipping

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Shipping",
        "forward": "Confirm Signature and Submit Merkle Root"
      },
      "hold": false,
      "message": "Shipping started - signature completed and Merkle Root submitted"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "machine_service_order_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "machine_service_order_v2",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "test_delivery_order_v2"
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

#### Step 4: Confirm Delivery

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Delivery Complete",
        "forward": "Confirm Delivery with Merkle Root"
      },
      "hold": false,
      "message": "Delivery confirmed with Merkle Root - goods received"
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

#### Step 5: Complete Order

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Order Complete",
        "forward": "Auto Complete from Delivery"
      },
      "hold": false,
      "message": "Order completed"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "machine_time_2d_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "machine_time_2d_v2",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "test_delivery_progress_v2"
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

#### Step 6: Merchant Withdraws Funds

**Request:**
```json
{
  "operation_type": "order",
  "data": {
    "object": "test_delivery_order_v2",
    "withdraw": {
      "guard": "service_merchant_win_v2"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "service_merchant_win_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "service_merchant_win_v2",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "test_delivery_progress_v2"
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

---

### Path 3: Wonderful Rating

#### Step 1-3: Same as Standard Delivery

Create order, confirm order, start shipping.

#### Step 4: Rate Wonderful

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Wonderful",
        "forward": "Rate as Wonderful"
      },
      "hold": false,
      "message": "Rated as Wonderful - very satisfied with the service"
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

#### Step 5: Claim Wonderful Reward

**Request:**
```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v2",
    "claim": "reward_wonderful_v2"
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "reward_wonderful_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "reward_wonderful_v2",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "test_delivery_order_v2"
          }
        ]
      }
    ]
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

#### Step 6: Merchant Withdraws Funds

Same as Path 2 Step 6.

---

### Path 4: Lost Package

#### Step 1-3: Same as Standard Delivery

Create order, confirm order, start shipping.

#### Step 4: Report Lost (Customer)

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Lost",
        "forward": "Report Lost"
      },
      "hold": false,
      "message": "Package reported as lost by customer"
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

#### Step 5: Confirm Lost (Merchant)

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Lost",
        "forward": "Confirm Lost with Merkle Root"
      },
      "hold": false,
      "message": "Lost confirmed with Merkle Root"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "machine_merkle_root_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "machine_merkle_root_v2",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "String",
            "value": "0123456789012345678901234567890123456789012345678901234567890123"
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

#### Step 6: Claim Lost Compensation

**Request:**
```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v2",
    "claim": "reward_lost_v2"
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "reward_lost_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "reward_lost_v2",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "test_delivery_order_v2"
          }
        ]
      }
    ]
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

#### Step 7: Customer Withdraws Funds

**Request:**
```json
{
  "operation_type": "order",
  "data": {
    "object": "test_delivery_order_v2",
    "withdraw": {
      "guard": "service_customer_win_v2"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "service_customer_win_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "service_customer_win_v2",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "test_delivery_progress_v2"
          }
        ]
      }
    ]
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

---

### Path 5: Non-receipt Return

#### Step 1-3: Same as Standard Delivery

Create order, confirm order, start shipping.

#### Step 4: Request Return (Customer)

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Non-receipt Return",
        "forward": "Request Return"
      },
      "hold": false,
      "message": "Return requested without receipt"
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

#### Step 5: Confirm Return (Merchant)

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Non-receipt Return",
        "forward": "Confirm Return with Merkle Root"
      },
      "hold": false,
      "message": "Return confirmed with Merkle Root"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "machine_merkle_root_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "machine_merkle_root_v2",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "String",
            "value": "0123456789012345678901234567890123456789012345678901234567890123"
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

#### Step 6: Submit Return Merkle Root (Customer)

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Return Complete",
        "forward": "Submit Return Merkle Root"
      },
      "hold": false,
      "message": "Return shipping Merkle Root submitted"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "machine_merkle_root_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "machine_merkle_root_v2",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "String",
            "value": "abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd"
          }
        ]
      }
    ]
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

#### Step 7: Confirm Return Received (Merchant)

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Return Complete",
        "forward": "Confirm Return Received"
      },
      "hold": false,
      "message": "Return received and confirmed"
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

#### Step 8: Customer Withdraws Funds

Same as Path 4 Step 7.

---

### Path 6: Receipt Return → Complete

#### Step 1-4: Same as Standard Delivery

Create order, confirm order, start shipping, confirm delivery.

#### Step 5: Request Return with Receipt (Customer)

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Receipt Return",
        "forward": "Request Return with Receipt"
      },
      "hold": false,
      "message": "Return requested after delivery"
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

#### Step 6: Confirm Return Address (Merchant)

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Receipt Return",
        "forward": "Confirm Return Address with Merkle Root"
      },
      "hold": false,
      "message": "Return address confirmed with Merkle Root"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "machine_merkle_root_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "machine_merkle_root_v2",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "String",
            "value": "0123456789012345678901234567890123456789012345678901234567890123"
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

#### Step 7-8: Submit Return Merkle Root and Confirm

Same as Path 5 Steps 6-7.

#### Step 9: Customer Withdraws Funds

Same as Path 4 Step 7.

---

### Path 7: Receipt Return → Fail

#### Step 1-6: Same as Path 6

Create order, confirm order, start shipping, confirm delivery, request return, confirm return address.

#### Step 7: Timeout Return Not Received (Merchant)

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_delivery_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Return Fail",
        "forward": "Timeout Return Not Received"
      },
      "hold": false,
      "message": "Return failed - timeout waiting for return"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "machine_time_10d_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "machine_time_10d_v2",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "test_delivery_progress_v2"
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

#### Step 8: Merchant Withdraws Funds

Same as Path 2 Step 6.

---

## Issues Fixed from Original Document

1. **Guard Name Consistency**: 
   - Fixed: `guard_wonderful_v2` → `reward_wonderful_v2`
   - Fixed: `guard_lost_v2` → `reward_lost_v2`

2. **Forward Name Alignment**: 
   - All forward names now match the machine_nodes.json definitions
   - Example: "Submit Messenger Merkle Root" → "Confirm Order"

3. **Submission Format**:
   - All submissions now use correct `value_type` format (string names like "Address", "String")
   - All guard references use object names instead of addresses

4. **Operation Sequence**:
   - Clarified that merchant withdraws funds after Order Complete/Wonderful/Return Fail
   - Clarified that customer withdraws funds after Lost/Return Complete

5. **replaceExistName Flag**: 
   - All namedNew and namedNewOrder operations include `replaceExistName: true`

---

## Key Operation Patterns

### Customer Operations
- Use `operation_type: "service"` for creating orders
- Use `operation_type: "progress"` for reporting lost, rating wonderful, requesting return
- Use `operation_type: "reward"` for claiming rewards
- Use `operation_type: "order"` for withdrawing funds (when customer wins)

### Merchant Operations
- Use `operation_type: "progress"` for confirming order, shipping, confirming delivery, completing order
- Use `operation_type: "order"` for withdrawing funds (when merchant wins)

### Submission Format
```json
{
  "type": "submission",
  "guard": [
    {
      "object": "guard_name",
      "impack": true
    }
  ],
  "submission": [
    {
      "guard": "guard_name",
      "submission": [
        {
          "identifier": 0,
          "b_submission": true,
          "value_type": "Address",
          "value": "object_name"
        }
      ]
    }
  ]
}
```
