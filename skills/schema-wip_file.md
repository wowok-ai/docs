# Schema: wip_file

> 📄 WIP (Witness Immutable Promise) file operations: generate (create WIP files from markdown and images), verify (integrity check), sign (add signatures), or wip2html (convert to HTML).

---

## Top-Level Structure

```
WipFileOperation
├── Exactly one operation type (generate / verify / sign / wip2html)
└── env?: CallEnv
```

---

## Operations

### generate — Create WIP File

```
{
  "generate": {
    "markdown_file": "./document.md",     // Source markdown file path (required)
    "image_files": ["./image1.png"],      // Attached image files (optional)
    "output_file": "./output.wip"         // Output WIP file path (required)
  }
}
```

**Process**:
1. Reads markdown content
2. Embeds referenced images
3. Computes content hash
4. Generates tamper-evident WIP file

---

### verify — Verify WIP File Integrity

```
{
  "verify": {
    "wip_file": "./document.wip"         // WIP file to verify (required)
  }
}
```

**Returns**: Verification result including hash match status and signature validity.

---

### sign — Sign WIP File

```
{
  "sign": {
    "wip_file": "./document.wip",         // WIP file to sign (required)
    "account": "signer_account"           // Signing account name (optional, default account)
  }
}
```

**Returns**: Updated WIP file with added signature.

---

### wip2html — Convert WIP to HTML

```
{
  "wip2html": {
    "wip_file": "./document.wip",         // Source WIP file (required)
    "output_file": "./output.html"        // Output HTML file path (required)
  }
}
```

**Returns**: HTML rendering of the WIP content with embedded images.

---

## AI Planning Notes

1. **WIP purpose**: Create tamper-proof documents for information transfer and commercial promises. The content hash ensures any modification is detectable.
2. **Signature chain**: Multiple parties can sign a WIP file to create a chain of evidence.
3. **Use cases**:
   - Service terms and conditions
   - Delivery confirmations
   - Arbitration evidence
   - Commercial agreements
4. **Integration with Service**: Set `wip_hash` in `ServiceSale` items to bind WIP files to service offerings.
5. **Integration with Messenger**: WIP files can be referenced in encrypted messages for secure document exchange.
