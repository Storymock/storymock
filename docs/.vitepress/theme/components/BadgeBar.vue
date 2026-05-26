<template>
  <div class="badge-bar">
    <a href="https://www.npmjs.com/package/storymock" target="_blank" rel="noopener">
      <img src="https://img.shields.io/npm/v/storymock?color=7c3aed&label=npm" alt="npm version" />
    </a>
    <img src="https://img.shields.io/badge/TypeScript-first-3178c6?logo=typescript&logoColor=white" alt="TypeScript first" />
    <img src="https://img.shields.io/badge/license-MIT-22c55e" alt="MIT License" />
    <a href="https://bundlephobia.com/package/storymock" target="_blank" rel="noopener">
      <img src="https://img.shields.io/bundlephobia/minzip/storymock?color=7c3aed&label=bundle" alt="Bundle size" />
    </a>
  </div>
</template>

<style scoped>
.badge-bar {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin: -0.5rem 0 2.5rem;
}

.badge-bar a {
  line-height: 0;
  transition: opacity 0.15s ease;
}

.badge-bar a:hover {
  opacity: 0.8;
}

.badge-bar img {
  height: 22px;
  border-radius: 4px;
}
</style>
