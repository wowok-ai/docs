# Schema: guard2file

> 📤 Export a Guard object's definition from the blockchain to a local JSON or Markdown file for editing and creating new Guard objects.

---

## Top-Level Structure

```
Guard2File
├── guard: string              // Guard object ID or name to export (required)
├── file_path: string          // Output file path (absolute or relative) (required)
├── format?: "json" | "markdown"  // Output format (default: "json")
└── env?: CallEnv              // Optional environment
```

---

## Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| guard | string | Yes | Guard object ID or local name to export |
| file_path | string | Yes | Absolute or relative path for output file |
| format | "json" \| "markdown" | No | Output format. JSON = structured data; Markdown = human-readable with tables |
| env | CallEnv | No | Account, network, and other environment settings |

---

## Usage Patterns

### Pattern 1: Export for Backup

```json
{
  "guard": "my_guard",
  "file_path": "./backups/my_guard.json",
  "format": "json"
}
```

### Pattern 2: Export for Editing and Re-creation

```json
{
  "guard": "template_guard",
  "file_path": "./templates/new_guard.md",
  "format": "markdown"
}
```

**After editing**: Use the exported file as `root.file_path` in `onchain_operations (guard)` to create a new Guard.

---

## Output Format Details

### JSON Format

Contains the complete Guard definition:
- `description`: Guard description
- `table`: Data table definitions with identifiers, types, and submission flags
- `root`: Rule tree with logic, instructions, queries, and children
- `rely`: Dependent Guard references

### Markdown Format

Human-readable format with:
- Guard metadata header
- Data table as markdown table
- Rule tree as nested structure
- Instruction and query details

---

## AI Planning Notes

1. **Guard immutability**: Guards cannot be modified after creation. Export → edit → create new is the standard workflow.
2. **Template reuse**: Export well-tested Guards as templates for similar use cases.
3. **Version control**: Store exported Guard definitions in version control for auditability.
4. **Cross-reference**: After exporting, use `wowok_buildin_info (guard instructions)` to understand instruction semantics when editing.
