# Guard Object: Your Smart Condition Engine

> "Create intelligent rules that automatically verify conditions before allowing operations - the brain behind automated decision-making"

## Overview

### Definition

Immutable on-chain condition scripts that gate operations until a verifiable Passport proves all predefined rules are satisfied.

### Functionality

Guards encode logical rules—time windows, reputation scores, balances, external oracle data, even future events—into bytecode plus a constant table. Once published, a Guard's address becomes a permanent reference that can be attached to Services, Orders, Machines, Treasuries, or any other WoWok object. Operators must submit a Passport (signed Q&A proof bundle); if every "sense" evaluates to true, the guarded action succeeds, otherwise it reverts.

### Use Cases

| Scenario                  | Guard Logic (illustrative)                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Reward Guard**          | _Admin incentive_ — "If address 0x538d… is listed as `admin` in Permission 0x64f3…, allow a 50 USDT claim from Treasury Z." |
| **Refund Guard**          | _Tiered return policy_ — "Full refund if the Order is < 7 days old; 80 % refund if < 15 days."                              |
| **Service Timeout Guard** | "If a Service milestone is not reached within 72 h, consumer may claim 30 % compensation."                                  |
| **Emergency Guard**       | "Allow instant itinerary cancellation and proportional refund when a certified emergency Proof is uploaded."                |
| **Loyal-Customer Guard**  | "Apply an extra 5 % discount when booking history ≥ 3 trips in the last 12 months."                                         |

_Examples show common patterns; adapt to your specific business logic._

### Key Features

- **Deterministic bytecode logic** — executes the same on every node
- **Constant table parameterization** — inject static or future data sources
- **Passport-based proof flow** — single or batched verification saves gas
- **Cross-object querying** — reference any WoWok object or external oracle
- **Immutable & reusable** — once deployed, the Guard cannot be altered, enabling full composability and auditability

## What You'll Build (30 seconds)

By the end, you will have three guard systems and understand intelligent verification:

- **Time-Based Guard** — simple time lock that controls when operations can happen
- **Balance-Checking Guard** — smart guard that verifies Treasury balances before allowing actions
- **Multi-Condition Guard** — sophisticated guard combining time, balance, and permission checks

**Prereqs**: You already created Permission and Treasury objects. Network is `sui testnet`. Token type is `0x2::sui::SUI`.

**💡 Pro Tip**: Guard objects are immutable once created, but they're the "brain" of your Wowok ecosystem. They can verify almost any condition and make intelligent decisions. If you get stuck on technical details, ask your AI assistant: "Help me create a simple time-based Guard" or "What's the basic structure for Guard logic with current time verification?"

**Pre-flight** (copy one line):

```
"On sui testnet, show my default account and balance; if low, guide me to the faucet and wait for funds."
```

---

## 🎯 Level 1 — Foundation (create time-based guard)

**Scenario**: You want to prevent Treasury withdrawals for a cooling-off period - no withdrawals allowed for 5 minutes after the Guard is created.

**Your Mission**: Create your first Guard with time-based verification logic.

**Try This A** (create time-based guard):

```
"Create a time-based Guard on sui testnet that prevents operations for 5 minutes from now. The Guard should check if current time is greater than creation time plus 5 minutes (300 seconds). Use context data for current time verification and create the Guard with proper time logic structure."
```

**Try This B** (connect guard to treasury):

```
"Connect my time-based Guard to a Treasury withdrawal rule. Set up the Treasury to use this Guard for withdrawal verification, so withdrawals are blocked during the 5-minute cooling period and allowed afterward."
```

**Try This C** (test the time lock):

```
"Test my time-based Guard by attempting a Treasury withdrawal immediately (should fail) and explain when it will succeed. Query the Guard and Treasury to show the connection and current time verification status."
```

**Success Looks Like**:

- ✅ You see Guard address + on-chain link
- ✅ Treasury shows Guard connection for withdrawal control
- ✅ Withdrawal attempts are blocked during cooling period
- ✅ **Time-based verification working**: Your Guard controls access based on time conditions

**Why This Matters**: Time-based Guards provide:

- **Cooling-off periods**: Prevent hasty financial decisions
- **Scheduled access**: Operations only allowed at specific times
- **Automatic expiration**: Time-limited offers and permissions
- **Vesting schedules**: Gradual release of funds over time

---

## 🎯 Level 2 — Application (balance-checking guard)

**Scenario**: You want to ensure users have sufficient Treasury balance before allowing high-value operations - only users with at least 1 SUI in Treasury can proceed.

**Your Mission**: Create a Guard that queries Treasury balance and makes decisions based on financial criteria.

**Try This A** (create balance-checking guard):

```
"Create a balance-checking Guard on sui testnet that verifies Treasury balance is at least 1 SUI (1000000000 MIST). The Guard should query Treasury balance and return true only if balance >= 1000000000. Use Treasury query functions to check current balance."
```

**Try This B** (test balance verification):

```
"Test my balance-checking Guard with different Treasury balance scenarios. First test with insufficient balance (should fail), then deposit 1+ SUI to Treasury and test again (should succeed). Show how the Guard makes different decisions based on actual balance."
```

**Try This C** (combine with service access):

```
"Connect my balance-checking Guard to a Service purchase requirement. Set up a premium service that requires users to have at least 1 SUI in Treasury before they can make purchases. Demonstrate how the Guard prevents purchases for users with insufficient funds."
```

**Success Looks Like**:

- ✅ You see Guard address + on-chain link with balance verification logic
- ✅ Guard correctly checks Treasury balance and makes decisions
- ✅ Service integration shows Guard controlling purchase access
- ✅ **Financial verification working**: Your Guard enforces minimum balance requirements

**Why This Matters**: Balance-checking Guards enable:

- **Financial qualification**: Ensure users meet minimum financial requirements
- **Risk management**: Prevent operations when users lack sufficient funds
- **Tier-based access**: Different services for different balance levels
- **Automated credit checks**: Real-time financial verification without manual review

---

## 🎯 Level 3 — Integration (multi-condition guard)

**Scenario**: You want to create VIP access that requires multiple criteria: sufficient time has passed (5+ minutes), adequate balance (1+ SUI), and proper permissions.

**Your Mission**: Create a sophisticated Guard that combines time, balance, and permission verification using AND logic.

**Try This A** (create multi-condition guard):

```
"Create a VIP access Guard on sui testnet that combines three conditions with AND logic: 1) Current time is at least 5 minutes after Guard creation, 2) User has at least 1 SUI balance in Treasury, 3) User has specific permission (like permission index 1001). All three conditions must be true for access to be granted."
```

**Try This B** (test complex logic):

```
"Test my multi-condition Guard with different scenarios: user with permission but no balance, user with balance but insufficient time, user meeting all conditions. Show how the Guard evaluates each condition and makes the final AND decision."
```

**Try This C** (integrate with premium service):

```
"Connect my multi-condition Guard to a premium Service that requires VIP access. Set up the Service to use this Guard for purchase qualification, demonstrating how sophisticated business rules can be automated through Guard logic."
```

**Success Looks Like**:

- ✅ You see Guard address + on-chain link with complex AND logic
- ✅ Guard correctly evaluates all three conditions (time + balance + permission)
- ✅ Service integration shows sophisticated access control in action
- ✅ **Multi-condition intelligence working**: Your Guard enforces complex business rules automatically

**Why This Matters**: Multi-condition Guards enable:

- **Sophisticated qualification**: Combine multiple criteria for nuanced access control
- **Business rule automation**: Complex policies enforced automatically without human oversight
- **Risk mitigation**: Multiple verification layers reduce unauthorized access
- **Scalable governance**: Consistent rule enforcement across all users and operations

---

## 💡 Mini Challenge — Loyalty Program Guard System

**Goal**: Create a comprehensive loyalty program using multiple Guards that work together to provide different access levels.

**Try This**:

```
"Create a loyalty program Guard system on sui testnet with three tiers: Bronze (1+ SUI balance), Silver (5+ SUI balance + 1 week membership), Gold (10+ SUI balance + 1 month membership + special permission 1002). Create separate Guards for each tier and connect them to different Service access levels. Show how users automatically qualify for higher tiers as they meet more criteria."
```

**Success Looks Like**:

- ✅ Three Guards created for Bronze, Silver, and Gold tiers
- ✅ Each Guard has progressively more complex verification requirements
- ✅ Services connected to different Guards show tier-based access
- ✅ **Loyalty system working**: Users get better access as they meet higher criteria

**Creative Ideas**:

- **Professional certification**: Different Guards for different skill levels
- **Investment platform**: Risk-based access using balance and experience Guards
- **Community governance**: Voting rights based on contribution and tenure Guards
- **Educational platform**: Course access based on prerequisite completion Guards

**Share Your Creation**: Post about your loyalty program Guard system and how different tiers provide different benefits!

---

## 🔧 Troubleshooting (friendly and fast)

**Schema error** → Guards are complex; start with the simplest possible logic first and add complexity step by step.

**Guard creation fails** → Check that all referenced objects (Treasury, Repository, etc.) exist before creating the Guard.

**Guard verification always fails** →

- **Most common**: Check that constant table values are correct
- Verify that witness data is being provided in the expected format
- Test individual conditions separately before combining them
- **Ask your AI**: "Help me debug my Guard logic" or "Check if my Guard conditions are structured correctly"

**Integration with other objects doesn't work** →

- Ensure the other objects are configured to use your Guard during creation
- Check that the Guard address is correctly referenced
- Verify that all required witness data is being provided
- **Ask your AI**: "Help me connect my Guard to Treasury/Service withdrawal rules"

**Guard logic too complex** → Start with simple time-based conditions, then gradually add more complex logic.

**Need Guard structure help?** → Ask your AI: "Show me the basic structure for Guard logic" or "Help me create a simple time-based Guard first."

**Reset, without losing learning**:

- Note the Guard concept and successful logic patterns
- Create a new Guard with simpler structure (time-only condition)
- Test basic Guard integration before adding complex conditions
- Remember: Guards are immutable, so plan carefully before creating

**Common Use Cases**:

- **Time locks**: Prevent operations until specific time
- **Balance checks**: Require minimum funds before allowing operations
- **Permission verification**: Check user qualifications before access
- **Multi-factor authentication**: Combine multiple conditions for security

**Need help?**: The community has great examples of Guard patterns for different business scenarios!

---

## ✅ Ready for More?

**You've Unlocked**:

- ⏰ **Time-Based Verification**: Create Guards that control access based on time conditions
- 💰 **Financial Qualification**: Build Guards that verify balance requirements before allowing operations
- 🧠 **Multi-Condition Logic**: Combine multiple verification criteria with AND logic for sophisticated access control
- 🏗️ **Business Automation**: Use Guards to enforce complex business rules automatically

**Next Up**: **Repository Objects** - Learn how to create shared data stores that your Guards can query for even more sophisticated verification!

**Quick Check**: Can you create a Guard that checks Treasury balance? Can you combine multiple conditions in one Guard? Can you connect Guards to Services for access control? If yes, you're ready to learn about data management!

---

## 🌟 What Makes Guard Objects Special?

Unlike traditional if-then logic, Wowok Guard objects are:

1. **Universal Verifiers**: Can verify almost any condition - time, balance, permissions, reputation, credentials, behavior patterns
2. **Immutable Yet Improvable**: Once created, logic can't be changed, but you can clone and enhance for continuous improvement
3. **Cross-Object Intelligent**: Can query and analyze data from any other Wowok object in real-time
4. **Witness-Enabled**: Can validate user-provided proofs, signatures, and credentials
5. **Ecosystem Brain**: Serve as the intelligent decision-making layer for the entire Wowok ecosystem
6. **Composable**: Can be used by multiple objects simultaneously, creating network effects

Guards are the "brain" of the Wowok ecosystem - they can verify almost anything and make your entire system intelligent and automated!
