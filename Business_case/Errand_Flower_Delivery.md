# Flower Delivery on Errand: A Complete Business Case

## 📖 How to Use This Guide

This article provides two ways to implement a flower delivery service on Wowok:

**🚀 Quick Implementation**
Copy the JSON configurations in order and send them to AI. Each JSON is ready-to-use and will create functional objects step by step. Remember to ask AI to replace address placeholders with your actual object addresses before creation.

**🔍 Deep Understanding** 
Each JSON configuration includes immediate technical explanation covering what each parameter does, why it's configured this way, and how to customize for your specific needs.

> 💡 **Customization Tip**: The JSONs create exactly what we tested, but if you have different requirements, simply ask AI to modify the JSON parameters to match your needs.

## Quick Reference: Object Creation Order

For immediate implementation, create objects in this order:

1. **[Permission Object](#permission-setup-for-flower-delivery)** → Establishes access control foundation
2. **[Repository Object](#repository-object-your-communication-database)** → Creates data storage (links to Permission)  
3. **[Guard Objects](#guard-objects-universal-verification-system)** → Defines payment and refund rules
4. **[Extra Fee Service](#extra-fee-service-handling-the-unexpected)** → Price adjustment mechanism (needed for Machine)
5. **[Machine Object](#machine-object-workflow-that-adapts)** → Establishes workflow (links to Guards and Extra Fee Service)
6. **[Main Service](#main-service-your-complete-digital-storefront)** → Complete service offering (links to all above)

> 💡 **Pro Tip**: Each object references the previous ones by address or name. You can save addresses or simply tell AI "bind this service to XXX withdrawal guard" using object names.

## Flower Delivery: Errand's Promise in Action

Sarah needs white roses delivered to Emma by 3 PM for a birthday surprise. She describes her need once: "White roses for Emma's birthday, delivered with something personal – she loves watercolor art." The system identifies several providers in Emma's area with flower delivery experience. But knowing Emma's passion for hand-painted artwork and Jake's background in sketching custom gift cards, it narrows to Jake – someone whose $3 premium for watercolor-style illustrations perfectly matches what would make Emma's day special.

> 🗒️**Note**：What you build here makes your next project faster.
> - **Building pizza delivery?**  Clone your services, tell AI "Change flowers to pizza."
> - **Want recurring payments?**  Clone your Guards and Treasuries, tell AI "make this monthly subscriptions."
> - **Need team delivery instead of solo?**  Clone your Machine, tell AI "Add three delivery people."
>   Each object you create becomes a starting point you control and modify.

### Permission Setup for Flower Delivery

Permission objects manage who can perform what actions across your business operations. When other objects reference a Permission, they inherit its access control settings, creating unified management across all connected components.

Jake needs unified control over his delivery business operations. We create a dedicated Permission object that gives him administrative access to all business components.

> 💡 **Why needed**: AI can auto-generate permissions (faster and more convenient when you don't need unified management). A dedicated Permission object enables unified management across multiple services and supports cold wallet integration.

```json
// Permission Object Configuration - Copy this to AI for permission creation
{
  "account": "", // Optional - leave empty to use default account
  "data": {
    "object": {
      "name": "errand_delivery_permission",
      "onChain": true,
      "tags": ["errand", "delivery", "business"],
      "useAddressIfNameExist": false
    },
    "description": "Unified permission management for errand delivery business operations",
    "biz_permission": {
      "op": "add",
      "data": [
        {
          "index": 1001,
          "name": "Repository Write Access"
        }
      ]
    },
    "admin": {
      "op": "add",
      "addresses": [
        {
          "name_or_address": "{DELIVERY_PROVIDER_ADDRESS}", // Replace with actual delivery provider address
          "local_mark_first": true
        }
      ]
    },
    "permission": {
      "op": "add entity",
      "entities": [
        {
          "address": {
            "name_or_address": "{BUYER_ADDRESS}", // Buyer (Sarah) address
            "local_mark_first": true
          },
          "permissions": [
            {"index": 1001} // Repository write access
          ]
        },
        {
          "address": {
            "name_or_address": "{DELIVERY_PROVIDER_ADDRESS}", // Delivery provider (Jake) address  
            "local_mark_first": true
          },
          "permissions": [
            {"index": 1001} // Repository write access
          ]
        }
      ]
    }
  }
}
```
Result should look like:
![img_v3_02pu_1e473d37-2433-49ad-a1f0-ec8346d87b8g](https://github.com/user-attachments/assets/f90614d7-193b-44f0-b0fe-fd6675d17b6c)
![img_v3_02pu_7ce3c7d3-8480-45db-9c4b-53b0b3a47a6g](https://github.com/user-attachments/assets/eabefeee-0e1d-483a-b9b2-251f3c3e8044)


### 🔧 Technical Breakdown: Permission Object

**What this JSON does:**
- Creates a Permission object giving Jake comprehensive administrative control over his delivery business
- Provides all necessary permissions for creating and managing services, repositories, workflows, and business operations
- Establishes the foundation that all other objects will reference for access control
- Defines custom permission ** 1001 ** for Repository write access
- Grants Repository write permissions to both buyer (Sarah) and delivery provider (Jake)

**Key Parameters:**
- `"biz_permission"` - Creates custom permission index 1001 for "Repository Write Access"
- `"admin"` - Sets administrator status, which provides comprehensive control over all business operations
- `"{DELIVERY_PROVIDER_ADDRESS}"` - Replace with actual delivery provider address
- `"local_mark_first": true` - Prioritizes local address marks for easier management
- `"permission"` - Grants specific users Repository write access (permission 1001)
- `"{BUYER_ADDRESS}"` and `"{DELIVERY_PROVIDER_ADDRESS}"` - Replace with actual participant addresses

> 💡 **Cold Wallet Tip**: "Add my cold wallet address 0x1234... to this Permission object with full 
administrative rights for secure management."

*For complete Permission object documentation: [Permission Object Guide](https://github.com/wowok-ai/docs/blob/main/Object/Permission.md)*

### Repository Object: Your Communication Database

Repository stores all communication beyond the standard workflow - photos, messages, instructions, and feedback that build context around transactions.

```json
// Repository Object Configuration - Copy this to AI for repository creation
{
  "account": "{delivery_account_address}",
  "data": {
    "object": {
      "name": "flower_delivery_records",
      "permission": "{flower_delivery_permission_address}",
      "onChain": true,
      "tags": ["communication records", "flower delivery"]
    },
    "mode": 1,
    "description": "Flower delivery service communication records repository",
    "policy": {
      "op": "add",
      "data": [
        {
          "key": "message",
          "description": "Text messages between parties",
          "dataType": 204,
          "permissionIndex": 1001
        },
        {
          "key": "photo",
          "description": "IPFS links to delivery photos", 
          "dataType": 204,
          "permissionIndex": 1001
        },
        {
          "key": "video",
          "description": "IPFS links to delivery videos",
          "dataType": 204,
          "permissionIndex": 1001
        },
        {
          "key": "location",
          "description": "GPS coordinates or address updates",
          "dataType": 204,
          "permissionIndex": 1001
        },
        {
          "key": "timestamp",
          "description": "Record timestamp",
          "dataType": 202,
          "permissionIndex": 1001
        }
      ]
    }
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```
Result should look like:
![img_v3_02q0_ef8e6df9-64a1-43c3-8fa8-d4b57afbc93g](https://github.com/user-attachments/assets/f9acddf9-98fe-4562-bcb2-61511f65de13)

### 🔧 Technical Breakdown: Repository Object

**What this JSON does:**
- Creates a structured communication database for storing interactions beyond standard workflow steps
- Links to the Permission object to control who can add information
- Defines specific data fields: message, photo, video

**Key Parameters:**
- `"mode": 1` - Strict mode ensures only predefined data types can be stored
- `"policy"` - Defines exact data structure with specific fields for better organization
- Permission control through linked Permission object

**Data Fields:**
- `"message"` - Text-based communication between parties (dataType: 204/string)
- `"photo"` - IPFS links to delivery photos (dataType: 204/string)
- `"video"` - IPFS links to delivery videos (dataType: 204/string)  
- `"location"` - GPS coordinates or address updates (dataType: 204/string)
- `"timestamp"` - Record timestamp (dataType: 202/number)

**Access Control:**
Write permissions are controlled by the linked Permission object. Strict mode allows only predefined fields, preventing data clutter while enabling structured data retrieval.

*For complete Repository object documentation: [Repository Object Guide](https://github.com/wowok-ai/docs/blob/main/Object/Repository.md)*

### Guard Objects: Universal Verification System

Guards function as programmable verification conditions that automatically check when specific criteria are met. They control when funds can be withdrawn, when refunds are triggered, and what conditions must be satisfied.

#### Universal Withdrawal Guard

```json
// Universal Withdrawal Guard: When Jake can collect payment - Copy this to AI for guard creation
{
  "account": "{delivery_account_address}",
  "data": {
    "description": "Universal delivery withdrawal verification - handles all delivery income scenarios",
    "namedNew": {
      "name": "universal_withdrawal_guard",
      "onChain": true,
      "tags": ["delivery withdrawal", "unified verification", "flower delivery"]
    },
    "table": [
      {
        "identifier": 1,
        "bWitness": true,
        "value_type": 101
      },
      {
        "identifier": 2,
        "bWitness": true,
        "value_type": 101
      },
      {
        "identifier": 3,
        "bWitness": true,
        "value_type": 101
      },
      {
        "identifier": 4,
        "bWitness": true,
        "value_type": 101
      }
    ],
    "root": {
      "logic": 20,
      "parameters": [
        {
          "logic": 16,
          "parameters": [
            {"query": 801, "object": {"identifier": 1}, "parameters": []},
            {"value_type": 120, "value": "product_confirmation"}
          ]
        },
        {
          "logic": 16,
          "parameters": [
            {"query": 801, "object": {"identifier": 1}, "parameters": []},
            {"value_type": 120, "value": "delivery_completed"}
          ]
        },
        {
          "logic": 16,
          "parameters": [
            {"query": 801, "object": {"identifier": 1}, "parameters": []},
            {"value_type": 120, "value": "refund_negotiation"}
          ]
        },
        {
          "logic": 16,
          "parameters": [
            {"query": 801, "object": {"identifier": 1}, "parameters": []},
            {"value_type": 120, "value": "buyer_cancellation"}
          ]
        }
      ]
    }
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```
Result should looks like:
![img_v3_02pu_ea454ca5-3127-4657-a483-641da718decg](https://github.com/user-attachments/assets/7bf01ac7-6db3-4c20-bb78-537ec98a055e)

**Universal Withdrawal Guard:**
- **Purpose**: Defines when delivery person can withdraw earnings from Order
- **Conditions**: Jake can withdraw when Progress reaches:
  - `"product_confirmation"` - After buying flowers, claim product costs (avoid out-of-pocket expenses)
  - `"delivery_completed"` - After successful delivery, claim service fees
  - `"refund_negotiation"` - Claim agreed portion based on completed work
  - `"buyer_cancellation"` - Claim compensation for time and effort invested

#### Universal Refund Guard

```json
// Universal Refund Guard: When Sarah can get refunded - Copy this to AI for guard creation
{
  "account": "{delivery_account_address}",
  "data": {
    "description": "Universal buyer refund verification - handles all buyer refund scenarios",
    "namedNew": {
      "name": "universal_refund_guard",
      "onChain": true,
      "tags": ["buyer refund", "unified verification", "flower delivery"]
    },
    "table": [
      {
        "identifier": 1,
        "bWitness": true,
        "value_type": 101
      },
      {
        "identifier": 2,
        "bWitness": true,
        "value_type": 101
      }
    ],
    "root": {
      "logic": 20,
      "parameters": [
        {
          "logic": 16,
          "parameters": [
            {"query": 801, "object": {"identifier": 1}, "parameters": []},
            {"value_type": 120, "value": "delivery_cancellation"}
          ]
        },
        {
          "logic": 16,
          "parameters": [
            {"query": 801, "object": {"identifier": 1}, "parameters": []},
            {"value_type": 120, "value": "refund_negotiation"}
          ]
        }
      ]
    }
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```
Result should look like:
![img_v3_02pu_b047c66f-5810-45f4-a039-ccddf67ffc9g](https://github.com/user-attachments/assets/3e9502fc-1fac-4b5b-8601-542a45690669)

**Universal Refund Guard:**
- **Purpose**: Defines when buyer can get money back from Order
- **Conditions**: Sarah can get refund when Progress reaches:
  - `"delivery_cancellation"` - Jake cancels, Sarah gets full refund
  - `"refund_negotiation"` - Both parties agree on terms, Sarah claims her portion

#### Time Protection Guard

```json
// Time Protection Guard: Prevents indefinite delays - Copy this to AI for guard creation
{
  "account": "{delivery_account_address}",
  "data": {
    "description": "Delivery time protection verification - allows solo confirmation after 3 hours",
    "namedNew": {
      "name": "delivery_time_protection_guard",
      "onChain": true,
      "tags": ["time protection", "delivery rights", "3 hour verification"]
    },
    "table": [
      {
        "identifier": 1,
        "bWitness": true,
        "value_type": 101,
        "description": "Progress address"
      },
      {
        "identifier": 3,
        "bWitness": true,
        "value_type": 101,
        "description": "Service address"
      },
      {
        "identifier": 10,
        "bWitness": false,
        "value_type": 103,
        "value": 10800000,
        "description": "3 hours = 10800000 milliseconds"
      }
    ],
    "root": {
      "logic": 11,
      "parameters": [
        {"calc": 3, "parameters": [
          {"context": 61},
          {"query": 810, "object": {"identifier": 1}, "parameters": []}
        ]},
        {"identifier": 10}
      ]
    }
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```
Result should look like:
![img_v3_02pu_032b250c-acb8-422d-a71f-cce010a1666g](https://github.com/user-attachments/assets/b7b5ba79-b4a8-45b4-858b-71229374cab4)

**Time Protection Guard:**
- **Purpose**: After 3 hours, Jake can confirm delivery completion alone (prevents buyers forgetting to confirm while allowing sufficient negotiation time)
- **Logic**: Current time minus last Progress update > 3 hours

> 💡 **Troubleshooting**: If withdrawal fails, ask AI: "Check if current Progress node matches my withdrawal Guard conditions."

*For complete Guard object documentation: [Guard Object Guide](https://github.com/wowok-ai/docs/blob/main/Object/Guard.md)*

### Extra Fee Service: Handling the Unexpected

Since Machine workflow depends on Extra Fee Service for price upgrades, create this first. You can create objects in any order as long as dependencies are bound before publishing.

```json
// Extra Fee Service Configuration - Copy this to AI for service creation
{
  "account": "{delivery_account_address}",
  "data": {
    "object": {
      "name": "flower_delivery_extra_fee_service",
      "permission": "{flower_delivery_permission_address}",
      "type_parameter": "0x2::sui::SUI",
      "onChain": true,
      "tags": ["extra fee service", "flower delivery"]
    },
    "description": "Flower delivery extra fee service",
    "location": "Manhattan, New York",
    "sales": {
      "op": "add",
      "sales": [
        {
          "item": "extra_fee_1_dollar",
          "price": 1000000000,
          "stock": 10000,
          "endpoint": null
        },
        {
          "item": "extra_fee_5_dollar", 
          "price": 5000000000,
          "stock": 10000,
          "endpoint": null
        },
        {
          "item": "extra_fee_10_dollar",
          "price": 10000000000,
          "stock": 10000,
          "endpoint": null
        }
      ]
    },
    "withdraw_guard": {
      "op": "set",
      "guards": [
        {
          "guard": "{universal_withdrawal_guard_address}",
          "percent": 100
        }
      ]
    },
    "refund_guard": {
      "op": "set",
      "guards": [
        {
          "guard": "{universal_refund_guard_address}",
          "percent": 100
        }
      ]
    },
    "bPublished": false
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```
Result should look like:
![img_v3_02pu_f0496eb1-454f-4315-98a8-45fb5810283g](https://github.com/user-attachments/assets/abf5dcf9-69af-4a50-bb34-9693ed57bc12)

### 🔧 Technical Breakdown: Extra Fee Service

**What this JSON does:**
- Creates a separate Service for handling price upgrades and additional costs
- Offers preset fee amounts ($1, $5, $10) for common adjustments
- Uses the same Guard system as main service for consistent payment rules

**Key Parameters:**
- `"price": 1000000000` - $1 in SUI units (1 SUI = 1,000,000,000 MIST)
- `"stock": 10000` - High stock ensures availability for unexpected costs

**Why configured this way:**
Separate Extra Fee Service simplifies accounting. When Jake needs extra for premium flowers, buyer purchases from this service rather than renegotiating main service price. Different amounts can be combined (e.g., $13 = one $10 + three $1).

### Machine Object: Workflow That Adapts

Machine defines the workflow as nodes of responsibility. Each forward creates on-chain proof that a role accepted the next responsibility.

```json
// Machine Object Configuration - Copy this to AI for machine creation
{
  "account": "{delivery_account_address}",
  "data": {
    "object": {
      "name": "flower_delivery_machine",
      "permission": "{flower_delivery_permission_address}",
      "onChain": true,
      "tags": ["flower delivery", "errand service"]
    },
    "description": "Flower delivery workflow",
    "endpoint": "https://flower-delivery-api.com/progress",
    "bPublished": false,
    "bPaused": false,
    "nodes": {
      "op": "add",
      "data": [
        {
          "name": "order_confirmation",
          "pairs": [
            {
              "prior_node": "",
              "threshold": 1,
              "forwards": [
                {
                  "name": "confirm_order_details",
                  "namedOperator": "delivery_person",
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "product_confirmation",
          "pairs": [
            {
              "prior_node": "order_confirmation",
              "threshold": 2,
              "forwards": [
                {
                  "name": "upload_product_photo",
                  "namedOperator": "delivery_person",
                  "weight": 1
                },
                {
                  "name": "buyer_confirm_purchase",
                  "namedOperator": "buyer",
                  "weight": 1
                }
              ]
            },
            {
              "prior_node": "price_upgrade",
              "threshold": 2,
              "forwards": [
                {
                  "name": "upload_product_photo",
                  "namedOperator": "delivery_person",
                  "weight": 1
                },
                {
                  "name": "buyer_confirm_purchase",
                  "namedOperator": "buyer",
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "delivery_completed",
          "pairs": [
            {
              "prior_node": "product_confirmation",
              "threshold": 2,
              "forwards": [
                {
                  "name": "buyer_confirm_delivery",
                  "namedOperator": "buyer",
                  "weight": 1
                },
                {
                  "name": "delivery_confirm_completion",
                  "namedOperator": "delivery_person",
                  "weight": 1
                },
                {
                  "name": "delivery_time_protection",
                  "namedOperator": "delivery_person",
                  "weight": 2,
                  "guard": "{delivery_time_protection_guard_address}"
                }
              ]
            }
          ]
        },
        {
          "name": "price_upgrade",
          "pairs": [
            {
              "prior_node": "order_confirmation",
              "threshold": 1,
              "forwards": [
                {
                  "name": "buyer_agree_upgrade",
                  "namedOperator": "buyer",
                  "weight": 1,
                  "suppliers": [
                    {
                      "service": "{flower_delivery_extra_fee_service_address}",
                      "bRequired": false
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "buyer_cancellation",
          "pairs": [
            {
              "prior_node": "order_confirmation",
              "threshold": 1,
              "forwards": [
                {
                  "name": "buyer_request_cancellation",
                  "namedOperator": "buyer",
                  "weight": 1
                }
              ]
            },
            {
              "prior_node": "product_confirmation",
              "threshold": 1,
              "forwards": [
                {
                  "name": "buyer_request_cancellation",
                  "namedOperator": "buyer",
                  "weight": 1
                }
              ]
            },
            {
              "prior_node": "price_upgrade",
              "threshold": 1,
              "forwards": [
                {
                  "name": "buyer_request_cancellation",
                  "namedOperator": "buyer",
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "delivery_cancellation",
          "pairs": [
            {
              "prior_node": "order_confirmation",
              "threshold": 1,
              "forwards": [
                {
                  "name": "delivery_request_cancellation",
                  "namedOperator": "delivery_person",
                  "weight": 1
                }
              ]
            },
            {
              "prior_node": "product_confirmation",
              "threshold": 1,
              "forwards": [
                {
                  "name": "delivery_request_cancellation",
                  "namedOperator": "delivery_person",
                  "weight": 1
                }
              ]
            },
            {
              "prior_node": "price_upgrade",
              "threshold": 1,
              "forwards": [
                {
                  "name": "delivery_request_cancellation",
                  "namedOperator": "delivery_person",
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "refund_negotiation",
          "pairs": [
            {
              "prior_node": "order_confirmation",
              "threshold": 2,
              "forwards": [
                {
                  "name": "buyer_agree_distribution",
                  "namedOperator": "buyer",
                  "weight": 1
                },
                {
                  "name": "delivery_agree_distribution",
                  "namedOperator": "delivery_person",
                  "weight": 1
                }
              ]
            },
            {
              "prior_node": "product_confirmation",
              "threshold": 2,
              "forwards": [
                {
                  "name": "buyer_agree_distribution",
                  "namedOperator": "buyer",
                  "weight": 1
                },
                {
                  "name": "delivery_agree_distribution",
                  "namedOperator": "delivery_person",
                  "weight": 1
                }
              ]
            },
            {
              "prior_node": "price_upgrade",
              "threshold": 2,
              "forwards": [
                {
                  "name": "buyer_agree_distribution",
                  "namedOperator": "buyer",
                  "weight": 1
                },
                {
                  "name": "delivery_agree_distribution",
                  "namedOperator": "delivery_person",
                  "weight": 1
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```
Schematic Diagram:
![img_v3_02q0_fed93457-9ed6-4f25-b82c-d180e707afbg](https://github.com/user-attachments/assets/1bd69957-5913-4307-a301-39ed44afd861)

Result should look like:
<img width="1378" height="1179" alt="image" src="https://github.com/user-attachments/assets/99e770a2-0e02-40d7-a7a2-4d0da8426b29" />

### 🔧 Technical Breakdown: Machine Object

**What this JSON does:**
- Defines complete workflow with 7 nodes: order_confirmation → product_confirmation → delivery_completed, plus 4 termination paths
- Each "forward" requires specific operators and creates on-chain proof
- Handles both standard delivery and exception scenarios

**Key Workflow Paths:**

**Standard Path:** `order_confirmation → product_confirmation → delivery_completed`
- **Order Confirmation**: Official start of delivery business and contract fulfillment commitment
- **Product Confirmation**: Both parties confirm purchased items meet requirements at specified address
- **Delivery Completed**: Both parties confirm successful delivery

**Price Upgrade Loop:** `order_confirmation → price_upgrade → product_confirmation → delivery_completed` 
- Allows price adjustments with buyer approval. Extra fees can cover costs beyond originally agreed delivery distances

**Termination Paths:**
- **Buyer Cancellation** - Sarah requests cancellation (pays incurred costs). Example: Sarah cancels after Jake starts traveling to flower shop, pays for travel costs.
- **Delivery Cancellation** - Jake cannot complete delivery (buyer receives refund, optional agreed compensation based on circumstances). Example: Jake gets sick, Sarah gets full refund, optionally pays Jake's partial costs if agreed.
- **Refund Negotiation** - Dynamic proportional withdrawal for any situation requiring custom distribution. Examples: 
  - Product funds deposited but buyer cancels after delivery starts: buyer recovers product funds, Jake gets travel costs
  - Service partially completed due to weather: 70% refund to buyer, 30% to Jake for attempt
  - Quality issues discovered: negotiate partial compensation based on actual value delivered
  - The agreed distribution is stored in Repository as evidence

**Key Parameters:**
- `"threshold": 2` - Requires both parties to advance
- `"namedOperator"` - Assigns specific roles (buyer/delivery_person)
- `"weight": 1` - Each action contributes 1 point toward threshold

**NamedOperator Assignment:**
Machine templates can be used by multiple services. Each Progress instance specifies which addresses are assigned to roles for that specific order.

> 💡 **Business Logic**: Each forward is a digital signature recorded on-chain with timestamp and address.

*For complete Machine object documentation: [Machine Object Guide](https://github.com/wowok-ai/docs/blob/main/Object/Machine.md)*

### Main Service: Your Complete Digital Storefront

The Main Service combines all previous components into a customer-facing offering with clear pricing and terms.

```json
// Main Service Configuration - Copy this to AI for service creation
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
          "percent": 100
        }
      ]
    },
    "refund_guard": {
      "op": "set", 
      "guards": [
        {
          "guard": "{universal_refund_guard_address}",
          "percent": 100
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
Result should look like:
![img_v3_02pu_4163c0fe-1a31-4063-8894-8b30e8a3608g](https://github.com/user-attachments/assets/3b38f0f5-7a8c-45e7-a16d-6adb64515843)
![img_v3_02pu_3238f4d0-d025-4fb2-938f-7117cde3666g](https://github.com/user-attachments/assets/6366828a-170e-440f-97c7-81b86fbd30d3)

### 🔧 Technical Breakdown: Main Service

**What this JSON does:**
- Combines all previous objects into a complete service offering
- Defines pricing for basic ($100) and urgent ($150) delivery
- Links Machine workflow, Repository data storage, and Guard protection rules

**Key Integration Points:**
- `"machine"` - Links to workflow definition
- `"repository"` - Links to data storage  
- `"withdraw_guard"` & `"refund_guard"` - Links to payment protection rules
- `"permission"` - Links to access control

**Key Parameters:**
- `"price": 100000000000` - $100 in SUI units for basic delivery
- `"stock": 1000` - Available delivery slots
- `"customer_required_info"` - Encrypted delivery details from buyer

> 💡 **Key Insight**: Service objects create Order objects that hold funds. Guards control when money moves from Order to Service provider.

> 💡 **Publishing Tip**: Publish service only after all linked objects are successfully created. Once published, objects become immutable but can be cloned and modified.

With the Main Service defined, all components come together. You now have a fully runnable service on Wowok.

*For complete Service object documentation: [Service Object Guide](https://github.com/wowok-ai/docs/blob/main/Object/Service.md)*

## What You've Built

You now have a complete automated delivery business that handles orders, tracks progress, and processes payments through programmable verification. Jake and Sarah interact with transparent conditions and automatic protections.

But the value extends beyond individual transactions. Jake's successful patterns become reusable infrastructure. Sarah's preferences and Emma's feedback create data that improves future matching. Each completed delivery builds reputation and intelligence that makes the next transaction smoother and more precisely targeted.

This creates a network where proven business logic spreads, successful providers scale efficiently, and buyers find exactly what they need through accumulated transaction intelligence.

*For advanced design patterns and engineering best practices, see our companion guide: "Wowok Engineering Patterns for Service Design"*
