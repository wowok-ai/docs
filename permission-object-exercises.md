# Permission Object: Your Access Control Foundation

> "Define who can do what in your digital spaces - the security system that powers all your other Wowok objects"

## What You'll Build (30 seconds)

By the end, you will have three permission systems and understand access control management:

- **Basic Permission** — simple role-based access for team projects
- **Business Permission** — custom permissions for specific business operations
- **Ecosystem Permission** — unified access control across multiple objects

**Prereqs**: You already created Personal objects. Network is `sui testnet`. Token type is `0x2::sui::SUI`.

**💡 Pro Tip**: Permission objects are the foundation for almost all other Wowok objects. Every Treasury, Service, Repository, and Machine needs a Permission object to control who can manage them. If you get stuck, ask your AI assistant: "Help me create a Permission object with the right permissions for Treasury management" or "What built-in permission indexes do I need for Service operations?"

**Pre-flight** (copy one line):

```
"On sui testnet, show my default account and balance; if low, guide me to the faucet and wait for funds."
```

---

## 🎯 Level 1 — Foundation (create basic access control)

**Scenario**: You want to control who can manage your team's digital resources and projects.

**Your Mission**: Create your first Permission object with clear admin and team member roles.

**Try This A** (create team permission system):

```
"Create a Permission object for my team project on sui testnet. I need to set myself as admin with full management rights. I also want to add team member roles that can handle Treasury deposits but not withdrawals or admin functions. Please find the correct Treasury permission indexes and create the Permission object with these roles."
```

**Try This B** (test permission assignment):

```
"Add a team member to my Permission object with Treasury deposit permissions but not withdrawal permissions. Use test address 0x1234567890abcdef1234567890abcdef12345678 for demonstration. Show me how different people now have different access levels."
```

**Try This C** (verify access control):

```
"Query my Permission object to show all admin addresses, team member addresses, and their assigned permissions. Explain how this Permission object can control access to Treasury and other Wowok objects."
```

**💡 If you get stuck**: Ask your AI "What are the built-in permission indexes for Treasury operations?" or "Help me troubleshoot Permission object creation errors."

**Success Looks Like**:

- ✅ You see Permission address + on-chain link
- ✅ Permission object shows admin and team member roles clearly defined
- ✅ Multiple addresses assigned with different Treasury permission levels
- ✅ **Access control foundation ready**: Your Permission object can now control other objects

**Why This Matters**: Permission objects provide:

- **Clear roles**: Everyone knows what they can and cannot do
- **Flexible assignment**: Easy to add/remove people and change their roles
- **Reusable control**: One Permission object can manage multiple other objects
- **Transparent governance**: All permission changes are recorded on-chain

---

## 🎯 Level 2 — Application (custom business permissions)

**Scenario**: You're running a consulting business and need specific permissions for different business operations beyond the standard Wowok permissions.

**Your Mission**: Create custom permissions that match your specific business needs and understand how they work with built-in permissions.

**Try This A** (create custom business permissions):

```
"Create a Permission object for my consulting business on sui testnet. I need custom permissions for: client management, project delivery, and financial oversight. Set these up as custom permissions starting from index 1001. Then assign different team members different combinations of these business permissions."
```

**Try This B** (combine built-in and custom permissions):

```
"I want to combine my custom business permissions with Treasury permissions. Give my project manager project delivery permissions plus Treasury deposit rights, but not withdrawal rights. Give my accountant financial oversight permissions plus Treasury withdrawal rights. Create these specialized business roles."
```

**Try This C** (test business permission structure):

```
"Query my Permission object to show all custom permissions, built-in permissions, and how different team members have different permission combinations. Show me how this creates a flexible business governance system."
```

**💡 If you get stuck**: Ask your AI "How do I create custom permissions starting from index 1000?" or "Help me combine custom and built-in permissions for business roles."

**Success Looks Like**:

- ✅ You see Permission address + on-chain link with custom business permissions
- ✅ Custom permissions (1000+) working alongside built-in permissions (700+)
- ✅ Different team members with specialized business role combinations
- ✅ **Business governance established**: Permission system tailored to your specific business needs

**Why This Matters**: Custom business permissions enable:

- **Tailored access control**: Permissions that match your exact business operations
- **Professional roles**: Specialized access for different business functions
- **Flexible combinations**: Mix custom and built-in permissions as needed
- **Scalable business structure**: Foundation for growing business operations

---

## 🎯 Level 3 — Integration (unified ecosystem control)

**Scenario**: You want one Permission system to control access across multiple Wowok objects - Treasury, Repository, Service, and Machine - creating a unified business ecosystem.

**Your Mission**: Create an integrated permission system that coordinates access control across multiple object types.

**Try This A** (create integrated ecosystem):

```
"Create an integrated business ecosystem on sui testnet using my existing Permission object. Create Treasury, Repository, and Service objects that all use this Permission for access control. Set up roles so admin can manage everything, project manager can handle Treasury deposits and Repository data, and team members can only read Repository data."
```

**Try This B** (test cross-object control):

```
"Test my integrated access control system. Show how the same Permission object controls multiple resources: admin withdrawing from Treasury and modifying Repository, project manager depositing to Treasury and reading Repository, team member only querying Repository data. Demonstrate how one permission change affects access across all objects."
```

**Try This C** (verify ecosystem control):

```
"Query all my objects (Permission, Treasury, Repository, Service) to show how they're connected. Show me the Permission object roles, Treasury access rules, Repository data access, and Service management permissions. Explain how this creates unified governance across all resources."
```

**💡 If you get stuck**: Ask your AI "How do I connect multiple objects to the same Permission system?" or "Help me troubleshoot multi-object permission integration."

**Success Looks Like**:

- ✅ You see Permission address + on-chain link, Treasury address + on-chain link, Repository address + on-chain link, Service address + on-chain link
- ✅ One Permission object controlling access to multiple different object types
- ✅ Consistent access rules across Treasury, Repository, and Service
- ✅ **Unified ecosystem governance**: Single permission system managing entire business infrastructure

**Why This Matters**: Integrated Permission systems enable:

- **Centralized control**: One permission system manages access to all business resources
- **Consistent governance**: Same roles and rules apply across all object types
- **Efficient management**: Add a person once, they get appropriate access everywhere
- **Scalable architecture**: Foundation for complex multi-object business operations

---

## 💡 Mini Challenge — Community DAO Governance

**Goal**: Create a comprehensive governance system for a community organization with multiple member types and clear decision-making structure.

**Try This**:

```
"Create a Community DAO Permission system on sui testnet with four governance levels: founding members with full control, active contributors who can manage Treasury deposits and proposals, community members who can access Repository and vote, and observers with read-only access. Then create Treasury and Repository objects using this Permission system to show how DAO governance controls community resources."
```

**💡 If you get stuck**: Ask your AI "Help me design a DAO governance structure with multiple member tiers" or "How do I create hierarchical permissions for community governance?"

**Success Looks Like**:

- ✅ Community DAO Permission system with 4-tier governance structure
- ✅ Treasury and Repository objects controlled by the same Permission system
- ✅ Clear hierarchy: founding members > contributors > community members > observers
- ✅ **Complete DAO infrastructure**: Governance system ready for community decision-making

**Creative Ideas**:

- **Professional organization**: Different certification levels with corresponding permissions
- **Investment club**: Member tiers based on contribution levels and experience
- **Open source project**: Maintainer, contributor, and user permission levels
- **Community fund**: Transparent governance for shared resources and decision-making

**Share Your Creation**: Post about your DAO governance system and how you're using Permission objects for community management!

---

## 🔧 Troubleshooting (friendly and fast)

**Schema error** → Create a minimal Permission first; add roles and complexity step by step.

**Permission assignment fails** → Check that you have admin rights to modify the Permission object and that addresses are valid.

**Permission indexes unclear** → Ask your AI: "What are the built-in permission indexes for Treasury/Service/Repository operations?" Custom permissions start from 1000+.

**Integration with other objects fails** →

- **Most common**: Other objects need to be configured to use your Permission object during creation
- Verify that permission indexes match between objects (same numbers for same operations)
- Check that all objects are on the same network (sui testnet)
- **Ask your AI**: "Help me create a Treasury/Service/Repository that uses my existing Permission object"

**Custom permissions not working** →

- Ensure custom permission indexes are 1000 or higher
- Check that custom permissions are properly added to the Permission object before assigning to addresses
- **Ask your AI**: "Help me troubleshoot custom permission creation and assignment"

**Multi-object control issues** →

- Create objects one at a time and verify Permission integration for each
- Ensure Permission object exists and is properly configured before creating dependent objects
- **Ask your AI**: "Walk me through connecting multiple objects to the same Permission system step by step"

**Reset, without losing learning**:

- Note the Permission address and successful role configurations
- Create a new Permission with simpler structure (admin + member only)
- Test basic role assignment before adding complex hierarchies
- Gradually add complexity as you understand the permission patterns

**Common Use Cases**:

- **Project teams**: Admin, manager, member, observer roles for collaborative work
- **Business operations**: Owner, manager, employee, customer access levels
- **Community organizations**: Founder, contributor, member, visitor permission tiers
- **Family/personal**: Parent, child, trusted friend access for shared resources

**Need help?**: The community has great examples of Permission patterns for different organizational structures!

---

## ✅ Ready for More?

**You've Unlocked**:

- 🔐 **Access Control Foundation**: Create clear roles and permissions for any project
- 👥 **Team Management**: Organize people with appropriate access levels
- 🏗️ **Multi-Object Governance**: One permission system controlling multiple resources
- ⚖️ **Scalable Organization**: Structure that grows from small teams to large communities

**Next Up**: **Treasury Objects** — learn how to create programmable money management with your Permission objects controlling who can access and manage funds!

**Quick Check**: Can you create a Permission object with multiple roles? Can you explain how your Permission object controls access to other objects? If yes, you're ready to manage shared funds!

---

## 🌟 What Makes Permission Objects Special?

Unlike traditional access control systems, Wowok Permission objects are:

1. **Multi-Object Control**: One Permission object can manage access to unlimited other objects
2. **Flexible Roles**: Easy to add, remove, and modify roles as needs change
3. **Transparent Governance**: All permission changes are permanently recorded on-chain
4. **Built-in Integration**: Designed to work seamlessly with all other Wowok objects
5. **Scalable Structure**: Works for everything from personal projects to large organizations

Permission objects become the governance foundation for collaborative projects, community organizations, and complex business operations!
