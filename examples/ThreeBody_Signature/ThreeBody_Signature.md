# Three-Body Author Signature Service

A complete example demonstrating how to create a service for book signing by the Three-Body author. This service allows customers to request a personalized message (up to 10 characters) on their book, signed by the author.

---

## Overview

This example demonstrates:

 **Service with Buy Guard**: The buy_guard allows you to define various conditions for users to purchase products, such as identity verification, completing KYC, or being on an allowlist. In this example, only the service creator (author) can purchase this service

### Key Design Decisions

1. **Buy Guard Protection**: Only the author (`three_body_author`) can purchase this service, preventing unauthorized usage
2. **Simple Two-Node Workflow**: Clear progression from delivery to completion
3. **WIP Files Optional**: Can use WIP files or empty strings
4. **Fixed Price**: 888 tokens for the signature service

---

## Prerequisites

Before running this example, ensure you have:

1. **Account Setup**: The `three_body_author` account with sufficient WOW tokens
2. **Minimum Balance**: At least 1000 WOW for gas fees and service creation

### Check Account Balance

**Request**:
```json
{
  "operation_type": "query_toolkit",
  "data": {
    "query_type": "account_balance",
    "name_or_address": "three_body_author"
  },
  "env": {
    "network": "testnet"
  }
}
```

**Actual Result**:
```json
{
  "address": "0xda123833e96e734815f2f57d52ad463681635c6678cfe113c77dbeee49d7865c",
  "balance": {
    "coinType": "0x2::wow::WOW",
    "totalBalance": "4904827524"
  }
}
```

---

## Step 1: Create Permission Object

Create a Permission object to manage the service.

**Request**:
```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "three_body_permission_v2",
      "replaceExistName": true
    },
    "description": "Permission for Three-Body Signature Service v2",
    "table": {
      "op": "add perm by entity",
      "entity": {"name_or_address": "three_body_author"},
      "index": [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 306]
    }
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Actual Result**:
```json
[{
  "type": "Permission",
  "object": "0xf939b4be49761ef8c30ff19ee874157e2ba1d83ab3a8de4f310443e588d1df99",
  "version": "2195623",
  "change": "created"
}]
```

---

## Step 2: Create Buy Guard

Create a Guard that verifies the buyer is the service creator (author). This ensures only the author can purchase this service.

**Request**:
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "three_body_buy_guard_v2",
      "tags": ["signature", "book", "buy-guard"],
      "replaceExistName": true
    },
    "description": "Verify buyer is the service creator (three_body_author). Only the author can purchase this signature service.",
    "table": [
      {
        "identifier": 0,
        "b_submission": false,
        "value_type": "Address",
        "value": "0xda123833e96e734815f2f57d52ad463681635c6678cfe113c77dbeee49d7865c",
        "name": "author_address"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_equal",
        "nodes": [
          {
            "type": "context",
            "context": "Signer"
          },
          {
            "type": "identifier",
            "identifier": 0
          }
        ]
      }
    }
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Actual Result**:
```json
[{
  "type": "Guard",
  "object": "0x2fc0283e55f4322eb602a5370b32e455597e339c74a23ada5d9a4a82f02f7925",
  "version": "2195993",
  "change": "created"
}]
```

---

## Step 3: Create Machine with Workflow Nodes

Create a Machine to define the service workflow: Book Delivery → Signature Completion.

### Create Machine

**Request**:
```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "three_body_machine_v2",
      "permission": "three_body_permission_v2",
      "replaceExistName": true
    },
    "description": "Three-Body signature service workflow v2: Book Delivery -> Signature Completion",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "Book Delivered",
          "pairs": [
            {
              "prev_node": "",
              "threshold": 0,
              "forwards": [
                {
                  "name": "Confirm Delivery",
                  "permissionIndex": 1000,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "Signature Completed",
          "pairs": [
            {
              "prev_node": "Book Delivered",
              "threshold": 1,
              "forwards": [
                {
                  "name": "Complete Signature",
                  "permissionIndex": 1001,
                  "weight": 1
                }
              ]
            }
          ]
        }
      ]
    },
    "publish": true
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Actual Result**:
```json
[{
  "type": "Machine",
  "object": "0x8e7e1c3f173c9e2203ca2e1e50b4c634dd1cef06d248ac50e35749adf7499411",
  "version": "2196424",
  "change": "created"
}]
```



---

## Step 4: Create Service (Unpublished)

Create the Three-Body signature service without publishing. The Service must be unpublished when binding the Machine.

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "three_body_signature_service_v2",
      "type_parameter": "0x2::wow::WOW",
      "permission": "three_body_permission_v2",
      "replaceExistName": true
    },
    "description": "Three-Body author book signature service v2. Provide a message up to 10 characters, and the author will sign your book. Process: 1.Book Delivery 2.Signature Completion. Fee: 888.",
    "publish": false
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Actual Result**:
```json
[{
  "type": "Service",
  "object": "0x140e91943775592736f587e596afce7d28f41fee1593f8dfbc2f04d852e5d45c",
  "version": "2198123",
  "change": "created"
}]
```

---

## Step 5: Configure Machine

Bind the published Machine to the Service. **Important**: The Service must be unpublished when binding the Machine.

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v2",
    "machine": "three_body_machine_v2"
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Actual Result**:
```json
[{
  "type": "Service",
  "object": "0x140e91943775592736f587e596afce7d28f41fee1593f8dfbc2f04d852e5d45c",
  "version": "2198329",
  "change": "mutated"
}]
```

**Verification** (with no_cache: true):
```json
{
  "machine": "0x8e7e1c3f173c9e2203ca2e1e50b4c634dd1cef06d248ac50e35749adf7499411",
  "bPublished": false
}
```

---

## Step 6: Set Buy Guard

Configure the Buy Guard to restrict purchases to the author only.

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v2",
    "buy_guard": "three_body_buy_guard_v2"
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Actual Result**:
```json
[{
  "type": "Service",
  "object": "0x140e91943775592736f587e596afce7d28f41fee1593f8dfbc2f04d852e5d45c",
  "version": "2203786",
  "change": "mutated"
}]
```

---

## Step 7: Configure Order Allocators

Set up fund allocation: 100% to the author upon order completion.

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v2",
    "order_allocators": {
      "description": "Three-Body signature service fund allocation - 100% to author",
      "threshold": 0,
      "allocators": [
        {
          "guard": "three_body_buy_guard_v2",
          "sharing": [
            {
              "who": {
                "Signer": "signer"
              },
              "sharing": 10000,
              "mode": "Rate"
            }
          ]
        }
      ]
    },
    "customer_required": ["phone", "email", "shipping_address"]
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Actual Result**:
```json
[{
  "type": "Service",
  "object": "0x140e91943775592736f587e596afce7d28f41fee1593f8dfbc2f04d852e5d45c",
  "version": "2203787",
  "change": "mutated"
}]
```

---

## Step 8: Add Sales and Publish Service

Add sales items and publish the service to make it available for orders.

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v2",
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "Three-Body Book Signature",
          "price": 888,
          "stock": 100,
          "suspension": false,
          "wip": "",
          "wip_hash": ""
        }
      ]
    },
    "publish": true
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Actual Result**:
```json
[{
  "type": "Service",
  "object": "0x140e91943775592736f587e596afce7d28f41fee1593f8dfbc2f04d852e5d45c",
  "version": "2205976",
  "change": "mutated"
}]
```

---

## Step 9: Unpause Service

Unpause the service to allow order creation.

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v2",
    "pause": false
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Actual Result**:
```json
[{
  "type": "Service",
  "object": "0x140e91943775592736f587e596afce7d28f41fee1593f8dfbc2f04d852e5d45c",
  "version": "2205975",
  "change": "mutated"
}]
```

---

## Step 10: Verify Service Configuration

Query the service to verify all configurations.

**Request**:
```json
{
  "operation_type": "query_toolkit",
  "data": {
    "query_type": "onchain_objects",
    "objects": ["three_body_signature_service_v2"],
    "no_cache": true
  },
  "env": {
    "network": "testnet"
  }
}
```

**Actual Result**:
```json
{
  "object": "0x140e91943775592736f587e596afce7d28f41fee1593f8dfbc2f04d852e5d45c",
  "type": "Service",
  "description": "Three-Body author book signature service v2. Provide a message up to 10 characters, and the author will sign your book. Process: 1.Book Delivery 2.Signature Completion. Fee: 888.",
  "sales": [
    {
      "name": "Three-Body Book Signature",
      "stock": "100",
      "suspension": false,
      "price": "888",
      "wip": "",
      "wip_hash": ""
    }
  ],
  "buy_guard": "0x2fc0283e55f4322eb602a5370b32e455597e339c74a23ada5d9a4a82f02f7925",
  "machine": "0x8e7e1c3f173c9e2203ca2e1e50b4c634dd1cef06d248ac50e35749adf7499411",
  "bPublished": true,
  "bPaused": false,
  "customer_required": ["phone", "email", "shipping_address"],
  "permission": "0xf939b4be49761ef8c30ff19ee874157e2ba1d83ab3a8de4f310443e588d1df99"
}
```

---

## Testing the Buy Guard

### Test 1: Author Purchase (Should Succeed)

The author (`three_body_author`) should be able to purchase the service.

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v2",
    "order_new": {
      "buy": {
        "items": [
          {
            "name": "Three-Body Book Signature",
            "stock": 1,
            "wip_hash": ""
          }
        ],
        "total_pay": {
          "balance": 888
        }
      },
      "namedNewOrder": {
        "name": "three_body_order_v2",
        "replaceExistName": true
      },
      "namedNewProgress": {
        "name": "three_body_progress_v2",
        "replaceExistName": true
      }
    }
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

---

### Test 2: Non-Author Purchase (Should Fail)

Any other account attempting to purchase should fail with Buy Guard verification error.

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service_v2",
    "order_new": {
      "buy": {
        "items": [
          {
            "name": "Three-Body Book Signature",
            "stock": 1,
            "wip_hash": ""
          }
        ],
        "total_pay": {
          "balance": 888
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

## Workflow Execution

After a successful purchase by the author, the order progresses through the Machine nodes:

### Node 1: Book Delivered

The author confirms the book has been delivered.

**Request**:
```json
{
  "operation_type": "progress",
  "data": {
    "object": "three_body_progress_v2",
    "forward": {
      "forward": "Confirm Delivery",
      "namedOperator": ""
    }
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

### Node 2: Signature Completed

The author completes the signature.

**Request**:
```json
{
  "operation_type": "progress",
  "data": {
    "object": "three_body_progress_v2",
    "forward": {
      "forward": "Complete Signature",
      "namedOperator": ""
    }
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

---

## Summary

This example demonstrates:

1. **Buy Guard Implementation**: Restricts service purchases to specific accounts
2. **Machine Workflow**: Two-node process for service delivery tracking
3. **WIP Files Optional**: Sales items can use WIP files or empty strings
4. **Service Configuration**: Complete setup from creation to publication

### Key Object IDs (Actual)

| Object | Name | ID | Version |
|--------|------|-----|---------|
| Permission | three_body_permission_v2 | `0xf939b4...1df99` | 2195623 |
| Buy Guard | three_body_buy_guard_v2 | `0x2fc028...f7925` | 2195993 |
| Machine | three_body_machine_v2 | `0x8e7e1c...99411` | 2196424 |
| Service | three_body_signature_service_v2 | `0x140e91...e5d45c` | 2205976 |
| Order | three_body_order_v2 | `0x7684ab...3f35d49` | 2209290 |
| Allocation | three_body_allocation_v2 | `0xd6f2da...99e00` | 2209290 |
| Progress | three_body_progress_v2 | `0x97ef34...d935d9` | 2209290 |

---

## Design Notes

### Why Buy Guard?

The Buy Guard ensures only the intended user (the author) can purchase this service. This is useful when:
- The service is an internal tool
- Purchase authorization requires verification
- The service is part of a larger workflow controlled by a specific entity

### WIP Files Optional

This example shows both options for sales items:
- Can use WIP files with hash validation
- Can use empty wip/wip_hash for simpler setup
- WIP validation is skipped when wip is empty string

### Workflow Design

The two-node workflow provides clear tracking:
1. **Book Delivered**: Confirms physical delivery of the book
2. **Signature Completed**: Confirms the author has signed the book

Each node transition requires the author's confirmation, ensuring accountability.

---

## Execution Experience & Best Practices

### 1. Naming Strategy (Critical!)

**Always establish naming conventions first** :

- **Example**: Use consistent suffixes or no suffixes at all
  - Good: `three_body_permission_v2`, `three_body_buy_guard_v2`, `three_body_machine_v2`
  - Good: All names follow the same pattern
  - Provide naming rules for AI to manage object names automatically; avoid conflicts with other naming conventions such as version/timestamp/random numbers for unique names
  - Strongly recommend using the `replaceExistName` method in `LocalMarkOperationSchema` to enforce name usage (even if already exists)
  - All operations use names instead of addresses (much easier!)
  - Local marks map names to addresses automatically
  - Easier to read, test, and document

**Recommendation**:
1. Decide on naming before starting
2. Stick to it throughout the entire workflow
3. Document your naming pattern in the test results

### 2. Execution Order Matters (Critical!)

**Publish operations lock objects** - plan carefully:

#### Correct Order (Must Follow!)
1. **Permission** first - foundation for all other objects
2. **Machine** - create workflow before service
3. **Service (unpublished)** - get address for Guards
4. **Guards** - need Service address for verification logic
5. **Configure Service** - add machine, buy_guard, order_allocators
6. **Publish Service** - LAST! Once published, many changes are blocked

### 3. Guard Creation Tips

**Guards often depend on other objects**:
- Buy Guards: May reference Service address
- Progress Guards: May need Machine or Service information
- Order Allocator Guards: Should be created before Service publish

**Best Practice**:
1. Create empty Service with name first (unpublished)
2. Create all required Guards using that name
3. Configure Service with Guards
4. Publish Service

### 4. Machine Workflow Setup

**Machine nodes require permission indexes**:
- If you use permissionIndex, make sure they exist!
- Create permission indexes before adding machine nodes

**Machine Publish**:
- Must publish Machine before binding to Service
- Published Machine can still have nodes added/modified

### 5. Service Configuration Flow

**Configure everything before publishing**:
```
Service Created (unpublished)
    ↓
Add Sales Items
    ↓
Bind Machine
    ↓
Set Buy Guard
    ↓
Configure Order Allocators
    ↓
Set Arbitration (if needed)
    ↓
PUBLISH (LAST STEP!)
```

### 6. Testing Strategy

**Test incrementally, not all at once**:
1. Test each step as you go
2. Verify object creation with queries
3. Don't proceed to next step until current one is verified
4. Keep track of all object IDs in a test results file

### 7. Common Pitfalls to Avoid

1. **Price Units**: WOW tokens use 9 decimals, but testnet examples often use simple numbers (888 tokens)
2. **Local Marks**: Verify objects exist with `local_mark_list` queries
3. **Account Balance**: Always check balance before starting - gas fees add up!

### 8. Let AI Manage Object Naming for You

### 9. Query Toolkit is Your Best Friend

**Use queries constantly**:
- Verify objects exist
- Check configurations
- Debug issues
- Confirm state changes

The `query_toolkit` is essential for validating every step of the way.
