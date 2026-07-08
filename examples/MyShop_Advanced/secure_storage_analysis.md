# Secure Storage Encryption/Decryption Analysis Report

## Scope

Investigate whether the encryption/decryption implementation in
`d:\wowok\ts-sdk\packages\wowok\src\w\local\secure-storage.ts` (latest SDK changes)
is the root cause of the runtime error `JSON.parse(...).find is not a function`
observed when the MCP server executes `query_account_list` / `onchain_operations`.

---

## 1. Implementation Overview

`secure-storage.ts` provides transparent AES-GCM encryption for account data.

### Key Model (DEK / KEK)

| Key | Purpose | Source |
| --- | --- | --- |
| DEK | 32-byte random key, encrypts account JSON | `randomBytes(32)` |
| KEK | Wraps/unwraps DEK | `HKDF-SHA256(defaultMasterSecret, salt)` (default mode) or `PBKDF2(password, salt, 600000)` (password mode) |
| wrappedKey | KEK-encrypted DEK, persisted in `key_metadata` table | AES-GCM(KEK, DEK) |

### Data Flow

```
Account.put(JSON)  ─►  SecureAccountStorage.put  ─►  CryptoVault.encrypt  ─►  SecureEnvelope JSON  ─►  SQLiteAccountStorage.put
SQLiteAccountStorage.get  ─►  SecureEnvelope JSON  ─►  SecureAccountStorage.get  ─►  CryptoVault.decrypt  ─►  Account JSON array
```

### SecureEnvelope Format

```json
{
  "v": 1,
  "mode": "default",
  "kdf": "hkdf-sha256",
  "salt": "<base64>",
  "wrappedKey": "<base64>",
  "iv": "<base64>",
  "ct": "<base64>"
}
```

---

## 2. Code-Level Verification

### 2.1 `SecureAccountStorage.get()` (Lines 435-460)

```typescript
async get(): Promise<string | undefined> {
    const raw = await this._backend.get();
    if (!raw) return undefined;

    let parsed: any;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return raw; // Not JSON - return plaintext
    }

    if (this.isSecureEnvelope(parsed)) {
        return this._vault.decrypt(parsed as SecureEnvelope, this._sessionPassword);
    }

    // Old plaintext data
    return raw;
}
```

- If the stored value is a `SecureEnvelope`, it decrypts and returns the plaintext array.
- If the stored value is old plaintext JSON (an array), it returns it directly.
- If the stored value is not JSON, it returns it directly.

**Verdict: Correct.** Handles encrypted, legacy plaintext, and non-JSON data.

### 2.2 `SecureAccountStorage.put()` (Lines 462-466)

```typescript
async put(data: string): Promise<void> {
    const envelope = await this._vault.encrypt(data, this._sessionPassword);
    await this._backend.put(JSON.stringify(envelope));
}
```

**Verdict: Correct.** Always encrypts before writing.

### 2.3 `isSecureEnvelope()` (Lines 425-434)

```typescript
private isSecureEnvelope(value: any): value is SecureEnvelope {
    return (
        value &&
        typeof value === "object" &&
        value.v === ENVELOPE_VERSION &&
        typeof value.ct === "string" &&
        typeof value.wrappedKey === "string" &&
        (value.kdf === "hkdf-sha256" || value.kdf === "pbkdf2-sha256")
    );
}
```

**Verdict: Correct.** Properly distinguishes `SecureEnvelope` from plaintext arrays.

### 2.4 `CryptoVault` Key Management

- `ensureInitialized()`: Loads metadata from `key_metadata` table; if absent, initializes default mode.
- `getDek()`: Derives KEK from default master secret or password, unwraps DEK, caches in memory.
- `encrypt()` / `decrypt()`: AES-GCM with random 12-byte IV.

**Verdict: Correct.** Standard keystore pattern, no key-handling bugs detected.

---

## 3. Runtime Verification

### 3.1 Direct SDK Test (from MCP server's `node_modules`)

```bash
cd d:\wowok\agent\mcp
node --input-type=module -e "import { Account } from '@wowok/wowok'; ..."
```

**Result: SUCCESS** - 3 accounts returned:

```
Account count: 3
  - myshop_merchant 0x574ce27a13f22bc9c76660494428d817934833bdbb662811ad2973ff085aa881
  - myshop_customer 0xf009287953c4289585511908030a74b097a83e7d4601655481af6d9de64a95f2
  - test-test1 0xc963547f4e1219a23f6dfbdc7fe40f8877c1b12ada098d82438638ea505e4a63
```

### 3.2 MCP Server `query_account_list` Call

**Result: FAILURE** - `c.filter is not a function`

### 3.3 Database Content Inspection

The `accounts` table in `C:\Users\zhou\.wow\V1\account.db` contains a valid
`SecureEnvelope` JSON object (encrypted). The `key_metadata` table contains the
corresponding key metadata. Direct SDK decryption succeeds.

---

## 4. Root Cause Analysis

### 4.1 The Encryption Code Is Not the Bug

The encryption/decryption logic in `secure-storage.ts` is correct. Evidence:

1. Direct SDK execution from the MCP server's own `node_modules` succeeds.
2. The built `account.mjs` in `node_modules/@wowok/wowok/dist/esm/w/local/` imports
   and uses `SecureAccountStorage` (aliased as `a74l`).
3. The built chunk `secure-storage-BK6QRSLG.mjs` in
   `node_modules/@wowok/wowok/dist/esm/` contains the full, correct implementation.
4. Database content is a valid `SecureEnvelope` and decrypts successfully.

### 4.2 Actual Root Cause: Stale Module Cache in the MCP Server Process

The MCP server is a long-running Node.js process started by Trae IDE. The failure
occurs because the running process has **cached an older version of the SDK module**
that predates the `SecureAccountStorage` integration.

#### Why the Error Manifests

| Component | Old Code (cached in process) | New Code (on disk) |
| --- | --- | --- |
| `storage.get()` | Returns raw DB string (SecureEnvelope JSON) | Decrypts SecureEnvelope → plaintext array |
| `account.list()` | `JSON.parse(raw)` → object (SecureEnvelope) → `.filter()` fails | `JSON.parse(plaintext)` → array → `.filter()` works |

The old code path:
1. `SQLiteAccountStorage.get()` returns the raw `SecureEnvelope` JSON string.
2. Old `Account.list()` does `JSON.parse(value)` → gets a `SecureEnvelope` **object**.
3. Calling `.filter()` on an object (not an array) throws `c.filter is not a function`.

#### Why Earlier Operations Worked

Earlier operations (account creation, guard creation, etc.) executed when the database
still contained **plaintext** account data (before any write through the new
`SecureAccountStorage.put()`). Once the new `put()` encrypted the data, the old cached
`get()` could no longer return a parseable array.

### 4.3 Confirmation: Built Artifacts on Disk Are Correct

| Check | Location | Status |
| --- | --- | --- |
| `secure-storage-BK6QRSLG.mjs` exists | `node_modules/@wowok/wowok/dist/esm/` | Present |
| `account.mjs` imports `SecureAccountStorage` | `node_modules/@wowok/wowok/dist/esm/w/local/account.mjs` | Correct (`import{t as a74l}from'../../secure-storage-BK6QRSLG.mjs'`) |
| `account.mjs` uses `new a74l(new SQLiteAccountStorage())` | Same file | Correct |
| Direct execution returns accounts | `node --input-type=module` from MCP dir | Works |

---

## 5. Conclusion

| Question | Answer |
| --- | --- |
| Is `secure-storage.ts` the source of the bug? | **No.** The encryption/decryption implementation is correct. |
| What causes `JSON.parse(...).find is not a function`? | The running MCP server process has a **stale module cache** from before the SDK rebuild. The old code reads the encrypted `SecureEnvelope` and treats it as a plaintext array. |
| How to fix? | **Restart the MCP server process** so Node.js reloads the updated SDK from disk. |

---

## 6. Recommendations

1. **Restart MCP Server**: After any SDK rebuild, the MCP server process must be
   restarted to pick up the new code. Trae IDE manages this process; restart it
   from the IDE's MCP server settings or restart Trae IDE.

2. **Add a Version Stamp**: Consider embedding a build timestamp or SDK version in
   the `SecureEnvelope` or module exports so that a version mismatch can be detected
   at runtime rather than producing cryptic `find is not a function` errors.

3. **Graceful Fallback**: In `Account.list()`, if `JSON.parse(value)` returns a
   non-array, log a clear diagnostic (e.g., "Stored data is not an array — possible
   encryption mismatch") instead of letting `.filter()` throw an opaque TypeError.
