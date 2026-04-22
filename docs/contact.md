# Contact Component (💬 Communication Hub)

---

## Component Overview

The Contact component is used to manage on-chain instant messaging contact profiles, serving as the core for secure IM address management.

**Key Role in Secure Communication:**

The Contact component is the **foundation of end-to-end encrypted messaging** in the WoWok protocol. It serves as the bridge between on-chain identity and off-chain secure communication through the [Messenger](messenger.md) system.

**How Contact Enables Secure Messaging:**

1. **On-Chain Identity**: Contact objects are published on-chain, providing a verifiable public identity that anyone can look up
2. **Messenger Integration**: Each Contact object can be linked to a Messenger account, enabling encrypted communication
3. **Privacy Protection**: While the Contact identity is public, all actual communication is **end-to-end encrypted** and **never stored on-chain**
4. **Service Communication**: In [Service](service.md) transactions, Contact objects enable customers and service providers to exchange sensitive information (shipping addresses, phone numbers, etc.) securely without exposing this data on the blockchain

**Typical Usage Flow:**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Create Contact │────▶│  Enable Messenger │────▶│  Secure Chat   │
│   (On-chain)    │     │  (Encrypted IM)   │     │  (E2E Encrypted)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                               │
         │                                               │
         ▼                                               ▼
┌─────────────────┐                          ┌─────────────────┐
│ Share Contact   │                          │  Exchange Info  │
│ with Others     │                          │  (Private)      │
└─────────────────┘                          └─────────────────┘
```

**Important Links:**
- **[Messenger](messenger.md)** - End-to-end encrypted messaging system
- **[Service](service.md)** - Uses Contact for secure customer-service provider communication
- **[Order](order.md)** - Uses Contact via `required_info` field for private information exchange

---

## Why Contact is Essential

| Scenario | Without Contact | With Contact |
|----------|----------------|--------------|
| **Service Purchase** | No way to send shipping address privately | Customer sends encrypted address via Messenger linked to Contact |
| **Dispute Resolution** | No verifiable communication history | WTS (Witness Timestamped Snapshot) provides cryptographic proof of conversations |
| **Team Collaboration** | No secure team communication channel | Team members communicate via encrypted channels linked to Contact identities |
| **Customer Support** | Public on-chain messages expose sensitive data | Private end-to-end encrypted support conversations |

**Privacy & Security Guarantees:**
- ✅ **End-to-end encryption** - Only conversation participants can read messages
- ✅ **No on-chain storage** - Message content is never published to the blockchain
- ✅ **Verifiable identity** - Contact provides cryptographic proof of who you're communicating with
- ✅ **WTS support** - Generate cryptographically verifiable conversation records for [Arbitration](arbitration.md) if needed

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Create Contact** | Set up IM contact profile | Establish team communication, service support | Creates on-chain identity for [Messenger](messenger.md) encrypted messaging |
| **Manage IM List** | Add/remove contact entries | Update communication partners | Controls who can initiate encrypted conversations with you |
| **Set Status** | Update availability message | Indicate online presence, response times | Improves communication efficiency |
| **Enable Messenger** | Link Contact to encrypted messaging | Enable end-to-end encrypted chat | Foundation for secure private communication |
| **Service Integration** | Connect Contact to Service/Order | Allow customers to send private info | Enables secure exchange of shipping addresses, phone numbers, etc. |


---

## Schema Tree (4-Level Structure)

```
Contact Component
├── operation_type: "contact"
├── data
│   ├── object
│   │   ├── Option 1: Name or Address (string)
│   │   │   └── [contact_name or contact_id]
│   │   └── Option 2: Named Object with Permission
│   │       ├── name (string, optional)
│   │       ├── tags (array of strings, optional)
│   │       ├── onChain (boolean, optional)
│   │       ├── replaceExistName (boolean, optional)
│   │       └── permission
│   │           ├── Option 1: Name or Address (string)
│   │           │   └── [permission_name or permission_id]
│   │           └── Option 2: Named Object with Description
│   │               ├── name (string, optional)
│   │               ├── tags (array of strings, optional)
│   │               ├── onChain (boolean, optional)
│   │               ├── replaceExistName (boolean, optional)
│   │               └── description (string, optional)
│   ├── my_status (string, optional)
│   ├── description (string, optional)
│   ├── location (string, optional)
│   ├── ims (optional)
│   │   ├── op: "add"
│   │   │   └── im (array)
│   │   │       ├── at (string)
│   │   │       └── description (string, optional)
│   │   ├── op: "set"
│   │   │   └── im (array)
│   │   │       ├── at (string)
│   │   │       └── description (string, optional)
│   │   ├── op: "remove"
│   │   │   └── im (array of strings)
│   │   ├── op: "clear"
   └── owner_receive (transfer received coins or NFT objects to owner, optional)
   │       ├── Option 1: "recently" (string) - receive all recent objects
   │       ├── Option 2: Array of received objects
   │       │   └── [{ id: "object_id", type: "object_type" }]
   ├── env (optional, execution environment)
│   ├── account (string, optional) - account name or address, empty string for default
│   ├── network (string, optional) - "testnet" or "mainnet"
│   ├── permission_guard (array, optional) - list of permission guard IDs
│   ├── no_cache (boolean, optional) - disable caching
│   └── referrer (string, optional) - referrer ID
└── submission (optional, submission data)
    ├── type (string) - fixed value "submission"
    ├── guard (array) - list of guards to verify
    │   └── [{ object: "guard_id", impack: boolean }]
    └── submission (array) - submission data for guards
        └── [{ guard: "guard_id", submission: [guard_submission_items] }]
            └── guard_submission_items
                ├── identifier (number, 0-255) - Guard table item identifier
                ├── b_submission (boolean) - whether this item requires submission
                ├── value_type (number | string) - value type (e.g., 6 or "U64" for U64 type)
                ├── **value (any) - submitted value**
                └── name (string, optional) - item name
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

## Sub-function 1: Create New Contact

### Function Description

Create a new Contact object for managing instant messaging contacts.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `object.name` | string | No | Local mark name | Max 64 BCS bytes, cannot start with "0x" |
| `object.id` | string | No | Object ID | 0x prefix + 64 hex characters |
| `object.permission` | string/object | No | Permission object | Can be existing permission ID/name, or new permission object |
| `description` | string | No | Contact object description or public information | Max 4000 characters |
| `location` | string | No | Physical or virtual location of the Contact | Max 256 characters |
| `ims` | object | No | IM contact operations | See description below |

### Examples

#### Example 1.1: Create Simple Contact

**Prompt:** Create a new contact object named "service_support" with an existing permission, set description to "Customer support contact information", and location to "Online service".

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "service_support",
      "permission": "existing_permission"
    },
    "description": "Customer support contact information",
    "location": "Online service"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0xb607...190c",
  "type": "Contact",
  "version": "93060",
  "change": "created"
}
```

#### Example 1.2: Create Contact with New Permission

**Prompt:** Create a new contact named "team_contact", create a new permission object named "team_permission", set description to "Team contact information", and add "alice" with description "Product Manager" to the IM list.

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "team_contact",
      "permission": {
        "name": "team_permission"
      }
    },
    "description": "Team contact information",
    "ims": {
      "op": "add",
      "im": [
        {
          "at": "alice",
          "description": "Product Manager"
        }
      ]
    }
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x3c06...c965",
  "type": "Contact",
  "version": "93537",
  "change": "created"
}
```

---

## Sub-function 2: Manage IM Contact List (ims)

### Function Description

Manage the Contact object's instant messaging contact list, supporting add, set, remove, and clear operations.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ims.op` | string | Yes | Operation type: add/set/remove/clear |
| `ims.im` | array | Required for add/set | IM contact list |
| `ims.im[].at` | string | Yes | Contact account address or name |
| `ims.im[].description` | string | No | Contact note or description |

### Constraints

⚠️ **Maximum IM Contact Limit**: 200 contacts per Contact object. 

### Operation Type Description

| Operation Type | Description |
|----------------|-------------|
| `add` | Add new contacts to existing list |
| `set` | Replace entire contact list |
| `remove` | Remove specified contacts (use address or name) |
| `clear` | Clear all contacts |

### Important Notes

⚠️ **my_status is only valid when your account is already in the IM list**.

### Examples

#### Example 2.1: Add Contacts

**Prompt:** Use the existing contact "service_support" and add a new contact: "testuser1" with description "Technical Support".

```json
{
  "operation_type": "contact",
  "data": {
    "object": "service_support",
    "ims": {
      "op": "add",
      "im": [
        {
          "at": "testuser1",
          "description": "Technical Support"
        }
      ]
    }
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0xb607...190c",
  "type": "Contact",
  "version": "94028",
  "change": "mutated"
}
```

#### Example 2.2: Set Contact List (Replace)

**Prompt:** Use the existing contact "team_contact" and replace the entire IM list with "alice" (description: "Designer") and "testuser1" (description: "Developer").

```json
{
  "operation_type": "contact",
  "data": {
    "object": "team_contact",
    "ims": {
      "op": "set",
      "im": [
        {
          "at": "alice",
          "description": "Designer"
        },
        {
          "at": "testuser1",
          "description": "Developer"
        }
      ]
    }
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x3c06...c965",
  "type": "Contact",
  "version": "94531",
  "change": "mutated"
}
```

#### Example 2.3: Remove Contacts

**Prompt:** Use the existing contact "service_support" and remove the contact named "testuser1" from the IM list.

```json
{
  "operation_type": "contact",
  "data": {
    "object": "service_support",
    "ims": {
      "op": "remove",
      "im": ["testuser1"]
    }
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0xb607...190c",
  "type": "Contact",
  "version": "94532",
  "change": "mutated"
}
```

#### Example 2.4: Clear Contacts

**Prompt:** Use the existing contact "team_contact" and clear all contacts from the IM list.

```json
{
  "operation_type": "contact",
  "data": {
    "object": "team_contact",
    "ims": {
      "op": "clear"
    }
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x3c06...c965",
  "type": "Contact",
  "version": "94533",
  "change": "mutated"
}
```

---

## Sub-function 3: Set Personal Status (my_status)

### Function Description

Set your status message in this contact list.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `my_status` | string | Yes | Status message | Max 64 BCS bytes, cannot start with "0x" |

### Important Notes

⚠️ **Only valid when your account is already in the IM list**.

### Example

**Prompt:** Use the existing contact "service_support" and set your personal status to "Online, available for contact".

```json
{
  "operation_type": "contact",
  "data": {
    "object": "service_support",
    "my_status": "Online, available for contact"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0xb607...190c",
  "type": "Contact",
  "version": "95965",
  "change": "mutated"
}
```

---

## Sub-function 4: Receive Objects (owner_receive)

### Function Description

Receive objects sent to this Contact object and unwrap them to send to the permission owner.

This function allows the Contact object owner to receive objects (including CoinWrapper from Payment) that were sent to the Contact object address.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `owner_receive` | string or array | Yes | Receive configuration: "recently" to receive all recent objects, or array of received object IDs |

### Important Notes

⚠️ **The Contact object must have a Permission object associated with it** to use owner_receive.

⚠️ **Only the Permission owner can execute owner_receive**.

### Examples

#### Example 4.1: Receive All Recently Received Objects

**Prerequisites**: Before receiving objects, you need to send a Payment to the Contact object. Here are the steps:

**Step 1**: Create a Contact object

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "contact_receive_test_v3"
    },
    "description": "Contact for testing owner receive functionality"
  }
}
```

**Step 2**: Send a Payment to the Contact object

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "name": "payment_to_contact_v3"
    },
    "revenue": [
      {
        "recipient": {
          "name_or_address": "contact_receive_test_v3"
        },
        "amount": {
          "balance": 1000000000
        }
      }
    ],
    "info": {
      "remark": "Test payment to contact",
      "index": 11
    }
  }
}
```

**Step 3**: Receive the objects from the Contact object

**Prompt:** Use the existing contact "contact_receive_test_v3" and receive all recently sent objects.

```json
{
  "operation_type": "contact",
  "data": {
    "object": "contact_receive_test_v3",
    "owner_receive": "recently"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0xaee9...1db7",
  "type": "Contact",
  "version": "14541",
  "change": "mutated"
}
```

#### Example 4.2: Receive Specific Objects

**Prompt:** Use the existing contact "contact_receive_test_v3" and receive specific objects by their IDs.

```json
{
  "operation_type": "contact",
  "data": {
    "object": "contact_receive_test_v3",
    "owner_receive": [
      {
        "id": "0xaee9b75f7903d05dbfb4ee2abe9e036503c66f4bc552d835543b9b49d3851db7",
        "type": "0x2::payment::CoinWrapper<0x2::wow::WOW>"
      }
    ]
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0xaee9...1db7",
  "type": "Contact",
  "version": "14542",
  "change": "mutated"
}
```

---

## Sub-function 5: Combined Operations

### Function Description

Execute multiple operations in a single call.

### Example

#### Example 5.1: Create Contact and Add Contacts

**Prompt:** Create a new contact named "customer_service" with existing permission "service_permission", set description to "Customer service team contact information", set location to "7x24 Online Support", add "alice" (Pre-sales Consulting) and "testuser1" (After-sales Support) to IM list.

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "customer_service",
      "permission": "service_permission"
    },
    "description": "Customer service team contact information",
    "location": "7x24 Online Support",
    "ims": {
      "op": "add",
      "im": [
        {
          "at": "alice",
          "description": "Pre-sales Consulting"
        },
        {
          "at": "testuser1",
          "description": "After-sales Support"
        }
      ]
    }
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x7a22...080b",
  "type": "Contact",
  "version": "96881",
  "change": "created"
}
```

---

## Contact + Messenger Integration Guide

### Step 1: Create Your Contact Object

Create a Contact object that will serve as your public identity for secure messaging.

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "my_contact",
      "onChain": true
    },
    "description": "My secure contact for encrypted messaging"
  }
}
```

### Step 2: Enable Messenger for Your Account

Use the [account operation](account.md) to enable Messenger for your account, linking it to your Contact object:

```json
{
  "operation": "account_operation",
  "account": "my_account",
  "messenger": "my_contact"
}
```

See [account.md](account.md) for detailed messenger configuration.

### Step 3: Start Secure Conversations

Once Messenger is enabled, you can send encrypted messages to any Contact object:

```json
{
  "operation": "send_message",
  "from": "my_account",
  "to": "recipient_contact",
  "content": "Hello! This message is end-to-end encrypted."
}
```

See [Messenger Documentation](messenger.md) for full messaging capabilities.

### Step 4: Use Contact in Service/Order (For Private Information Exchange)

When purchasing from a Service that requires private information:

**For Customers:**
1. Attach your Contact to the order via `required_info` field (see [Order](order.md#function-2-set-required-information-required_info))
2. Use Messenger to send shipping address, phone number, etc. to the service's Contact

**For Service Providers:**
1. Configure your Service with a Contact object (see [Service](service.md#sub-feature-7-configure-contact-um))
2. Customers will use this Contact to send you encrypted private information

---

## Important Notes

⚠️ **my_status is only valid when your account is already in the IM list**.

⚠️ **Contact information is publicly visible on-chain**, please set carefully. Never include sensitive personal information in the Contact description or location fields.

⚠️ **Messenger encryption**: While your Contact identity is public, all messages sent via Messenger are **end-to-end encrypted** and **never stored on-chain**. Only conversation participants can read the message content.

⚠️ **WTS for Arbitration**: If you need to prove what was discussed in a conversation (e.g., for dispute resolution), use [Messenger's WTS feature](messenger.md#generate-wts) to create a cryptographically verifiable record.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Service](service.md)** | WYSIWYG product trading - uses Contact for secure customer communication |
| **[Order](order.md)** | Order management - uses `required_info` field for private information exchange |
| **[Messenger](messenger.md)** | Secure end-to-end encrypted chat system |
| **[Account](account.md)** | Account management - includes Messenger enablement |
| **[Personal](personal.md)** | Personal on-chain portal |
| **[LocalInfo](localinfo.md)** | Private information management |
| **[Permission](permission.md)** | Permission management |
| **[Arbitration](arbitration.md)** | Dispute resolution - can use WTS from Messenger as evidence |
