# MyShop Advanced - Order Flow Test Results

## Test execution started: 2026-04-26

---

## Test Overview

### Test Objective
Validate all order flow scenarios in the MyShop Advanced e-commerce system, including:
- **Wonderful Branch**: Customer rates wonderful after shipping
- **Delivery Branch**: Standard delivery confirmation flow
- **Lost Branch**: Package lost scenario
- **Return Branch**: Product return scenarios (Receipt Return & Non-receipt Return)
- **Shipping Timeout**: Auto-compensation for delayed shipping
- **Order Cancel**: Order cancellation before shipping

### Test Environment
- **Network**: Testnet
- **Service**: `three_body_signature_service_v2`
- **Machine**: `myshop_advanced_machine_v2`
- **Permission**: `myshop_permission_v2`
- **Arbitration**: `myshop_arbitration_v2`
- **Reward**: `myshop_reward_v2`

### Test Accounts
| Account | Address | Role |
|---------|---------|------|
| myshop_merchant | 0x7d3e3932174570675a7e45dc0f5fb073b39214846e5a955d37049f1a0f23dd9b | Store Owner |
| myshop_customer | 0x06906ffa2eccd04c9f8ec0feb8456115d5bffbddcee1d211288cf8fe1848987c | Customer |

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
  ├── Submit Messenger Merkle Root ──> "Order Confirmed"
  │                                      │
  │                                      ├── Confirm Signature and Submit Merkle Root ──> "Shipping"
  │                                      │                                                   │
  │                                      │                                                   ├── Confirm Receipt ──> "Delivery Complete"
  │                                      │                                                   │                          │
  │                                      │                                                   │                          └── Auto Complete from Delivery ──> "Order Complete" [END: Merchant Wins]
  │                                      │                                                   │
  │                                      │                                                   ├── Rate Wonderful ──> "Wonderful" [END: Customer Claims Reward]
  │                                      │                                                   │
  │                                      │                                                   ├── Auto Complete from Shipping ──> "Order Complete" [END: Merchant Wins]
  │                                      │                                                   │
  │                                      │                                                   ├── Report Lost ──> "Lost" [END: Customer Claims Compensation]
  │                                      │                                                   │    └── Confirm Lost with Merkle Root (dual-sig)
  │                                      │                                                   │
  │                                      │                                                   ├── Request Return ──> "Non-receipt Return"
  │                                      │                                                   │    └── Confirm Return with Merkle Root (dual-sig)
  │                                      │                                                   │         │
  │                                      │                                                   │         ├── Submit Return Merkle Root ──> "Return Complete" [END: Customer Wins]
  │                                      │                                                   │         │    └── Confirm Return Received (dual-sig)
  │                                      │                                                   │         │
  │                                      │                                                   │         └── Submit Return Merkle Root ──> "Return Complete" [END: Customer Wins]
  │                                      │                                                   │              └── Confirm Return Received (dual-sig)
  │                                      │                                                   │
  │                                      │                                                   └── Request Return with Receipt ──> "Receipt Return"
  │                                      │                                                        └── Confirm Return Address with Merkle Root (dual-sig)
  │                                      │                                                             │
  │                                      │                                                             ├── Timeout Return Not Received ──> "Return Fail" [END: Merchant Wins]
  │                                      │                                                             │
  │                                      │                                                             ├── Submit Return Merkle Root ──> "Return Complete" [END: Customer Wins]
  │                                      │                                                             │    └── Confirm Return Received (dual-sig)
  │                                      │                                                             │
  │                                      │                                                             └── Submit Return Merkle Root ──> "Return Complete" [END: Customer Wins]
  │                                      │                                                                  └── Confirm Return Received (dual-sig)
  │                                      │
  └── Submit Cancellation Merkle Root ──> "Order Cancel" [END: Order Cancelled]
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

## Test Plan: All Possible Paths

### Path 1: Order Cancel
**Flow**: Start → Order Cancel
**Description**: Order is cancelled by merchant before shipping
**Expected**: Order Cancelled, funds returned to customer

### Path 2: Standard Delivery
**Flow**: Start → Order Confirmed → Shipping → Delivery Complete → Order Complete
**Description**: Standard delivery flow with customer confirmation
**Expected**: Order Complete, merchant wins allocation

### Path 3: Auto-Complete from Delivery
**Flow**: Start → Order Confirmed → Shipping → Delivery Complete → [Timeout 10d] → Order Complete
**Description**: Auto-complete after timeout from Delivery Complete
**Expected**: Order Complete, merchant wins allocation

### Path 4: Wonderful Rating
**Flow**: Start → Order Confirmed → Shipping → Wonderful
**Description**: Customer rates wonderful after shipping
**Expected**: Wonderful node, customer can claim 10,000 WOW reward

### Path 5: Lost Package
**Flow**: Start → Order Confirmed → Shipping → Lost
**Description**: Package reported lost (dual-signature)
**Expected**: Lost node, customer wins allocation + 20,000 WOW compensation

### Path 6: Auto-Complete from Shipping
**Flow**: Start → Order Confirmed → Shipping → [Timeout 10d] → Order Complete
**Description**: Auto-complete after timeout from Shipping
**Expected**: Order Complete, merchant wins allocation

### Path 7: Non-receipt Return → Complete
**Flow**: Start → Order Confirmed → Shipping → Non-receipt Return → Return Complete
**Description**: Return without receipt, successfully completed
**Expected**: Return Complete, customer wins allocation

### Path 8: Non-receipt Return → Complete (from Receipt Return path)
**Flow**: Start → Order Confirmed → Shipping → Delivery Complete → Receipt Return → Return Complete
**Description**: Return with receipt, successfully completed
**Expected**: Return Complete, customer wins allocation

### Path 9: Receipt Return → Fail (Timeout)
**Flow**: Start → Order Confirmed → Shipping → Delivery Complete → Receipt Return → [Timeout 10d] → Return Fail
**Description**: Return with receipt, timeout waiting for return
**Expected**: Return Fail, merchant wins allocation

### Path 10: Shipping Timeout Compensation
**Flow**: Start → Order Confirmed → Shipping → [Timeout 2d] → Customer Compensation
**Description**: Shipping delayed beyond 2 days, customer gets compensation
**Expected**: Customer receives 20,000 WOW compensation

---

## Test Execution Status

| Path # | Path Name | Status | Order ID | Notes |
|--------|-----------|--------|----------|-------|
| 1 | Order Cancel | ✅ Completed | myshop_cancel_order | Successfully cancelled before shipping |
| 2 | Standard Delivery | ⚠️ Partial | myshop_delivery_order | Blocked at Delivery Complete (permission issue) |
| 3 | Auto-Complete from Delivery | ⏸️ Skipped | - | Requires 10-day timeout, guard will fail |
| 4 | Wonderful Rating | ⚠️ Partial | myshop_wonderful_order | Blocked at Wonderful node (guard verification) |
| 5 | Lost Package | ⏳ Pending | - | - |
| 6 | Auto-Complete from Shipping | ⏸️ Skipped | - | Requires 10-day timeout, guard will fail |
| 7 | Non-receipt Return → Complete | ⏳ Pending | - | - |
| 8 | Receipt Return → Complete | ⏳ Pending | - | - |
| 9 | Receipt Return → Fail | ⏸️ Skipped | - | Requires 10-day timeout, guard will fail |
| 10 | Shipping Timeout Compensation | ⏸️ Skipped | - | Requires 2-day timeout, guard will fail |

**Note**: Paths requiring time-based guards (2-day, 10-day timeouts) are skipped because the guard verification will fail in test environment.

---

## Test Results

### Path 1: Order Cancel ✅

**Status**: Successfully Completed (2026-04-26)

**Order Info**:
- Order: `test_cancel_order_v2`
- Progress: `test_cancel_progress_v2`
- Allocation: `test_cancel_allocation_v2`

**Test Steps**:

#### Step 1: Create Order ✅

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

**Result**: ✅ Order created successfully

---

#### Step 2: Confirm Order ✅

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_cancel_progress_v2",
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

**Result**: ✅ Progress at "Order Confirmed"

---

#### Step 3: Cancel Order ✅

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

**Result**: ✅ Order cancelled successfully, progress at "Order Cancel" node

**End State**: Order Cancelled - funds returned to customer

---

### Path 2: Standard Delivery ⚠️

**Status**: Partially Completed (Blocked at Delivery Complete)

**Order Info**:
- Order: `myshop_delivery_order`
- Progress: `myshop_delivery_progress`
- Allocation: `myshop_delivery_allocation`

**Test Steps**:

#### Step 1: Create Order ✅

**Result**: ✅ Order created successfully

---

#### Step 2: Order Confirmed ✅

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_delivery_progress",
    "operate": {
      "operation": {
        "next_node_name": "Order Confirmed",
        "forward": "Submit Messenger Merkle Root"
      },
      "hold": false,
      "message": "Order confirmed by merchant"
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Result**: ✅ Progress at "Order Confirmed"

---

#### Step 3: Shipping ✅

**Request:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_delivery_progress",
    "operate": {
      "operation": {
        "next_node_name": "Shipping",
        "forward": "Confirm Signature and Submit Merkle Root"
      },
      "hold": false,
      "message": "Shipping started with signature confirmation"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "guard_service_signature_merkle_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_service_signature_merkle_v2",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "myshop_delivery_order"
          },
          {
            "identifier": 3,
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
    "network": "testnet"
  }
}
```

**Result**: ✅ Progress at "Shipping"

---

#### Step 4: Delivery Complete ❌

**Issue**: Guard verification failed

**Error**: `MoveAbort(MoveLocation { module: ModuleId { ... }, function: 6, ... }, 7)`

**Error Code 7**: `E_VERIFY_FAILED` - Guard verification failed

**Analysis**: The guard `guard_delivery_complete_v2` requires specific verification parameters that may not match the current order state.

**Status**: Blocked - cannot proceed to Delivery Complete

---

### Path 4: Wonderful Rating ⚠️

**Status**: Partially Completed (Blocked at Wonderful node)

**Order Info**:
- Order: `myshop_wonderful_order`
- Progress: `myshop_wonderful_progress`
- Allocation: `myshop_wonderful_allocation`

**Test Steps**:

#### Step 1-3: Order Creation → Confirmed → Shipping ✅

Same as Path 2, completed successfully.

---

#### Step 4: Rate Wonderful ❌

**Issue**: Guard verification failed

**Error**: Same as Path 2 - `E_VERIFY_FAILED`

**Analysis**: The guard `guard_wonderful_v2` verification failed. This may be due to:
1. Guard logic checking for specific order conditions not met
2. Missing or incorrect submission parameters
3. Permission configuration issues

**Status**: Blocked - cannot proceed to Wonderful node

---

### Path 4: Lost Package ✅

**Status**: Successfully Completed (2026-04-26)

**Order Info**:
- Order: `test_delivery_order_v2`
- Progress: `test_delivery_progress_v2`
- Allocation: `test_delivery_allocation_v2`

**Test Steps**:

#### Step 1-3: Order Creation → Confirmed → Shipping ✅

Same as Path 2, completed successfully. Progress at "Shipping" node.

---

#### Step 4: Report Lost ✅

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

**Result**: ✅ Progress at "Lost" node

---

#### Step 5: Withdraw Funds via Allocation Guard ✅

**Request:**
```json
{
  "operation_type": "allocation",
  "data": {
    "object": "test_delivery_allocation_v2",
    "alloc_by_guard": "0xf2eae05aec5bc362e7efff6e531e7d4c7f6e4ababc89af6f00b83def6ae485df"
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "0xf2eae05aec5bc362e7efff6e531e7d4c7f6e4ababc89af6f00b83def6ae485df",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "0xf2eae05aec5bc362e7efff6e531e7d4c7f6e4ababc89af6f00b83def6ae485df",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": 1,
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

**Result**: ✅ Funds withdrawn successfully to customer

**End State**: Lost - Customer wins 100% allocation

**Key Findings**:
- User operations (like Report Lost) use `progress` operation type
- Allocation withdrawal uses `alloc_by_guard` with guard address
- Submission format: `value_type` uses numeric codes (1=Address, 2=String, etc.)

---

## Summary

| Path | Status | End State | Notes |
|------|--------|-----------|-------|
| 1 | ✅ Completed | Order Cancel | Full flow tested successfully |
| 2 | ⏳ Pending | - | Standard delivery flow - need dual-sig test |
| 3 | ⏸️ Skipped | - | Time-based guard (10d) - not testable |
| 4 | ✅ Completed | Lost | Customer wins, funds withdrawn successfully |
| 5 | ⏳ Pending | - | Wonderful rating - need Delivery Complete first |
| 6 | ⏸️ Skipped | - | Time-based guard (10d) - not testable |
| 7 | ⚠️ Partial | Non-receipt Return | Dual-sig entry successful, blocked at Return Complete |
| 8 | ⏳ Not Tested | - | Receipt Return |
| 9 | ⏸️ Skipped | - | Time-based guard (10d) - not testable |
| 10 | ⏸️ Skipped | - | Time-based guard (2d) - not testable |

## Key Findings

### Operation Patterns

1. **User Operations** (Customer):
   - Use `operation_type: "progress"`
   - Example: Report Lost, Rate Wonderful, Request Return
   - Account: `myshop_customer`

2. **Merchant Operations**:
   - Use `operation_type: "progress"`
   - Example: Confirm Order, Shipping, Complete Order
   - Account: `myshop_merchant`
   - Often require `permissionIndex: 1000` or `1001`

3. **Allocation Withdrawal**:
   - Use `operation_type: "allocation"`
   - Field: `alloc_by_guard` (use guard address, not name)
   - Requires submission with guard verification

### Submission Format

```json
{
  "type": "submission",
  "guard": [
    {
      "object": "<guard_address>",
      "impack": true
    }
  ],
  "submission": [
    {
      "guard": "<guard_address>",
      "submission": [
        {
          "identifier": 0,
          "b_submission": true,
          "value_type": 1,  // 1=Address, 2=String
          "value": "<value>"
        }
      ]
    }
  ]
}
```

### Value Type Codes

| Code | Type |
|------|------|
| 1 | Address |
| 2 | String |
| 3 | U8 |
| 4 | U16 |
| 5 | U32 |
| 6 | U64 |
| 7 | U128 |
| 8 | U256 |
| 9 | Bool |

## Known Limitations

1. **Time-Based Guards**: Guards requiring time thresholds (2-day, 10-day) cannot be tested as they depend on actual time passage.

2. **Dual-Signature Nodes**: Some nodes (Delivery Complete, Return Complete) require threshold=2, needing both customer and merchant actions.

3. **Guard Verification Issues**: Some guards fail verification (error 7) even with correct parameters. This may be related to node state validation or submission format.

---

## Path 7: Non-receipt Return (Partial)

### Test Flow

**Step 1**: Customer requests return (namedOperator)

```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_wonderful_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Non-receipt Return",
        "forward": "Request Return"
      },
      "message": "Customer requests return without receipt"
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Result**: ✅ Success - First signature recorded

**Step 2**: Merchant confirms return (permissionIndex + guard)

```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_wonderful_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Non-receipt Return",
        "forward": "Confirm Return with Merkle Root"
      },
      "message": "Merchant confirms return request"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [{"object": "machine_merkle_root_v2", "impack": true}],
    "submission": [{
      "guard": "machine_merkle_root_v2",
      "submission": [{
        "identifier": 0,
        "b_submission": true,
        "value_type": 2,
        "value": "abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd"
      }]
    }]
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Result**: ✅ Success - Dual-sig complete, entered Non-receipt Return node

**Step 3**: Customer submits return Merkle Root (namedOperator + guard)

```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_wonderful_progress_v2",
    "operate": {
      "operation": {
        "next_node_name": "Return Complete",
        "forward": "Submit Return Merkle Root"
      },
      "message": "Customer submits return tracking Merkle Root"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [{"object": "machine_merkle_root_v2", "impack": true}],
    "submission": [{
      "guard": "machine_merkle_root_v2",
      "submission": [{
        "identifier": 0,
        "b_submission": true,
        "value_type": 2,
        "value": "fedcbafedcbafedcbafedcbafedcbafedcbafedcbafedcbafedcbafedcbafedcb"
      }]
    }]
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Result**: ❌ Failed - Guard verification error (E_VERIFY_FAILED, code 7)

### Key Findings

1. **Dual-signature mechanism works**: Successfully entered Non-receipt Return node with two signatures
2. **Guard verification issue**: machine_merkle_root_v2 guard fails even with 64-character string
3. **Possible causes**:
   - Guard may require additional node state validation
   - Submission format may need adjustment
   - Guard logic may have additional constraints not visible in query

---

*Test document updated: 2026-04-27*
*Tester: AI Assistant*
