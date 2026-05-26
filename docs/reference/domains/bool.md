---
description: API reference for bool() — generate boolean values with configurable probability.
---
# bool()

Creates a `BoolFaker`. Default: 50% true / 50% false.

**Mixins:** Nullable, Seedable

| Method | Description | Example |
|---|---|---|
| `.probability(p)` | Probability of `true` (0–1) | `bool().probability(0.8)` |
| `.true()` | Always `true` | `bool().true()` |
| `.false()` | Always `false` | `bool().false()` |

[← Back to Faker API](/reference/faker)
