# Guard2File Tool Schema

> **Tool Name**: `guard2file`
> **Description**: Export a Guard object's definition from the blockchain to a local JSON or Markdown file for editing and creating new Guard objects. Note: To query on-chain object information, use the 'query_toolkit' tool instead.

---

## Tool Schema

```typescript
guard2file: Guard2File_Input
```

---

## Input Schema

```typescript
Guard2File_Input {
  guard: NameOrAddress,           // REQUIRED - Guard object ID or name to export
  file_path: string,              // REQUIRED - Output file path (absolute or relative)
  format?: "json" | "markdown",   // OPTIONAL - Output format (default: 'json')
  env?: CallEnv                   // OPTIONAL - Environment configuration
}
```

---

## Sub Schemas

### NameOrAddress

```typescript
NameOrAddress = string           // Object ID (0x prefix + 64 hex chars) or name (max 64 chars)
```

### CallEnv

```typescript
CallEnv {
  account?: NameOrAddress,        // Account/Object name or ID for signing
  network?: "localnet" | "testnet", // Network entrypoint
  no_cache?: boolean,             // Whether to disable caching
  permission_guard?: string[],    // Permission guard IDs for extended permissions
  referrer?: string               // Referrer ID for first-time network users
}
```

---

## Output Schema

```typescript
Guard2File_OutputWrapped {
  result: Guard2File_Output       // Guard2File operation output
}

Guard2File_Output =
  | { status: "success"; data: Guard2File_SuccessData }
  | { status: "error"; error: string }
```

### Success Data

```typescript
Guard2File_SuccessData {
  file_path: string,              // Absolute path of the exported file
  format: "json" | "markdown",    // Export format
  guard_object: string            // Guard object ID
}
```

---

## Usage Guide

### Purpose

The `guard2file` tool is specifically designed to:
1. Export an existing Guard object's definition from the blockchain
2. Save it to a local file for editing
3. Use the exported file to create new Guard objects

### When to Use

| Scenario | Tool to Use |
|----------|-------------|
| Export Guard for editing | `guard2file` |
| Query Guard on-chain state | `query_toolkit` |
| Create new Guard | `onchain_operations` (guard) |
| Modify existing Guard | `onchain_operations` (guard) |

### File Formats

**JSON Format** (`format: "json"`):
- Machine-readable format
- Suitable for programmatic processing
- Default format

**Markdown Format** (`format: "markdown"`):
- Human-readable format with comments
- Suitable for manual editing
- Includes documentation

---

## Example

```typescript
// Export a Guard to JSON file
guard2file: {
  guard: "0x1234...abcd",         // Guard object ID
  file_path: "./my_guard.json",   // Output path
  format: "json"
}

// Export a Guard to Markdown file
guard2file: {
  guard: "my_guard_name",         // Guard name
  file_path: "./my_guard.md",     // Output path
  format: "markdown"
}
```

---

## Output Examples

### Success Response

```json
{
  "result": {
    "status": "success",
    "data": {
      "file_path": "/absolute/path/to/my_guard.json",
      "format": "json",
      "guard_object": "0x1234567890abcdef..."
    }
  }
}
```

### Error Response

```json
{
  "result": {
    "status": "error",
    "error": "Guard object not found: 0x1234..."
  }
}
```
