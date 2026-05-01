# Schema: local_info_operation

> 🔒 100% LOCAL, NEVER ON-CHAIN. Manage sensitive personal information stored ONLY on the device: delivery addresses, phone numbers, contacts.

---

## Top-Level Structure

```
LocalInfoOperation
├── Exactly one operation type (add / remove / reset / clear)
└── env?: { account?, network?, no_cache?, permission_guard?, referrer? }
```

---

## Operations

### add — Add One or More Info Entries

```
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": "home_address",       // Unique identifier (max 64 BCS chars)
        "default": "123 Main St",     // Primary value (max 300 BCS chars)
        "contents": ["Apt 4B", "City, State"],  // Additional values (max 50, each max 300 chars)
        "createdAt": 1714500000000,   // Unix timestamp (ms)
        "updatedAt": 1714500000000    // Unix timestamp (ms)
      }
    ]
  }
}
```

**Required fields**: `name`, `default`
**Optional fields**: `contents`, `createdAt`, `updatedAt`

---

### remove — Remove Info Entries by Name

```
{
  "remove": {
    "op": "remove",
    "data": ["home_address", "work_phone"]
  }
}
```

---

### reset — Reset Contents of Existing Info Entry

```
{
  "reset": {
    "op": "reset",
    "name": "home_address",
    "contents": ["456 New St", "New City"]
  }
}
```

**Note**: Replaces the entire `contents` array. The `default` field remains unchanged.

---

### clear — Remove All Info Entries

```
{
  "clear": {
    "op": "clear"
  }
}
```

---

## AI Planning Notes

1. **Privacy first**: All info is stored ONLY on the local device. Never transmitted to the blockchain.
2. **Use cases**: Delivery addresses, phone numbers, email addresses, emergency contacts.
3. **Default vs contents**: `default` is the primary value; `contents` provides additional context.
4. **Timestamp handling**: Use `Date.now()` for current timestamps when creating entries.
5. **Name uniqueness**: Each info entry must have a unique `name` within the local store.
