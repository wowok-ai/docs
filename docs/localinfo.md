# LocalInfo Component (📝 Local Information)

---

## Component Overview

The LocalInfo component manages local private data, such as delivery addresses, phone numbers, contacts, etc., stored exclusively on the local device.

> **Note**: Use the `watch_and_query` tool to query all or filtered information.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Add Information** | Store private data with name/default value | Save delivery addresses, contact info | Secure local storage for sensitive personal data |
| **Remove Information** | Delete specific info entries | Remove outdated addresses/contact details | Maintains data relevance and privacy |
| **Reset Information** | Replace content of existing entries | Update address details, contact info | Allows data updates without recreating entries |
| **Clear All Information** | Delete all local info | Factory reset, data privacy protection | Ensures complete data removal when needed |

---

## Schema Tree (4-Level Structure)

```
local_info_operation
├── add
│   └── op: "add"
│   └── data (array)
│       └── [info_data]
│           ├── name (string)
│           ├── default (string)
│           ├── contents (array of strings, optional)
│           ├── createdAt (number, optional)
│           └── updatedAt (number, optional)
├── remove
│   └── op: "remove"
│   └── data (array of strings)
├── reset
│   └── op: "reset"
│   └── name (string)
│   └── contents (array of strings)
└── clear
    └── op: "clear"
```

---

## Constraint Constants

| Constant Name | Value | Description |
|---------------|-------|-------------|
| `nameMaxLength` | 64 | Maximum info name length (BCS characters) |
| `contentMaxLength` | 300 | Maximum content item length (BCS characters) |
| `contentMaxCount` | 50 | Maximum number of content items per info entry |
| `defaultName` | "Address of delivery" | Default info name |

---

## Sub-function 1: Add Information (add)

### Function Description

Add one or more local info entries. Each info entry includes name, default value, and optional additional content list for storing sensitive personal information like delivery addresses, phone numbers, etc.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `add.op` | string | Yes | Operation type | Fixed value "add" |
| `add.data` | array | Yes | Info data array | At least 1 element |
| `add.data[].name` | string | Yes | Info entry name | Max 64 BCS characters, unique identifier |
| `add.data[].default` | string | Yes | Primary/default value | Max 300 BCS characters |
| `add.data[].contents` | array | No | Additional content value array | Max 50 items, each max 300 BCS characters |
| `add.data[].createdAt` | number | No | Creation timestamp (ms) | Unix timestamp in milliseconds |
| `add.data[].updatedAt` | number | No | Last modification timestamp (ms) | Unix timestamp in milliseconds |

### Examples

#### Example 1.1: Add Minimal Info (Name + Default Value)

**Prompt:** Add a simple info entry with name "shipping_address" and default value "123 Main St, New York, NY 10001".

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": "shipping_address",
        "default": "123 Main St, New York, NY 10001"
      }
    ]
  }
}
```

**Execution Result:**
```json
{
  "success": true
}
```

#### Example 1.2: Add Info with Additional Contents

**Prompt:** Add a shipping address info entry with name "shipping_address", default value "123 Main St, New York, NY 10001", and additional contents ["10001", "Contact: Alice Smith", "Phone: +1-234-567-8900"].

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": "shipping_address",
        "default": "123 Main St, New York, NY 10001",
        "contents": ["10001", "Contact: Alice Smith", "Phone: +1-234-567-8900"]
      }
    ]
  }
}

**Execution Result:**
```json
{
  "success": true
}
```

#### Example 1.3: Add Phone Number Info

**Prompt:** Add a phone number info entry with name "phone_number", default value "+1-234-567-8900", and additional contents ["AT&T", "New York Region"].

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": "phone_number",
        "default": "+1-234-567-8900",
        "contents": ["AT&T", "New York Region"]
      }
    ]
  }
}
```

**Execution Result:**
```json
{
  "success": true
}
```

#### Example 1.4: Batch Add Multiple Info Entries

**Prompt:** Add three info entries in one call: 1) home address, 2) work address, 3) emergency contact.

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": "home_address",
        "default": "456 Park Ave, Boston, MA 02101",
        "contents": ["02101", "Residence"]
      },
      {
        "name": "work_address",
        "default": "789 Business Tower, 15th Floor, Chicago, IL",
        "contents": ["60601", "Office", "Hours: 9:00-18:00"]
      },
      {
        "name": "emergency_contact",
        "default": "Bob Johnson +1-987-654-3210"
      }
    ]
  }
}

**Execution Result:**
```json
{
  "success": true
}
```

#### Example 1.5: Add Contact Info (Multiple Content Items)

**Prompt:** Add a contact info entry for Alice Smith with name "contact_alice", default value "Alice Smith", and additional contents including email, phone, address, and note.

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": "contact_alice",
        "default": "Alice Smith",
        "contents": [
          "Email: alice.smith@example.com",
          "Phone: +1-234-567-8900",
          "Address: 123 Main St, New York, NY 10001",
          "Note: VIP Customer"
        ]
      }
    ]
  }
}

**Execution Result:**
```json
{
  "success": true
}
```

---

## Sub-function 2: Remove Information (remove)

### Function Description

Remove one or more local info entries by name.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `remove.op` | string | Yes | Operation type | Fixed value "remove" |
| `remove.data` | array | Yes | Info name array to remove | At least 1 element, string type |

### Examples

#### Example 2.1: Remove Single Info Entry

**Prompt:** Remove the info entry named "shipping_address".

```json
{
  "remove": {
    "op": "remove",
    "data": ["shipping_address"]
  }
}
```

**Execution Result:**
```json
{
  "success": true
}
```

#### Example 2.2: Batch Remove Multiple Info Entries

**Prompt:** Remove two info entries in one call: "home_address" and "phone_number".

```json
{
  "remove": {
    "op": "remove",
    "data": ["home_address", "phone_number"]
  }
}
```

**Execution Result:**
```json
{
  "success": true
}
```

---

## Sub-function 3: Reset Information Contents (reset)

### Function Description

Reset the content list of a specified info entry. This completely replaces the existing content list.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `reset.op` | string | Yes | Operation type | Fixed value "reset" |
| `reset.name` | string | Yes | Info entry name | Name of info to reset |
| `reset.contents` | array | Yes | New content list | String array, replaces existing contents |

### Examples

#### Example 3.1: Reset Info Contents

**Prompt:** Reset the contents of "work_address" to ["789 Broadway, Los Angeles, CA 90012", "90012", "Contact: Charlie Brown"].

```json
{
  "reset": {
    "op": "reset",
    "name": "work_address",
    "contents": ["789 Broadway, Los Angeles, CA 90012", "90012", "Contact: Charlie Brown"]
  }
}
```

**Execution Result:**
```json
{
  "success": true
}
```

#### Example 3.2: Clear Info Content List (Keep Name and Default Value)

**Prompt:** Clear the contents of "emergency_contact", but keep the name and default value. Set the new contents to an empty array.

```json
{
  "reset": {
    "op": "reset",
    "name": "emergency_contact",
    "contents": []
  }
}
```

**Execution Result:**
```json
{
  "success": true
}
```

#### Example 3.3: Update Contact Information

**Prompt:** Update the contact information for "contact_alice" with new email, phone, and address.

```json
{
  "reset": {
    "op": "reset",
    "name": "contact_alice",
    "contents": [
      "Email: alice.new@example.com",
      "Phone: +1-234-567-9999",
      "Address: 456 New St, Boston, MA 02101"
    ]
  }
}
```

**Execution Result:**
```json
{
  "success": true
}
```

---

## Sub-function 4: Clear All Information (clear)

### Function Description

Remove all local info entries. This operation is irreversible, use with caution.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `clear.op` | string | Yes | Operation type | Fixed value "clear" |

### Example

#### Example 4.1: Clear All Information

**Prompt:** Remove all local info entries. This operation cannot be undone.

```json
{
  "clear": {
    "op": "clear"
  }
}
```

**Execution Result:**
```json
{
  "success": true
}
```

---

## Query Local Info List

```json
{
  "query_type": "local_info_list"
}
```

---

## Best Practices

### 1. Use Secure Sandbox or Encrypted Device
Store local information on a secure sandbox environment or encrypted device.

### 2. Don't Share Device
Don't store sensitive information on shared devices.

---

## Important Notes

⚠️ **Only stored on local device!**

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[LocalMark](localmark.md)** | User/Object naming and categorization |
| **[Account](account.md)** | Local wallet management |
| **[Contact](contact.md)** | Public contact information |
