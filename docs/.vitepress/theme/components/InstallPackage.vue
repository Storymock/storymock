<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  package?: string
}>()

const pkg = props.package ?? 'storymock'

const managers = [
  { label: 'npm', command: `npm install ${pkg}` },
  { label: 'yarn', command: `yarn add ${pkg}` },
  { label: 'pnpm', command: `pnpm add ${pkg}` },
  { label: 'bun', command: `bun add ${pkg}` },
]

const active = ref(0)
const copied = ref(false)

function select(i: number) {
  active.value = i
}

async function copyCode(text: string) {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}
</script>

<template>
  <div class="install-package">
    <div class="tabs">
      <button
        v-for="(mgr, i) in managers"
        :key="mgr.label"
        class="tab"
        :class="{ active: active === i }"
        @click="select(i)"
      >
        {{ mgr.label }}
      </button>
    </div>
    <div class="code-panel">
      <pre><code>{{ managers[active].command }}</code></pre>
      <button
        class="copy-btn"
        :class="{ copied }"
        :title="copied ? 'Copied!' : 'Copy'"
        @click="copyCode(managers[active].command)"
      />
    </div>
  </div>
</template>

<style scoped>
.install-package {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.tabs {
  display: flex;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.tab {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.tab:hover {
  color: var(--vp-c-text-1);
}

.tab.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.code-panel {
  position: relative;
  background: var(--vp-c-bg-alt);
}

.code-panel pre {
  margin: 0;
  padding: 16px 24px;
}

.code-panel code {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.code-panel:hover .copy-btn {
  opacity: 1;
}

.copy-btn::before {
  content: '';
  display: block;
  width: 16px;
  height: 16px;
  margin: 7px;
  background: var(--vp-c-text-2);
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Crect x='9' y='9' width='13' height='13' rx='2'/%3E%3Cpath d='M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1'/%3E%3C/svg%3E");
  mask-size: contain;
}

.copy-btn.copied::before {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E");
  background: var(--vp-c-brand-1);
}
</style>
