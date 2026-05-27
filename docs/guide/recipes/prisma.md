---
description: Seed your Prisma database with realistic, relational mock data.
---

# Prisma

Use storymock to seed your development database with realistic, relational data that matches your Prisma models.

## Define schemas matching your Prisma models

```typescript
// prisma/seed-schemas.ts
import { schema, text, person, numeric, temporal, choice, story, ref } from 'storymock';

// Match your Prisma model shapes
interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
}

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
}

export const UserSchema = schema<User>({
  id: text().cuid(),
  email: text().template('{{uuid}}@example.com'),
  name: person().fullName(),
  role: choice('USER', 'ADMIN'),
  createdAt: temporal().past(2, 'years'),
})
.trait('admin', { role: 'ADMIN' as const })
.id((u) => u.id);

export const PostSchema = schema<Post>({
  id: text().cuid(),
  title: text().template('Post {{uuid}}'),
  content: text().template('Content for post {{uuid}}'),
  published: choice(true, false),
  authorId: '',
  createdAt: temporal().past(1, 'years'),
})
.trait('published', { published: true })
.id((p) => p.id);
```

## Seed script

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { story, ref } from 'storymock';
import { UserSchema, PostSchema } from './seed-schemas';

const prisma = new PrismaClient();

async function main() {
  // Generate a coherent dataset
  const data = story()
    .add('admin', UserSchema.with('admin'))
    .addMany('users', UserSchema, 10)
    .addMany('posts', PostSchema, 30, { authorId: ref('users') })
    .setup((m) => {
      // Distribute posts across users round-robin
      m.posts.forEach((post, i) => {
        post.authorId = m.users[i % m.users.length].id;
      });
    })
    .seed(42)  // deterministic — same seed data every time
    .create();

  // Insert into database
  await prisma.user.createMany({ data: [data.admin, ...data.users] });
  await prisma.post.createMany({ data: data.posts });

  console.log(`Seeded ${data.users.length + 1} users and ${data.posts.length} posts`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Add to your `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Then run:

```bash
pnpm prisma db seed
```

## Tips

- Use `.seed(42)` in seed scripts for reproducible dev databases — everyone on the team gets the same data
- Match your schema IDs to Prisma's ID strategy: `.cuid()` for `@default(cuid())`, `.uuid()` for `@default(uuid())`
- Use `.setup()` to distribute relationships (e.g., posts across users) rather than `ref()` when you need control over the distribution
- storymock schemas don't need to match Prisma models 1:1 — skip auto-generated fields like `updatedAt` that Prisma handles
