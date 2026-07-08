# Three-Body Author Signature Service

A complete example demonstrating how to create a service for book signing by the Three-Body author. This service allows customers to request a personalized message (up to 10 characters) on their book, signed by the author.

---

## Overview

This example demonstrates:

**Service with Buy Guard**: The buy_guard allows you to define various conditions for users to purchase products, such as identity verification, completing KYC, or being on an allowlist. In this example, only the service creator (author) can purchase this service.

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
  "query_type": "account_balance",
  "name_or_address": "three_body_author",
  "balance": true,
  "network": "testnet"
}
```

**Expected Result** (if account has balance):
```json
{
  "address": "0x...",
  "balance": {
    "coinType": "0x2::wow::WOW",
    "totalBalance": "1000000000"
  }
}
```

**If no balance, use Faucet**:

**Request**:
```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "three_body_author"
  }
}
```

**Expected Result**:
```json
{
  "faucet": {
    "name_or_address": "three_body_author",
    "result": [
      {"amount": 1000000000, "id": "0x..."},
      {"amount": 1000000000, "id": "0x..."},
      {"amount": 1000000000, "id": "0x..."}
    ],
    "network": "testnet"
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
      "name": "three_body_permission",
      "replaceExistName": true
    },
    "description": "Permission for Three-Body Signature Service",
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

**Expected Result**:
```json
[{
  "type": "Permission",
  "object": "0x...",
  "version": "...",
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
      "tags": ["signature", "book", "buy-guard"],
      "replaceExistName": true
    },
    "description": "Verify buyer is the service creator (three_body_author). Only the author can purchase this signature service.",
    "table": [
      {
        "identifier": 0,
        "b_submission": false,
        "value_type": "Address",
        "value": "three_body_author",
        "name": "Author address"
      }
    ],
    "root": {
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
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

> **Note**: The Guard uses a `table` to define constant values with identifiers, then references them in the `root` logic using `identifier` node type. The `root` is a direct GuardNode (no wrapper).

**Expected Result**:
```json
[{
  "type": "Guard",
  "object": "0x...",
  "version": "...",
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
      "permission": "three_body_permission",
      "replaceExistName": true
    },
    "description": "Three-Body signature service workflow: Book Delivery -> Signature Completion",
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

**Expected Result**:
```json
[{
  "type": "Machine",
  "object": "0x...",
  "version": "...",
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
      "name": "three_body_signature_service",
      "type_parameter": "0x2::wow::WOW",
      "permission": "three_body_permission",
      "replaceExistName": true
    },
    "description": "Three-Body author book signature service. Provide a message up to 10 characters, and the author will sign your book. Process: 1.Book Delivery 2.Signature Completion. Fee: 888.",
    "publish": false
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Expected Result**:
```json
[{
  "type": "Service",
  "object": "0x...",
  "version": "...",
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
    "object": "three_body_signature_service",
    "machine": "three_body_machine"
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Expected Result**:
```json
[{
  "type": "Service",
  "object": "0x...",
  "version": "...",
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

**Expected Result**:
```json
[{
  "type": "Service",
  "object": "0x...",
  "version": "...",
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
    },
    "customer_required": ["phone", "email", "shipping_address"]
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Expected Result**:
```json
[{
  "type": "Service",
  "object": "0x...",
  "version": "...",
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
    "object": "three_body_signature_service",
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

**Expected Result**:
```json
[{
  "type": "Service",
  "object": "0x...",
  "version": "...",
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
    "object": "three_body_signature_service",
    "pause": false
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Expected Result**:
```json
[{
  "type": "Service",
  "object": "0x...",
  "version": "...",
  "change": "mutated"
}]
```

---

## Step 10: Verify Service Configuration

Query the service to verify all configurations.

**Request**:
```json
{
  "query_type": "onchain_objects",
  "objects": ["three_body_signature_service"],
  "no_cache": true,
  "network": "testnet"
}
```

**Expected Result**:
```json
{
  "object": "three_body_signature_service",
  "type": "Service",
  "description": "Three-Body author book signature service. Provide a message up to 10 characters, and the author will sign your book. Process: 1.Book Delivery 2.Signature Completion. Fee: 888.",
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
  "buy_guard": "three_body_buy_guard",
  "machine": "three_body_machine",
  "bPublished": true,
  "bPaused": false,
  "customer_required": ["phone", "email", "shipping_address"],
  "permission": "three_body_permission"
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
        "name": "three_body_order",
        "replaceExistName": true
      },
      "namedNewProgress": {
        "name": "three_body_progress",
        "replaceExistName": true
      },
      "namedNewAllocation": {
        "name": "three_body_allocation",
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

**Expected Result**:
```json
[
  {
    "type": "Progress",
    "object": "three_body_progress",
    "version": "...",
    "change": "created"
  },
  {
    "type": "Order",
    "object": "three_body_order",
    "version": "...",
    "change": "created"
  },
  {
    "type": "Allocation",
    "object": "three_body_allocation",
    "version": "...",
    "change": "created"
  }
]
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
    "account": "three_body_customer",
    "network": "testnet"
  }
}
```

**Expected Result** (Error):
```json
{
  "error": "Transaction resolution failed: MoveAbort in 8th command, abort code: 7 (Verify failed), in '0x2::passport::result_for_guard'"
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
    "object": "three_body_progress",
    "operate": {
      "operation": {
        "next_node_name": "Book Delivered",
        "forward": "Confirm Delivery"
      }
    }
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet"
  }
}
```

**Expected Result**:
```json
[{
  "type": "Progress",
  "object": "three_body_progress",
  "version": "...",
  "change": "mutated"
}]
```

### Node 2: Signature Completed

The author completes the signature.

> **Important**: Use `no_cache: true` in the `env` for sequential Progress operations on the same object. This ensures the SDK reads the latest on-chain state (including the updated `current` node) instead of using a cached version.

**Request**:
```json
{
  "operation_type": "progress",
  "data": {
    "object": "three_body_progress",
    "operate": {
      "operation": {
        "next_node_name": "Signature Completed",
        "forward": "Complete Signature"
      }
    }
  },
  "env": {
    "account": "three_body_author",
    "network": "testnet",
    "no_cache": true
  }
}
```

**Expected Result**:
```json
[{
  "type": "Progress",
  "object": "three_body_progress",
  "version": "...",
  "change": "mutated"
}]
```

---

## Summary

This example demonstrates:

1. **Buy Guard Implementation**: Restricts service purchases to specific accounts
2. **Machine Workflow**: Two-node process for service delivery tracking
3. **WIP Files Optional**: Sales items can use WIP files or empty strings
4. **Service Configuration**: Complete setup from creation to publication

### Key Objects

| Object | Name |
|--------|------|
| Permission | three_body_permission |
| Buy Guard | three_body_buy_guard |
| Machine | three_body_machine |
| Service | three_body_signature_service |
| Order | three_body_order |
| Allocation | three_body_allocation |
| Progress | three_body_progress |

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

### Best Practices

1. **Naming Strategy**: Use consistent naming conventions and `replaceExistName: true` to enforce name usage. All operations use names instead of addresses for readability.

2. **Execution Order Matters**: Publish operations lock objects. Follow this order:
   - Permission first (foundation)
   - Machine (create workflow before service)
   - Service (unpublished)
   - Guards (need Service address for verification logic)
   - Configure Service (add machine, buy_guard, order_allocators)
   - Publish Service (LAST - once published, many changes are blocked)

3. **Use `no_cache: true` for Sequential Operations**: When performing multiple operations on the same object in sequence (especially Progress workflow advancement), always set `no_cache: true` in the `env` to ensure the SDK reads the latest on-chain state.

4. **Query Toolkit is Your Best Friend**: Use queries constantly to verify objects exist, check configurations, debug issues, and confirm state changes.
