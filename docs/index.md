---
description: Composable, type-safe builders for generating related mock data.
layout: home

hero:
  name: storymock
  text: Build mocks from stories
  tagline: Composable, type-safe builders for generating related mock data.
  actions:
    - theme: brand
      text: Get Started →
      link: /guide/
    - theme: alt
      text: API Reference
      link: /reference/
    - theme: alt
      text: ⚡️ Try in StackBlitz
      link: https://stackblitz.com/github/storymock/storymock/tree/main

features:
  - icon: 🎯
    title: Start simple, scale up
    details: "One value, one object, or a whole dataset — adopt only what your test needs."
  - icon: 🛡️
    title: Catch mistakes before tests run
    details: "Every field and override is type-checked at compile time. Your editor catches it, not a failing test."
  - icon: 🏷️
    title: Name your test states
    details: "Define states once, apply them anywhere in one word. No more scattered ad-hoc overrides."
  - icon: 🔗
    title: Related data, wired automatically
    details: "Generate multiple objects that reference each other correctly. Foreign keys, arrays, and cross-links just work."
  - icon: ♻️
    title: Reuse without risk
    details: "Immutable builders. Derive as many variants as you need — no shared state between tests."
  - icon: ⚡️
    title: Works with what you already use
    details: "Powered by faker.js out of the box. Swap the engine or add your own data types when needed."
---

<BadgeBar />

## See it in action

Click **▶ Run** to see example output. Click again for a different sample.

<PlaygroundDemo />

## The three layers

Each layer builds on the one below. Use any layer on its own — or combine them for full relational datasets.

<LayerDiagram />

## Before & after

<BeforeAfter>
<template #without>

```typescript
// Every test re-specifies the same states manually
const expiredAdmin = createUser({
  role: 'admin',
  status: 'active',
  subscription: {
    plan: 'enterprise',
    expiresAt: new Date('2024-01-01'),
    status: 'expired',
  },
});
const org = createOrg({ ownerId: expiredAdmin.id });
const team = createTeam({ orgId: org.id });
const members = Array.from({ length: 5 }, (_, i) =>
  createUser({
    teamId: team.id,
    role: i === 0 ? 'admin' : 'member',
  })
);
team.memberIds = members.map(m => m.id);
org.teamIds = [team.id];

// Next test — same setup, slightly different state.
// Copy, paste, tweak, hope nothing drifts.
```

</template>
<template #with>

```typescript
// Schemas define realistic defaults + named states once
const UserSchema = schema<User>({
  id: text().uuid(),
  name: person().fullName(),
  role: choice('admin', 'member'),
  subscription: SubscriptionSchema,
}).trait('expiredAdmin', {
  role: 'admin' as const,
  subscription: SubscriptionSchema.with('expired'),
});

// Stories compose objects and wire relationships
const orgStory = story()
  .add('owner', UserSchema.with('expiredAdmin'))
  .add('org', OrgSchema, { ownerId: ref('owner') })
  .addMany('members', UserSchema, 5)
  .setup(wireTeamMembers);

// Tests only express what's different
orgStory.create();
orgStory.with('owner', 'active').create();
orgStory.with('members[0]', 'admin').create();
```

</template>
</BeforeAfter>

<nav class="home-actions" aria-label="Quick links">
  <a href="/guide/">Get started →</a>
  <span class="separator" aria-hidden="true">·</span>
  <a href="/why" class="secondary">Why storymock?</a>
</nav>
