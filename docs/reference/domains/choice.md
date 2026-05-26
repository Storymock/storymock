---
description: API reference for choice() — pick from a fixed set of literal values.
---
# choice()

Creates a `ChoiceFaker<T>`. Selects from a fixed set of literal values.

**Mixins:** Excludable, Nullable, Seedable

**Type inference:** `choice('active', 'inactive')` produces `ChoiceFaker<'active' | 'inactive'>`.

```typescript
choice('a', 'b', 'c').create()  // 'b'
```

| Method | Description | Example |
|---|---|---|
| `.weighted(map)` | Weighted probabilities | `choice('a', 'b').weighted({ a: 0.8 })` |
| `.not(...values)` | Exclude options | `choice('a', 'b', 'c').not('b')` |

Keys not in the `weighted()` map share remaining probability equally:

```typescript
choice('a', 'b', 'c').weighted({ a: 0.6 })
// a: 60%, b: 20%, c: 20%
```

[← Back to Faker API](/reference/faker)
