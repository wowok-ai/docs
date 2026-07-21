
# Proof Component (📜 On-chain Proof)

---

> **💡 Call Format**: All WoWok operations go through a single unified `wowok` tool. Call `wowok({ tool: "onchain_operations", data: { operation_type: "proof" | "gen_proof", data: {<params>}, env: {<env>} } })`. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](response-format.md) for details.

## Component Overview

The Proof component creates immutable on-chain proof objects with server signatures. Proofs are used for timestamped message proofs (WTS), Merkle tree root proofs, and other verifiable claims. A Proof object can only be created, not modified.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Create Named Proof** | Create a named Proof object with full data | WTS proofs, Merkle root proofs, timestamped evidence | Creates identifiable, immutable on-chain proof with name |
| **Generate Proof (Shortcut)** | Quick proof creation without namedNew wrapper | One-time proof generation, automated workflows | Simplified interface for direct proof creation |

---

## Complete Tool Call Structure

Proof operations use the `onchain_operations` sub-tool with `operation_type` set to `"proof"` or `"gen_proof"`.

### Option 1: proof (full data structure)

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "proof",
    "data": { ... },    // Proof data definition
    "env": { ... }      // Execution environment (optional)
  }
}
```

### Option 2: gen_proof (flat parameters)

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "gen_proof",
    "proof": "...",           // Proof content
    "server_pubkey": "...",   // Server public key
    "server_signature": "...",// Server signature
    "proof_type": 1,          // Proof type (1 = WTS proof)
    "env": { ... }            // Execution environment (optional)
  }
}
```

---

## Schema Tree

### proof operation

```
proof (Proof Object Creation)
├── operation_type: "proof" (fixed value)
├── data (Proof data definition)
│   ├── namedNew (optional, NamedObject) - Name for the new Proof object
│   │   ├── name (required, string)
│   │   ├── tag (optional, string)
│   │   ├── onChain (optional, boolean)
│   │   └── replaceExistName (optional, boolean)
│   ├── description (optional, string) - Description of the proof
│   ├── proof (required, string) - Proof content, e.g. merkle tree root (max 10240 chars)
│   ├── server_pubkey (required, string) - Server public key (max 2048 chars)
│   ├── server_signature (required, string) - Server signature (max 40480 chars)
│   ├── proof_type (required, number|string) - Proof type (1 = WTS proof; 1-100 reserved)
│   ├── item_count (optional, number|string|null) - Item count, e.g. number of items in merkle tree
│   └── about_address (optional, string|NameOrAddress|null) - Address of the entity being proved
├── env (optional, execution environment)
│   ├── account (string, optional)
│   ├── network (string, optional) - "localnet", "testnet", or "mainnet"
│   ├── permission_guard (array, optional)
│   ├── no_cache (boolean, optional)
│   └── referrer (string, optional)
└── submission (optional, Guard submission data)
```

### gen_proof operation (convenience shortcut)

```
gen_proof (Generate Proof Shortcut)
├── operation_type: "gen_proof" (fixed value)
├── proof (required, string) - Proof content, e.g. merkle tree root (max 10240 chars)
├── server_pubkey (required, string) - Server public key (max 2048 chars)
├── server_signature (required, string) - Server signature (max 40480 chars)
├── proof_type (required, number|string) - Proof type (1 = WTS proof; 1-100 reserved)
├── description (optional, string) - Description of the proof
├── item_count (optional, number|string|null) - Item count
├── about_address (optional, string|NameOrAddress|null) - About address
└── env (optional, execution environment)
    ├── account (string, optional)
    ├── network (string, optional)
    ├── permission_guard (array, optional)
    ├── no_cache (boolean, optional)
    └── referrer (string, optional)
```

---

## Examples

### Example 1: Create Named WTS Proof

**Prompt**: Create a named proof "my_wts_proof" for a WTS merkle root on testnet.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "proof",
    "data": {
      "namedNew": {
        "name": "my_wts_proof"
      },
      "description": "WTS proof for conversation session",
      "proof": "0xc9a405abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
      "server_pubkey": "base64-encoded-server-public-key",
      "server_signature": "base64-encoded-server-signature",
      "proof_type": 1,
      "item_count": 42,
      "about_address": "0x74f63587fa505ca4e422a406feccaa699ae2804701e7ca1d9f6f2d07f31eb9bc"
    },
    "env": {
      "network": "testnet"
    }
  }
}
```

### Example 2: Generate Proof via Shortcut

**Prompt**: Generate a proof on testnet without naming it.

```json
{
  "tool": "onchain_operations",
  "data": {
    "operation_type": "gen_proof",
    "proof": "0xabc123merkleRoot",
    "server_pubkey": "base64-encoded-server-public-key",
    "server_signature": "base64-encoded-server-signature",
    "proof_type": 1,
    "description": "Quick proof",
    "item_count": 10,
    "env": {
      "network": "testnet"
    }
  }
}
```

---

## Important Notes

⚠️ **Proof objects are immutable** - they can only be created, never modified or deleted.

⚠️ **proof_type 1 is reserved for WTS proofs** - types 1-100 are reserved for system use.

⚠️ **Size limits** - proof content max 10240 chars, server public key max 2048 chars, server signature max 40480 chars.

⚠️ **about_address supports names** - can be an address (0x...) or a local mark name that will be resolved automatically.
