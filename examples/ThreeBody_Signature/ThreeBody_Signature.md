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

1. **Account Setup**: The `three_body_author` and `three_body_customer` accounts with sufficient WOW tokens
2. **Minimum Balance**: At least 1000 WOW for gas fees and service creation

### Step 0a: Generate Accounts

If the accounts do not exist locally, generate them first.

**Request (generate author account)**:
```json
{
  "gen": {
    "name": "three_body_author",
    "replaceExistName": true
  }
}
```

**Request (generate customer account)**:
```json
{
  "gen": {
    "name": "three_body_customer",
    "replaceExistName": true
  }
}
```

**Expected Result**:
```json
{
  "gen": {
    "address": "0x...",
    "name": "three_body_author"
  }
}
```

### Step 0b: Check Account Balance

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
  "result": {
    "query_type": "account_balance",
    "result": {
      "address": "0x...",
      "name_or_address": "three_body_author",
      "balance": {
        "coinType": "0x2::wow::WOW",
        "coinObjectCount": 3,
        "totalBalance": "3000000000",
        "lockedBalance": {},
        "fundsInAddressBalance": "0"
      }
    }
  }
}
```

### Step 0c: Fund Accounts via Faucet (If No Balance)

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
      {
        "amount": 1000000000,
        "id": "0x...",
        "transferTxDigest": "..."
      },
      {
        "amount": 1000000000,
        "id": "0x...",
        "transferTxDigest": "..."
      },
      {
        "amount": 1000000000,
        "id": "0x...",
        "transferTxDigest": "..."
      }
    ],
    "network": "testnet"
  }
}
```

> **Note**: Each faucet result item includes a `transferTxDigest` field representing the on-chain transaction digest for the faucet transfer. This is useful for tracking and verifying the faucet transaction on a block explorer.

> **Important**: Repeat the faucet request for `three_body_customer` as well, since Test 2 requires a funded non-author account to attempt the blocked purchase.

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
    "network": "testnet",
    "confirmed": true
  }
}
```

> **Permission Index Explanation**:
> - **`1000`–`1009`**: User-defined permission indexes (starting from `USER_DEFINED_PERM_INDEX_START = 1000`). In this example, `1000` is used for the "Confirm Delivery" forward and `1001` for the "Complete Signature" forward in the Machine workflow (see Step 3). The remaining indexes (`1002`–`1009`) are reserved for future workflow extensions.
> - **`306`**: The built-in `SERVICE_MACHINE` permission (Service module permission index `306`), which authorizes binding a Machine to a Service. This is required in Step 5 (Configure Machine) where the Machine is bound to the Service.
>
> See `BuiltinPermissionIndex` in `ts-sdk/packages/wowok/src/w/call/permission.ts` for the full list of built-in permission indexes.

> **Important**: `env.confirmed: true` is required because `replaceExistName: true` triggers a confirmation prompt (it unbinds any existing name). Without `confirmed: true`, the operation will be blocked pending user confirmation. This applies to all subsequent steps using `replaceExistName: true` or `publish: true`.

**Expected Result**:
```json
[
  {
    "type": "Permission",
    "type_raw": "0x2::permission::Permission",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "created"
  },
  {
    "type": "TableItem_PermissionPerm",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::parent_linked_table::Node<address, vector<u16>>>",
    "object": "0x...",
    "version": "...",
    "owner": {"ObjectOwner": "0x..."},
    "change": "created"
  }
]
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
    "network": "testnet",
    "confirmed": true
  }
}
```

> **Note**: The Guard uses a `table` to define constant values with identifiers, then references them in the `root` logic using `identifier` node type. The `root` is a direct GuardNode (no wrapper).

> **Important**: `env.confirmed: true` is required because `replaceExistName: true` triggers a confirmation prompt.

**Expected Result**:
```json
[
  {
    "type": "Guard",
    "type_raw": "0x2::guard::Guard",
    "object": "0x...",
    "version": "...",
    "owner": "Immutable",
    "change": "created"
  }
]
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
    "network": "testnet",
    "confirmed": true
  }
}
```

> **Important**: `env.confirmed: true` is required because `replaceExistName: true` triggers a confirmation prompt. Additionally, `publish: true` on the Machine is an irreversible operation.

**Expected Result**:
```json
[
  {
    "type": "TableItem_MachineNode",
    "type_raw": "0x2::dynamic_field::Field<0x1::string::String, 0x2::parent_linked_table::Node<0x1::string::String, vector<0x2::machine::NodePair>>>",
    "object": "0x...",
    "version": "...",
    "owner": {"ObjectOwner": "0x..."},
    "change": "created"
  },
  {
    "type": "TableItem_MachineNode",
    "type_raw": "0x2::dynamic_field::Field<0x1::string::String, 0x2::parent_linked_table::Node<0x1::string::String, vector<0x2::machine::NodePair>>>",
    "object": "0x...",
    "version": "...",
    "owner": {"ObjectOwner": "0x..."},
    "change": "created"
  },
  {
    "type": "Machine",
    "type_raw": "0x2::machine::Machine",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "created"
  },
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x...",
    "version": "...",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "created"
  }
]
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
    "network": "testnet",
    "confirmed": true
  }
}
```

> **Important**: `env.confirmed: true` is required because `replaceExistName: true` triggers a confirmation prompt.

**Expected Result**:
```json
[
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x...",
    "version": "...",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "mutated"
  },
  {
    "type": "Service",
    "type_raw": "0x2::service::Service<0x2::wow::WOW>",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "created"
  }
]
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
[
  {
    "type": "Service",
    "type_raw": "0x2::service::Service<0x2::wow::WOW>",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "mutated"
  },
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x...",
    "version": "...",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "created"
  }
]
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
[
  {
    "type": "Service",
    "type_raw": "0x2::service::Service<0x2::wow::WOW>",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "mutated"
  },
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x...",
    "version": "...",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "created"
  }
]
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
[
  {
    "type": "Service",
    "type_raw": "0x2::service::Service<0x2::wow::WOW>",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "mutated"
  }
]
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
    "network": "testnet",
    "confirmed": true
  }
}
```

> **Important**: `env.confirmed: true` is **critical** here because `publish: true` is an irreversible operation that locks the `machine` and `order_allocators` fields. The server will block the transaction with a "Publish confirmation (irreversible lock)" prompt until `confirmed: true` is provided.

**Expected Result**:
```json
[
  {
    "type": "Service",
    "type_raw": "0x2::service::Service<0x2::wow::WOW>",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "mutated"
  }
]
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
[
  {
    "type": "Service",
    "type_raw": "0x2::service::Service<0x2::wow::WOW>",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "mutated"
  }
]
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
  "result": {
    "query_type": "onchain_objects",
    "result": {
      "objects": [
        {
          "object": "0x...",
          "type": "Service",
          "type_raw": "0x2::service::Service<0x2::wow::WOW>",
          "owner": {"Shared": {"initial_shared_version": "..."}},
          "version": "...",
          "previousTransaction": "...",
          "description": "Three-Body author book signature service. Provide a message up to 10 characters, and the author will sign your book. Process: 1.Book Delivery 2.Signature Completion. Fee: 888.",
          "location": "",
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
          "repositories": [],
          "buy_guard": "0x...",
          "machine": "0x...",
          "bPublished": true,
          "bPaused": false,
          "customer_required": ["phone", "email", "shipping_address"],
          "arbitrations": [],
          "compensation_fund": "0",
          "paused_time": null,
          "setting_lock_duration": "2592000000",
          "order_allocators": {
            "description": "Three-Body signature service fund allocation - 100% to author",
            "threshold": "0",
            "allocators": [
              {
                "guard": "0x...",
                "sharing": [
                  {
                    "who": {"Signer": null},
                    "sharing": "10000",
                    "mode": 1
                  }
                ],
                "fix": "0",
                "max": null
              }
            ]
          },
          "rewards": [],
          "um": null,
          "permission": "0x...",
          "cache_expire": 1234567890,
          "query_name": "three_body_signature_service"
        }
      ]
    }
  }
}
```

> **Field Reference**:
> - **`buy_guard`**, **`machine`**, **`permission`**: Return **on-chain object IDs** (not names). The on-chain data stores raw object IDs; resolving them back to local mark names requires a separate reverse lookup that is not performed by `onchain_objects` queries.
> - **`query_name`**: The original name string passed in the query request (here, `"three_body_signature_service"`). This is automatically populated by the SDK from the input `objects` array, so you can identify which queried name corresponds to which returned object.
> - **`order_allocators.allocators[].sharing[].who`**: `{"Signer": null}` indicates the recipient is the order signer (the buyer). The `null` value is the on-chain representation; the input used `"signer"` as a placeholder.
> - **`order_allocators.allocators[].sharing[].mode`**: `1` is the numeric enum for `Rate` mode (input accepts the string `"Rate"`, output returns the numeric `1`).
> - **`order_allocators.allocators[].fix`** and **`max`**: Additional fields returned on-chain (default `"0"` and `null` respectively) that are not part of the input schema but are present in the on-chain data structure.

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
    "type": "Service",
    "type_raw": "0x2::service::Service<0x2::wow::WOW>",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "mutated"
  },
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x...",
    "version": "...",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "mutated"
  },
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x...",
    "version": "...",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "mutated"
  },
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x...",
    "version": "...",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "created"
  },
  {
    "type": "Allocation",
    "type_raw": "0x2::allocation::Allocation<0x2::wow::WOW>",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "created"
  },
  {
    "type": "Order",
    "type_raw": "0x2::order::Order",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "created"
  },
  {
    "type": "Progress",
    "type_raw": "0x2::progress::Progress",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "created"
  }
]
```

> **Why So Many Objects? (Information Injection Design)**
>
> The `order_new` operation intentionally returns ALL objects affected by the transaction, not just the primary created objects. This is a deliberate "information injection" design so callers get a complete view of the state changes:
>
> 1. **`Service` (mutated)**: The service's inventory/stock is decremented as a side effect of the purchase.
> 2. **`TableItem_EntityLinker` ×3 (mutated/created)**: The order process links the buyer, the service, and the buy_guard entities via the on-chain `EntityLinker` registrar (owner `0xaaa`). These are the entity-graph edges created/updated by the order.
> 3. **`Allocation` (created)**: The fund allocation object that will distribute the payment according to `order_allocators`.
> 4. **`Order` (created)**: The primary order object tracking the purchase.
> 5. **`Progress` (created)**: The workflow progress object tracking the order through the Machine nodes.
>
> The returned objects use **on-chain object IDs** (not the names assigned via `namedNewOrder`/`namedNewProgress`/`namedNewAllocation`). To resolve an object ID back to its local mark name, use the `query_toolkit` with `query_type: "local_names"` and pass the addresses array.
>
> The return order reflects the transaction's execution order: Service (inventory update) → EntityLinker (entity graph edges) → Allocation → Order → Progress, following the dependency chain of object creation.

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
```
Error: Error Description: Verification failed
Transaction resolution failed: MoveAbort in 8th command, abort code: 7 (Verify failed), in '0x0000000000000000000000000000000000000000000000000000000000000002::passport::result_for_guard' (instruction 17)
```

> **Error Format Explained (Information Injection Design)**
>
> The error response is intentionally enriched with detailed diagnostic information via the `enrichMoveError` function in the SDK. This is a deliberate "information injection" design so callers can precisely diagnose failures without needing to replay the transaction:
>
> - **`Error: ` prefix**: Added by the MCP handler (`handler.ts`) to mark the response as an error.
> - **`Error Description: Verification failed`**: A human-readable classification of the error category, generated by the `classifyError` logic.
> - **`Transaction resolution failed: MoveAbort in 8th command`**: The raw Sui SDK error indicating which transaction command (8th) aborted.
> - **`abort code: 7 (Verify failed)`**: The Move abort code (7) translated to its semantic meaning (`Verify failed`).
> - **`0x0000...0002::passport::result_for_guard`**: The fully-qualified module path using the 64-character hex address form (the Sui SDK returns the full canonical form, not the short `0x2` shorthand).
> - **`(instruction 17)`**: The specific instruction index within the Move function where the abort occurred.
>
> The error is returned as a **plain text string** (not a JSON object), because it combines multiple layers of diagnostic information from different sources (Sui SDK, Move VM, MCP handler). Callers detecting errors should check for the `Error:` prefix or use the `isError` flag on the MCP response.

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
    "network": "testnet",
    "no_cache": true
  }
}
```

> **Tip**: Although `no_cache: true` is most critical for the second Progress operation (Node 2), it is recommended to use it for **all** sequential Progress operations on the same object to ensure the SDK always reads the latest on-chain state.

**Expected Result**:
```json
[
  {
    "type": "Progress",
    "type_raw": "0x2::progress::Progress",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "mutated"
  },
  {
    "type": "TableItem_ProgressHistory",
    "type_raw": "0x2::dynamic_field::Field<u64, 0x2::progress::History>",
    "object": "0x...",
    "version": "...",
    "owner": {"ObjectOwner": "0x..."},
    "change": "created"
  }
]
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
[
  {
    "type": "Progress",
    "type_raw": "0x2::progress::Progress",
    "object": "0x...",
    "version": "...",
    "owner": {"Shared": {"initial_shared_version": "..."}},
    "change": "mutated"
  },
  {
    "type": "TableItem_ProgressHistory",
    "type_raw": "0x2::dynamic_field::Field<u64, 0x2::progress::History>",
    "object": "0x...",
    "version": "...",
    "owner": {"ObjectOwner": "0x..."},
    "change": "created"
  }
]
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

3. **Use `confirmed: true` for Irreversible/Destructive Operations**: The MCP server enforces a two-phase confirmation for safety. You MUST add `"confirmed": true` to the `env` for:
   - Any operation using `replaceExistName: true` (unbinds existing names)
   - Any `publish: true` operation (irreversible lock on Machine/Service)
   Without `confirmed: true`, the server returns a `Confirmation required` warning and blocks the transaction.

4. **Use `no_cache: true` for Sequential Operations**: When performing multiple operations on the same object in sequence (especially Progress workflow advancement), always set `no_cache: true` in the `env` to ensure the SDK reads the latest on-chain state.

5. **Query Toolkit is Your Best Friend**: Use queries constantly to verify objects exist, check configurations, debug issues, and confirm state changes.

6. **Object IDs vs Names in Responses**: On-chain query responses return **object IDs** (e.g., `0x8202...`) for cross-object references like `buy_guard`, `machine`, `permission`. The `query_name` field in the response echoes back the original query input name. To resolve object IDs back to local mark names, use `query_toolkit` with `query_type: "local_names"`.

7. **Information Injection in Transaction Responses**: Mutation/creation operations return ALL objects affected by the transaction (including side effects like `TableItem_EntityLinker` and `TableItem_ProgressHistory`), not just the primary target. This is a deliberate design for transparency. The return order reflects the transaction's execution order.
