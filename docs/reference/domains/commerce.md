---
description: API reference for commerce() — products, departments, and ISBNs.
---
# commerce()

Product and retail data.

| Method | Returns | Description |
|---|---|---|
| `.product()` | `TextFaker` | Product adjective |
| `.productName()` | `TextFaker` | Full product name |
| `.productDescription()` | `TextFaker` | Product description |
| `.department()` | `TextFaker` | Department name |
| `.isbn()` | `TextFaker` | ISBN |

```typescript
commerce().productName().create()    // 'Ergonomic Granite Chair'
```

[← Back to Faker API](/reference/faker)
