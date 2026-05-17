# onchain_operations / gen_passport

Create immutable verified credentials after Guard validation passes.

## Data Schema

```typescript
CallGenPassport_Data {
  guard: string;                    // Guard object ID to verify
  info?: SubmissionCall;            // Optional submission data
}
```

---

See [_common.md](./_common.md) for shared types: CallEnv, SubmissionCall.