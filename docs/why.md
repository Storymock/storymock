---
description: How storymock compares to faker.js, fishery, MSW, and hand-written helpers.
---

# Why storymock?

Every mocking approach works for simple cases. The differences show up when your test suite grows — more objects, more states, more relationships between them. This page shows what that looks like in practice.

## vs. `@faker-js/faker`

faker.js is great at generating values. storymock wraps it and adds structure on top.

### The User schema

Here's the `User` type and its storymock schema — referenced throughout the comparisons below. Each field uses a **faker**, a lazy builder that generates a realistic value on `.create()`:

```typescript
import { schema, text, person, choice, temporal } from 'storymock';

interface User {
  id: string;
  name: string;
  role: 'viewer' | 'editor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  suspendedAt?: Date;
  createdAt?: Date;
}

const UserSchema = schema<User>({
  id: text().uuid(),                          // → '550e8400-e29b-41d4-a716-...'
  name: person().fullName(),                  // → 'Günther Schmidt'
  role: choice('viewer', 'editor', 'admin'),  // → 'editor'
  status: choice('active', 'inactive'),       // → 'active'
})
.trait('admin', {
  role: 'admin' as const,
  status: 'active' as const,
})
.trait('suspended', {
  status: 'suspended' as const,
  suspendedAt: temporal().recent(),
})
.trait('new', {
  role: 'viewer' as const,
  createdAt: temporal().today(),
});
```

::: tip What are fakers?
`text()`, `person()`, `choice()`, `temporal()` — each is a **faker**. Fakers are immutable builders that describe *how* to generate a value. Nothing runs until `.create()` is called. They compose — you can pass a faker anywhere a value is expected.
:::

### Generating a single user — both work fine

<Versus other="faker.js">
<template #other>

```typescript
const user = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  role: faker.helpers.arrayElement(['viewer', 'editor', 'admin']),
  status: faker.helpers.arrayElement(['active', 'inactive']),
};
```

</template>
<template #storymock>

```typescript
const user = UserSchema.create();
```

</template>
</Versus>

### Now create an admin, a suspended admin, and a new user who signed up today

<Versus other="faker.js">
<template #other>

```typescript
// Re-specify every field, every time
const admin = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  role: 'admin',
  status: 'active',
};
const suspendedAdmin = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  role: 'admin',
  status: 'suspended',
  suspendedAt: faker.date.recent(),
};
const newUser = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  role: 'viewer',
  status: 'active',
  createdAt: new Date(),
};
```

</template>
<template #storymock>

```typescript
// Define states once, apply by name
UserSchema.with('admin').create();
UserSchema.with('admin', 'suspended').create();
UserSchema.with('new').create();
```

</template>
</Versus>

### Now create 3 orders that belong to that admin, with wired foreign keys

<Versus other="faker.js">
<template #other>

```typescript
// Manual wiring
const admin = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  role: 'admin',
};
const orders = Array.from({ length: 3 }, () => ({
  id: faker.string.uuid(),
  userId: admin.id,   // you wire this yourself
  total: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
}));
```

</template>
<template #storymock>

```typescript
// ref() wires it for you
const { admin, orders } = story()
  .add('admin', UserSchema.with('admin'))
  .addMany('orders', OrderSchema, 3, { userId: ref('admin') })
  .create();
// orders[0].userId === admin.id — guaranteed
```

</template>
</Versus>

faker.js is the right tool when you need a handful of random values. storymock picks up where it leaves off: named states, object factories, and relational data.

## vs. `fishery`

fishery provides typed factories with traits. storymock adds conditional fields, composable fakers, and multi-object stories.

### Simple factory — both look similar

<Versus other="fishery">
<template #other>

```typescript
const userFactory = Factory.define<User>(({ sequence }) => ({
  id: `user-${sequence}`,
  name: faker.person.fullName(),
  role: 'viewer',
}));
userFactory.build();
```

</template>
<template #storymock>

```typescript
const UserSchema = schema<User>({
  id: text().uuid(),
  name: person().fullName(),
  role: choice('viewer', 'editor', 'admin'),
});
UserSchema.create();
```

</template>
</Versus>

### Conditional fields — a coupon whose value depends on its type

<Versus other="fishery">
<template #other>

```typescript
// You write the branching logic yourself
const couponFactory = Factory.define<Coupon>(({ transientParams }) => {
  const type = transientParams.type
    ?? faker.helpers.arrayElement(['percentage', 'fixed']);
  return {
    id: faker.string.uuid(),
    type,
    value: type === 'percentage'
      ? faker.number.int({ min: 5, max: 100 })
      : faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
    label: type === 'percentage'
      ? `${value}% OFF`
      : `$${value} OFF`,
  };
});
```

</template>
<template #storymock>

```typescript
// when() and derive() handle dependencies
const CouponSchema = schema<Coupon>({
  id: text().uuid(),
  type: choice('percentage', 'fixed'),
  value: when('type', {
    percentage: numeric().min(5).max(100),
    fixed: numeric().min(10).max(500).precision(2),
  }),
  label: derive(({ type, value }) =>
    type === 'percentage' ? `${value}% OFF` : `$${value} OFF`
  ),
});
```

</template>
</Versus>

### Multi-object relationships — an org with teams and members

<Versus other="fishery">
<template #other>

```typescript
// Each factory is independent — you wire everything manually
const org = orgFactory.build();
const teams = teamFactory.buildList(3, { orgId: org.id });
const members = memberFactory.buildList(10);
members.forEach((m, i) => {
  m.teamId = teams[i % teams.length].id;
});
teams.forEach(t => {
  t.memberIds = members
    .filter(m => m.teamId === t.id)
    .map(m => m.id);
});
// Repeat this wiring in every test that needs an org with teams
```

</template>
<template #storymock>

```typescript
// Define once, reuse everywhere
const orgStory = story()
  .add('org', OrgSchema)
  .addMany('teams', TeamSchema, 3, { orgId: ref('org') })
  .addMany('members', MemberSchema, 10)
  .setup((m) => {
    m.members.forEach((member, i) => {
      member.teamId = m.teams[i % m.teams.length].id;
    });
  });

// Every test gets a fully wired org in one call
orgStory.create();
orgStory.with('org', 'enterprise').create();
orgStory.with('members[0]', 'admin').create();
```

</template>
</Versus>

fishery is solid for single-object factories. storymock extends the pattern with `when()`/`derive()` for conditional logic and stories for multi-object composition.

## vs. MSW / Mirage

These are **API mocking** tools — they intercept HTTP requests and return responses. storymock is **data generation** — it creates the objects those tools serve. They're complementary:

```typescript
// storymock generates the data
const { user, orders } = checkoutStory.create();

// MSW serves it
http.get('/api/user/:id', () => HttpResponse.json(user));
http.get('/api/orders', () => HttpResponse.json(orders));
```

Use storymock to build coherent test datasets. Use MSW/Mirage to serve them over HTTP.

## vs. hand-written helpers

The `createUser(overrides)` pattern works. storymock formalizes it with traits, conditional fields, and relationship wiring so it scales past a handful of factories.

<Versus other="Hand-written helpers">
<template #other>

```typescript
// Works fine at small scale
function createUser(overrides = {}) {
  return {
    id: uuid(),
    name: faker.person.fullName(),
    role: 'viewer',
    ...overrides,
  };
}
const admin = createUser({ role: 'admin' });
```

</template>
<template #storymock>

```typescript
// Same idea, but with named states that compose
const admin = UserSchema.with('admin').create();
const suspendedAdmin = UserSchema.with('admin', 'suspended').create();
```

</template>
</Versus>

The real difference isn't the single call — it's what happens when you need 5 objects that reference each other, each in a specific state, across 50 tests. storymock's stories let you define that wiring once and derive test-specific variants without repeating it.

## When you don't need storymock

- **A few simple tests** — `createUser(overrides)` is totally fine. Don't add a dependency you don't need.
- **Just random values** — If you only need `faker.person.fullName()`, use faker.js directly.
- **API contract testing** — If you're validating response shapes, schema validators (Zod, io-ts) are the right tool.

[Get started →](/guide/)
