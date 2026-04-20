# LocalMark Component (📇 Local Marking)

---

## Component Overview

The LocalMark component manages local address book entries, storing ID names and tags exclusively on the local device. Users can use names to reference and operate on user addresses and object IDs.

> **Note**: Use the `watch_and_query` tool to query all or filtered marks.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Add Marks** | Create local address-book entries | Save frequently used addresses with names/tags | Enables human-readable references for addresses/objects |
| **Remove Marks** | Delete local marks by name/address | Clean up outdated or incorrect entries | Maintains address book accuracy |
| **Clear All Marks** | Delete all local marks | Reset address book, privacy protection | Provides bulk cleanup capability |

---

## Schema Tree (4-Level Structure)

```
local_mark_operation
├── add
│   └── op: "add"
│   └── data (array)
│       └── [mark_param]
│           ├── name (object, optional)
│           │   ├── value (string)
│           │   └── replaceExistName (boolean, optional)
│           ├── address (string)
│           └── tags (array of strings, optional)
├── remove
│   └── op: "remove"
│   └── names (array of strings)
└── clear
    └── op: "clear"
```

---

## Constraint Constants

| Constant Name | Value | Description |
|---------------|-------|-------------|
| `nameMaxLength` | 64 | Maximum mark name length (BCS characters) |
| `tagMaxLength` | 64 | Maximum tag length (BCS characters) |
| `tagMaxCount` | 50 | Maximum number of tags per mark |

---

## Sub-function 1: Add Marks (add)

### Function Description

Add one or more local marks. Each mark includes name, address, and tags for local identification and classification of accounts or object IDs.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `add.op` | string | Yes | Operation type | Fixed value "add" |
| `add.data` | array | Yes | Mark data array | At least 1 element |
| `add.data[].name` | object | No | Mark name configuration | - |
| `add.data[].name.value` | string | No | Mark name | Max 64 BCS characters |
| `add.data[].name.replaceExistName` | boolean | No | Whether to replace existing name | true=replace; false=error (default) |
| `add.data[].address` | string | Yes | Account or object address | WowAddress format: 0x + 64 hex characters |
| `add.data[].tags` | array | No | Tag list | Max 50 tags, each max 64 BCS characters |

### Examples

#### Example 1.1: Add Minimal Mark (Address Only)

**Prompt:** Add a mark for an address without a name or tags.

```json
{
  "add": {
    "op": "add",
    "data": [
      { "address": "0xe639a6382527a57e9213ad08b65f6b6cbd6fcc827356a2ab34f63f42c7c32e82" }
    ]
  }
}
```

**Execution Result:**
```json
{
  "add": [
    {
      "address": "0xe639...2e82",
      "createdAt": 1776658023742,
      "updatedAt": 1776658023742
    }
  ]
}
```

#### Example 1.2: Add Mark with Name

**Prompt:** Add a mark with name "alice" for address. Do not replace existing name if it already exists.

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": { "value": "alice" },
        "address": "0x531a921e6ec7ea894ee293f94ae03d586b167ed53ff4877599e41522ad92be66"
      }
    ]
  }
}
```

**Execution Result:**
```json
{
  "add": [
    {
      "name": "alice",
      "address": "0x531a...be66",
      "createdAt": 1776658030346,
      "updatedAt": 1776658030346
    }
  ]
}
```

#### Example 1.3: Add Mark with Tags

**Prompt:** Add a mark with tags ["friend", "designer"] for address, without a name.

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "address": "0x24008bde7867f17fc210785b5195f5de8ac605cc9d5269eaebb99002944ae3b3",
        "tags": ["friend", "designer"]
      }
    ]
  }
}
```

**Execution Result:**
```json
{
  "add": [
    {
      "address": "0x2400...e3b3",
      "tags": ["friend", "designer"],
      "createdAt": 1776658033799,
      "updatedAt": 1776658033799
    }
  ]
}
```

#### Example 1.4: Add Complete Mark (Name + Address + Tags)

**Prompt:** Add a complete mark with name "bob", address, and tags ["friend", "designer", "colleague"].

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": { "value": "bob" },
        "address": "0x2bce0d2c3060e426ed93f65d0a7afbc7a0653e2813b972c088faaab9ce504937",
        "tags": ["friend", "designer", "colleague"]
      }
    ]
  }
}
```

**Execution Result:**
```json
{
  "add": [
    {
      "name": "bob",
      "address": "0x2bce...4937",
      "tags": ["friend", "designer", "colleague"],
      "createdAt": 1776658036962,
      "updatedAt": 1776658036962
    }
  ]
}
```

#### Example 1.5: Add Mark and Replace Existing Name

**Prompt:** Add a mark with name "alice", address, and tags ["vip"]. Replace the existing name if it already exists.

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": { "value": "alice", "replaceExistName": true },
        "address": "0x03174f2f61766b2135c9822039fddd1ec0f5e11661e0805f1618fca08288b606",
        "tags": ["vip"]
      }
    ]
  }
}
```

**Execution Result:**
```json
{
  "add": [
    {
      "name": "alice",
      "address": "0x0317...b606",
      "tags": ["vip"],
      "createdAt": 1776658040182,
      "updatedAt": 1776658040182
    }
  ]
}
```

#### Example 1.6: Batch Add Multiple Marks

**Prompt:** Add three marks in one call: 1) name "charlie" with tags ["friend"], 2) name "dave" with tags ["colleague", "developer"], 3) address-only without name or tags.

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": { "value": "charlie" },
        "address": "0x499773f65060e35c1b8acee9452083b2ee078155f02c39b30ec12ab4692bbb7a",
        "tags": ["friend"]
      },
      {
        "name": { "value": "dave" },
        "address": "0xef686f7f13ce876f498b4fb293046620bf3754cc82541d7b06909ec53b479b3d",
        "tags": ["colleague", "developer"]
      },
      {
        "address": "0xa5396433f8ea8802dc338d9eba91da916bfeb1eb8ce76adc44e3a32a5635063f"
      }
    ]
  }
}
```

**Execution Result:**
```json
{
  "add": [
    {
      "name": "charlie",
      "address": "0x4997...bb7a",
      "tags": ["friend"],
      "createdAt": 1776658044403,
      "updatedAt": 1776658044403
    },
    {
      "name": "dave",
      "address": "0xef68...9b3d",
      "tags": ["colleague", "developer"],
      "createdAt": 1776658044403,
      "updatedAt": 1776658044403
    },
    {
      "address": "0xa539...063f",
      "createdAt": 1776658044403,
      "updatedAt": 1776658044403
    }
  ]
}
```

#### Example 1.7: Add Mark Without Name but With Tags

**Prompt:** Add a mark for address with tags ["contract", "important"], but without a name.

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "address": "0xfe9262f13c663112a17b6ad17252e4fd1aa75d4c4e8ea3d805e20ff63eb1aa35",
        "tags": ["contract", "important"]
      }
    ]
  }
}
```

**Execution Result:**
```json
{
  "add": [
    {
      "address": "0xfe92...aa35",
      "tags": ["contract", "important"],
      "createdAt": 1776658047449,
      "updatedAt": 1776658047449
    }
  ]
}
```

---

## Sub-function 2: Remove Marks (remove)

### Function Description

Remove one or more local marks by name or address.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `remove.op` | string | Yes | Operation type | Fixed value "remove" |
| `remove.names` | array | Yes | Name or address array to remove | At least 1 element, string type |

### Examples

#### Example 2.1: Remove Single Mark by Name

**Prompt:** Remove the mark named "alice".

```json
{
  "remove": {
    "op": "remove",
    "names": ["alice"]
  }
}
```

**Execution Result:**
```json
{
  "remove": [
    {
      "name": "alice",
      "address": "0x0317...b606",
      "tags": ["vip"],
      "createdAt": 1776658040182,
      "updatedAt": 1776658040182
    }
  ]
}
```

#### Example 2.2: Remove Single Mark by Address

**Prompt:** Remove the mark by address.

```json
{
  "remove": {
    "op": "remove",
    "names": ["0xe639a6382527a57e9213ad08b65f6b6cbd6fcc827356a2ab34f63f42c7c32e82"]
  }
}
```

**Execution Result:**
```json
{
  "remove": [
    {
      "address": "0xe639...2e82",
      "createdAt": 1776658023742,
      "updatedAt": 1776658023742
    }
  ]
}
```

#### Example 2.3: Batch Remove Multiple Marks (Mixed Names and Addresses)

**Prompt:** Remove three marks in one call: "bob", address, and "charlie".

```json
{
  "remove": {
    "op": "remove",
    "names": [
      "bob",
      "0x24008bde7867f17fc210785b5195f5de8ac605cc9d5269eaebb99002944ae3b3",
      "charlie"
    ]
  }
}
```

**Execution Result:**
```json
{
  "remove": [
    {
      "address": "0x2400...e3b3",
      "tags": ["friend", "designer"],
      "createdAt": 1776658033799,
      "updatedAt": 1776658033799
    },
    {
      "name": "bob",
      "address": "0x2bce...4937",
      "tags": ["friend", "designer", "colleague"],
      "createdAt": 1776658036962,
      "updatedAt": 1776658036962
    },
    {
      "name": "charlie",
      "address": "0x4997...bb7a",
      "tags": ["friend"],
      "createdAt": 1776658044403,
      "updatedAt": 1776658044403
    }
  ]
}
```

#### Example 2.4: Batch Remove Multiple Names

**Prompt:** Remove the mark by name "dave".

```json
{
  "remove": {
    "op": "remove",
    "names": ["dave"]
  }
}
```

**Execution Result:**
```json
{
  "remove": [
    {
      "name": "dave",
      "address": "0xef68...9b3d",
      "tags": ["colleague", "developer"],
      "createdAt": 1776658044403,
      "updatedAt": 1776658044403
    }
  ]
}
```

#### Example 2.5: Batch Remove Multiple Addresses

**Prompt:** Remove two marks by their addresses.

```json
{
  "remove": {
    "op": "remove",
    "names": [
      "0xa5396433f8ea8802dc338d9eba91da916bfeb1eb8ce76adc44e3a32a5635063f",
      "0xfe9262f13c663112a17b6ad17252e4fd1aa75d4c4e8ea3d805e20ff63eb1aa35"
    ]
  }
}
```

**Execution Result:**
```json
{
  "remove": [
    {
      "address": "0xa539...063f",
      "createdAt": 1776658044403,
      "updatedAt": 1776658044403
    },
    {
      "address": "0xfe92...aa35",
      "tags": ["contract", "important"],
      "createdAt": 1776658047449,
      "updatedAt": 1776658047449
    }
  ]
}
```

---

## Sub-function 3: Clear All Marks (clear)

### Function Description

Remove all local marks. This operation is irreversible, use with caution.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `clear.op` | string | Yes | Operation type | Fixed value "clear" |

### Example

#### Example 3.1: Clear All Marks

**Prompt:** Remove all local marks. This operation cannot be undone.

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
  "clear": true
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

| Component | Description |
|-----------|-------------|
| **[LocalInfo](localinfo.md)** | Private information management |
| **[Account](account.md)** | Local wallet management |
| **[Personal](personal.md)** | Personal on-chain portal |
