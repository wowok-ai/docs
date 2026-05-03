# Schema: local_mark_operation

> 100% LOCAL, NEVER ON-CHAIN - Manage ID names and tags stored ONLY on your local device for easy identification of user address or object IDs by name.

---

## Top-Level Structure

```typescript
LocalMarkOperation {
  // Exactly ONE operation type must be specified
  add?: AddOperation;
  remove?: RemoveOperation;
  clear?: ClearOperation;
}
```

---

## Operation Types

### add

Add one or more marks.

```typescript
AddOperation {
  op: "add";
  data: MarkParam[];  // At least 1 item required
}

MarkParam {
  address: string;    // Valid ID: 0x prefix + 64 hex chars, or builtin ID
  name?: {
    value: string;    // Mark name (max 64 bcs characters)
    replaceExistName?: boolean;  // Replace existing mark with same name
  };
  tags?: string[];    // Max 50 tags, each max 64 bcs characters
}
```

**Result**:

```typescript
AddResult {
  add: MarkData[];    // List of added mark data
}

MarkData {
  name?: string;      // Mark name (max 64 bcs characters)
  address: string;    // Valid ID
  tags?: string[];    // Tags for categorization
  createdAt?: number; // Unix timestamp (ms)
  updatedAt?: number; // Unix timestamp (ms)
}
```

---

### remove

Remove marks by name or address.

```typescript
RemoveOperation {
  op: "remove";
  names: string[];    // Array of mark names or addresses to remove (at least 1)
}
```

**Result**:

```typescript
RemoveResult {
  remove: MarkData[];  // List of removed mark data
}
```

---

### clear

Remove all marks.

```typescript
ClearOperation {
  op: "clear";
}
```

**Result**:

```typescript
ClearResult {
  clear: boolean;     // Whether all marks were successfully removed
}
```

---

## Output Structure

```typescript
LocalMarkOperationOutput {
  status: "success" | "error";
  data?: LocalMarkOperationResult;  // Present when status = "success"
  error?: string;                   // Present when status = "error"
}

LocalMarkOperationResult {
  add?: MarkData[];
  remove?: MarkData[];
  clear?: boolean;
}

// Wrapped format
{
  result: LocalMarkOperationOutput;
}
```

---

## Query Local Mark List

```typescript
QueryLocalMarkList {
  filter?: LocalMarkFilter;
}

LocalMarkFilter {
  name?: string;              // Filter by mark name (fuzzy match)
  tags?: string[];            // Filter by tags (contains ANY of specified)
  address?: string;           // Filter by address (exact match)
  createdAt?: {
    gte?: number;             // Created on or after (ms)
    lte?: number;             // Created on or before (ms)
  };
  updatedAt?: {
    gte?: number;             // Updated on or after (ms)
    lte?: number;             // Updated on or before (ms)
  };
}

QueryLocalMarkListResult {
  result: MarkData[];
}
```
