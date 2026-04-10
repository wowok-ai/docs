# Service Component (🏪 Service Marketplace)

---

## Component Overview

Service is WoWok's commercial trading center, used to create and manage product/service listings, bind workflow templates to order processing, set prices, issue discount coupons, and establish quality standards.

---

## Feature Tree

```
Service Component
├── Create New Service
│   ├── Set Name (object.name)
│   ├── Bind Permission (object.permission)
│   ├── Set Description (description)
│   └── Set Location (location)
├── Manage Sales List (sales)
│   ├── Add Product (sales.op = "add")
│   ├── Set Product List (sales.op = "set")
│   ├── Remove Product (sales.op = "remove")
│   └── Clear Products (sales.op = "clear")
├── Bind Components
│   ├── Bind Machine (machine)
│   ├── Bind Repository (repositories)
│   ├── Bind Reward (rewards)
│   ├── Bind Arbitration (arbitrations)
│   └── Bind Contact (um)
├── Configure Order Fund Allocators (order_allocators)
├── Set Customer Required Information (customer_required)
├── Issue Discount Coupons (discount)
├── Destroy Discount Coupons (discount_destroy)
├── Manage Compensation Fund
│   ├── Add Compensation Fund (compensation_fund_add)
│   ├── Set Lock Time (compensation_locked_time_add)
│   └── Receive Compensation Fund (compensation_fund_receive)
├── Publish/Pause
│   ├── Publish Service (publish)
│   └── Pause Accepting Orders (pause)
├── Create Order (order_new)
└── Receive Objects (owner_receive)
```

---

## Sub-feature 1: Create New Service

### Feature Description

Create a new Service object for providing products or services.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|------|------|------|------|------|
| `object.name` | string | No | Local mark name | Max 64 characters |
| `object.id` | string | No | Object ID | 0x prefix + 64 hex characters |
| `object.type` | string | Yes | Object type | Must be "Service" |
| `object.permission` | string/object | No | Permission object | Can be existing permission ID/name, or new permission object |
| `description` | string | No | Service description | Max 4000 characters |
| `location` | string | No | Service location | Max 256 characters |

### Examples

#### Example 1.1: Create Simple Service

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service",
      "type": "Service",
      "permission": "existing_permission"
    },
    "description": "Professional design service - providing high-quality design solutions",
    "location": "Online service, global support",
    "customer_required": ["email", "phone"]
  }
}
```

#### Example 1.2: Create Service and New Permission Simultaneously

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "web_development_service",
      "type": "Service",
      "permission": {
        "name": "web_service_permission"
      }
    },
    "description": "Website development service",
    "location": "Online service",
    "customer_required": ["email"]
  }
}
```

---

## Sub-feature 2: Manage Sales List (sales)

### Feature Description

Manage the product or service sales list of Service.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `sales.op` | string | Yes | Operation type: add/set/remove/clear |
| `sales.sales` | array | Required for add/set | Sales product list |
| `sales.sales[].name` | string | Yes | Product name |
| `sales.sales[].price` | string | Yes | Price (minimum unit) |
| `sales.sales[].stock` | string | Yes | Stock quantity |
| `sales.sales[].wip` | string | Yes | WIP file URL |
| `sales.sales[].wip_hash` | string | Yes | WIP file hash |
| `sales.sales[].description` | string | No | Product description |
| `sales.sales_name` | array | Required for remove | List of product names to remove |

### Operation Type Description

| Operation Type | Description |
|----------|------|
| `add` | Add new products to existing list |
| `set` | Replace entire product list |
| `remove` | Remove specified products (by name) |
| `clear` | Clear all products |

### Important Notes

⚠️ **wip and wip_hash must be valid WIP file URL and hash**, used for product commitment.

### Examples

#### Example 2.1: Add Product

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "LOGO Design",
          "price": "5000000000",
          "stock": "100",
          "wip": "https://example.com/logo_design.wip",
          "wip_hash": "sha256:logo_design_wip_hash",
          "description": "Professional LOGO design, 3 proposals, modifications until satisfied"
        },
        {
          "name": "Poster Design",
          "price": "2000000000",
          "stock": "200",
          "wip": "https://example.com/poster_design.wip",
          "wip_hash": "sha256:poster_design_wip_hash",
          "description": "Event poster design, 2 proposals"
        }
      ]
    }
  }
}
```

#### Example 2.2: Set Product List (Replace)

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "sales": {
      "op": "set",
      "sales": [
        {
          "name": "LOGO Design",
          "price": "5000000000",
          "stock": "100",
          "wip": "https://example.com/logo_design.wip",
          "wip_hash": "sha256:logo_design_wip_hash",
          "description": "Professional LOGO design"
        }
      ]
    }
  }
}
```

#### Example 2.3: Remove Product

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "sales": {
      "op": "remove",
      "sales_name": ["Old Product"]
    }
  }
}
```

#### Example 2.4: Clear Products

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "sales": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 3: Bind Machine

### Feature Description

Bind workflow template Machine to Service.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `machine` | string/null | Yes | Machine object ID or name, or null to unbind |

### Important Notes

⚠️ **Machine must be published before binding**.

⚠️ **machine field cannot be modified after publishing**.

### Example

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "machine": "design_workflow"
  }
}
```

---

## Sub-feature 4: Bind Other Components

### Feature Description

Bind Repository, Reward, Arbitration, Contact and other components to Service.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `repositories` | array | No | Repository object ID/name list |
| `rewards` | array | No | Reward object ID/name list |
| `arbitrations` | array | No | Arbitration object ID/name list |
| `um` | string/null | No | Contact object ID/name, or null to unbind |

### Important Notes

⚠️ **arbitrations field cannot be modified after publishing**.

### Example

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "repositories": ["service_data"],
    "rewards": ["new_user_bonus"],
    "arbitrations": ["service_arbitration"],
    "um": "service_contact"
  }
}
```

---

## Sub-feature 5: Configure Order Fund Allocators (order_allocators)

### Feature Description

Configure order fund allocation rules, automatically distribute funds proportionally after order completion.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `order_allocators.allocators` | array | Yes | Allocator list |
| `order_allocators.allocators[].to` | string | Yes | Recipient address or name |
| `order_allocators.allocators[].ratio` | string | Yes | Allocation ratio (1000000000 = 100%) |

### Important Notes

⚠️ **Total ratio should equal 1000000000 (i.e., 100%)**.

⚠️ **order_allocators field cannot be modified after publishing**.

### Example

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "order_allocators": {
      "allocators": [
        {
          "to": "designer_address",
          "ratio": "900000000"
        },
        {
          "to": "platform_address",
          "ratio": "100000000"
        }
      ]
    }
  }
}
```

---

## Sub-feature 6: Set Customer Required Information (customer_required)

### Feature Description

Set information fields that customers must provide when placing orders.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `customer_required` | array | Yes | Required information field list |

### Example

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "customer_required": ["email", "phone", "name"]
  }
}
```

---

## Sub-feature 7: Issue Discount Coupons (discount)

### Feature Description

Issue discount coupons for Service.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `discount.name` | string | Yes | Discount name |
| `discount.discount_type` | string | Yes | Discount type: fixed/percentage |
| `discount.discount_value` | string | Yes | Discount value (minimum unit) |
| `discount.benchmark` | number/string | No | Discount threshold |
| `discount.time_ms_start` | number | No | Start time (milliseconds) |
| `discount.time_ms_end` | number | No | End time (milliseconds) |
| `discount.count` | number | No | Issue quantity |
| `discount.recipient` | array | No | Specified recipient list |
| `discount.transferable` | boolean | No | Whether transferable |

### Discount Type Description

| Type | Description |
|------|------|
| `fixed` | Fixed amount discount |
| `percentage` | Percentage discount (100000000 = 10%) |

### Examples

#### Example 7.1: Issue Percentage Discount Coupon

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "discount": {
      "name": "First Order 10% Off",
      "discount_type": "percentage",
      "discount_value": "100000000",
      "count": 50,
      "recipient": [],
      "transferable": false
    }
  }
}
```

#### Example 7.2: Issue Fixed Amount Discount Coupon

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "discount": {
      "name": "Full Reduction Coupon",
      "discount_type": "fixed",
      "discount_value": "500000000",
      "benchmark": "5000000000",
      "count": 100,
      "transferable": true
    }
  }
}
```

---

## Sub-feature 8: Destroy Discount Coupons (discount_destroy)

### Feature Description

Destroy issued discount coupons.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `discount_destroy` | array | Yes | List of discount coupon object IDs/names to destroy |

### Example

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "discount_destroy": ["old_discount_1", "old_discount_2"]
  }
}
```

---

## Sub-feature 9: Manage Compensation Fund

### Feature Description

Manage Service's compensation fund.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `compensation_fund_add` | string | No | Add compensation amount (minimum unit) |
| `compensation_locked_time_add` | number | No | Lock time (milliseconds) |
| `compensation_fund_receive` | object | No | Receive compensation fund |

### Examples

#### Example 9.1: Add Compensation Fund

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "compensation_fund_add": "10000000000",
    "compensation_locked_time_add": 86400000
  }
}
```

#### Example 9.2: Receive Compensation Fund

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "compensation_fund_receive": {
      "recent": true
    }
  }
}
```

---

## Sub-feature 10: Publish Service

### Feature Description

Publish Service, after which customers can place orders.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `publish` | boolean | Yes | Whether to publish |

### Important Notes

⚠️ **Pre-publish Checklist**:
- [ ] Machine is correctly bound and published
- [ ] Sales products are configured (wip and wip_hash required)
- [ ] Fund allocator is configured
- [ ] Arbitration rules are configured (if needed)
- [ ] Customer required information is set
- [ ] Description and location information is complete

⚠️ **Fields that cannot be modified after publishing**:
- machine
- order_allocators
- arbitrations
- description
- location

### Example

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "publish": true
  }
}
```

---

## Sub-feature 11: Pause/Resume Accepting Orders

### Feature Description

Pause or resume Service accepting new orders.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `pause` | boolean | Yes | Whether to pause |

### Example

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "pause": true
  }
}
```

---

## Sub-feature 12: Create Order (order_new)

### Feature Description

Create new order for Service.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `order_new.buy.items` | array | Yes | List of purchased products |
| `order_new.buy.items[].name` | string | Yes | Product name |
| `order_new.buy.items[].stock` | string | Yes | Purchase quantity |
| `order_new.buy.items[].wip_hash` | string | Yes | WIP file hash |
| `order_new.buy.total_pay` | string | Yes | Actual payment amount |
| `order_new.buy.discount` | string | No | Discount coupon object ID/name |
| `order_new.buy.payment_remark` | string | No | Payment remark |
| `order_new.buy.payment_index` | number | No | Payment index |
| `order_new.agents` | array | No | Order agent list |
| `order_new.order_required_info` | string | Yes | Contact object ID or WTS Proof object |
| `order_new.transfer` | string | No | Set new order owner |
| `order_new.namedNewOrder` | object | No | Order local name |
| `order_new.namedNewAllocation` | object | No | Allocation local name |
| `order_new.namedNewProgress` | object | No | Progress local name |

### Example

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "order_new": {
      "buy": {
        "items": [
          {
            "name": "LOGO Design",
            "stock": "1",
            "wip_hash": "sha256:logo_design_wip_hash"
          }
        ],
        "total_pay": "5000000000"
      },
      "order_required_info": "customer_contact",
      "namedNewOrder": {
        "name": "my_order_1"
      },
      "namedNewProgress": {
        "name": "my_order_progress"
      }
    }
  }
}
```

---

## Sub-feature 13: Receive Objects (owner_receive)

### Feature Description

Receive objects sent to this Service object and unwrap them to send to the permission owner.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `owner_receive.objects` | array | No | Specify list of object IDs to receive |
| `owner_receive.recent` | boolean | No | Whether to receive recent objects |

### Example

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "design_service"
    },
    "owner_receive": {
      "recent": true
    }
  }
}
```

---

## Sub-feature 14: Combined Operations

### Feature Description

Execute multiple operations in one call.

### Example

#### Example 14.1: Complete Service Creation Process

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "complete_service",
      "type": "Service",
      "permission": "service_permission"
    },
    "description": "Complete service example",
    "location": "Online service",
    "customer_required": ["email", "phone"],
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "Product 1",
          "price": "1000000000",
          "stock": "100",
          "wip": "https://example.com/product1.wip",
          "wip_hash": "sha256:product1_wip_hash"
        }
      ]
    },
    "machine": "service_machine",
    "order_allocators": {
      "allocators": [
        {
          "to": "seller_address",
          "ratio": "900000000"
        },
        {
          "to": "platform_address",
          "ratio": "100000000"
        }
      ]
    },
    "arbitrations": ["service_arbitration"],
    "um": "service_contact"
  }
}
```

---

## Important Notes
⚠️ **Pre-publish Checklist**:
- [ ] Machine is correctly bound and published
- [ ] Sales products are configured (wip and wip_hash required)
- [ ] Fund allocator is configured
- [ ] Arbitration rules are configured (if needed)
- [ ] Customer required information is set
- [ ] Description and location information is complete

⚠️ **Fields that cannot be modified after publishing, please ensure correct configuration**:
- machine
- order_allocators
- arbitrations
- description
- location

⚠️ **wip and wip_hash must be valid WIP file URL and hash, used for product commitment**.

---

## Related Components

- **Machine**: Workflow template
- **Progress**: Order workflow execution
- **Order**: Order management
- **Permission**: Permission management
- **Repository**: Data storage
- **Arbitration**: Dispute resolution
- **Contact**: Contact information
- **Reward**: Reward pool
- **Discount**: Discount coupons
