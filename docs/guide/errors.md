# Errors

All errors extend `StorymockError`. Errors are thrown eagerly when possible (at definition time) and lazily at `.create()` time for runtime issues.

## ContradictoryConstraintError

Conflicting constraints make it impossible to generate a valid value.

**Thrown by:** `.create()` on any faker with incompatible constraints.

```typescript
// min > max
numeric().min(10).max(5).create();

// all choices excluded
choice('a', 'b').not('a').not('b').create();

// not enough unique values in range
numeric().between(1, 3).unique().create(5);
```

You'll see one of these messages in your console:

```
StorymockError [ContradictoryConstraintError]:
  Cannot generate value — min (10) is greater than max (5).

      numeric().min(10).max(5).create()
                ───────  ──────
```

```
StorymockError [ContradictoryConstraintError]:
  Cannot generate value — all choices have been excluded.

  Defined choices:  ['a', 'b']
  Excluded:         ['a', 'b']

  At least one choice must remain after .not() exclusions.
```

```
StorymockError [ContradictoryConstraintError]:
  Cannot generate 5 unique values — only 3 possible values exist in range [1, 3].

  Requested:  .unique().create(5)
  Available:  3 distinct values

  Widen the range or reduce the batch size.
```

**Fix:** Ensure your constraints are satisfiable — check that min ≤ max, at least one choice remains after exclusions, and the value space is large enough for unique batch generation.

## CircularDependencyError

Two or more `when()` clauses reference each other, forming a cycle that cannot be resolved.

**Thrown by:** Schema definition (eagerly, at build time).

```typescript
const s = schema<{ a: string; b: string }>({
  a: when('b', {
    x: text().length(3),
    _: text().length(5),
  }),
  b: when('a', {
    y: text().length(3),
    _: text().length(5),
  }),
});
```

This error is caught immediately — before `.create()` is ever called:

```
StorymockError [CircularDependencyError]:
  Circular dependency detected in schema field resolution.

  Cycle:  a → when('b') → b → when('a') → a

  when() creates a dependency edge between fields. If two fields
  depend on each other via when(), neither can resolve first.
```

**Fix:** Break the cycle by replacing one side with `derive()`, which reads already-generated values instead of creating a dependency edge.

```typescript
const s = schema<{ a: string; b: string }>({
  a: choice('y', 'z'),
  b: derive(({ a }) => (a === 'y' ? 'x' : 'other')),
});
```

## MissingCaseError

A `when()` expression evaluated to a discriminant that has no matching case and no `_` default.

**Thrown by:** `.create()` on a schema containing an unmatched `when()`.

```typescript
const s = schema<{ status: string; label: string }>({
  status: choice('active', 'expired', 'pending'),
  label: when('status', {
    expired: text().length(7),
    // no 'active', 'pending', or '_' case
  }),
});

s.create(); // MissingCaseError when status is 'active' or 'pending'
```

The error tells you exactly which value fell through:

```
StorymockError [MissingCaseError]:
  No matching case for when('status').

  Resolved value:  'active'
  Defined cases:   ['expired']
  Default ('_'):   not defined

  Add a '_' default case to handle all unmatched values:

    when('status', {
      expired: text().length(7),
      _: text().length(4),      // ← handles 'active', 'pending', etc.
    })
```

**Fix:** Add a `_` default case to cover all unmatched discriminants.

```typescript
label: when('status', {
  expired: text().length(7),
  _: text().length(4),
});
```

## UnsupportedProviderError

A semantic domain method was called, but the configured provider does not implement the required module.

**Thrown by:** `.create()` on a semantic faker (e.g. `person().firstName()`).

```typescript
configure({ provider: new MinimalProvider() });

person().firstName().create();
// UnsupportedProviderError — MinimalProvider has no 'person' module
```

```
StorymockError [UnsupportedProviderError]:
  Provider "MinimalProvider" does not support the 'person' domain.

  Called:     person().firstName().create()
  Provider:   MinimalProvider
  Supported:  ['numeric', 'text', 'temporal']

  Use FakerJsProvider (the default) for full domain support,
  or implement the 'person' module in your custom provider.
```

**Fix:** Use `FakerJsProvider` (the default), or implement the required module in your custom provider.

## InvalidTraitError

A trait reference is invalid. Three sub-cases:

1. **Trait not defined** — the name doesn't match any `.trait()` on the schema.
2. **Field not on interface** — the trait overrides a field that doesn't exist on the type.
3. **Type mismatch** — the trait provides a value whose type doesn't match the field.

**Thrown by:** `.with()` on a schema or story entry.

```typescript
const User = schema<{ name: string; age: number }>({
  name: text().length(6),
  age: numeric().between(18, 65),
}).trait('senior', { age: numeric().min(65) });

// 1. Trait not defined
User.with('vip').create();

// 2. Field not on interface
User.trait('bad', { email: text() }); // 'email' is not a field of User

// 3. Type mismatch
User.trait('wrong', { age: text() }); // age expects number, got text
```

Each sub-case produces a distinct message:

```
StorymockError [InvalidTraitError]:
  Trait 'vip' is not defined on this schema.

  Defined traits:  ['senior']

  Check for typos, or define the trait first:

    schema.trait('vip', { ... })
```

```
StorymockError [InvalidTraitError]:
  Trait 'bad' overrides field 'email', which does not exist on the schema type.

  Schema fields:  ['name', 'age']

  Remove the unknown field from the trait definition.
```

```
StorymockError [InvalidTraitError]:
  Trait 'wrong' — type mismatch on field 'age'.

  Expected:  NumericFaker (number)
  Received:  TextFaker (string)

  Ensure the faker type matches the field's type in the schema interface.
```

**Fix:** Check the trait name matches a defined `.trait()`, the overridden fields exist on the schema type, and the faker types align.

## DuplicateNameError

Two entries in a story share the same name.

**Thrown by:** `.add()` or `.addMany()` on a story (eagerly).

```typescript
story()
  .add('user', UserSchema)
  .add('user', UserSchema); // DuplicateNameError
```

This is caught at definition time — no `.create()` needed:

```
StorymockError [DuplicateNameError]:
  Story already has an entry named 'user'.

  Existing entries:  ['user']

  Use a unique name for each entry:

    story()
      .add('buyer', UserSchema)
      .add('seller', UserSchema)
```

**Fix:** Use unique entry names for each story entry.

```typescript
story()
  .add('buyer', UserSchema)
  .add('seller', UserSchema);
```

## UnknownRefError

A `ref()` points to an entry that doesn't exist in the story, or the referenced entry has no resolvable identity.

**Thrown by:** `.create()` on a story with a broken `ref()`.

```typescript
story()
  .add('order', OrderSchema, { userId: ref('user') })
  // no 'user' entry exists
  .create();
```

The error identifies the broken reference and lists available entries:

```
StorymockError [UnknownRefError]:
  ref('user') — no entry named 'user' exists in this story.

  Available entries:  ['order']

  Add the missing entry before referencing it:

    story()
      .add('user', UserSchema)           // ← add this
      .add('order', OrderSchema, { userId: ref('user') })
```

If the entry exists but has no resolvable identity:

```
StorymockError [UnknownRefError]:
  ref('user') — entry 'user' has no resolvable identity.

  storymock tried (in order):
    1. .id() accessor     → not defined
    2. output.id property → not found

  Define an identity accessor on the schema:

    const UserSchema = schema<User>({ ... }).id((u) => u.userId);
```

**Fix:** Ensure the referenced entry name exists in the story and has either an `.id()` accessor defined on its schema or an `id` property in its generated output.

```typescript
const UserSchema = schema<User>({ ... }).id((u) => u.id);

story()
  .add('user', UserSchema)
  .add('order', OrderSchema, { userId: ref('user') })
  .create();
```

## IndexOutOfBoundsError

A `.with()` call targets an `addMany` item by index, but the index exceeds the array size.

**Thrown by:** `.create()` on a story with an out-of-bounds index target.

```typescript
story()
  .addMany('items', ItemSchema, 3)
  .with('items[5]', 'premium')   // only 3 items exist (indices 0–2)
  .create();                      // IndexOutOfBoundsError
```

```
StorymockError [IndexOutOfBoundsError]:
  items[5] is out of bounds — 'items' has 3 entries (indices 0–2).

  .addMany('items', ItemSchema, 3)    // creates items[0], items[1], items[2]
  .with('items[5]', 'premium')        // ← index 5 does not exist
                   ^

  Use an index within range:

    .with('items[2]', 'premium')      // ✅ valid (0, 1, 2)
```

**Fix:** Ensure the index is within the `addMany` count. Indices are zero-based.

```typescript
story()
  .addMany('items', ItemSchema, 3)
  .with('items[2]', 'premium')   // ✅ index 2 is valid (0, 1, 2)
  .create();
```
