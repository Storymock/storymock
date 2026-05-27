<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue'
import { createHighlighter, type Highlighter } from 'shiki'

const activeTab = ref<'faker' | 'schema' | 'story'>('faker')
const outputVisible = ref(false)
const runCount = ref(0)
const isAnimating = ref(false)
const highlighter = shallowRef<Highlighter | null>(null)

onMounted(async () => {
  highlighter.value = await createHighlighter({
    themes: ['github-dark', 'github-light'],
    langs: ['typescript'],
  })
})

const tabs = [
  { id: 'faker' as const, label: 'Faker', icon: '🎲' },
  { id: 'schema' as const, label: 'Schema', icon: '📐' },
  { id: 'story' as const, label: 'Story', icon: '📖' },
]

const examples = {
  faker: {
    code: `import { numeric, person, text, temporal, choice } from 'storymock';

const age    = numeric().min(18).max(65).create();     // 34
const name   = person().fullName().create();           // "Yuki Tanaka"
const id     = text().uuid().create();                 // "7b3e1d09-a4c2-..."
const born   = temporal().past(50).iso().create();     // "2001-03-14T08:23:41.000Z"
const status = choice('active', 'inactive').create();  // "active" or "inactive"`,
    outputs: [
      `age:    34
name:   "Yuki Tanaka"
id:     "7b3e1d09-a4c2-4f8b-9e6d-1a2b3c4d5e6f"
born:   "2001-03-14T08:23:41.000Z"
status: "active"`,
      `age:    52
name:   "Amara Osei"
id:     "e72f1a9b-5c8d-4e2a-b3f7-9d0a1b2c3d4e"
born:   "1987-11-22T14:05:47.000Z"
status: "inactive"`,
      `age:    21
name:   "Diego Fuentes"
id:     "550e8400-e29b-41d4-a716-446655440000"
born:   "2004-07-03T18:29:55.000Z"
status: "active"`,
    ],
  },
  schema: {
    code: `import { schema, text, person, choice } from 'storymock';

const UserSchema = schema<User>({
  id:     text().uuid(),
  name:   person().fullName(),
  role:   choice('viewer', 'editor', 'admin'),
  status: choice('active', 'inactive'),
}).trait('admin', { role: 'admin' as const });

const user = UserSchema.with('admin').create();
// { id: "7b3e...", name: "Yuki Tanaka", role: "admin", status: "active" }`,
    outputs: [
      `{
  id:     '7b3e1d09-a4c2-4f8b-...',
  name:   'Yuki Tanaka',
  role:   'admin',
  status: 'active'
}`,
      `{
  id:     'c8d2f4a7-9b1e-4c3a-...',
  name:   'Sofia Reyes',
  role:   'admin',
  status: 'inactive'
}`,
      `{
  id:     'a9f1e0c6-3d4b-4a2c-...',
  name:   'Kenji Watanabe',
  role:   'admin',
  status: 'active'
}`,
    ],
  },
  story: {
    code: `import { story, ref } from 'storymock';

const checkout = story()
  .add('user', UserSchema)
  .add('order', OrderSchema, { userId: ref('user') })
  .create();
// checkout.user  = { id: "a1b2c3d4", name: "Amara Osei" }
// checkout.order = { id: "e5f6a7b8", userId: "a1b2c3d4", total: 129.99 }`,
    outputs: [
      `{
  user:  { id: "a1b2c3d4", name: "Amara Osei" },
  order: { id: "e5f6a7b8", userId: "a1b2c3d4", total: 129.99 }
}
order.userId === user.id  // true`,
      `{
  user:  { id: "f9e8d7c6", name: "Lena Bj\u00f6rk" },
  order: { id: "1a2b3c4d", userId: "f9e8d7c6", total: 42.50 }
}
order.userId === user.id  // true`,
      `{
  user:  { id: "5e6f7a8b", name: "Diego Fuentes" },
  order: { id: "9c0d1e2f", userId: "5e6f7a8b", total: 384.00 }
}
order.userId === user.id  // true`,
    ],
  },
}

const currentExample = computed(() => examples[activeTab.value])
const currentOutput = computed(() => {
  const outputs = currentExample.value.outputs
  return outputs[runCount.value % outputs.length]
})

const highlightedCode = computed(() => {
  if (!highlighter.value) return ''
  return highlighter.value.codeToHtml(currentExample.value.code, {
    lang: 'typescript',
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: false,
  })
})

function switchTab(id: 'faker' | 'schema' | 'story') {
  activeTab.value = id
  outputVisible.value = false
  runCount.value = 0
}

function onTabKeydown(event: KeyboardEvent) {
  const currentIndex = tabs.findIndex(t => t.id === activeTab.value)
  let next = currentIndex

  if (event.key === 'ArrowRight') next = (currentIndex + 1) % tabs.length
  else if (event.key === 'ArrowLeft') next = (currentIndex - 1 + tabs.length) % tabs.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = tabs.length - 1
  else return

  event.preventDefault()
  switchTab(tabs[next].id)
  const tablist = (event.currentTarget as HTMLElement).parentElement
  ;(tablist?.children[next] as HTMLElement)?.focus()
}

async function run() {
  isAnimating.value = true
  outputVisible.value = false

  await new Promise(r => setTimeout(r, 200))

  runCount.value++
  outputVisible.value = true
  isAnimating.value = false
}
</script>

<template>
  <div class="playground">
    <div class="playground-header">
      <div class="playground-tabs" role="tablist" aria-label="Example type">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          role="tab"
          :id="`playground-tab-${tab.id}`"
          :aria-selected="activeTab === tab.id"
          aria-controls="playground-panel"
          :tabindex="activeTab === tab.id ? 0 : -1"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="switchTab(tab.id)"
          @keydown="onTabKeydown"
        >
          <span class="tab-icon" aria-hidden="true">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>
      <button
        class="run-btn"
        :class="{ running: isAnimating }"
        :disabled="isAnimating"
        @click="run"
      >
        <svg class="run-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M4 2.5v11l10-5.5z"/>
        </svg>
        {{ outputVisible ? 'Re-run' : 'Run' }}
      </button>
    </div>

    <div
      class="playground-body"
      id="playground-panel"
      role="tabpanel"
      :aria-labelledby="`playground-tab-${activeTab}`"
    >
      <div class="code-container">
        <div v-if="highlightedCode" v-html="highlightedCode" />
        <pre v-else><code>{{ currentExample.code }}</code></pre>
      </div>

      <Transition name="output">
        <div v-if="outputVisible" class="output-panel" :key="runCount">
          <p class="output-label">Example output</p>
          <pre class="output-block"><code>{{ currentOutput }}</code></pre>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.playground {
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--sm-radius-lg);
  overflow: hidden;
  margin: var(--sm-space-9) 0;
  background: var(--vp-c-bg-soft);
}

.playground-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--sm-space-1);
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.playground-tabs {
  display: flex;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--sm-space-2);
  padding: var(--sm-space-4) var(--sm-space-6);
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: var(--sm-text-md);
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color var(--sm-duration) var(--sm-easing), border-color var(--sm-duration) var(--sm-easing);
  font-family: var(--vp-font-family-base);
}

.tab-btn:hover {
  color: var(--vp-c-text-1);
}

.tab-btn.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.tab-icon {
  font-size: var(--sm-text-lg);
}

.run-btn {
  display: flex;
  align-items: center;
  gap: var(--sm-space-2);
  padding: var(--sm-space-2) 1.125rem;
  margin: var(--sm-space-2) var(--sm-space-3);
  border: none;
  border-radius: var(--sm-radius-md);
  background: var(--vp-c-brand-1);
  color: white;
  font-size: var(--sm-text-base);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--sm-duration) var(--sm-easing), transform var(--sm-duration) var(--sm-easing);
  font-family: var(--vp-font-family-base);
}

.run-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
  transform: scale(1.03);
}

.run-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.run-icon {
  width: var(--sm-space-5);
  height: var(--sm-space-5);
  flex-shrink: 0;
}

.playground-body {
  display: flex;
  flex-direction: column;
}

/* Code container — handles both Shiki-highlighted and plain fallback */

.code-container :deep(pre),
.code-container > pre {
  margin: 0;
  padding: var(--sm-space-7) var(--sm-space-8);
  background: var(--vp-code-block-bg) !important;
  font-size: var(--sm-text-base);
  line-height: 1.7;
  overflow-x: auto;
  border-radius: 0;
}

.code-container > pre > code {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

.code-container :deep(code) {
  font-family: var(--vp-font-family-mono);
}

.code-container :deep(.shiki),
.code-container :deep(.shiki span) {
  color: var(--shiki-light);
}

.dark .code-container :deep(.shiki),
.dark .code-container :deep(.shiki span) {
  color: var(--shiki-dark);
}

/* Output panel */

.output-panel {
  border-top: 1px solid var(--vp-c-divider);
}

.output-label {
  padding: var(--sm-space-4) var(--sm-space-8) 0;
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}

.output-block {
  margin: 0;
  padding: var(--sm-space-4) var(--sm-space-8) var(--sm-space-7);
  background: transparent;
  font-size: var(--sm-text-base);
  line-height: 1.7;
  color: var(--vp-c-brand-1);
  overflow-x: auto;
}

.output-block code {
  font-family: var(--vp-font-family-mono);
}

/* Output slide animation */

.output-enter-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.output-leave-active {
  transition: opacity 0.15s ease-in;
}

.output-enter-from {
  opacity: 0;
  transform: translateY(-0.5rem);
}

.output-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .playground-header {
    flex-direction: column;
  }

  .playground-tabs {
    width: 100%;
  }

  .tab-btn {
    flex: 1;
    justify-content: center;
    padding: var(--sm-space-4) var(--sm-space-3);
    font-size: var(--sm-text-base);
  }

  .run-btn {
    margin: 0 var(--sm-space-3) var(--sm-space-3);
    align-self: flex-end;
  }

  .code-container :deep(pre),
  .code-container > pre,
  .output-block {
    padding: var(--sm-space-6);
    font-size: var(--sm-text-base);
  }

  .output-label {
    padding: var(--sm-space-4) var(--sm-space-6) 0;
  }
}
</style>
