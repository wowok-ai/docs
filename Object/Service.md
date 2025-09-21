# Service Object: Your Complete Business Platform

> "Transform ideas into revenue - create sellable services with automated order processing, payment collection, and business operations management"

## How to Use This Documentation

### Document Structure
- **[Overview](#overview)**: Service capabilities and business workflow
- **[Core Parameters](#core-parameters)**: All configuration options organized by function
- **[Data Types & Formats](#data-types--formats)**: Technical reference for addresses and types
- **[Integration Patterns](#integration-patterns)**: How Service works with other objects
- **[Complete Examples](#complete-examples)**: Working business configurations

### Navigation by Need
| I need to... | Go to section |
|--------------|---------------|
| Create new Service | [Core Parameters → Object Management](#1-object-management) |
| Add/remove products | [Core Parameters → Sales Management](#3-sales-management) |
| Set up payment flow | [Core Parameters → Fund Management](#5-fund-management) |
| Create customer orders | [Core Parameters → Order System](#8-order-system-operations) |
| Connect with Machine/Guards | [Core Parameters → Business Workflow](#4-business-workflow) |
| Generate discount coupons | [Core Parameters → Marketing Tools](#9-marketing-tools) |
| Reference tables | [Data Types & Formats](#data-types--formats) |

---

## Overview

### Definition
Service objects create complete business platforms enabling revenue generation through product sales, automated order processing, and integrated payment collection. Services manage the entire customer journey from product catalog to order fulfillment.

### Core Capabilities
- **Product Catalog Management**: Define sellable items with pricing, inventory, and product details
- **Order Processing System**: Automated order creation, payment collection, and fulfillment tracking
- **Integrated Payment Flow**: Customer payments → Service → Treasury → Business operations
- **Business Rule Enforcement**: Purchase conditions, withdrawal controls, refund policies through Guard integration
- **Workflow Automation**: Machine integration for automated service delivery processes
- **Customer Management**: Information collection, privacy protection, and relationship tracking

### Important Technical Notes
- Token type uses Token format (`"0x2::sui::SUI"`), not Coin format
- Publishing (`bPublished: true`) permanently locks Machine and Guard configuration
- Order objects allow buyer deposits but restrict buyer withdrawals
- Service owners can withdraw from Orders without restrictions (normal business flow)
- Multiple Services can share the same Machine workflow

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

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | Optional | - | Service identifier for easy reference |
| `type_parameter` | string | **Required** | - | Payment token type: `"0x2::sui::SUI"` (Token format, not Coin) |
| `permission` | string/object | **Required** | - | Permission object controlling service operations |
| `onChain` | boolean | Optional | `false` | Whether metadata visible on blockchain |
| `tags` | string[] | Optional | `[]` | Service categorization labels |
| `useAddressIfNameExist` | boolean | Optional | `false` | Name conflict resolution |

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

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `description` | string | Optional | - | Detailed service explanation for customers |
| `location` | string | Optional | - | Geographic service area or coordinates |
| `endpoint` | string/null | Optional | `null` | HTTPS URL for extended product information |

**Endpoint Usage**: System appends `?&service={service_id}&product={product_name}` for product details.

### Service Status Management
```json
{
  "bPublished": true,
  // Publishes service for customer orders, locks configuration changes
  "bPaused": false
  // Normal operation, accepting new orders
}
```

| Parameter | Type | Required | Default | Description | Reversible |
|-----------|------|----------|---------|-------------|------------|
| `bPublished` | boolean | Optional | `false` | **Enables order creation, locks Machine/Guard configuration** | ❌ **Permanent** |
| `bPaused` | boolean | Optional | `false` | Temporarily stops new order acceptance | ✅ Can toggle |

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

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `op` | enum | Required | - | `"add"` or `"remove"` |
| `item` | string | Required | - | **Unique product identifier within service** |
| `price` | number/string | Required | - | Product price in token base units (≥0) |
| `stock` | number/string | Required | - | Available inventory quantity (≥0) |
| `endpoint` | string/null | Optional | `null` | Product-specific detail URL |
| `sales_name` | string[] | Required (remove) | - | Product names to remove |

**Inventory Management**: When stock reaches 0, product automatically becomes unavailable for new orders. Existing orders remain unaffected.

**Price Format**: Use base token units. For SUI: `50` = 50 SUI, `1` = 1 SUI.

## 4. Business Workflow

### Machine Integration
```json
{
  "machine": "flower_delivery_workflow"
  // machine: Associated Machine object address defining service delivery workflow
}
```

**What is Machine**: Machine objects define step-by-step workflows for service delivery - from order creation through completion stages with automated progression rules.

**Technical Mechanism**: Multiple Services can share the same Machine workflow. Machine defines the step-by-step process from order creation to completion.

**Configuration Lock**: Once Service is published (`bPublished: true`), Machine reference cannot be changed. This ensures workflow consistency for customers.

**For detailed Machine configuration**: → [Machine Documentation](./Machine.md)

### Purchase Conditions
```json
{
  "buy_guard": "vip_customer_verification"
  // buy_guard: Guard object address for purchase eligibility verification
}
```

**What is Guard**: Guard objects are verification engines that return true/false based on configurable conditions - time windows, account balances, custom business logic.

**Technical Mechanism**: Guard verification runs before order creation. Only customers passing Guard conditions can purchase this service.

**Common Use Cases**: VIP membership verification, geographic restrictions, time-based access windows.

**For detailed Guard configuration**: → [Guard Documentation](./Guard.md)

---

## 5. Fund Management

### Treasury Configuration
```json
{
  "payee_treasury": "business_main_fund"
  // payee_treasury: Treasury object address receiving customer payments
}
```

**What is Treasury**: Treasury objects are shared fund pools with programmable access controls, enabling multiple authorized entities to deposit and withdraw according to predefined rules.

**Payment Flow**: Customer payments automatically flow into specified Treasury for centralized fund management.

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
        "percent": 80
        // percent: Percentage of funds accessible through this guard (0-100)
      },
      {
        "guard": "owner_approval_required", 
        "percent": 100
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
        "percent": 50
        // percent: Percentage of order funds refundable through this guard
      }
    ]
  }
}
```

**Order Fund Flow Distinction**: 
- **Buyer deposits**: Can add funds to Order objects but cannot directly withdraw
- **Service owner access**: Can withdraw from Orders without restrictions (normal business flow)
- **Refund guards**: Control when/how buyers can reclaim funds from Orders

Refund guards enable satisfaction guarantees (e.g., 30-day money-back policy) and dispute resolution processes (e.g., arbitration-based refunds for service quality issues).

| Operation | Type | Required | Default | Purpose | Guard Usage |
|-----------|------|----------|---------|---------|-------------|
| `add` | enum | Required | - | Append new guards | Multiple guards create spending tiers |
| `set` | enum | Required | - | Replace all guards | Complete guard policy reset |
| `remove` | enum | Required | - | Delete specific guards | Remove outdated conditions |
| `removeall` | enum | Required | - | Clear all guards | Remove all restrictions |

| Guard Parameter | Type | Required | Default | Description |
|-----------------|------|----------|---------|-------------|
| `guard` | string | Required | - | Guard object address or name |
| `percent` | number | Required | - | Withdrawal percentage (0-100) |

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

### External Treasury Incentives
```json
{
  "extern_withdraw_treasury": {
    "op": "add",
    "objects": ["loyalty_rewards_treasury", "referral_bonus_treasury"] 
    // objects: External Treasury addresses providing additional customer rewards
  }
}
```

| Integration Type | Purpose | Technical Effect |
|------------------|---------|------------------|
| **Repository** | Shared data storage | Service can query/store customer data, delivery records |
| **Arbitration** | Dispute resolution | Customers can escalate issues through formal arbitration |
| **External Treasury** | Customer incentives | Additional reward pools beyond main service payments |

| Integration Parameter | Type | Required | Default | Description |
|----------------------|------|----------|---------|-------------|
| `op` | enum | Required | - | `"add"`, `"set"`, `"remove"`, `"removeall"` |
| `objects` | string[] | Required | - | Array of object addresses or names |

**Cross-Object Data Flow**: These integrations enable Service to participate in larger business ecosystems with shared data and processes.
## 7. Customer Management

### Customer Information Requirements
```json
{
  "customer_required_info": {
    "pubkey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQE...",
    // pubkey: Public key for encrypting customer information
    "required_info": ["address", "phone", "postcode", "name", "special_instructions"]
    // required_info: Array of information types customers must provide
  }
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pubkey` | string | Required | - | Public key for encrypting customer information |
| `required_info` | string[] | Required | - | Array of information types customers must provide |

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

### Order Management Operations

| Operation | JSON Parameter | Purpose |
|-----------|----------------|---------|
| **Agent Assignment** | `order_agent.agents[]` | Authorize additional addresses to manage order |
| **Payer Transfer** | `order_payer.payer_new` | Change order ownership to different account |
| **Payment Collection** | `order_receive.order` | Extract received payments to order owner |
| **Information Update** | `order_required_info` | Modify customer information requirements |

| Order Parameter | Type | Required | Default | Description |
|-----------------|------|----------|---------|-------------|
| `item` | string | Required | - | Product name from service sales catalog |
| `max_price` | number/string | Required | - | Maximum willing to pay (≥0) |
| `count` | number/string | Required | - | Quantity to purchase (≥0) |
| `customer_info_required` | string | Optional | - | Customer information string (encrypted) |
| `discount_object` | string | Optional | - | Discount object address for price reduction |

```json
{
  "order_agent": {
    "order": "roses_for_anniversary",
    // order: Order address (optional, defaults to newly created order)
    "agents": [
      {
        "local_mark_first": true,
        "name_or_address": "delivery_coordinator"
        // name_or_address: Agent address with order management rights
      }
    ]
  }
}
```

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

| Withdrawal Parameter | Type | Required | Default | Description |
|---------------------|------|----------|---------|-------------|
| `order` | string | Required | - | Order address for fund extraction |
| `remark` | string | Required | - | Transaction description for financial records |
| `withdraw_guard` | string | Required | - | Guard address validating withdrawal conditions |
| `index` | number/string | Optional | `0` | Business reference number for accounting |
| `for_object` | string | Optional | - | Target object address for fund purpose tracking |
| `for_guard` | string | Optional | - | Additional verification guard reference |

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

| Discount Parameter | Type | Required | Default | Description |
|-------------------|------|----------|---------|-------------|
| `receiver` | object | Required | - | Discount recipient address configuration |
| `discount` | object | Required | - | Discount coupon configuration |
| `count` | number | Optional | `1` | Number of discount coupons to generate |

| Receiver Parameter | Type | Required | Default | Description |
|-------------------|------|----------|---------|-------------|
| `local_mark_first` | boolean | Optional | `false` | Search address in local marks first |
| `name_or_address` | string | Required | - | Recipient address or name |

| Discount Config Parameter | Type | Required | Default | Description |
|--------------------------|------|----------|---------|-------------|
| `type` | number | Required | - | `0` = percentage, `1` = fixed amount |
| `off` | number | Required | - | Discount value (≥0) |
| `price_greater` | number/string | Optional | - | Minimum purchase amount for activation |
| `duration_minutes` | number | Optional | `43200` | Validity period in minutes (default: 30 days) |
| `time_start` | number | Optional | Current time | Discount activation timestamp (ms) |
| `name` | string | Optional | `""` | Display name for discount coupon |

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
    "token_type_new": "0x2::coin::Coin<0xUSDC::usdc::USDC>"
    // token_type_new: Different payment token for cloned service
  }
}
```

**Use Cases**: Create service variants accepting different payment tokens, test new configurations, or expand to different markets while preserving original service setup.

**Configuration Inheritance**: Cloned service copies all configuration except token type, enabling rapid deployment of service variations.

---
## 继续写剩余部分

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

| Token Category | Service Format | Example Use |
|---------------|----------------|-------------|
| **SUI Native** | `"0x2::sui::SUI"` | Standard SUI payments |
| **Custom Token** | `"0xPACKAGE::MODULE::TYPE"` | Business tokens, loyalty points |
| **Stablecoin** | `"0x2::coin::Coin<0xUSDC::usdc::USDC>"` | Price-stable payments |

**Format Note**: Service uses Token format, different from Demand's Coin format.

### Data Type Enumerations

| Data Type | Values | Description |
|-----------|--------|-------------|
| **Boolean** | `true`, `false` | Logical values |
| **Network** | `"sui mainnet"`, `"sui testnet"`, `"wowok mainnet"`, `"wowok testnet"` | Blockchain network selection |
| **Session Retention** | `"always"`, `"session"` | Network configuration persistence |
| **Address Resolution** | `true`, `false` | Local mark vs account name priority |
| **Visibility** | `true`, `false` | On-chain metadata visibility |
| **Service Status** | `true`, `false` | Published/paused state |
| **Price Format** | `number`, `string` | Numeric or string representation |
| **Token Format** | `"0x2::sui::SUI"`, `"0xPACKAGE::MODULE::TYPE"` | Token type specification (Service uses Token format, not Coin format) |

### Customer Information Types

| Standard Types | Custom Types | Purpose |
|---------------|--------------|---------|
| `"address"` | `"delivery_instructions"` | Location and logistics |
| `"phone"` | `"allergies"` | Contact and health info |
| `"postcode"` | `"preferred_time"` | Geographic and scheduling |
| `"name"` | `"special_requests"` | Identity and customization |

### Parameter Value Constraints

| Parameter | Min Value | Max Value | Special Rules |
|-----------|-----------|-----------|---------------|
| `price` | `0` | No limit | Must be ≥ 0 |
| `stock` | `0` | No limit | Must be ≥ 0 |
| `count` | `1` | No limit | Must be ≥ 1 for orders |
| `percent` | `0` | `100` | Withdrawal percentage (0-100) |
| `duration_minutes` | `1` | No limit | Validity period in minutes |
| `max_price` | `0` | No limit | Must be ≥ 0 |
| `time_start` | `0` | No limit | Unix timestamp in milliseconds |
| `index` | `0` | No limit | Business reference number |

### Default Values Summary

| Parameter Category | Common Defaults |
|-------------------|-----------------|
| **Boolean Flags** | `false` (onChain, bPublished, bPaused, local_mark_first) |
| **Arrays** | `[]` (tags, required_info, objects) |
| **Strings** | `""` (name), `null` (endpoint) |
| **Numbers** | `0` (index), `1` (count), `43200` (duration_minutes) |
| **Objects** | `null` (machine, buy_guard, customer_required_info) |

---

## Integration Patterns

Service objects serve as business platforms that coordinate with other Wowok objects:

**Core Integration Flow**: Permission → Treasury → Service → Machine → Orders → Revenue

**Key Integration Points**:
- **Permission**: Controls who can manage Service and create orders
- **Treasury**: Receives and manages all Service revenues  
- **Machine**: Automates service delivery workflows
- **Guards**: Enforce business rules for purchases, withdrawals, and refunds
- **Repository**: Stores customer data and business records
- **Arbitration**: Handles customer disputes and service issues

**Technical Dependencies**: Service requires Permission object. Treasury, Machine, and Guards enhance business capabilities but are optional.

**Business Model Patterns**:
| Business Model | Configuration | Integration Focus |
|----------------|---------------|-------------------|
| **Physical Products** | Sales catalog + Machine workflow + Treasury | Inventory → Order → Fulfillment → Payment |
| **Digital Services** | Buy_guard + Repository + Arbitration | Access control → Data delivery → Dispute resolution |
| **Subscription Services** | Treasury + Withdrawal guards + Machine | Recurring payments → Service delivery → Usage tracking |
| **Marketplace Platform** | Multiple Services + Shared Treasury + Arbitration | Vendor management → Payment routing → Dispute handling |

## Complete Examples

### Basic Product Service Setup

**AI Prompt**: "Create a flower delivery service that accepts SUI payments, sells roses and wedding packages, uses existing shop permission and treasury, and publishes immediately for customer orders."

```json
{
  "account": "flower_shop_owner",
  "data": {
    "object": {
      "name": "downtown_flowers",
      "type_parameter": "0x2::sui::SUI",
      "permission": "shop_permission",
      "onChain": true,
      "tags": ["flowers", "delivery", "gifts"]
    },
    "description": "Fresh flower delivery service with same-day delivery in downtown area",
    "location": "Downtown District, 5-mile radius",
    "sales": {
      "op": "add",
      "sales": [
        {
          "item": "Rose Bouquet",
          "price": 45,
          "stock": 50
        },
        {
          "item": "Wedding Package",
          "price": 300,
          "stock": 10
        }
      ]
    },
    "payee_treasury": "shop_main_fund",
    "bPublished": true
  },
  "session": {
    "network": "sui testnet"
  }
}
```

### Customer Order Creation

**AI Prompt**: "Help customer Alice order 2 rose bouquets from downtown_flowers service, with maximum willingness to pay 50 SUI each, including her delivery information."

```json
{
  "account": "customer_alice",
  "data": {
    "object": "downtown_flowers",
    "order_new": {
      "buy_items": [
        {
          "item": "Rose Bouquet",
          "max_price": 50,
          "count": 2
        }
      ],
      "customer_info_required": "Alice Johnson, 123 Main St, Apt 4B, 555-0123",
      "namedNewOrder": {
        "name": "anniversary_roses",
        "onChain": true
      }
    }
  },
  "session": {
    "network": "sui testnet"
  }
}
```

### Business Revenue Withdrawal

**AI Prompt**: "Configure flower shop owner to withdraw completed service payment from anniversary_roses order, with proper business documentation and approval guard verification."

```json
{
  "account": "flower_shop_owner",
  "data": {
    "object": "downtown_flowers",
    "order_withdrawl": {
      "order": "anniversary_roses",
      "data": {
        "remark": "Service completion payment for rose delivery",
        "withdraw_guard": "daily_operations_approval",
        "index": "20241215001"
      }
    }
  },
  "session": {
    "network": "sui testnet"
  }
}
```

### Discount Campaign

**AI Prompt**: "Generate 50 holiday discount coupons giving 15% off orders over 100 SUI, valid for one week, for loyal customers in the flower shop's customer list."

```json
{
  "account": "flower_shop_owner",
  "data": {
    "object": "downtown_flowers",
    "gen_discount": [
      {
        "receiver": {
          "name_or_address": "loyal_customer_list",
          "local_mark_first": true
        },
        "discount": {
          "type": 0,
          "off": 15,
          "price_greater": 100,
          "duration_minutes": 10080,
          "name": "Holiday Special 15% Off"
        },
        "count": 50
      }
    ]
  },
  "session": {
    "network": "sui testnet"
  }
}
```

**Template Prompt**: "Create Service configuration for [business type] selling [products] with [payment method], integrating with [other objects] for [business workflow]."
---

## Common Issues & Troubleshooting

### Service Creation Problems
**Problem**: "Permission object not found" or "Invalid type_parameter"  
**Solutions**:
1. Create Permission object first using Permission MCP
2. Use Token format: `"0x2::sui::SUI"` not Coin format `"0x2::coin::Coin<0x2::sui::SUI>"`
3. Ensure account has admin rights in Permission object

### Publishing and Configuration Issues  
**Problem**: "Cannot modify Machine/Guard after publishing"  
**Solutions**:
1. Configure all business rules before setting `bPublished: true`
2. Use `bPaused: true` for temporary order suspension without losing configuration
3. Clone service with `clone_new` for different configurations

### Order Processing Failures
**Problem**: "Insufficient stock" or "Price exceeded max_price"  
**Solutions**:
1. Check product stock levels with sales management operations
2. Update `max_price` in order creation to account for price changes
3. Verify customer has sufficient balance for order total

### Payment and Withdrawal Issues
**Problem**: "Guard verification failed" or "Withdrawal permission denied"  
**Solutions**:
1. Ensure Treasury is properly configured and funded
2. Verify withdrawal guards exist and conditions are met
3. Check account has required permissions in Permission object
4. Provide correct witness data for Guard verification

### Integration Problems
**Problem**: "Machine not found" or "Repository access denied"  
**Solutions**:
1. Verify all referenced objects exist on same network
2. Ensure Machine is published before Service publication
3. Check Repository permissions allow Service access
4. Confirm object addresses are correct and accessible

**Development Tip**: Test all integrations on testnet before publishing Service. Published services lock critical configurations permanently.
