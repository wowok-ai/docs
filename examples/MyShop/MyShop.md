# MyShop E-Commerce Example

A complete e-commerce example demonstrating how to build an online store using WoWok protocol. This guide covers both merchant setup and customer order workflows.

> 📋 **View Actual Execution Results**: See [MyShop_TestResults.md](MyShop_TestResults.md) for real testnet execution results with actual object addresses and transaction outputs.

---

## Core Requirements & Features

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| **Product Listing** | Create and manage product/service listings | Service object with pricing, inventory, and WIP integration |
| **Order Workflow** | Automated order processing from creation to completion | Machine with nodes: Order Confirmation → Shipping → In Transit → Completed |
| **Permission Control** | Role-based access for merchant and customer operations | Permission object with custom indexes for merchant operations |
| **Arbitration Support** | Dispute resolution mechanism | Arbitration object for handling order conflicts |
| **WIP Verification** | Product authenticity verification via WIP files | WIP hash stored in Service for customer verification |
| **Discount System** | Coupon and promotional code support | Discount object with time-limited offers |
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
│  │ • Discount (Coupons)    │    │ • Order Complete        │                │
│  │ • Contact (Messaging)   │    │ • Receive Goods         │                │
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
       └───────────────────►│  Order End   │◄───────────────────────┘
         (Cancel Order)     │(Final State) │    (Complete Order)
                            └──────────────┘
```

**Normal Flow**: Order Confirmation → Shipping → In Transit → Completed → Order End  
**Alternative**: Order Confirmation → Cancel Order → Order End (if cancelled)

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
    "name": "myshop_merchant"
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

---

### Step 3.1: Machine Workflow Design

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
│            │               │   Order End  │                                       │  │
│            │               │  (Final State)                                       │  │
│            │               └──────────────┘                                       │  │
│            │                                                                       │
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
| 1 | Order Confirmation | Initial state after order creation | 0 | Confirm Order (Merchant), Cancel Order (Customer) |
| 2 | Shipping | Merchant prepares and ships goods | 1 | Ship Goods (Merchant) |
| 3 | In Transit | Goods are being delivered | 1 | Confirm Delivery (Merchant) |
| 4 | Completed | Order successfully completed | 1 | Complete Order (Customer) |

**Permission Index Mapping:**
- `1000` - Merchant confirms order
- `1001` - Merchant ships goods
- `1002` - Merchant confirms delivery

**Order Permission:**
- Use `namedOperator: ""` (empty string) to allow order owner and agents to operate through Order object
- This is the recommended way to give order owners control over their orders

---

### Step 4: Add Workflow Nodes

Add the workflow nodes to the Machine for order processing.

**Prompt**: Add workflow nodes to "myshop_machine_v2" including Order Confirmation, Shipping, In Transit, and Completed nodes.

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

### Step 5.1: Create Contact Object for Customer Service

Create a Contact object to enable encrypted communication between customers and the store for after-sales support.

#### 5.1.1 Enable Merchant Messenger

**Prompt**: Enable messenger for the merchant account.

```json
{
  "messenger": {
    "m": "myshop_merchant_messenger",
    "name_or_account": "myshop_merchant"
  }
}
```

#### 5.1.2 Create After-Sales Contact Object

**Prompt**: Create a Contact object named "myshop_aftersales_contact_v2" with permission "myshop_permission_v2" for after-sales support.

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

---

### Step 6: Create Allocation Guards

Before creating the Service, you need Guards for order fund allocation. These Guards validate when funds can be withdrawn by the merchant or refunded to customers.

#### 6.1 Create Merchant Withdraw Guard

This Guard checks if the order has reached "Completed" status before allowing the merchant to withdraw funds.

**Prompt**: Create a Guard named "myshop_withdraw_guard_v2" that verifies the order is in "Completed" status.

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

**How it works:**
- Uses `convert_witness: 100` (TypeOrderProgress) to access the order's Progress object
- Query ID `1253` (`progress.current`) retrieves the current node name
- Compares with "Completed" to verify order status

#### 6.2 Create Customer Refund Guard

For scenarios where customers need refunds before order completion.

**Prompt**: Create a Guard named "myshop_refund_guard_v2" for customer refund scenarios.

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
---

### Step 7: Create Service (Store)

Create the Service object that represents your online store with products. This step binds all previously created components together.

> **Important**: For Service creation, you need to provide a complete configuration including machine, order_allocators with Guards, and products. The Service will be created and published in a single transaction.

#### 7.1 Understanding Order Allocators

The `order_allocators` configuration defines how order payments are distributed:

| Component | Description |
|-----------|-------------|
| **Guard** | Validates allocation conditions (e.g., order must be completed) |
| **Sharing** | Defines who receives funds and how much |
| **Mode** | "Rate" (percentage), "Amount" (fixed), or "Surplus" |
| **Threshold** | Minimum amount to trigger allocation |

**Recipient Types:**
- `{ "Signer": "signer" }` - Transaction sender (merchant)
- `{ "Entity": { "address": "..." } }` - Specific address
- `{ "GuardIdentifier": 0 }` - Address from Guard table

#### 7.2 Create and Publish Service

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

⚠️ **Important Notes:**
- After publishing, `machine`, `order_allocators`, and `arbitrations` become **immutable**
- Ensure your Guards and allocation logic are correct before publishing
- The `sharing` value of `10000` represents 100% (rate mode uses 0-10000 scale)

---

### Step 8: Create Discount Coupons (Optional)

Create discount coupons for promotional campaigns.

**Prompt**: Create a 20% discount coupon named "HOLIDAY20" for holiday promotions, valid for 30 days, distributed to customers "alice" and "bob".

```json
{
  "operation_type": "service",
  "data": {
    "object": "myshop_service_v2",
    "discount": {
      "name": "HOLIDAY20",
      "discount_type": 0,
      "discount_value": 2000,
      "benchmark": 0,
      "time_ms_start": 0,
      "time_ms_end": 2592000000,
      "count": 100,
      "recipient": ["alice", "bob"],
      "transferable": true
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
    "name": "myshop_customer"
  }
}
```

**Get test tokens:**

```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "myshop_customer"
  }
}
```

---

### Step 1: Query Service Products

Customers can query the Service to see available products.

**Prompt**: Query the Service "myshop_service_v2" to view available products and their details.

```json
{
  "query_type": "onchain_objects",
  "filter": {
    "objectType": "Service",
    "objectName": "myshop_service_v2"
  },
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

After creating the order, the customer needs to send their shipping address and contact information to the after-sales support team. This is done securely through the Messenger system to protect privacy - the information is never stored on-chain.

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    Private Information Exchange via Messenger                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌──────────────────┐         End-to-End Encrypted          ┌──────────────────┐  │
│   │                  │◄──────────────────────────────────────►│                  │  │
│   │  myshop_customer │         Messenger Channel              │ myshop_aftersales│  │
│   │  (Customer)      │         (Never on-chain)               │  (After-Sales)   │  │
│   │                  │                                        │   Support Team   │  │
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
│   ✅ End-to-end encryption - Only customer and support can read                     │
│   ✅ No on-chain storage - Message content never touches blockchain                 │
│   ✅ Verifiable identity - Contact object confirms who you're talking to            │
│   ✅ WTS support - Can generate verifiable conversation records if needed           │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### 2.1.1 Customer Enables Messenger

**Prompt**: Enable messenger for customer account "myshop_customer" to send private messages.

```json
{
  "messenger": {
    "m": "customer_messenger"
  },
  "name_or_account": "myshop_customer"
}
```

#### 2.1.2 Customer Sends Shipping Information

**Prompt**: Customer "myshop_customer" sends shipping address and contact information to after-sales support "myshop_aftersales" via encrypted messenger.

```json
{
  "operation": "send_message",
  "from": "myshop_customer",
  "to": "myshop_aftersales",
  "content": "Order Shipping Information:\n\nOrder ID: 0x5678...9abc\nProduct: Play Purse Set 35PCS\n\nRecipient: Zhang San\nPhone: 138-0000-0000\nAddress: Building 123, Unit 456, Room 789\n         Chaoyang District, Beijing\n         China, 100000\n\nPlease confirm receipt of this information."
}
```

#### 2.1.3 After-Sales Support Receives and Confirms

**Prompt**: After-sales support "myshop_aftersales" views the message and sends confirmation to customer.

```json
{
  "operation": "send_message",
  "from": "myshop_aftersales",
  "to": "myshop_customer",
  "content": "Dear Customer,\n\nWe have received your shipping information:\n✅ Order ID: 0x5678...9abc confirmed\n✅ Shipping address verified\n✅ Contact phone: 138-0000-0000\n\nYour order will be processed within 24 hours. We'll send you the tracking number once shipped.\n\nThank you for shopping with MyShop!"
}
```

#### 2.1.4 View Conversation History

**Prompt**: View the conversation between customer and after-sales support to confirm both messages were delivered.

```json
{
  "operation": "watch_messages",
  "filter": {
    "peerAddress": "myshop_aftersales",
    "account": "myshop_customer"
  }
}
```

---

### Step 3: Query Order Status

Customer can query the order status and progress.

**Prompt**: Query the order "0x5678...9abc" to check its current status and progress.

```json
{
  "query_type": "onchain_objects",
  "filter": {
    "objectType": "Order",
    "objectIds": ["0x5678...9abc"]
  }
}
```

---

### Step 4: Query Progress Status

Check the current workflow node of the order.

**Prompt**: Query the Progress "0x1234...5678" to see the current workflow node.

```json
{
  "query_type": "onchain_objects",
  "filter": {
    "objectType": "Progress",
    "objectIds": ["0x1234...5678"]
  }
}
```
---

### Step 5: Merchant Confirms Order

Merchant advances the order from "Order Confirmation" to "Shipping".

> **Note**: The merchant (order owner) can use `operation_type: "order"` with `progress` to advance the workflow. Non-owners must use `operation_type: "progress"` with `operate`.

**Prompt**: Advance the order "0x5678...9abc" progress from "Order Confirmation" to "Shipping" using the "Confirm Order" forward.

```json
{
  "operation_type": "order",
  "data": {
    "object": "0x5678...9abc",
    "progress": {
      "operation": {
        "next_node_name": "Shipping",
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

Merchant ships the order and advances to "In Transit".

**Prompt**: Advance the order "0x5678...9abc" progress from "Shipping" to "In Transit" using the "Ship Goods" forward.

```json
{
  "operation_type": "order",
  "data": {
    "object": "0x5678...9abc",
    "progress": {
      "operation": {
        "next_node_name": "In Transit",
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

**Prompt**: Advance the order "0x5678...9abc" progress from "In Transit" to "Completed" using the "Confirm Delivery" forward.

```json
{
  "operation_type": "order",
  "data": {
    "object": "0x5678...9abc",
    "progress": {
      "operation": {
        "next_node_name": "Completed",
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

> **Important**: Non-order owners (like the customer in this case) must use `operation_type: "progress"` to advance the workflow. Only the order owner (merchant) can use `operation_type: "order"` with progress operations.

**Prompt**: Customer "myshop_customer" completes the order "0x5678...9abc" by advancing from "Completed" node using "Complete Order" forward.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "0x1234...5678",
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

> **Note**: You can get the Allocation object ID from the Order object's `allocation` field, or by naming it during order creation with `namedNewAllocation`.

**Prompt**: Activate allocation "0xdef0...1234" by verifying the withdraw guard with order "0x5678...9abc".

```json
{
  "operation_type": "allocation",
  "data": {
    "object": "0x248f01d944de8f6712ec06f9b4c54f93fe4132e5323488b2d24c83d7487069de",
    "alloc_by_guard": "myshop_withdraw_guard_v2"
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "myshop_withdraw_guard_v2",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "myshop_withdraw_guard_v2",
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

Customer can cancel the order before it's confirmed.

> **Note**: Customer (non-order owner) uses `operation_type: "progress"` to cancel the order.

**Prompt**: Customer "myshop_customer" cancels the order "0x5678...9abc" before merchant confirmation.

```json
{
  "operation_type": "progress",
  "data": {
    "object": "0x1234...5678",
    "operate": {
      "operation": {
        "next_node_name": "Order Confirmation",
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
---

## Alternative Flow: Dispute and Arbitration

### Step 1: Create Arbitration Object

First, create an Arbitration object for handling order disputes.

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

### Step 2: Customer Submits Arbitration

If there's a dispute, customer can submit arbitration.

**Prompt**: Customer "myshop_customer" submits arbitration for order "0x5678...9abc" using arbitration "myshop_arbitration".

```json
{
  "operation_type": "order",
  "data": {
    "object": "0x5678...9abc",
    "arb_confirm": {
      "arb": "myshop_arbitration",
      "confirm": true,
      "description": "Product not as described - requesting refund",
      "proposition": ["Full refund", "Return shipping cost coverage"]
    }
  },
  "env": {
    "account": "myshop_customer",
    "network": "testnet"
  }
}
```

### Step 3: Query Arbitration Status

Check the status of the arbitration.

**Prompt**: Query the arbitration "0xbeef...cafe" to check its status.

```json
{
  "query_type": "onchain_objects",
  "filter": {
    "objectType": "Arb",
    "objectIds": ["0xbeef...cafe"]
  }
}
```

---

## Summary

This MyShop e-commerce example demonstrates:

1. **Merchant Setup**:
   - Permission management for access control
   - Machine workflow for order processing with visual flow diagram
   - Contact objects for pre-sales and after-sales support
   - Service creation with products and pricing
   - Arbitration setup for dispute resolution
   - Discount coupon creation for promotions

2. **Customer Flow**:
   - Product browsing and selection
   - Order creation with payment
   - **Private information exchange via Messenger** (shipping address, phone number)
   - Progress tracking through workflow nodes
   - Order completion and payment release

3. **Privacy & Security Features**:
   - End-to-end encrypted messaging for sensitive information
   - Contact-based identity verification
   - No private data stored on-chain
   - WTS support for verifiable conversation records

4. **Alternative Flows**:
   - Order cancellation before confirmation
   - Dispute submission and arbitration process

All operations use the new WoWok SDK patterns with JSON-based tool calls, making it easy for AI agents to interact with the blockchain e-commerce system.

---

## Important: Order vs Progress Operations

When advancing order workflows, it's crucial to use the correct operation type based on who is performing the action:

### Order Owner (Merchant)

The order owner can use `operation_type: "order"` with the `progress` field:

```json
{
  "operation_type": "order",
  "data": {
    "object": "0x5678...9abc",
    "progress": {
      "operation": {
        "next_node_name": "Shipping",
        "forward": "Confirm Order"
      },
      "hold": false,
      "message": "Order confirmed"
    }
  }
}
```

### Non-Owner (Customer, Agents)

Non-owners must use `operation_type: "progress"` with the `operate` field:

```json
{
  "operation_type": "progress",
  "data": {
    "object": "0x1234...5678",
    "operate": {
      "operation": {
        "next_node_name": "Completed",
        "forward": "Complete Order"
      },
      "hold": false,
      "message": "Order completed"
    }
  }
}
```

> **Key Difference**: 
> - `order` operation: Uses `progress` field, only for order owners
> - `progress` operation: Uses `operate` field, for anyone with permission to advance the workflow

The Progress object ID can be obtained from:
- Order object's `progress` field
- Named during order creation with `namedNewProgress`

---

## Object Reference Summary

| Object Type | Name | Example Address | Purpose |
|-------------|------|-----------------|---------|
| Account | myshop_merchant | 0x73e1...708a | Store owner account |
| Account | myshop_customer | 0x6e95...d94d | Customer account |
| Permission | myshop_permission_v2 | 0x0e01...9862 | Access control management |
| Guard | myshop_withdraw_guard_v2 | 0x7fe6...91ea | Merchant withdrawal validation (order completed) |
| Guard | myshop_refund_guard_v2 | 0x6147...bda4 | Customer refund validation (order not shipped) |
| Machine | myshop_machine_v2 | 0x923b...6aac | Order processing workflow |
| Contact | myshop_aftersales_contact_v2 | 0x855a...f53b | After-sales support contact |
| Service | myshop_service_v2 | 0xc02e...9755 | Online store with products |
| Arbitration | myshop_arbitration_v2 | (to be created) | Dispute resolution |
| Discount | HOLIDAY20 | (to be created) | Promotional coupon |
| Order | (dynamic) | 0x497e...a0ca | Customer purchase order |
| Progress | (dynamic) | 0xf7ec...472f | Order workflow progress |
| Allocation | (dynamic) | 0x248f...69de | Order fund allocation |
| Arb | (dynamic) | (dynamic) | Arbitration case |

---

## Next Steps

- Extend the workflow with more nodes (e.g., "Return Goods", "Refund Processing")
- Add more complex Guards for conditional transitions
- Implement WIP files for product verification
- Create multiple discount campaigns
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

---

## Actual Test Results

For actual execution results with real object addresses and transaction outputs from testnet, see [MyShop_TestResults.md](MyShop_TestResults.md).
