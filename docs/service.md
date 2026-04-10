
# Service Component (🏪 Service Marketplace)

---

## Component Overview

The Service component is WoWok protocol's service/product publishing and sales management module, used to create and manage service or product listings in the marketplace. Service publishers can bind Machine (workflow templates), Repository (data warehouses), Arbitration (dispute resolution), and other components, configure Order Allocators, set up Discounts, manage Compensation Funds, and handle order creation and payment workflows.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Object Management** | Create or reference Service objects | Initialize new services or modify existing ones | Foundation for all service operations |
| **Configure Machine** | Bind workflow templates | Define automated service execution logic | Enables workflow-driven service delivery |
| **Order Allocators** | Set fund distribution rules | Configure revenue sharing, platform fees | Automates financial settlements |
| **Publish Service** | Make service available to customers | Launch service after configuration | Transitions service from draft to active state |
| **Pause/Resume Orders** | Temporarily stop accepting orders | Maintenance, inventory issues | Provides operational flexibility without unpublishing |
| **Manage Repositories** | Attach data warehouses | Store service-related data | Enables data-driven operations |
| **Manage Rewards** | Attach incentive pools | Set up loyalty programs | Encourages customer engagement |
| **Manage Arbitrations** | Attach dispute resolution | Handle order conflicts | Ensures fair dispute handling |
| **Configure Contact** | Bind instant messaging | Enable customer support | Facilitates direct communication |
| **Manage Sales** | Add products/services | List items for sale | Core e-commerce functionality |
| **Issue Discounts** | Create coupon codes | Promotions, new user offers | Drives customer acquisition |
| **Destroy Discounts** | Remove expired coupons | Clean up outdated discounts | Maintains promotion integrity |
| **Compensation Fund** | Manage dispute funds | Add/withdraw arbitration funds | Ensures dispute resolution capacity |
| **Customer Required Info** | Set mandatory fields | Collect delivery/contact info | Ensures order completeness |
| **Create Order** | Customer purchase flow | Place orders and make payment | Core transaction functionality |
| **Receive Compensation** | Withdraw dispute funds | Collect available compensation | Enables fund recovery |
| **Owner Receive Objects** | Unwrap and collect payments | Receive service revenue | Completes value transfer cycle |

---

## Complete Tool Call Structure

Service operations use the following top-level structure:

```json
{
  "operation_type": "service",
  "data": { ... },    // Service data definition
  "env": { ... },      // Execution environment (optional)
  "submission": { ... } // Guard verification submission (optional)
}
```

---

## Sub-feature 1: Create Service

### Feature Description

Create a new Service object. Newly created services are in unpublished state by default. After publishing, customers can place orders, but certain fields become immutable.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object.name` | string | No | Service name (local) | Max 64 characters |
| `data.object.tags` | string[] | No | Tags array | Max 50 tags |
| `data.object.onChain` | boolean | No | Sync name to chain | Default false |
| `data.object.replaceExistName` | boolean | No | Overwrite existing name | Default false |
| `data.object.type_parameter` | string | No | Payment token type | Default "0x2::wow::WOW" |
| `data.object.permission` | object/string | No | Permission object | Reference or create new |
| `data.description` | string | No | Service description | |
| `data.location` | string | No | Service location | |
| `env.account` | string | No | Use specified account | Empty string '' uses default |
| `env.network` | enum | No | Network selection | "localnet" or "testnet" |

### Important Notes

⚠️ **After publishing, these fields become immutable:** `machine`, `order_allocators`, `arbitrations`.

⚠️ **`type_parameter` defines the payment token type** accepted by this service.

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 1.1: Basic Service Creation

**Prompt**: Create a new Service object with a local name "web3_consulting_service", set description to "Professional Web3 consulting services", and use default WOW token type.

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "web3_consulting_service",
      "tags": ["web3", "consulting", "blockchain"],
      "type_parameter": "0x2::wow::WOW",
      "permission": {
        "name": "service_permission",
        "description": "Permission for managing this service"
      }
    },
    "description": "Professional Web3 consulting services",
    "location": "Online"
  }
}
```

---

#### Example 1.2: Minimal Service Creation

**Prompt**: Create a minimal Service object without a name, using all default settings.

```json
{
  "operation_type": "service",
  "data": {
    "object": {}
  }
}
```

---

## Sub-feature 2: Configure Machine

### Feature Description

Bind a Machine (workflow template) to the Service. The Machine must be in published state.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.machine` | object/string/null | No | Machine configuration | Reference, create, or null to remove |

### Important Notes

⚠️ **Machine must be published** before binding to a Service.

⚠️ **After Service publication, `machine` field becomes immutable.**

---

### Examples

#### Example 2.1: Reference Existing Machine

**Prompt**: Bind an existing Machine named "consulting_workflow" to the Service "web3_consulting_service".

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "machine": "consulting_workflow"
  }
}
```

---

#### Example 2.2: Create and Name Machine

**Prompt**: Create a new Machine with local name "service_workflow" and bind it to the Service.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "machine": {
      "name": "service_workflow",
      "tags": ["workflow", "automation"],
      "onChain": false
    }
  }
}
```

---

#### Example 2.3: Remove Machine

**Prompt**: Remove the currently bound Machine from the Service.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "machine": null
  }
}
```

---

## Sub-feature 3: Configure Order Allocators

### Feature Description

Configure automatic fund allocation rules for orders. The allocators define how order funds are distributed.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.order_allocators.description` | string | Yes | Allocators description | Max 65535 characters |
| `data.order_allocators.threshold` | number | Yes | Threshold amount in smallest token units | No decimals or negatives |
| `data.order_allocators.allocators` | array | Yes | Allocator list | 1-100 allocators |
| `data.order_allocators.allocators[].guard` | string | Yes | Guard object for this allocator | Guard name or ID |
| `data.order_allocators.allocators[].sharing` | array | Yes | Sharing items for this allocator | 1-100 sharing items |
| `data.order_allocators.allocators[].sharing[].who` | object | Yes | Recipient type | `{ GuardIdentifier: number }`, `{ Entity: { name_or_address: string } }`, or `{ Signer: "signer" }` |
| `data.order_allocators.allocators[].sharing[].sharing` | number | Yes | Sharing amount or rate in smallest units | No decimals or negatives |
| `data.order_allocators.allocators[].sharing[].mode` | string | Yes | Allocation mode | "Amount", "Rate", or "Surplus" |
| `data.order_allocators.allocators[].max` | number or null | No | Maximum allocation amount | No decimals or negatives |

### Important Notes

⚠️ **Sum of all sharing rates should be ≤ 10000 (100%).**

⚠️ **After Service publication, `order_allocators` becomes immutable.**

---

### Examples

#### Example 3.1: Configure Sharing Allocators

**Prompt**: Configure order allocators for web3_consulting_service with: 1) Description "Order fund allocation", 2) Threshold at 1000000000 (1 WOW), 3) One allocator with "order_guard" guard, 4) Sharing items: 70% to developer (Entity), 20% to platform (Entity), and 10% to signer.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "order_allocators": {
      "description": "Order fund allocation",
      "threshold": 1000000000,
      "allocators": [
        {
          "guard": "order_guard",
          "sharing": [
            {
              "who": {
                "Entity": {
                  "name_or_address": "developer"
                }
              },
              "sharing": 7000,
              "mode": "Rate"
            },
            {
              "who": {
                "Entity": {
                  "name_or_address": "platform"
                }
              },
              "sharing": 2000,
              "mode": "Rate"
            },
            {
              "who": {
                "Signer": "signer"
              },
              "sharing": 1000,
              "mode": "Rate"
            }
          ],
          "max": null
        }
      ]
    }
  }
}
```

---

## Sub-feature 4: Manage Repository List

### Feature Description

Add, set, remove, or clear Repository objects from the Service.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.repositories.op` | string | Yes | Operation type | "add", "set", "remove", "clear" |
| `data.repositories.objects` | string[] | No | Object list | Required for add/set/remove |

---

### Examples

#### Example 4.1: Add Repository

**Prompt**: Add a Repository named "service_data_repo" to the Service.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "repositories": {
      "op": "add",
      "objects": ["service_data_repo"]
    }
  }
}
```

---

#### Example 4.2: Set Repositories (Overwrite)

**Prompt**: Set Repository list to ["repo_a", "repo_b"], replacing any existing repositories.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "repositories": {
      "op": "set",
      "objects": ["repo_a", "repo_b"]
    }
  }
}
```

---

#### Example 4.3: Remove Repository

**Prompt**: Remove "old_repo" from the Repository list.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "repositories": {
      "op": "remove",
      "objects": ["old_repo"]
    }
  }
}
```

---

#### Example 4.4: Clear All Repositories

**Prompt**: Clear all Repository objects from the Service.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "repositories": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 5: Manage Reward List

### Feature Description

Add, set, remove, or clear Reward objects from the Service. Uses the same operation structure as repositories.

### Parameter Description

Same structure as Sub-feature 4 (Manage Repository List), but with `data.rewards` instead of `data.repositories`.

---

### Examples

#### Example 5.1: Add Reward

**Prompt**: Add a Reward object named "loyalty_reward" to the Service.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "rewards": {
      "op": "add",
      "objects": ["loyalty_reward"]
    }
  }
}
```

---

## Sub-feature 6: Manage Arbitration List

### Feature Description

Add, set, remove, or clear Arbitration objects from the Service. Uses the same operation structure as repositories.

### Parameter Description

Same structure as Sub-feature 4 (Manage Repository List), but with `data.arbitrations` instead of `data.repositories`.

---

### Examples

#### Example 6.1: Add Arbitration

**Prompt**: Add an Arbitration object named "dispute_resolution" to the Service.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "arbitrations": {
      "op": "add",
      "objects": ["dispute_resolution"]
    }
  }
}
```

---

## Sub-feature 7: Configure Contact (um)

### Feature Description

Bind a Contact (instant messaging) object to the Service.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.um` | object/string/null | No | Contact configuration | Reference, create, or null to remove |

---

### Examples

#### Example 7.1: Reference Existing Contact

**Prompt**: Bind an existing Contact named "service_support" to the Service.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "um": "service_support"
  }
}
```

---

#### Example 7.2: Remove Contact

**Prompt**: Remove the currently bound Contact from the Service.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "um": null
  }
}
```

---

## Sub-feature 8: Manage Sales List

### Feature Description

Add, set, remove, or clear sales products/services from the Service.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.sales.op` | string | Yes | Operation type | "add", "set", "remove", "clear" |
| `data.sales.sales` | array | No | Sales items list | Required for add/set |
| `data.sales.sales[].name` | string | Yes | Product/service name | |
| `data.sales.sales[].price` | number/string | Yes | Price | |
| `data.sales.sales[].description` | string | Yes | Description | |
| `data.sales.sales[].inventory` | number/string | No | Inventory quantity | |
| `data.sales.sales[].wip_hash` | string | Yes | WIP file hash | |
| `data.sales.sales[].suspension` | boolean | No | Pause sale | |
| `data.sales.sales_name` | string[] | No | Names to remove | Required for remove |

---

### Examples

#### Example 8.1: Add Sales Items

**Prompt**: Add two sales items: "basic_consulting" priced at 100 WOW (price=100000000000) and "premium_consulting" priced at 500 WOW (price=500000000000). Note: Prices are in smallest token unit (9 decimals for WOW).

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "basic_consulting",
          "price": 100000000000,
          "description": "Basic consulting service (1 hour)",
          "inventory": 100,
          "wip_hash": "0xabc123...def456",
          "suspension": false
        },
        {
          "name": "premium_consulting",
          "price": 500000000000,
          "description": "Premium consulting service (4 hours)",
          "inventory": 20,
          "wip_hash": "0xdef456...abc123",
          "suspension": false
        }
      ]
    }
  }
}
```

---

#### Example 8.2: Remove Sales Item

**Prompt**: Remove the "old_product" sales item from the Service.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "sales": {
      "op": "remove",
      "sales_name": ["old_product"]
    }
  }
}
```

---

#### Example 8.3: Clear All Sales

**Prompt**: Clear all sales items from the Service.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "sales": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 9: Issue Discount

### Feature Description

Create and issue a new discount coupon for the Service.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.discount.name` | string | Yes | Discount name | |
| `data.discount.discount_type` | string | Yes | Discount type | "RATES" or "FIXED" |
| `data.discount.discount_value` | number/string | Yes | Discount value | Rate: 0-10000 (e.g., 1000 means 10% discount); Fixed: amount in smallest token unit |
| `data.discount.benchmark` | number/string | No | Minimum amount threshold | In smallest token unit | |
| `data.discount.time_ms_start` | number | No | Start time (ms timestamp) | |
| `data.discount.time_ms_end` | number | No | End time (ms timestamp) | |
| `data.discount.count` | number | No | Usage count limit | |
| `data.discount.recipient.entities` | string[] | Yes | Eligible recipients | Account names or addresses |
| `data.discount.transferable` | boolean | No | Whether transferable | |

---

### Examples

#### Example 9.1: Rate Discount (Percentage)

**Prompt**: Issue a rate discount named "new_user_20off" with 20% off (discount_value=2000), minimum purchase of 100 WOW (benchmark=100000000000), valid for 30 days, limited to 1000 uses, eligible for alice and bob. Note: 20% discount uses 2000 (not 0.2) since rate discounts use 0-10000 scale where 10000 means 100%.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "discount": {
      "name": "new_user_20off",
      "discount_type": "RATES",
      "discount_value": 2000,
      "benchmark": 100000000000,
      "time_ms_start": 1735689600000,
      "time_ms_end": 1738368000000,
      "count": 1000,
      "recipient": {
        "entities": ["alice", "bob"]
      },
      "transferable": false
    }
  }
}
```

---

#### Example 9.2: Fixed Amount Discount

**Prompt**: Issue a fixed discount named "holiday_50off" with 50 WOW off (discount_value=50000000000), transferable, and eligible for everyone. Note: Fixed discount uses smallest token unit (not 50, but 50000000000 for 50 WOW with 9 decimals).

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "discount": {
      "name": "holiday_50off",
      "discount_type": "FIXED",
      "discount_value": 50000000000,
      "recipient": {
        "entities": []
      },
      "transferable": true
    }
  }
}
```

---

## Sub-feature 10: Destroy Discount

### Feature Description

Destroy existing discount objects.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.discount_destroy` | array | Yes | Discount objects to destroy | NamedObject array |

---

### Examples

#### Example 10.1: Destroy Discount

**Prompt**: Destroy the discount object named "expired_coupon".

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "discount_destroy": [
      {
        "name": "expired_coupon",
        "tags": ["expired"]
      }
    ]
  }
}
```

---

## Sub-feature 11: Add Compensation Fund

### Feature Description

Add funds to the compensation fund pool. These funds are used for arbitration compensation when resolving order disputes.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.compensation_fund_add.balance` | number/string | No | Amount value | Pay from transaction account |
| `data.compensation_fund_add.coin` | string | No | Coin object ID | Use specified Coin |
| `data.compensation_locked_time_add` | number | No | Lock time in milliseconds | |

---

### Examples

#### Example 11.1: Add Compensation Fund with Balance

**Prompt**: Add 1000 WOW tokens (balance=1000000000000) to the compensation fund with a lock time of 24 hours (86400000 ms). Note: Amount is in smallest token unit (9 decimals for WOW).

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "compensation_fund_add": {
      "balance": 1000000000000
    },
    "compensation_locked_time_add": 86400000
  }
}
```

---

#### Example 11.2: Add Compensation Fund with Coin Object

**Prompt**: Add a specific Coin object to the compensation fund.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "compensation_fund_add": {
      "coin": "0x7890...coin_object"
    }
  }
}
```

---

## Sub-feature 12: Configure Customer Required Info

### Feature Description

Set the information customers must provide when placing orders.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.customer_required` | string[] | No | Required fields | e.g., ["phone", "email"] |

---

### Examples

#### Example 12.1: Set Required Info

**Prompt**: Configure customer to provide phone, email, and delivery address when placing orders.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "customer_required": ["phone", "email", "delivery_address"]
  }
}
```

---

## Sub-feature 13: Pause/Resume Accepting Orders

### Feature Description

Pause or resume the Service from accepting new orders without unpublishing.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.pause` | boolean | No | Pause flag | true=pause, false=resume |

---

### Examples

#### Example 13.1: Pause Accepting Orders

**Prompt**: Pause the Service from accepting new orders.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "pause": true
  }
}
```

---

#### Example 13.2: Resume Accepting Orders

**Prompt**: Resume the Service to accept new orders.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "pause": false
  }
}
```

---

## Sub-feature 14: Publish Service

### Feature Description

Publish the Service. After publishing, customers can place orders, but certain fields become immutable.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.publish` | boolean | No | Publish flag | Set to true to publish |

### Important Notes

⚠️ **After publishing, these fields become immutable:** `machine`, `order_allocators`, `arbitrations`.

⚠️ **Ensure all configurations are correct before publishing.**

---

### Examples

#### Example 14.1: Publish Service

**Prompt**: Publish the Service so customers can start placing orders.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "publish": true
  }
}
```

---

## Sub-feature 15: Create Order

### Feature Description

Create a new order as a customer and make payment.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.order_new.buy.items` | array | Yes | Items to purchase | At least one item |
| `data.order_new.buy.items[].name` | string | Yes | Product/service name | |
| `data.order_new.buy.items[].stock` | number/string | Yes | Quantity | |
| `data.order_new.buy.items[].wip_hash` | string | Yes | WIP file hash | |
| `data.order_new.buy.total_pay` | object | Yes | Payment amount | CoinParam |
| `data.order_new.buy.discount` | string | No | Discount object | Name or ID |
| `data.order_new.buy.payment_remark` | string | No | Payment remark | |
| `data.order_new.buy.payment_index` | number | No | Payment index | |
| `data.order_new.agents.entities` | string[] | No | Order agents | |
| `data.order_new.order_required_info` | string | Yes | Contact or WTS Proof | |
| `data.order_new.transfer` | string | No | New order owner | |
| `data.order_new.namedNewOrder` | object | No | Order name | NamedObject |
| `data.order_new.namedNewAllocation` | object | No | Allocation name | NamedObject |
| `data.order_new.namedNewProgress` | object | No | Progress name | NamedObject |

---

### Examples

#### Example 15.1: Create Order

**Prompt**: Create an order for "basic_consulting" with quantity 1, pay 100 WOW (total_pay.balance=100000000000), use discount "new_user_20off", add payment remark, and name the order "my_first_order". Note: Amount is in smallest token unit (9 decimals for WOW).

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "order_new": {
      "buy": {
        "items": [
          {
            "name": "basic_consulting",
            "stock": 1,
            "wip_hash": "0xabc123...def456"
          }
        ],
        "total_pay": {
          "balance": 100000000000
        },
        "discount": "new_user_20off",
        "payment_remark": "First purchase"
      },
      "agents": {
        "entities": ["agent_account"]
      },
      "order_required_info": "customer_contact",
      "namedNewOrder": {
        "name": "my_first_order"
      },
      "namedNewAllocation": {
        "name": "order_allocation"
      },
      "namedNewProgress": {
        "name": "order_progress"
      }
    }
  }
}
```

---

## Sub-feature 16: Receive Compensation Fund

### Feature Description

Receive compensation funds from orders.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.compensation_fund_receive.type` | string | Yes | Receive type | "recently" or "balance" |
| `data.compensation_fund_receive.balance` | number/string | No | Amount | Required for type "balance" |
| `data.compensation_fund_receive.time_ms_ago` | number | No | Time range (ms) | |
| `data.compensation_fund_receive.token_type` | string | No | Token type | |

---

### Examples

#### Example 16.1: Receive Recently Available Compensation

**Prompt**: Receive compensation funds that became available in the last 24 hours.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "compensation_fund_receive": {
      "type": "recently",
      "time_ms_ago": 86400000
    }
  }
}
```

---

#### Example 16.2: Receive Specific Amount

**Prompt**: Receive 100 WOW tokens (balance=100000000000) from compensation funds. Note: Amount is in smallest token unit (9 decimals for WOW).

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "compensation_fund_receive": {
      "type": "balance",
      "balance": 100000000000,
      "token_type": "0x2::wow::WOW"
    }
  }
}
```

---

## Sub-feature 17: Owner Receive Objects

### Feature Description

Unwrap CoinWrapper and other objects received by the Service and send them to the owner of its Permission object.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.owner_receive.type` | string | Yes | Receive type | "recently" or "objects" |
| `data.owner_receive.objects` | string[] | No | Object list | Required for type "objects" |
| `data.owner_receive.time_ms_ago` | number | No | Time range (ms) | |

---

### Examples

#### Example 17.1: Receive Recently Available Objects

**Prompt**: Unwrap and receive objects that became available in the last 24 hours.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "owner_receive": {
      "type": "recently",
      "time_ms_ago": 86400000
    }
  }
}
```

---

#### Example 17.2: Receive Specific Objects

**Prompt**: Unwrap and receive specific CoinWrapper objects.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "owner_receive": {
      "type": "objects",
      "objects": ["coin_wrapper_1", "coin_wrapper_2"]
    }
  }
}
```

---

## Important Notes

⚠️ **After publishing, these fields become immutable:** `machine`, `order_allocators`, `arbitrations`.

⚠️ **`type_parameter` defines the payment token type** accepted by this service, default is "0x2::wow::WOW".

⚠️ **All objects support local naming** with `name`, `tags`, `onChain`, and `replaceExistName`.

⚠️ **Use `pause` to temporarily stop accepting orders** .

⚠️ **`compensation_fund_add` adds funds for arbitration compensation** in order disputes.

⚠️ **`discount_type` must be "RATES" or "FIXED" (uppercase).**

---

## Related Components

- **Machine**: Workflow templates
- **Repository**: Data warehouses
- **Arbitration**: Dispute resolution
- **Contact**: Instant messaging
- **Treasury**: Fund management
- **Reward**: Reward pools
- **Allocation**: Auto distribution
- **Order**: Order management
- **Payment**: Direct transfers

