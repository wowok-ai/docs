# onchain_operations / gen_passport

Generate Verified Passport Object: Create immutable verified credentials (passport).

> **Structure Exception**: `gen_passport` has a **FLAT** structure — no `data` wrapper, no `submission` field.

## Schema

```typescript
GenPassport {
  // Guard verification
  guard: NameOrAddress | NameOrAddress[];  // Guard object ID(s) to verify and embed
  
  // Optional submission data during Guard verification
  info?: SubmissionCall;              // Submission data for Guards requiring user input
  
  env?: CallEnv;                      // Optional execution environment
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall.