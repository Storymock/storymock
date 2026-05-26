---
description: API reference for collection() — generate arrays of values from fakers or schemas.
---
# collection()

Creates a `CollectionFaker<T>`. Generates an array from a faker or schema. Default length: `[1, 5]`.

**Mixins:** Measurable, Nullable, Seedable

| Method | Description | Example |
|---|---|---|
| `.length(n)` | Exact length | `collection(text().uuid()).length(3)` |
| `.minLength(n)` | Minimum length | `collection(lorem().word()).minLength(2)` |
| `.maxLength(n)` | Maximum length | `collection(lorem().word()).maxLength(5)` |
| `.unique()` | Deduplicate results | `collection(lorem().word()).unique().length(3)` |
| `.empty()` | Always `[]` | `collection(text()).empty()` |

Schemas can be passed to `collection()`:

```typescript
collection(ItemSchema).length(3).create()
// [{ id: '...', name: '...', qty: 42 }, ...]
```

[← Back to Faker API](/reference/faker)
