# Contact Component (💬 Communication Hub)

---

## Component Overview

The Contact component is used to manage on-chain instant messaging contact profiles, serving as the core for secure IM address management.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Create Contact** | Set up IM contact profile | Establish team communication, service support | Enables secure on-chain messaging |
| **Manage IM List** | Add/remove contact entries | Update communication partners | Maintains current contact information |
| **Set Status** | Update availability message | Indicate online presence, response times | Improves communication efficiency |
| **Receive Objects** | Collect assets sent to contact | Accept payments, documents | Facilitates value transfer to contact owners |

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
│   │   └── op: "clear"
│   └── owner_receive (transfer received coins or NFT objects to owner, optional)
│       ├── Option 1: "recently" (string) - receive all recent objects
│       ├── Option 2: Array of received objects
│       │   └── [{ id: "object_id", type: "object_type" }]
│       └── Option 3: Received balance object
│           ├── balance (number or string)
│           ├── token_type (string)
│           └── received (array of received items)
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
| `object.name` | string | No | Local mark name | Max 64 characters |
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

#### Example 1.2: Create Contact with New Permission

**Prompt:** Create a new contact named "team_contact", create a new permission object named "team_permission", set description to "Team contact information", and add "team_member_1" with description "Product Manager" to the IM list.

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
          "at": "team_member_1",
          "description": "Product Manager"
        }
      ]
    }
  }
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

**Prompt:** Use the existing contact "service_support" and add two new contacts: "support_agent_1" with description "Technical Support" and "support_agent_2" with description "Business Consulting".

```json
{
  "operation_type": "contact",
  "data": {
    "object": "service_support",
    "ims": {
      "op": "add",
      "im": [
        {
          "at": "support_agent_1",
          "description": "Technical Support"
        },
        {
          "at": "support_agent_2",
          "description": "Business Consulting"
        }
      ]
    }
  }
}
```

#### Example 2.2: Set Contact List (Replace)

**Prompt:** Use the existing contact "team_contact" and replace the entire IM list with "designer" (description: "Designer") and "developer" (description: "Development Engineer").

```json
{
  "operation_type": "contact",
  "data": {
    "object": "team_contact",
    "ims": {
      "op": "set",
      "im": [
        {
          "at": "designer",
          "description": "Designer"
        },
        {
          "at": "developer",
          "description": "Development Engineer"
        }
      ]
    }
  }
}
```

#### Example 2.3: Remove Contacts

**Prompt:** Use the existing contact "service_support" and remove the contact named "old_agent" from the IM list.

```json
{
  "operation_type": "contact",
  "data": {
    "object": "service_support",
    "ims": {
      "op": "remove",
      "im": ["old_agent"]
    }
  }
}
```

#### Example 2.4: Clear Contacts

**Prompt:** Use the existing contact "service_support" and clear all contacts from the IM list.

```json
{
  "operation_type": "contact",
  "data": {
    "object": "service_support",
    "ims": {
      "op": "clear"
    }
  }
}
```

---

## Sub-function 3: Set Personal Status (my_status)

### Function Description

Set your status message in this contact list.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `my_status` | string | Yes | Status message |

### Important Notes

⚠️ **Only valid when your account is already in the IM list**.

### Example

**Prompt:** Use the existing contact "team_contact" and set your personal status to "Online, available for contact".

```json
{
  "operation_type": "contact",
  "data": {
    "object": "team_contact",
    "my_status": "Online, available for contact"
  }
}
```

---

## Sub-function 4: Receive Objects (owner_receive)

### Function Description

Receive objects sent to this Contact object and unwrap them to send to the permission owner.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `owner_receive.objects` | array | No | List of object IDs to receive |
| `owner_receive.recent` | boolean | No | Whether to receive recent objects |

### Example

**Prompt:** Use the existing contact "service_support" and receive all recently sent objects.

```json
{
  "operation_type": "contact",
  "data": {
    "object": "service_support",
    "owner_receive": "recently"
  }
}
```

---

## Sub-function 5: Combined Operations

### Function Description

Execute multiple operations in a single call.

### Example

#### Example 5.1: Create Contact and Add Contacts

**Prompt:** Create a new contact named "customer_service" with existing permission "service_permission", set description to "Customer service team contact information", set location to "7x24 Online Support", add "cs_agent_1" (Pre-sales Consulting) and "cs_agent_2" (After-sales Support) to IM list, and set status to "Online".

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
          "at": "cs_agent_1",
          "description": "Pre-sales Consulting"
        },
        {
          "at": "cs_agent_2",
          "description": "After-sales Support"
        }
      ]
    },
    "my_status": "Online"
  }
}
```

---

## Important Notes

⚠️ **my_status is only valid when your account is already in the IM list**.

⚠️ **Contact information is publicly visible on-chain**, please set carefully.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Service](service.md)** | WYSIWYG product trading |
| **[Personal](personal.md)** | Personal on-chain portal |
| **[Messenger](messenger.md)** | Secure end-to-end encrypted chat |
| **[LocalInfo](localinfo.md)** | Private information management |
| **[Permission](permission.md)** | Permission management |
