# onchain_operations / guard

Create immutable programmable validation rules that return boolean results.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Guard is **CREATE-only** and immutable. No `object` field — use `namedNew` for naming.

## Data Schema

```typescript
CallGuard_Data {
  namedNew?: NamedObject;             // Name for new Guard (optional naming)
  description?: string;               // Guard description (max 4000 bcs chars)
  
  // Data table definitions (uses GuardTableItemBaseSchema — no object_type field)
  table?: {
    identifier: number;               // 0-255
    b_submission: boolean;            // User submission required
    value_type: ValueType;            // Expected type
    value?: SupportedValue;           // Default value (if b_submission=false)
    name?: string;                    // Description (default: "")
  }[];
  
  // Rule tree root (required)
  root: {
    type: "node";
    node: GuardNode;                  // Direct node tree
  } | {
    type: "file";
    file_path: string;                // Path to JSON or Markdown file
    format?: "json" | "markdown";     // File format (default: "json")
  };
  
  // Dependent Guards
  rely?: {
    guards: string[];                 // Dependent Guard object IDs
    logic_or?: boolean;               // OR logic (default: AND)
  };
}
```

## Guard Root Notes

- **`root.type === "node"`**: Build the Guard computational tree directly inline using `node: GuardNode`
- **`root.type === "file"`**: Load the Guard definition from a JSON or Markdown file. The file can define `namedNew`, `description`, `table`, `root`, `rely`. Any fields defined in the schema will **OVERRIDE** the corresponding fields in the file.

## GuardNode (recursive, lazy-evaluated)

The GuardNode is a recursive, strongly-typed computational tree with 70+ node types.
Each node has a `type` field that discriminates its behavior.

For the complete canonical list of all GuardNode types, see the MCP source at `src/schema/query/index.ts` `GuardNodeSchema`.

---

See [_common.md](./_common.md) for shared types: CallEnv, NamedObject.