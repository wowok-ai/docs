
# Service Component (🏪 Service Marketplace)

---

## Component Overview

The Service component is WoWok protocol's service/product publishing and sales management module, used to create and manage service or product listings in the marketplace. Service publishers can bind Machine (workflow templates), Repository (data warehouses), Arbitration (dispute resolution), and other components, configure Order Allocators, set up Discounts, manage Compensation Funds, and handle order creation and payment workflows.

**Critical Integration with WIP**: Service sales items can optionally include a WIP (Witness Information Promise) file that provides immutable, verifiable product/service descriptions. 

- **With WIP**: Set `wip` to a local file path or HTTPS URL. The hash is automatically extracted, and customers must provide matching `wip_hash` when purchasing.
- **Without WIP**: Set `wip` to empty string `""` for simple products where WIP verification is not needed.

See the [WIP section in Step-by-Step Guide](#step-4-configure-wip-files-for-products-optional-but-recommended) and [Messenger](messenger.md) for details on generating, verifying, and signing WIP files.

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

## Schema Tree

```
service (Service Object)
├── operation_type: "service" (fixed value)
├── data (Service data definition)
│   ├── object (object definition, required)
│   │   ├── Option 1: NameOrAddress (string) - reference existing object
│   │   │   └── "object_name" or "0x..." (64 hex chars)
│   │   └── Option 2: TypeNamedObjectWithPermission (object) - create new
│   │       ├── name (string, optional) - object name, max 64 chars
│   │       ├── tags (string[], optional) - object tags
│   │       ├── onChain (boolean, optional) - sync name to chain
│   │       ├── replaceExistName (boolean, optional) - overwrite existing
│   │       ├── type_parameter (string, optional) - token type, default "0x2::wow::WOW"
│   │       └── permission (PermissionObject, optional)
│   │           ├── Option 1: NameOrAddress (string) - reference existing
│   │           └── Option 2: NamedObjectWithDescription (object) - create new
│   │               ├── name (string, optional)
│   │               ├── tags (string[], optional)
│   │               ├── onChain (boolean, optional)
│   │               ├── replaceExistName (boolean, optional)
│   │               └── description (string, optional)
│   ├── order_new (OrderNew, optional) - create new order
│   │   ├── buy (Buy, required)
│   │   │   ├── items (ServiceBuyItem[], required) - purchase items
│   │   │   │   ├── name (string, required) - product name
│   │   │   │   ├── stock (number/string, required) - quantity
│   │   │   │   └── wip_hash (string, required) - WIP hash
│   │   │   ├── total_pay (CoinParam, required) - payment
│   │   │   │   ├── Option 1: { balance: number|string }
│   │   │   │   └── Option 2: { coin: string } - coin object ID
│   │   │   ├── discount (string, optional) - discount object ID/name
│   │   │   ├── payment_remark (string, optional)
│   │   │   └── payment_index (number, optional)
│   │   ├── agents (ManyAccountOrMark_Address, optional) - order agents
│   │   ├── order_required_info (string, required) - contact ID or WTS proof
│   │   ├── transfer (AccountOrMark_Address, optional) - new owner
│   │   ├── namedNewOrder (NamedObject, optional) - order name
│   │   ├── namedNewAllocation (NamedObject, optional) - allocation name
│   │   └── namedNewProgress (NamedObject, optional) - progress name
│   ├── description (string, optional) - service description
│   ├── location (string, optional) - service location
│   ├── sales (Sales, optional) - manage products
│   │   ├── op (enum, required) - "add"|"set"|"remove"|"clear"
│   │   ├── sales (ServiceSale[], optional for add/set)
│   │   │   ├── name (string, required) - product name
│   │   │   ├── price (number/string, required) - price
│   │   │   ├── stock (number/string, required) - inventory
│   │   │   ├── suspension (boolean, required) - paused status
│   │   │   ├── wip (string, required) - WIP URL/path
│   │   │   └── wip_hash (string, optional) - WIP hash, default ""
│   │   └── sales_name (string[], optional for remove) - names to remove
│   ├── repositories (ObjectsOp, optional) - manage repositories
│   ├── rewards (ObjectsOp, optional) - manage rewards
│   ├── arbitrations (ObjectsOp, optional) - manage arbitrations
│   ├── machine (NameOrAddress|null, optional) - bind machine
│   ├── discount (Discount, optional) - issue discount
│   │   ├── name (string, required)
│   │   ├── discount_type (number, required) - 0=RATES, 1=FIXED
│   │   ├── discount_value (number/string, required)
│   │   ├── benchmark (number/string, optional)
│   │   ├── time_ms_start (number, optional)
│   │   ├── time_ms_end (number, optional)
│   │   ├── count (number, optional)
│   │   ├── recipient (ManyAccountOrMark_Address, required)
│   │   └── transferable (boolean, optional)
│   ├── discount_destroy (NameOrAddress[], optional) - destroy discounts
│   ├── customer_required (string[], optional) - required customer info
│   ├── order_allocators (Allocators|null, optional) - fund allocation
│   │   ├── description (string, required)
│   │   ├── threshold (number/string, required)
│   │   └── allocators (Allocator[], required)
│   │       ├── guard (NameOrAddress, required)
│   │       ├── sharing (SharingItem[], required)
│   │       │   ├── who (Recipient, required)
│   │       │   │   ├── Option 1: { GuardIdentifier: number }
│   │       │   │   ├── Option 2: { Entity: AccountOrMark_Address }
│   │       │   │   └── Option 3: { Signer: "signer" }
│   │       │   ├── sharing (number/string, required)
│   │       │   └── mode (enum, required) - "Amount"|"Rate"|"Surplus"
│   │       └── max (number/string, optional)
│   ├── compensation_fund_add (CoinParam, optional) - add compensation
│   ├── compensation_locked_time_add (number, optional) - lock time
│   ├── compensation_fund_receive (ReceivedBalanceOrRecently, optional)
│   ├── owner_receive (ReceivedObjectsOrRecently, optional)
│   ├── um (NameOrAddress|null, optional) - contact object
│   ├── pause (boolean, optional) - pause orders
│   └── publish (boolean, optional) - publish service
├── env (optional, execution environment)
│   ├── account (string, optional) - account name/address, "" for default
│   ├── network (string, optional) - "localnet" or "testnet"
│   ├── permission_guard (string[], optional) - guard IDs
│   ├── no_cache (boolean, optional) - disable caching
│   └── referrer (string, optional) - referrer ID
└── submission (optional, submission data)
    ├── type: "submission" (fixed)
    ├── guard (array) - guards to verify
    │   └── [{ object: "guard_id", impack: boolean }]
    └── submission (array) - guard submissions
        └── [{ guard: "guard_id", submission: [items] }]
            └── guard_submission_items
                ├── identifier (number, 0-255)
                ├── b_submission (boolean)
                ├── value_type (number|string)
                ├── value (any)
                └── name (string, optional)
```

---

## Creating a Sellable Service: Step-by-Step Guide

Building a fully functional, sellable Service requires several components working together. Follow these steps to create a complete service marketplace listing:

### Step 0: Prerequisites (Optional but Recommended)

Before creating your Service, you may need to set up these foundational components:

1. **Permission Object** - Controls who can manage the Service
   - See [Permission](permission.md) for creating permission objects
   - If not specified, a new Permission will be created automatically

2. **Guard Objects** - Used in Order Allocators for conditional fund distribution
   - See [Guard](guard.md) for creating Guard objects
   - Example: Create an "always_true_guard" that always passes verification

### Step 1: Create the Service Object

Create a basic Service object with name, description, and optional configuration.

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "my_service",
      "description": "My service description"
    }
  }
}
```

### Step 2: Configure Machine (Order Processing Workflow)

Bind a published Machine to define how orders are processed. The Machine represents your service delivery workflow.

**Prerequisites:**
- Create a Machine using [Machine](machine.md) operations
- Publish the Machine before binding

```json
{
  "operation_type": "service",
  "data": {
    "object": "my_service",
    "machine": "my_published_machine"
  }
}
```

### Step 3: Configure Order Allocators (Fund Distribution)

Set up how order payments are distributed among recipients.

**Key Concepts:**
- **Guard**: Validates allocation conditions (use "always_true_guard" for unconditional allocation)
- **Sharing**: Defines who receives funds and how much
- **Mode**: "Rate" (percentage), "Amount" (fixed), or "Surplus" (remaining)

```json
{
  "operation_type": "service",
  "data": {
    "object": "my_service",
    "order_allocators": {
      "description": "Order fund allocation",
      "threshold": 0,
      "allocators": [
        {
          "guard": "always_true_guard",
          "sharing": [
            {
              "who": { "Signer": "signer" },
              "sharing": 10000,
              "mode": "Rate"
            }
          ]
        }
      ]
    }
  }
}
```

### Step 4: Configure WIP Files for Products (Optional but Recommended)

WIP (Witness Information Promise) files provide immutable, verifiable product/service descriptions. While optional, using WIP is strongly recommended for building trust.

**Two approaches:**

#### Approach A: No WIP (Simple Products)
- Set `wip` to empty string `""`
- Customers don't need to provide `wip_hash` when purchasing

#### Approach B: With WIP (Recommended)
1. **Generate WIP File** using the `wip_file` tool:
   ```json
   {
     "operation_type": "wip_file",
     "data": {
       "operation": "generate",
       "markdown_text": "# Product Name\n\n## Description\nDetailed product description here...",
       "images": ["https://example.com/product-image.jpg"],
       "account": "",
       "output_path": "./product.wip"
     }
   }
   ```

2. **Upload WIP File** to your website or a publicly accessible HTTPS location
   - The WIP file must be accessible via an HTTPS URL
   - Example: `https://your-domain.com/product.wip`
   - **Note**: When adding products to Service, you must provide a network-accessible HTTPS URL (local file paths are for testing only)

3. **Extract Hash** from the generated WIP file (automatically handled when using local file path)

4. **Add Product to Service**:
   ```json
   {
     "operation_type": "service",
     "data": {
       "object": "my_service",
       "sales": {
         "op": "add",
         "sales": [
           {
             "name": "Product Name",
             "price": 50000000,
             "stock": 50,
             "suspension": false,
             "wip": "https://your-domain.com/product.wip",
             "wip_hash": "46e1445b7f57210dd757bd40358f6a78308ef7494115eaad27510fb29de799e0"
           }
         ]
       }
     }
   }
   ```

**Important:** The `wip_hash` must match the hash extracted from your WIP file. Customers must provide the same hash when purchasing:
```json
{
  "wip_hash": "46e1445b7f57210dd757bd40358f6a78308ef7494115eaad27510fb29de799e0"
}
```

See [Messenger](messenger.md) for more details on WIP file operations.

### Step 5: Configure Arbitration (Required if using Compensation Fund)

If you plan to use compensation funds for dispute resolution, you must configure at least one Arbitration object.

```json
{
  "operation_type": "service",
  "data": {
    "object": "my_service",
    "arbitrations": {
      "op": "add",
      "objects": ["arbitration_object_id"]
    }
  }
}
```

See [Arbitration](arbitration.md) for creating arbitration objects.

### Step 6: Add More Products/Services (Optional)

If you need to add more products after initial setup, use the same sales operation. See [Sub-feature 8: Manage Sales List](#sub-feature-8-manage-sales-list) for detailed examples including:
- Adding products without WIP (simple products)
- Adding products with WIP (verified products)
- Removing or clearing products

### Step 7: Configure Contact & Required User Information (Optional)

If your service requires customers to provide personal information (shipping address, phone number, email, etc.), you need to:

1. **Create a Contact Object** - Enables secure messaging between you and customers
   - See [Contact](contact.md) for creating contact objects
   - Contact allows encrypted communication for handling sensitive information

2. **Bind Contact to Service**:
   ```json
   {
     "operation_type": "service",
     "data": {
       "object": "my_service",
       "contact": "my_contact_object"
     }
   }
   ```

3. **Set Required Information Fields** - Define what customer information is required when placing orders:
   ```json
   {
     "operation_type": "service",
     "data": {
       "object": "my_service",
       "order_required_info": "shipping_address,phone_number,email"
     }
   }
   ```

**Common Required Information Fields:**
- `shipping_address` - Physical delivery address
- `phone_number` - Contact phone
- `email` - Email address
- `real_name` - Customer's real name
- `postal_code` - Postal/ZIP code

**Privacy & Security:**
- All sensitive information is transmitted through encrypted Messenger channels
- See [Messenger](messenger.md) for secure communication features
- Consider using WIP files to document your privacy policy

### Step 8: Publish the Service

Once all configurations are complete, publish the Service to make it available for customers.

⚠️ **Warning:** After publishing, `machine`, `order_allocators`, and `arbitrations` become immutable!

```json
{
  "operation_type": "service",
  "data": {
    "object": "my_service",
    "publish": true
  }
}
```

### Complete Example: One-Step Service Creation

You can also create a complete service in a single call:

```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "complete_service"
    },
    "description": "A complete sellable service",
    "machine": "my_published_machine",
    "order_allocators": {
      "description": "Default allocation",
      "threshold": 0,
      "allocators": [
        {
          "guard": "always_true_guard",
          "sharing": [
            {
              "who": { "Signer": "signer" },
              "sharing": 10000,
              "mode": "Rate"
            }
          ]
        }
      ]
    },
    "arbitrations": {
      "op": "add",
      "objects": ["arbitration_id"]
    },
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "Product with WIP",
          "price": 50000000,
          "stock": 50,
          "suspension": false,
          "wip": "https://your-domain.com/product.wip",
          "wip_hash": "46e1445b7f57210dd757bd40358f6a78308ef7494115eaad27510fb29de799e0"
        }
      ]
    },
    "publish": true
  },
  "env": {
    "network": "testnet"
  }
}
```

### Related Documentation

- [Machine](machine.md) - Creating workflow templates
- [Guard](guard.md) - Creating validation guards
- [Arbitration](arbitration.md) - Dispute resolution
- [Messenger](messenger.md) - WIP file operations
- [Order](order.md) - Customer purchase flow

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

⚠️ **Machine must be created separately** before binding. See [Machine](machine.md) for how to create and publish a Machine.

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

#### Example 2.2: Remove Machine

**Prompt**: Remove the currently bound Machine from the Service. Note: Only works if Service is not yet published.

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

Add, set, remove, or clear sales products/services from the Service. Each sales item can optionally include a WIP (Witness Information Promise) file that provides immutable, verifiable product/service descriptions.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "service" |
| `data.object` | string | Yes | Reference existing Service | Service name or ID |
| `data.sales.op` | string | Yes | Operation type | "add", "set", "remove", "clear" |
| `data.sales.sales` | array | No | Sales items list | Required for add/set |
| `data.sales.sales[].name` | string | Yes | Product/service name | Max 64 characters |
| `data.sales.sales[].price` | number/string | Yes | Price in smallest token units | No decimals |
| `data.sales.sales[].stock` | number/string | Yes | Inventory quantity | No decimals |
| `data.sales.sales[].wip` | string | Yes | WIP file URL or local path | Empty string "" for no WIP |
| `data.sales.sales[].wip_hash` | string | No | WIP file hash | Auto-extracted from local WIP files |
| `data.sales.sales[].suspension` | boolean | Yes | Whether sale is suspended | |
| `data.sales.sales_name` | string[] | No | Names to remove | Required for remove |

### Important Notes About WIP

**What is WIP?**
WIP (Witness Information Promise) is a cryptographically signed JSON file that contains product/service descriptions, images, and metadata. It ensures:
- **Immutability**: Once created, the content cannot be altered
- **Verifiability**: Customers can verify the product description matches what was promised
- **Trust**: Builds confidence between buyers and sellers

**WIP Usage Modes:**

1. **Without WIP** (Simple products):
   - Set `wip` to empty string `""`
   - No `wip_hash` required
   - Customers purchase without WIP verification

2. **With WIP** (Recommended for valuable products):
   - Set `wip` to a local `.wip` file path or HTTPS URL
   - Hash is automatically extracted from local WIP files
   - Customers must provide matching `wip_hash` when purchasing

---

### Examples

#### Example 8.1: Add Sales Item Without WIP (Simple Product)

**Prompt**: Add a simple product without WIP verification. Customers can purchase without providing WIP hash.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "simple_product",
          "price": 30000000,
          "stock": 100,
          "suspension": false,
          "wip": "",
          "wip_hash": ""
        }
      ]
    }
  }
}
```

---

#### Example 8.2: Add Sales Item With WIP (Recommended)

**Prompt**: Add a product with WIP file. First generate the WIP file, then reference it when adding the product.

**Step 1: Generate WIP File**
```json
{
  "operation_type": "wip_file",
  "data": {
    "operation": "generate",
    "markdown_text": "# Three-Body Problem (三体)\n\n## Book Information\n- **Author**: Liu Cixin\n- **Genre**: Science Fiction\n- **Pages**: 302\n\n## Description\nThe Three-Body Problem is a science fiction novel that explores humanity's first contact with an alien civilization...",
    "images": ["https://example.com/three-body-cover.jpg"],
    "account": "",
    "output_path": "./three_body.wip"
  }
}
```

**Step 2: Add Product with WIP**
```json
{
  "operation_type": "service",
  "data": {
    "object": "book_store_service",
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "三体（带WIP）",
          "price": 50000000,
          "stock": 50,
          "suspension": false,
          "wip": "https://your-domain.com/three_body.wip",
          "wip_hash": "46e1445b7f57210dd757bd40358f6a78308ef7494115eaad27510fb29de799e0"
        }
      ]
    }
  }
}
```

**Step 3: Customer Purchase (Must Provide WIP Hash)**
```json
{
  "operation_type": "service",
  "data": {
    "object": "book_store_service",
    "order_new": {
      "buy": {
        "items": [
          {
            "name": "三体（带WIP）",
            "stock": 1,
            "wip_hash": "46e1445b7f57210dd757bd40358f6a78308ef7494115eaad27510fb29de799e0"
          }
        ],
        "total_pay": {
          "balance": 50000000
        }
      },
      "order_required_info": ""
    }
  }
}
```

---

#### Example 8.3: Add Multiple Sales Items (Mixed WIP and Non-WIP)

**Prompt**: Add multiple products, some with WIP and some without.

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
          "price": 100000000,
          "stock": 100,
          "suspension": false,
          "wip": "",
          "wip_hash": ""
        },
        {
          "name": "premium_consulting",
          "price": 500000000,
          "stock": 20,
          "suspension": false,
          "wip": "https://your-domain.com/premium_service.wip",
          "wip_hash": "abc123def456..."
        }
      ]
    }
  }
}
```

---

#### Example 8.4: Remove Sales Item

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

#### Example 8.5: Clear All Sales

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
| `data.discount.discount_type` | number | Yes | Discount type | 0 (RATES) or 1 (FIXED) |
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

**Prompt**: Issue a rate discount named "new_user_20off" with 20% off (discount_value=2000), minimum purchase of 100 WOW (benchmark=100000000000), valid for 30 days, limited to 1000 uses, eligible for alice and bob. Note: 20% discount uses 2000 (not 0.2) since rate discounts use 0-10000 scale where 10000 means 100%. Use discount_type=0 for rate discounts.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "discount": {
      "name": "new_user_20off",
      "discount_type": 0,
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

**Prompt**: Issue a fixed discount named "holiday_50off" with 50 WOW off (discount_value=50000000000), transferable, and eligible for everyone. Note: Fixed discount uses smallest token unit (not 50, but 50000000000 for 50 WOW with 9 decimals). Use discount_type=1 for fixed discounts.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "discount": {
      "name": "holiday_50off",
      "discount_type": 1,
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
| `data.discount_destroy` | string[] | Yes | Discount object names or IDs to destroy | Array of object names or addresses |

---

### Examples

#### Example 10.1: Destroy Discount

**Prompt**: Destroy the discount object named "expired_coupon".

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "discount_destroy": ["expired_coupon"]
  }
}
```

---

## Sub-feature 11: Add Compensation Fund

### Feature Description

Add funds to the compensation fund pool. These funds are used for arbitration compensation when resolving order disputes.

👉 **For complete arbitration workflow, see [Arbitration - Complete Workflow](arbitration.md#complete-arbitration-workflow-example)**

**Quick Overview:**
1. Service provider adds compensation funds (this operation)
2. Buyer creates dispute via Arbitration
3. Arbitration process completes with ruling
4. Buyer claims compensation via Order

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

**Prompt**: Create an order for "basic_consulting" with quantity 1, pay 100 WOW (total_pay.balance=100000000000), use discount "new_user_20off", add payment remark, include the WIP hash from "service_desc.wip", and name the order "my_first_order". Note: Amount is in smallest token unit (9 decimals for WOW). The wip_hash must match the hash of the sales item's WIP file. See WIP section for how to generate and verify WIP files.

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
            "wip_hash": "sha256:abc123def456..."
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
| `data.compensation_fund_receive` | string/object | Yes | Receive configuration | "recently" or ReceivedBalance object |

---

### Examples

#### Example 16.1: Receive Recently Available Compensation

**Prompt**: Receive all compensation funds that became available recently.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "compensation_fund_receive": "recently"
  }
}
```

---

#### Example 16.2: Receive Specific Amount

**Prompt**: Receive specific amount from compensation funds using ReceivedBalance object. Note: Requires querying received balance records first.

```json
{
  "operation_type": "service",
  "data": {
    "object": "web3_consulting_service",
    "compensation_fund_receive": {
      "balance": 100000000000,
      "token_type": "0x2::wow::WOW",
      "received": [
        {
          "id": "0x...",
          "balance": 100000000000,
          "payment": "0x..."
        }
      ]
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

⚠️ **CRITICAL: Every Service sales item requires a `wip_hash`** - this ensures product/service descriptions are immutable and verifiable. See the WIP section below for how to generate WIP files.

⚠️ **After publishing, these fields become immutable:** `machine`, `order_allocators`, `arbitrations`.

⚠️ **`type_parameter` defines the payment token type** accepted by this service, default is "0x2::wow::WOW".

⚠️ **All objects support local naming** with `name`, `tags`, `onChain`, and `replaceExistName`.

⚠️ **Use `pause` to temporarily stop accepting orders** .

⚠️ **`compensation_fund_add` adds funds for arbitration compensation** in order disputes.

⚠️ **`discount_type` must be 0 (RATES) or 1 (FIXED).**

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Machine](machine.md)** | Workflow template |
| **[Repository](repository.md)** | Data ownership and usage rights |
| **[Arbitration](arbitration.md)** | Dispute resolution |
| **[Contact](contact.md)** | Public contact information |
| **[Treasury](treasury.md)** | Team fund management |
| **[Reward](reward.md)** | Marketing incentives |
| **[Allocation](allocation.md)** | Automatic fund distribution |
| **[Order](order.md)** | Order management |
| **[Payment](payment.md)** | Direct coin transfers |

---

## ⚖️ Service Fairness and Arbitration Integration

The Service component integrates with the Arbitration system to ensure fair dispute resolution. For detailed arbitration state machine and process, see [Arbitration - State Machine](arbitration.md#complete-arbitration-state-machine).

### Service Fairness Principles

| Principle | Implementation | User Benefit |
|-----------|----------------|--------------|
| **Transparent Terms** | WIP files hash product descriptions immutably | Buyers know exactly what they're purchasing |
| **Escrow Protection** | Order payments held securely until fulfillment | Both parties protected from fraud |
| **Dispute Resolution** | Arbitration objects bound to services | Fair third-party resolution available |
| **Compensation Guarantee** | Compensation funds locked in service | Buyers assured of refund capability |
| **Immutable Records** | All actions recorded on-chain | Complete audit trail of transactions |

### Quick Setup Guide

To enable arbitration for your service:

1. **Create Arbitration Object**: Set up dispute resolution rules
   ```json
   {
     "operation_type": "arbitration",
     "data": {
       "object": {"name": "my_arbitration"},
       "description": "Dispute resolution for my service"
     }
   }
   ```

2. **Bind to Service**: Link arbitration to service
   ```json
   {
     "operation_type": "service",
     "data": {
       "object": "my_service",
       "arbitrations": {"objects": ["my_arbitration"]}
     }
   }
   ```

3. **Add Compensation Fund**: Ensure funds available for disputes
   ```json
   {
     "operation_type": "service",
     "data": {
       "object": "my_service",
       "compensation_fund_add": {"balance": 100000000000}
     }
   }
   ```

👉 **See [Arbitration - State Machine](arbitration.md#complete-arbitration-state-machine) for complete dispute resolution flow and state transitions**

### Key Arbitration Links

| Resource | Link | Description |
|----------|------|-------------|
| **State Machine** | [Arbitration - State Machine](arbitration.md#complete-arbitration-state-machine) | Complete state transitions and flow |
| **Create Arbitration** | [Arbitration - Create](arbitration.md#sub-feature-1-create-arbitration) | Set up dispute resolution system |
| **File Dispute** | [Arbitration - Dispute](arbitration.md#sub-feature-2-create-dispute-dispute) | Buyer initiates dispute |
| **Complete Workflow** | [Arbitration - Full Example](arbitration.md#complete-arbitration-workflow-example) | End-to-end arbitration process |
| **Transparency** | [Arbitration - Transparency](arbitration.md#transparent-arbitration-process) | How transparency is ensured |

---

# Witness Information Promise (WIP) File Operations

---

## Component Overview

The Witness Information Promise (WIP) file format is a cryptographically verifiable JSON format for transmitting immutable promise information. WIP files can be created from markdown and images, verified for integrity, signed with accounts, and converted to HTML. WIP is closely integrated with the Service component, where every sales item must reference a WIP file hash to ensure product/service description immutability.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Generate WIP** | Create WIP files from markdown text and optional images | Product/service descriptions, contracts, terms of service | Foundation for immutable content creation |
| **Verify WIP** | Check WIP file integrity and signatures | Validate product descriptions, verify contract authenticity | Ensures content hasn't been tampered with |
| **Sign WIP** | Add digital signatures to WIP files | Sign service agreements, certify product details | Provides non-repudiation and authenticity |
| **Convert to HTML** | Render WIP files to HTML format | Display product descriptions, view signed documents | Makes WIP content human-readable |

---

## Complete Tool Call Structure

WIP operations use the following top-level structure:

```json
{
  "type": "operation_type",
  // operation-specific fields
}
```

---

## Schema Tree

```
wip_file (WIP Operations)
├── type (discriminator, required)
│   ├── "generate"
│   │   ├── options (required, WipGenerationOptions)
│   │   │   ├── markdown_text (required, string)
│   │   │   ├── images (optional, ImageSource[])
│   │   │   └── account (optional, string)
│   │   └── outputPath (required, string)
│   ├── "verify"
│   │   ├── wipFilePath (required, string)
│   │   └── hash_equal (optional, string)
│   ├── "sign"
│   │   ├── wipFilePath (required, string)
│   │   ├── account (optional, string)
│   │   └── outputPath (optional, string)
│   └── "wip2html"
│       ├── wipPath (required, string)
│       └── options (optional, WipToHtmlOptions)
│           ├── title (optional, string)
│           ├── theme (optional, "light"/"dark")
│           └── outputPath (optional, string)
└── (no other top-level fields)
```

---

## Example 1: Generate WIP File

### Feature Description

Create a new WIP file from markdown text and optional images. The generated file includes content hashing and can optionally be signed.

### Examples

#### Example 1.1: Generate Basic WIP

**Prompt**: Please generate a WIP file for a service description. Use markdown text: "Basic Web3 Consulting Service - 1 hour session", output to "service_desc.wip".

```json
{
  "type": "generate",
  "options": {
    "markdown_text": "Basic Web3 Consulting Service - 1 hour session"
  },
  "outputPath": "service_desc.wip"
}
```

---

#### Example 1.2: Generate WIP with Images and Signature

**Prompt**: Generate a WIP file for premium consulting with markdown text, include two images from local files, and sign it with account "alice". Markdown: "Premium Consulting Package includes 4 hours of dedicated service and priority support.", images: "logo.png" and "demo.jpg", output to "premium_service.wip".

```json
{
  "type": "generate",
  "options": {
    "markdown_text": "Premium Consulting Package includes 4 hours of dedicated service and priority support.",
    "images": [
      {
        "source": "logo.png",
        "id": "company_logo",
        "filename": "company_logo.png"
      },
      {
        "source": "demo.jpg",
        "id": "service_demo"
      }
    ],
    "account": "alice"
  },
  "outputPath": "premium_service.wip"
}
```

---

## Example 2: Verify WIP File

### Feature Description

Verify a WIP file's integrity by checking its hash and signatures. Optionally verify against an expected hash value.

### Examples

#### Example 2.1: Basic Verification

**Prompt**: Verify the integrity of the WIP file at "service_desc.wip".

```json
{
  "type": "verify",
  "wipFilePath": "service_desc.wip"
}
```

---

#### Example 2.2: Verify with Expected Hash

**Prompt**: Verify the WIP file at "premium_service.wip" and check that it matches the expected hash value.

```json
{
  "type": "verify",
  "wipFilePath": "premium_service.wip",
  "hash_equal": "sha256:abc123def456..."
}
```

---

## Example 3: Sign WIP File

### Feature Description

Sign an existing WIP file with an account's private key. Adds a digital signature to prove authenticity.

### Examples

#### Example 3.1: Sign with Default Account

**Prompt**: Sign the WIP file at "service_desc.wip" using the default account. Save to "signed_service_desc.wip".

```json
{
  "type": "sign",
  "wipFilePath": "service_desc.wip",
  "outputPath": "signed_service_desc.wip"
}
```

---

#### Example 3.2: Sign with Specific Account

**Prompt**: Sign the WIP file at "premium_service.wip" using account "bob".

```json
{
  "type": "sign",
  "wipFilePath": "premium_service.wip",
  "account": "bob"
}
```

---

## Example 4: Convert WIP to HTML

### Feature Description

Convert one or more WIP files to HTML format for display. Supports single files, directories, and network URLs.

### Examples

#### Example 4.1: Convert Single File

**Prompt**: Convert the WIP file at "service_desc.wip" to HTML, set page title to "Service Description", use light theme.

```json
{
  "type": "wip2html",
  "wipPath": "service_desc.wip",
  "options": {
    "title": "Service Description",
    "theme": "light"
  }
}
```

---

#### Example 4.2: Convert Directory with Output Path

**Prompt**: Convert all WIP files in the "./wips" directory to HTML and save them to "./html_output".

```json
{
  "type": "wip2html",
  "wipPath": "./wips",
  "options": {
    "outputPath": "./html_output"
  }
}
```

---

## WIP and Service Integration

WIP files are deeply integrated with the Service component. Every sales item in a Service must reference a WIP file hash using the `wip_hash` field. This ensures that product/service descriptions are immutable and verifiable.

### Workflow Example

1. **Create WIP**: Generate a WIP file describing your product/service
2. **Sign WIP** (optional): Sign the WIP file with your account
3. **Get Hash**: Extract the WIP file's hash
4. **Add to Service**: Reference the hash in your Service's sales item
5. **Publish**: Customers can verify the product description by checking the WIP hash

---

## Important Notes

⚠️ **Every Service sales item requires a `wip_hash`** - this ensures product description immutability.

⚠️ **WIP files can be signed with multiple signatures** - supports multi-signature scenarios.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Service](service.md)** | WYSIWYG product trading - uses WIP hashes for sales items |
| **[Account](account.md)** | Local wallet management - signs WIP files |
| **[Query](query.md)** | Data query - can retrieve and verify WIP-related data |

