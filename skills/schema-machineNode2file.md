# Schema: machineNode2file

> 📤 Export a Machine object's node definition from the blockchain to a local JSON or Markdown file for editing and creating new Machine objects.

---

## Top-Level Structure

```
MachineNode2File
├── machine: string            // Machine object ID or name to export (required)
├── file_path: string          // Output file path (absolute or relative) (required)
├── format?: "json" | "markdown"  // Output format (default: "json")
└── env?: CallEnv              // Optional environment
```

---

## Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| machine | string | Yes | Machine object ID or local name to export |
| file_path | string | Yes | Absolute or relative path for output file |
| format | "json" \| "markdown" | No | Output format. JSON = structured data; Markdown = human-readable with tables |
| env | CallEnv | No | Account, network, and other environment settings |

---

## Usage Patterns

### Pattern 1: Export for Backup

```json
{
  "machine": "my_machine",
  "file_path": "./backups/my_machine.json",
  "format": "json"
}
```

### Pattern 2: Export for Editing and Re-creation

```json
{
  "machine": "template_machine",
  "file_path": "./templates/new_machine.md",
  "format": "markdown"
}
```

**After editing**: Use the exported file as `node.json_or_markdown_file` in `onchain_operations (machine)` to create a new Machine.

---

## Output Format Details

### JSON Format

Contains the complete node definition:
- Array of `MachineNode` objects
- Each node has `name` and `pairs`
- Each pair has `prior_node`, `forwards`, and optional `threshold`
- Each forward has `name`, `namedOperator`/`permissionIndex`, `weight`, and optional `guard`

### Markdown Format

Human-readable format with:
- Machine metadata header
- Nodes as sections
- Forwards as tables within each node
- Prior node relationships as diagrams

---

## AI Planning Notes

1. **Machine immutability after publish**: After `publish=true`, nodes cannot be modified. Export → edit → create new is the standard workflow.
2. **Template reuse**: Export well-designed Machines as templates for similar business processes.
3. **Pre-publish verification**: Always export and review before publishing to catch design errors.
4. **Cross-reference with Permission**: When editing forwards with `permissionIndex`, cross-reference with the Permission object's remark table to ensure correct index mapping.
