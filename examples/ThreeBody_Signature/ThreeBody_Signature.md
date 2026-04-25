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
      "name": "three_body_permission"
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
  "object": "0x276761c3fee4f0c5e04d309e060c943ad57f8b3f66ff0da60849b38ea210b77b",
  "version": "1170413",
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
      "name": "three_body_buy_guard",
      "tags": ["signature", "book", "buy-guard"]
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
  "object": "0x7cae6fceef01b57a5d9117afb8396274e4e5d161514ef052962e99eca74a9f42",
  "version": "1180407",
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
      "name": "three_body_machine",
      "permission": "three_body_permission"
    },
    "description": "Three-Body signature service workflow: Book Delivery -> Signature Completion"
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
  "object": "0x1189627fcef5c94495211f13f3b84732910584e966144dbcbc6837dadeed5700",
  "version": "1181009",
  "change": "created"
}]
```

### Add Workflow Nodes

**Request**:
```json
{
  "operation_type": "machine",
  "data": {
    "object": "three_body_machine",
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
  "type": "Machine",
  "object": "0x1189627fcef5c94495211f13f3b84732910584e966144dbcbc6837dadeed5700",
  "version": "1181010",
  "change": "mutated"
}]
```

### Publish Machine

**Request**:
```json
{
  "operation_type": "machine",
  "data": {
    "object": "three_body_machine",
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
  "object": "0x1189627fcef5c94495211f13f3b84732910584e966144dbcbc6837dadeed5700",
  "version": "1181011",
  "change": "mutated"
}]
```

---

## Step 4: Create Service

Create the Three-Body signature service with description and sales item.

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "three_body_signature_service",
      "type_parameter": "0x2::wow::WOW",
      "permission": "three_body_permission",
      "tags": ["signature", "book", "three-body"],
      "onChain": false
    },
    "description": "Three-Body author book signature service. Provide a message up to 10 characters, and the author will sign your book. Process: 1.Book Delivery 2.Signature Completion. Fee: 888.",
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "Three-Body Book Signature",
          "price": 888,
          "stock": 100,
          "suspension": false,
          "wip": "https://github.com/wowok-ai/docs/blob/main/wip-examples/three_body.wip",
          "wip_hash": "sha256:1db6dc86d8be68bafb33418628a30e7bfcbce48de9c099d3d9cb21def3af8b43"
        }
      ]
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
  "type": "Service",
  "object": "0xcbea374b83f05a81e6557057a3d1c39a28cc2accf705a0c49ed7341e57e13754",
  "version": "1181986",
  "change": "created"
}]
```

---

## Step 5: Configure Machine

Bind the published Machine to the Service.

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service",
    "machine": "three_body_machine"
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
  "object": "0xcbea374b83f05a81e6557057a3d1c39a28cc2accf705a0c49ed7341e57e13754",
  "version": "1182212",
  "change": "mutated"
}]
```

---

## Step 6: Set Buy Guard

Configure the Buy Guard to restrict purchases to the author only.

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service",
    "buy_guard": "three_body_buy_guard"
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
  "object": "0xcbea374b83f05a81e6557057a3d1c39a28cc2accf705a0c49ed7341e57e13754",
  "version": "1182407",
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
    "object": "three_body_signature_service",
    "order_allocators": {
      "description": "Three-Body signature service fund allocation - 100% to author",
      "threshold": 0,
      "allocators": [
        {
          "guard": "three_body_buy_guard",
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
  "type": "Service",
  "object": "0xcbea374b83f05a81e6557057a3d1c39a28cc2accf705a0c49ed7341e57e13754",
  "version": "1182408",
  "change": "mutated"
}]
```

---

## Step 8: Publish Service

Publish the service to make it available for orders.

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "three_body_signature_service",
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
  "object": "0xcbea374b83f05a81e6557057a3d1c39a28cc2accf705a0c49ed7341e57e13754",
  "version": "1182409",
  "change": "mutated"
}]
```

---

## Step 9: Verify Service Configuration

Query the service to verify all configurations.

**Request**:
```json
{
  "operation_type": "query_toolkit",
  "data": {
    "query_type": "onchain_objects",
    "objects": ["three_body_signature_service"],
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
  "object": "0xcbea374b83f05a81e6557057a3d1c39a28cc2accf705a0c49ed7341e57e13754",
  "type": "Service",
  "description": "Three-Body author book signature service. Provide a message up to 10 characters, and the author will sign your book. Process: 1.Book Delivery 2.Signature Completion. Fee: 888.",
  "sales": [
    {
      "name": "Three-Body Book Signature",
      "stock": "100",
      "suspension": false,
      "price": "888",
      "wip": "https://github.com/wowok-ai/docs/blob/main/wip-examples/three_body.wip",
      "wip_hash": "1db6dc86d8be68bafb33418628a30e7bfcbce48de9c099d3d9cb21def3af8b43"
    }
  ],
  "buy_guard": null,
  "machine": null,
  "bPublished": false,
  "bPaused": true,
  "permission": "0x276761c3fee4f0c5e04d309e060c943ad57f8b3f66ff0da60849b38ea210b77b"
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
    "object": "three_body_signature_service",
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
        "name": "three_body_order_v2"
      },
      "namedNewProgress": {
        "name": "three_body_progress_v2"
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
    "object": "three_body_signature_service",
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
| Permission | three_body_permission | `0x276761c3fee4f0c5e04d309e060c943ad57f8b3f66ff0da60849b38ea210b77b` | 1170413 |
| Buy Guard | three_body_buy_guard | `0x7cae6fceef01b57a5d9117afb8396274e4e5d161514ef052962e99eca74a9f42` | 1180407 |
| Machine | three_body_machine | `0x1189627fcef5c94495211f13f3b84732910584e966144dbcbc6837dadeed5700` | 1181011 |
| Service | three_body_signature_service | `0xcbea374b83f05a81e6557057a3d1c39a28cc2accf705a0c49ed7341e57e13754` | 1182409 |

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
  - Good: `three_body_permission`, `three_body_buy_guard`, `three_body_machine`
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

### 8. 最好让AI帮你管理对象命名，你只需要指定规则即可

### 9. Query Toolkit is Your Best Friend

**Use queries constantly**:
- Verify objects exist
- Check configurations
- Debug issues
- Confirm state changes

The `query_toolkit` is essential for validating every step of the way.
