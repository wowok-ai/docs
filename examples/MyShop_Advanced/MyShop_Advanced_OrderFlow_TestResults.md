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
- **Service**: `three_body_signature_service_v2` (0xbfb5fe351fd114d8c77e8d163f3e440b5320aa849d417ca8d72c34762a7d71f9)
- **Machine**: `myshop_advanced_machine_v2` (0xa0b47cbec8cdb8f5358e4b3c2569de3fecb05161d2bce487cd564efa70bf81c0)
- **Permission**: `myshop_permission_v2` (0x4972b33431d3e1969dbbcd9e093c8052c30992492c5ceff5902b48f1a7cb11f8)
- **Arbitration**: `myshop_arbitration_v2` (0xf0fca6d3841793681de4b10ce398897b99cb1b3b59c90a670c5729d38615d7ff)
- **Reward**: `myshop_reward_v2` (0x5d4e9b75bf1b94a77c13aa60487898c5dba3b221a293f0fdd085bee9d20e277a)

### Test Accounts
| Account | Address | Role |
|---------|---------|------|
| myshop_merchant | 0x7d3e3932174570675a7e45dc0f5fb073b39214846e5a955d37049f1a0f23dd9b | Store Owner |
| myshop_customer | 0x06906ffa2eccd04c9f8ec0feb8456115d5bffbddcee1d211288cf8fe1848987c | Customer |

### Reference Guards
| Guard Name | Address | Purpose |
|------------|---------|---------|
| guard_merkle_root_v2 | 0x8644baca380888c11a35a9687b7ceb5611cecaff6a225eeeda1d0f4af792139d | Verify Merkle Root length = 64 |
| guard_service_signature_merkle_v2 | 0xa45f21fdcf987939655da059218e54197365e28bb614f7d9620531219d5886f0 | Verify service, signature, Merkle Root |
| guard_delivery_complete_v2 | 0x6669df3af6abbdfbe6072f354d04d059348a50a87d64a1019c4142739f6050ee | Verify Delivery Complete node |
| guard_wonderful_v2 | 0x42534c40643d04ec4c32821ee33681517e9f56ba5b3839c7a50d4fe2942a203a | Verify Wonderful node |
| guard_lost_v2 | 0xcf91f4877edc06e50bfb1132e96e6c77c66bc8ccd2dbb35457ca089f09113351 | Verify Lost node |
| guard_return_complete_v2 | 0xcc3d931c54419e41037dc4d9b2dd344a14a84c7bdf3c113ca710b978ff84b382 | Verify Return Complete node |
| guard_return_fail_v2 | 0x3b3c5138b9abd5d7843c449ba7e8145ee9d3899a817f0c6703539013ae0ee89c | Verify Return Fail node |
| guard_order_complete_v2 | 0x2b1fae955f63f688e0d03cd68601b52f392133afed106b21183775a60b29d2b8 | Verify Order Complete node |
| guard_merchant_win_v2 | 0xece766c71360200d805abb128f1fb3bf3c9e3eae366352c5de176ab5dd82c1b2 | Verify merchant winning nodes |
| guard_customer_win_v2 | 0x9e6ce67f66c3e96df6b7bb5873da3d5076b3a15bb1d12e9182419f905cebbd15 | Verify customer winning nodes |
| guard_time_10d_v2 | 0x51b290507808df00021825bb436184d34b1be27aed3590493f3d13003e0a3cb1 | Verify 10-day timeout |
| guard_time_2d_v2 | 0x7c69cfae4c0dd64f5e4ce6fedc9053ce3b664e4f3a82d69614649d97459329c4 | Verify 2-day timeout |
| guard_shipping_timeout_v2 | 0x8fdb3fc5f40265491111e5907bca8c4774375e2c0da38f7a2cf95ae7f03c0d94 | Verify shipping timeout |

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
| 1 | Order Cancel | ⏳ Pending | - | - |
| 2 | Standard Delivery | ⏳ Pending | - | - |
| 3 | Auto-Complete from Delivery | ⏳ Pending | - | - |
| 4 | Wonderful Rating | ⏳ Pending | - | - |
| 5 | Lost Package | ⏳ Pending | - | - |
| 6 | Auto-Complete from Shipping | ⏳ Pending | - | - |
| 7 | Non-receipt Return → Complete | ⏳ Pending | - | - |
| 8 | Receipt Return → Complete | ⏳ Pending | - | - |
| 9 | Receipt Return → Fail | ⏳ Pending | - | - |
| 10 | Shipping Timeout Compensation | ⏳ Pending | - | - |

---

## Test Results

*Test results will be populated as tests are executed*

---

*Test document updated: 2026-04-26*
*Tester: AI Assistant*
