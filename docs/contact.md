# Contact Component (💬 Communication Hub)

---

## Component Overview

The Contact component is used to manage on-chain instant messaging contact profiles, serving as the core for secure IM address management.

---

## Function Tree

```
Contact Component
├── Create New Contact
│   ├── Set Name (object.name)
│   ├── Bind Permission (object.permission)
│   ├── Set Description (description)
│   └── Set Location (location)
├── Manage IM Contact List (ims)
│   ├── Add Contact (ims.op = "add")
│   ├── Set Contact List (ims.op = "set")
│   ├── Remove Contact (ims.op = "remove")
│   └── Clear Contacts (ims.op = "clear")
├── Set Personal Status (my_status)
└── Receive Objects (owner_receive)
```

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

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "service_support"
    },
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

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "team_contact"
    },
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

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "service_support"
    },
    "ims": {
      "op": "remove",
      "im": ["old_agent"]
    }
  }
}
```

#### Example 2.4: Clear Contacts

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "service_support"
    },
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

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "team_contact"
    },
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

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "service_support"
    },
    "owner_receive": {
      "recent": true
    }
  }
}
```

---

## Sub-function 5: Combined Operations

### Function Description

Execute multiple operations in a single call.

### Example

#### Example 5.1: Create Contact and Add Contacts

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

- **Service**: Service marketplace
- **Personal**: Public identity
- **Messenger**: Encrypted messaging
- **LocalInfo**: Local information
- **Permission**: Permission management
