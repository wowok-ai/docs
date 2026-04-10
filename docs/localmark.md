# LocalMark Component (📇 Local Marking)

---

## Component Overview

The LocalMark component manages local address book entries, storing ID names and tags exclusively on the local device. Users can use names to reference and operate on user addresses and object IDs.

> **Note**: Use the `watch_and_query` tool to query all or filtered marks.

---

## Complete Tool Call Structure

The `local_mark_operation` tool uses the following top-level structure, all sub-functions are part of this structure:

```json
{
  "add": { ... },      // Add marks
  "remove": { ... },   // Remove marks
  "clear": { ... }     // Clear all marks
}
```

**Important Rule**: Only one operation can be specified per call (only one of the above fields can exist).

---

## Constraint Constants

| Constant Name | Value | Description |
|---------------|-------|-------------|
| `nameMaxLength` | 64 | Maximum mark name length (BCS characters) |
| `tagMaxLength` | 64 | Maximum tag length (BCS characters) |
| `tagMaxCount` | 50 | Maximum number of tags per mark |

---

## Feature Tree

```
local_mark_operation
├── add (Add marks)
│   └── data: MarkParam[] (Mark parameter array, at least 1)
│       ├── name (Mark name configuration, optional)
│       │   ├── value: Mark name value (max 64 BCS characters)
│       │   └── replaceExistName: Whether to replace existing name (default false)
│       ├── address: Account or object address (required, WowAddress format)
│       └── tags: Tag array (optional, max 50 tags, each max 64 BCS characters)
├── remove (Remove marks)
│   └── names: string[] (Name or address array, at least 1)
└── clear (Clear all marks)
    └── op: "clear" (fixed value)
```

---

## Sub-feature 1: Add Marks (add)

### Feature Description

Add one or more local marks. Each mark includes name, address, and tags for local identification and classification of accounts or object IDs.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `add.op` | string | Yes | Operation type | Fixed value "add" |
| `add.data` | array | Yes | Mark data array | At least 1 element |
| `add.data[].name` | object | No | Mark name configuration | - |
| `add.data[].name.value` | string | No | Mark name | Max 64 BCS characters |
| `add.data[].name.replaceExistName` | boolean | No | Whether to replace existing name | true=replace; false=error (default) |
| `add.data[].address` | string | Yes | Account or object address | WowAddress format: 0x + 64 hex characters |
| `add.data[].tags` | array | No | Tag list | Max 50 tags, each max 64 BCS characters |

### Return Result

```json
{
  "add": [
    {
      "name": "alice",
      "address": "0x1234567890abcdef...",
      "tags": ["friend", "designer"],
      "createdAt": 1704067200000,
      "updatedAt": 1704067200000
    }
  ]
}
```

### Examples

#### Example 1.1: Add Minimal Mark (Address Only)

**Prompt**: Add a mark for an address without a name or tags. The address is "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef".

```json
{
  "add": {
    "op": "add",
    "data": [
      { "address": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" }
    ]
  }
}
```

#### Example 1.2: Add Mark with Name

**Prompt**: Add a mark with name "alice" for address "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef". Do not replace existing name if it already exists.

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": { "value": "alice" },
        "address": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
      }
    ]
  }
}
```

#### Example 1.3: Add Mark with Tags

**Prompt**: Add a mark with tags ["friend", "designer"] for address "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", without a name.

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "address": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "tags": ["friend", "designer"]
      }
    ]
  }
}
```

#### Example 1.4: Add Complete Mark (Name + Address + Tags)

**Prompt**: Add a complete mark with name "alice", address "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", and tags ["friend", "designer", "colleague"].

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": { "value": "alice" },
        "address": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "tags": ["friend", "designer", "colleague"]
      }
    ]
  }
}
```

#### Example 1.5: Add Mark and Replace Existing Name

**Prompt**: Add a mark with name "alice", address "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", and tags ["vip"]. Replace the existing name if it already exists.

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": { "value": "alice", "replaceExistName": true },
        "address": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "tags": ["vip"]
      }
    ]
  }
}
```

#### Example 1.6: Batch Add Multiple Marks

**Prompt**: Add three marks in one call: 1) name "alice" with tags ["friend"], 2) name "bob" with tags ["colleague", "developer"], 3) address-only without name or tags.

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": { "value": "alice" },
        "address": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "tags": ["friend"]
      },
      {
        "name": { "value": "bob" },
        "address": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "tags": ["colleague", "developer"]
      },
      {
        "address": "0x1111111111111111111111111111111111111111111111111111111111111111"
      }
    ]
  }
}
```

#### Example 1.7: Add Mark Without Name but With Tags

**Prompt**: Add a mark for address "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" with tags ["contract", "important"], but without a name.

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "address": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "tags": ["contract", "important"]
      }
    ]
  }
}
```

---

## Sub-feature 2: Remove Marks (remove)

### Feature Description

Remove one or more local marks by name or address.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `remove.op` | string | Yes | Operation type | Fixed value "remove" |
| `remove.names` | array | Yes | Name or address array to remove | At least 1 element, string type |

### Return Result

```json
{
  "remove": [
    {
      "name": "alice",
      "address": "0x1234567890abcdef...",
      "tags": ["friend"]
    }
  ]
}
```

### Examples

#### Example 2.1: Remove Single Mark by Name

**Prompt**: Remove the mark named "alice".

```json
{
  "remove": {
    "op": "remove",
    "names": ["alice"]
  }
}
```

#### Example 2.2: Remove Single Mark by Address

**Prompt**: Remove the mark with address "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef".

```json
{
  "remove": {
    "op": "remove",
    "names": ["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"]
  }
}
```

#### Example 2.3: Batch Remove Multiple Marks (Mixed Names and Addresses)

**Prompt**: Remove three marks in one call: "alice", address "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890", and "bob".

```json
{
  "remove": {
    "op": "remove",
    "names": [
      "alice",
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      "bob"
    ]
  }
}
```

#### Example 2.4: Batch Remove Multiple Names

**Prompt**: Remove three marks by their names: "alice", "bob", and "charlie".

```json
{
  "remove": {
    "op": "remove",
    "names": ["alice", "bob", "charlie"]
  }
}
```

#### Example 2.5: Batch Remove Multiple Addresses

**Prompt**: Remove two marks by their addresses.

```json
{
  "remove": {
    "op": "remove",
    "names": [
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
    ]
  }
}
```

---

## Sub-feature 3: Clear All Marks (clear)

### Feature Description

Remove all local marks. This operation is irreversible, use with caution.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `clear.op` | string | Yes | Operation type | Fixed value "clear" |

### Return Result

```json
{
  "clear": true
}
```

### Examples

#### Example 3.1: Clear All Marks

**Prompt**: Remove all local marks. This operation cannot be undone.

```json
{
  "clear": {
    "op": "clear"
  }
}
```

---

## Query Local Mark List

```json
{
  "query_type": "local_mark_list"
}
```

## Query with Filter

```json
{
  "query_type": "local_mark_list",
  "filter": {
    "tags": ["friend"]
  }
}
```

---

## Best Practices

### 1. Use Meaningful Names
Use easily recognizable names to mark addresses.

### 2. Use Tags for Classification
Use tags to classify and filter marks.

### 3. Don't Include Sensitive Information in Tags
Tags are for local classification only.

---

## Important Notes

⚠️ **Only stored on local device!**

---

## Related Components

- **LocalInfo**: Local information
- **Account**: Account management
- **Personal**: Public identity

