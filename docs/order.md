# Order Component (📦 Order Management)

---

## Component Overview

The Order Component manages the complete lifecycle of an order. **Orders are usually created automatically by the [Service](service.md) component** when customers make purchases. Once created, orders can be operated directly to manage agents, required information, workflow progress, arbitration, fund receipt, and ownership transfer.

**Key Relationship with Service:**
- Orders are created through Service's `order_new` operation
- Each Order is linked to a Service and inherits its configuration (Machine, Arbitration, etc.)
- Order operations often require understanding the parent Service's setup

See [Service Component](service.md) for:
- Creating Services with products
- Configuring Machines for order workflows
- Setting up Arbitration for dispute resolution
- Creating orders via `order_new` operation

---

## Function List

| Name | Purpose | Usage Scenario | Significance |
|------|---------|----------------|--------------|
| **Set Order Agents** | Assign agents to an order who can operate it but not receive funds | Delegating order management to team members without sharing financial access | Provides secure delegation of operational rights while keeping financial control with the owner |
| **Set Required Info** | Attach Contact object for private communication with service provider | Sending sensitive information (delivery address, phone, etc.) via encrypted Messenger to service staff | Enables secure end-to-end encrypted transmission of private information without exposing it on-chain |
| **Advance Progress** | Move order workflow from current node to next node | Processing order through defined stages (e.g., from "pending" to "in_progress") | Enforces structured workflow and tracks order progression through stages |
| **Submit Arbitration** | Request arbitration for order disputes | When buyer and seller cannot resolve a dispute amicably | Provides formal dispute resolution mechanism with defined rules and compensation |
| **Object to Arbitration** | Appeal arbitration decision | When disagreeing with arbitration outcome | Allows challenging arbitration results with new evidence or arguments |
| **Claim Compensation** | Receive awarded compensation from arbitration | After arbitration ruling in your favor | Transfers awarded funds from resolved arbitration to order owner |
| **Receive Funds** | Unwrap and transfer order funds to owner | Collecting payments, refunds, or other assets sent to the order | Extracts and transfers received funds and objects to order owner |
| **Transfer Ownership** | Change order owner to another address | Selling or transferring order rights to another party | Transfers full ownership and control of the order to new address |

---

## Schema Tree

```
order (Order Object)
├── operation_type: "order" (fixed value)
├── data (Order operation data)
│   ├── object (NameOrAddress, required) - Order object ID or name
│   ├── agents (ManyAccountOrMark_Address, optional) - Order agents
│   │   └── entities (AccountOrMark_Address[]) - Array of agent references
│   │       └── Each item: string (name/address) or { name_or_address, local_mark_first }
│   ├── required_info (NameOrAddress | null, optional) - Contact object ID for secure messaging with service staff
│   ├── progress (OperateSchema, optional) - Advance order workflow
│   │   ├── operation (ProgressNext, required)
│   │   │   ├── next_node_name (string, required) - Target node name
│   │   │   └── forward (string, required) - Forward transition name
│   │   ├── hold (boolean, optional) - Lock operation permission
│   │   ├── adminUnhold (boolean, optional) - Allow admin unlock
│   │   └── message (string, optional) - Operation result message
│   ├── arb_confirm (ArbConfirmSchema, optional) - Submit arbitration request
│   │   ├── arb (NameOrAddress, required) - Arb object ID or name
│   │   ├── confirm (boolean, required) - Confirm materials valid
│   │   ├── description (string, optional) - Compensation description (max 4000 chars)
│   │   └── proposition (string[], optional) - Compensation claims array
│   ├── arb_objection (ArbObjectionSchema, optional) - Appeal arbitration result
│   │   ├── arb (NameOrAddress, required) - Arb object ID or name
│   │   └── objection (string, required) - Objection description (max 4000 chars)
│   ├── arb_claim_compensation (ArbClaimCompensationSchema, optional) - Claim compensation
│   │   └── arb (NameOrAddress, required) - Adjudicated Arb object ID or name
│   ├── receive (ReceivedObjectsOrRecently, optional) - Receive funds/objects
│   │   ├── Option 1: "recently" (string) - Receive all recent objects
│   │   ├── Option 2: ReceivedObject[] - Specific objects to receive
│   │   │   └── [{ id: string, type: string }]
│   │   └── Option 3: ReceivedBalance - Token balance to receive
│   │       ├── balance (number|string)
│   │       ├── token_type (string)
│   │       └── received (array of { id, balance, payment })
│   └── transfer_to (AccountOrMark_Address, optional) - New owner
│       └── string (name/address) or { name_or_address, local_mark_first }
├── env (optional, execution environment)
│   ├── account (string, optional) - account name/address, "" for default
│   ├── network (string, optional) - "localnet" or "testnet"
│   ├── permission_guard (string[], optional) - list of permission guard IDs
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

### ⚠️ Important Note About Submission

If the execution returns a `submission` field in the response, it indicates that additional Guard verification data is required. You must:

1. Complete all required submission data within the `submission` structure
2. Resubmit the operation with the completed submission data
3. **Do not modify any other parts of the structure** - only fill in the required submission values

The submission structure will specify which Guard objects need verification and what data needs to be provided for each Guard table item.

**Query Value Types**: Use the `wowok_buildin_info` tool with `{ "info": "value types" }` to query all supported value types with their numeric and string representations. This helps you understand what `value_type` values are valid for submission data.

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
| `data.agents` | array | No | Array of agent names/addresses. Set to empty array [] to clear all agents |
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

Set the Contact object for secure communication with service staff. When a service requires personal information (shipping address, phone number, email, etc.), customers use this field to specify their Contact object, which enables encrypted messaging with the service provider through [Messenger](messenger.md).

**How it works:**
1. Customer creates a Contact object (see [Contact](contact.md))
2. Customer attaches their Contact to the order via `required_info`
3. Customer uses [Messenger](messenger.md) to send private information directly to the service staff
4. All communication is **end-to-end encrypted** - information is never exposed on-chain and remains private between the parties

### Parameters

| Path | Type | Required | Description |
|------|------|----------|-------------|
| `operation_type` | string | Yes | Fixed value "order" |
| `data.object` | string | Yes | Order object ID or name |
| `data.required_info` | string/null | No | Contact object ID for secure messaging, or null to clear |
| `env` | object | No | Execution environment |

### Important Notes

⚠️ **Privacy & Security:**
- All sensitive information is transmitted through **end-to-end encrypted** [Messenger](messenger.md) channels
- Information is **never stored on-chain** - only the Contact object reference is recorded
- Customers retain full control over their private information
- Service staff can only access the information through secure Messenger conversations
- **Verifiable Communication**: Messenger supports [WTS (Witness Timestamped Snapshot)](messenger.md#generate-wts) generation, which creates cryptographically verifiable records of conversations that can prove the authenticity and integrity of chat content

⚠️ **Arbitration Evidence:**
- In case of disputes, WTS files from Messenger conversations can serve as **legal evidence** in [Arbitration](arbitration.md)
- WTS provides cryptographic proof that messages were sent/received at specific times and have not been tampered with
- Both parties can sign WTS files to create non-repudiable records (see [Sign WTS](messenger.md#sign-wts))
- This ensures fair dispute resolution based on verifiable communication history

⚠️ **Prerequisites:**
- Service must have configured a Contact object (see [Service Configuration](service.md#sub-feature-7-configure-contact-um))
- Customer must have created their own Contact object (see [Contact](contact.md))
- Both parties must have enabled Messenger functionality

### Return Value

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 2.1: Set Contact for Secure Communication

**Prompt**: Set Contact object "customer_contact" for order "delivery_order_001" to enable encrypted messaging with service staff for sharing shipping address.

```json
{
  "operation_type": "order",
  "data": {
    "object": "delivery_order_001",
    "required_info": "customer_contact"
  }
}
```

**Next Steps:**
After setting the Contact, use [Messenger](messenger.md) to send your private information:
1. Identify the service's Contact object from the Service configuration
2. Send an encrypted message containing your shipping details, phone number, etc.
3. The service staff will receive your information securely

---

#### Example 2.2: Send Private Information via Messenger

**Scenario**: After attaching your Contact to the order, send your shipping address to the service staff securely.

**Step 1**: Query the Service to find its Contact object
**Step 2**: Use Messenger to send encrypted message:

```json
{
  "operation": "send_message",
  "from": "customer_account",
  "to": "service_contact_object",
  "content": "Order: order_123\nShipping Address: 123 Main St, City, Country\nPhone: +1234567890\nEmail: customer@example.com"
}
```

⚠️ **Security Note**: This message is end-to-end encrypted and only readable by you and the service staff. It is never stored on the blockchain.

**WTS for Arbitration:**
If a dispute arises, you can generate a WTS (Witness Timestamped Snapshot) of this conversation:
1. Use [Generate WTS](messenger.md#generate-wts) to create a verifiable record of the chat history
2. [Sign WTS](messenger.md#sign-wts) to add your cryptographic signature
3. Submit the WTS as evidence in [Arbitration](arbitration.md) to prove what was agreed upon

This ensures that all communication about order details (shipping address, delivery requirements, etc.) can be cryptographically verified during dispute resolution.

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
| `data.progress.hold` | boolean | No | Whether to lock (true=lock, false=submit). Defaults to false if omitted |
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
| `data.receive` | object/array/string | No | Received objects array, balance object, or "recently" to receive all recent objects |
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
| `data.transfer_to` | string/object | No | New owner name/address, or object with { name_or_address, local_mark_first } |
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

#### Example 9.2: Set Contact + Receive Funds

**Prompt**: Set Contact object for secure communication and receive funds for order "fulfillment_order_702".

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

**Prompt**: On testnet network, set agents, set Contact for secure messaging, advance Progress, and receive funds for order "full_order_703" using default account.

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

⚠️ **Use [Messenger](messenger.md) for sending private information - end-to-end encrypted, never stored on-chain, and only accessible to you and the service staff!**

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Service](service.md)** | WYSIWYG product trading (orders usually created automatically by Service) |
| **[Progress](progress.md)** | Order progress |
| **[Machine](machine.md)** | Workflow template |
| **[Arbitration](arbitration.md)** | Dispute resolution |
| **[Contact](contact.md)** | Public contact information for secure communication |
| **[Messenger](messenger.md)** | End-to-end encrypted messaging for private information exchange |
