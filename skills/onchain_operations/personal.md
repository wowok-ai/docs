# onchain_operations / personal

Establish and manage your on-chain public identity. **CRITICAL: Everything here is PERMANENTLY PUBLIC on the blockchain!**

> **Note**: Personal is **MODIFY-only** — Personal identity is auto-created on first use, then modified via this operation.

## Data Schema

```typescript
CallPersonal_Data {
  description?: string;             // Public description — MODIFY only
  
  referrer?: string | AccountOrMark_Address | null; // Referrer for joining network
  
  // PUBLIC on-chain personal info (discriminated union)
  information?: {
    op: "add";
    data: {                        // Records to add
      name: string;                // Record name (social handle, URL, etc.)
      value_type: ValueType;       // Value type
      value: SupportedValue;       // Value
    }[];
  } | {
    op: "remove";
    name: string[];                // Record names to remove
  } | {
    op: "clear";
  };
  
  // PUBLIC on-chain identity mark (discriminated union)
  mark?: {
    op: "add";
    data: {
      address: string;             // Address to mark
      name?: string;               // Mark name
      tags?: string[];             // Tags
    }[];
  } | {
    op: "remove";
    data: {
      address: string;
      tags?: string[];
    }[];
  } | {
    op: "clear";
    address: ManyAccountOrMark_Address;
  } | {
    op: "transfer";                // Transfer mark to another address
    to: AccountOrMark_Address;
  } | {
    op: "replace";                 // Replace with new mark object
    new_mark_object: string;
  } | {
    op: "destroy";                 // Permanently destroy mark
  };
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, AccountOrMark_Address, ManyAccountOrMark_Address.