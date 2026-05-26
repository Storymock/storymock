---
description: API reference for text() — generate strings, identifiers, and patterns.
---
# text()

Creates a `TextFaker`. Default: random alphanumeric string, length `[1, 20]`.

**Mixins:** Excludable, Measurable, Nullable, Seedable

For semantic strings (names, emails, cities), see [semantic domains](/reference/faker#_4-semantic-domains).

## Length

| Method | Description | Example |
|---|---|---|
| `.length(n)` | Exact length | `text().length(10)` |
| `.minLength(n)` | Minimum length | `text().minLength(5)` |
| `.maxLength(n)` | Maximum length | `text().maxLength(20)` |

## Charset

| Method | Description | Example |
|---|---|---|
| `.alpha()` | Letters only | `text().alpha()` |
| `.alphanumeric()` | Letters + digits (default) | `text().alphanumeric()` |
| `.digits()` | Digits only | `text().digits().length(6)` → `"048271"` |
| `.lowercase()` | Force lowercase | `text().alpha().lowercase()` |
| `.uppercase()` | Force uppercase | `text().alpha().uppercase()` |
| `.fromCharacters(chars)` | Custom charset | `text().fromCharacters('abc123')` |

## Identifiers

| Method | Description | Example |
|---|---|---|
| `.uuid()` | UUID v4 | `text().uuid()` → `"550e8400-..."` |
| `.ulid()` | ULID | `text().ulid()` |
| `.nanoid(size?)` | NanoID (default 21) | `text().nanoid()` |
| `.cuid()` | CUID | `text().cuid()` |
| `.objectId()` | MongoDB ObjectId | `text().objectId()` |
| `.slug()` | URL-safe slug | `text().slug()` |

## Pattern

| Method | Description | Example |
|---|---|---|
| `.regex(pattern)` | Match a regex | `text().regex(/[A-Z]{3}-\d{4}/)` |
| `.template(str)` | Template with placeholders | `text().template('user-{{uuid}}')` |

## Exclusion

| Method | Description | Example |
|---|---|---|
| `.not(v)` | Exclude value(s) | `text().not(['admin', 'root'])` |

[← Back to Faker API](/reference/faker)
