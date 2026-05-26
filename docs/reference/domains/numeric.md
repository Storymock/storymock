---
description: API reference for numeric() — generate integers, floats, and formatted numbers.
---
# numeric()

Creates a `NumericFaker`. Default: integer in `[0, 1000]`.

**Mixins:** Bounded, Excludable, Nullable, Seedable

## Constraints

| Method | Description | Example |
|---|---|---|
| `.min(n)` | Minimum value (accepts faker) | `numeric().min(1)` |
| `.max(n)` | Maximum value (accepts faker) | `numeric().max(100)` |
| `.between(a, b)` | Shorthand for `.min(a).max(b)` | `numeric().between(1, 100)` |
| `.positive()` | Alias for `.min(1)` | `numeric().positive()` |
| `.negative()` | Alias for `.max(-1)` | `numeric().negative()` |
| `.not(v)` | Exclude value(s) | `numeric().not(0, 1)` |

## Type

| Method | Description | Example |
|---|---|---|
| `.int()` | Integer (default) | `numeric().int()` |
| `.float()` | Floating-point | `numeric().float()` |
| `.precision(p)` | Decimal places (implies float) | `numeric().precision(2)` |

::: tip
`.precision(n)` implies `.float()` — no need to chain both.
:::

## Format (changes return type to `string`)

| Method | Returns | Example |
|---|---|---|
| `.hex()` | `Faker<string>` | `numeric().min(0).max(255).hex()` → `"B3"` |
| `.binary()` | `Faker<string>` | `numeric().binary()` → `"101"` |
| `.octal()` | `Faker<string>` | `numeric().octal()` → `"17"` |

::: warning
Constraints must come **before** format methods. Format methods return `Faker<string>`, so `.min()` / `.max()` are no longer available after them.
:::

[← Back to Faker API](/reference/faker)
