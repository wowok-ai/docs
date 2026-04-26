# MyShop Advanced - Order Flow Test Results

## Test execution started: 2026-04-26

---

## Test Plan

### Phase 1: Document Priority Tests (按文档顺序)
- ✅ Step 1: Create Order with WIP Verification
- ⏳ Step 2: Merchant Confirms Order
- ⏳ Step 3: Merchant Starts Shipping
- ⏳ Step 4: Customer Confirms Delivery
- ⏳ Step 5: Customer Rates Wonderful
- ⏳ Step 6: Claim Wonderful Reward
- ⏳ Part 4: Fund Allocation (Merchant Wins)

### Phase 2: Additional Branch Tests (拓展分支)
- ⏳ 新建订单2 - 测试Lost分支 + 资金提取 (Customer Wins)
- ⏳ 新建订单3 - 测试Return分支 + 资金提取
- ⏳ 新建订单4 - 测试Shipping Timeout补偿

---

## Part 2: Customer Order Flow

### Prerequisites
- Account: `myshop_merchant` (store owner)
- Account: `myshop_customer` (customer)
- Service: `three_body_signature_service_v1` (already published)

---

### Step 1: Create Order with WIP Verification ✓ Success!

**Request:**
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v1",
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
        "name": "myshop_advanced_order_v1"
      },
      "namedNewAllocation": {
        "name": "myshop_advanced_allocation_v1"
      },
      "namedNewProgress": {
        "name": "myshop_advanced_progress_v1"
      }
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet"
  }
}
```

**Response:**
- Order created: `0xd1e1d935879012c919d7fb06153c8c4a72a32eb21e0aa85f0def81eeb105cd72`
- Name: `myshop_advanced_order_v1`
- Allocation: `myshop_advanced_allocation_v1` (`0x77471116dce21e8cce74e3a2923b32cddb30b22cd6b1dfefae230dd4385254c3`)
- Progress: `myshop_advanced_progress_v1`
- Total payment: 5000000000 WOW

---
