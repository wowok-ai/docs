# onchain_operations / guard

Create immutable programmable validation rules that return boolean results.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Guard is **CREATE-only** and immutable. No `object` field — use `namedNew` for naming.

## Data Schema

```typescript
CallGuard_Data {
  namedNew?: NamedObject;           // Name for new Guard (optional naming)
  description?: string;             // Guard description
  
  // Data table definitions
  table?: {
    identifier: number;             // 0-255
    b_submission: boolean;          // User submission required
    value_type: ValueType;          // Expected type
    value?: SupportedValue;         // Default value (if b_submission=false)
    name?: string;                  // Description
  }[];
  
  // Rule tree root (required)
  root: {
    type: "node";
    node: GuardNode;                // Direct node tree
  } | {
    type: "file";
    file_path: string;              // Load from file
    format?: "json" | "markdown";
  };
  
  // Dependent Guards
  rely?: {
    guards: string[];
    logic_or?: boolean;             // OR vs AND logic
  };
}

// GuardNode (recursive structure)
//
// The GuardNode is a recursive, strongly-typed computational tree.
// Each node has a `type` field that discriminates its behavior.
// Below are the major categories:
//
// Logic & Comparison:
//   logic_and (nodes[], 2-8) → Bool: ALL must be true
//   logic_or (nodes[], 2-8) → Bool: ANY must be true
//   logic_not (node, 1) → Bool: Inverts boolean
//   logic_equal (nodes[], 2-8) → Bool: Type+value equality
//   logic_string_contains (nodes[], 2-8) → Bool: Substring (case-sensitive)
//   logic_string_nocase_contains (nodes[], 2-8) → Bool: Substring (case-insensitive)
//   logic_string_nocase_equal (nodes[], 2-8) → Bool: String equality (ci)
//   logic_as_u256_equal (nodes[], 2-8) → Bool: Numeric equality
//   logic_as_u256_greater (nodes[], 2-8) → Bool: First > all others
//   logic_as_u256_lesser (nodes[], 2-8) → Bool: First < all others
//   logic_as_u256_greater_or_equal (nodes[], 2-8) → Bool: First >= all others
//   logic_as_u256_lesser_or_equal (nodes[], 2-8) → Bool: First <= all others
//
// Arithmetic (calc_*):
//   calc_number_add (nodes[], 2-8) → U256: Sequential addition
//   calc_number_subtract (nodes[], 2-8) → U256: Sequential subtraction
//   calc_number_multiply (nodes[], 2-8) → U256: Sequential multiplication
//   calc_number_divide (nodes[], 2-8) → U256: Sequential division
//   calc_number_mod (nodes[], 2-8) → U256: Sequential modulo
//   calc_string_length (node, 1) → U64: UTF-8 byte length
//   calc_string_contains (nodes[], 2-8) → Bool: cs substring check
//   calc_string_nocase_contains (nodes[], 2-8) → Bool: ci substring check
//   calc_string_nocase_equal (nodes[], 2-8) → Bool: ci string equality
//   calc_string_indexof (left+right+order) → U64: Find substring index
//   calc_string_nocase_indexof (left+right+order) → U64: Find substring index (ci)
//
// Type Conversion (convert_*):
//   convert_number_address (node, 1) → Address: Number → Address
//   convert_address_number (node, 1) → U256: Address → Number
//   convert_number_string (node, 1) → String: Number → String
//   convert_string_number (node, 1) → U256: Parse string as number
//   convert_safe_u8..convert_safe_u256 (node, 1) → U8..U256: Safe numeric cast
//
// Vector Operations (vec_*):
//   vec_length (node, 1) → U64: Element count
//   vec_contains_bool (nodes[], 2-8) → Bool: All values present
//   vec_contains_address (nodes[], 2-8) → Bool: Address containment
//   vec_contains_string (nodes[], 2-8) → Bool: String containment (cs)
//   vec_contains_string_nocase (nodes[], 2-8) → Bool: String containment (ci)
//   vec_contains_number (nodes[], 2-8) → Bool: Number containment
//   vec_indexof_* (left+right+order) → U64: Find index in vector
//
// WoWok Object Query:
//   query (query + object + parameters) → varies: Query on-chain data
//   identifier (identifier 0-255) → varies: Read from Guard table
//   value_type (node, 1) → U8: Get ValueType of child result
//
// Record Check Operations (record_*):
//   record_check_recipient_order (...) → Bool: Order count by recipient
//   record_check_recipient_progress (...) → Bool: Progress count by recipient
//   record_check_recipient_reward (...) → Bool: Reward count by recipient
//   record_check_treasury_history_item (...) → Bool: Treasury history
//   record_check_progress_history_item (...) → Bool: Progress history
//
// For the complete canonical list of all 70+ types, see
// the MCP source at `src/schema/query/index.ts` `GuardNodeSchema`.
GuardNode = {
  // Multi-operand nodes (2-8 children)
  logic?: "and" | "or";
  nodes: GuardNode[];
} | {
  // Single-operand nodes
  logic?: "not";
  node: GuardNode;
} | {
  // Query nodes
  type: "query";
  query: number | string;
  object: {
    identifier: number;
    convert_witness?: number;
  };
  parameters: GuardNode[];
} | {
  // Context nodes
  type: "context";
  context: "Signer" | "Clock" | "Guard";
} | {
  // Identifier nodes
  type: "identifier";
  identifier: number;
} | {
  // Constant value nodes
  type: "constant";
  value_type: ValueType;
  value: SupportedValue;
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, NamedObject.