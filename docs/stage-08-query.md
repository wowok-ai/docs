# Stage 8: Practical Examples

---

**[← Stage 7: Data Query](stage-07-query.md)**

---

## 🎯 Stage Objectives

In this stage, you will explore three complete practical examples that demonstrate how to use WoWok in real-world scenarios. By the end, you will understand:

- How to build a basic e-commerce store with MyShop
- How to create a signed book service with ThreeBody_Signature
- How to implement advanced e-commerce with MyShop_Advanced
- Practical patterns and best practices from each example

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
- [MyShop Test Results](../examples/MyShop/MyShop_TestResults.md)

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
- [ThreeBody_Signature Test Results](../examples/ThreeBody_Signature/ThreeBody_Signature_TestResults.md)

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
- [MyShop_Advanced Test Results](../examples/MyShop_Advanced/MyShop_Advanced_TestResults.md)

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
3. **Finally MyShop_Advanced** - Master complex multi-path workflows and privacy patterns

Each example builds on the previous one, introducing new concepts incrementally.

---

## 🏆 Stage Checklist

Before moving on, confirm you have:
- [ ] Read and understood all three examples
- [ ] Identified which example best matches your use case
- [ ] Learned the object creation order best practices
- [ ] Understand when to use each WoWok component
- [ ] Can apply these patterns to your own projects

---

## 🎉 Congratulations!

You have completed all stages of WoWok learning! You are now ready to:

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
3. Test constantly - use query_toolkit to verify each step
4. Document everything - record object IDs and test results
5. Share your work - help others learn from your experience

---

**[← Return to Main Directory](../README.md)**
