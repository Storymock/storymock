---
description: API reference for image() — avatar URLs, image URLs, and data URIs.
---
# image()

Image URL generation.

| Method | Returns | Description |
|---|---|---|
| `.avatar()` | `TextFaker` | Avatar image URL |
| `.url()` | `TextFaker` | Random image URL |
| `.dataUri()` | `TextFaker` | Base64 data URI |
| `.placeholder(w?, h?)` | `TextFaker` | Placeholder image URL |

```typescript
image().avatar().create()              // 'https://avatars.example.com/...'
image().placeholder(200, 200).create() // 'https://via.placeholder.com/200x200'
```

[← Back to Faker API](/reference/faker)
