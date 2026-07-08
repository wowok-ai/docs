# MyShop E-Commerce Example

A complete e-commerce example demonstrating how to build an online store using WoWok protocol. This guide covers both merchant setup and customer order workflows.

---

## Core Requirements & Features

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| **Product Listing** | Create and manage product/service listings | Service object with pricing, inventory, and WIP integration |
| **Order Workflow** | Automated order processing from creation to completion | Machine with nodes: Order Confirmation → Shipping → In Transit → Completed |
| **Permission Control** | Role-based access for merchant and customer operations | Permission object with custom indexes for merchant operations |
| **Arbitration Support** | Dispute resolution mechanism | Arbitration object for handling order conflicts |
| **WIP Verification** | Product authenticity verification via WIP files | WIP hash stored in Service for customer verification |
| **Customer Communication** | Secure messaging between merchant and customer | Contact objects for pre-sales and after-sales support |

### Key Design Decisions

1. **Workflow-Driven Orders**: Order state transitions controlled by Machine workflow, ensuring predictable processing
2. **Permission-Based Operations**: Merchant operations require specific permission indexes (1000-1002)
3. **Customer Ownership**: Order owners can cancel orders and complete orders via `namedOperator: ""`
4. **Modular Architecture**: Separate objects for Permission, Machine, Service, Arbitration, and Contact

---

## Overview

This example demonstrates a toy store e-commerce system with the following features:

- **Merchant System**: Product listing, order management, workflow automation
- **Customer Experience**: Browse products, place orders, track progress
- **Trust & Security**: Arbitration for disputes, WIP for product verification
- **Workflow Automation**: Machine-driven order processing from confirmation to delivery

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MyShop E-Commerce System                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────┐    ┌─────────────────────────┐                │
│  │    Merchant System      │    │    Customer System      │                │
│  ├─────────────────────────┤    ├─────────────────────────┤                │
│  │ • Permission (Access)   │    │ • Browse Products       │                │
│  │ • Machine (Workflow)    │    │ • Create Order          │                │
│  │ • Service (Products)    │◄──►│ • Send Private Info(*)  │                │
│  │ • Allocation (Payment)  │    │ • Track Progress        │                │
│  │ • Contact (Messaging)   │    │ • Order Complete        │                │
│  └─────────────────────────┘    └─────────────────────────┘                │
│                                                                             │
│  Optional: Arbitration (Dispute Resolution)                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

> **\*** Private information (shipping address, phone number) is sent via encrypted Messenger after order creation, not stored on-chain.

### Order Workflow (Happy Path)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Order     │────►│   Shipping   │────►│  In Transit  │────►│   Completed  │
│ Confirmation │     │              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │                                                            │
       │                    ┌──────────────┐                        │
       └───────────────────►│  Cancelled   │◄───────────────────────┘
         (Cancel Order)     │(Final State) │    (Complete Order)
                            └──────────────┘
```

**Normal Flow**: Order Confirmation → Shipping → In Transit → Completed  
**Alternative**: Order Confirmation → Cancelled (if customer cancels before shipping)

---

## Part 1: Merchant System Setup

This section guides merchants through setting up their online store.

### Prerequisites

Before starting, ensure you have:
- A WoWok account with testnet WOW tokens
- Access to the WoWok MCP server

**Create merchant account:**

**Prompt**: Create a new account named "myshop_merchant" for the store owner.

```json
{
  "gen": {
    "name": "myshop_merchant",
    "replaceExistName": true
  }
}
```

**Get test tokens:**

**Prompt**: Request testnet WOW tokens for account "myshop_merchant".

```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "myshop_merchant"
  }
}
```

---

### Step 1: Create Permission Object

First, create a Permission object to manage access control for your store operations.

**Prompt**: Create a Permission object named "myshop_permission_v2" with tags ["ecommerce", "toys", "shop"] and description "Permission management for MyShop toy store".

```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "myshop_permission_v2",
      "tags": ["ecommerce", "toys", "shop"],
      "onChain": false,
      "replaceExistName": true
    },
    "description": "Permission management for MyShop toy store"
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

---

### Step 2: Create Machine (Order Workflow)

Create a Machine to define the order processing workflow. This includes nodes for order confirmation, shipping, delivery, and completion.

**Prompt**: Create a Machine named "myshop_machine_v2" with permission "myshop_permission_v2" for the toy store workflow.

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "myshop_machine_v2",
      "permission": "myshop_permission_v2",
      "replaceExistName": true
    },
    "description": "Order processing workflow for MyShop toy store"
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

---

### Step 3: Machine Workflow Design

Before adding nodes, let's understand the order processing workflow:

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         MyShop Order Processing Workflow                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌──────────────────┐                                                             │
│   │  Order Created   │◄─────────────────────────────────────────────────────────┐  │
│   │  (Initial State) │                                                              │  │
│   └────────┬─────────┘                                                              │  │
│            │                                                                        │  │
│            ▼                                                                        │  │
│   ┌──────────────────┐     ┌──────────────┐     ┌──────────────┐                   │  │
│   │ Order Confirmation│────►│ Confirm Order│     │ Cancel Order │───────────────────┘  │
│   │    (Node 1)      │     │  (Merchant)  │     │  (Customer)  │                      │
│   │                  │     │  permission  │     │  (Order      │                      │
│   └────────┬─────────┘     │  Index 1000  │     │   Owner)     │                      │
│            │               └──────────────┘     └──────────────┘                      │
│            │                      │                                                  │
│            │                      ▼                                                  │
│            │               ┌──────────────┐                                          │
│            │               │   Threshold  │                                          │
│            │               │     = 1      │                                          │
│            │               └──────┬───────┘                                          │
│            │                      │                                                  │
│            ▼                      ▼                                                  │
│   ┌──────────────────┐                                                             │
│   │     Shipping     │◄─────────────────────────────────────────────────────────┐  │
│   │    (Node 2)      │                                                             │  │
│   │                  │     ┌──────────────┐                                       │  │
│   └────────┬─────────┘────►│  Ship Goods  │                                       │  │
│            │               │  (Merchant)  │                                       │  │
│            │               │  permission  │                                       │  │
│            │               │  Index 1001  │                                       │  │
│            │               └──────────────┘                                       │  │
│            │                      │                                               │  │
│            │                      ▼                                               │  │
│            │               ┌──────────────┐                                       │  │
│            │               │   Threshold  │                                       │  │
│            │               │     = 1      │                                       │  │
│            │               └──────┬───────┘                                       │  │
│            │                      │                                               │  │
│            ▼                      ▼                                               │  │
│   ┌──────────────────┐                                                             │
│   │    In Transit    │◄─────────────────────────────────────────────────────────┐  │
│   │    (Node 3)      │                                                             │  │
│   │                  │     ┌──────────────┐                                       │  │
│   └────────┬─────────┘────►│Confirm Delivery                                      │  │
│            │               │  (Merchant)  │                                       │  │
│            │               │  permission  │                                       │  │
│            │               │  Index 1002  │                                       │  │
│            │               └──────────────┘                                       │  │
│            │                      │                                               │  │
│            │                      ▼                                               │  │
│            │               ┌──────────────┐                                       │  │
│            │               │   Threshold  │                                       │  │
│            │               │     = 1      │                                       │  │
│            │               └──────┬───────┘                                       │  │
│            │                      │                                               │  │
│            ▼                      ▼                                               │  │
│   ┌──────────────────┐                                                             │
│   │    Completed     │◄─────────────────────────────────────────────────────────┐  │
│   │    (Node 4)      │                                                             │  │
│   │                  │     ┌──────────────┐                                       │  │
│   └────────┬─────────┘────►│Complete Order│                                       │  │
│            │               │  (Customer)  │                                       │  │
│            │               │  (Order      │                                       │  │
│            │               │   Owner)     │                                       │  │
│            │               └──────────────┘                                       │  │
│            │                      │                                               │  │
│            │                      ▼                                               │  │
│            │               ┌──────────────┐                                       │  │
│            │               │  Cancelled   │                                       │  │
│            │               │ (Final State)│                                       │  │
│            │               └──────────────┘                                       │  │
│            │                                                                       │  │
│            └───────────────────────────────────────────────────────────────────────┘
│                                                                                     │
│   Legend:                                                                           │
│   ───► = Forward transition (with threshold requirement)                            │
│   ◄─── = Alternative path (cancellation)                                            │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

**Workflow Explanation:**

| Node | Name | Description | Threshold | Forwards |
|------|------|-------------|-----------|----------|
| 1 | Order Confirmation | Initial state after order creation | 0 | Confirm Order (Merchant) |
| 2 | Shipping | Merchant prepares and ships goods | 1 | Ship Goods (Merchant) |
| 3 | In Transit | Goods are being delivered | 1 | Confirm Delivery (Merchant) |
| 4 | Completed | Order successfully completed | 1 | Complete Order (Customer) |
| 5 | Cancelled | Order cancelled by customer (from Order Confirmation) | 0 | Cancel Order (Customer) |

**Permission Index Mapping:**
- `1000` - Merchant confirms order
- `1001` - Merchant ships goods
- `1002` - Merchant confirms delivery

**Order Permission:**
- Use `namedOperator: ""` (empty string) to allow order owner and agents to operate through Order object
- This is the recommended way to give order owners control over their orders

---

### Step 4: Add Workflow Nodes

Add the workflow nodes to the Machine for order processing. The initial pair (prev_node: "") defines transitions from the empty starting state.

**Prompt**: Add workflow nodes to "myshop_machine_v2" including Order Confirmation, Shipping, In Transit, Completed, and Cancelled nodes.

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
        },
        {
          "name": "Cancelled",
          "pairs": [
            {
              "prev_node": "Order Confirmation",
              "threshold": 0,
              "forwards": [
                {
                  "name": "Cancel Order",
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

> **Note**: The "Cancel Order" forward is defined on the "Cancelled" node with `prev_node: "Order Confirmation"`. This means cancellation can only happen AFTER the merchant confirms the order (transitions from "Order Confirmation" to "Cancelled"). The "Cancelled" node is a terminal state with no further forwards.

---

### Step 5: Publish the Machine

Publish the Machine to make it available for creating orders.

**Prompt**: Publish the Machine "myshop_machine_v2" to enable order creation.

```json
{
  "operation_type": "machine",
  "data": {
    "object": "myshop_machine_v2",
    "publish": true
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

---

### Step 6: Create Contact Object for Customer Service

Create a Contact object to enable encrypted communication between customers and the store for after-sales support.

#### 6.1 Enable Merchant Messenger

**Prompt**: Enable messenger for the merchant account.

```json
{
  "messenger": {
    "m": "myshop_merchant_messenger",
    "name_or_account": "myshop_merchant"
  }
}
```

#### 6.2 Create After-Sales Contact Object

**Prompt**: Create a Contact object named "myshop_aftersales_contact_v2" with permission "myshop_permission_v2" for after-sales support.

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "myshop_aftersales_contact_v2",
      "permission": "myshop_permission_v2",
      "replaceExistName": true
    },
    "description": "MyShop after-sales support contact - we're here to help with orders, shipping, and returns",
    "ims": {
      "op": "add",
      "im": [
        {
          "at": "myshop_merchant",
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

> **Note**: The `at` field accepts an **account name** (not messenger name). It will be resolved to the account's address. Alternatively, use the full address directly.

---

### Step 7: Create Guards for Fund Allocation

Before creating the Service, create Guards that validate fund allocation conditions. These Guards ensure funds are only released when specific conditions are met.

#### 7.1 Create Withdraw Guard (Merchant Withdrawal)

Create a Guard that validates the order's Progress has reached the "Completed" node. This Guard uses `convert_witness: 100` (TypeOrderProgress) to query the Order's associated Progress object.

**Prompt**: Create a Guard named "myshop_withdraw_guard_v2" that verifies the order is completed before allowing merchant withdrawal.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "myshop_withdraw_guard_v2",
      "tags": ["order", "completed", "withdraw"],
      "onChain": false,
      "replaceExistName": true
    },
    "description": "Verify order progress is at Completed node for merchant withdrawal",
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
        "value": "Completed",
        "name": "completed_node"
      }
    ],
    "root": {
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
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

**Guard Explanation:**
- **Table Item 0**: Order address (submitted when activating allocation)
- **Table Item 1**: Constant string "Completed" (the target node name)
- **convert_witness: 100**: TypeOrderProgress - converts Order to its associated Progress
- **Query "progress.current"**: Returns the current node name of the Progress
- **logic_equal**: Verifies current node equals "Completed"

> **Note**: The Guard `root` field directly specifies the GuardNode (e.g., `type: "logic_equal"`), not wrapped in a `type: "node"` object.

#### 7.2 Create Refund Guard (Customer Refund)

Create a Guard for customer refunds when order is cancelled.

**Prompt**: Create a Guard named "myshop_refund_guard_v2" for customer refund validation.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "myshop_refund_guard_v2",
      "tags": ["order", "cancelled", "refund"],
      "onChain": false,
      "replaceExistName": true
    },
    "description": "Verify order progress is at Cancelled node for customer refund",
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
        "value": "Cancelled",
        "name": "cancelled_node"
      }
    ],
    "root": {
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
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

---

### Step 8: Create Service (Store)

Create the Service object that represents your online store with products. This step binds all previously created components together.

> **Important**: For Service creation, provide a complete configuration including machine, order_allocators with Guards, and products. The Service will be created and published in a single transaction.

#### 8.1 Understanding Order Allocators

The `order_allocators` configuration defines how order payments are distributed:

| Component | Description |
|-----------|-------------|
| **Guard** | Validates allocation conditions (e.g., order must be completed) |
| **Sharing** | Defines who receives funds and how much |
| **Mode** | "Rate" (percentage), "Amount" (fixed), or "Surplus" |
| **Threshold** | Minimum amount to trigger allocation |

**Recipient Types:**
- `{ "Signer": "signer" }` - Transaction sender (merchant)
- `{ "Entity": { "name_or_address": "..." } }` - Specific address or account name
- `{ "GuardIdentifier": 0 }` - Address from Guard table

#### 8.2 Create and Publish Service

**Prompt**: Create and publish a Service named "myshop_service_v2" with machine "myshop_machine_v2", order allocation using Guards, after-sales contact, and toy products.

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "myshop_service_v2",
      "type_parameter": "0x2::wow::WOW",
      "permission": "myshop_permission_v2",
      "tags": ["ecommerce", "toys", "store"],
      "onChain": false,
      "replaceExistName": true
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
          "wip": "https://wowok.net/test/three_body.wip",
          "wip_hash": ""
        },
        {
          "name": "Little Girls Purse with Accessories",
          "price": 5000000000,
          "stock": 50,
          "suspension": false,
          "wip": "https://wowok.net/test/three_body.wip",
          "wip_hash": ""
        },
        {
          "name": "Tree House Building Set",
          "price": 2000000000,
          "stock": 75,
          "suspension": false,
          "wip": "https://wowok.net/test/three_body.wip",
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

**Important Notes:**
- After publishing, `machine`, `order_allocators`, and `arbitrations` become **immutable**
- Ensure your Guards and allocation logic are correct before publishing
- The `sharing` value of `10000` represents 100% (rate mode uses 0-10000 scale)

---

### Step 9: Update Product Pricing (Optional)

To offer promotional pricing, update product prices using the `sales` operation with `op: "set"`:

**Prompt**: Update the price of "Play Purse Set 35PCS" to 2.4WOW for a promotion.

```json
{
  "operation_type": "service",
  "data": {
    "object": "myshop_service_v2",
    "sales": {
      "op": "set",
      "sales": [
        {
          "name": "Play Purse Set 35PCS",
          "price": 2400000000,
          "stock": 100,
          "suspension": false,
          "wip": "https://wowok.net/test/three_body.wip",
          "wip_hash": ""
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

---

## Part 2: Customer Order Flow

This section guides customers through browsing products, placing orders, and tracking progress.

### Prerequisites

Create a customer account:

**Prompt**: Create a customer account named "myshop_customer".

```json
{
  "gen": {
    "name": "myshop_customer",
    "replaceExistName": true
  }
}
```

**Get test tokens** (request twice to ensure sufficient balance for order + gas fees):

```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "myshop_customer"
  }
}
```

> **Note**: The faucet provides 3 WOW per call. Since orders require payment plus gas fees, request faucet tokens twice to ensure sufficient balance.

---

### Step 1: Query Service Products

Customers can query the Service to see available products.

**Prompt**: Query the Service "myshop_service_v2" to view available products and their details.

```json
{
  "query_type": "onchain_objects",
  "objects": ["myshop_service_v2"],
  "no_cache": true
}
```

---

### Step 2: Create Order (Customer Purchase)

Customer creates an order by purchasing products from the Service.

**Prompt**: Create an order for customer "myshop_customer" to purchase "Play Purse Set 35PCS" from "myshop_service_v2" with payment of 3WOW.

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
      "namedNewOrder": {
        "name": "myshop_test_order"
      },
      "namedNewProgress": {
        "name": "myshop_test_progress"
      },
      "namedNewAllocation": {
        "name": "myshop_test_allocation"
      }
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet"
  }
}
```

---

### Step 2.1: Send Shipping Address via Messenger (Privacy Protection)

After creating the order, the customer sends their shipping address and contact information to the merchant's after-sales support team. This is done securely through the Messenger system to protect privacy - the information is never stored on-chain.

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    Private Information Exchange via Messenger                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌──────────────────┐         End-to-End Encrypted          ┌──────────────────┐  │
│   │                  │◄──────────────────────────────────────►│                  │  │
│   │  myshop_customer │         Messenger Channel              │ myshop_merchant  │  │
│   │  (Customer)      │         (Never on-chain)               │  (After-Sales    │  │
│   │                  │                                        │   Support)      │  │
│   └────────┬─────────┘                                        └────────┬─────────┘  │
│            │                                                           │            │
│            │ 1. Send shipping address                                  │            │
│            │    - Full name                                            │            │
│            │    - Phone number                                         │            │
│            │    - Shipping address                                     │            │
│            │    - Order reference ID                                   │            │
│            │──────────────────────────────────────────────────────────►│            │
│            │                                                           │            │
│            │ 2. Receive confirmation                                   │            │
│            │    - Address verified                                     │            │
│            │    - Delivery ETA                                         │            │
│            │    - Tracking number (when available)                     │            │
│            │◄──────────────────────────────────────────────────────────│            │
│            │                                                           │            │
│   ┌────────▼─────────┐                                        ┌────────▼─────────┐  │
│   │  Customer Info   │                                        │  Support System  │  │
│   │  (Local Storage) │                                        │  (Local Storage) │  │
│   └──────────────────┘                                        └──────────────────┘  │
│                                                                                     │
│   Privacy Guarantees:                                                               │
│   - End-to-end encryption - Only customer and merchant can read                     │
│   - No on-chain storage - Message content never touches blockchain                 │
│   - Verifiable identity - Contact object confirms who you're talking to            │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### 2.1.1 Customer Enables Messenger

**Prompt**: Enable messenger for customer account "myshop_customer" to send private messages.

```json
{
  "messenger": {
    "m": "customer_messenger",
    "name_or_account": "myshop_customer"
  }
}
```

#### 2.1.2 Customer Sends Shipping Information

**Prompt**: Customer "myshop_customer" sends shipping address and contact information to merchant "myshop_merchant" via encrypted messenger.

```json
{
  "operation": "send_message",
  "from": "myshop_customer",
  "to": "myshop_merchant",
  "content": "Order Shipping Information:\n\nOrder ID: 0xa6db...3d5\nProduct: Play Purse Set 35PCS\n\nRecipient: Zhang San\nPhone: 138-0000-0000\nAddress: Building 123, Unit 456, Room 789\n         Chaoyang District, Beijing\n         China, 100000\n\nPlease confirm receipt of this information."
}
```

> **Note**: Replace the Order ID with your actual order object address from Step 2.
>
> **Spam Protection**: The Messenger server allows only ONE message to a stranger (non-friend) before the recipient must reply. If the customer already sent an initial message to the merchant, the merchant must reply first before the customer can send additional messages. Once both parties have exchanged messages, they become "friends" and can send unlimited messages. If you encounter "Spam protection denied: You can only send one stranger message, wait for recipient to reply", have the merchant send a reply first.

#### 2.1.3 Merchant Confirms Receipt

**Prompt**: Merchant "myshop_merchant" views the message and sends confirmation to customer.

```json
{
  "operation": "send_message",
  "from": "myshop_merchant",
  "to": "myshop_customer",
  "content": "Dear Customer,\n\nWe have received your shipping information:\n- Order ID: 0xa6db...3d5 confirmed\n- Shipping address verified\n- Contact phone: 138-0000-0000\n\nYour order will be processed within 24 hours. We'll send you the tracking number once shipped.\n\nThank you for shopping with MyShop!"
}
```

#### 2.1.4 View Conversation History

**Prompt**: View the conversation between customer and merchant to confirm both messages were delivered.

```json
{
  "operation": "watch_messages",
  "filter": {
    "peerAddress": "myshop_merchant",
    "account": "myshop_customer"
  }
}
```

---

### Step 3: Query Order Status

Customer can query the order status and progress.

**Prompt**: Query the order "myshop_test_order" to check its current status and progress.

```json
{
  "query_type": "onchain_objects",
  "objects": ["myshop_test_order"],
  "no_cache": true
}
```

---

### Step 4: Query Progress Status

Check the current workflow node of the order.

**Prompt**: Query the Progress "myshop_test_progress" to see the current workflow node.

```json
{
  "query_type": "onchain_objects",
  "objects": ["myshop_test_progress"],
  "no_cache": true
}
```

---

### Step 5: Merchant Confirms Order

Merchant advances the order from initial state to "Order Confirmation" node.

> **Note**: Use `operation_type: "progress"` with `operate` to advance the workflow. The order is created with an empty initial node "", and the first step is to transition to "Order Confirmation" using "Confirm Order" forward.

**Prompt**: Advance the order "myshop_test_order" progress from initial state to "Order Confirmation" using the "Confirm Order" forward.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_test_progress",
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
    "network": "testnet"
  }
}
```

---

### Step 6: Merchant Ships Order

Merchant ships the order and advances from "Order Confirmation" to "Shipping".

**Prompt**: Advance the order progress from "Order Confirmation" to "Shipping" using the "Ship Goods" forward.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_test_progress",
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
    "network": "testnet"
  }
}
```

---

### Step 7: Confirm Delivery

Merchant or delivery service confirms the order has been delivered.

**Prompt**: Advance the order progress from "Shipping" to "In Transit" using the "Confirm Delivery" forward.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_test_progress",
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
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

---

### Step 8: Customer Completes Order

Customer confirms receipt and completes the order.

**Prompt**: Customer "myshop_customer" completes the order by advancing from "In Transit" to "Completed" node using "Complete Order" forward.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_test_progress",
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
    "network": "testnet"
  }
}
```

---

### Step 9: Merchant Withdraws Funds

After order completion, the merchant needs to:
1. Activate the Allocation by verifying the Guard (order completion status)
2. Withdraw funds from the Service

#### 9.1 Activate Allocation (Guard Verification)

First, activate the Allocation by submitting the Guard verification with the Order ID.

> **Note**: The `alloc_by_guard` and `submission` fields require the actual Guard object address (0x...), not the local name. You can obtain the Guard address from the local mark list or by querying the Guard name.

**Prompt**: Activate allocation "myshop_test_allocation" by verifying the withdraw guard with order "myshop_test_order".

```json
{
  "operation_type": "allocation",
  "data": {
    "object": "myshop_test_allocation",
    "alloc_by_guard": "0x5af9...1074"
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "0x5af9...1074",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "0x5af9...1074",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "0xa6db...3d5",
            "name": "order_address"
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

> **Note**: Replace the Guard address `0x5af9...1074` and Order address `0xa6db...3d5` with your actual object addresses. Use the full 64-character addresses in actual operations.

#### 9.2 Withdraw Funds from Service

After the Allocation is activated, withdraw the funds from the Service.

**Prompt**: Withdraw funds from service "myshop_service_v2" to the merchant account.

```json
{
  "operation_type": "service",
  "data": {
    "object": "myshop_service_v2",
    "owner_receive": "recently"
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

---

## Alternative Flow: Order Cancellation

### Customer Cancels Order

Customer can cancel the order after the merchant confirms it. The "Cancel Order" forward transitions from "Order Confirmation" to "Cancelled". This requires the merchant to first confirm the order (advancing from the initial state "" to "Order Confirmation").

**Step 1**: Merchant confirms the order (advances from "" to "Order Confirmation"):

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_test_progress",
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
    "network": "testnet"
  }
}
```

**Step 2**: Customer cancels the order (advances from "Order Confirmation" to "Cancelled"):

**Prompt**: Customer "myshop_customer" cancels the order after merchant confirmation.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_test_progress",
    "operate": {
      "operation": {
        "next_node_name": "Cancelled",
        "forward": "Cancel Order"
      },
      "hold": false,
      "message": "Order cancelled by customer"
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet"
  }
}
```

> **Note**: Cancellation can only be done from the "Order Confirmation" state (after the merchant confirms the order, but before shipping). Once the order is shipped, cancellation is no longer possible through this forward.

### Customer Refund After Cancellation

After the order is cancelled, the customer can activate the refund allocation using the refund guard:

```json
{
  "operation_type": "allocation",
  "data": {
    "object": "myshop_test_allocation",
    "alloc_by_guard": "0x5792...5d2c"
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "0x5792...5d2c",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "0x5792...5d2c",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "0xa6db...3d5",
            "name": "order_address"
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

> **Note**: Replace the Guard address `0x5792...5d2c` and Order address `0xa6db...3d5` with your actual object addresses.

---

## Alternative Flow: Dispute and Arbitration

This flow handles order disputes through a formal arbitration process. The arbitration state machine has these statuses:
- 0: Principal_confirming (initial)
- 1: Arbitrator_confirming (after dispute submitted)
- 2: Voting (after materials confirmed)
- 3: Arbitrated (after arbitration result provided)
- 4: Objectionable (if principal objects)
- 5: Finished (after compensation claimed)
- 6: Withdrawn (30 days after arbitrated)

### Step 1: Service Compensation Fund Setup

The Service must have a compensation fund balance ≥ the arbitration indemnity amount. The merchant pre-funds this before any disputes.

**Prompt**: Merchant adds 3 WOW to the Service compensation fund.

```json
{
  "operation_type": "service",
  "data": {
    "object": "myshop_service",
    "compensation_fund_add": {"balance": 3000000000}
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

### Step 2: Create Arbitration Object

Create an Arbitration object for handling order disputes.

**Prompt**: Create an Arbitration object named "myshop_arbitration_v2" with permission "myshop_permission_v2" for dispute resolution.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": {
      "name": "myshop_arbitration_v2",
      "type_parameter": "0x2::wow::WOW",
      "permission": "myshop_permission_v2",
      "tags": ["ecommerce", "dispute", "toys"],
      "onChain": false
    },
    "description": "Arbitration system for MyShop toy store disputes",
    "location": "Online arbitration system",
    "fee": 100000000
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

> **Note**: New Arbitration objects are created with `bPaused: true` by default. You must unpause it in the next step before submitting disputes.

### Step 3: Unpause the Arbitration Object

The merchant unpauses the Arbitration object to enable dispute submissions.

**Prompt**: Merchant unpauses the Arbitration object "myshop_arbitration_v2".

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "myshop_arbitration_v2",
    "pause": false
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

### Step 4: Create a Dispute Order

Create a new order for testing the arbitration flow (if you don't have one already).

**Prompt**: Customer "myshop_customer" creates a new order for "Tree House Building Set" for arbitration testing.

```json
{
  "operation_type": "service",
  "data": {
    "object": "myshop_service",
    "order_new": {
      "buy": {
        "items": [
          {
            "name": "Tree House Building Set",
            "stock": 1
          }
        ],
        "total_pay": {"balance": 2000000000}
      },
      "namedNewOrder": {"name": "myshop_arb_order", "replaceExistName": true},
      "namedNewProgress": {"name": "myshop_arb_progress", "replaceExistName": true},
      "namedNewAllocation": {"name": "myshop_arb_allocation", "replaceExistName": true}
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet"
  }
}
```

> **Note**: The WIP hash is auto-computed by the SDK from the Service's WIP URL configuration.

### Step 5: Customer Submits Dispute

The customer submits a dispute against the order, creating an Arb object.

**Prompt**: Customer "myshop_customer" submits a dispute for order "myshop_arb_order" using arbitration "myshop_arbitration_v2".

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "myshop_arbitration_v2",
    "dispute": {
      "order": "myshop_arb_order",
      "description": "Product quality issue - the tree house set arrived damaged",
      "proposition": ["Full refund to customer", "Partial refund 50%", "Replace with new product"],
      "fee": {"balance": 100000000},
      "namedArb": {"name": "myshop_arb_case", "replaceExistName": true}
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet"
  }
}
```

> **Note**: The dispute fee (100000000 = 0.1 WOW) must be ≥ the Arbitration object's fee setting. The Arb object is created with status=1 (Arbitrator_confirming).

### Step 6: Merchant Confirms Materials

The merchant confirms the dispute materials are valid and sets the voting deadline.

**Prompt**: Merchant "myshop_merchant" confirms the dispute materials for Arb "myshop_arb_case" with no voting deadline (0 = no deadline).

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "myshop_arbitration_v2",
    "confirm": {
      "arb": "myshop_arb_case",
      "voting_deadline": 0
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

> **Note**: Use `0` for `voting_deadline` to indicate no deadline (immediate arbitration). The MCP tool does not accept `null` for this field. To set a specific deadline, use a Unix timestamp in milliseconds.

### Step 7: Merchant Provides Arbitration Result

The merchant provides the final arbitration result with feedback and indemnity amount.

**Prompt**: Merchant "myshop_merchant" provides arbitration result for Arb "myshop_arb_case" with 2 WOW indemnity.

```json
{
  "operation_type": "arbitration",
  "data": {
    "object": "myshop_arbitration_v2",
    "arbitration": {
      "arb": "myshop_arb_case",
      "feedback": "After investigation, the product quality issue is confirmed. Full refund to customer and return shipping cost covered by merchant.",
      "indemnity": 2000000000
    }
  },
  "env": {
    "account": "myshop_merchant",
    "network": "testnet"
  }
}
```

> **Note**: The Arb status changes to 3 (Arbitrated). The indemnity amount must be ≤ the Service's compensation_fund balance.

### Step 8: Customer Claims Compensation

The customer claims the compensation from the Service's compensation fund.

**Prompt**: Customer "myshop_customer" claims compensation for order "myshop_arb_order" from Arb "myshop_arb_case".

```json
{
  "operation_type": "order",
  "data": {
    "object": "myshop_arb_order",
    "arb_claim_compensation": {
      "arb": "myshop_arb_case"
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet"
  }
}
```

> **Note**: The customer receives the indemnity amount (2 WOW) from the Service's compensation fund. The Arb status changes to 5 (Finished). The Order's `claimed_by` field is updated with the Arb address.

### Step 9: Query Arbitration Status

Check the final status of the arbitration.

**Prompt**: Query the Arb "myshop_arb_case" to verify the arbitration is finished.

```json
{
  "query_type": "onchain_objects",
  "objects": ["myshop_arb_case"],
  "no_cache": true,
  "network": "testnet"
}
```

The Arb should have `status: 5` (Finished) with `compensation_time` set.

---

## Summary

This MyShop e-commerce example demonstrates:

1. **Merchant Setup**:
   - Permission management for access control
   - Machine workflow for order processing with visual flow diagram
   - Contact objects for after-sales support
   - Guard creation for fund allocation validation
   - Service creation with products and pricing

2. **Customer Flow**:
   - Product browsing and selection
   - Order creation with payment
   - Private information exchange via Messenger (shipping address, phone number)
   - Progress tracking through workflow nodes
   - Order completion and payment release

3. **Privacy & Security Features**:
   - End-to-end encrypted messaging for sensitive information
   - Contact-based identity verification
   - No private data stored on-chain

4. **Alternative Flows**:
   - Order cancellation after confirmation (from "Order Confirmation" state)
   - Customer refund after cancellation (via Guard-protected Allocation)
   - Dispute submission and arbitration process (7-step state machine)
   - Compensation claim from Service compensation fund

All operations use the WoWok SDK patterns with JSON-based tool calls, making it easy for AI agents to interact with the blockchain e-commerce system.

---

## Workflow Advancement Notes

When advancing order workflows, use `operation_type: "progress"` with the `operate` field for all workflow transitions:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "myshop_test_progress",
    "operate": {
      "operation": {
        "next_node_name": "Target Node Name",
        "forward": "Forward Name"
      },
      "hold": false,
      "message": "Operation description"
    }
  },
  "env": {
    "account": "operator_account",
    "network": "testnet"
  }
}
```

The Progress object ID can be obtained from:
- Order object's `progress` field
- Named during order creation with `namedNewProgress`

The operator account depends on the forward definition:
- Forwards with `permissionIndex` require the merchant account (with appropriate permission)
- Forwards with `namedOperator: ""` allow the order owner (customer) to operate

---

## Object Reference Summary

| Object Type | Name | Purpose |
|-------------|------|---------|
| Account | myshop_merchant | Store owner account |
| Account | myshop_customer | Customer account |
| Permission | myshop_permission_v2 | Access control management |
| Guard | myshop_withdraw_guard_v2 | Merchant withdrawal validation (order completed) |
| Guard | myshop_refund_guard_v2 | Customer refund validation (order cancelled) |
| Machine | myshop_machine_v2 | Order processing workflow |
| Contact | myshop_aftersales_contact_v2 | After-sales support contact |
| Service | myshop_service_v2 | Online store with products |
| Arbitration | myshop_arbitration_v2 | Dispute resolution (optional) |
| Order | myshop_test_order | Customer purchase order (dynamic) |
| Progress | myshop_test_progress | Order workflow progress (dynamic) |
| Allocation | myshop_test_allocation | Order fund allocation (dynamic) |

---

## Next Steps

- Extend the workflow with more nodes (e.g., "Return Goods", "Refund Processing")
- Add more complex Guards for conditional transitions
- Implement WIP files for product verification
- Set up Repository for order data storage
- Add WTS generation for messenger conversation records
- Implement file sharing via Messenger (shipping labels, invoices)
- Add blacklist/guardlist management for spam prevention
- Create automated notification system for order status updates

---

## Notes

- All addresses shown in examples are truncated for readability (format: 0xabcd...efgh)
- Use the full 64-character address in actual operations
- Test on testnet before deploying to mainnet
- Ensure sufficient WOW tokens for transaction fees
