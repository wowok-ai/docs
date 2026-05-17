# onchain_operations / arbitration

Access a transparent on-chain arbitration system for resolving order conflicts.

## Data Schema

```typescript
CallArbitration_Data {
  // Object reference - string (existing) or object (create new)
  object: TypedPermissionObject;
  
  // Create new Arb for order
  dispute?: {
    order: string;                  // Order ID
    description?: string;
    proposition: string[];          // Dispute propositions
    fee: CoinParam;                 // Arbitration fee
    namedArb?: NamedObject;         // Name for new Arb
  };
  
  description?: string;             // Institution description
  location?: string;                // Arbitration location
  fee?: number;                     // Arbitration fee
  pause?: boolean;                  // Pause arbitration
  
  // Confirm user's materials
  confirm?: {
    arb: string;                    // Arb object ID
    voting_deadline: number | null;
  };
  
  // Modify voting deadline
  voting_deadline_change?: {
    arb: string;
    voting_deadline: number | null;
  };
  
  // Vote on propositions
  vote?: {
    arb: string;
    votes: number[];                // Supported proposition indices
    voting_guard?: string;          // Guard for voting
  };
  
  // Arbitration feedback
  feedback?: {
    arb: string;
    feedback: string;
  };
  
  // Final arbitration result
  arbitration?: {
    arb: string;
    feedback: string;
    indemnity: number;              // Compensation amount
  };
  
  // Request resubmission
  reset?: {
    arb: string;
    feedback: string;
  };
  
  // Withdraw arbitration fee
  arb_withdraw?: {
    arb: string;
  };
  
  // Distribute fees
  fees_transfer?: {
    to: { allocation: string } | { treasury: string };
    payment_remark: string;
    payment_index: number;
    newPayment?: NamedObject;
  };
  
  usage_guard?: string | null;      // Guard for applying
  
  // Guard for voting
  voting_guard?: {
    op: "add" | "set" | "remove" | "clear";
    guards?: {
      guard: string;
      service_identifier?: number;
    }[];
  };
  
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;               // Contact object
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, TypedPermissionObject, CoinParam, NamedObject, ReceivedObjectsOrRecently.