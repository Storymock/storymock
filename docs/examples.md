---
description: Self-contained TypeScript examples for every storymock feature.
---

# Examples

Self-contained TypeScript examples, each highlighting a **storymock feature**. Run any example with `npx tsx examples/<file>.ts`.

## Fakers & Composability

Core domains, semantic domains, constraint chaining, composability, batch generation.

**Highlights:**
- `numeric()`, `text()`, `temporal()`, `bool()`, `choice()`, `collection()`
- Constraint chaining: `.min()`, `.max()`, `.float()`, `.precision()`, `.length()`
- Format methods that change return type: `.hex()`, `.iso()`
- Faker-in-faker composability: `temporal().year(numeric().min(2020).max(2025))`
- Batch (`.create(5)`) and unique (`.unique().create(3)`)
- `.nullable()` and `.optional()`

```typescript
import { numeric, text, person, temporal, choice } from 'storymock';

const id    = text().uuid().create();                     // '550e8400-e29b-...'
const age   = person().age().min(18).max(65).create();    // 34
const price = numeric().min(1).max(999).precision(2).create(); // 42.99
const date  = temporal().year(numeric().min(2020).max(2025)).create(); // Date
const roles = choice('viewer', 'editor', 'admin').unique().create(3);
```

::: info Try it
[View source on GitHub](https://github.com/storymock/storymock/blob/main/examples/fakers-and-composability.ts) · [Open in StackBlitz ⚡️](https://stackblitz.com/github/storymock/storymock/tree/main?file=examples/fakers-and-composability.ts)
:::

## Traits & Customization

Named states, combining traits, inline overrides, immutable forking.

**Highlights:**
- Defining traits with `.trait('name', { ... })`
- Applying one trait: `.with('completed')`
- Combining traits left-to-right: `.with('urgent', 'completed')`
- Inline overrides: `.with({ title: 'Fix bug #123' })`
- Traits + overrides: `.with('urgent', { assignee: 'Alice' })`
- Immutable forking: base schema unchanged after `.with()`

```typescript
import { schema, text, lorem, person, choice, collection } from 'storymock';

const TaskSchema = schema<Task>({
  id: text().uuid(),
  title: lorem().sentence(),
  priority: choice('low', 'medium', 'high'),
  assignee: person().fullName(),
}).trait('urgent', { priority: 'high' as const });

TaskSchema.with('urgent').create();
TaskSchema.with('urgent', { assignee: 'Alice' }).create();
```

::: info Try it
[View source on GitHub](https://github.com/storymock/storymock/blob/main/examples/traits-and-customization.ts) · [Open in StackBlitz ⚡️](https://stackblitz.com/github/storymock/storymock/tree/main?file=examples/traits-and-customization.ts)
:::

## Conditional Fields

`when()` for conditional logic, `derive()` for computed fields, dependency resolution.

**Highlights:**
- `when()` with string keys: `when('type', { percentage: ..., fixed: ... })`
- `when()` with numeric keys and `_` default
- `when()` with boolean keys
- `derive()` computing from resolved siblings
- `derive()` returning a faker instead of a literal
- Field resolution order (DAG)

```typescript
import { schema, choice, numeric, derive, when } from 'storymock';

const CouponSchema = schema<Coupon>({
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

::: info Try it
[View source on GitHub](https://github.com/storymock/storymock/blob/main/examples/conditional-fields.ts) · [Open in StackBlitz ⚡️](https://stackblitz.com/github/storymock/storymock/tree/main?file=examples/conditional-fields.ts)
:::

## Story Composition

`ref()` for foreign keys, `.setup()` for wiring, `addMany`, type accumulation.

**Highlights:**
- `story().add()` and `.addMany()` with type accumulation
- `ref('entry')` resolving foreign keys via `.id()`
- `ref('entry', 'field')` referencing a specific field
- `ref()` on `addMany` entries resolving to an array of IDs
- `.setup()` for complex relationship wiring
- Inline overrides with `ref()`

```typescript
import { story, ref } from 'storymock';

const blogStory = story()
  .add('author', AuthorSchema)
  .addMany('posts', PostSchema, 3, { authorId: ref('author') })
  .add('comment', CommentSchema, { authorId: ref('author') })
  .setup((m) => { m.comment.postId = m.posts[0].id; });

const { author, posts, comment } = blogStory.create();
// comment.authorId === author.id ✓
```

::: info Try it
[View source on GitHub](https://github.com/storymock/storymock/blob/main/examples/story-composition.ts) · [Open in StackBlitz ⚡️](https://stackblitz.com/github/storymock/storymock/tree/main?file=examples/story-composition.ts)
:::

## Story Inheritance

Base stories, extending, setup accumulation, cascading `.with()`, targeting.

**Highlights:**
- Base story → extended story with additional entries
- `.setup()` accumulation across inheritance
- Cascading `.with()` across multiple entries
- Targeting specific `addMany` items: `.with('teams[0]', { ... })`
- Forking independent variants from the same base
- Reusable wiring functions

```typescript
const orgBase = story()
  .add('org', OrgSchema)
  .addMany('teams', TeamSchema, 2, { orgId: ref('org') });

const orgWithMembers = orgBase
  .addMany('members', MemberSchema, 4)
  .setup(wireTeamMembers);

// Fork independent variants
const proOrg = orgWithMembers.with('org', { plan: 'pro' as const });
const deletedOrg = orgWithMembers.with('org', 'deleted');
```

::: info Try it
[View source on GitHub](https://github.com/storymock/storymock/blob/main/examples/story-inheritance.ts) · [Open in StackBlitz ⚡️](https://stackblitz.com/github/storymock/storymock/tree/main?file=examples/story-inheritance.ts)
:::

## Seeding & Determinism

`.seed()` at every level, `configure({ seed })`, reproducible snapshots.

**Highlights:**
- Faker seed: `numeric().seed(42).create()`
- Schema seed: `UserSchema.seed(42).create()`
- Story seed: `myStory.seed(42).create()`
- Seed precedence (faker > schema > story > global)
- Global seed via `configure({ seed: 42 })`
- Deterministic test assertions

```typescript
import { numeric, schema, configure } from 'storymock';

// Same seed → same value, every time
const a = numeric().min(1).max(100).seed(42).create();
const b = numeric().min(1).max(100).seed(42).create();
// a === b ✓

// Schema-level seed for full objects
const user1 = UserSchema.seed(42).create();
const user2 = UserSchema.seed(42).create();
// user1.id === user2.id ✓
```

::: info Try it
[View source on GitHub](https://github.com/storymock/storymock/blob/main/examples/seeding-and-determinism.ts) · [Open in StackBlitz ⚡️](https://stackblitz.com/github/storymock/storymock/tree/main?file=examples/seeding-and-determinism.ts)
:::

## Running Examples

```bash
git clone https://github.com/storymock/storymock.git
cd storymock
pnpm install

npx tsx examples/file.ts
```

## Contributing an Example

Examples highlight **features**, not business scenarios. See the [Contributing guide](https://github.com/storymock/storymock/blob/main/CONTRIBUTION_GUIDE.md#contributing-examples) for the full checklist.
