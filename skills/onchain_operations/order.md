# onchain_operations / order

Manage the order lifecycle, including arbitration, progress advancement, refunds, and setting agents.

> **Note**: Order is **MODIFY-only** — Orders are created via `service.order_new`, not directly.

## Data Schema

```typescript
CallOrder_Data {
  object: string;                   // Order ID or name (required) — MODIFY only
  
  // Manage agents
  agents?: ManyAccountOrMark_Address;
  
  // Set required info (Contact or WTS)
  required_info?: string | null;
  
  // Advance progress
  progress?: {
    operation: {
      next_node_name: string;
      forward: string;
    };
    hold?: boolean;
    adminUnhold?: boolean;
    message?: string;
  };
  
  // Submit compensation request
  arb_confirm?: {
    arb: string;                    // Arb object ID
    confirm: boolean;               // Confirm materials valid
    description?: string;
    proposition?: string[];         // Compensation claims
  };
  
  // Appeal arbitration result
  arb_objection?: {
    arb: string;
    objection: string;              // Appeal reason
  };
  
  // Claim compensation
  arb_claim_compensation?: {
    arb: string;
  };
  
  // Receive funds/objects
  receive?: QueryReceivedResult;
  
  // Transfer order ownership
  transfer_to?: AccountOrMark_Address;
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, AccountOrMark_Address, ManyAccountOrMark_Address.