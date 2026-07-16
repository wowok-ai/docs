# WTS — Witness Timestamped Sequence

---

## Overview

**WTS** (Witness Timestamped Sequence) is a JSON-based file format for creating **self-proving, tamper-proof records of encrypted conversations** from the WoWok Messenger. It captures the complete message history between two parties, including server-attested Merkle proofs, timestamps, and optional digital signatures.

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
  "wts": "https://github.com/wowok-ai/docs/blob/main/WTS.md",
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
| `wts` | `string` | **Yes** | Schema identifier URL. Fixed value: `"https://github.com/wowok-ai/docs/blob/main/WTS.md"` |
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
| `msgType` | `number` | No | Message type: `1` = normal message, `3` = prekey message (for session establishment) |
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
| `fileName` | `string` | **Yes** | ZIP filename |
| `fileSize` | `number` | **Yes** | File size in bytes |
| `contentType` | `string` | **Yes** | Content type (`"wts"`, `"wip"`, `"zip"`) |
| `fileHash` | `string` | **Yes** | SHA-256 hash of the file content |
| `localCachePath` | `string` | No | Local cache path for the extracted file |
| `downloadedAt` | `number` | No | Download timestamp in milliseconds |

---

### `meta` — Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `meta.type` | `string` | **Yes** | File type identifier. Fixed value: `"wts"` |
| `meta.version` | `string` | **Yes** | Format version. Current: `"1.0"` |
| `meta.created` | `string` | **Yes** | Creation timestamp in ISO 8601 format |
| `meta.hash` | `string` | **Yes** | SHA-256 hash of `{ wts, session, messages }` as a lowercase hex string (no prefix) |
| `meta.algorithm` | `string` | **Yes** | Hash algorithm identifier. Fixed value: `"sha256"` |
| `meta.startTime` | `number` | **Yes** | Timestamp of the earliest message in the sequence (ms, Unix epoch) |
| `meta.endTime` | `number` | **Yes** | Timestamp of the latest message in the sequence (ms, Unix epoch) |
| `meta.messageCount` | `number` | **Yes** | Total number of messages in the sequence |
| `meta.merkleRoot` | `string` | **Yes** | Merkle root of the **last** message in the sequence (hex-encoded, `0x` prefix) |
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
  "wts": "https://github.com/wowok-ai/docs/blob/main/WTS.md",
  "payload": {
    "session": {
      "participants": [
        "0x1bb68192908d41c470248646cb1b3e9133f310b1bab81878177f20871de9d523",
        "0x463242c3893498318e3b7fa43f4693d3191fd3f819be3792fd9e1573c2608523"
      ]
    },
    "messages": [
      {
        "id": "463242c3_1bb68192_0_5f6190e2c9fab488",
        "from": "0x463242c3893498318e3b7fa43f4693d3191fd3f819be3792fd9e1573c2608523",
        "to": "0x1bb68192908d41c470248646cb1b3e9133f310b1bab81878177f20871de9d523",
        "plaintextHash": "0xcd4f50fbe31b75b66c1669153c50f9201150d67e10e2fb2c44d6460a78179d95",
        "clientTimestamp": 1784063229403,
        "timestamp": 1784063229479,
        "leafIndex": 0,
        "prevRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "merkleRoot": "0xa63a9f2e727b6755af88acbb81e78d0261061e02d265373f8e786e7b8c5fc16e",
        "serverSignature": "0x39b74d08e141d7d767edfc84a0295ea4ee99b79573f5c26625dc1f5c3ded1c3de22a99c0b0743bbdd87a2e7023d32edc6ca9ea57016f877b1e03be9b9679567c80d3cd1eeebb3a68117fcc708cb352d5ca7315aaa39be64ce8122912e6b722cd0e39f1d12d1536f5b6765869111e49163fa4ba1c847433cbe70d8e4a2555dec2c525237bb7d683d66cea48736174ec65f5b1a5a3f2ad47cb5da6e264e62270723aaf5f979e8c4a3910f2fd42e5a55c1d97b52e9dc1cddfe365aedfbabb9e7efac86b5ae9715fc438c568a46d133b3db973c318978895061f6fec90c6236320c0b748ec7eab3136344b80d4b8a4a7890b31c9af98dcc6afba9360c2345a8c3216e5268bd52f68c193b7a36295f5badc865973aa25cd74e708c026fc17a127e2c9f790e923c987d0576c2a77f33507f9dd2ed2f39bcc88c5125744fbd049230fc6b85ac2d71da8b24af6ca12f962f775ece2849725a824931c407e7464273688e2a730ea19162658c68e15b0f6e3895b52bc427eac63eb0f4cab7404a35935eed1dcc349c2a45258fda70d9867091c48ac2d7898eb6910a4ea0881a0a07db48e954bcdc1d1eb25ba76a1f5911247fa4f5f37695cf2c4ea69225d197d4faed0206d9e9724ea7ee39012f3e293ac0b147d4190423dec62df45aa3470be0fbac52cadaca9a699ea6e332e66d560a5ebacbf0cca203fafd4513b4a58e68ccbb3944b22489c3db95688ca21dc0adf8615dcdb21ada3b78d702931e739bdcbd6dceee331e8989861d689c37f9d8a0ec20abbcf125df18a8fa6ac9181b83628bc592f44fcdafda2278bea32c5fb39c677be775377b8c9b5f3fa36924f293939df31ad591e44be18d03193a5e58d3f6811b4dd6bfc7b366db6b83bf8c570bd220a3a07a77f1ed21f90eae18864c72cc65d6355980000000000000000000000",
        "serverPublicKeyIndex": 0,
        "msgType": 3,
        "plaintext": "[S3] Hello Bob! Alice 发送的第一条消息。2026-07-14T21:07:09.401Z",
        "guardAddress": "0xc0be3891a0f1fa417205f498cc0c2af2ac5f88c2a56bc4f31b80d71750863c28",
        "passportAddress": "0xff84d7dbf6e55b163ec4b5463a014f8b43c35ddfae4a219071f7474e515d45be"
      },
      {
        "id": "1bb68192_463242c3_1_9c68e006c97f1baa",
        "from": "0x1bb68192908d41c470248646cb1b3e9133f310b1bab81878177f20871de9d523",
        "to": "0x463242c3893498318e3b7fa43f4693d3191fd3f819be3792fd9e1573c2608523",
        "plaintextHash": "0xe85dbb67a3120a8cc8c76aed01d4f2362b8c3998d8f2f2f09df9cc6e782dc297",
        "clientTimestamp": 1784063231046,
        "timestamp": 1784063231081,
        "leafIndex": 1,
        "prevRoot": "0xa63a9f2e727b6755af88acbb81e78d0261061e02d265373f8e786e7b8c5fc16e",
        "merkleRoot": "0x39fefa08ab2da02151dffc8e118fa15b0f90208cf58dccc354a2fc4d053d1d14",
        "serverSignature": "0x39f4051da9986b129f06c197d55ffb57b6e22f0bbf5fc41db3f1aabd22eea882330d7fbb1933c437a89acccff35f176bf46b195c953161e3a6d49b7358a1f2a332cd9ef08de873b5d52a5e96bed855158f3131f690b098a7fb8fa4d94b6f0d932f361d4c4c606074e6c97e60f08742ccc2a315caf93379c95b0a8d21f9a90bbdb67bde3a46075f4927792fd27987a831754eaf4a4502e72189da17987c33503d01608b282db572cffdda167f1d0783c252187b3738e2a9f39c6bb378df7bee1d8c7b6d9ad198947919660a945797f73d988bc2dcbe68d0881271b3dc2fb0a7fd3f292782d900bef1a8715b2355b56d1bbb1399ae8955933ad51b330635bfefee8777b7b041b7b048fcbe40ab96dea72f67ffcd3cd08f1711da4f72d3f86bd6db6661870fa4ef5e65e868a5ec5b4f64410662262c4d0d1f6ff7f3428f881c53ed2321a14ad433f6242b46b561bc8e4efda4c6ff90a9e44592250a6b83a579ed04df6060d8dcd7fb7ec2a8f76e8f2f21d051a7c84114ba45921d4c08b563c60ea298139472cbbfb25b32081c22d99f2d9082247f6f7346a99d4ecc5dee199f5cf5e6e9e65a5ebbb474e1e4a05f06baa0d732fc99b58885f9618c7d0a977dc6a0100ddd2664a6545d04ea81b7eb3d7c9a060c8cb9b53e82a86db93d245395e8bdaec87a20d899fc440ba08fd26e981dc6658d4d9537ad2233bce5de0b05e9f137737ddb2feac3d795047870dded44a9207f731f4f75179dc06fb56599a28c350ef7ed43830af726c7394573749644a3c1a0ece289bfab59d15429e6e63590c62ce2b90fd551496279b8dc73111ba06c7a9ef6689256f565d36d13b1d724d2fea2b73b903ab1193441819c638c42fa7d634b54adf234aa095283cc6b231245b6e6ede8fb38b844ce669350cc63fc8b90000000000000000000000000",
        "serverPublicKeyIndex": 0,
        "msgType": 1,
        "plaintext": "[S3] Hi Alice! Bob 的回复消息。2026-07-14T21:07:11.046Z",
        "guardAddress": "0xc0be3891a0f1fa417205f498cc0c2af2ac5f88c2a56bc4f31b80d71750863c28",
        "passportAddress": "0xff84d7dbf6e55b163ec4b5463a014f8b43c35ddfae4a219071f7474e515d45be",
        "lastReceivedLeafIndex": 0
      },
      {
        "id": "463242c3_1bb68192_2_4e817d972b59379a",
        "from": "0x463242c3893498318e3b7fa43f4693d3191fd3f819be3792fd9e1573c2608523",
        "to": "0x1bb68192908d41c470248646cb1b3e9133f310b1bab81878177f20871de9d523",
        "plaintextHash": "0x18edebc205f58dd6a440e76b00bd4b2a653303fc1ba1b845d1a4246ba4242b81",
        "clientTimestamp": 1784063232734,
        "timestamp": 1784063232752,
        "leafIndex": 2,
        "prevRoot": "0x39fefa08ab2da02151dffc8e118fa15b0f90208cf58dccc354a2fc4d053d1d14",
        "merkleRoot": "0x0293345d66b10a25a08422f52b93c44783ab3046986921563e2488b7317bf6db",
        "serverSignature": "0x39cba06b591376c9a449726364d5e8e34e3883ebdf436d827cfb6e22d12b96c0c30f9d8f177dea45b9d82266ae94eca6ceeabd8875b62cce4b293b8efddfcac367aad418435f254df9fcf4a10ca4ee3403af81bd51d9ad0d050b50ddcab664f8b7154529427f3fdfd83ede7e87d8d3dfbeb2ea40e9f02cce48dbb8b4b6c8b9616b592424b04a541a2bc0a20dc41a692244557541954418e13f608e6be68d6da2fd996e97f3f7a03a5ad86e28bc79b277cd045e52e73ba8a25f8f390d30851699d6d52fa4e48c37a4a0a18430d03609ae3e53ba6cf21188fbeefbdd671c43159f594e74f5a9689a9c243f7627ff4b6743cb1381a77b386392cc1c44d68a80d0598203f4d1e1b40ae0c3dfc9e6cf4cf3a0ba666fed80562558cd146f490f98937962cdf195c2a54c9f63215ff34489229523e8256ec0c39b474a82a74259d9fd96b26dd0ee64098b55aadde59e3a6e61346aeae3893310e6be050518ba723489243a5c0c573bebfb326a0f2882acbfe661b6dbdba5ab941158ce3885f622d848ea7a87c655866b8b4e958da9bdf919326678300bc205a1316c126c58ba5abd44d9828830495a74822308d71e7f9f6e9067fa69c95a29c51975ef3baf3c0b27fcdec0d098cc25a68c39fe83c0bf71592d32e2682378a3853631ea8492fe577b581e1de8a417bcb43df9e5d18722d75cf4af90f99304dd3c65f37ba6eab84c69ae44d784bbba658b0aba7fafd05ec6122e40e6cd4156448c9f115d607ebdc85cdda9a04fef9137d20bba8d22554cc35b0782402483b5386774ab0e88aa19acd6ad8d549264f0a87faffe32b6e1d17389fb453d557788cbaf1e31a2244562f136d51f6166f914c675225a0ab1e3bb63690cb485c0aa473cba184b2e60fccb512572d017e31dbe5ba14dd76398dc955f89af4037f00000000000000000",
        "serverPublicKeyIndex": 0,
        "msgType": 1,
        "plaintext": "UEsDBBQACAgIAOYo71wAAAAAAAAAAAAAAAAQAC0AczQtdGVzdC1maWxlLnR4dFVUBQABAKVWagoAIAAAAAAAAQAYABCTqr3UE90BEJOqvdQT3QEQk6q91BPdAYsONolVeLF/5rMZ65/saHiyY9Wzrd0v1k99Nq39ye5tjxuauJ62tT5dt/P9nlkQoWfbOp41roco4no2fdvL6Vve75llZGBkpmtgrmtoEmJkaGVgbmVopGdmZhTFBQA1WW3pXgAAAF8AAABQSwECAAMUAAgICADmKO9cNVlt6V4AAABfAAAAEAAtAAAAAAAAAAAApAEAAAAAczQtdGVzdC1maWxlLnR4dFVUBQABAKVWagoAIAAAAAAAAQAYABCTqr3UE90BEJOqvdQT3QEQk6q91BPdAVBLBQYAAAAAAQABAGsAAADFAAAAAAA=",
        "guardAddress": "0xc0be3891a0f1fa417205f498cc0c2af2ac5f88c2a56bc4f31b80d71750863c28",
        "passportAddress": "0xff84d7dbf6e55b163ec4b5463a014f8b43c35ddfae4a219071f7474e515d45be",
        "zipMetadata": {
          "fileName": "s4-test-file.txt.zip",
          "fileSize": 326,
          "fileHash": "0xb3a26eae014ada21b5e3b97f07389d5022942dab685dcb0f24da7be36ad87658",
          "contentType": "zip"
        },
        "lastReceivedLeafIndex": 1
      }
    ]
  },
  "meta": {
    "type": "wts",
    "version": "1.0",
    "created": "2026-07-14T21:07:31.715Z",
    "hash": "2bafa460c489742bd3d0270dc51143ec202dfa36fb5782d24e2fe16303808be1",
    "algorithm": "sha256",
    "startTime": 1784063229403,
    "endTime": 1784063232734,
    "messageCount": 3,
    "merkleRoot": "0x0293345d66b10a25a08422f52b93c44783ab3046986921563e2488b7317bf6db",
    "creator": "0x463242c3893498318e3b7fa43f4693d3191fd3f819be3792fd9e1573c2608523",
    "participant": "0x1bb68192908d41c470248646cb1b3e9133f310b1bab81878177f20871de9d523",
    "serverPublicKeys": [
      {
        "publicKey": "0x09a0442b99e493a08c6456792ca930ba2156f4eadeea5e4acb32bb629a52d82a8a3b9554924533e2ae8a83712c7704d5d18e0a21f2038fe72305405fa0b9ec77607ac9eb33d09524284a32eeeb716ca51fc23994f631a84b14e16cd541e4a174c9a72a6f64e8fb578cbfb06687755b489f4011613286e8282e5a34b464c4909211245aec9af69f61a1922f2a706b2c9009899c0449b5934336e5983a7a2cc04984f22608f9d4d797b2baa885444ecbd0516cf872636d8d2986474430e1073adc9539900a9e051af36535ed6d9985d4531369e686f4b9195303b9a7dc0a2a85c64196e13351cf510aa14c7e0643cb606a648255c4c17b7751dc4816133465d1b4793228251f42a199ba02d07b8e8ab352a56abe1d901b1e083471d4924169102c377294687581c186d844769586225a9ce615ba16be298a1c200ee51376d2d218b3dbe41040f904419c3492440513c4c69c45d6a553ebd0e2609221813287675b6af7189f9b04a58d1057d727bf336441ebf71fa91d6d898be8466c951e9e4abaadb96379e6147921036d10aca331af6e94769071e250f07454dad616a5618be9cf58adef80184e0739d909a79fc854e8e308a1a0e57be29b0df865501493b554b68fb052c0f32ae14731a4d11a5dad50dcf8a82826e578317fe07519f41eb494b4c8520e5809e1e947832b0cfe4b039ae4c869796cb87c03ebae327480af83bd6f2112335b57577c39ba934eadb4b5653d879d604d37385ab82b54bd4ca1bda62399d903eaf6c1181ac134d97898618b43241ee4758212da843d8e1843298d73faaa76736b1d20a8619022255019ae7270fe492a6d65f91382119611fe869a4f9d4abd360a27dec27e92fe110739a7cf9be144b1b4127da33ce20a8ba0da715923a16f699f481a4e39ea9eb6a86e78b0e58ae4a73e7c4891dc14b639b008f826bd7e5d95a8835d948e4af4eb44c59389edf6945f8a2b5aed3cc49dd84d9f321e092b8aa33b7611892dc6857838ede54a6aab213c0d19e84e746429a4b32f65c69ffdf699f30d452e90ba4b13ce5e973daaa7014d0b9a584d22c2c956676019eb21de9d33c8d2e45a1d2b68a162b8daaab9028a159b5799132396ccf14a8d8e5f8d892b38e7093c50e299f3652b83f14b110de0abad9a58f5a38c6351859f06b1aa311ed57e46a529c17fa449313fd0c746913853745bf5aa297b79920a123a325d0476229445e4f60865c76331128eaacc95393a6ab9d368549c32ca131a79d305",
        "validFrom": 0
      }
    ]
  }
}
```

### Signed WTS (With Plaintext + Signature)

```json
{
  "wts": "https://github.com/wowok-ai/docs/blob/main/WTS.md",
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
| `account` | `string` | No | Account name or address for signing. If omitted, uses the default account |
| `outputPath` | `string` | No | Output path (defaults to overwriting the input file) |

**Returns:** `Promise<string>` — Path to the signed WTS file.

---

### `wts2html(wtsPath, options?)`

Converts a WTS file (or directory of WTS files) to a human-readable HTML page with styled message bubbles, timestamps, and verification status.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `wtsPath` | `string` | **Yes** | Path to a `.wts` file or directory containing `.wts` files |
| `options.title` | `string` | No | Custom HTML page title |
| `options.theme` | `enum` | No | `"light"` or `"dark"` |
| `options.outputPath` | `string` | No | Output file path (for single file) or directory (for batch) |

**Returns:** `Promise<string | string[]>` — Output file path(s).

---

## Use Cases

| Scenario | How WTS Is Used |
|----------|-----------------|
| **Legal Evidence** | Generate a WTS of a conversation and sign it. The file is a self-contained evidence package with server-attested timestamps and Merkle proofs. |
| **Dispute Resolution** | In arbitration, both parties can present WTS files of the same conversation. The Merkle chain and server signatures prove message authenticity and order. |
| **Compliance Auditing** | Organizations generate periodic WTS sequences of business communications for compliance records. |
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
      { "publicKey": "0xbbbb...", "validFrom": 1 }
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
