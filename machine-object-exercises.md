# Machine Object: Your Workflow Orchestrator

> "Turn complex business processes into automated, transparent, and collaborative workflows that everyone can follow."

## What You'll Build (30 seconds)

By the end, you will have three working workflow systems and understand process automation:

- **Simple Machine** — basic 3-step workflow (Book → Execute → Deliver)
- **Conditional Machine** — approval-based workflows with branching logic
- **Collaborative Machine** — multi-party workflows with service integration

**Prereqs**: You already created Personal, Permission, Treasury, and Service objects. Network is `sui testnet`. Token type is `0x2::sui::SUI`.

**Key Concept - Machine vs Progress**:

- **Machine** = Blueprint/Template (like a recipe)
- **Progress** = Running Instance (like cooking that recipe)
- One Machine can create many Progress instances
- Each Progress tracks one specific workflow execution

**Pre-flight** (copy one line):

```
"On sui testnet, show my default account and SUI balance; if low, guide me to the faucet and wait for funds."
```

---

## 🎯 Level 1 — Foundation (make workflows work)

**Scenario**: You have a service that needs a clear, trackable process from start to finish.

**Your Mission**: Create your first Machine with a simple linear workflow that customers can follow.

**Try This A** (create Machine blueprint):

```
"Create Simple Machine for consulting service on sui testnet. Design 3 nodes: 'Initial Consultation' → 'Analysis & Planning' → 'Final Delivery'. Set permissions: consultant (1001) can advance all steps, threshold=1 for each transition. Return: Machine address + on-chain link, Permission address + on-chain link, node configuration summary."
```

💡 **What makes this special**: Unlike traditional project management tools, this Machine blueprint is permanently recorded on-chain. Once published, the workflow rules become immutable - no one can secretly change the process or skip steps.

**Try This B** (publish and instantiate):

```
"Publish the Machine, then create a new Progress instance for client project 'ABC Corp Strategy'. Return: Progress address + on-chain link, current node ('Initial Consultation'), available operations list, authorized operators for next step, transaction hash."
```

💡 **What makes this special**: This Progress instance is now a blockchain-native workflow tracker. Every step, every transition, every operator action will be permanently recorded with timestamps and cryptographic proof.

**Try This C** (demonstrate progression):

```
"Complete 'Initial Consultation' operation and advance Progress to 'Analysis & Planning'. Return: operation completion transaction hash + on-chain link, updated Progress state (current node: 'Analysis & Planning'), next available operations, audit trail with timestamps and operator addresses."
```

**Success Looks Like**:

- ✅ You see Machine address + on-chain link, Permission address + on-chain link, Progress address + on-chain link
- ✅ Progress shows current node: 'Analysis & Planning', available operations list, authorized operators
- ✅ Audit trail shows: operation completed at timestamp, operator address, transaction hash + on-chain link
- ✅ **Machine vs Progress clear**: Machine is blueprint, Progress is running instance
- ✅ **Process transparency**: Customers see exactly what steps are involved
- ✅ **Progress tracking**: Everyone knows where things stand at any time
- ✅ **Consistent returns**: Every operation returns address + on-chain link + current state

**Why This Matters**: Machine objects provide:

- **Process transparency**: Customers see exactly what steps are involved
- **Progress tracking**: Everyone knows where things stand at any time
- **Automated coordination**: System manages handoffs between steps
- **Quality assurance**: Each step can have verification requirements

This Machine turns your service into a trackable, professional process.

💡 **Wowok Advantage**: Your workflow is now blockchain-native with immutable rules, cryptographic audit trails, and transparent progress tracking - capabilities that traditional workflow tools simply cannot provide.

---

## 🎯 Level 2 — Application (smart decisions in workflows)

**Scenario**: Your process needs conditional logic - different paths based on circumstances.

**Your Mission**: Create a Machine with branching workflows that adapt to different situations.

**Try This A** (create branching Machine):

```
"Create Conditional Machine with branching: 'Project Intake' → 'Simple Track' (threshold=1, permission 1001) OR 'Complex Track' (threshold=2, permissions 1001+1002) → 'Quality Review' → 'Final Delivery'. Set up Guard for automatic routing based on project budget. Return: Machine address + on-chain link, Guard address + on-chain link, Permission address + on-chain link, branching logic summary."
```

💡 **What makes this special**: This branching is driven by Guard objects - Wowok's unique on-chain conditional logic system. Traditional workflow tools require manual decisions; here the blockchain automatically routes based on objective criteria.

**Try This B** (test permission and threshold failures):

```
"Create Progress instance, try to advance to 'Complex Track' with only 1 approval (should fail with 'threshold not met: 1/2'). Then try with unauthorized user (should fail with 'permission denied: missing 1002'). Return: Progress address + on-chain link, specific error messages, current approvals count (1/2), required permissions list."
```

**Try This C** (successful branching):

```
"Complete proper approvals (2 signatures for Complex Track), show Guard evaluation routing project to correct path, and demonstrate convergence at 'Quality Review' with full audit trail. Return: transaction hashes for both approvals + on-chain links, Guard evaluation result, chosen path confirmation, updated Progress state, complete audit trail with timestamps."
```

💡 **What makes this special**: The Guard automatically evaluated conditions and chose the path - this is Wowok's unique on-chain decision engine. Traditional systems require manual routing; here the blockchain makes objective, transparent decisions.

**Success Looks Like**:

- ✅ You see Machine address + on-chain link, Guard address + on-chain link, Progress address + on-chain link
- ✅ Failed advancement shows specific errors: "threshold not met: 1/2" or "permission denied: missing 1002"
- ✅ Successful routing shows Guard evaluation result and chosen path with transaction hashes
- ✅ Progress state shows: current node, pending approvals (1/2), available operations, authorized operators
- ✅ **Conditional logic works**: Workflows adapt based on Guard evaluation
- ✅ **Permission control**: Only authorized operators can advance specific steps
- ✅ **Threshold enforcement**: Multi-signature requirements are enforced
- ✅ **Error transparency**: Specific failure reasons help users understand requirements

**Why This Matters**: Conditional Machines enable:

- **Adaptive processes**: Workflows that adjust to different situations
- **Efficiency optimization**: Simple cases get streamlined treatment
- **Quality control**: Complex cases get additional oversight
- **Automated routing**: System decides paths based on objective criteria

**Pro Tip**: Well-designed conditional workflows can handle 80% of cases automatically while giving special attention to complex situations.

💡 **Wowok Advantage**: Guard-driven branching means your workflow decisions are based on verifiable on-chain conditions, not subjective human judgment. This eliminates bias and ensures consistent, transparent routing.

---

## 🎯 Level 3 — Integration (orchestrate everything)

**Scenario**: Your workflow needs to coordinate multiple services and parties working together.

**Your Mission**: Create a sophisticated Machine that orchestrates multiple services and handles complex collaboration.

**Try This A** (create Service-integrated Machine):

```
"Create Event Machine with Service dependencies: 'Planning' → 'Venue Booking' (requires venue Service Order) → 'Catering' (requires catering Service Order) → 'Execution' → 'Billing'. Set up suppliers: venue Service (required), catering Service (required). Return: Machine address + on-chain link, Permission address + on-chain link, suppliers configuration, node dependencies summary."
```

💡 **What makes this special**: Machine objects can orchestrate multiple independent services on-chain. Unlike traditional platforms that just track tasks, this Machine actually verifies service completion and coordinates payments automatically.

**Try This B** (complete Service/Order/Progress cycle):

```
"Create venue and catering Services, place Orders from them, then use these Order addresses to advance Progress through 'Venue Booking' and 'Catering' steps. Return: venue Service address + on-chain link, catering Service address + on-chain link, venue Order address + on-chain link, catering Order address + on-chain link, Progress address + on-chain link, Order verification confirmations, Service completion proofs."
```

**Try This C** (milestone payments integration):

```
"Demonstrate milestone payments: Treasury releases 30% after 'Venue Booking', 40% after 'Catering', 30% after 'Execution'. Return: Treasury address + on-chain link, initial balance, balance after each milestone (with transaction hashes + on-chain links), Order payment confirmations, Progress state after each advancement, complete payment audit trail."
```

**Success Looks Like**:

- ✅ You see Machine, Services, Orders, Progress, Treasury addresses and on-chain links
- ✅ Treasury balance decreases: 30% (venue), 40% (catering), 30% (execution) with transaction hashes
- ✅ Progress shows: completed Orders, verified Service deliverables, payment confirmations
- ✅ **Service/Order/Progress cycle**: Complete integration from Service purchase to workflow advancement
- ✅ **Milestone payments**: Automated Treasury releases tied to Progress advancement
- ✅ **Multi-party coordination**: Different providers advance different workflow steps
- ✅ **Dependency verification**: Machine validates Order ownership and Service completion

**Why This Matters**: Collaborative Machines enable:

- **Service orchestration**: Coordinate multiple providers seamlessly
- **Dependency management**: Ensure prerequisites are met before proceeding
- **Multi-party coordination**: Different people handle different aspects
- **Automated verification**: System checks that requirements are satisfied

**Level Up**: These collaborative workflows can power entire business ecosystems and supply chains.

💡 **Wowok Advantage**: Machine objects create trustless coordination between multiple parties. Every service completion, payment release, and workflow transition is cryptographically verified - no central authority needed.

---

## 💡 Mini Challenge — Complex Event Coordination

**Goal**: Create a Machine that handles a wedding with multiple vendors, approval steps, and contingency planning.

**Try This** (complete Service/Order/Machine cycle):

```
"Create Wedding Machine for 0x2::sui::SUI on sui testnet. Design workflow: 'Planning' → 'Vendor Selection' → 'Booking Confirmation' → 'Event Execution' → 'Final Payment'. Create 3 vendor Services (venue, catering, photography), place Orders, then demonstrate full cycle: Service purchase → Order generation → Progress advancement → milestone Treasury payments → completion verification. Show complete audit trail."
```

**Success Looks Like**:

- ✅ Wedding Machine address, 3 Service addresses, 3 Order addresses, Progress address
- ✅ Treasury balance changes: 40% (booking), 30% (execution), 30% (completion)
- ✅ Progress audit trail: timestamps, operators, Order verifications, payment confirmations
- ✅ **Complete cycle**: Service → Order → Progress → Payment → Verification

**Creative Ideas**:

- **Software development**: Requirements → Design → Development → Testing → Deployment
- **Manufacturing**: Design → Sourcing → Production → Quality Control → Shipping
- **Education**: Enrollment → Learning Modules → Assessments → Certification
- **Healthcare**: Consultation → Diagnosis → Treatment → Follow-up → Billing

**Share Your Creation**: Post about your complex workflow system and how you're using Machine objects for multi-party coordination!

---

## 🔧 Troubleshooting (friendly and fast)

**Schema error** → Create a minimal Machine first; add nodes and complexity step by step.

**Node connection fails** → Check that prior_node names match exactly with existing nodes.

**Permission denied** → Verify operators have correct permissions in the Permission object.

- **Specific error**: "Permission denied: address 0x123 missing permission 1001"
- **Fix**: Add permission 1001 to the operator's address in Permission object

**Workflow stuck** → Check that threshold values allow progression with available operations.

- **Specific error**: "Threshold not met: 1/2 approvals for operation 'complex_review'"
- **Fix**: Get additional approval from authorized operator with permission 1002

**Service integration fails** → Ensure referenced Services exist and are published.

- **Specific error**: "Service not found: 0x456 or Service not published"
- **Fix**: Verify Service address and ensure bPublished: true

**Guard evaluation fails** → Check Guard conditions and witness data.

- **Specific error**: "Guard failed: time_window expired" or "Guard failed: min_signers not met"
- **Fix**: Provide valid witness data or meet Guard conditions

**Progress creation fails** → Verify Machine is published and has valid initial node.

- **Specific error**: "Machine not published" or "Initial node '' not found"
- **Fix**: Set bPublished: true and ensure initial node exists

**Reset, without losing learning**:

- Note the Machine address and any successful workflow steps
- Create a new Machine with simplified node structure
- Test basic progression before adding conditional logic
- Gradually add complexity as you understand the flow

**Common Use Cases**:

- **Professional services**: Consultation → Analysis → Delivery workflows
- **E-commerce**: Order → Payment → Fulfillment → Delivery processes
- **Project management**: Planning → Execution → Review → Completion cycles
- **Content creation**: Brief → Draft → Review → Revision → Publication

**Need help?**: The community has great examples of Machine patterns for different industries!

---

## ✅ Ready for More?

**You've Unlocked**:

- ⚙️ **Process Automation**: Turn manual workflows into automated, trackable systems
- 🔀 **Conditional Logic**: Workflows that adapt and branch based on circumstances
- 🤝 **Multi-Party Coordination**: Orchestrate complex collaborations seamlessly
- 📊 **Progress Transparency**: Everyone can see exactly where things stand

**Next Up**: **Progress Objects** — learn how to track and manage individual workflow instances, monitor performance, and optimize your processes!

**Quick Check**: Can you create a Machine with branching logic and explain how it coordinates multiple parties? If yes, you're ready to track individual workflow instances!

---

## 🌟 What Makes Machine Objects Special?

Unlike traditional workflow tools, Wowok Machine objects are:

1. **Blockchain-Native**: All workflow states and transitions are permanently recorded
2. **Multi-Party Transparent**: All participants can see the process and current status
3. **Service-Integrated**: Can require and verify completion of external services
4. **Guard-Enhanced**: Use conditional logic for intelligent workflow routing
5. **Permission-Controlled**: Fine-grained access control for different workflow operations
6. **Immutable Process**: Once published, the workflow rules can't be changed, ensuring consistency

Machine objects become the backbone for complex business processes, enabling transparent collaboration and automated coordination across multiple parties and services!
