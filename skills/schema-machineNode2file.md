# MachineNode2File Tool Schema

> **Tool Name**: `machineNode2file`
> **Description**: Export a Machine object's node definition from the blockchain to a local JSON or Markdown file for editing and creating new Machine objects. Note: To query on-chain object information, use the 'query_toolkit' tool instead.

---

## Tool Schema

```typescript
machineNode2file: MachineNode2File_Input
```

---

## Input Schema

```typescript
MachineNode2File_Input {
  machine: NameOrAddress,         // REQUIRED - Machine object ID or name to export
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
MachineNode2File_OutputWrapped {
  result: MachineNode2File_Output // MachineNode2File operation output
}

MachineNode2File_Output =
  | { status: "success"; data: MachineNode2File_SuccessData }
  | { status: "error"; error: string }
```

### Success Data

```typescript
MachineNode2File_SuccessData {
  file_path: string,              // Absolute path of the exported file
  format: "json" | "markdown",    // Export format
  machine_object: NameOrAddress,  // Machine object ID
  node_count: number              // Number of nodes exported
}
```

---

## Usage Guide

### Purpose

The `machineNode2file` tool is specifically designed to:
1. Export an existing Machine object's node definition from the blockchain
2. Save it to a local file for editing
3. Use the exported file to create new Machine objects

### When to Use

| Scenario | Tool to Use |
|----------|-------------|
| Export Machine nodes for editing | `machineNode2file` |
| Query Machine on-chain state | `query_toolkit` |
| Create new Machine | `onchain_operations` (machine) |
| Modify existing Machine nodes | `onchain_operations` (machine) |

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
// Export a Machine's nodes to JSON file
machineNode2file: {
  machine: "0x1234...abcd",       // Machine object ID
  file_path: "./my_machine.json", // Output path
  format: "json"
}

// Export a Machine's nodes to Markdown file
machineNode2file: {
  machine: "my_machine_name",     // Machine name
  file_path: "./my_machine.md",   // Output path
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
      "file_path": "/absolute/path/to/my_machine.json",
      "format": "json",
      "machine_object": "0x1234567890abcdef...",
      "node_count": 5
    }
  }
}
```

### Error Response

```json
{
  "result": {
    "status": "error",
    "error": "Machine object not found: 0x1234..."
  }
}
```
