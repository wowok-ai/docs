# onchain_operations / personal

Manage your personal on-chain account profile and identity marks.

> **Note**: Personal has no `submission` field. There is only one Personal object per account, created automatically on first use.

## Data Schema

```typescript
CallPersonal_Data {
  description?: string;                 // Personal description
  
  referrer?: string | AccountOrMark_Address | null;  // Referrer ID for joining network
  
  // Public personal info records (discriminated union)
  information?: {
    op: "add";
    data: RecordsInEntity[];            // Records to add (PUBLIC: social handles, URLs — NEVER private data)
  } | {
    op: "remove";
    name: string[];                     // Record names to remove
  } | {
    op: "clear";
  };
  
  // Public on-chain identity mark (discriminated union)
  mark?: {
    op: "add";
    data: {
      address: string;                  // Address
      name?: string;                    // Name (optional)
      tags?: string[];                  // Tags (optional)
    }[];
  } | {
    op: "remove";
    data: {
      address: string;                  // Address
      tags?: string[];                  // Tags to remove
    }[];
  } | {
    op: "clear";
    address: ManyAccountOrMark_Address; // Addresses to clear
  } | {
    op: "transfer";
    to: string;                         // Transfer mark to another address
  } | {
    op: "replace";
    new_mark_object: string;            // Replace with new mark object ID
  } | {
    op: "destroy";                     // Permanently destroy identity mark
  };
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, AccountOrMark_Address, ManyAccountOrMark_Address.  
`RecordsInEntity` schema is defined in the MCP source at `src/schema/query/index.ts`.