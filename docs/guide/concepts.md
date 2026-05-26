---
description: The three-layer mental model behind storymock — fakers, schemas, and stories.
---

# Core Concepts

storymock has three layers. Each builds on the one below:

```text
  ┌─────────────────────────────────────────┐
  │  Story — Composes schemas, wires refs   │
  ├─────────────────────────────────────────┤
  │  Schema — Maps fields → fakers → objects│
  ├─────────────────────────────────────────┤
  │  Faker — Generates a single value       │
  └─────────────────────────────────────────┘
```

You can use any layer on its own — a faker works without a schema, a schema works without a story. Each layer adds structure and relationships on top of the one below.

## Faker

A faker is an immutable, lazy builder that describes *how* to generate a value. No value is produced until `.create()` is called, and every method call returns a new instance.
```typescript
numeric().min(18).max(65).create(); // 34
```
→ [Working with Fakers](/guide/fakers)

## Schema

A schema is a typed factory for mock objects. Each field maps to a faker, literal, `when()`, or `derive()`, with compile-time type checking via the generic parameter.
```typescript
const UserSchema = schema<User>({ id: text().uuid(), name: person().fullName(), age: person().age().min(18) });
```
→ [Working with Schemas](/guide/schemas)

## Story

A story composes multiple schemas into a referentially-linked dataset. Use `ref()` for foreign keys and `.setup()` for complex wiring.
```typescript
const checkout = story().add('user', UserSchema).add('order', OrderSchema, { userId: ref('user') }).create();
```
→ [Working with Stories](/guide/stories)

## Domains

Domains are entry points for creating fakers. **Core domains** (`numeric()`, `text()`, `temporal()`, `bool()`, `choice()`, `collection()`) are structural building blocks. **Semantic domains** (`person()`, `internet()`, `finance()`, etc.) produce real-world data and return core fakers, so constraints keep chaining: `person().age().min(18)`, `internet().email().not('a@b')`.
→ [Faker API Reference](/reference/faker)

## Mixins

Mixins grant capabilities to fakers. Not every mixin applies to every domain.

| Mixin | Methods | Applies to |
|-------|---------|------------|
| **Bounded** | `.min()`, `.max()`, `.between()` | numeric, temporal |
| **Measurable** | `.length()`, `.minLength()`, `.maxLength()` | text, collection |
| **Excludable** | `.not()` | numeric, text, temporal, choice |
| **Nullable** | `.nullable()`, `.optional()` | all fakers |
| **Seedable** | `.seed(n)` | all fakers |

→ [Faker API Reference](/reference/faker#_2-mixins)

## Traits

A trait is a named set of field overrides representing a specific state ("admin", "expired"). Traits are partial and type-checked — you only override the fields you need.
```typescript
UserSchema.trait('admin', { role: 'admin' as const }).with('admin').create();
```
→ [Working with Schemas](/guide/schemas)

## Immutability

Every method on every layer returns a **new instance** — the original is never modified. This makes fakers, schemas, and stories safe to fork, store, and compose without side effects.
```typescript
const base = numeric().min(0).max(100);
const small = base.max(10); // new instance — base is unchanged
```
