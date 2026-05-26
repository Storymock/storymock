# Vitest

storymock works with Vitest out of the box. This recipe covers global seeding, test helpers, and component testing patterns.

## Setup

### Global seed (optional)

Create a setup file for deterministic tests:

```typescript
// tests/setup.ts
import { configure } from 'storymock';

configure({ seed: 42 });
```

Register it in your Vitest config:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.ts'],
  },
});
```

Now every test run produces the same data — great for snapshot tests and CI stability.

## Shared schemas

Define schemas in a shared file and import them across tests:

```typescript
// tests/factories.ts
import { schema, text, person, numeric, choice, collection, lorem } from 'storymock';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor' | 'admin';
}

interface Post {
  id: string;
  authorId: string;
  title: string;
  published: boolean;
}

export const UserSchema = schema<User>({
  id: text().uuid(),
  name: person().fullName(),
  email: text().template('{{uuid}}@test.com'),
  role: choice('viewer', 'editor', 'admin'),
})
.trait('admin', { role: 'admin' as const })
.trait('editor', { role: 'editor' as const })
.id((u) => u.id);

export const PostSchema = schema<Post>({
  id: text().uuid(),
  authorId: text().uuid(),
  title: lorem().sentence(),
  published: choice(true, false),
})
.trait('published', { published: true })
.trait('draft', { published: false });
```

## Using in tests

```typescript
// tests/user-service.test.ts
import { describe, it, expect } from 'vitest';
import { story, ref } from 'storymock';
import { UserSchema, PostSchema } from './factories';

describe('UserService', () => {
  it('returns published posts for a user', () => {
    const { user, posts } = story()
      .add('user', UserSchema)
      .addMany('posts', PostSchema, 3, { authorId: ref('user') })
      .with('posts', 'published')
      .create();

    const result = getPublishedPosts(user.id, posts);

    expect(result).toHaveLength(3);
    expect(result.every(p => p.authorId === user.id)).toBe(true);
  });

  it('admin can edit any post', () => {
    const { admin, post } = story()
      .add('admin', UserSchema.with('admin'))
      .add('post', PostSchema.with('published'))
      .create();

    expect(canEdit(admin, post)).toBe(true);
  });
});
```

## Snapshot testing with seeds

```typescript
it('generates consistent user for snapshots', () => {
  const user = UserSchema.seed(1).create();
  expect(user).toMatchSnapshot();
});
```

Because the seed is fixed, the snapshot is stable across runs. Change the schema definition and the snapshot updates — never a flaky diff.

## Tips

- Put all schemas in `tests/factories.ts` (or `tests/factories/` for larger projects)
- Use `configure({ seed: 42 })` in a global setup file for deterministic CI
- Use `.seed()` on individual schemas when you need a specific test to be deterministic without affecting others
- Story-level `.seed()` makes entire multi-object snapshots stable
