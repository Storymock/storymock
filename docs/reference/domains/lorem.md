---
description: API reference for lorem() — words, sentences, and paragraphs of placeholder text.
---
# lorem()

Placeholder text.

| Method | Returns | Description |
|---|---|---|
| `.word()` | `TextFaker` | Single word |
| `.words(n?)` | `TextFaker` | Multiple words (default: 3) |
| `.sentence()` | `TextFaker` | Single sentence |
| `.sentences(n?)` | `TextFaker` | Multiple sentences |
| `.paragraph()` | `TextFaker` | Single paragraph |
| `.paragraphs(n?)` | `TextFaker` | Multiple paragraphs |

```typescript
lorem().sentence().create()    // 'Dolor sit amet consectetur.'
lorem().words(5).create()      // 'lorem ipsum dolor sit amet'
```

[← Back to Faker API](/reference/faker)
