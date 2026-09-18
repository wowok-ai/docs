# Three-Body Author Signature Service

A complete example demonstrating how to create a service for book signing by the Three-Body author. This service allows customers to request a personalized message (up to 10 characters) on their book, signed by the author.

---

## ⚠️ Running Principle

> **Run the example in full every time (repeatable).** This example uses `replaceExistName: true` on all object creations — each run generates new objects with new addresses. If you skip build steps, operations may silently act on orphaned objects from previous runs, producing incorrect results. Old objects' configurations do not reflect the current document version.

- **Execution order**: Run all build/setup steps (including account generation) in sequence before testing any customer order flow. Do not skip steps — each depends on objects created by prior steps.
- **Prerequisites**: `three_body_author` and `three_body_customer` with sufficient WOW for gas (≥ 1000 WOW recommended). All on-chain operations require `env.confirmed: true`.

### 🔐 Two-Step Confirmation Flow (Production Safety)

This example sets `env.confirmed: true` on irreversible operations (e.g., `publish: true` on Machine) for brevity. In real deployments, follow the two-step flow enforced by the ConfirmGate safety layer:

1. **Phase 1 — Preview**: Call the tool **without** `env.confirmed`. The server returns `{ status: "pending_confirmation", confirmation_text: "..." }` containing the full operation summary, risk assessment, and irreversible-action warnings.
2. **Phase 2 — Confirm**: Review `confirmation_text` with the user. Only after explicit user approval, call the tool again **with** `env.confirmed: true` to actually execute the on-chain transaction.

> Skipping Phase 1 means the user never sees the risk summary before gas is spent. Always preview first, then confirm. This is especially critical for the two `publish: true` steps in this doc: the Machine publish (**Step 3**), which irreversibly locks the workflow definition (`nodes`/`pairs`/`forwards`), and the Service publish (**Step 11**), which irreversibly locks the `machine` and `order_allocators` fields.

> **💡 Call Format**: All WoWok operations go through a single unified `wowok` tool. The AI calls `wowok({ tool: "<sub-tool>", data: {<params>} })`. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](../../docs/response-format.md) for details.
>
> **📄 Expected Results**: The Expected Result envelopes below omit the optional `message` and `semantic` fields (human-readable summary / business semantic summary) for brevity — real responses may include them.

---

## Overview

This example demonstrates:

**Service with Buy Guard**: The buy_guard allows you to define various conditions for users to purchase products, such as identity verification, completing KYC, or being on an allowlist. In this example, only the service creator (author) can purchase this service.

### Key Design Decisions

1. **Buy Guard Protection**: Only the author (`three_body_author`) can purchase this service, preventing unauthorized usage
2. **Simple Two-Node Workflow**: Clear progression from delivery to completion
3. **WIP Files Optional**: Can use WIP files or empty strings
4. **Fixed Price**: 888 WOW for the signature service

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
  "tool": "account_operation",
  "data": {
    "gen": {
      "name": "three_body_author",
      "replaceExistName": true
    }
  }
}
```

**Request (generate customer account)**:
```json
{
  "tool": "account_operation",
  "data": {
    "gen": {
      "name": "three_body_customer",
      "replaceExistName": true
    }
  }
}
```

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "gen": {
        "address": "0x...",
        "name": "three_body_author"
      }
    }
  },
  "schema": null
}
```

### Step 0b: Check Account Balance

**Request**:
```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "account_balance",
    "name_or_address": "three_body_author",
    "balance": true,
    "network": "testnet"
  }
}
```

**Expected Result** (if account has balance):
```json
{
  "result": {
    "status": "success",
    "data": {
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
  },
  "schema": null
}
```

### Step 0c: Fund Accounts via Faucet (If No Balance)

**Request**:
```json
{
  "tool": "account_operation",
  "data": {
    "faucet": {
      "network": "testnet",
      "name_or_address": "three_body_author"
    }
  }
}
```

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "faucet": {
        "name_or_address": "three_body_author",
        "result": [
          {
            "amount": 5000000000,
            "id": "0x...",
            "transferTxDigest": "..."
          }
        ],
        "network": "testnet"
      }
    }
  },
  "schema": null
}
```

> **Note**: Each faucet result item includes a `transferTxDigest` field representing the on-chain transaction digest for the faucet transfer. This is useful for tracking and verifying the faucet transaction on a block explorer.
>
> **Amount Note**: Each faucet request distributes **5 WOW** (one coin of `5,000,000,000` smallest units; WOW has 9 decimals, so 1 WOW = 1,000,000,000 smallest units). The amount is decided by the faucet server — the client request (`FixedAmountRequest`) carries no amount field, so it cannot be customized. The faucet is also rate-limited (HTTP 429 on repeated rapid requests), so accumulating large balances via the faucet is impractical (the 888 WOW sale price would need ~178 requests). Fund the accounts from an existing wallet/transfer instead, and use the faucet only for small top-ups.
>
> **Important**: Fund `three_body_customer` as well, since Test 2 requires a funded non-author account to attempt the blocked purchase.

---

## Step 1: Create Permission Object

Create a Permission object to manage the service.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
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
}
```

> **Permission Index Explanation**:
> - **Admin bypass (why this single-account flow works)**: The Permission creator (`three_body_author`) automatically becomes an **admin** of the Permission object, and admins bypass per-index checks — the SDK's permission check only looks up granted indexes when the caller is NOT an admin. So the author can execute every step below even though the granted index list does not enumerate every built-in index used.
> - **`1000`–`1009`**: User-defined permission indexes (starting from `USER_DEFINED_PERM_INDEX_START = 1000`). In this example, `1000` is used for the "Confirm Delivery" forward and `1001` for the "Complete Signature" forward in the Machine workflow (see Step 3). The remaining indexes (`1002`–`1009`) are reserved for future workflow extensions. These grants matter for non-admin operators: a Machine forward checks its `permissionIndex` against the operator's granted indexes (or admin status).
> - **`306`**: The built-in `SERVICE_MACHINE` permission (Service module permission index `306`), which authorizes binding a Machine to a Service (used in Step 5, Configure Machine). It is granted here defensively — the author does not strictly need it thanks to the admin bypass above, but a non-admin operator would.
> - **Full built-in index list a NON-admin operator would need for this example**: Service ops — `305` (SERVICE_SALES), `306` (SERVICE_MACHINE), `307` (SERVICE_BUY_GUARD), `309` (SERVICE_CUSTOMER_INFO_REQUIRED), `310` (SERVICE_PAUSE), `311` (SERVICE_PUBLISH), `313` (SERVICE_ORDER_ALLOCATOR); Machine ops — `200` (MACHINE_NEW), `201` (MACHINE_DESCRIPTION), `205` (MACHINE_PUBLISH), `206` (MACHINE_NODE); Treasury — `250` (TREASURY_NEW), `251` (TREASURY_DESCRIPTION).
>
> See `BuiltinPermissionIndex` in `ts-sdk/packages/wowok/src/w/call/permission.ts` for the full list of built-in permission indexes.

> **Important**: `env.confirmed: true` is required because `replaceExistName: true` triggers a confirmation prompt (it unbinds any existing name). Without `confirmed: true`, the operation will be blocked pending user confirmation. This applies to all subsequent steps using `replaceExistName: true` or `publish: true`.

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
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
      }
    }
  },
  "schema": null
}
```

---

## Step 2: Create Buy Guard

Create a Guard that verifies the buyer is the service creator (author). This ensures only the author can purchase this service.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "guard",
    "data": {
      "namedNew": {
        "name": "three_body_buy_guard",
        "tags": ["signature", "book", "buy-guard", "level1-strict"],
        "replaceExistName": true
      },
      "description": "Verify buyer is the service creator (three_body_author). Only the author can purchase this signature service. VERIFIER CONSTRAINT LEVEL 1 (strict single-identity binding): The author role is permanently tied to a single address. The designer explicitly accepts the lock-in risk because (a) the author is the sole service operator in this minimal example, and (b) Guard immutability guarantees the buyer whitelist cannot be tampered with. R-C4-04 (info): if the author address is lost or rotated, the Guard must be rebuilt and the Service's buy_guard must be re-bound.",
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
}
```

> **Note**: The Guard uses a `table` to define constant values with identifiers, then references them in the `root` logic using `identifier` node type. The `root` is a direct GuardNode (no wrapper).

> **⚠️ Level 1 — Strict Single-Identity Binding (R-C4-04)**: This Guard uses `logic_equal[context(Signer), identifier[0](three_body_author)]` — the strictest verifier constraint level. Only the single fixed author address can pass. The lock-in risk is acceptable here because: (1) the author is the sole operator of this signature service, (2) Guard immutability guarantees the whitelist cannot be tampered with, and (3) the buy_guard can be re-bound on the Service if the author address ever needs rotation (the old Guard is abandoned and a new one is created). For multi-operator scenarios, prefer Level 2 (identity-set binding) instead.

> **Important**: `env.confirmed: true` is required because `replaceExistName: true` triggers a confirmation prompt.

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
          {
            "type": "Guard",
            "type_raw": "0x2::guard::Guard",
            "object": "0x...",
            "version": "...",
            "owner": "Immutable",
            "change": "created"
          }
        ]
      }
    }
  },
  "schema": null
}
```

---

## Step 3: Create Machine with Workflow Nodes

Create a Machine to define the service workflow: Book Delivery → Signature Completion.

### Create Machine

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
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
}
```

> **Important**: `env.confirmed: true` is required because `replaceExistName: true` triggers a confirmation prompt. Additionally, `publish: true` on the Machine is an irreversible operation.

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
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
      }
    }
  },
  "schema": null
}
```

---

## Step 4: Create Service (Unpublished)

Create the Three-Body signature service without publishing. The Service must be unpublished when binding the Machine.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "service",
    "data": {
      "object": {
        "name": "three_body_signature_service",
        "type_parameter": "0x2::wow::WOW",
        "permission": "three_body_permission",
        "replaceExistName": true
      },
      "description": "Three-Body author book signature service. Provide a message up to 10 characters, and the author will sign your book. Process: 1.Book Delivery 2.Signature Completion. Fee: 888 WOW.",
      "publish": false
    },
    "env": {
      "account": "three_body_author",
      "network": "testnet",
      "confirmed": true
    }
  }
}
```

> **Important**: `env.confirmed: true` is required because `replaceExistName: true` triggers a confirmation prompt.

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
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
      }
    }
  },
  "schema": null
}
```

---

## Step 5: Configure Machine

Bind the published Machine to the Service. **Important**: The Service must be unpublished when binding the Machine.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
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
}
```

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
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
      }
    }
  },
  "schema": null
}
```

---

## Step 6: Set Buy Guard

Configure the Buy Guard to restrict purchases to the author only.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
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
}
```

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
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
      }
    }
  },
  "schema": null
}
```

---

## Step 7: Create Treasury Object

Create a Treasury object to aggregate signature service revenue (public funds for the author's operational distribution). The Treasury uses the same Permission as the Service (`three_body_permission`) — this ensures a single consistent permission organization governs both fund collection and service operations.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "treasury",
    "data": {
      "object": {
        "name": "three_body_treasury",
        "type_parameter": "0x2::wow::WOW",
        "permission": "three_body_permission",
        "replaceExistName": true
      },
      "description": "Treasury for aggregating Three-Body signature service revenue (author's public funds for operations and distribution). Uses the same Permission as the Service (three_body_permission) for consistency — a single permission organization governs both fund collection and service operations."
    },
    "env": {
      "account": "three_body_author",
      "network": "testnet",
      "confirmed": true
    }
  }
}
```

> **Treasury-First Rule**: Following the fund-flow design pattern established in the Insurance, MyShop_Advanced, and Travel examples, merchant revenue flows to `three_body_treasury` (not directly to the author's address or the Service address). This:
> 1. **Aggregates public funds** for the author's operational distribution and accounting
> 2. **Makes allocators inherently safe** (R-C3-06) — funds always flow to the fixed Treasury regardless of caller, so no Signer binding is needed in the allocator Guard
> 3. **Uses permission consistency** — Treasury and Service share `three_body_permission`, ensuring unified governance

> **Important**: `env.confirmed: true` is required because `replaceExistName: true` triggers a confirmation prompt.

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
          {
            "type": "Treasury",
            "type_raw": "0x2::treasury::Treasury<0x2::wow::WOW>",
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
      }
    }
  },
  "schema": null
}
```

---

## Step 8: Create Contact Object (Customer-Service Channel)

Create a Contact object to serve as the Service's encrypted customer-service channel. **Whenever `customer_required` is set (e.g. phone/email/shipping address), a Contact MUST be bound via the `um` field** — the customer's private information is delivered exclusively through end-to-end encrypted Messenger, which routes messages to the Contact bound as `um`. Without `um`, there is no channel to receive the customer's privacy-sensitive input and the SDK blocks the call with an invalid parameter error. The Contact uses the same Permission as the Service (`three_body_permission`) for unified governance.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "contact",
    "data": {
      "object": {
        "name": "three_body_contact",
        "permission": "three_body_permission",
        "replaceExistName": true
      },
      "description": "Contact for Three-Body signature service customer info — end-to-end encrypted Messenger channel for delivery of phone/email/shipping_address collected via customer_required."
    },
    "env": {
      "account": "three_body_author",
      "network": "testnet",
      "confirmed": true
    }
  }
}
```

> **Why a Contact is required with customer_required (SDK-enforced hard linkage)**:
> - `customer_required` tells the order flow which private-info labels to collect from the buyer (phone, email, shipping_address, etc.)
> - Those labels are delivered to the merchant ONLY through the end-to-end encrypted Messenger protocol
> - Messenger routes messages to the Service's bound Contact object (the `um` field)
> - Without `um`, the collected private information would be silently dropped — there is no other delivery path
> - The SDK's `checkCustomerRequiredNeedsUm()` validator in `service.ts` (L1226) runs on EVERY service operation that touches `customer_required` AND on `publish: true`, so the constraint cannot be bypassed by splitting into two calls

> **Important**: `env.confirmed: true` is required because `replaceExistName: true` triggers a confirmation prompt.

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
          {
            "type": "Contact",
            "type_raw": "0x2::contact::Contact",
            "object": "0x...",
            "version": "...",
            "owner": {"Shared": {"initial_shared_version": "..."}},
            "change": "created"
          }
        ]
      }
    }
  },
  "schema": null
}
```

---

## Step 9: Create Allocator Guard

Create a dedicated Guard for the order allocator that verifies the order belongs to this service. This is a **Level 3 scene-combined** Guard: no Signer binding is needed because the allocator uses `sharing.who=Entity(three_body_treasury)` — funds always flow to the fixed Treasury regardless of who triggers the allocation.

**Guard Logic**:
```
order.service == three_body_signature_service
```

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "guard",
    "data": {
      "namedNew": {
        "name": "three_body_allocator_guard",
        "tags": ["signature", "book", "allocator", "level3-scene-combined"],
        "replaceExistName": true
      },
      "description": "Allocator guard for Three-Body signature service: verifies order.service == three_body_signature_service to prevent cross-service theft (R-C3-05). VERIFIER CONSTRAINT LEVEL 3 (scene-combined): No Signer binding needed because the allocator uses sharing.who=Entity(three_body_treasury) — funds always flow to the Treasury regardless of caller (R-C3-06 safe).",
      "table": [
        {
          "identifier": 0,
          "b_submission": true,
          "value_type": "Address",
          "name": "Order ID (submitted at runtime)"
        },
        {
          "identifier": 1,
          "b_submission": false,
          "value_type": "Address",
          "value": "three_body_signature_service",
          "name": "Service address (this service)"
        }
      ],
      "root": {
        "type": "logic_equal",
        "nodes": [
          {
            "type": "query",
            "query": "order.service",
            "object": {"identifier": 0},
            "parameters": []
          },
          {
            "type": "identifier",
            "identifier": 1
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
}
```

**Guard Explanation (Service Ownership Check — Level 3 Scene-Combined):**
- **Table Item 0**: Order address (submitted at runtime, `b_submission: true`) — the order being allocated
- **Table Item 1**: Constant address `three_body_signature_service` (this service's on-chain address)
- **Root**: `logic_equal[query("order.service"), identifier[1]]` — verifies the submitted Order's `service` field equals `three_body_signature_service`

> **Risk Elimination (R-C3-05 + R-C3-06) — Level 3 Scene-Combined Design**:
> - **R-C3-05 (Cross-service theft)**: Eliminated by the Service Ownership check. An attacker cannot submit another service's order because `order.service` won't match `three_body_signature_service`.
> - **R-C3-06 (Fund theft via Signer)**: Eliminated by the scene itself — the allocator uses `"who": {"Entity": {"name_or_address": "three_body_treasury"}}` (funds flow to the fixed Treasury address). Funds go to a fixed recipient regardless of caller, so **no Signer binding is needed**. This is the Level 3 scene-combined pattern.

> **Important**: `env.confirmed: true` is required because `replaceExistName: true` triggers a confirmation prompt.

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
          {
            "type": "Guard",
            "type_raw": "0x2::guard::Guard",
            "object": "0x...",
            "version": "...",
            "owner": "Immutable",
            "change": "created"
          }
        ]
      }
    }
  },
  "schema": null
}
```

---

## Step 10: Configure Order Allocators

Set up fund allocation: 100% to the author's Treasury upon order completion. Also bind the Contact (Step 8) as `um` to enable the `customer_required` private-info delivery channel — the SDK blocks `customer_required` without a matching `um` (see Step 8 for the rationale).

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "service",
    "data": {
      "object": "three_body_signature_service",
      "order_allocators": {
        "description": "Three-Body signature service fund allocation - 100% to author Treasury",
        "threshold": 0,
        "allocators": [
          {
            "guard": "three_body_allocator_guard",
            "sharing": [
              {
                "who": {
                  "Entity": {"name_or_address": "three_body_treasury"}
                },
                "sharing": 10000,
                "mode": "Rate"
              }
            ]
          }
        ]
      },
      "customer_required": ["phone", "email", "shipping_address"],
      "um": "three_body_contact"
    },
    "env": {
      "account": "three_body_author",
      "network": "testnet"
    }
  }
}
```

> **⚠️ Risk Elimination — Why this configuration is safe**:
> - **R-C3-05 (Cross-service theft)**: Eliminated by `three_body_allocator_guard` (Step 9), which verifies `order.service == three_body_signature_service` before allocation proceeds.
> - **R-C3-06 (Fund theft via Signer)**: Eliminated by `sharing.who = {"Entity": {"name_or_address": "three_body_treasury"}}` — funds always flow to the fixed Treasury address regardless of who triggers the allocation. An attacker cannot redirect funds to themselves even if they somehow bypass the Guard.
> - **Previous unsafe pattern (DO NOT USE)**: The original design used `guard: "three_body_buy_guard"` (no `order.service` check) with `sharing.who = {"Signer": "signer"}` — this allowed anyone to trigger allocation of any order's funds to themselves.
> - **SDK-enforced constraint (customer_required ⟶ um)**: `"customer_required"` is set alongside `"um": "three_body_contact"` in the SAME call. The SDK validator `checkCustomerRequiredNeedsUm()` in `service.ts` L1226 also runs on publish (L314), so splitting into two calls (e.g. `customer_required` now, `um` later) would still fail at publish time — they are both required before the Service goes live.

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
          {
            "type": "Service",
            "type_raw": "0x2::service::Service<0x2::wow::WOW>",
            "object": "0x...",
            "version": "...",
            "owner": {"Shared": {"initial_shared_version": "..."}},
            "change": "mutated"
          }
        ]
      }
    }
  },
  "schema": null
}
```

---

## Step 11: Add Sales and Publish Service

Add sales items and publish the service to make it available for orders.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "service",
    "data": {
      "object": "three_body_signature_service",
      "sales": {
        "op": "add",
        "sales": [
          {
            "name": "Three-Body Book Signature",
            "price": "888WOW",
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
}
```

> **Important**: `env.confirmed: true` is **critical** here because `publish: true` is an irreversible operation that locks the `machine` and `order_allocators` fields. The server will block the transaction with a "Publish confirmation (irreversible lock)" prompt until `confirmed: true` is provided.

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
          {
            "type": "Service",
            "type_raw": "0x2::service::Service<0x2::wow::WOW>",
            "object": "0x...",
            "version": "...",
            "owner": {"Shared": {"initial_shared_version": "..."}},
            "change": "mutated"
          }
        ]
      }
    }
  },
  "schema": null
}
```

---

## Step 12: Unpause Service

Unpause the service to allow order creation.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
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
}
```

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
          {
            "type": "Service",
            "type_raw": "0x2::service::Service<0x2::wow::WOW>",
            "object": "0x...",
            "version": "...",
            "owner": {"Shared": {"initial_shared_version": "..."}},
            "change": "mutated"
          }
        ]
      }
    }
  },
  "schema": null
}
```

---

## Step 13: Verify Service Configuration

Query the service to verify all configurations.

**Request**:
```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "onchain_objects",
    "objects": ["three_body_signature_service"],
    "no_cache": true,
    "network": "testnet"
  }
}
```

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
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
              "description": "Three-Body author book signature service. Provide a message up to 10 characters, and the author will sign your book. Process: 1.Book Delivery 2.Signature Completion. Fee: 888 WOW.",
              "location": "",
              "sales": [
                {
                  "name": "Three-Body Book Signature",
                  "stock": "100",
                  "suspension": false,
                  "price": "888000000000",
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
                "description": "Three-Body signature service fund allocation - 100% to author Treasury",
                "threshold": "0",
                "allocators": [
                  {
                    "guard": "0x...",
                    "sharing": [
                      {
                        "who": {"Entity": "0x..."},
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
              "um": "0x...",
              "permission": "0x...",
              "cache_expire": 1234567890,
              "query_name": "three_body_signature_service"
            }
          ]
        }
      }
    }
  },
  "schema": null
}
```

> **Field Reference**:
> - **`buy_guard`**, **`machine`**, **`permission`**, **`um`**: Return **on-chain object IDs** (not names). The on-chain data stores raw object IDs; resolving them back to local mark names requires a separate reverse lookup that is not performed by `onchain_objects` queries.
> - **`query_name`**: The original name string passed in the query request (here, `"three_body_signature_service"`). This is automatically populated by the SDK from the input `objects` array, so you can identify which queried name corresponds to which returned object.
> - **`um`**: The on-chain object ID of `three_body_contact` (created in Step 8). The SDK validator `checkCustomerRequiredNeedsUm()` requires this whenever `customer_required` is non-empty — without a Contact the Service has no encrypted channel to receive customer private info.
> - **`order_allocators.allocators[].guard`**: Returns the on-chain object ID of `three_body_allocator_guard` (created in Step 9). This Guard verifies `order.service == three_body_signature_service` (R-C3-05 protection).
> - **`order_allocators.allocators[].sharing[].who`**: `{"Entity": "0x..."}` indicates funds flow to the fixed Treasury object (`three_body_treasury` from Step 7). The address is the Treasury's on-chain object ID. This eliminates R-C3-06 (fund theft via Signer) because the recipient is fixed regardless of caller.
> - **`order_allocators.allocators[].sharing[].mode`**: `1` is the numeric enum for `Rate` mode (input accepts the string `"Rate"`, output returns the numeric `1`).
> - **`order_allocators.allocators[].fix`** and **`max`**: Additional fields returned on-chain (default `"0"` and `null` respectively) that are not part of the input schema but are present in the on-chain data structure.
> - **`sales[].price`**: Returns the on-chain smallest-unit value as a string (`"888000000000"` = 888 WOW; WOW has 9 decimals). The input accepts the display format `"888WOW"` (auto-converted by the Fund Processing Layer) or the raw smallest-unit integer `888000000000`.

---

## Testing the Buy Guard

### Test 1: Author Purchase (Should Succeed)

The author (`three_body_author`) should be able to purchase the service.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
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
            "balance": "888WOW"
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
}
```

> **Amount Format**: `"888WOW"` is the display format — the Fund Processing Layer converts it to `888000000000` smallest units (WOW has 9 decimals) before submission. The raw integer `888000000000` is equally valid. The order pays exactly the sale price set in Step 11.

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
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
      }
    }
  },
  "schema": null
}
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
  "tool": "onchain_operations",
  "data": {
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
            "balance": "888WOW"
          }
        }
      }
    },
    "env": {
      "account": "three_body_customer",
      "network": "testnet"
    }
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

After a successful purchase by the author, the order progresses through the Machine nodes, and the payment is then released to the Treasury via the order allocator:

### Node 1: Book Delivered

The author confirms the book has been delivered.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "progress",
    "data": {
      "object": "three_body_progress",
      "operate": {
        "operation": {
          "next_node_name": "Book Delivered",
          "forward": "Confirm Delivery"
        },
        "op": "next"
      }
    },
    "env": {
      "account": "three_body_author",
      "network": "testnet",
      "no_cache": true
    }
  }
}
```

> **Tip**: Although `no_cache: true` is most critical for the second Progress operation (Node 2), it is recommended to use it for **all** sequential Progress operations on the same object to ensure the SDK always reads the latest on-chain state.

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
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
      }
    }
  },
  "schema": null
}
```

### Node 2: Signature Completed

The author completes the signature.

> **Important**: Use `no_cache: true` in the `env` for sequential Progress operations on the same object. This ensures the SDK reads the latest on-chain state (including the updated `current` node) instead of using a cached version.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "progress",
    "data": {
      "object": "three_body_progress",
      "operate": {
        "operation": {
          "next_node_name": "Signature Completed",
          "forward": "Complete Signature"
        },
        "op": "next"
      }
    },
    "env": {
      "account": "three_body_author",
      "network": "testnet",
      "no_cache": true
    }
  }
}
```

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
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
      }
    }
  },
  "schema": null
}
```

### Fund Allocation: Release the 888 WOW Payment to the Treasury

Once the Progress reaches the final node (`Signature Completed`), the order is fulfilled and the 888 WOW payment held by `three_body_allocation` can be distributed. The Service's `order_allocators` (Step 10) routes 100% to `three_body_treasury` when `three_body_allocator_guard` (Step 9) verifies `order.service == three_body_signature_service`.

#### (a) Trigger the Allocation (`alloc_by_guard`)

The allocator Guard's table item `0` has `b_submission: true` (the Order address is only known at runtime), so the call must carry a **top-level `submission` block** — at the SAME level as `data` and `env`, NOT inside `data.data`.

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "allocation",
    "data": {
      "object": "three_body_allocation",
      "alloc_by_guard": "three_body_allocator_guard"
    },
    "env": {
      "account": "three_body_author",
      "network": "testnet"
    },
    "submission": {
      "type": "submission",
      "guard": [
        {
          "object": "three_body_allocator_guard",
          "impack": true
        }
      ],
      "submission": [
        {
          "guard": "three_body_allocator_guard",
          "submission": [
            {
              "identifier": 0,
              "b_submission": true,
              "value_type": "Address",
              "value": "three_body_order",
              "name": "Order ID (submitted at runtime)"
            }
          ]
        }
      ]
    }
  }
}
```

> **Two-Phase Reminder**: The ConfirmGate does not gate `allocation` operations, but treat fund distribution as irreversible in production — preview first (call without `confirmed`), then execute after user approval.

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
          {
            "type": "Allocation",
            "type_raw": "0x2::allocation::Allocation<0x2::wow::WOW>",
            "object": "0x...",
            "version": "...",
            "owner": {"Shared": {"initial_shared_version": "..."}},
            "change": "mutated"
          },
          {
            "type": "Payment",
            "type_raw": "0x2::payment::Payment<0x2::wow::WOW>",
            "object": "0x...",
            "version": "...",
            "owner": "Immutable",
            "change": "created"
          }
        ]
      }
    }
  },
  "schema": null
}
```

> The immutable `Payment` object created by this call is the on-chain receipt of the distribution — its `payment` array records each recipient and amount (here: 100% of 888 WOW to `three_body_treasury`).

#### (b) Verify the Pending CoinWrapper at the Treasury

The Treasury does NOT receive spendable coins directly — each allocation recipient receives a `CoinWrapper` object that must be unwrapped before the funds enter its balance. Query the Treasury's received objects:

**Request**:
```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "onchain_received",
    "name_or_address": "three_body_treasury",
    "type": "CoinWrapper",
    "network": "testnet"
  }
}
```

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "query_type": "onchain_received",
        "result": {
          "balance": "888000000000",
          "token_type": "0x2::wow::WOW",
          "received": [
            {
              "id": "0x...",
              "balance": "888000000000",
              "payment": "0x..."
            }
          ]
        }
      }
    }
  },
  "schema": null
}
```

> The CoinWrapper holds the full 888 WOW (`888000000000` smallest units — Rate `10000` = 100% of the order payment) and references the `Payment` receipt created in step (a).
>
> **Return-shape note**: `onchain_received` returns the wrapped `{balance, token_type, received[]}` object ONLY when `"type": "CoinWrapper"` is passed (as in this example). Without `type` (all-types mode) or with a custom StructType filter, it returns a bare array of `[{id, type, content_raw, version, digest}]`.

#### (c) Unwrap into the Treasury Balance (`receive`)

Deposit the pending CoinWrapper into the Treasury's balance. The literal `"recently"` auto-receives ALL recently received CoinWrappers:

**Request**:
```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "treasury",
    "data": {
      "object": "three_body_treasury",
      "receive": "recently"
    },
    "env": {
      "account": "three_body_author",
      "network": "testnet"
    }
  }
}
```

**Expected Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "type": "transaction",
        "objectChanges": [
          {
            "type": "Treasury",
            "type_raw": "0x2::treasury::Treasury<0x2::wow::WOW>",
            "object": "0x...",
            "version": "...",
            "owner": {"Shared": {"initial_shared_version": "..."}},
            "change": "mutated"
          },
          {
            "type": "TableItem_TreasuryHistory",
            "type_raw": "0x2::dynamic_field::Field<address, 0x2::parent_linked_table::Node<address, 0x2::treasury::Record>>",
            "object": "0x...",
            "version": "...",
            "owner": {"ObjectOwner": "0x..."},
            "change": "created"
          }
        ]
      }
    }
  },
  "schema": null
}
```

> **Permission**: The author passes as the Permission's admin (see Step 1). A non-admin operator would additionally need the built-in `TREASURY_RECEIVE` index (`253`).

#### (d) Final Verification

Query the Treasury to confirm the funds have landed in its balance:

**Request**:
```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "onchain_objects",
    "objects": ["three_body_treasury"],
    "no_cache": true,
    "network": "testnet"
  }
}
```

**Expected Result** (key fields):
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "query_type": "onchain_objects",
        "result": {
          "objects": [
            {
              "object": "0x...",
              "type": "Treasury",
              "type_raw": "0x2::treasury::Treasury<0x2::wow::WOW>",
              "balance": "888000000000",
              "inflow": "888000000000",
              "outflow": "0",
              "history_count": 1,
              "query_name": "three_body_treasury"
            }
          ]
        }
      }
    }
  },
  "schema": null
}
```

> The full 888 WOW order payment now sits in `three_body_treasury` (`balance` = `888000000000` = 888 WOW) — the Treasury-first fund flow (Step 7) executed end-to-end: Order → Allocation → Guard-verified distribution → Treasury.

---

## Summary

This example demonstrates:

1. **Buy Guard Implementation**: Restricts service purchases to specific accounts (Level 1 strict single-identity binding)
2. **Machine Workflow**: Two-node process for service delivery tracking
3. **WIP Files Optional**: Sales items can use WIP files or empty strings
4. **Service Configuration**: Complete setup from creation to publication
5. **Safe Fund Allocation**: Treasury-first design with Level 3 scene-combined allocator Guard — funds always flow to the fixed Treasury, eliminating R-C3-05 (cross-service theft) and R-C3-06 (fund theft via Signer)
6. **Fund Allocation Execution**: `alloc_by_guard` distributes the completed order's 888 WOW payment to `three_body_treasury`, and the pending CoinWrapper is unwrapped via Treasury `receive` (see Workflow Execution → Fund Allocation)

### Key Objects

| Object | Name |
|--------|------|
| Permission | three_body_permission |
| Buy Guard | three_body_buy_guard (Level 1 strict, R-C4-04) |
| Machine | three_body_machine |
| Service | three_body_signature_service |
| Treasury | three_body_treasury |
| Contact (um) | three_body_contact (required for customer_required — SDK-enforced customer_required ⟶ um linkage) |
| Allocator Guard | three_body_allocator_guard (Level 3 scene-combined, R-C3-05/R-C3-06 safe) |
| Order | three_body_order |
| Allocation | three_body_allocation |
| Progress | three_body_progress |

### Risk Mitigation Summary

| Risk | Severity | Mitigation |
|------|----------|------------|
| **R-C3-05** (Cross-service theft) | High | `three_body_allocator_guard` verifies `order.service == three_body_signature_service` before allocation |
| **R-C3-06** (Fund theft via Signer) | Critical | `sharing.who = {"Entity": {"name_or_address": "three_body_treasury"}}` — funds flow to fixed Treasury, no Signer binding needed |
| **R-C4-04** (Level 1 lock-in) | Info | Buy Guard uses Level 1 strict binding (justified: sole-operator service, buy_guard can be re-bound if author rotates) |

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
   - Guards (Buy Guard for purchase control; Allocator Guard needs Service address for `order.service` verification)
   - Treasury (uses same Permission as Service for unified governance)
   - Contact (um) — REQUIRED before setting customer_required (SDK-enforced: customer_required ⟶ um hard linkage; validator also re-runs at publish time)
   - Configure Service (add machine, buy_guard, order_allocators with allocator guard + Entity(Treasury); set customer_required **together with** um in the same or prior call)
   - Publish Service (LAST - once published, many changes are blocked)

3. **Treasury-First Fund Flow**: Always route merchant revenue through a Treasury object using `sharing.who = {"Entity": {"name_or_address": "treasury_name"}}` instead of `{"Signer": "signer"}`. This eliminates R-C3-06 (critical fund theft via Signer) because funds flow to a fixed recipient regardless of who triggers the allocation. Combined with an allocator Guard that verifies `order.service == this_service` (R-C3-05 protection), the fund allocation becomes inherently safe.

4. **Use `confirmed: true` for Irreversible/Destructive Operations**: The MCP server enforces a two-phase confirmation for safety. You MUST add `"confirmed": true` to the `env` for:
   - Any operation whose **top-level** `data.namedNew ?? data.object` sets `replaceExistName: true` (unbinds existing names). Note: ConfirmGate's default-value warnings only scan that top-level field — the NESTED naming fields inside `order_new` (`namedNewOrder`/`namedNewProgress`/`namedNewAllocation`) are NOT scanned, which is why Test 1 runs without `confirmed: true` despite its nested `replaceExistName: true` entries.
   - Any `publish: true` operation (irreversible lock on Machine `nodes`/`pairs`/`forwards`, or Service `machine`/`order_allocators`)
   Without `confirmed: true`, the server returns a `pending_confirmation` result and blocks the transaction until you re-call with `confirmed: true`.

5. **Use `no_cache: true` for Sequential Operations**: When performing multiple operations on the same object in sequence (especially Progress workflow advancement), always set `no_cache: true` in the `env` to ensure the SDK reads the latest on-chain state.

6. **customer_required ⟶ um (Contact) Hard Linkage (SDK-enforced)**: Whenever you set `customer_required` (e.g. `["phone", "email", "shipping_address"]`), you MUST also bind a Contact object via `um` in the SAME or a prior Service call. The SDK's `checkCustomerRequiredNeedsUm()` validator in `ts-sdk/packages/wowok/src/w/call/service.ts` (L1226) runs at TWO points:
   - When `customer_required` is present in the current operation `data` (immediate block, L307)
   - When `publish: true` is set (re-verifies against the accumulated Service state, L314)
   This means splitting the two calls (set `customer_required` first, add `um` later) is NOT safe — the publish-time re-check would still block. Always create the Contact first, then set both `customer_required` and `um` together.

7. **Query Toolkit is Your Best Friend**: Use queries constantly to verify objects exist, check configurations, debug issues, and confirm state changes.

8. **Object IDs vs Names in Responses**: On-chain query responses return **object IDs** (e.g., `0x8202...`) for cross-object references like `buy_guard`, `machine`, `permission`, `um`. The `query_name` field in the response echoes back the original query input name. To resolve object IDs back to local mark names, use `query_toolkit` with `query_type: "local_names"`.

9. **Information Injection in Transaction Responses**: Mutation/creation operations return ALL objects affected by the transaction (including side effects like `TableItem_EntityLinker` and `TableItem_ProgressHistory`), not just the primary target. This is a deliberate design for transparency. The return order reflects the transaction's execution order.
