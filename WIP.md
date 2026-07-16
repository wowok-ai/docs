# WIP — Witness Immutable Promise

---

## Overview

**WIP** (Witness Immutable Promise) is a JSON-based file format for conveying **tamper-proof commitments** over networks, designed primarily for AI agents and automated systems. It ensures content integrity through cryptographic hashing and optional digital signatures, supporting rich text and multiple embedded images.

A WIP file serves as a **self-verifiable promise** — any recipient can independently verify that the content has not been altered since creation, without trusting the sender or any intermediary.

### Key Properties

| Property | Mechanism |
|----------|-----------|
| **Tamper Detection** | SHA-256 hash covers the schema identifier and entire payload |
| **Non-Repudiation** | Optional Falcon-512 digital signature over the entire metadata block |
| **Self-Verifiable** | All verification data is embedded in the file; no external trust required |
| **AI-Native** | Designed for AI agents to create, exchange, and verify commitments autonomously |

---

## Schema

### JSON Structure

```
{
  "wip": "https://github.com/wowok-ai/docs/blob/main/WIP.md",
  "payload": { ... },
  "meta": { ... }
}
```

---

## Field Reference

### Root Level

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wip` | `string` | **Yes** | Schema identifier URL. Fixed value: `"https://github.com/wowok-ai/docs/blob/main/WIP.md"` |
| `payload` | `object` | **Yes** | The commitment content (text + optional media) |
| `meta` | `object` | **Yes** | Metadata including integrity hash and optional signatures |

---

### `payload` — Content Payload

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `payload.content` | `object` | **Yes** | Text content of the commitment |
| `payload.content.text` | `string` | **Yes** | The commitment text. Max 10,000 characters (~5,000 Chinese characters) |
| `payload.content.format` | `enum` | **Yes** | Text format: `"plain"` \| `"markdown"` \| `"html"` |
| `payload.media` | `array` | **Yes** | Array of embedded media files (can be empty `[]`) |

#### `payload.media[]` — Media Item

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | **Yes** | Unique identifier for this media item (e.g., `"img-001"`) |
| `type` | `enum` | **Yes** | MIME type: `"image/png"` \| `"image/jpeg"` \| `"image/gif"` \| `"image/webp"` |
| `data` | `string` | **Yes** | Base64-encoded file data |
| `filename` | `string` | No | Original filename (e.g., `"contract-signature.png"`) |

---

### `meta` — Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `meta.type` | `string` | **Yes** | File type identifier. Fixed value: `"wip"` |
| `meta.version` | `string` | **Yes** | Format version. Current: `"1.0.0"` |
| `meta.created` | `string` | **Yes** | Creation timestamp in ISO 8601 format (e.g., `"2024-03-15T08:30:00Z"`) |
| `meta.hash` | `string` | **Yes** | SHA-256 hash of `{ wip, payload }` as a lowercase hex string (no prefix) |
| `meta.algorithm` | `string` | **Yes** | Hash algorithm identifier. Fixed value: `"sha256"` |
| `meta.signature` | `object` or `array` | No | Digital signature(s). Single object or array for multi-signature support |

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
hash = SHA-256( canonicalizeJson({ wip: schemaUrl, payload: payload }) )
```

This covers **both** the schema identifier and the entire payload, preventing:
- Tampering with the `wip` field (e.g., disguising a WIP as another format)
- Tampering with any payload content (text or media)

### Signature Computation

When present, `meta.signature` is a Falcon-512 signature over:

```
metaHash = SHA-256( canonicalizeJson(meta_without_signature) )
```

Where `meta_without_signature` is the `meta` object with the `signature` field excluded. This covers **all** metadata fields (`type`, `version`, `created`, `hash`, `algorithm`), preventing tampering with any meta field.

### Verification Chain

```
{ wip, payload }  ──SHA-256──►  meta.hash  ──(part of)──►  meta
                                                              │
meta (excluding signature)  ──SHA-256──►  metaHash  ──Falcon-512──►  meta.signature
```

### Tamper Detection Matrix

| Tampered Field | Detected By |
|----------------|-------------|
| `wip` (schema URL) | Hash mismatch |
| `payload.content.text` | Hash mismatch |
| `payload.content.format` | Hash mismatch |
| `payload.media[].data` | Hash mismatch |
| `meta.type` | Signature mismatch |
| `meta.version` | Signature mismatch |
| `meta.created` | Signature mismatch |
| `meta.hash` | Hash mismatch **+** Signature mismatch |
| `meta.algorithm` | Signature mismatch |
| `meta.signature` | Signature mismatch |

---

## Canonical JSON Serialization

To ensure deterministic hash computation, all JSON objects are serialized using **canonical JSON** before hashing:

1. Object keys are sorted alphabetically
2. No whitespace between tokens
3. Strings use standard JSON escaping (`\"`, `\\`, `\n`, etc.)
4. Numbers are serialized without unnecessary precision

**Example:**

```json
{"b":2,"a":1}
```
Canonical form:
```
{"a":1,"b":2}
```

---

## Size Limits

| Limit | Value | Description |
|-------|-------|-------------|
| Max image size | 2 MB | Per embedded image (before Base64 encoding) |
| Max total size | 10 MB | Entire WIP file as JSON string |
| Max image count | 10 | Number of media items in `payload.media` |
| Max text length | 10,000 chars | Length of `payload.content.text` |

---

## Examples

### Minimal WIP (No Signature, No Media)

```json
{
  "wip": "https://github.com/wowok-ai/docs/blob/main/WIP.md",
  "payload": {
    "content": {
      "text": "I commit to delivering the project by December 31, 2024.",
      "format": "plain"
    },
    "media": []
  },
  "meta": {
    "type": "wip",
    "version": "1.0.0",
    "created": "2024-03-15T08:30:00Z",
    "hash": "3a6eb0790f39ac87c94f3856b2dd2c5d110e6811602261a9a923d3bb23adc8b7",
    "algorithm": "sha256"
  }
}
```

### Full WIP (Markdown + Image + Signature)

```json
{
  "wip": "https://github.com/wowok-ai/docs/blob/main/WIP.md",
  "payload": {
    "content": {
      "text": "# Service Agreement\n\n## Scope\nComplete website development including:\n- Frontend (React)\n- Backend (Node.js)\n- Database design\n\n## Timeline\nDelivery by **2024-12-31**.",
      "format": "markdown"
    },
    "media": [
      {
        "id": "img-001",
        "type": "image/png",
        "data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        "filename": "contract-signature.png"
      }
    ]
  },
  "meta": {
    "type": "wip",
    "version": "1.0.0",
    "created": "2024-03-15T08:30:00Z",
    "hash": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    "algorithm": "sha256",
    "signature": {
      "value": "base64EncodedSignatureValueHere...",
      "publicKey": "Bwl0UgpjuBhHXtrC09LAW30exFURxRBB...",
      "algorithm": "Falcon512",
      "address": "0x3a15ed459db7b7bcd9e1c7cd49c8a58aed5e1fd169cc2a99ead2201fa3ee54a4"
    }
  }
}
```

### Multi-Signature WIP

```json
{
  "wip": "https://github.com/wowok-ai/docs/blob/main/WIP.md",
  "payload": {
    "content": {
      "text": "We jointly commit to the terms outlined in this agreement.",
      "format": "plain"
    },
    "media": []
  },
  "meta": {
    "type": "wip",
    "version": "1.0.0",
    "created": "2024-03-15T08:30:00Z",
    "hash": "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
    "algorithm": "sha256",
    "signature": [
      {
        "value": "signatureFromPartyA...",
        "publicKey": "publicKeyOfPartyA...",
        "algorithm": "Falcon512",
        "address": "0xaaaa..."
      },
      {
        "value": "signatureFromPartyB...",
        "publicKey": "publicKeyOfPartyB...",
        "algorithm": "Falcon512",
        "address": "0xbbbb..."
      }
    ]
  }
}
```

---

## API Reference

### `generate_wip(options, outputPath)`

Creates a WIP file and saves it to disk. Optionally signs it with a local account.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options.markdown_text` | `string` | **Yes** | Commitment text in Markdown format |
| `options.images` | `ImageSource[]` | No | Array of image sources |
| `options.account` | `string` | No | Account name/address for signing. If omitted, no signature is added |
| `outputPath` | `string` | **Yes** | File path to save the WIP file |

**Returns:** `Promise<string>` — Path to the generated WIP file.

**ImageSource:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | `string` | **Yes** | File path, HTTPS URL, or data URL |
| `id` | `string` | No | Custom media ID |
| `filename` | `string` | No | Custom filename |

---

### `verify_wip(wipFilePath, hash_equal?, requireSignature?)`

Verifies a WIP file's integrity and signatures.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `wipFilePath` | `string` | **Yes** | Path to the WIP file (local path or HTTPS URL) |
| `hash_equal` | `string` | No | Expected hash value for additional verification |
| `requireSignature` | `boolean` | No | If `true`, the file must have at least one valid signature |

**Returns:** `Promise<WipVerificationResult>`

**WipVerificationResult:**

| Field | Type | Description |
|-------|------|-------------|
| `valid` | `boolean` | Overall verification result |
| `error` | `string` | Error message if verification failed |
| `hashValid` | `boolean` | Whether the content hash matches |
| `signatureValid` | `boolean` | Whether all signatures are valid (undefined if no signature) |
| `hasSignature` | `boolean` | Whether the file contains any signature |
| `signatures` | `WipSignatureVerification[]` | Per-signature verification details |

---

### `sign_wip(wipFilePath, account, outputPath?)`

Adds a digital signature to an existing WIP file. Supports multi-signature — if the file already has signatures, the new one is appended (or replaces an existing signature from the same public key).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `wipFilePath` | `string` | **Yes** | Path to the WIP file |
| `account` | `string` | No | Account name or address for signing. If omitted, uses the default account |
| `outputPath` | `string` | No | Output path (defaults to overwriting the input file) |

**Returns:** `Promise<string>` — Path to the signed WIP file.

---

### `wip2html(wipPath, options?)`

Converts a WIP file (or directory of WIP files) to human-readable HTML.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `wipPath` | `string` | **Yes** | Path to a `.wip` file or directory containing `.wip` files |
| `options.title` | `string` | No | Custom HTML page title |
| `options.theme` | `enum` | No | `"light"` or `"dark"` |
| `options.outputPath` | `string` | No | Output file path (for single file) or directory (for batch) |

**Returns:** `Promise<string | string[]>` — Output file path(s).

---

## Use Cases

| Scenario | How WIP Is Used |
|----------|-----------------|
| **Service Listings** | Merchants attach WIP files to Service products as immutable product descriptions. Buyers verify the WIP hash at purchase time. |
| **Contractual Commitments** | Parties create and sign WIP files documenting agreed terms. Each party's signature provides non-repudiation. |
| **AI Agent Promises** | AI agents generate WIP files to record commitments made during automated negotiations or workflows. |
| **Legal Evidence** | Signed WIP files serve as tamper-proof records of promises, usable in arbitration or dispute resolution. |
| **Cross-System Communication** | Systems exchange WIP files as self-verifiable data packets without needing a trusted intermediary. |

---

## Relationship with Other Components

| Component | Relationship |
|-----------|-------------|
| **Service** | WIP files are attached to Service products via the `wip` field. The `wip_hash` is extracted and stored on-chain. |
| **Order** | Buyers must provide the matching `wip_hash` when purchasing a WIP-backed product. |
| **Messenger** | WIP files can be sent as file attachments through the encrypted Messenger. |
| **Arbitration** | WIP files serve as evidence in dispute resolution, providing immutable records of original commitments. |
| **Account** | Signatures are created using local Account keys (Falcon-512 keypairs). |

---

## File Extension & MIME Type

| Property | Value |
|----------|-------|
| File extension | `.wip` |
| MIME type | `application/json` |
| Encoding | UTF-8 |

---

