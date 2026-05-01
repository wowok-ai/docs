# Schema: wowok_buildin_info

> ℹ️ Query WoWok protocol information: constants, built-in permissions, guard instructions, current network, or value types.

---

## Top-Level Structure

```
WowokBuildinInfo
├── Exactly one info type (see below)
└── env?: { account?, network?, no_cache?, permission_guard?, referrer? }
```

---

## Info Types

### constants — Protocol Constants

```
{
  "constants": {}
}
```

**Returns**: Protocol-wide constants including:
- Token type definitions
- Gas price parameters
- Time lock defaults
- Maximum values for various fields

---

### built-in permissions — Built-in Permission Definitions

```
{
  "built-in permissions": {}
}
```

**Returns**: Complete list of built-in permission indices with descriptions.

**Critical for Permission creation**: Query this BEFORE creating Permission objects to understand available indices and their semantics.

**Key concepts**:
- Built-in indices: Predefined by the protocol (0-999)
- Custom indices: User-defined (1000-65535)
- Each index maps to a specific operation on a specific object type

---

### guard instructions — Guard Instruction Definitions

```
{
  "guard instructions": {}
}
```

**Returns**: Complete list of available Guard instructions with:
- Instruction ID
- Name
- Parameter types
- Return type
- Description

**Critical for Guard creation**: Query this BEFORE creating Guard objects to understand available validation instructions.

**Common instructions**:
- `verify_address`: Validate address format
- `verify_merkle_root`: Validate 64-char hex string
- `verify_time_elapsed`: Check time since event
- `verify_node_set`: Check if current node is in allowed set
- `verify_service_order`: Validate service-order association

---

### current network — Current Network Information

```
{
  "current network": {}
}
```

**Returns**: Current network configuration including:
- Network identifier (localnet/testnet)
- RPC endpoint
- Chain identifier

---

### value types — Supported Value Types

```
{
  "value types": {}
}
```

**Returns**: All supported value types for:
- Guard table entries
- Repository data
- Submission values

**Common types**:
- `String`: UTF-8 text
- `Address`: WoWok address (0x + 64 hex)
- `U64`: Unsigned 64-bit integer
- `U128`: Unsigned 128-bit integer
- `Bool`: Boolean
- `Vector<U8>`: Byte array

---

## AI Planning Notes

1. **Query before design**: Always query `built-in permissions` and `guard instructions` before creating Permission or Guard objects.
2. **Permission index planning**: Document custom index semantics in Permission remarks for maintainability.
3. **Guard instruction selection**: Choose instructions based on validation requirements. Combine with `logic: "and"`/`"or"` for complex rules.
4. **Value type matching**: Ensure submission values match the expected types defined in Guard tables.
5. **Network awareness**: Query `current network` to confirm the operating environment before submitting transactions.
