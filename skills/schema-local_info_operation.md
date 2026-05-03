# Schema: local_info_operation

> 100% LOCAL, NEVER ON-CHAIN - Manage sensitive personal information stored ONLY on your device: delivery addresses, phone numbers, contacts.

---

## Top-Level Structure

```typescript
LocalInfoOperation {
  // Exactly ONE operation type must be specified
  add?: AddOperation;
  remove?: RemoveOperation;
  reset?: ResetOperation;
  clear?: ClearOperation;
}
```

---

## Operation Types

### add

Add one or more info entries.

```typescript
AddOperation {
  op: "add";
  data: InfoData[];  // At least 1 item required
}

InfoData {
  name: string;       // Unique identifier (max 64 bcs characters)
  default: string;    // Primary/default value (max 300 bcs characters)
  contents?: string[]; // Additional values (max 50 items, each max 300 bcs)
  createdAt?: number; // Unix timestamp (ms)
  updatedAt?: number; // Unix timestamp (ms)
}
```

**Result**:

```typescript
AddResult {
  success: boolean;
}
```

---

### remove

Remove info entries by name.

```typescript
RemoveOperation {
  op: "remove";
  data: string[];     // Array of info names to remove (at least 1)
}
```

**Result**:

```typescript
RemoveResult {
  success: boolean;
}
```

---

### reset

Reset the contents of an existing info entry.

```typescript
ResetOperation {
  op: "reset";
  name: string;       // Name of info entry to reset
  contents: string[]; // New content list to replace existing
}
```

**Result**:

```typescript
ResetResult {
  success: boolean;
}
```

---

### clear

Remove all info entries.

```typescript
ClearOperation {
  op: "clear";
}
```

**Result**:

```typescript
ClearResult {
  success: boolean;
}
```

---

## Output Structure

```typescript
LocalInfoOperationOutput {
  status: "success" | "error";
  data?: LocalInfoOperationResult;  // Present when status = "success"
  error?: string;                   // Present when status = "error"
}

LocalInfoOperationResult {
  success: boolean;
}

// Wrapped format
{
  result: LocalInfoOperationOutput;
}
```

---

## Query Local Info List

```typescript
QueryLocalInfoList {
  filter?: LocalInfoFilter;
}

LocalInfoFilter {
  name?: string;              // Filter by info name (fuzzy match)
  default?: string;           // Filter by default value (fuzzy match)
  contents?: string[];        // Filter by contents (contains ANY of specified)
  createdAt?: {
    gte?: number;             // Created on or after (ms)
    lte?: number;             // Created on or before (ms)
  };
  updatedAt?: {
    gte?: number;             // Updated on or after (ms)
    lte?: number;             // Updated on or before (ms)
  };
}

QueryLocalInfoListResult {
  result: InfoData[];
}
```
