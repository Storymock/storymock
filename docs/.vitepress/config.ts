import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'storymock',
  description:
    'Composable, type-safe builders for generating related mock data.',
  cleanUrls: true,
  appearance: 'dark',

  head: [
    ['meta', { name: 'theme-color', content: '#7c3aed' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'storymock' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Composable, type-safe builders for generating related mock data.',
      },
    ],
    ['meta', { property: 'og:url', content: 'https://storymock.dev' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/reference/' },
      { text: 'Examples', link: '/examples' },
      { text: 'Why storymock?', link: '/why' },
      {
        text: 'GitHub',
        link: 'https://github.com/storymock/storymock',
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Core Concepts', link: '/guide/concepts' },
            { text: 'Working with Fakers', link: '/guide/fakers' },
            { text: 'Working with Schemas', link: '/guide/schemas' },
            { text: 'Working with Stories', link: '/guide/stories' },
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Errors', link: '/guide/errors' },
          ],
        },
        {
          text: 'Recipes',
          items: [
            { text: 'Overview', link: '/guide/recipes/' },
            { text: 'Vitest & Jest', link: '/guide/recipes/testing' },
            { text: 'Prisma', link: '/guide/recipes/prisma' },
            { text: 'Storybook', link: '/guide/recipes/storybook' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Quick Reference', link: '/reference/' },
            { text: 'Faker API', link: '/reference/faker' },
            { text: 'Schema API', link: '/reference/schema' },
            { text: 'Story API', link: '/reference/story' },
          ],
        },
      ],
      '/examples': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples' },
            {
              text: 'Fakers & Composability',
              link: '/examples#fakers-composability',
            },
            {
              text: 'Traits & Customization',
              link: '/examples#traits-customization',
            },
            {
              text: 'Conditional Fields',
              link: '/examples#conditional-fields',
            },
            { text: 'Story Composition', link: '/examples#story-composition' },
            { text: 'Story Inheritance', link: '/examples#story-inheritance' },
            {
              text: 'Seeding & Determinism',
              link: '/examples#seeding-determinism',
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/storymock/storymock' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message:
        'Released under the <a href="https://github.com/storymock/storymock/blob/main/LICENSE" target="_blank">MIT License</a>. <a href="https://github.com/storymock/storymock/blob/main/CONTRIBUTION_GUIDE.md" target="_blank">Contributing</a>',
      copyright:
        'Copyright © 2025-present <a href="https://github.com/storymock" target="_blank">storymock</a>',
    },

    editLink: {
      pattern: 'https://github.com/storymock/storymock/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
});
