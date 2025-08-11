# Treasury Object: Your Smart Money Manager

> "Money with manners. You set the rules; the contract enforces them."

## Overview

### Definition

Programmable on-chain cashbox for multi-party fund management, supporting condition-based deposits and withdrawals, with full transaction history and auditability.

### Functionality

Treasury securely manages the inflow and outflow of assets for individuals, organizations, or communities. It integrates Guards to control who can deposit or withdraw, under what conditions, and to what extent. All financial interactions—including reward distribution, staking, deposits, and conditional refunds—are recorded immutably on-chain.

Treasury supports three operational modes:

1. **Internal mode** — withdrawals based on permissions; flexible but high-risk.
2. **External mode** — deposits are open, withdrawals must satisfy Guard conditions.
3. **Hybrid mode** — both internal and external withdrawals are allowed, with individual Guard rules for each address.

### Use Cases

- **Internal Treasury (Example: Employee Bonus)**
  A travel company allocates yearly bonuses through Treasury to guides based on internal policy. No fixed withdrawal limit is set—permissive but risk-prone.

- **External Treasury (Example: Peer Recognition Reward)**
  During a Kenya wildlife trip, Tom rewards fellow travelers using a Treasury. He sets Guard-based conditions (e.g., Alice helped spot a rare bird) and adds her address to the withdrawal list. Upon verification, the system releases funds to Alice automatically and records it immutably.

- **Hybrid Treasury (Example: Service Deposit Escrow)**
  Tour operators or hotels deposit a service guarantee.

  - If the traveler confirms satisfaction, the deposit is released.
  - If not, a portion may be withheld for compensation.
    This model builds trust and ensures service quality through automatic, rule-based enforcement.

### Key Features

- **Guard-controlled deposits & withdrawals** — customizable access rules for each participant
- **Full transaction history** — all inflows/outflows are verifiable and queryable
- **Support for multiple currencies** — flexible asset management in multi-token environments
- **Programmable payout conditions** — automate rewards, refunds, or penalties
- **Transparent & auditable operations** — ideal for DAOs, communities, and high-trust systems
- **Three operating modes** — internal, external, or hybrid fund governance

Treasury is essential infrastructure for any project or organization requiring automated, transparent, and decentralized financial coordination.

## What You'll Build (30 seconds)

By the end, you will have three working treasuries and understand automated fund management:

- **Personal Treasury** — your controlled fund with deposit/withdraw basics
- **Team Treasury** — role-based access (admin, member, contributor permissions)
- **Smart Treasury** — Guard-controlled conditional withdrawals

**Prereqs**: You already created Personal and Permission objects. Network is `sui testnet`. Token type is `0x2::sui::SUI`.

**Pre-flight** (copy one line):

```
"On sui testnet, show my default account and SUI balance; if low, guide me to the faucet and wait for funds."
```

---

## 🎯 Level 1 — Foundation (make it work)

**Scenario**: You need a programmable cashbox that tracks every movement.

**Your Mission**: Create your first Treasury and prove deposit/withdraw works.

**Try This**:

```
"Create Personal Treasury for 0x2::sui::SUI on sui testnet. Return the treasury address, the permission address, and an on-chain view link. Then deposit 3 SUI and withdraw 1 SUI."
```

**Success Looks Like**:

- ✅ You see both addresses and the on-chain link
- ✅ History shows one deposit and one withdrawal
- ✅ Balance reflects the movements (2 SUI remaining)
- ✅ You understand this Treasury is separate from your personal account

**Why This Matters**: Treasury objects provide:

- **Separation**: Funds are held separately from personal accounts
- **Transparency**: All transactions are recorded and auditable
- **Access Control**: You can control who can deposit/withdraw
- **Integration**: Other Wowok objects can interact with your Treasury

This Treasury becomes your programmable cashbox for later automation - think of it as a smart bank account that can follow complex rules!

---

## 🎯 Level 2 — Application (roles without headaches)

**Scenario**: Different people, different powers.

**Your Mission**: Bind roles so the right person can deposit or withdraw.

**Try This**:

```
"I want to create a Team Treasury with role-based access. First, help me create two test accounts named 'Alice' and 'Bob' if I don't have them yet. Then create a Team Treasury for 0x2::sui::SUI, bind it to my Permission object, and set up roles: give me admin rights, Alice deposit rights, Bob withdraw rights. Finally, demonstrate the system by showing one deposit by Alice, one withdrawal by Bob, and one rejected withdrawal by an unknown address with the rejection reason."
```

**Success Looks Like**:

- ✅ Alice succeeds depositing; Bob succeeds withdrawing
- ✅ Unknown address gets a clear "permission denied" message
- ✅ You can explain why an action failed (based on the tool's message)
- ✅ You understand how Permission and Treasury objects work together seamlessly

**Why This Matters**: This permission-controlled Treasury model is perfect for:

- **Team funds**: Shared budgets with role-based access
- **Community treasuries**: Democratic fund management
- **Project budgets**: Different access levels for different roles
- **Automated systems**: Treasuries that other objects can interact with

**Pro Tip**: Keep names simple. The tool can always print the address it actually used. This role-based approach eliminates the "who can touch the money" headaches!

---

## 🎯 Level 3 — Integration (guards: "not yet" and "enough")

**Scenario**: You want timing and limits, not just "yes/no".

**Your Mission**: Add a time-lock and a per-address cap to control withdrawals.

**Try This A — Time-lock**:

```
"Create Smart Treasury for 0x2::sui::SUI. Add a guard: withdrawals allowed 5 minutes after creation. Return addresses and link. Try to withdraw 1 SUI now (expect fail), then after 5 minutes (expect success)."
```

**Try This B — Whitelist + Caps**:

```
"Create Guarded Treasury for 0x2::sui::SUI. Allow only Bob (create this account if needed) to withdraw: ≤5 SUI per withdrawal, ≤12 SUI total. Show one success within limits and the final rejection when the cap is reached, including the field that failed."
```

**Success Looks Like**:

- ✅ Time-lock blocks early, allows later
- ✅ Caps allow within limits, reject above limits with a clear reason
- ✅ You can point to the specific guard check that blocked the action
- ✅ You understand how this enables automated milestone payouts

**Why This Matters**: Guard-controlled Treasuries enable:

- **Automated milestone payouts**: Funds released when conditions are met
- **Time-locked savings**: Funds that can't be withdrawn until a specific date
- **Spending limits**: Per-user or per-time-period withdrawal caps
- **Complex business logic**: Multi-condition fund management

**Level Up**: These guards plug into Service / Order / Machine for milestone payouts. You're building the financial infrastructure for sophisticated automated businesses!

---

## 💡 Mini Challenge — Milestone Payouts (tiny demo)

**Goal**: Release 30% on milestone pass, the rest on final pass; refund unused on emergency cancel.

**Try This**:

```
"Create Project Treasury for 0x2::sui::SUI. Add guards: Milestone 30%, Final 100% (remaining), Emergency refund unused with proof. Show addresses, links, and balances for each path."
```

**Creative Ideas**:

- **Freelance escrow**: Client funds held until milestones completed
- **Team savings**: Group fund with spending approval requirements
- **Subscription service**: Automated recurring payments with caps
- **Investment pool**: Community fund with withdrawal voting

**Share Your Creation**: Post about your milestone payout system and how you're using Treasury objects for automated project funding!

---

## 🔧 Troubleshooting (friendly and fast)

**Schema error** → Create a minimal Treasury first; add features step by step.

**Low balance** → Use the testnet faucet, wait for confirmation, retry.

**Permission denied** → Print current roles; bind or fix assignments.

**Name not found** → Use the address returned earlier.

**Guard "not working"** → Check the time window and the exact limit values.

**Reset, without losing learning**:

- Note the Treasury address and failed tx hash
- Create a clean Treasury and verify deposit/withdraw
- Re-add roles, then guards, verifying each step
- Mark the old Treasury as deprecated to avoid mistakes

**Alternative Approaches**:

- **Simpler version**: "Create a Treasury that only I can control"
- **Different focus**: "Focus on deposits and withdrawals first, add permissions later"

**Common Use Cases**:

- **Team project fund**: Multiple contributors, milestone-based withdrawals
- **Savings circle**: Group savings with time-locked withdrawals
- **Service escrow**: Customer payments held until service completion
- **Community treasury**: Democratic fund management with voting

**Need help?**: The community has great examples of Treasury patterns for different use cases!

---

## ✅ Ready for More?

**You've Unlocked**:

- 💰 **Fund Management**: You can create and manage shared funds with transparent transactions
- 👥 **Multi-User Access**: You can give different people different levels of access to funds
- 🔐 **Conditional Logic**: You can set up rules that control when and how funds can be withdrawn
- 📊 **Financial Transparency**: All fund movements are recorded and auditable on-chain

**Next Up**: **Guard Objects** — Learn how to create smart conditions that can control not just Treasury withdrawals, but any operation in your Wowok ecosystem!

**Quick Check**: Can you deposit funds into your Treasury and withdraw them? Can you explain how your Treasury's permission system works? If yes, you're ready to learn about conditional logic!

---

## 🌟 What Makes Treasury Objects Special?

Unlike traditional shared accounts or funds, Wowok Treasury objects are:

1. **Permission-Integrated**: Seamlessly work with Permission objects for access control
2. **Guard-Enhanced**: Can use Guard objects for conditional and smart withdrawals
3. **Fully Auditable**: Every transaction is permanently recorded on-chain
4. **Multi-Mode**: Support different operational modes for different use cases
5. **Composable**: Designed to work with other Wowok objects in complex workflows

Treasury objects become the financial foundation for collaborative projects, community funds, and automated payment systems - they're like smart bank accounts that can follow any rules you design!"
