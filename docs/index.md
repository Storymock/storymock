---
layout: home

hero:
  name: storymock
  text: Build mocks from stories
  tagline: A TypeScript-first library that composes fakers, schemas, and stories into coherent, type-safe test data.
  actions:
    - theme: brand
      text: Get Started →
      link: /guide/
    - theme: alt
      text: API Reference
      link: /reference/
    - theme: alt
      text: ⚡ Try in StackBlitz
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
  - icon: ⚡
    title: Works with what you already use
    details: "Powered by faker.js out of the box. Swap the engine or add your own data types when needed."
---

<BadgeBar />

## See it in action

Click **▶ Run** to generate mock data. Click again for different output — every run is unique.

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

<div style="text-align: center; margin: 2rem 0 3rem;">
  <a href="/guide/" class="action-link">Get started →</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="/why" class="action-link secondary">Why storymock?</a>
</div>

<style>
.action-link {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.action-link:hover {
  text-decoration: underline;
}
.action-link.secondary {
  color: var(--vp-c-text-2);
}
</style>
