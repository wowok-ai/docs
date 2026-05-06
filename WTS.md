# WTS — Witness Timestamped Snapshot

---

## Overview

**WTS** (Witness Timestamped Snapshot) is a JSON-based file format for creating **self-proving, tamper-proof records of encrypted conversations** from the WoWok Messenger. It captures the complete message history between two parties, including server-attested Merkle proofs, timestamps, and optional digital signatures.

A WTS file serves as a **standalone evidence package** — anyone can independently verify the authenticity, integrity, and chronology of every message without access to the original server or encryption keys.

### Key Properties

| Property | Mechanism |
|----------|-----------|
| **Server Attestation** | Each message includes a server signature over its Merkle tree position |
| **Merkle Chain Integrity** | Consecutive messages are linked via `prevRoot` → `merkleRoot` chains |
| **Tamper Detection** | SHA-256 hash covers the schema identifier and entire payload |
| **Non-Repudiation** | Optional Falcon-512 digital signature over the entire metadata block |
| **Self-Verifiable** | All verification data is embedded; no server access required |
| **Cross-Validation** | Metadata fields (`messageCount`, `merkleRoot`) are cross-checked against actual payload content |

---

## Schema

### JSON Structure

```
{
  "wts": "https://github.com/wowok-ai/docs/WTS.md",
  "payload": {
    "session": { ... },
    "messages": [ ... ]
  },
  "meta": { ... }
}
```

---

## Field Reference

### Root Level

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wts` | `string` | **Yes** | Schema identifier URL. Fixed value: `"https://github.com/wowok-ai/docs/WTS.md"` |
| `payload` | `object` | **Yes** | The conversation data (session info + messages) |
| `meta` | `object` | **Yes** | Metadata including integrity hash, summary stats, and optional signatures |

---

### `payload` — Conversation Payload

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `payload.session` | `object` | **Yes** | Session identifier and participant information |
| `payload.messages` | `array` | **Yes** | Ordered array of WTS messages |

#### `payload.session` — Session Info

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | **Yes** | Unique session identifier |
| `participants` | `string[]` | **Yes** | Array of participant addresses (hex-encoded, `0x` prefix) |

#### `payload.messages[]` — WTS Message

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | **Yes** | Unique message identifier (format: `{fromShort}_{toShort}_{leafIndex}_{random}`) |
| `from` | `string` | **Yes** | Sender address (hex-encoded, `0x` prefix) |
| `to` | `string` | **Yes** | Recipient address (hex-encoded, `0x` prefix) |
| `plaintext` | `string` | No | Decrypted message content. Omitted when `excludePlaintext` is `true` |
| `plaintextHash` | `string` | **Yes** | SHA-256 hash of the plaintext (hex-encoded, `0x` prefix) |
| `clientTimestamp` | `number` | **Yes** | Client-side timestamp in milliseconds (Unix epoch) |
| `timestamp` | `number` | **Yes** | Server-attested timestamp in milliseconds (Unix epoch) |
| `leafIndex` | `number` | **Yes** | Position in the server's Merkle tree for this conversation |
| `prevRoot` | `string` | **Yes** | Merkle tree root **before** this message was inserted (hex-encoded, `0x` prefix) |
| `merkleRoot` | `string` | **Yes** | Merkle tree root **after** this message was inserted (hex-encoded, `0x` prefix) |
| `serverSignature` | `string` | **Yes** | Server's Falcon-512 signature over the Merkle tree update (hex-encoded, `0x` prefix) |
| `serverPublicKeyIndex` | `number` | **Yes** | Index into `meta.serverPublicKeys[]` identifying which server key signed this message |
| `guardAddress` | `string` | No | Guard object address if message was verified by a Guard |
| `passportAddress` | `string` | No | Passport address if sender used verified credentials |
| `lastReceivedLeafIndex` | `number` | No | Last message leaf index the sender had received (for sync confirmation) |
| `arkConfirmed` | `object` | No | ARK (Asynchronous Ratchet Key) confirmation data |
| `msgType` | `number` | No | Message type: `1` = text message, `3` = file message |
| `zipMetadata` | `object` | No | ZIP file metadata for file messages |

##### `arkConfirmed` — ARK Confirmation

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `recipient` | `string` | **Yes** | Recipient address |
| `recipientPublicKey` | `string` | **Yes** | Recipient's public key |
| `signature` | `string` | **Yes** | Signature confirming key receipt |
| `timestamp` | `number` | **Yes** | Confirmation timestamp in milliseconds |

##### `zipMetadata` — File Message Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fileName` | `string` | No | Original filename |
| `fileSize` | `number` | No | File size in bytes |
| `contentType` | `string` | No | Content type (`"wts"`, `"wip"`, `"zip"`) |
| `zipHash` | `string` | No | Hash of the ZIP content |

---

### `meta` — Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `meta.type` | `string` | **Yes** | File type identifier. Fixed value: `"wts"` |
| `meta.version` | `string` | **Yes** | Format version. Current: `"1.0"` |
| `meta.created` | `string` | **Yes** | Creation timestamp in ISO 8601 format |
| `meta.hash` | `string` | **Yes** | SHA-256 hash of `{ wts, session, messages }` as a lowercase hex string (no prefix) |
| `meta.algorithm` | `string` | **Yes** | Hash algorithm identifier. Fixed value: `"sha256"` |
| `meta.startTime` | `number` | **Yes** | Timestamp of the earliest message in the snapshot (ms, Unix epoch) |
| `meta.endTime` | `number` | **Yes** | Timestamp of the latest message in the snapshot (ms, Unix epoch) |
| `meta.messageCount` | `number` | **Yes** | Total number of messages in the snapshot |
| `meta.merkleRoot` | `string` | **Yes** | Merkle root of the **last** message in the snapshot (hex-encoded, `0x` prefix) |
| `meta.creator` | `string` | **Yes** | Address of the WTS generator (hex-encoded, `0x` prefix) |
| `meta.participant` | `string` | **Yes** | Address of the conversation peer (hex-encoded, `0x` prefix) |
| `meta.serverPublicKeys` | `array` | No | Array of server public keys referenced by messages via `serverPublicKeyIndex` |
| `meta.signature` | `object` or `array` | No | Digital signature(s). Single object or array for multi-signature support |

#### `meta.serverPublicKeys[]` — Server Public Key Entry

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `publicKey` | `string` | **Yes** | Server's Falcon-512 public key (hex-encoded, `0x` prefix) |
| `keyId` | `string` | No | Optional key identifier |
| `validFrom` | `number` | **Yes** | Timestamp from which this key is valid (ms, Unix epoch) |
| `validUntil` | `number` | No | Timestamp until which this key is valid (ms, Unix epoch) |
| `algorithm` | `string` | No | Key algorithm identifier |

> **Design Note:** Server public keys are stored in a deduplicated array in `meta` rather than inline in each message. Messages reference keys by index (`serverPublicKeyIndex`), significantly reducing file size since server keys rarely change during a conversation.

#### `meta.signature` — Signature Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | `string` | **Yes** | Base64-encoded signature bytes |
| `publicKey` | `string` | **Yes** | Public key for verification (Base64-encoded, 897 bytes for Falcon-512) |
| `algorithm` | `string` | **Yes** | Signature algorithm. Fixed value: `"Falcon512"` |
| `address` | `string` | No | Signer's blockchain address (hex-encoded, `0x` prefix) |

---

## Integrity Model

### Hash Computation

The `meta.hash` is computed as:

```
hash = SHA-256( canonicalizeJson({ wts: schemaUrl, session: session, messages: messages }) )
```

This covers the schema identifier, session info, and all messages, preventing tampering with any of these components.

### Signature Computation

When present, `meta.signature` is a Falcon-512 signature over:

```
metaHash = SHA-256( canonicalizeJson(meta_without_signature) )
```

Where `meta_without_signature` is the `meta` object with the `signature` field excluded. This covers all metadata fields including `serverPublicKeys`.

### Verification Chain

```
{ wts, session, messages }  ──SHA-256──►  meta.hash  ──(part of)──►  meta
                                                                       │
meta (excluding signature)   ──SHA-256──►  metaHash  ──Falcon-512──►  meta.signature
```

### Cross-Validation

During verification, the following cross-checks are performed:

| Check | Description |
|-------|-------------|
| `meta.messageCount` vs `payload.messages.length` | Ensures the declared count matches actual messages |
| `meta.merkleRoot` vs last message's `merkleRoot` | Ensures the summary root matches the final message |

### Merkle Chain Validation

Each message's integrity is verified through the Merkle chain:

1. For message at index `i` (where `i > 0`):
   - `messages[i].prevRoot` must equal `messages[i-1].merkleRoot`
2. The server signature on each message attests to the `(prevRoot, merkleRoot)` transition
3. This creates an unbroken chain of cryptographic proofs from the first to the last message

### Tamper Detection Matrix

| Tampered Field | Detected By |
|----------------|-------------|
| `wts` (schema URL) | Hash mismatch |
| `payload.session` | Hash mismatch |
| Any message field | Hash mismatch |
| Message insertion/deletion | Hash mismatch **+** `messageCount` cross-validation |
| Message reordering | Merkle chain break (`prevRoot` mismatch) |
| `meta.type` | Signature mismatch |
| `meta.version` | Signature mismatch |
| `meta.created` | Signature mismatch |
| `meta.hash` | Hash mismatch **+** Signature mismatch |
| `meta.startTime` / `meta.endTime` | Signature mismatch |
| `meta.messageCount` | Signature mismatch **+** Cross-validation |
| `meta.merkleRoot` | Signature mismatch **+** Cross-validation |
| `meta.serverPublicKeys[]` | Signature mismatch |
| `meta.signature` | Signature mismatch |

---

## Canonical JSON Serialization

To ensure deterministic hash computation, all JSON objects are serialized using **canonical JSON** before hashing:

1. Object keys are sorted alphabetically
2. No whitespace between tokens
3. Strings use standard JSON escaping
4. `undefined` values are excluded from serialization
5. Numbers are serialized without unnecessary precision

---

## Examples

### Minimal WTS (Two Messages, No Plaintext, No Signature)

```json
{
  "wts": "https://github.com/wowok-ai/docs/WTS.md",
  "payload": {
    "session": {
      "id": "alice_bob_session_001",
      "participants": [
        "0x3a15ed459db7b7bcd9e1c7cd49c8a58aed5e1fd169cc2a99ead2201fa3ee54a4",
        "0x478a79a2e12d2c17886da98352c6d3fe4283eff63e465393bc4b71ed7a0afcbf"
      ]
    },
    "messages": [
      {
        "id": "3a15ed45_478a79a2_0_0744",
        "from": "0x3a15ed459db7b7bcd9e1c7cd49c8a58aed5e1fd169cc2a99ead2201fa3ee54a4",
        "to": "0x478a79a2e12d2c17886da98352c6d3fe4283eff63e465393bc4b71ed7a0afcbf",
        "plaintextHash": "0xabc123...",
        "clientTimestamp": 1776863000000,
        "timestamp": 1776863002578,
        "leafIndex": 0,
        "prevRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "merkleRoot": "0xbf23abc123def45678901234567890abcdef1234567890abcdef12345678906e5b",
        "serverSignature": "0x248a...",
        "serverPublicKeyIndex": 0
      },
      {
        "id": "478a79a2_3a15ed45_1_a025",
        "from": "0x478a79a2e12d2c17886da98352c6d3fe4283eff63e465393bc4b71ed7a0afcbf",
        "to": "0x3a15ed459db7b7bcd9e1c7cd49c8a58aed5e1fd169cc2a99ead2201fa3ee54a4",
        "plaintextHash": "0xdef456...",
        "clientTimestamp": 1776863010000,
        "timestamp": 1776863011234,
        "leafIndex": 1,
        "prevRoot": "0xbf23abc123def45678901234567890abcdef1234567890abcdef12345678906e5b",
        "merkleRoot": "0x2cdf789abcdef01234567890abcdef1234567890abcdef1234567890abc13f4",
        "serverSignature": "0xce31...",
        "serverPublicKeyIndex": 0
      }
    ]
  },
  "meta": {
    "type": "wts",
    "version": "1.0",
    "created": "2026-05-06T03:20:00Z",
    "hash": "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
    "algorithm": "sha256",
    "startTime": 1776863000000,
    "endTime": 1776863010000,
    "messageCount": 2,
    "merkleRoot": "0x2cdf789abcdef01234567890abcdef1234567890abcdef1234567890abc13f4",
    "creator": "0x3a15ed459db7b7bcd9e1c7cd49c8a58aed5e1fd169cc2a99ead2201fa3ee54a4",
    "participant": "0x478a79a2e12d2c17886da98352c6d3fe4283eff63e465393bc4b71ed7a0afcbf",
    "serverPublicKeys": [
      {
        "publicKey": "0xa723abc123def45678901234567890abcdef1234567890abcdef123456783790",
        "validFrom": 0
      }
    ]
  }
}
```

### Signed WTS (With Plaintext + Signature)

```json
{
  "wts": "https://github.com/wowok-ai/docs/WTS.md",
  "payload": {
    "session": {
      "id": "alice_bob_session_001",
      "participants": [
        "0x3a15ed45...",
        "0x478a79a2..."
      ]
    },
    "messages": [
      {
        "id": "3a15ed45_478a79a2_0_0744",
        "from": "0x3a15ed45...",
        "to": "0x478a79a2...",
        "plaintext": "Hello Bob! Let's discuss the contract.",
        "plaintextHash": "0xabc123...",
        "clientTimestamp": 1776863000000,
        "timestamp": 1776863002578,
        "leafIndex": 0,
        "prevRoot": "0x0000...",
        "merkleRoot": "0xbf23...",
        "serverSignature": "0x248a...",
        "serverPublicKeyIndex": 0
      }
    ]
  },
  "meta": {
    "type": "wts",
    "version": "1.0",
    "created": "2026-05-06T03:20:00Z",
    "hash": "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
    "algorithm": "sha256",
    "startTime": 1776863000000,
    "endTime": 1776863000000,
    "messageCount": 1,
    "merkleRoot": "0xbf23...",
    "creator": "0x3a15ed45...",
    "participant": "0x478a79a2...",
    "serverPublicKeys": [
      {
        "publicKey": "0xa723...",
        "validFrom": 0
      }
    ],
    "signature": {
      "value": "base64EncodedSignatureValueHere...",
      "publicKey": "Bwl0UgpjuBhHXtrC09LAW30exFURxRBB...",
      "algorithm": "Falcon512",
      "address": "0x3a15ed459db7b7bcd9e1c7cd49c8a58aed5e1fd169cc2a99ead2201fa3ee54a4"
    }
  }
}
```

---

## API Reference

### `generate_wts(params)`

Generates a WTS file from the conversation history between two accounts.

**Parameters:** `WtsGenerationParams`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `myAccount` | `string` | **Yes** | Account name or address of the requesting party |
| `peerAccount` | `string` \| `object` | **Yes** | Account name/address of the conversation peer |
| `range` | `object` | No | Message range filter. If omitted, all messages are included |
| `excludePlaintext` | `boolean` | No | If `true`, plaintext is excluded from messages (default: `false`) |
| `outputDir` | `string` | **Yes** | Directory path for the generated WTS file(s) |

#### `range` — Range Filter

Three range types are supported:

**Time Range** (by client timestamp):

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"time"` | Range type |
| `start` | `number` | Start timestamp (ms, Unix epoch) |
| `end` | `number` | End timestamp (ms, Unix epoch) |

**Message ID Range:**

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"messageId"` | Range type |
| `start` | `string` | Starting message ID |
| `end` | `string` | Ending message ID |

**Sequence Index Range** (by `leafIndex`):

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"seqIndex"` | Range type |
| `start` | `number` | Starting leaf index |
| `end` | `number` | Ending leaf index |

**Returns:** `Promise<WtsFileResult>`

| Field | Type | Description |
|-------|------|-------------|
| `files` | `string[]` | Paths to generated WTS files |
| `totalMessageCount` | `number` | Total messages across all generated files |
| `timeRange` | `object` | `{ start: number, end: number }` — Time span of captured messages |

---

### `verify_wts(wtsFilePath)`

Verifies a WTS file's integrity, Merkle chain, cross-validation fields, and signatures.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `wtsFilePath` | `string` | **Yes** | Path to the WTS file |

**Returns:** `Promise<WtsVerificationResult>`

| Field | Type | Description |
|-------|------|-------------|
| `valid` | `boolean` | Overall verification result |
| `error` | `string` | Error message if verification failed |
| `hashValid` | `boolean` | Whether the content hash matches |
| `hasSignature` | `boolean` | Whether the file contains any signature |
| `signatureValid` | `boolean` | Whether all signatures are valid (undefined if no signature) |
| `signatures` | `WtsSignatureVerification[]` | Per-signature verification details |

**Verification Steps:**

1. **Structure validation** — Checks that `wts`, `payload`, and `meta` exist
2. **Type validation** — Ensures `meta.type === "wts"`
3. **Merkle chain validation** — Verifies `prevRoot` continuity across all messages
4. **Hash verification** — Recomputes `SHA-256({ wts, session, messages })` and compares with `meta.hash`
5. **Cross-validation** — Checks `meta.messageCount` vs actual message count, and `meta.merkleRoot` vs last message's `merkleRoot`
6. **Signature verification** — If `meta.signature` exists, verifies Falcon-512 signature over `SHA-256(meta_without_signature)`

---

### `sign_wts(wtsFilePath, account, outputPath?)`

Adds a digital signature to an existing WTS file. Supports multi-signature — if the file already has signatures, the new one is appended (or replaces an existing signature from the same public key).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `wtsFilePath` | `string` | **Yes** | Path to the WTS file |
| `account` | `string` | **Yes** | Account name or address for signing |
| `outputPath` | `string` | No | Output path (defaults to overwriting the input file) |

**Returns:** `Promise<string>` — Path to the signed WTS file.

---

### `wts2html(wtsPath, options?)`

Converts a WTS file to a human-readable HTML page with styled message bubbles, timestamps, and verification status.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `wtsPath` | `string` | **Yes** | Path to the `.wts` file |
| `options.title` | `string` | No | Custom HTML page title |
| `options.theme` | `enum` | No | `"light"` or `"dark"` |
| `options.outputPath` | `string` | No | Output file path |

**Returns:** `Promise<string>` — Path to the generated HTML file.

---

## Use Cases

| Scenario | How WTS Is Used |
|----------|-----------------|
| **Legal Evidence** | Generate a WTS of a conversation and sign it. The file is a self-contained evidence package with server-attested timestamps and Merkle proofs. |
| **Dispute Resolution** | In arbitration, both parties can present WTS files of the same conversation. The Merkle chain and server signatures prove message authenticity and order. |
| **Compliance Auditing** | Organizations generate periodic WTS snapshots of business communications for compliance records. |
| **Contract Negotiation** | During Messenger-based negotiations, a signed WTS captures the full exchange as an immutable record. |
| **On-Chain Proof** | Individual messages from a WTS can be submitted on-chain via `proof_message` for blockchain-level timestamp verification. |

---

## Relationship with Other Components

| Component | Relationship |
|-----------|-------------|
| **Messenger** | WTS files are generated from Messenger conversation history. They can also be sent as file attachments. |
| **Account** | Signatures are created using local Account keys (Falcon-512 keypairs). |
| **Guard** | Messages may reference `guardAddress` if verified by a Guard during sending. |
| **Passport** | Messages may reference `passportAddress` if the sender used verified credentials. |
| **Proof** | Individual WTS messages can be submitted on-chain via `proof_message` for permanent timestamping. |
| **Arbitration** | WTS files serve as primary evidence in dispute resolution workflows. |

---

## File Extension & MIME Type

| Property | Value |
|----------|-------|
| File extension | `.wts` |
| MIME type | `application/json` |
| Encoding | UTF-8 |

---

## Server Public Key Optimization

To minimize file size, server public keys are stored in a deduplicated array (`meta.serverPublicKeys[]`) rather than inline in each message. Messages reference keys by array index via `serverPublicKeyIndex`.

**Example:**

```json
{
  "meta": {
    "serverPublicKeys": [
      { "publicKey": "0xaaaa...", "validFrom": 0 },
      { "publicKey": "0xbbbb...", "validFrom": 1776900000000 }
    ]
  },
  "payload": {
    "messages": [
      { "serverPublicKeyIndex": 0, ... },
      { "serverPublicKeyIndex": 0, ... },
      { "serverPublicKeyIndex": 1, ... }
    ]
  }
}
```

This is particularly effective for long conversations where the server key rarely changes — a 900-byte public key is stored once instead of being repeated in every message.
