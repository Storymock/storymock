<template>
  <nav class="badge-bar" aria-label="Project badges">
    <a href="https://www.npmjs.com/package/storymock" target="_blank" rel="noopener">
      <img src="https://img.shields.io/npm/v/storymock?color=7c3aed&label=npm" alt="npm version" />
    </a>
    <img src="https://img.shields.io/badge/TypeScript-first-3178c6?logo=typescript&logoColor=white" alt="TypeScript first" />
    <img src="https://img.shields.io/badge/license-MIT-22c55e" alt="MIT License" />
    <a href="https://bundlephobia.com/package/storymock" target="_blank" rel="noopener">
      <img src="https://img.shields.io/bundlephobia/minzip/storymock?color=7c3aed&label=bundle" alt="Bundle size" />
    </a>
  </nav>
</template>

<style scoped>
.badge-bar {
  display: flex;
  gap: var(--sm-space-3);
  justify-content: center;
  flex-wrap: wrap;
  margin: var(--sm-space-11) 0 var(--sm-space-9);
}

.badge-bar a {
  display: inline-flex;
  transition: opacity var(--sm-duration) var(--sm-easing);
}

.badge-bar a:hover {
  opacity: 0.8;
}

.badge-bar img {
  height: 1.375rem;
  border-radius: var(--sm-radius-sm);
}
</style>
