# Schema: local_mark_operation

> 🔒 100% LOCAL, NEVER ON-CHAIN. Manage address aliases and tags stored ONLY on the local device for easy identification of user addresses or object IDs by name.

---

## Top-Level Structure

```
LocalMarkOperation
├── Exactly one operation type (add / remove / clear)
└── env?: { account?, network?, no_cache?, permission_guard?, referrer? }
```

---

## Operations

### add — Add One or More Marks

```
{
  "add": {
    "op": "add",
    "data": [
      {
        "address": "0x...",           // Valid WoWok ID (0x + 64 hex, or builtin ID)
        "name": {
          "value": "my_mark_name",    // Mark name (max 64 BCS chars)
          "replaceExistName": false   // Replace existing (default: false)
        },
        "tags": ["tag1", "tag2"]      // Optional tags (max 50, each max 64 chars)
      }
    ]
  }
}
```

**Address formats**:
- Standard: `0x` prefix + 64 hex characters
- Builtin IDs: `0x5`-`0x9`, `@0xaaa`, `@0xaab`, `@0x403`, `@0xacc`, `@0xc`

---

### remove — Remove Marks by Name or Address

```
{
  "remove": {
    "op": "remove",
    "names": ["mark_name_1", "mark_name_2"]
  }
}
```

**Note**: `names` array can contain mark names OR addresses.

---

### clear — Remove All Marks

```
{
  "clear": {
    "op": "clear"
  }
}
```

---

## AI Planning Notes

1. **Local-only storage**: Marks are NEVER published to the blockchain. They exist only on the current device.
2. **Cross-tool usage**: Use mark names in place of addresses across all WoWok tools (onchain_operations, query_toolkit, etc.).
3. **Naming convention**: Use descriptive names (e.g., "my_service", "arbitration_guard").
4. **Tags for organization**: Use tags to group related marks (e.g., ["infrastructure", "guards"]).
5. **Replace caution**: `replaceExistName: true` will cause the existing mark with the same name to lose its name.
