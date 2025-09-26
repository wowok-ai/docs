# Service Object: Your Complete Business Platform

> "Your transparent business promise portal - where customers see exactly what they'll receive, bound to verifiable Machine workflows, Treasury payments, Guard protections, and Arbitration guarantees - readable, writable, and operable by AI"

**MCP Tool**: [wowok_service_mcp_server](https://www.npmjs.com/package/wowok_service_mcp_server)

## How to Use This Documentation

### Document Structure

- **[Overview](#overview)**: Service capabilities and business workflow
- **[Core Parameters](#core-parameters)**: All configuration options organized by function
- **[Data Types & Formats](#data-types--formats)**: Technical reference for addresses and types
- **[Integration Patterns](#integration-patterns)**: How Service works with other objects
- **[Complete Examples](#complete-examples)**: Working business configurations
- **[Query Capabilities](#query-capabilities)**: What you can query and how to access Service data

### Navigation by Need

| I need to...                | Go to section                                                |
| --------------------------- | ------------------------------------------------------------ |
| Create new Service          | [Core Parameters → Object Management](#1-object-management)  |
| Add/remove products         | [Core Parameters → Sales Management](#3-sales-management)    |
| Set up payment flow         | [Core Parameters → Fund Management](#5-fund-management)      |
| Create customer orders      | [Core Parameters → Order System](#8-order-system-operations) |
| Connect with Machine/Guards | [Core Parameters → Business Workflow](#4-business-workflow)  |
| Generate discount coupons   | [Core Parameters → Marketing Tools](#9-marketing-tools)      |
| Reference tables            | [Data Types & Formats](#data-types--formats)                 |
| Query service data          | [Query Capabilities](#query-capabilities)                    |

---

## Overview

### Definition

Service objects create complete business platforms enabling revenue generation through product sales, automated order processing, and integrated payment collection. Services manage the entire customer journey from product catalog to order fulfillment.

### Core Capabilities

**Comprehensive Service Definition**: AI-assisted creation process enables simple yet complete service definition. Services integrate Machine workflows, Guard protections, Treasury payments, and Arbitration commitments, creating transparent service promises that users can fully review before purchase decisions.

**Complete Order Tracking**: All order execution activities and data are recorded on-chain with immutable storage. Progress tracking captures every step, decision, and state change throughout the service delivery process.

**Flexible Payment Management**: Multiple payment settlement methods based on predefined rules and Guard conditions. Order owners maintain control over their funds while enabling various withdrawal and refund mechanisms.

**Dispute Resolution Access**: Built-in arbitration mechanisms allow users to initiate formal dispute processes when service commitments are not met, with structured voting and compensation determination.

### Important Technical Notes

- Token type uses Token format (`"0x2::sui::SUI"`), not Coin format
- Publishing (`bPublished: true`) permanently locks Machine and Guard configuration
- Order objects allow buyer deposits but restrict buyer withdrawals
- Service owners can withdraw from Orders without restrictions (normal business flow)
- Multiple Services can share the same Machine workflow

**Order Balance Management**: Order balance serves as a temporary fund buffer pool with two distinct components: seller-deposited operational funds (Order Balance) and buyer purchase payments. Only Order owners (buyers) can withdraw from Order balance, while purchase payments flow to designated Treasury based on workflow completion and Guard conditions.

### Core Business Workflow

1. **Setup**: Create Service with products, pricing, and payment Treasury
2. **Configure**: Set business rules (Machine workflow, purchase Guards, withdrawal Guards)
3. **Publish**: Enable customer orders and lock core configuration
4. **Operate**: Customers create orders, payments flow to Treasury automatically
5. **Fulfill**: Execute Machine workflow, manage order lifecycle
6. **Monetize**: Withdraw revenues through configured Guard approvals

# Service Core Parameters

## 1. Object Management

### Object Reference (Existing Service)

```json
{
  "object": "existing_service_name_or_address"
}
```

**Use this when**: You want to modify an existing Service (add products, change settings, create orders)

**Address Formats**: Can be blockchain address (`0x1234...`) or saved nickname (`my_service`). → [Address Format Guide](#address-format-options)

### Object Creation (New Service)

```json
{
  "object": {
    "name": "flower_delivery_service",
    "type_parameter": "0x2::sui::SUI",
    "permission": "team_permission",
    "onChain": true,
    "tags": ["delivery", "flowers", "local"],
    "useAddressIfNameExist": false
  }
}
```

| Parameter               | Type          | Required     | Default        | Description                                                                                                                         |
| ----------------------- | ------------- | ------------ | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `type_parameter`        | string        | **Required** | -              | Payment token type: `"0x2::sui::SUI"` (Token format, not Coin)                                                                      |
| `permission`            | string/object | Optional     | Auto-created   | Permission object controlling service operations (if omitted, creates new permission). → [Address Formats](#address-format-options) |
| `name`                  | string        | Optional     | Auto-generated | Service identifier for easy reference                                                                                               |
| `tags`                  | string[]      | Optional     | `[]`           | Service categorization labels                                                                                                       |
| `onChain`               | boolean       | Optional     | `false`        | Whether metadata visible on blockchain                                                                                              |
| `useAddressIfNameExist` | boolean       | Optional     | `false`        | Name conflict resolution strategy                                                                                                   |

**Technical Note**: `type_parameter` uses Token format (`"0x2::sui::SUI"`), different from Demand's Coin format (`"0x2::coin::Coin<0x2::sui::SUI>"`).

---

## 2. Basic Configuration

### Service Description and Location

```json
{
  "description": "Professional flower delivery service with same-day delivery across the city",
  "location": "New York City, Manhattan area",
  "endpoint": "https://flowers.example.com"
}
```

| Parameter     | Type        | Required | Default      | Description                                |
| ------------- | ----------- | -------- | ------------ | ------------------------------------------ |
| `description` | string      | Optional | Empty string | Detailed service explanation for customers |
| `location`    | string      | Optional | Empty string | Geographic service area or coordinates     |
| `endpoint`    | string/null | Optional | `null`       | HTTPS URL for extended product information |

**Endpoint Usage**: System appends `?&service={service_id}&product={product_name}` for product details. Each product can specify different endpoints, or use unified service endpoint for redirection.

### Service Status Management

```json
{
  "bPublished": true,
  // Publishes service for customer orders, locks configuration changes
  "bPaused": false
  // Normal operation, accepting new orders
}
```

| Parameter    | Type    | Required | Default | Description                                                   | Reversible       |
| ------------ | ------- | -------- | ------- | ------------------------------------------------------------- | ---------------- |
| `bPublished` | boolean | Optional | `false` | **Enables order creation, locks Machine/Guard configuration** | ❌ **Permanent** |
| `bPaused`    | boolean | Optional | `false` | Temporarily stops new order acceptance                        | ✅ Can toggle    |

**Critical Warning**: Publishing locks core configuration (Machine, buy_guard) permanently. This ensures service commitment consistency for customers.

---

## 3. Sales Management

### Add Products

```json
{
  "sales": {
    "op": "add",
    "sales": [
      {
        "item": "Rose Bouquet",
        "price": 50,
        "stock": 100,
        "endpoint": "https://flowers.example.com/roses"
      },
      {
        "item": "Wedding Package",
        "price": 300,
        "stock": 20
      }
    ]
  }
}
```

### Remove Products

```json
{
  "sales": {
    "op": "remove",
    "sales_name": ["Rose Bouquet", "Wedding Package"]
  }
}
```

### Sales Parameters

#### Add Sales Items

| Parameter  | Type          | Required     | Default | Description                                            |
| ---------- | ------------- | ------------ | ------- | ------------------------------------------------------ |
| `op`       | enum          | **Required** | -       | Operation type: `"add"`                                |
| `item`     | string        | **Required** | -       | **Unique product identifier within service**           |
| `price`    | number/string | **Required** | -       | Product price in token base units (≥0, no upper limit) |
| `stock`    | number/string | **Required** | -       | Available inventory quantity (≥0, no upper limit)      |
| `endpoint` | string/null   | Optional     | `null`  | Product-specific detail URL                            |

#### Remove Sales Items

| Parameter    | Type     | Required     | Default | Description                |
| ------------ | -------- | ------------ | ------- | -------------------------- |
| `op`         | enum     | **Required** | -       | Operation type: `"remove"` |
| `sales_name` | string[] | **Required** | -       | Product names to remove    |

**Inventory Management**: When stock reaches 0, product automatically becomes unavailable for new orders. Existing orders remain unaffected.

**Price Format**: Accepts both `number` and `string` formats. AI automatically distinguishes between MIST (smallest unit) and SUI (main unit) for precise pricing. Use base token units: `50` or `"50"` = 50 SUI, `1` or `"1"` = 1 SUI.

## 4. Business Workflow

### Machine Integration

```json
{
  "machine": "flower_delivery_workflow"
  // machine: Associated Machine object address defining service delivery workflow
}
```

**What is Machine**: Machine objects define step-by-step workflows for service delivery - from order creation through completion stages with automated progression rules.
Multiple Services can share the same Machine workflow. Machine defines the step-by-step process from order creation to completion.

**For detailed Machine configuration**: → [Machine Documentation](./Machine.md)

### Purchase Conditions

```json
{
  "buy_guard": "vip_customer_verification"
  // buy_guard: Guard object address for purchase eligibility verification
}
```

**What is Guard**: Guard objects are verification engines that return true/false based on configurable conditions - time windows, account balances, custom business logic.
Guard verification runs before order creation. Only customers passing Guard conditions can purchase this service.

**Common Use Cases**: VIP membership verification, geographic restrictions, time-based access windows, etc.

**For detailed Guard configuration**: → [Guard Documentation](./Guard.md)

---

## 5. Fund Management

### Treasury Configuration

#### Reference Existing Treasury

```json
{
  "payee_treasury": "business_main_fund"
  // payee_treasury: Treasury object address receiving customer payments
}
```

**Address Format**: Can use blockchain address or saved name. → [Address Format Guide](#address-format-options)

#### Create New Treasury

```json
{
  "payee_treasury": {
    "type_parameter": "0x2::sui::SUI",
    "permission": "team_permission",
    "name": "service_treasury",
    "tags": ["service", "payments"],
    "onChain": true,
    "useAddressIfNameExist": false
  }
}
```

**What is Treasury**: Treasury objects are shared fund pools with programmable access controls, enabling multiple authorized entities to deposit and withdraw according to predefined rules.

**Payment Flow**: Customer purchase payments temporarily held in Order objects, then flow to specified Treasury based on workflow completion and Guard conditions. Order Balance (seller deposits) remains separate and can only be withdrawn by Order owners under specific conditions.

**For detailed Treasury configuration**: → [Treasury Documentation](./Treasury.md)

### Withdrawal Guards

```json
{
  "withdraw_guard": {
    "op": "add",
    // op: Guard management operation type
    "guards": [
      {
        "guard": "daily_operations_limit",
        // guard: Guard object address defining withdrawal verification conditions
        "rate": 8000
        // rate: Withdrawal rate in basis points (8000 = 80%)
      },
      {
        "guard": "owner_approval_required",
        "rate": 10000
        // rate: 10000 basis points = 100%
      }
    ]
  }
}
```

Service owners must pass withdrawal guard verification for **any fund extraction** from Service or Order objects. This creates universal fund control enabling staged payments (e.g., milestone-based contractor payments) and escrow conditions (e.g., buyer protection for large purchases).

### Refund Guards

```json
{
  "refund_guard": {
    "op": "add",
    "guards": [
      {
        "guard": "customer_satisfaction_check",
        "rate": 5000
        // rate: Refund rate in basis points (5000 = 50%)
      }
    ]
  }
}
```

**Refund Mechanism**: Refund guards control when and how buyers can reclaim funds from Orders. Enable satisfaction guarantees (30-day money-back policy) and dispute resolution processes (arbitration-based refunds for service quality issues).

**Rate Format**: Service withdrawal guards use basis points (10000 = 100%), different from Treasury's direct percentage format.

| Operation   | Type | Required     | Default | Purpose                | Guard Usage                           |
| ----------- | ---- | ------------ | ------- | ---------------------- | ------------------------------------- |
| `add`       | enum | **Required** | -       | Append new guards      | Multiple guards create spending tiers |
| `set`       | enum | **Required** | -       | Replace all guards     | Complete guard policy reset           |
| `remove`    | enum | **Required** | -       | Delete specific guards | Remove outdated conditions            |
| `removeall` | enum | **Required** | -       | Clear all guards       | Remove all restrictions               |

| Guard Parameter | Type   | Required     | Default | Description                                                   |
| --------------- | ------ | ------------ | ------- | ------------------------------------------------------------- |
| `guard`         | string | **Required** | -       | Guard object address or name                                  |
| `rate`          | number | **Required** | -       | Withdrawal rate in basis points (0-10000, where 10000 = 100%) |

---

## 6. External Integration

### Repository Integration

```json
{
  "repository": {
    "op": "add",
    // op: Integration management operation type
    "objects": ["customer_data_repo", "delivery_records_repo"]
    // objects: Repository object addresses for shared business data storage
  }
}
```

**What is Repository**: Repository objects provide policy-driven, on-chain database enabling structured information storage with configurable access controls.

**For detailed Repository configuration**: → [Repository Documentation](./Repository.md)

### Arbitration Integration

```json
{
  "arbitration": {
    "op": "add",
    "objects": ["customer_disputes_arb", "quality_claims_arb"]
    // objects: Arbitration object addresses for service dispute resolution
  }
}
```

**What is Arbitration**: Arbitration objects provide formal dispute resolution systems with voting mechanisms, enabling neutral third-party decisions on service conflicts.
**For detailed Arbitration configuration**: → [Arbitration Documentation](./Arbitration.md)

### Reward Treasury Incentives

```json
{
  "extern_withdraw_treasury": {
    "op": "add",
    "objects": ["loyalty_rewards_treasury", "referral_bonus_treasury"]
    // objects: External Treasury addresses providing additional customer rewards
  }
}
```

| Integration Type      | Purpose             | Technical Effect                                         |
| --------------------- | ------------------- | -------------------------------------------------------- |
| **Repository**        | Shared data storage | Service can query/store customer data, delivery records  |
| **Arbitration**       | Dispute resolution  | Customers can escalate issues through formal arbitration |
| **External Treasury** | Customer incentives | Additional reward pools beyond main service payments     |

| Integration Parameter | Type     | Required     | Default | Description                                 |
| --------------------- | -------- | ------------ | ------- | ------------------------------------------- |
| `op`                  | enum     | **Required** | -       | `"add"`, `"set"`, `"remove"`, `"removeall"` |
| `objects`             | string[] | **Required** | -       | Array of object addresses or names          |

**Cross-Object Data Flow**: These integrations enable Service to participate in larger business ecosystems with shared data and processes.

## 7. Customer Management

### Customer Information Requirements

```json
{
  "customer_required_info": {
    "pubkey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQE...",
    // pubkey: Public key for encrypting customer information
    "required_info": [
      "address",
      "phone",
      "postcode",
      "name",
      "special_instructions"
    ]
    // required_info: Array of information types customers must provide
  }
}
```

**Data Transmission Methods**:

- **On-chain Storage**: Encrypted data stored directly on blockchain (accessible if private key is compromised)
- **Endpoint Transmission**: Encrypted data sent to specified service endpoint (recommended for enhanced security)

**Security Considerations**:

- Public keys are timestamped and support updates for key rotation
- **Recommended Approach**: Use endpoint transmission to entity-controlled servers (company, organization, or individual infrastructure) for better privacy protection and operational flexibility

  | Parameter       | Type     | Required     | Default | Description                                       |
  | --------------- | -------- | ------------ | ------- | ------------------------------------------------- |
  | `pubkey`        | string   | **Required** | -       | Public key for encrypting customer information    |
  | `required_info` | string[] | **Required** | -       | Array of information types customers must provide |

**Privacy Protection**: Customer information is encrypted using the provided public key before storage, ensuring data protection.

**Standard Information Types**: `"address"`, `"phone"`, `"postcode"`, `"name"` or custom strings like `"delivery_instructions"`, `"allergies"`.

**Business Use**: Enable personalized service delivery, compliance requirements, or operational logistics coordination.

---

## 8. Order System Operations

### Order Creation

```json
{
  "order_new": {
    "buy_items": [
      {
        "item": "Rose Bouquet",
        // item: Product name from service sales catalog
        "max_price": 60,
        // max_price: Maximum willing to pay, protects against price increases
        "count": 2
        // count: Quantity to purchase
      }
    ],
    "customer_info_required": "John Doe, 123 Main St, NYC, 555-0123",
    // customer_info_required: Customer information string (encrypted)
    "discount_object": "valentine_special_coupon",
    // discount_object: Discount object address for price reduction
    "namedNewOrder": {
      "name": "roses_for_anniversary",
      // name: Local identifier for easy order reference
      "onChain": true
    }
  }
}
```

**Purchase Protection**: `max_price` prevents order execution if product price exceeds customer's willingness to pay.

**Order Creation Flow**: System validates stock availability, applies discounts, creates Order object, and initiates Machine workflow if configured.

| Order Parameter          | Type          | Required     | Default      | Description                                 |
| ------------------------ | ------------- | ------------ | ------------ | ------------------------------------------- |
| `item`                   | string        | **Required** | -            | Product name from service sales catalog     |
| `max_price`              | number/string | **Required** | -            | Maximum willing to pay (≥0, no upper limit) |
| `count`                  | number/string | **Required** | -            | Quantity to purchase (≥1, no upper limit)   |
| `customer_info_required` | string        | Optional     | Empty string | Customer information string (encrypted)     |
| `discount_object`        | string        | Optional     | -            | Discount object address for price reduction |

### Order Management Operations

**Base Structure**: All order operations use the same basic JSON structure - only the highlighted parameter changes:

```json
{
  "account": "your_account",
  "data": {
    "object": "your_service_name",
    // 👇 Replace this section with specific operation parameters below
    "OPERATION_PARAMETER": { ... }
  },
  "session": {"network": "sui testnet"}
}
```

**Agent Capabilities**: Agents can perform all operations but cannot receive payments. Payer address can be changed for different payment sources.

**Detailed Example - Agent Assignment**:

```json
{
  "account": "service_owner",
  "data": {
    "object": "flower_delivery_service",
    "order_agent": {
      // ← This replaces OPERATION_PARAMETER
      "order": "roses_for_anniversary", // Order to assign agents to
      "agents": [
        // List of authorized agents
        {
          "local_mark_first": true,
          "name_or_address": "delivery_coordinator"
        }
      ]
    }
  },
  "session": { "network": "sui testnet" }
}
```

**Purpose**: Allow "delivery_coordinator" to manage the "roses_for_anniversary" order on behalf of the service owner.

**Address Note**: All `name_or_address` fields support both formats. → [Address Format Options](#address-format-options)

**Operation-Specific Parameters**:

| Operation              | Replace `OPERATION_PARAMETER` with                                                        | Quick Example                 |
| ---------------------- | ----------------------------------------------------------------------------------------- | ----------------------------- |
| **Agent Assignment**   | `"order_agent": {"agents": [{"name_or_address": "agent_address"}]}`                       | Authorize delivery manager    |
| **Payer Transfer**     | `"order_payer": {"payer_new": {"name_or_address": "new_owner"}}`                          | Transfer order to new account |
| **Payment Collection** | `"order_receive": {"order": "order_address"}`                                             | Collect payments from order   |
| **Information Update** | `"order_required_info": {"order": "order_address", "customer_info_required": "new_info"}` | Update customer requirements  |

### Order Financial Operations

#### Withdrawal from Orders

```json
{
  "order_withdrawl": {
    "order": "roses_for_anniversary",
    // order: Order address for fund extraction
    "data": {
      "remark": "Service completion payment to delivery team",
      // remark: Transaction description for financial records
      "withdraw_guard": "service_completion_verification",
      // withdraw_guard: Guard address validating withdrawal conditions
      "index": "20241215001",
      // index: Business reference number for accounting
      "for_object": "delivery_operations_fund",
      // for_object: Target object address for fund purpose tracking
      "for_guard": "team_payment_approval"
      // for_guard: Additional verification guard reference
    }
  }
}
```

#### Refund Processing

```json
{
  "order_refund": {
    "order": "roses_for_anniversary",
    // order: Order address for refund processing
    "arb": "customer_satisfaction_arbitration"
    // arb: Arbitration object address for dispute-based refunds
  }
}
// OR
{
  "order_refund": {
    "order": "roses_for_anniversary",
    "refund_guard": "satisfaction_guarantee_policy"
    // refund_guard: Guard address for policy-based refunds
  }
}
```

| Withdrawal Parameter | Type          | Required     | Default | Description                                     |
| -------------------- | ------------- | ------------ | ------- | ----------------------------------------------- |
| `order`              | string        | **Required** | -       | Order address for fund extraction               |
| `remark`             | string        | **Required** | -       | Transaction description for financial records   |
| `withdraw_guard`     | string        | **Required** | -       | Guard address validating withdrawal conditions  |
| `index`              | number/string | Optional     | `0`     | Business reference number for accounting (≥0)   |
| `for_object`         | string        | Optional     | -       | Target object address for fund purpose tracking |
| `for_guard`          | string        | Optional     | -       | Additional verification guard reference         |

**Refund Mechanisms**: Two refund paths available - formal arbitration resolution or automated policy-based refunds through guards.

---

## 9. Marketing Tools

### Discount Generation

```json
{
  "gen_discount": [
    {
      "receiver": {
        "local_mark_first": true,
        "name_or_address": "loyal_customer_alice"
        // name_or_address: Discount recipient address
      },
      "discount": {
        "type": 0,
        // type: 0 = percentage discount, 1 = fixed amount discount
        "off": 20,
        // off: Discount value (20% off for type 0, or 20 tokens off for type 1)
        "price_greater": 100,
        // price_greater: Minimum purchase amount for discount activation
        "duration_minutes": 43200,
        // duration_minutes: Validity period in minutes (default: 30 days)
        "time_start": 1703923200000,
        // time_start: Discount activation timestamp (optional)
        "name": "Valentine's Day Special"
        // name: Display name for discount coupon
      },
      "count": 5
      // count: Number of discount coupons to generate
    }
  ]
}
```

| Discount Parameter | Type   | Required     | Default | Description                              |
| ------------------ | ------ | ------------ | ------- | ---------------------------------------- |
| `receiver`         | object | **Required** | -       | Discount recipient address configuration |
| `discount`         | object | **Required** | -       | Discount coupon configuration            |
| `count`            | number | Optional     | `1`     | Number of discount coupons to generate   |

| Receiver Parameter | Type    | Required     | Default | Description                         |
| ------------------ | ------- | ------------ | ------- | ----------------------------------- |
| `local_mark_first` | boolean | Optional     | `false` | Search address in local marks first |
| `name_or_address`  | string  | **Required** | -       | Recipient address or name           |

| Discount Config Parameter | Type          | Required     | Default      | Description                                        |
| ------------------------- | ------------- | ------------ | ------------ | -------------------------------------------------- |
| `type`                    | number        | **Required** | -            | `0` = percentage, `1` = fixed amount               |
| `off`                     | number        | **Required** | -            | Discount value (≥0)                                |
| `price_greater`           | number/string | Optional     | `0`          | Minimum purchase amount for activation             |
| `duration_minutes`        | number        | Optional     | `43200`      | Validity period in minutes (≥1, default: 30 days)  |
| `time_start`              | number        | Optional     | Current time | Discount activation timestamp in milliseconds (≥0) |
| `name`                    | string        | Optional     | `""`         | Display name for discount coupon                   |

**Discount Types**: Percentage discounts encourage larger purchases, fixed amount discounts provide guaranteed savings.

---

## 10. Advanced Features

### Service Cloning

```json
{
  "clone_new": {
    "namedNew": {
      "name": "flower_delivery_usdc",
      // name: Local identifier for cloned service
      "onChain": true,
      "tags": ["flowers", "usdc", "stablecoin"],
      "useAddressIfNameExist": false
    },
    "token_type_new": "0xUSDC::usdc::USDC"
    // token_type_new: Different payment token for cloned service
  }
}
```

**Use Cases**: Create service variants accepting different payment tokens, test new configurations, or expand to different markets while preserving original service setup.

**Configuration Inheritance**: Cloned service copies all configuration except token type, enabling rapid deployment of service variations.

---

## Data Types & Formats

### Address Format Options

#### Simple Address Reference

```json
{
  "name_or_address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

#### Named Address Reference

```json
{
  "name_or_address": "flower_delivery_service",
  "local_mark_first": true
}
```

**Address Resolution**: `local_mark_first: true` searches saved nicknames first, `false` searches account names first. Local marks are nicknames you save on your device for addresses you use often, enabling referencing "flower_delivery_service" instead of remembering the long blockchain address.

### Token Type Formats

| Token Category   | Service Format              | Example Use                     |
| ---------------- | --------------------------- | ------------------------------- |
| **SUI Native**   | `"0x2::sui::SUI"`           | Standard SUI payments           |
| **Custom Token** | `"0xPACKAGE::MODULE::TYPE"` | Business tokens, loyalty points |
| **Stablecoin**   | `"0xUSDC::usdc::USDC"`      | Price-stable payments           |

**Format Note**: Service uses Token format, different from Demand's Coin format.

---

## Complete Examples

### Flower Delivery Service (Real Implementation)

**From**: [Errand Flower Delivery Case](../Business_case/Errand-flower_delivery.md)

**AI Prompt**: "Create Jake's flower delivery service with Machine workflow integration, Guard protection, and Repository communication system."

```json
{
  "account": "{delivery_account_address}",
  "data": {
    "object": {
      "name": "flower_delivery_service",
      "permission": "{flower_delivery_permission_address}",
      "type_parameter": "0x2::sui::SUI",
      "onChain": true,
      "tags": ["flower delivery", "errand service"]
    },
    "description": "Flower delivery service",
    "location": "Manhattan, New York",
    "endpoint": "https://flower-delivery-api.com/service",
    "machine": "{flower_delivery_machine_address}",
    "repository": {
      "op": "set",
      "objects": ["{flower_delivery_records_address}"]
    },
    "sales": {
      "op": "add",
      "sales": [
        {
          "item": "basic_flower_delivery",
          "price": 100000000000,
          "stock": 1000,
          "endpoint": "https://flower-delivery-api.com/basic"
        },
        {
          "item": "urgent_flower_delivery",
          "price": 150000000000,
          "stock": 500,
          "endpoint": "https://flower-delivery-api.com/urgent"
        }
      ]
    },
    "withdraw_guard": {
      "op": "set",
      "guards": [
        {
          "guard": "{universal_withdrawal_guard_address}",
          "rate": 10000
        }
      ]
    },
    "refund_guard": {
      "op": "set",
      "guards": [
        {
          "guard": "{universal_refund_guard_address}",
          "rate": 10000
        }
      ]
    },
    "customer_required_info": {
      "pubkey": "public_key_for_encrypting_customer_info",
      "required_info": ["address", "phone", "name"]
    },
    "bPublished": false
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```

**Comprehensive Business Integration**: This Service showcases how multiple Wowok objects coordinate to create sophisticated business operations:

- **Machine Workflow Automation**: Eight-node workflow handles order confirmation, product verification, delivery completion, and exception scenarios with adaptive branching
- **Universal Guard System**: Unified withdrawal and refund Guards handle multiple completion states (product_confirmation, delivery_completed, refund_negotiation, buyer_cancellation)
- **Repository Communication**: Structured data storage for photos, messages, videos, location updates, and timestamps - enabling rich customer interaction beyond basic transactions
- **Customer Privacy Protection**: Encrypted information collection (address, phone, name) with public key encryption for sensitive delivery details

**Business Model**: Two-tier pricing (basic $100, urgent $150) with high inventory capacity (1000+ slots) supports scalable delivery operations while maintaining service quality differentiation.

### LA28 Olympic Volunteer Service (Real Implementation)

**From**: [LA28 Design Documentation](../文档/LA28/LA28设计梳理.md)

**AI Prompt**: "Create LA28 Olympic volunteer registration service supporting 100,000 applicants with 0.2 SUI registration fee, integrated with complete verification workflow."

```json
{
  "account": "LA28_organizer",
  "data": {
    "object": {
      "name": "LA28_main_service_v3_complete",
      "permission": "LA28_Owner",
      "type_parameter": "0x2::sui::SUI",
      "onChain": true,
      "tags": ["LA28", "Olympic", "volunteer", "registration"]
    },
    "description": "2028 Los Angeles Olympic Games volunteer registration service, supporting 100,000 applicants with 0.2 SUI registration fee",
    "location": "Los Angeles, California",
    "machine": "LA28_main_machine_final_config",
    "sales": {
      "op": "add",
      "sales": [
        {
          "item": "LA28_volunteer_registration",
          "price": 200000000,
          "stock": 100000
        }
      ]
    },
    "payee_treasury": {
      "type_parameter": "0x2::sui::SUI",
      "permission": "LA28_Owner",
      "name": "LA28_main_service_treasury",
      "tags": ["LA28", "volunteer", "registration"]
    },
    "bPublished": true
  },
  "session": {
    "network": "sui testnet"
  }
}
```

**Complex Service Architecture**: This Service demonstrates advanced patterns beyond basic product sales:

- **Triple Guard Verification**: Applicants must pass three automated checks (basic qualifications, professional skills, position matching) before approval
- **Nested Service Integration**: Uses suppliers mechanism in Machine workflow - approved volunteers must purchase sub-services for task assignment
- **Scale-Ready Design**: Handles 100,000 concurrent applications with automated processing and Treasury fund collection
- **Permission Hierarchy**: Five-tier permission system (Owner→Admin→Lead→Supervisor→Volunteer) with weighted approval mechanisms

**Business Logic**: Registration fee (0.2 SUI) filters serious applicants and covers operational costs. Non-refundable model ensures commitment while automated verification reduces manual review burden.

**Deployed Address**: `0x4efdf4c455a8c6f43c06faebc8647a74cccc30245e5c185ebb3884738d6f27b8`

### Personal Shopping Service (Real Implementation)

**From**: [代购服务完整案例文档](../文档/代购/代购服务完整案例文档.md)

**AI Prompt**: "Create personal shopping service with dual Treasury protection (deposit + main escrow), timeout confirmation mechanism, and multi-refund-less-supplement logic."

```json
{
  "account": "personal_shopper",
  "data": {
    "object": {
      "name": "personal_shopping_service",
      "type_parameter": "0x2::sui::SUI",
      "permission": "shopping_permission",
      "onChain": true,
      "tags": ["personal shopping", "escrow", "dual protection"]
    },
    "description": "Personal shopping service with dual Treasury protection and timeout confirmation",
    "location": "Global service",
    "machine": "shopping_workflow_machine",
    "sales": {
      "op": "add",
      "sales": [
        {
          "item": "personal_shopping_service",
          "price": 25000000000,
          "stock": 1000,
          "endpoint": "https://shopping-service.com/details"
        }
      ]
    },
    "withdraw_guard": {
      "op": "set",
      "guards": [
        {
          "guard": "shopping_completion_guard",
          "rate": 10000
        }
      ]
    },
    "refund_guard": {
      "op": "set",
      "guards": [
        {
          "guard": "shopping_refund_guard",
          "rate": 10000
        }
      ]
    },
    "bPublished": true
  },
  "session": {
    "network": "sui testnet"
  }
}
```

**Advanced Trust Engineering**: This Service solves traditional marketplace trust problems through innovative financial architecture:

- **Dual Treasury Protection**: Separate deposit Treasury (protects shopper's labor costs) and main escrow Treasury (ensures transaction safety with multi-refund-less-supplement logic)
- **Game Theory Application**: Converts "prisoner's dilemma" into "coordination game" - eliminates single-party betrayal incentives, making cooperation the only profitable strategy
- **Mature Platform Inspiration**: Adopts Xianyu/Taobao's proven timeout auto-confirmation mechanism (10-day buyer confirmation window, defaults to seller protection)
- **Precise Financial Control**: Four specific Guards handle different scenarios - deposit withdrawal after purchase completion, buyer refund after 48-hour timeout, seller payment after shipping, buyer remainder after transaction completion

**Technical Innovation**: Uses Machine workflow to control complex business logic while Guards only handle simple verification, achieving clear separation of concerns and robust dispute resolution.

### Customer Order Creation (Flower Delivery)

**From**: Real flower delivery workflow scenario

**AI Prompt**: "Help Sarah order urgent flower delivery for Emma's birthday surprise, including special delivery instructions."

```json
{
  "account": "sarah_customer",
  "data": {
    "object": "flower_delivery_service",
    "order_new": {
      "buy_items": [
        {
          "item": "urgent_flower_delivery",
          "max_price": 160000000000,
          "count": 1
        }
      ],
      "customer_info_required": "Sarah, Emma's birthday surprise - white roses, watercolor art preference, deliver by 3 PM",
      "namedNewOrder": {
        "name": "emma_birthday_roses",
        "onChain": true,
        "tags": ["birthday", "urgent", "watercolor"]
      }
    }
  },
  "session": {
    "network": "sui testnet"
  }
}
```

**Real Scenario**: Sarah needs white roses delivered to Emma by 3 PM for a birthday surprise, with personalized watercolor-style gift card matching Emma's artistic preferences.

**Order Features Demonstrated**:

- **Price Protection**: `max_price` set higher than service price (160 vs 150 SUI) protects against price fluctuations
- **Rich Customer Information**: Encrypted delivery requirements include recipient preferences, timing constraints, and personalization requests
- **Order Naming**: Local identifier (`emma_birthday_roses`) enables easy reference for subsequent operations
- **Tag Organization**: Order tags facilitate filtering and business analytics

### Business Revenue Withdrawal (Real Scenarios)

**From**: Universal withdrawal patterns across real implementations

**AI Prompt**: "Configure Jake to withdraw delivery payment after completing Emma's birthday flower delivery, using universal withdrawal guard verification."

```json
{
  "account": "jake_delivery_person",
  "data": {
    "object": "flower_delivery_service",
    "order_withdrawl": {
      "order": "emma_birthday_roses",
      "data": {
        "remark": "Service completion payment - delivered white roses with watercolor card to Emma by 3 PM",
        "withdraw_guard": "universal_withdrawal_guard",
        "index": "20241215001"
      }
    }
  },
  "session": {
    "network": "sui testnet"
  }
}
```

**Real Protection**: Uses universal withdrawal guard that verifies Progress reached completion states: "product_confirmation", "delivery_completed", "refund_negotiation", or "buyer_cancellation".

**Withdrawal Features Demonstrated**:

- **Business Documentation**: Detailed `remark` creates audit trail for financial records and business operations
- **Guard Verification**: Universal withdrawal guard automatically verifies workflow completion before allowing fund extraction
- **Business Reference**: `index` parameter enables integration with external accounting systems and transaction tracking
- **Completion-Based Payment**: Funds only release when service delivery reaches verified completion states

### Marketing Campaign (Flower Delivery)

**AI Prompt**: "Generate Valentine's Day discount coupons for loyal flower delivery customers, encouraging larger orders with percentage-based savings."

```json
{
  "account": "jake_delivery_person",
  "data": {
    "object": "flower_delivery_service",
    "gen_discount": [
      {
        "receiver": {
          "name_or_address": "loyal_customer_alice",
          "local_mark_first": true
        },
        "discount": {
          "type": 0,
          "off": 20,
          "price_greater": 100,
          "duration_minutes": 43200,
          "time_start": 1703923200000,
          "name": "Valentine's Day Special"
        },
        "count": 5
      }
    ]
  },
  "session": {
    "network": "sui testnet"
  }
}
```

**Marketing Features Demonstrated**:

- **Targeted Distribution**: Specific customer targeting through saved address references
- **Conditional Activation**: Minimum purchase thresholds encourage larger orders
- **Time-Limited Campaigns**: Precise validity periods create urgency and seasonal relevance
- **Bulk Generation**: Multiple coupons for comprehensive customer outreach

## **Template Prompt**: "Create Service configuration for [business type] selling [products] with [payment method], integrating with [other objects] for [business workflow]."

**Development Tip**: Test all integrations on testnet before publishing Service. Published services lock critical configurations permanently.

---

## Query Capabilities

Service objects provide comprehensive business intelligence and customer activity tracking for analyzing service performance, monitoring product sales, and understanding customer behavior patterns.

**What You Can Query:**
- **Complete service configuration** - including workflow machines, guard requirements, arbitration commitments, and product catalog
- **All available products** - with pricing, inventory, and availability information for product discovery
- **Detailed product specifications** - including endpoints and stock levels for specific product analysis
- **Order creation events** - customer activity tracking and service usage monitoring across the system

**Quick Query Examples:**
- "Show me the complete service configuration including workflow machine and arbitration setup"
- "List all products in service_addr to see pricing and availability"
- "Get the details of product 'premium_delivery' in service_addr to understand its specifications"
- "Check the service workflow machine and arbitration setup before making a purchase"

**Detailed Query Reference:** See the complete [Service Object Query Capabilities](./Query_Reference.md#service-object-query-capabilities) in the Wowok Query Technical Reference for field specifications, query operations, and advanced usage patterns.

---
