# onchain_operations / order

Track and manage service delivery lifecycle — progress, arbitration, compensation.

> **Note**: Order is **MODIFY-only**.

## Data Schema

```typescript
CallOrder_Data {
  object: NameOrAddress;                 // Order object ID or name (required)
  
  agents?: ManyAccountOrMark_Address;   // Order agents (operate, but cannot receive funds)
  
  required_info?: NameOrAddress | null; // Contact object ID (recipient) or WTS Proof (delivery proof)
  
  // Advance order progress workflow
  progress?: {
    operation: {
      next_node_name: string;           // Target node name (max 64 bcs chars)
      forward: string;                  // Forward (operation) name (max 64 bcs chars)
    };
    hold?: boolean;                     // Lock operation permission
    adminUnhold?: boolean;              // Allow admin to force unlock
    message?: string;                   // Operation note
  };
  
  // Submit compensation request and apply for arbitration
  arb_confirm?: {
    arb: NameOrAddress;                 // Arb object ID or name
    confirm: boolean;                   // Confirm arbitration materials are valid
    description?: string;               // Message description for compensation (max 4000 bcs chars)
    proposition?: string[];             // Compensation claims (each max 256 bcs chars)
  };
  
  // Oppose and appeal arbitration result
  arb_objection?: {
    arb: NameOrAddress;                 // Arb object ID or name
    objection: string;                  // Reason for objection (max 4000 bcs chars)
  };
  
  // Claim order compensation from adjudicated Arb
  arb_claim_compensation?: {
    arb: NameOrAddress;                 // Arb object ID or name
  };
  
  // Unwrap received CoinWrappers/objects and transfer to owner
  receive?: QueryReceivedResult;
  
  transfer_to?: AccountOrMark_Address;  // Transfer order ownership
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, ManyAccountOrMark_Address, AccountOrMark_Address, QueryReceivedResult.