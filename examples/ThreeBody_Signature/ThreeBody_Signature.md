# Three-Body Author Signature Service

A complete example demonstrating how to create a service for book signing by the Three-Body author. This service allows customers to request a personalized message (up to 10 characters) on their book, signed by the author.

---

## Overview

This example demonstrates:

1. **Service with Buy Guard**: Only the service creator (author) can purchase this service
2. **Machine Workflow**: Two-node process (Book Delivery → Signature Completion)
3. **No WIP Required**: Sales items can be created without WIP files (empty wip/wip_hash)
4. **Service Description Only**: Minimal configuration with just description

### Key Design Decisions

1. **Buy Guard Protection**: Only the author (`three_body_author`) can purchase this service, preventing unauthorized usage
2. **Simple Two-Node Workflow**: Clear progression from delivery to completion
3. **No WIP Files**: Using empty wip/wip_hash for simpler setup
4. **Fixed Price**: 888 WOW tokens for the signature service

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

**Expected Result**:
```json
{
  "address": "0xda123833e96e734815f2f57d52ad463681635c6678cfe113c77dbeee49d7865c",
  "balance": {
    "coinType": "0x2::wow::WOW",
    "totalBalance": "4904827508"
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
      "name": "three_body_perm_v2"
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
  "object": "0x6083f41d76e4cef973ae805070258f29163ed1fa323caf8819c7d441c798b3ca",
  "version": "1182419",
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

**Expected Result**:
```json
[{
  "type": "Guard",
  "object": "0xefa22a6b03f947e2c3b2393eb871a4e8b50726e75aecbbadc079f8e8a12f7d5f",
  "version": "1366531",
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
      "permission": "three_body_perm_v2"
    },
    "description": "Three-Body signature service workflow: Book Delivery -> Signature Completion"
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
  "object": "0x676cb1859a832a5bb41b0627b2c76c42f51380b347c81b27aff6ff2e8af1b4d6",
  "version": "1366783",
  "change": "created"
}]
```

### Add Workflow Nodes

**Request**:
```json
{
  "operation_type": "machine",
  "data": {
    "object": "three_body_machine_v2",
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

**Expected Result**:
```json
[{
  "type": "Machine",
  "object": "0x676cb1859a832a5bb41b0627b2c76c42f51380b347c81b27aff6ff2e8af1b4d6",
  "version": "1366784",
  "change": "mutated"
}]
```

### Publish Machine

**Request**:
```json
{
  "operation_type": "machine",
  "data": {
    "object": "three_body_machine_v2",
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
  "object": "0x676cb1859a832a5bb41b0627b2c76c42f51380b347c81b27aff6ff2e8af1b4d6",
  "version": "1366785",
  "change": "mutated"
}]
```

---

## Step 4: Create Service

Create the Three-Body signature service with description and sales item (no WIP required).

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "three_body_signature_service_v2",
      "type_parameter": "0x2::wow::WOW",
      "permission": "three_body_perm_v2",
      "tags": ["signature", "book", "three-body"],
      "onChain": false
    },
    "description": "Three-Body author book signature service. Provide a message up to 10 characters, and the author will sign your book. Process: 1.Book Delivery 2.Signature Completion. Fee: 888 WOW.",
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "Three-Body Book Signature",
          "price": 888000000000,
          "stock": 100,
          "suspension": false,
          "wip": "",
          "wip_hash": ""
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

**Expected Result**:
```json
[{
  "type": "Service",
  "object": "0xbc698c64f53582648a3743642045a942d938d4bdba80245b930b3c6fec2196ac",
  "version": "1367470",
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
    "object": "three_body_signature_service_v2",
    "machine": "three_body_machine_v2"
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
  "object": "0xbc698c64f53582648a3743642045a942d938d4bdba80245b930b3c6fec2196ac",
  "version": "1367660",
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
    "object": "three_body_signature_service_v2",
    "buy_guard": "three_body_buy_guard_v2"
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
  "object": "0xbc698c64f53582648a3743642045a942d938d4bdba80245b930b3c6fec2196ac",
  "version": "1367877",
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
  "type": "Service",
  "object": "0xbc698c64f53582648a3743642045a942d938d4bdba80245b930b3c6fec2196ac",
  "version": "1367878",
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
    "object": "three_body_signature_service_v2",
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
  "object": "0xbc698c64f53582648a3743642045a942d938d4bdba80245b930b3c6fec2196ac",
  "version": "1367879",
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
    "objects": ["three_body_signature_service_v2"],
    "no_cache": true
  },
  "env": {
    "network": "testnet"
  }
}
```

**Expected Result**:
```json
{
  "object": "0xbc698c64f53582648a3743642045a942d938d4bdba80245b930b3c6fec2196ac",
  "type": "Service",
  "description": "Three-Body author book signature service...",
  "sales": [{
    "name": "Three-Body Book Signature",
    "price": "888000000000",
    "stock": "100"
  }],
  "buy_guard": "0xefa22a6b03f947e2c3b2393eb871a4e8b50726e75aecbbadc079f8e8a12f7d5f",
  "machine": "0x676cb1859a832a5bb41b0627b2c76c42f51380b347c81b27aff6ff2e8af1b4d6",
  "bPublished": true,
  "bPaused": false
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
          "balance": 888000000000
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

**Expected Result**:
```json
[{
  "type": "Service",
  "object": "0xbc698c64f53582648a3743642045a942d938d4bdba80245b930b3c6fec2196ac",
  "version": "1370241",
  "change": "mutated"
}]
```

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
          "balance": 888000000000
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

**Expected Result**:
```
Error: Dry run failed... MoveAbort... passport... result_for_guard... 7
```

This error indicates the Buy Guard rejected the purchase because the signer is not the author.

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
3. **No WIP Required**: Sales items can use empty wip/wip_hash
4. **Service Configuration**: Complete setup from creation to publication

### Key Object IDs (Actual)

| Object | Name | ID | Version |
|--------|------|-----|---------|
| Permission | three_body_perm_v2 | `0x6083f41d76e4cef973ae805070258f29163ed1fa323caf8819c7d441c798b3ca` | 1182419 |
| Buy Guard | three_body_buy_guard_v2 | `0xefa22a6b03f947e2c3b2393eb871a4e8b50726e75aecbbadc079f8e8a12f7d5f` | 1366531 |
| Machine | three_body_machine_v2 | `0x676cb1859a832a5bb41b0627b2c76c42f51380b347c81b27aff6ff2e8af1b4d6` | 1366785 |
| Service | three_body_signature_service_v2 | `0xbc698c64f53582648a3743642045a942d938d4bdba80245b930b3c6fec2196ac` | 1370241 |

---

## Design Notes

### Why Buy Guard?

The Buy Guard ensures only the intended user (the author) can purchase this service. This is useful when:
- The service is an internal tool
- Purchase authorization requires verification
- The service is part of a larger workflow controlled by a specific entity

### No WIP Files

This example uses empty wip/wip_hash for sales items because:
- Simpler setup for testing
- WIP validation is skipped when wip is empty string
- Suitable for internal/controlled services

### Workflow Design

The two-node workflow provides clear tracking:
1. **Book Delivered**: Confirms physical delivery of the book
2. **Signature Completed**: Confirms the author has signed the book

Each node transition requires the author's confirmation, ensuring accountability.
