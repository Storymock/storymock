# Storybook

Use storymock to generate props for your Storybook stories. Traits map naturally to Storybook story variants.

## Define schemas for your component props

```typescript
// src/factories.ts
import { schema, text, person, numeric, temporal, choice, collection, lorem } from 'storymock';

interface UserCardProps {
  name: string;
  avatar: string;
  role: 'viewer' | 'editor' | 'admin';
  joinedAt: Date;
  bio: string;
  postCount: number;
}

export const UserCardPropsSchema = schema<UserCardProps>({
  name: person().fullName(),
  avatar: text().template('https://i.pravatar.cc/150?u={{uuid}}'),
  role: choice('viewer', 'editor', 'admin'),
  joinedAt: temporal().past(3),
  bio: lorem().sentence(),
  postCount: numeric().min(0).max(500),
})
.trait('admin', {
  role: 'admin' as const,
  postCount: numeric().min(100).max(500),
})
.trait('new', {
  joinedAt: temporal().recent(),
  postCount: numeric().min(0).max(5),
  bio: '',
});
```

## Use in Storybook stories

```typescript
// src/components/UserCard.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { UserCard } from './UserCard';
import { UserCardPropsSchema } from '../factories';

const meta: Meta<typeof UserCard> = {
  component: UserCard,
};

export default meta;
type Story = StoryObj<typeof UserCard>;

// Default — random realistic data
export const Default: Story = {
  args: UserCardPropsSchema.seed(1).create(),
};

// Admin variant — uses the 'admin' trait
export const Admin: Story = {
  args: UserCardPropsSchema.with('admin').seed(2).create(),
};

// New user — uses the 'new' trait
export const NewUser: Story = {
  args: UserCardPropsSchema.with('new').seed(3).create(),
};

// Custom override — trait + inline override
export const SpecificUser: Story = {
  args: UserCardPropsSchema.with('admin', {
    name: 'Eldar Bakerman',
    bio: 'Building storymock',
  }).seed(4).create(),
};
```

## Generating lists

For components that render lists (tables, feeds, grids):

```typescript
// src/components/UserList.stories.ts
export const ManyUsers: Story = {
  args: {
    users: UserCardPropsSchema.seed(1).create(12),
  },
};

export const MixedRoles: Story = {
  args: {
    users: [
      ...UserCardPropsSchema.with('admin').seed(1).create(2),
      ...UserCardPropsSchema.with('new').seed(2).create(3),
      ...UserCardPropsSchema.seed(3).create(7),
    ],
  },
};
```

## Tips

- Use `.seed(n)` on every story to keep Storybook snapshots stable — different seed per story
- Traits map 1:1 to Storybook story variants — `'admin'`, `'new'`, `'empty'`, `'error'` etc.
- For component-level factories, co-locate the schema file next to the component: `UserCard.factory.ts`
- storymock generates the data, Storybook renders it — no coupling between the two
