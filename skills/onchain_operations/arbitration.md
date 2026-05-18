# onchain_operations / arbitration

Create arbitration rules for dispute resolution.

> **CREATE vs MODIFY**: See [_common.md](./_common.md) for the unified pattern.  
> Arbitration uses `TypedPermissionObject`: object shape = CREATE, string = MODIFY.

## Data Schema

```typescript
CallArbitration_Data {
  // Object reference - string (existing) or object (create new)
  // See _common.md: TypedPermissionObject
  object: TypedPermissionObject;
  
  // Create new Arb object for an order
  dispute?: {
    order: string;                       // Order ID or name
    description?: string;                // Dispute description
    proposition: string[];               // List of dispute propositions
    fee: CoinParam;                      // Dispute processing fee
    namedArb?: NamedObject;              // Name for newly created arbitration object
  };
  
  description?: string;                  // Introduction of the Arbitration object
  location?: string;                     // Arbitration location
  fee?: string | number;                 // Arbitration fee
  pause?: boolean;                       // Whether to pause arbitration
  
  // Confirm materials submitted for arbitration
  confirm?: {
    arb: string;                         // Arb object ID or name
    voting_deadline?: number | null;     // Voting deadline
  };
  
  // Change voting deadline
  voting_deadline_change?: {
    arb: string;                         // Arb object ID or name
    voting_deadline?: number | null;     // New voting deadline
  };
  
  // Vote on propositions
  vote?: {
    arb: string;                         // Arb object ID or name
    votes: number[];                     // Vote values (per proposition, 0-255)
    voting_guard?: string;               // Voting Guard object ID or name
  };
  
  // Provide arbitration feedback
  feedback?: {
    arb: string;                         // Arb object ID or name
    feedback: string;                    // Arbitration feedback
  };
  
  // Provide definitive arbitration result
  arbitration?: {
    arb: string;                         // Arb object ID or name
    feedback: string;                    // Arbitration feedback
    indemnity: number;                   // Indemnity amount (int >= 0)
  };
  
  // User applies to resubmit materials and restart arbitration
  reset?: {
    arb: string;                         // Arb object ID or name
    feedback: string;                    // Arbitration feedback
  };
  
  // Withdraw arbitration fees
  arb_withdraw?: {
    arb: string;                         // Arb object ID or name
  };
  
  // Distribute withdrawn arbitration fees
  fees_transfer?: {
    to: 
      | { allocation: string }           // Transfer to Allocation object
      | { treasury: string };            // Transfer to Treasury object
    payment_remark: string;              // Payment remark
    payment_index: number;               // Payment index (int >= 0)
    newPayment?: NamedObject;            // Name for new payment object
  };
  
  usage_guard?: string | null;           // Guard for verifying when users apply
  voting_guard?: VotingGuardAction;      // Guard for verifying during voting
  owner_receive?: ReceivedObjectsOrRecently;
  um?: string | null;                    // Contact object
}

// Voting guard operations (discriminated union)
VotingGuardAction = 
  | {
      op: "add" | "set";
      guards: VotingGuard[];             // Array of voting guard configs
    }
  | {
      op: "remove";
      guards: string[];                  // Guard IDs or names to remove
    }
  | {
      op: "clear";
    };
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall, TypedPermissionObject, CoinParam, NamedObject, VotingGuard, ReceivedObjectsOrRecently.