---
description: API reference for food() — dishes, ingredients, fruits, and spices.
---
# food()

Food-related data.

| Method | Returns | Description |
|---|---|---|
| `.dish()` | `TextFaker` | Dish name |
| `.ingredient()` | `TextFaker` | Ingredient |
| `.fruit()` | `TextFaker` | Fruit name |
| `.vegetable()` | `TextFaker` | Vegetable |
| `.meat()` | `TextFaker` | Meat type |
| `.spice()` | `TextFaker` | Spice name |

```typescript
food().dish().create()    // 'Pad Thai'
```

[← Back to Faker API](/reference/faker)
