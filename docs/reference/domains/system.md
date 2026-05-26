---
description: API reference for system() — file names, MIME types, semver, and cron expressions.
---
# system()

System and file-related data.

| Method | Returns | Description |
|---|---|---|
| `.fileName()` | `TextFaker` | File name |
| `.fileExt()` | `TextFaker` | File extension |
| `.filePath()` | `TextFaker` | Full file path |
| `.mimeType()` | `TextFaker` | MIME type |
| `.semver()` | `TextFaker` | Semver string |
| `.cron()` | `TextFaker` | Cron expression |

```typescript
system().semver().create()    // '3.2.1'
system().mimeType().create()  // 'application/json'
```

[← Back to Faker API](/reference/faker)
