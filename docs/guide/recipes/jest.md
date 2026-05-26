# Jest

storymock integrates with Jest the same way as Vitest. This recipe covers Jest-specific setup.

## Setup

### Global seed

Create a setup file:

```typescript
// tests/setup.ts
import { configure } from 'storymock';
configure({ seed: 42 });
```

Register it in Jest config:

```typescript
// jest.config.ts
export default {
  setupFilesAfterSetup: ['./tests/setup.ts'],
  // ...
};
```

## Shared schemas

Same pattern as any test framework — define schemas in a shared file:

```typescript
// tests/factories.ts
import { schema, text, person, choice } from 'storymock';

export const UserSchema = schema<User>({
  id: text().uuid(),
  name: person().fullName(),
  role: choice('viewer', 'editor', 'admin'),
})
.trait('admin', { role: 'admin' as const })
.id((u) => u.id);
```

## Using in tests

```typescript
// tests/permissions.test.ts
import { story, ref } from 'storymock';
import { UserSchema, PostSchema } from './factories';

describe('permissions', () => {
  it('viewers cannot delete posts', () => {
    const { viewer, post } = story()
      .add('viewer', UserSchema.with({ role: 'viewer' as const }))
      .add('post', PostSchema, { authorId: ref('viewer') })
      .create();

    expect(() => deletePost(viewer, post)).toThrow('Unauthorized');
  });
});
```

## Snapshot testing

```typescript
it('user snapshot', () => {
  const user = UserSchema.seed(1).create();
  expect(user).toMatchSnapshot();
});
```

## Tips

- Use `setupFilesAfterSetup` (not `setupFiles`) to ensure Jest globals are available
- If you use `ts-jest`, no extra config is needed — storymock is pure TypeScript
- For `@swc/jest`, same — it just works
