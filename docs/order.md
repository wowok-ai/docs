# Order Component (📦 Order Management)

---

## Component Overview

The Order Component manages the complete lifecycle of an order. Usually created automatically by Service, but can also be operated directly. Order supports setting agents, managing order information, advancing workflows, handling arbitration, receiving funds, and transferring ownership.

---

## Function List

| Name | Purpose | Usage Scenario | Significance |
|------|---------|----------------|--------------|
| **Set Order Agents** | Assign agents to an order who can operate it but not receive funds | Delegating order management to team members without sharing financial access | Provides secure delegation of operational rights while keeping financial control with the owner |
| **Set Required Info** | Attach Contact or WTS Proof object to order | Adding delivery address, contact information, or delivery proof to an order | Ensures order has necessary recipient information and proof of delivery |
| **Advance Progress** | Move order workflow from current node to next node | Processing order through defined stages (e.g., from "pending" to "in_progress") | Enforces structured workflow and tracks order progression through stages |
| **Submit Arbitration** | Request arbitration for order disputes | When buyer and seller cannot resolve a dispute amicably | Provides formal dispute resolution mechanism with defined rules and compensation |
| **Object to Arbitration** | Appeal arbitration decision | When disagreeing with arbitration outcome | Allows challenging arbitration results with new evidence or arguments |
| **Claim Compensation** | Receive awarded compensation from arbitration | After arbitration ruling in your favor | Transfers awarded funds from resolved arbitration to order owner |
| **Receive Funds** | Unwrap and transfer order funds to owner | Collecting payments, refunds, or other assets sent to the order | Extracts and transfers received funds and objects to order owner |
| **Transfer Ownership** | Change order owner to another address | Selling or transferring order rights to another party | Transfers full ownership and control of the order to new address |

---

## Schema Tree

```
order
├── operation_type: "order"
├── data
│   ├── object (Order ID or name)
│   ├── agents (Array of agent names/addresses)
│   ├── required_info (Contact/WTS Proof ID or null)
│   ├── progress
│   │   ├── operation
│   │   │   ├── next_node_name (Next node name)
│   │   │   └── forward (Forward direction)
│   │   ├── hold (Lock operation)
│   │   ├── adminUnhold (Admin unlock, optional)
│   │   └── message (Result message, optional)
│   ├── arb_confirm
│   │   ├── arb (Arb ID or name)
│   │   ├── confirm (Confirm arbitration materials)
│   │   ├── description (Compensation description, optional)
│   │   └── proposition (Compensation claims array, optional)
│   ├── arb_objection
│   │   ├── arb (Arb ID or name)
│   │   └── objection (Objection description)
│   ├── arb_claim_compensation
│   │   └── arb (Arb ID or name)
│   ├── receive (Received objects or balance)
│   └── transfer_to (New owner name/address)
├── env (optional)
│   ├── account (Account name/address)
│   ├── permission_guard (Permission Guard array)
│   ├── no_cache (Disable cache)
│   ├── network (Network: localnet/testnet)
│   └── referrer (Referrer ID)
└── submission (optional)
    └── items (Submission items array)
        ├── index (Item index)
        └── data (Item data)
```

---

## Complete Tool Call Structure

Order operations use the following top-level structure:

```json
{
  "operation_type": "order",
  "data": { ... },
  "env": { ... },
  "submission": { ... }
}
```

---

## Function 1: Set Order Agents (agents)

### Description

Set order agents. Agents can operate the order (such as canceling, modifying status, etc.) but cannot receive funds received by the order.

### Parameters

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `operation_type` | string | Yes | Fixed value "order" |
| `data.object` | string | Yes | Order object ID or name |
| `data.agents` | array | Yes | Array of agent names/addresses |
| `env` | object | No | Execution environment |

### Important Notes

⚠️ **Agents can operate orders but cannot receive funds!** Ensure the agent's permission scope matches expectations.

### Return Value

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 1.1: Set Single Agent

**Prompt**: Set agent "order_manager" for order "customer_order_123".

```json
{
  "operation_type": "order",
  "data": {
    "object": "customer_order_123",
    "agents": ["order_manager"]
  }
}
```

---

#### Example 1.2: Set Multiple Agents

**Prompt**: Set three agents for order "service_order_456": "agent_alice", "agent_bob", and "agent_charlie".

```json
{
  "operation_type": "order",
  "data": {
    "object": "service_order_456",
    "agents": ["agent_alice", "agent_bob", "agent_charlie"]
  }
}
```

---

#### Example 1.3: Clear All Agents

**Prompt**: Clear all agents from order "old_order_789".

```json
{
  "operation_type": "order",
  "data": {
    "object": "old_order_789",
    "agents": []
  }
}
```

---

## Function 2: Set Required Information (required_info)

### Description

Set order required information, such as recipient Contact object or WTS Proof object for information delivered via Wowok Messenger.

### Parameters

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `operation_type` | string | Yes | Fixed value "order" |
| `data.object` | string | Yes | Order object ID or name |
| `data.required_info` | string/null | Yes | Contact object ID, WTS Proof object ID, or null |
| `env` | object | No | Execution environment |

### Important Notes

⚠️ **required_info can be Contact object or WTS Proof object!** Ensure you provide the correct object type.

### Return Value

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 2.1: Set Contact as Required Info

**Prompt**: Set Contact object "customer_contact" as required info for order "delivery_order_001".

```json
{
  "operation_type": "order",
  "data": {
    "object": "delivery_order_001",
    "required_info": "customer_contact"
  }
}
```

---

#### Example 2.2: Set WTS Proof Object

**Prompt**: Attach WTS Proof object "delivery_proof" to order "package_order_002" as delivery verification.

```json
{
  "operation_type": "order",
  "data": {
    "object": "package_order_002",
    "required_info": "delivery_proof"
  }
}
```

---

#### Example 2.3: Clear Required Information

**Prompt**: Remove required info from order "completed_order_003".

```json
{
  "operation_type": "order",
  "data": {
    "object": "completed_order_003",
    "required_info": null
  }
}
```

---

## Function 3: Advance Order Progress (progress)

### Description

Advance the order's Progress workflow, moving from current node to next node.

### Parameters

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `operation_type` | string | Yes | Fixed value "order" |
| `data.object` | string | Yes | Order object ID or name |
| `data.progress.operation` | object | Yes | Operation definition |
| `data.progress.operation.next_node_name` | string | Yes | Next node name (defined in Machine) |
| `data.progress.operation.forward` | string | Yes | Forward direction (defined in Machine) |
| `data.progress.hold` | boolean | Yes | Whether to lock (true=lock, false=submit) |
| `data.progress.adminUnhold` | boolean | No | Allow admin unlock (when hold=true) |
| `data.progress.message` | string | No | Operation result message |
| `env` | object | No | Execution environment |

### Important Notes

⚠️ **hold field determines operation type!**
- **`hold: true`**: Lock operation permissions to prevent race conditions
- **`hold: false`**: Submit operation result and advance to next node

⚠️ **next_node_name and forward must be valid values defined in Machine!** Ensure node and transition names are correct.

### Return Value

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 3.1: Submit Operation Result

**Prompt**: Advance order "workflow_order_101" Progress to next node "in_review" via "submit_review" path, without locking.

```json
{
  "operation_type": "order",
  "data": {
    "object": "workflow_order_101",
    "progress": {
      "operation": {
        "next_node_name": "in_review",
        "forward": "submit_review"
      },
      "hold": false,
      "message": "Order submitted for review successfully"
    }
  }
}
```

---

#### Example 3.2: Lock Operation Permissions

**Prompt**: Lock Progress operation for order "critical_order_102" to prevent race conditions, allow admin unlock.

```json
{
  "operation_type": "order",
  "data": {
    "object": "critical_order_102",
    "progress": {
      "operation": {
        "next_node_name": "processing",
        "forward": "start_process"
      },
      "hold": true,
      "adminUnhold": true,
      "message": "Locking for exclusive processing"
    }
  }
}
```

---

#### Example 3.3: Minimal Progress Advance

**Prompt**: Advance order "simple_order_103" Progress with minimal required parameters.

```json
{
  "operation_type": "order",
  "data": {
    "object": "simple_order_103",
    "progress": {
      "operation": {
        "next_node_name": "completed",
        "forward": "finish"
      },
      "hold": false
    }
  }
}
```

---

## Function 4: Submit Arbitration Request (arb_confirm)

### Description

Submit arbitration request, apply for arbitration compensation. Confirm that submitted arbitration materials are valid.

### Parameters

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `operation_type` | string | Yes | Fixed value "order" |
| `data.object` | string | Yes | Order object ID or name |
| `data.arb_confirm.arb` | string | Yes | Arb object ID or name |
| `data.arb_confirm.confirm` | boolean | Yes | Confirm arbitration materials are valid |
| `data.arb_confirm.description` | string | No | Compensation application description (max 4000 chars) |
| `data.arb_confirm.proposition` | array | No | Compensation claims array |
| `env` | object | No | Execution environment |

### Important Notes

⚠️ **Arbitration materials must be prepared in Arb object first!** Ensure Arb object is properly configured.

⚠️ **confirm must be set to true to proceed with arbitration!**

### Return Value

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 4.1: Submit Arbitration Request

**Prompt**: Submit arbitration request for order "dispute_order_201", use Arb object "order_dispute_arb", confirm materials valid, add description and propositions.

```json
{
  "operation_type": "order",
  "data": {
    "object": "dispute_order_201",
    "arb_confirm": {
      "arb": "order_dispute_arb",
      "confirm": true,
      "description": "Requesting arbitration compensation as product was not delivered on time",
      "proposition": ["Full payment refund", "Late delivery penalty compensation"]
    }
  }
}
```

---

#### Example 4.2: Minimal Arbitration Request

**Prompt**: Submit minimal arbitration request for order "simple_dispute_202", only confirm arbitration materials.

```json
{
  "operation_type": "order",
  "data": {
    "object": "simple_dispute_202",
    "arb_confirm": {
      "arb": "simple_arb",
      "confirm": true
    }
  }
}
```

---

## Function 5: Object to Arbitration Result (arb_objection)

### Description

Oppose arbitration result, file an appeal, request re-arbitration.

### Parameters

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `operation_type` | string | Yes | Fixed value "order" |
| `data.object` | string | Yes | Order object ID or name |
| `data.arb_objection.arb` | string | Yes | Arb object ID or name |
| `data.arb_objection.objection` | string | Yes | Objection description (max 4000 chars) |
| `env` | object | No | Execution environment |

### Important Notes

⚠️ **Objection must be filed within validity period after arbitration result is published!** Ensure you operate within the time limit.

### Return Value

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 5.1: File Arbitration Objection

**Prompt**: File objection to arbitration result for order "appeal_order_301", explain opposition reasons with new evidence.

```json
{
  "operation_type": "order",
  "data": {
    "object": "appeal_order_301",
    "arb_objection": {
      "arb": "dispute_arb_result",
      "objection": "Arbitration result is unfair. I have new evidence proving the product has quality issues. Requesting re-arbitration."
    }
  }
}
```

---

## Function 6: Claim Arbitration Compensation (arb_claim_compensation)

### Description

Specify adjudicated Arb object to obtain order compensation.

### Parameters

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `operation_type` | string | Yes | Fixed value "order" |
| `data.object` | string | Yes | Order object ID or name |
| `data.arb_claim_compensation.arb` | string | Yes | Adjudicated Arb object ID or name |
| `env` | object | No | Execution environment |

### Important Notes

⚠️ **Arb object must already be adjudicated!** Only adjudicated Arb objects can claim compensation.

### Return Value

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 6.1: Claim Arbitration Compensation

**Prompt**: Claim arbitration compensation for order "compensation_order_401" using adjudicated Arb object "awarded_arb".

```json
{
  "operation_type": "order",
  "data": {
    "object": "compensation_order_401",
    "arb_claim_compensation": {
      "arb": "awarded_arb"
    }
  }
}
```

---

## Function 7: Receive Funds (receive)

### Description

Unwrap CoinWrapper objects and other objects received by the order, transfer them to the order owner.

### Parameters

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `operation_type` | string | Yes | Fixed value "order" |
| `data.object` | string | Yes | Order object ID or name |
| `data.receive` | object/array | Yes | Received objects or balance |
| `env` | object | No | Execution environment |

### Important Notes

⚠️ **Funds will be transferred to the order owner!** Ensure you are the order owner.

### Return Value

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 7.1: Receive Token Balance

**Prompt**: Receive token balance for order "payment_order_501".

```json
{
  "operation_type": "order",
  "data": {
    "object": "payment_order_501",
    "receive": {
      "balance": "10000000000",
      "token_type": "CoinWrapper<0x2::wow::WOW>",
      "received": [
        {
          "id": "coin_wrapper_1",
          "balance": "10000000000",
          "payment": "payment_obj_1"
        }
      ]
    }
  }
}
```

---

#### Example 7.2: Receive Specific Objects

**Prompt**: Receive specified object list for order "asset_order_502".

```json
{
  "operation_type": "order",
  "data": {
    "object": "asset_order_502",
    "receive": [
      {
        "id": "nft_object_1",
        "type": "0x2::nft::NFT"
      },
      {
        "id": "document_object_1",
        "type": "0x2::doc::Document"
      }
    ]
  }
}
```

---

## Function 8: Transfer Ownership (transfer_to)

### Description

Set new owner of the order. Requires order owner permission to set.

### Parameters

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `operation_type` | string | Yes | Fixed value "order" |
| `data.object` | string | Yes | Order object ID or name |
| `data.transfer_to` | string | Yes | New owner name/address |
| `env` | object | No | Execution environment |

### Important Notes

⚠️ **Requires order owner permission!** Only current owner can transfer ownership.

⚠️ **After ownership transfer, new owner will have all order permissions!** Confirm target address is correct.

### Return Value

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 8.1: Transfer Order Ownership

**Prompt**: Transfer ownership of order "transfer_order_601" to "new_owner_account".

```json
{
  "operation_type": "order",
  "data": {
    "object": "transfer_order_601",
    "transfer_to": "new_owner_account"
  }
}
```

---

## Function 9: Combined Operations

### Description

Execute multiple Order operations in one transaction, such as setting agents and advancing Progress simultaneously.

### Important Notes

⚠️ **Combined operations execute in same transaction!** All operations are atomic - either all succeed or all fail.

### Examples

#### Example 9.1: Set Agents + Advance Progress

**Prompt**: Set agents and advance Progress for order "combined_order_701".

```json
{
  "operation_type": "order",
  "data": {
    "object": "combined_order_701",
    "agents": ["operations_manager"],
    "progress": {
      "operation": {
        "next_node_name": "active",
        "forward": "activate"
      },
      "hold": false
    }
  }
}
```

---

#### Example 9.2: Set Required Info + Receive Funds

**Prompt**: Set required info and receive funds for order "fulfillment_order_702".

```json
{
  "operation_type": "order",
  "data": {
    "object": "fulfillment_order_702",
    "required_info": "shipping_contact",
    "receive": [
      {
        "id": "delivery_nft",
        "type": "0x2::nft::NFT"
      }
    ]
  }
}
```

---

#### Example 9.3: Full Parameters Example

**Prompt**: On testnet network, set agents, set required info, advance Progress, and receive funds for order "full_order_703" using default account.

```json
{
  "operation_type": "order",
  "data": {
    "object": "full_order_703",
    "agents": ["agent_1", "agent_2"],
    "required_info": "customer_contact",
    "progress": {
      "operation": {
        "next_node_name": "delivered",
        "forward": "confirm_delivery"
      },
      "hold": false,
      "message": "Order delivery confirmed"
    },
    "receive": {
      "balance": "25000000000",
      "token_type": "CoinWrapper<0x2::wow::WOW>",
      "received": [
        {
          "id": "payment_wrapper",
          "balance": "25000000000",
          "payment": "order_payment"
        }
      ]
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

---

## Important Notes

⚠️ **Agents can operate orders but cannot receive funds!**

⚠️ **progress field uses OperateSchema structure!**
- `operation`: Contains `next_node_name` and `forward` specifying next node and direction
- `hold`: true = lock operation permission, false = submit operation result
- `adminUnhold`: Optional when hold=true, allows admin force unlock
- `message`: Optional operation result message

⚠️ **next_node_name and forward must be valid values defined in Machine!**

⚠️ **Arbitration materials must be prepared in Arb object first!**

⚠️ **Ownership transfer requires order owner permission!**

⚠️ **Funds will be transferred to order owner!**

⚠️ **Please use Wowok Messenger for information delivery - private, secure, and verifiable!**

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Service](service.md)** | WYSIWYG product trading (orders usually created automatically by Service) |
| **[Progress](progress.md)** | Order progress |
| **[Machine](machine.md)** | Workflow template |
| **[Arbitration](arbitration.md)** | Dispute resolution |
| **[Contact](contact.md)** | Public contact information |
