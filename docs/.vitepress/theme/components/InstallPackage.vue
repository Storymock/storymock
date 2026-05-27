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

function onTabKeydown(event: KeyboardEvent) {
  let next = active.value
  if (event.key === 'ArrowRight') next = (active.value + 1) % managers.length
  else if (event.key === 'ArrowLeft') next = (active.value - 1 + managers.length) % managers.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = managers.length - 1
  else return

  event.preventDefault()
  select(next)
  const tablist = (event.currentTarget as HTMLElement).parentElement
  ;(tablist?.children[next] as HTMLElement)?.focus()
}

async function copyCode(text: string) {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}
</script>

<template>
  <div class="install-package">
    <div class="tabs" role="tablist" aria-label="Package manager">
      <button
        v-for="(mgr, i) in managers"
        :key="mgr.label"
        role="tab"
        :id="`install-tab-${mgr.label}`"
        :aria-selected="active === i"
        aria-controls="install-panel"
        :tabindex="active === i ? 0 : -1"
        class="tab"
        :class="{ active: active === i }"
        @click="select(i)"
        @keydown="onTabKeydown"
      >
        {{ mgr.label }}
      </button>
    </div>
    <div
      class="code-panel"
      role="tabpanel"
      id="install-panel"
      :aria-labelledby="`install-tab-${managers[active].label}`"
    >
      <pre><code>{{ managers[active].command }}</code></pre>
      <button
        class="copy-btn"
        :class="{ copied }"
        :title="copied ? 'Copied!' : 'Copy'"
        :aria-label="copied ? 'Copied' : 'Copy command'"
        @click="copyCode(managers[active].command)"
      />
    </div>
  </div>
</template>

<style scoped>
.install-package {
  margin: var(--sm-space-9) 0;
  border-radius: var(--sm-radius-lg);
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.tabs {
  display: flex;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.tab {
  padding: var(--sm-space-4) var(--sm-space-6);
  font-size: var(--sm-text-base);
  font-weight: 500;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color var(--sm-duration) var(--sm-easing), border-color var(--sm-duration) var(--sm-easing);
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
  padding: var(--sm-space-6) var(--sm-space-8);
}

.code-panel code {
  font-family: var(--vp-font-family-mono);
  font-size: var(--sm-text-md);
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.copy-btn {
  position: absolute;
  top: var(--sm-space-3);
  right: var(--sm-space-3);
  width: var(--sm-space-9);
  height: var(--sm-space-9);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--sm-radius-sm);
  background: var(--vp-c-bg);
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--sm-duration) var(--sm-easing);
}

.code-panel:hover .copy-btn {
  opacity: 1;
}

.copy-btn::before {
  content: '';
  display: block;
  width: var(--sm-space-6);
  height: var(--sm-space-6);
  margin: 0.4375rem;
  background: var(--vp-c-text-2);
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Crect x='9' y='9' width='13' height='13' rx='2'/%3E%3Cpath d='M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1'/%3E%3C/svg%3E");
  mask-size: contain;
}

.copy-btn.copied::before {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E");
  background: var(--vp-c-brand-1);
}
</style>
