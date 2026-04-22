## Arbitration State Machine

The arbitration process follows a strict state machine with defined transitions, time constraints, and financial flows.

### State Diagram

```mermaid
stateDiagram-v2
    [*] --> PrincipalConfirming : create dispute
    PrincipalConfirming --> ArbitratorConfirming : principal_confirm
    ArbitratorConfirming --> Voting : arbitrator_confirm
    Voting --> Arbitrated : arbitration
    Arbitrated --> Finished : arb_claim_compensation
    Arbitrated --> Objectionable : objection
    Objectionable --> PrincipalConfirming : reset

    note right of PrincipalConfirming
        Status: PrincipalConfirming
        Buyer confirms dispute
    end note

    note right of ArbitratorConfirming
        Status: ArbitratorConfirming
        Arbitrator reviews case
    end note

    note right of Voting
        Status: Voting
        Voting period active
        voting_deadline must pass
    end note

    note right of Arbitrated
        Status: Arbitrated
        Ruling issued
        indemnity set
    end note

    note right of Objectionable
        Status: Objectionable
        Appeal window open
    end note

    note right of Finished
        Status: Finished
        Compensation transferred
    end note
```

### State Descriptions

| Status | Description | Entry Condition | Exit Actions |
|--------|-------------|-----------------|--------------|
| PrincipalConfirming | Buyer confirms dispute | Dispute created by buyer | Confirm or reject dispute |
| ArbitratorConfirming | Arbitrator reviews case | Buyer confirmed dispute | Arbitrator accepts case |
| Voting | Voting period active | Arbitrator accepted case | Wait for voting_deadline |
| Arbitrated | Ruling issued | voting_deadline passed | Compensation set, can claim |
| Objectionable | Appeal window open | Objection filed | Reset to review or finalize |
| Finished | Process completed | Compensation claimed | Final state |

### State Transition Rules

1. **PrincipalConfirming**
   - Entry: Buyer calls `dispute` to create arbitration
   - Exit: Buyer calls `principal_confirm` to proceed or cancel

2. **ArbitratorConfirming**
   - Entry: Buyer confirmed dispute
   - Exit: Arbitrator calls `arbitrator_confirm` to accept case

3. **Voting**
   - Entry: Arbitrator accepted case
   - Constraint: Must wait until `voting_deadline` timestamp passes
   - Exit: Arbitrator calls `arbitration` after deadline

4. **Arbitrated**
   - Entry: Arbitrator issued ruling with `indemnity` amount
   - Exit: Buyer calls `arb_claim_compensation` to receive payment, or `objection` to appeal

5. **Objectionable**
   - Entry: Buyer filed objection within appeal window
   - Exit: System resets to PrincipalConfirming for re-review

6. **Finished**
   - Entry: Compensation successfully transferred to buyer
   - Final state - no further transitions

---

## Financial Flow Diagram

```mermaid
flowchart LR
    subgraph BuyerAction["Buyer Actions"]
        B1[Pay Dispute Fee]
        B2[Submit Evidence]
        B3[Claim Compensation]
    end

    subgraph ArbProcess["Arbitration Process"]
        A1[Arb Object<br/>Fee Locked]
        A2[Voting Period]
        A3[Ruling Issued<br/>Indemnity Set]
    end

    subgraph ServiceFund["Service Compensation"]
        S1[Compensation Fund]
        S2[Deduct Indemnity]
    end

    B1 --> A1
    A1 --> A2
    A2 --> A3
    A3 --> S2
    S2 --> B3

    style B1 fill:#ffcccc
    style B3 fill:#ccffcc
    style S2 fill:#ffffcc
```

### Financial Flow Steps

1. **Buyer Pays Dispute Fee**
   - Amount: Specified in arbitration `fee` parameter
   - Destination: Locked in Arb object
   - Purpose: Prevents spam disputes, compensates arbitrators

2. **Evidence Submission**
   - Buyer and service provider submit evidence
   - Can use WoWok Messenger for encrypted communication
   - Evidence referenced via `feedback` parameter

3. **Voting Period**
   - Time window for voting on propositions
   - Duration controlled by `voting_deadline` parameter
   - No financial transactions during this phase

4. **Ruling Issued**
   - Arbitrator determines `indemnity` amount
   - Amount deducted from Service compensation fund
   - Ruling recorded on-chain with timestamp

5. **Compensation Claimed**
   - Buyer receives `indemnity` amount
   - Transaction completes arbitration process
   - Arb object status changes to Finished (5)

---

## Evidence Submission Sequence

```mermaid
sequenceDiagram
    participant Buyer as Buyer
    participant Messenger as WoWok Messenger
    participant Arb as Arb Object
    participant Arbitrator as Arbitrator

    Buyer->>Messenger: Send encrypted evidence
    Messenger-->>Buyer: Return message hash
    Buyer->>Arb: dispute(feedback=hash)
    Arb-->>Buyer: Dispute created (Status 0)

    Buyer->>Arb: principal_confirm(true)
    Arb-->>Arb: Status 0→1

    Arbitrator->>Arb: arbitrator_confirm()
    Arb-->>Arb: Status 1→2

    Note over Arb: Wait for voting_deadline

    Arbitrator->>Arb: arbitration(feedback, indemnity)
    Arb-->>Arb: Status 2→3<br/>Indemnity locked

    Buyer->>Arb: arb_claim_compensation()
    Arb-->>Buyer: Transfer indemnity
    Arb-->>Arb: Status 3→5
```

### Evidence Submission Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| **Plain Text** | Direct string in `feedback` parameter | Simple disputes, public resolution |
| **IPFS Hash** | Content-addressed storage reference | Large files, documents, images |
| **WoWok Messenger** | Encrypted on-chain messaging | Sensitive information, private disputes |
| **External Link** | URL with verification hash | Third-party evidence, timestamps |

---

## Time Constraints

```mermaid
gantt
    title Arbitration Timeline Example
    dateFormat X
    axisFormat %s

    section Dispute
    Create Dispute           :a1, 0, 1s
    Principal Confirm        :a2, after a1, 1s
    Arbitrator Confirm       :a3, after a2, 1s

    section Voting
    Voting Period            :crit, a4, after a3, 10s

    section Ruling
    Issue Arbitration        :a5, after a4, 1s
    Claim Compensation       :a6, after a5, 5s

    section Complete
    Finished                 :milestone, after a6, 0s
```

### Time Parameter Guidelines

| Parameter | Typical Value | Minimum | Purpose |
|-----------|---------------|---------|---------|
| `voting_deadline` | 7 days | 10 seconds | Allow time for evidence review |
| Appeal window | 3 days | 1 hour | Time to file objections |
| Evidence submission | Before voting_deadline | - | Ensure evidence is available |

---

## Permission Requirements by State

```mermaid
flowchart TB
    subgraph State0["Status 0: PrincipalConfirming"]
        P0[principal_confirm] -->|Buyer| C0{Confirm?}
        C0 -->|true| S1[Status 1]
        C0 -->|false| Cancel[Cancel Dispute]
    end

    subgraph State1["Status 1: ArbitratorConfirming"]
        P1[arbitrator_confirm] -->|Arbitrator| S2[Status 2]
    end

    subgraph State2["Status 2: Voting"]
        P2[arbitration] -->|Arbitrator +<br/>voting_deadline passed| S3[Status 3]
    end

    subgraph State3["Status 3: Arbitrated"]
        P3a[arb_claim_compensation] -->|Buyer| S5[Status 5]
        P3b[objection] -->|Buyer| S4[Status 4]
    end

    subgraph State4["Status 4: Objectionable"]
        P4[reset] -->|System| S0[Status 0]
    end

    S1 --> State1
    S2 --> State2
    S3 --> State3
    S4 --> State4
    S5 --> Finished[Finished]
```

### Permission Matrix

| Operation | Status Required | Actor | Additional Requirements |
|-----------|-----------------|-------|------------------------|
| `dispute` | - | Buyer | Order owner, arbitration unpaused |
| `principal_confirm` | 0 | Buyer | Must be dispute initiator |
| `arbitrator_confirm` | 1 | Arbitrator | Must be designated arbitrator |
| `arbitration` | 2 | Arbitrator | `voting_deadline` must pass |
| `arb_claim_compensation` | 3 | Buyer | Order owner, indemnity > 0 |
| `objection` | 3 | Buyer | Within appeal window |
| `reset` | 4 | System | Automatic on objection |
