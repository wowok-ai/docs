# Stage 8: Practical Examples

---

**[← Stage 7: Data Query](stage-07-query.md)**

---

## 🎯 Stage Objectives

In this stage, you will explore five complete practical examples that demonstrate how to use WoWok in real-world scenarios. By the end, you will understand:

- How to build a basic e-commerce store with MyShop
- How to create a signed book service with ThreeBody_Signature
- How to implement advanced e-commerce with MyShop_Advanced
- How to process time-lock insurance claims with Insurance
- How to build weather-dependent travel workflows with Travel
- Practical patterns and best practices from each example

> **💡 Call Format**: All WoWok operations go through a single unified `wowok` tool. The AI calls `wowok({ tool: "<sub-tool>", data: {<params>} })`. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](response-format.md) for details.

---

## 📚 Example Overview

### Example 1: MyShop - Basic E-Commerce

#### One-Sentence Introduction
A complete online toy store demonstrating how to build a basic e-commerce platform with order workflows, permission control, and customer communication.

#### Key Features
- Product listing and inventory management
- Automated order workflow (Order Confirmation → Shipping → In Transit → Completed)
- Permission-based merchant operations
- Arbitration support for dispute resolution
- WIP file verification for product authenticity
- Discount coupon system
- Private customer communication via encrypted Messenger
- Fund allocation with Guard-protected withdrawals

#### Skills You Will Learn
- How to design and implement order workflows - applicable to any business process requiring state tracking
- How to use Permission objects for role-based access control - solving enterprise application permission management issues
- How to implement secure customer communication through Contact and Messenger - protecting sensitive information from being on-chain
- How to use Guard objects to verify fund allocation conditions - ensuring withdrawals only occur when conditions are met
- How to integrate WIP files for product verification - applicable to digital goods requiring authenticity guarantees

#### 🔗 Project Links
- [MyShop Full Documentation](../examples/MyShop/MyShop.md)

---

### Example 2: ThreeBody_Signature - Signed Book Service

#### One-Sentence Introduction
A specialized service for book signing by the Three-Body author, demonstrating Buy Guard protection and simple workflow management.

#### Key Features
- Buy Guard protection (only authorized user can purchase)
- Two-node workflow (Book Delivered → Signature Completed)
- WIP file integration with hash validation
- Fixed pricing model (888 tokens)
- Permission-based workflow progression
- Complete service configuration from creation to publication

#### Skills You Will Learn
- How to use Buy Guard to restrict service purchasers - solving access control issues for internal tools or authorized services
- How to design simple yet clear workflows - applicable to service delivery scenarios requiring step confirmation
- How to bind WIP files to sales items - implementing authenticity verification for digital goods
- How to properly configure and publish services - mastering the complete Service object lifecycle management
- How to verify system functionality through actual testing - establishing effective testing strategies

#### 🔗 Project Links
- [ThreeBody_Signature Full Documentation](../examples/ThreeBody_Signature/ThreeBody_Signature.md)

---

### Example 3: MyShop_Advanced - Advanced E-Commerce

#### One-Sentence Introduction
An enterprise-grade e-commerce platform with multi-path workflows, milestone-based fund release, reward incentives, and Merkle Root privacy protection.

#### Key Features
- WIP-verified product with hash validation
- Multi-path order workflow (normal delivery, wonderful rating, returns, lost handling)
- Milestone-based fund allocation (100% to merchant on completion, 100% to customer on return/lost)
- Reward incentive system (Wonderful bonus, Lost compensation, Shipping timeout)
- Privacy-preserving logistics (tracking numbers via Messenger, only Merkle Root on-chain)
- Dual-signature return processes (requires both customer and merchant confirmation)
- Time-based auto-completion (order completes after 10 days from shipping)
- Complex Guard verification for each workflow step
- Arbitration integration for dispute resolution

#### Skills You Will Learn
- How to design multi-path workflows - solving state management issues for complex business scenarios
- How to use Merkle Root for privacy protection - providing verifiability without revealing specific information
- How to design incentive mechanisms - encouraging quality service and compensating for losses through Reward objects
- How to implement dual-signature processes - ensuring critical operations require multi-party confirmation to prevent unilateral tampering
- How to design time-based auto-trigger mechanisms - implementing timeout auto-completion to reduce manual intervention
- How to properly plan object creation order - understanding dependencies to avoid issues with post-publication modifications

#### 🔗 Project Links
- [MyShop_Advanced Full Documentation](../examples/MyShop_Advanced/MyShop_Advanced.md)

---

### Example 4: Insurance - Time-Lock Insurance Claims

#### One-Sentence Introduction
An insurance claim processing system demonstrating time-lock Guard verification and conditional fund release using `convert_witness`.

#### Key Features
- Time-lock verification using `convert_witness` Guard queries
- Insurance claim workflow with conditional progression
- Treasury-backed fund allocation for approved claims
- Guard-gated withdrawal protection
- Machine-driven claim approval and rejection flow

#### Skills You Will Learn
- How to use `convert_witness` for time-based Guard conditions
- How to design insurance claim workflows with approval/rejection paths
- How to integrate Treasury with Guard-protected withdrawals
- How to build conditional fund release mechanisms

#### 🔗 Project Links
- [Insurance Full Documentation](../examples/Insurance/Insurance.md)

---

### Example 5: Travel - Weather-Dependent Travel Service

#### One-Sentence Introduction
An Iceland travel service with weather-dependent activities, demonstrating multi-node workflows, sub-orders, and Guard-based weather verification.

#### Key Features
- Multi-activity travel workflow (insurance, SPA, ice scooting)
- Weather-dependent Guard verification using Repository data
- Sub-order creation for each travel activity
- Multiple allocation outcomes (merchant victory, customer refund)
- Cancellation and completion paths based on weather conditions
- Arbitration integration for dispute resolution

#### Skills You Will Learn
- How to design multi-node workflows with conditional branches
- How to use Repository data in Guard queries for weather verification
- How to create sub-orders for multi-service purchases
- How to handle multiple allocation scenarios based on workflow outcomes

#### 🔗 Project Links
- [Travel Full Documentation](../examples/Travel/Travel.md)

---

## 💡 Key Insights from All Examples

### 1. Object Creation Order Matters
All examples emphasize the importance of correct creation order:
1. Permission first (foundation)
2. Machine next (workflow)
3. Service (unpublished, get address)
4. Guards (need Service address)
5. Configure Service (add machine, guards, allocators)
6. Publish Service (LAST!)

### 2. Naming Strategy is Critical
Consistent naming saves hours of confusion. Use patterns like:
- `xxx_permission`, `xxx_machine`, `xxx_guard`, `xxx_service`
- Document your naming convention before starting

### 3. Test Incrementally
Don't wait until everything is set up to test. Verify each step with queries as you go.

### 4. Privacy First
Sensitive information (shipping addresses, tracking numbers) should stay off-chain. Use Messenger for private communication and Merkle Roots for verification.

### 5. Guard Verification
Guards are your security backbone. Use them for:
- Buy restrictions
- Fund allocation conditions
- Workflow step verification
- Merkle Root validation

---

## 🎓 Recommended Learning Path

1. **Start with MyShop** - Understand the basics of e-commerce in WoWok
2. **Then ThreeBody_Signature** - Learn about Buy Guards and simple workflows
3. **Then MyShop_Advanced** - Master complex multi-path workflows and privacy patterns
4. **Then Insurance** - Learn time-lock Guards and conditional fund release
5. **Finally Travel** - Explore multi-node workflows and weather-dependent Guards

Each example builds on the previous one, introducing new concepts incrementally.

---

## 🏆 Stage Checklist

Before moving on, confirm you have:
- [ ] Read and understood all five examples
- [ ] Identified which example best matches your use case
- [ ] Learned the object creation order best practices
- [ ] Understand when to use each WoWok component
- [ ] Can apply these patterns to your own projects

---

## 🎉 Congratulations!

You have completed the practical examples stage! Next, continue to Stage 9 to learn about cross-chain bridge operations. You are now ready to:

- Build complete e-commerce platforms
- Create signed digital services
- Implement complex workflow systems
- Protect user privacy with off-chain communication
- Secure fund allocation with Guard verification
- Design incentive mechanisms with Reward pools

---

## 🚀 Next Steps

Now it's time to build your own application! We recommend:

1. Start small - pick one of the examples as a template
2. Modify incrementally - don't try to build everything at once
3. Test constantly - use query_toolkit and onchain_table_data to verify each step
4. Document everything - record object IDs and test results
5. Share your work - help others learn from your experience

---

**[← Return to Main Directory](../README.md) | [Stage 9: Cross-Chain Bridge →](stage-09-bridge.md)**
