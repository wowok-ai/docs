# Machine Object: Your Workflow Blueprint Designer

> "Design reusable workflow templates that define how complex processes should flow from start to finish."

## Overview

### Definition

A **Machine** is a modular, on-chain process blueprint composed of interconnected nodes, defining business logic, operator roles, state transitions, and verification conditions. It serves as the programmable engine behind service delivery, enabling autonomous, verifiable collaboration across parties. Once published, a Machine becomes immutable and can generate executable **Progress instances** per buyer.

Machines enable **borderless collaboration**: multiple entities can interact, commit, and validate state transitions without needing centralized control—each according to preset roles, guards, and permissions.

### Functionality

A Machine defines its workflow through a **State Diagram**:

- **Nodes**: represent stages in a service (e.g., Booking, Check-in, Safari Completion)
- **Node Pairs**: define transitions between nodes
- **Forwards**: paths between nodes, executable by specific **Operators**
- **Guards**: programmable logic conditions (e.g., payment received, file uploaded)
- **Threshold & Weight**: control group transitions (e.g., "2 of 3 reviewers must approve")
- **Operators**: defined roles such as `"Order Payer"` or `"Travel Agent"`, bound by `Permission Index`
- **Lifecycle States**:

  - **Editable**: when unpublished
  - **Immutable & Executable**: once published and not paused

Each instantiated `Progress` follows the state logic of the Machine, generating real-time records, state validation, and evidence for dispute resolution.

### Key Components

| Component                | Functionality                                                                    |
| ------------------------ | -------------------------------------------------------------------------------- |
| **Nodes & Forwards**     | Define progress stages and conditional transitions                               |
| **Thresholds & Weights** | Allow multi-party approvals and flexible collaboration logic                     |
| **Named Operators**      | Assign role-specific execution power (e.g., only the "Guide" can trigger Node 3) |
| **Guard Contracts**      | Enforce data-bound conditions on each transition                                 |
| **Permissions**          | Control edit and execution rights using on-chain permission indices              |
| **Consensus Repository** | Store canonical records used during transitions for validation and automation    |
| **Custom Endpoints**     | Define front-end consoles per node to simplify UX for each role                  |

### Use Case — Safari Trip Coordination

In Tom's Kenya wildlife safari:

1. **Machine Setup**
   Natural Explorer Tours defines a `SafariMachine` with the following nodes:

   - `Order Created`
   - `Deposit Paid`
   - `Trip Started`
   - `Activity Completed`
   - `Trip Ended`
   - `Final Payment Released`

   Each node is connected via a `Forward` path with a named operator like `"Order Payer"` or `"Safari Guide"`, and each transition is gated by a **Guard**.

2. **Thresholds & Guards**

   - A `50-50` weighted approval between `"Trip Manager"` and `"On-Site Guide"` ensures the safari activity is completed before payout.
   - A `Guard` verifies that a trip photo is uploaded and GPS tag matches the safari zone before allowing the node transition.

3. **Unexpected Event Handling**

   - Midway, Tom falls ill and initiates cancellation.
   - The `Emergency Cancel` node becomes accessible only if a **medical certificate** is uploaded and passes Guard verification (e.g., timestamp, issuer credibility).
   - The Machine uses the `Repository` to fetch the credential and determine eligibility.

4. **Outcome**

   - The Machine allows partial fund withdrawal to the provider based on completed stages, and initiates a refund for unused segments.
   - The entire process is verifiable, immutable, and transparent to all parties.

### Key Features

- **Composable Node-Based Architecture**
  Model flexible, modular service logic through re-usable nodes and directional transitions.

- **Fine-Grained Role Control**
  Bind each path to an operator role with Permission Index, ensuring only the right party can act.

- **Programmable & Auditable Logic**
  Each step is enforced by Guards and stored in on-chain repositories for post-factum validation.

- **Cross-Organizational Coordination**
  Machines enable independent entities (guides, transporters, agents) to collaborate under a shared service logic without requiring central arbitration.

- **User-Defined Interfaces (Endpoints)**
  Every node can expose a specific console view tailored to the actor's current state, improving usability and clarity.

## What You'll Build (30 seconds)

By the end, you will have three workflow blueprints and understand process design:

- **Simple Machine** — basic 3-step workflow template
- **Conditional Machine** — branching workflows with approval logic
- **Service-Integrated Machine** — workflows that coordinate multiple services

**Prereqs**: You already created Personal, Permission, Treasury, and Service objects. Network is `sui testnet`. Token type is `0x2::sui::SUI`.

**💡 Pro Tip**: Machine objects need Permission objects to manage who can modify them. Services need withdraw guards before they can be published. If you get stuck on technical details, ask your AI assistant: "Help me create the required Permission object with Machine management permissions" or "What are the built-in permission indexes for Machine operations?"

**Pre-flight** (copy one line):

```
"On sui testnet, show my default account and balance; if low, guide me to the faucet and wait for funds."
```

---

## 🎯 Level 1 — Foundation (design basic workflows)

**Scenario**: You want to create a standardized process template that can be reused for similar projects.

**Your Mission**: Design your first Machine with a simple linear workflow structure.

**Try This A** (create workflow blueprint):

```
"Create Simple Machine for consulting service on sui testnet. First create a Permission object with Machine management permissions for my default account, then create a Machine with 3 nodes: 'Initial Consultation' → 'Analysis & Planning' → 'Final Delivery'. Set up the workflow so consultants can advance all steps, with each transition requiring one approval. Return: Machine address + on-chain link, Permission address + on-chain link, node configuration summary."
```

**Try This B** (publish the blueprint):

```
"Publish the Simple Machine to make it ready for creating workflow instances. Set bPublished to true. Return: Machine address + on-chain link, published status confirmation, node structure summary."
```

**Try This C** (verify the design):

```
"Query the Machine object to show its complete workflow structure: all nodes, transitions, permissions, and current published status."
```

**Success Looks Like**:

- ✅ You see Machine address + on-chain link, Permission address + on-chain link
- ✅ Machine shows published status: true, with complete node structure
- ✅ Node configuration shows: 3 nodes, correct transitions, permission requirements
- ✅ **Workflow template ready**: Your blueprint is now available for creating workflow instances

**Why This Matters**: Machine objects provide:

- **Reusable templates**: Design once, use many times for similar processes
- **Clear structure**: Everyone knows what steps are involved before starting
- **Permission control**: Define who can perform which operations
- **Immutable rules**: Once published, the process can't be secretly changed

---

## 🎯 Level 2 — Application (smart workflow logic)

**Scenario**: Your process needs different paths based on project complexity or approval requirements.

**Your Mission**: Create a Machine with conditional branching that adapts to different situations.

**Try This A** (create branching blueprint):

```
"Create Conditional Machine with manual branching on sui testnet. First create a Permission object for the new Machine, then design the workflow: 'Project Intake' → users can choose 'Simple Track' (requires one consultant approval) OR 'Complex Track' (requires both consultant and manager approval) → both paths converge at 'Quality Review' → 'Final Delivery'. Use different threshold values and permission requirements to enforce the approval logic. Return: Machine address + on-chain link, Permission address + on-chain link, branching logic summary."
```

**Try This B** (configure approval requirements):

```
"Explain how the Complex Track enforces dual-signature requirements: show how the threshold value of 2 means both consultant approval (permission 1001) and manager approval (permission 1002) must be completed before the workflow can advance to Quality Review. Demonstrate the difference between Simple Track (threshold 1) and Complex Track (threshold 2)."
```

**Try This C** (publish and verify):

```
"Publish the Conditional Machine and verify the branching logic: show how projects can take different paths based on user choice and approval requirements. Query the Machine object to display the complete node structure and explain how the workflow handles both simple and complex project scenarios."
```

**Success Looks Like**:

- ✅ You see Machine address + on-chain link, Permission address + on-chain link
- ✅ Branching logic shows: Simple Track (consultant approval, threshold=1) vs Complex Track (consultant + manager approval, threshold=2)
- ✅ Node configuration shows how both paths converge at Quality Review
- ✅ **Adaptive workflows**: Your template can handle different complexity levels through manual path selection

**Why This Matters**: Conditional Machines enable:

- **Flexible routing**: Workflows adapt based on project requirements and user choices
- **Efficiency optimization**: Simple cases get streamlined treatment with fewer approvals
- **Quality control**: Complex cases get additional oversight through multiple approvals
- **Clear governance**: Different approval requirements ensure appropriate oversight levels

---

## 🎯 Level 3 — Integration (coordinate multiple services)

**Scenario**: Your workflow needs to orchestrate multiple external services and verify their completion.

**Your Mission**: Create a sophisticated Machine that integrates with Service objects and manages dependencies.

**Prerequisites for Level 3**: This level requires existing Service objects as dependencies. The services must be:

- Created AND published (ready to accept orders)
- Configured with payment withdrawal rules (so providers can collect earnings)
- Fully operational before creating the Machine

You'll need to create venue booking and catering services first, or ask your AI assistant to help set them up with the complete configuration.

**Try This A** (create service-integrated blueprint):

```
"First, help me create two published Service objects: a venue booking service and a catering service, each with basic sales items and payment withdrawal rules that allow service providers to collect their earnings immediately after order completion. Then create Event Machine with Service dependencies on sui testnet: 'Planning' → 'Venue Booking' (requires completed venue service order) → 'Catering' (requires completed catering service order) → 'Execution' → 'Final Payment'. Use the suppliers field to specify that venue and catering services are required dependencies. Return: Machine address + on-chain link, Service addresses + on-chain links, suppliers configuration, dependency summary."
```

**Try This B** (configure service requirements):

```
"Explain how the suppliers configuration works: show how setting bRequired=true for venue and catering services means that Progress instances must provide completed Order objects from these services before advancing to the next workflow step. Demonstrate the service dependency chain."
```

**Try This C** (publish and verify integration):

```
"Publish the Service-Integrated Machine and verify the dependency configuration: query the Machine object to show the complete workflow structure including suppliers configuration. Explain how this Machine will coordinate multiple service providers and validate that required services are completed before workflow progression."
```

**Success Looks Like**:

- ✅ You have at least 2 Service objects created and published (bPublished: true)
- ✅ Machine object created with suppliers configuration showing service dependencies
- ✅ Understanding of how bRequired=true enforces service completion requirements
- ✅ **Service coordination concept**: You understand how Machine orchestrates multiple service providers, even if full implementation encounters technical limitations

**Why This Matters**: Service-Integrated Machines enable:

- **Multi-party coordination**: Orchestrate different service providers
- **Dependency management**: Ensure prerequisites are met before proceeding
- **Automated verification**: System checks service completion automatically
- **Complex workflows**: Handle sophisticated business processes

---

## 💡 Mini Challenge — Wedding Planning Machine

**Goal**: Create a comprehensive Machine that coordinates a wedding with multiple vendors and approval steps.

_Note: This is an advanced challenge that combines multiple concepts. Don't worry if you need to simplify or ask for help with the technical setup - the goal is to understand how complex real-world processes can be designed with Machine objects._

**Try This**:

```
"Create Wedding Machine on sui testnet. First help me set up the required Service objects for venue, catering, photography, and music services. Then design the workflow: 'Planning' → 'Vendor Selection' → 'Booking Confirmation' → 'Event Execution' → 'Final Payment'. Use suppliers configuration to specify service dependencies, and set up approval requirements where both bride and groom roles must approve major decisions using different permission levels and threshold values."
```

**Success Looks Like**:

- ✅ Wedding Machine address with complete workflow structure
- ✅ Multiple service dependencies configured correctly
- ✅ Approval requirements and contingency planning included
- ✅ **Complex coordination**: One Machine orchestrates entire event planning

**Creative Ideas**:

- **Software development**: Requirements → Design → Development → Testing → Deployment
- **Manufacturing**: Design → Sourcing → Production → Quality Control → Shipping
- **Education**: Enrollment → Learning Modules → Assessments → Certification
- **Healthcare**: Consultation → Diagnosis → Treatment → Follow-up → Billing

**Share Your Creation**: Post about your workflow blueprint and how you're using Machine objects for process standardization!

---

## 🔧 Troubleshooting (friendly and fast)

**Schema error** → Create a minimal Machine first; add nodes and complexity step by step.

**Node connection fails** → Check that prior_node names match exactly with existing nodes.

**Permission denied** → Ask your AI to help create a Permission object with the right Machine management permissions for your account.

**Service integration fails** →

- Check if referenced Services exist: query each Service by name to verify creation
- Verify Services are published: bPublished should be true and ready to accept orders
- Ensure payment withdrawal rules are configured: Services need proper withdrawal setup before publishing
- Ask your AI to help with complete Service setup if any step fails

**Publishing fails** → Check that all workflow steps are properly connected and have the required bPublished and bPaused fields set.

**Need permission indexes?** → Ask your AI to query the built-in permissions for Machine and Service modules to get the correct permission numbers.

**Reset, without losing learning**:

- Note the Machine address and successful configuration steps
- Create a new Machine with simplified structure
- Test basic workflow before adding conditional logic
- Gradually add complexity as you understand the design patterns

**Common Use Cases**:

- **Professional services**: Consultation → Analysis → Delivery workflows
- **E-commerce**: Order → Payment → Fulfillment → Delivery processes
- **Project management**: Planning → Execution → Review → Completion cycles
- **Content creation**: Brief → Draft → Review → Revision → Publication

**Need help?**: The community has great examples of Machine patterns for different industries!

---

## ✅ Ready for More?

**You've Unlocked**:

- ⚙️ **Workflow Design**: Create reusable process templates
- 🔀 **Conditional Logic**: Design workflows that adapt to different scenarios
- 🤝 **Service Integration**: Coordinate multiple providers in complex processes
- 📋 **Process Standardization**: Ensure consistent execution across teams

**Next Up**: **Progress Objects** — learn how to create and manage individual workflow instances from your Machine templates!

**Quick Check**: Can you create a Machine with branching logic and service dependencies? If yes, you're ready to run actual workflow instances!
