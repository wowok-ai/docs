# MyShop Advanced E-Commerce Example

An advanced e-commerce example demonstrating escrow with multiple order fund allocation modes, multi-party allocation, arbitration with voting guards, and WIP-based product verification.

> **View Actual Execution Results**: See [MyShop\_Advanced\_TestResults.md](MyShop_Advanced_TestResults.md) for real testnet execution results with actual object addresses and transaction outputs.

***

## Core Requirements & Features

| Requirement                    | Description                                                               | Implementation                                                                        |
| ------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **WIP-Verified Product**       | Single product with WIP file hash verification                            | `three_body.wip` integrated into Service sales                                        |
| **Milestone-Based Workflow**   | Order progress tracked through Machine workflow nodes                     | Multi-path workflow with delivery confirmation, wonderful rating, and return handling |
| **Simplified Fund Allocation** | Clear fund distribution model with reward incentives                      | 100% to merchant on completion/wonderful, 100% to customer on lost/return             |
| **Reward System**              | Incentive mechanism for excellent service and lost compensation           | Reward pool with guard-based verification                                             |
| **Messenger-Based Logistics**  | Privacy-preserving shipping info exchange via Messenger + Merkle Root     | Tracking numbers shared privately; only Merkle Root submitted on-chain                |
| **Multi-Path Returns**         | Support for non-receipt return, receipt return, and lost package handling | Different return paths based on delivery status                                       |

### Key Design Decisions

1. **Single Product Model**: Only one WIP-verified product to simplify the example while demonstrating full capabilities
2. **Privacy-Preserving Logistics**: Merchant handles logistics independently using any logistics provider. Tracking numbers are shared privately via Messenger (not on-chain), with only Merkle Root submitted on-chain as proof of communication
3. **Reward Incentive Model**: Additional reward pool for excellent service (Wonderful reward) and compensation for lost packages
4. **Multi-Path Workflow**: Order can complete through normal delivery, wonderful rating, or various return paths
5. **Dual-Signature Returns**: Return processes require both customer and merchant confirmation (threshold=2)

### Important Design Principle: "Who Completes the Key Action, Who Submits the Proof"

To ensure accountability and prevent disputes, the party who completes the critical action must submit the on-chain proof:

- **Merchant Shipping**: Merchant receives customer's shipping address via Messenger and sends back tracking number → **Merchant submits Merkle Root** proving communication completed
- **Customer Return**: Customer sends return tracking number to merchant via Messenger → **Customer submits Merkle Root** proving communication completed
- **Lost Confirmation**: Both parties confirm lost package through dual-signature mechanism

This principle ensures that the party responsible for the action bears the responsibility of recording it on-chain, creating a clear audit trail for potential arbitration.

***

## Overview

This advanced example demonstrates an enterprise-grade e-commerce system with:

- **Single WIP-Verified Product**: One product listing ("The Three-Body Problem + Author Signature") with WIP file verification
- **Multi-Path Workflow**: Order progress with delivery confirmation, wonderful rating, lost handling, and multiple return paths
- **Dual-Signature Returns**: Return processes require confirmation from both customer and merchant
- **Reward Incentive System**: Reward pool for excellent service and compensation for lost packages
- **Time-Based Auto-Completion**: Orders auto-complete after time thresholds

***

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MyShop Advanced E-Commerce System                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────┐    ┌─────────────────────────┐                │
│  │    Merchant System      │    │    Customer System      │                │
│  ├─────────────────────────┤    ├─────────────────────────┤                │
│  │ • Permission            │    │ • Place Order           │                │
│  │ • Machine (Milestone)   │    │ • Track Progress        │                │
│  │ • Service (WIP Catalog) │◄──►│ • Confirm Delivery      │                │
│  │ • Allocation (Escrow)   │    │ • Rate Wonderful        │                │
│  │ • Guards (Verification) │    │ • Request Return        │                │
│  │ • Reward Pool           │    │ • Submit Arbitration    │                │
│  └─────────────────────────┘    └─────────────────────────┘                │
│                                                                             │
│  Fund Flow: Merchant + Reward Pool (Incentives)                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Order Workflow (Multi-Path Milestone-Based)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Order Lifecycle Workflow                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  INITIAL NODES (No Previous Node):                                          │
│  ┌─────────────────┐    ┌─────────────────┐                                 │
│  │ Order Confirmed │    │  Order Cancel   │                                 │
│  │ (Merchant)      │    │  (Merchant)     │                                 │
│  │ Guard: Merkle64 │    │ Guard: Merkle64 │                                 │
│  └────────┬────────┘    └─────────────────┘                                 │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │    Shipping     │◄── Previous: Order Confirmed                           │
│  │   (Merchant)    │                                                        │
│  │ Guard: Service  │                                                        │
│  │ + Signature +   │                                                        │
│  │   Merkle64      │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ├──────────────────┬──────────────────┐                          │
│           ▼                  ▼                  ▼                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │Delivery Complete│ │    Wonderful    │ │  Order Complete │               │
│  │   (Customer)    │ │   (Customer)    │ │  (Merchant)     │               │
│  │    No Guard     │ │    No Guard     │ │ Time >= 10 days │               │
│  └────────┬────────┘ └────────┬────────┘ │ (from Shipping) │               │
│           │                   │          └─────────────────┘               │
│           │                   │                   ▲                        │
│           │                   │                   │                        │
│           │                   └───────────────────┘                        │
│           │                           │                                    │
│           │                    Time >= 2 days                              │
│           │                    (from Delivery)                             │
│           │                                                                │
│           ├──────────────────┬──────────────────┐                         │
│           ▼                  ▼                  ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐              │
│  │      Lost       │ │Non-receipt Return│ │Receipt Return  │              │
│  │  (Dual-Sig,     │ │  (Dual-Sig,      │ │ (Dual-Sig,      │              │
│  │   Threshold=2)  │ │   Threshold=2)   │ │  Threshold=2)   │              │
│  │ User: No Guard  │ │ User: No Guard   │ │ User: No Guard  │              │
│  │ Merchant:Merkle │ │ Merchant:Merkle  │ │ Merchant:Merkle │              │
│  └─────────────────┘ └────────┬────────┘ └────────┬────────┘              │
│                               │                   │                       │
│                               │                   ▼                       │
│                               │          ┌─────────────────┐              │
│                               │          │  Return Fail    │              │
│                               │          │  (Merchant)     │              │
│                               │          │ Time >= 10 days │              │
│                               │          └─────────────────┘              │
│                               │                   │                       │
│                               │                   ▼                       │
│                               │          ┌─────────────────┐              │
│                               └────────►│  Return Complete │              │
│                                          │  (Dual-Sig,      │              │
│                                          │  Threshold=2)    │              │
│                                          │ User: Merkle64   │              │
│                                          │ Merchant: No Guard  │              │
│                                          └─────────────────┘              │
│                                                                             │
│  FUND ALLOCATION:                                                          │
│  ├─ Merchant 100%: Order Complete | Wonderful | Return Fail                │
│  └─ Customer 100%: Lost | Return Complete                                   │
│                                                                             │
│  REWARD COMPENSATION (from Reward Pool):                                   │
│  ├─ Wonderful Node: 10000 reward                                           │
│  ├─ Lost Node: 20000 compensation                                          │
│  └─ Shipping Timeout (>2 days): 20000 compensation                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Normal Flow**: Order Created → Order Confirmed (with Merkle Root) → Shipping Started → Delivery Complete/Wonderful/Order Complete
**Return Flows**:

- Non-receipt Return: From Shipping, dual-signature
- Receipt Return: From Delivery Complete, dual-signature → Return Complete or Return Fail
  **Fund Release**:
- Merchant 100%: Order Complete, Wonderful, Return Fail
- Customer 100%: Lost, Return Complete
  **Reward/Compensation**:
- Wonderful Node: 10000 reward from pool
- Lost Node: 20000 compensation from pool

***

## Part 1: Build Order and Rationale

Understanding the correct order for creating WoWok objects is crucial for a successful deployment. This section explains the dependency chain and why objects must be created in a specific sequence.

### Object Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Object Creation Dependencies                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Phase 1: Foundation Objects                                                │
│  ═══════════════════════════                                                │
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                                │
│  │   Permission    │    │   Accounts      │                                │
│  │ (myshop_perm_   │    │ (myshop_merchant│                                │
│  │     v1)         │    │  myshop_customer)│                               │
│  └────────┬────────┘    └─────────────────┘                                │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │     Machine     │◄─── Requires: Permission                              │
│  │(myshop_advanced │                                                        │
│  │  _machine_v1)   │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  Phase 2: Service Creation (Empty)                                          │
│  ═══════════════════════════════════                                        │
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │     Service     │◄─── Requires: Permission                              │
│  │(three_body_sig  │     Publish: FALSE (get address first)                │
│  │ _service_v1)    │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  Phase 3: Guard Creation                                                    │
│  ═══════════════════════                                                    │
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ guard_merkle_   │    │ guard_service_  │    │ guard_delivery_ │         │
│  │   root_v1       │    │ signature_v1    │    │ complete_v1     │         │
│  └─────────────────┘    └────────┬────────┘    └─────────────────┘         │
│                                  │                                          │
│                                  ▼                                          │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ guard_merchant_ │    │ guard_customer_ │    │ guard_time_10d  │         │
│  │   win_v1        │    │   win_v1        │    │     _v1         │         │
│  └─────────────────┘    └─────────────────┘    └────────┬────────┘         │
│                                                         │                   │
│                                                         ▼                   │
│                                               ┌─────────────────┐          │
│                                               │ guard_time_2d   │          │
│                                               │     _v1         │          │
│                                               └─────────────────┘          │
│                                                                             │
│  Phase 4: Arbitration Creation                                              │
│  ═══════════════════════════════                                            │
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │   Arbitration   │◄─── Independent, but needs Service binding            │
│  │myshop_arbitration│                                                        │
│  │      _v1        │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  Phase 5: Service Configuration                                             │
│  ════════════════════════════════                                           │
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │ Update Service  │◄─── Add: order_allocators, sales, arbitrations        │
│  │  and Publish    │     Requires: All Guards, Arbitration                 │
│  └─────────────────┘                                                        │
│                                                                             │
│  Phase 6: Reward Pool                                                       │
│  ═════════════════════                                                      │
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │     Reward      │◄─── Requires: Service (for guard verification)        │
│  │myshop_reward_v1 │     Add: reward_guards for Wonderful/Lost/Timeout     │
│  └─────────────────┘                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why This Order Matters

| Phase | Object               | Dependencies    | Reason                                                                                                        |
| ----- | -------------------- | --------------- | ------------------------------------------------------------------------------------------------------------- |
| 1     | **Permission**       | None            | Permission is the foundation. Machine and Service both reference a permission object for access control.      |
| 1     | **Machine**          | Permission      | Machine requires a permission object to define who can advance workflow nodes.                                |
| 2     | **Service (Empty)**  | Permission      | Create Service without publishing first to obtain its address. This address is needed for Guard verification. |
| 3     | **Guards**           | Service Address | Guards must verify that orders belong to the correct Service. They query Service address and Progress state.  |
| 4     | **Arbitration**      | None            | Arbitration is independent but needs to be bound to Service. Create before Service update.                    |
| 5     | **Service (Update)** | Guards, Arb     | Update Service with order_allocators, arbitrations that reference Guards and Arbitration. Then publish.       |
| 6     | **Reward**           | Service, Guards | Reward pool needs Service address for Guard verification and guards for claim validation.                     |

### Key Design Decisions

1. **Permission First**: Every major object (Machine, Service) requires a permission object. Create this first.
2. **Machine Before Service**: While Service doesn't directly reference Machine, orders created from Service will use Machine for workflow progression.
3. **Service Address Before Guards**: Guards verify `order.service == service_address`. Create Service first (unpublished), get address, then create Guards.
4. **Guards Before Service Update**: Service's `order_allocators` field references guards for fund distribution logic.
5. **Arbitration Before Service Update**: Arbitration must be created before Service update so it can be bound to Service.
6. **Service Publishing Last**: Only publish Service after all guards and arbitration are ready and order_allocators are configured.
7. **Reward Last**: Reward references Service address in guards for claim verification. Create Shipping timeout guard after Service is available.

### Simplified Build Sequence

```
Phase 1: Foundation
├── 1. Create Permission (myshop_permission_v1)
│   └── Add permission indexes (1010, 1011)
│
└── 2. Create Machine (myshop_advanced_machine_v1)
    └── Add all nodes (Order Confirmed, Order Cancel, Shipping, 
        Delivery Complete, Wonderful, Order Complete, Lost, 
        Non-receipt Return, Receipt Return, Return Fail, Return Complete)

Phase 2: Service Creation
└── 3. Create Service (three_body_signature_service_v1)
    ├── Publish: FALSE
    └── Record the Service address for Guard creation

Phase 3: Guard Creation
└── 4. Create All Guards
    ├── guard_merkle_root_v1 (verify string length = 64)
    ├── guard_service_signature_v1 (verify order service + signature + merkle)
    ├── guard_delivery_complete_v1 (verify node = Delivery Complete)
    ├── guard_wonderful_v1 (verify node = Wonderful)
    ├── guard_lost_v1 (verify node = Lost)
    ├── guard_return_complete_v1 (verify node = Return Complete)
    ├── guard_return_fail_v1 (verify node = Return Fail)
    ├── guard_merchant_win_v1 (verify node in [Order Complete, Wonderful, Return Fail])
    ├── guard_customer_win_v1 (verify node in [Lost, Return Complete])
    ├── guard_time_10d_v1 (time >= 10 days)
    ├── guard_time_2d_v1 (time >= 2 days)
    └── guard_shipping_timeout_v1 (Shipping node time >= 2 days)

Phase 4: Arbitration Creation
└── 5. Create Arbitration (myshop_arbitration_v1)
    └── Final dispute resolution mechanism

Phase 5: Service Configuration
└── 6. Update and Publish Service
    ├── Add order_allocators (merchant_win, customer_win)
    ├── Add sales (Three-Body Problem product)
    ├── Add arbitrations binding
    └── Publish service

Phase 6: Reward Pool
└── 7. Create Reward (myshop_reward_v1)
    ├── Deposit initial balance
    ├── Create guard_shipping_timeout_v1
    └── Add reward_guards (Wonderful: 10000, Lost: 20000, Shipping Timeout: 20000)
```

***

## Part 2: Merchant System Setup

### Prerequisites

Reuse existing accounts from basic MyShop:

- Account: `myshop_merchant` (store owner)
- Account: `myshop_customer` (customer)

Ensure both accounts have sufficient testnet WOW tokens.

***

### Step 1: Create Permission Object

Create a new permission object for the advanced shop.

**Prompt**: Create permission object "myshop\_permission\_v1".

```json
{
  "operation_type": "permission",
  "data": {
    "namedNew": {
      "name": "myshop_permission_v1"
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

***

### Step 2: Add Custom Permissions

Add custom permission indexes for advanced operations.

**Permission Index 1010**: Order Confirmed + Order Cancel (Merchant operations for order confirmation/cancellation)

```json
{
  "operation_type": "permission",
  "data": {
    "object": "myshop_permission_v1",
    "remark": {
      "op": "set",
      "index": 1010,
      "remark": "Order Confirmed and Order Cancel - Merchant confirms or cancels order with Merkle Root"
    },
    "table": {
      "op": "add perm by index",
      "index": 1010,
      "entity": {
        "entities": [{"name_or_address": "myshop_merchant"}]
      }
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Permission Index 1011**: Shipping + Lost + Non-receipt Return + Receipt Return + Return Complete + Return Fail + Order Complete (Merchant logistics operations)

```json
{
  "operation_type": "permission",
  "data": {
    "object": "myshop_permission_v1",
    "remark": {
      "op": "set",
      "index": 1011,
      "remark": "Merchant logistics operations - Shipping, Returns, Lost handling, Order Complete"
    },
    "table": {
      "op": "add perm by index",
      "index": 1011,
      "entity": {
        "entities": [{"name_or_address": "myshop_merchant"}]
      }
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

***

### Step 3: Create Machine (Multi-Path Workflow)

Create a new Machine for the multi-path order processing workflow.

**Prompt**: Create a Machine named "myshop\_advanced\_machine\_v1" with permission "myshop\_permission\_v1".

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "myshop_advanced_machine_v1",
      "permission": "myshop_permission_v1"
    },
    "description": "Multi-path order processing with delivery confirmation, wonderful rating, and return handling"
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

***

### Step 3.1: Add Machine Nodes

Add all workflow nodes to the Machine.

**Node 1: Order Confirmed** (Initial node, no previous node)

```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_advanced_machine_v1",
    "nodes": {
      "op": "add",
      "nodes": [
        {
          "name": "Order Confirmed",
          "pairs": [
            {
              "permission": 1010,
              "forward": "Submit Messenger Merkle Root"
            }
          ],
          "threshold": 1
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

**Node 2: Order Cancel** (Initial node, no previous node)

```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_advanced_machine_v1",
    "nodes": {
      "op": "add",
      "nodes": [
        {
          "name": "Order Cancel",
          "pairs": [
            {
              "permission": 1010,
              "forward": "Submit Cancellation Merkle Root"
            }
          ],
          "threshold": 1
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

**Node 3: Shipping** (Previous: Order Confirmed)

```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_advanced_machine_v1",
    "nodes": {
      "op": "add",
      "nodes": [
        {
          "name": "Shipping",
          "pairs": [
            {
              "permission": 1011,
              "forward": "Confirm Signature and Submit Merkle Root",
              "guard": "guard_service_signature_merkle_v1"
            }
          ],
          "threshold": 1
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

**Node 4: Delivery Complete** (Previous: Shipping)

```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_advanced_machine_v1",
    "nodes": {
      "op": "add",
      "nodes": [
        {
          "name": "Delivery Complete",
          "pairs": [
            {
              "permission": 0,
              "forward": "Confirm Receipt",
              "guard": "guard_delivery_complete_v1"
            }
          ],
          "threshold": 1
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

**Node 5: Wonderful** (Previous: Shipping)

```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_advanced_machine_v1",
    "nodes": {
      "op": "add",
      "nodes": [
        {
          "name": "Wonderful",
          "pairs": [
            {
              "permission": 0,
              "forward": "Rate Wonderful",
              "guard": "guard_wonderful_v1"
            }
          ],
          "threshold": 1
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

**Node 6: Order Complete** (Previous: Shipping or Delivery Complete)

```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_advanced_machine_v1",
    "nodes": {
      "op": "add",
      "nodes": [
        {
          "name": "Order Complete",
          "pairs": [
            {
              "permission": 1011,
              "forward": "Auto Complete from Shipping",
              "guard": "guard_order_complete_v1"
            },
            {
              "permission": 1011,
              "forward": "Auto Complete from Delivery",
              "guard": "guard_order_complete_v1"
            }
          ],
          "threshold": 1
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

**Node 7: Lost** (Previous: Shipping, Dual-signature)

```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_advanced_machine_v1",
    "nodes": {
      "op": "add",
      "nodes": [
        {
          "name": "Lost",
          "pairs": [
            {
              "permission": 0,
              "forward": "Report Lost",
              "guard": "guard_lost_v1"
            },
            {
              "permission": 1011,
              "forward": "Confirm Lost with Merkle Root",
              "guard": "guard_lost_v1"
            }
          ],
          "threshold": 2
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

**Node 8: Non-receipt Return** (Previous: Shipping, Dual-signature)

```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_advanced_machine_v1",
    "nodes": {
      "op": "add",
      "nodes": [
        {
          "name": "Non-receipt Return",
          "pairs": [
            {
              "permission": 0,
              "forward": "Request Return"
            },
            {
              "permission": 1011,
              "forward": "Confirm Return with Merkle Root"
            }
          ],
          "threshold": 2
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

**Node 9: Receipt Return** (Previous: Delivery Complete, Dual-signature)

```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_advanced_machine_v1",
    "nodes": {
      "op": "add",
      "nodes": [
        {
          "name": "Receipt Return",
          "pairs": [
            {
              "permission": 0,
              "forward": "Request Return with Receipt"
            },
            {
              "permission": 1011,
              "forward": "Confirm Return Address with Merkle Root"
            }
          ],
          "threshold": 2
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

**Node 10: Return Fail** (Previous: Receipt Return)

```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_advanced_machine_v1",
    "nodes": {
      "op": "add",
      "nodes": [
        {
          "name": "Return Fail",
          "pairs": [
            {
              "permission": 1011,
              "forward": "Timeout Return Not Received",
              "guard": "guard_return_fail_v1"
            }
          ],
          "threshold": 1
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

**Node 11: Return Complete** (Previous: Receipt Return or Non-receipt Return, Dual-signature)

```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_advanced_machine_v1",
    "nodes": {
      "op": "add",
      "nodes": [
        {
          "name": "Return Complete",
          "pairs": [
            {
              "permission": 0,
              "forward": "Submit Return Merkle Root",
              "guard": "guard_return_complete_v1"
            },
            {
              "permission": 1011,
              "forward": "Confirm Return Received",
              "guard": "guard_return_complete_v1"
            }
          ],
          "threshold": 2
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

***

### Step 4: Create Empty Service (Get Address First)

Create Service without publishing to obtain its address for Guard creation.

**Prompt**: Create empty service "three\_body\_signature\_service\_v1" (do not publish yet).

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "three_body_signature_service_v1",
      "permission": "myshop_permission_v1"
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

**Record the Service address** from the response. It will be needed for Guard creation.

***

### Step 5: Create Guards

All guards must verify that orders belong to the Service. The Service address is: `0xb4ac7cd039380244807e3ce98f2c5489cb5cfb35d750174e0207a5d265ad5f92`

#### Guard 1: Verify Merkle Root Length (64 characters)

**Prompt**: Create guard "guard\_merkle\_root\_v1" to verify Merkle Root is 64 characters.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_merkle_root_v1",
      "tags": ["ecommerce", "merkle", "verification"]
    },
    "description": "Verify submitted Merkle Root string length is exactly 64 characters",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "String",
        "name": "merkle_root"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_equal",
        "nodes": [
          {
            "type": "query",
            "query": 1104,
            "object": {
              "identifier": 0
            },
            "parameters": []
          },
          {
            "type": "value",
            "value": 64
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

#### Guard 2: Verify Service + Signature + Merkle Root (for Shipping)

**Prompt**: Create guard "guard\_service\_signature\_merkle\_v1" for Shipping verification.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_service_signature_merkle_v1",
      "tags": ["ecommerce", "shipping", "verification"]
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
        "value": "0xb4ac7cd039380244807e3ce98f2c5489cb5cfb35d750174e0207a5d265ad5f92",
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

#### Guard 3: Verify Node is Delivery Complete

**Prompt**: Create guard "guard\_delivery\_complete\_v1".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_delivery_complete_v1",
      "tags": ["ecommerce", "delivery", "verification"]
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

#### Guard 4: Verify Node is Wonderful

**Prompt**: Create guard "guard\_wonderful\_v1".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_wonderful_v1",
      "tags": ["ecommerce", "wonderful", "verification"]
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

#### Guard 5: Verify Node is Lost

**Prompt**: Create guard "guard\_lost\_v1".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_lost_v1",
      "tags": ["ecommerce", "lost", "verification"]
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

#### Guard 6: Verify Node is Return Complete

**Prompt**: Create guard "guard\_return\_complete\_v1".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_return_complete_v1",
      "tags": ["ecommerce", "return", "verification"]
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

#### Guard 7: Verify Node is Return Fail

**Prompt**: Create guard "guard\_return\_fail\_v1".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_return_fail_v1",
      "tags": ["ecommerce", "return", "fail"]
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

#### Guard 8: Verify Node is Order Complete

**Prompt**: Create guard "guard\_order\_complete\_v1".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_order_complete_v1",
      "tags": ["ecommerce", "complete", "verification"]
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

#### Guard 9: Merchant Win Condition

**Prompt**: Create guard "guard\_merchant\_win\_v1" for fund allocation.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_merchant_win_v1",
      "tags": ["ecommerce", "allocation", "merchant"]
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
        "value": "0xb4ac7cd039380244807e3ce98f2c5489cb5cfb35d750174e0207a5d265ad5f92",
        "name": "service_address"
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
                    "type": "value",
                    "value": "Order Complete"
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
                    "type": "value",
                    "value": "Wonderful"
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
                    "type": "value",
                    "value": "Return Fail"
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

#### Guard 10: Customer Win Condition

**Prompt**: Create guard "guard\_customer\_win\_v1" for fund allocation.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_customer_win_v1",
      "tags": ["ecommerce", "allocation", "customer"]
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
        "value": "0xb4ac7cd039380244807e3ce98f2c5489cb5cfb35d750174e0207a5d265ad5f92",
        "name": "service_address"
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
                    "type": "value",
                    "value": "Lost"
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
                    "type": "value",
                    "value": "Return Complete"
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

#### Guard 11: Time >= 10 Days

**Prompt**: Create guard "guard\_time\_10d\_v1".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_time_10d_v1",
      "tags": ["ecommerce", "time", "10days"]
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
        "type": "logic_greater_or_equal",
        "nodes": [
          {
            "type": "math_subtract",
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

#### Guard 12: Time >= 2 Days

**Prompt**: Create guard "guard\_time\_2d\_v1".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_time_2d_v1",
      "tags": ["ecommerce", "time", "2days"]
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
        "type": "logic_greater_or_equal",
        "nodes": [
          {
            "type": "math_subtract",
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

***

### Step 6: Create Arbitration Object

Create an Arbitration object as the final on-chain mechanism for protecting user rights.

**Prompt**: Create arbitration object "myshop_arbitration_v1".

```json
{
  "operation_type": "arbitration",
  "data": {
    "namedNew": {
      "name": "myshop_arbitration_v1"
    },
    "description": "Arbitration for MyShop Advanced - Final dispute resolution mechanism"
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

***

### Step 7: Update Service with Allocators, Arbitration and Publish

Update Service with order_allocators, sales, arbitration binding, and publish.

**Prompt**: Update service "three_body_signature_service_v1" with order allocators, arbitration and publish.

```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v1",
    "order_allocators": [
      {
        "guard": "guard_merchant_win_v1",
        "sharing": [
          {
            "who": { "Signer": "signer" },
            "sharing": 10000,
            "mode": "Rate"
          }
        ]
      },
      {
        "guard": "guard_customer_win_v1",
        "sharing": [
          {
            "who": { "GuardIdentifier": 0 },
            "sharing": 10000,
            "mode": "Rate"
          }
        ]
      }
    ],
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
    "arbitrations": ["myshop_arbitration_v1"],
    "customer_required": ["phone", "email", "shipping_address"],
    "publish": true
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

***

### Step 8: Create Reward Pool

Create reward pool with guards for Wonderful, Lost, and Shipping timeout compensation.

**Prompt**: Create reward object "myshop\_reward\_v1" with initial balance.

```json
{
  "operation_type": "reward",
  "data": {
    "namedNew": {
      "name": "myshop_reward_v1"
    },
    "description": "Reward pool for MyShop advanced - Wonderful rewards (10000), Lost compensation (20000), Shipping timeout compensation (20000)",
    "deposit": {
      "balance": 150000000
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

***

### Step 9: Create Shipping Timeout Guard

Create a guard to verify Shipping node time exceeds 2 days (172800000 ms).

**Prompt**: Create guard "guard\_shipping\_timeout\_v1".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "guard_shipping_timeout_v1",
      "tags": ["ecommerce", "shipping", "timeout"]
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
                "query": 1563,
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
            "type": "logic_greater_or_equal",
            "nodes": [
              {
                "type": "math_subtract",
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

***

### Step 10: Add Reward Guards

Add reward guards for Wonderful (10000), Lost (20000), and Shipping timeout (20000) compensation.

**Prompt**: Add reward guard for Wonderful node (10000 reward).

```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v1",
    "guard_add": [
      {
        "guard": "guard_wonderful_v1",
        "for_guard": {
          "amount": 10000,
          "reward_object": "0xe9f8dc4b4f71466d51a47893596d65ee81970d03f070d3e01ba80c36e5c44ade"
        }
      }
    ]
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Prompt**: Add reward guard for Lost node (20000 compensation).

```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v1",
    "guard_add": [
      {
        "guard": "guard_lost_v1",
        "recipient": {"Signer": "signer"},
        "amount": {"type": "Fixed", "value": 20000}
      }
    ]
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Prompt**: Add reward guard for Shipping timeout (20000 compensation).

```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v1",
    "guard_add": [
      {
        "guard": "guard_shipping_timeout_v1",
        "recipient": {"Signer": "signer"},
        "amount": {"type": "Fixed", "value": 20000}
      }
    ]
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

***

## Part 3: Customer Order Flow

### Step 1: Create Order with WIP Verification

Customer places an order for "The Three-Body Problem + Author Signature" with WIP hash verification.

**Prompt**: Customer "myshop\_customer" creates an order.

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
        },
        "order_info": "To my dear friend - keep exploring the universe"
      },
      "namedNewOrder": {
        "name": "myshop_order_v1"
      },
      "namedNewAllocation": {
        "name": "myshop_allocation_v1"
      },
      "namedNewProgress": {
        "name": "myshop_progress_v1"
      }
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet"
  }
}
```

***

### Step 2: Merchant Confirms Order

Merchant confirms order by submitting Merkle Root.

**Prompt**: Merchant confirms order with Merkle Root.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
    "operate": {
      "operation": {
        "next_node_name": "Order Confirmed",
        "forward": "Submit Messenger Merkle Root"
      },
      "hold": false,
      "message": "Order confirmed - Merkle Root submitted"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "guard_merkle_root_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_merkle_root_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "String",
            "value": "0xabc123...def456"
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

***

### Step 3: Merchant Starts Shipping

Merchant starts shipping after signature service is completed.

**Prompt**: Merchant starts shipping with signature verification and Merkle Root.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
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
        "object": "guard_service_signature_merkle_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_service_signature_merkle_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "myshop_order_v1"
          },
          {
            "identifier": 3,
            "b_submission": true,
            "value_type": "String",
            "value": "0xdef789...abc012"
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

***

### Step 4: Customer Confirms Delivery

Customer confirms receipt of goods.

**Prompt**: Customer confirms delivery.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
    "operate": {
      "operation": {
        "next_node_name": "Delivery Complete",
        "forward": "Confirm Receipt"
      },
      "hold": false,
      "message": "Delivery confirmed - goods received"
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

***

### Step 5: Customer Rates Wonderful

Alternatively, customer can rate as Wonderful (very satisfied).

**Prompt**: Customer rates order as Wonderful.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
    "operate": {
      "operation": {
        "next_node_name": "Wonderful",
        "forward": "Rate Wonderful"
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

***

### Step 6: Claim Wonderful Reward

Customer claims Wonderful reward from reward pool.

**Prompt**: Customer claims Wonderful reward.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v1",
    "claim": {
      "guard": "guard_wonderful_v1",
      "reward_object": "myshop_order_v1"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "guard_wonderful_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_wonderful_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "myshop_order_v1"
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

***

### Step 7: Order Auto-Complete or Manual Complete

Order can auto-complete after time thresholds or be manually completed.

**From Shipping (10 days)**:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
    "operate": {
      "operation": {
        "next_node_name": "Order Complete",
        "forward": "Auto Complete from Shipping"
      },
      "hold": false,
      "message": "Order auto-completed after 10 days"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "guard_time_10d_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_time_10d_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "myshop_progress_v1"
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

**From Delivery Complete (2 days)**:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
    "operate": {
      "operation": {
        "next_node_name": "Order Complete",
        "forward": "Auto Complete from Delivery"
      },
      "hold": false,
      "message": "Order auto-completed after 2 days from delivery"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "guard_time_2d_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_time_2d_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "myshop_progress_v1"
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

***

### Step 8: Lost Package Handling

If package is lost, customer reports and merchant confirms.

**Step 8.1: Customer Reports Lost**

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
    "operate": {
      "operation": {
        "next_node_name": "Lost",
        "forward": "Report Lost"
      },
      "hold": false,
      "message": "Package reported as lost"
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Step 8.2: Merchant Confirms Lost**

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
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
        "object": "guard_merkle_root_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_merkle_root_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "String",
            "value": "0xlost123...merkle456"
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

**Step 8.3: Claim Lost Compensation**

```json
{
  "operation_type": "reward",
  "data": {
    "object": "myshop_reward_v1",
    "claim": {
      "guard": "guard_lost_v1",
      "reward_object": "myshop_order_v1"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "guard_lost_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_lost_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "myshop_order_v1"
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

***

### Step 9: Return Process (Receipt Return)

Customer requests return after delivery confirmation.

**Step 9.1: Customer Requests Return**

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
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

**Step 9.2: Merchant Confirms Return Address**

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
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
        "object": "guard_merkle_root_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_merkle_root_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "String",
            "value": "0xreturn789...addr012"
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

**Step 9.3: Customer Submits Return Merkle Root**

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
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
        "object": "guard_merkle_root_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_merkle_root_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "String",
            "value": "0xshipreturn...track345"
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

**Step 9.4: Merchant Confirms Return Received**

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
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

***

### Step 10: Return Fail (Timeout)

If customer doesn't return within 10 days, merchant can mark as Return Fail.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_progress_v1",
    "operate": {
      "operation": {
        "next_node_name": "Return Fail",
        "forward": "Timeout Return Not Received"
      },
      "hold": false,
      "message": "Return failed - timeout"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "guard_time_10d_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_time_10d_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "myshop_progress_v1"
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

***

## Part 4: Fund Allocation

### Merchant Wins (Order Complete, Wonderful, Return Fail)

When order reaches Order Complete, Wonderful, or Return Fail, merchant can withdraw funds.

**Prompt**: Merchant withdraws funds when winning condition is met.

```json
{
  "operation_type": "order",
  "data": {
    "object": "myshop_order_v1",
    "withdraw": {
      "guard": "guard_merchant_win_v1"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "guard_merchant_win_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_merchant_win_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "myshop_order_v1"
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

### Customer Wins (Lost, Return Complete)

When order reaches Lost or Return Complete, customer can withdraw funds.

**Prompt**: Customer withdraws funds when winning condition is met.

```json
{
  "operation_type": "order",
  "data": {
    "object": "myshop_order_v1",
    "withdraw": {
      "guard": "guard_customer_win_v1"
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "guard_customer_win_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "guard_customer_win_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "myshop_order_v1"
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

***

## Summary

This advanced e-commerce example demonstrates:

1. **Multi-Path Workflow**: Orders can complete through normal delivery, wonderful rating, or various return paths
2. **Dual-Signature Returns**: Return processes require confirmation from both parties (threshold=2)
3. **Time-Based Auto-Completion**: Orders auto-complete after time thresholds (10 days from shipping, 2 days from delivery)
4. **Guard-Based Verification**: All state transitions and fund allocations are protected by guards
5. **Reward Incentive System**: Wonderful ratings receive rewards, lost packages and shipping delays receive compensation
6. **Arbitration Support**: Service binds to Arbitration object for final on-chain dispute resolution
7. **Privacy-Preserving Logistics**: Only Merkle Roots are submitted on-chain, actual tracking info is shared via Messenger
8. **Flexible Fund Allocation**: Clear rules for merchant win (Order Complete, Wonderful, Return Fail) vs customer win (Lost, Return Complete)

The system ensures accountability through the "Who Completes the Key Action, Who Submits the Proof" principle, creating a clear audit trail for all critical actions.
