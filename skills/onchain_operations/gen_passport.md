# onchain_operations / gen_passport

Create immutable verified credentials after Guard validation passes.

> **IMPORTANT**: Unlike other onchain operations, `gen_passport` uses a FLAT input structure — fields `guard`, `info`, `env` are directly at the top level, NOT nested under a `data` wrapper.

## Input Schema

```typescript
CallGenPassport_Input {
  guard: string | string[];         // Guard object ID(s) to verify. Can be a single guard or an array of guards.
  info?: SubmissionCall;            // Optional submission data
  env?: CallEnv;                    // Optional environment configuration
}
```

## Features

- **Single Guard**: Pass a single guard ID or name as a string
- **Multiple Guards**: Pass an array of guard IDs or names to verify multiple guards at once
- **Name Resolution**: Supports both guard addresses and LocalMark names

## Examples

### Single Guard
```typescript
{
  guard: "my-guard-name",  // or "0x1234567890abcdef..."
  env: { network: "testnet" }
}
```

### Multiple Guards
```typescript
{
  guard: ["guard-1", "guard-2", "0x1234567890abcdef..."],
  env: { network: "testnet" }
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall.
