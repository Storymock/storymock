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

const age    = numeric().min(18).max(65).create();
const name   = person().fullName().create();
const id     = text().uuid().create();
const born   = temporal().past(50).iso().create();
const status = choice('active', 'inactive').create();`,
    outputs: [
      `age    → 34
name   → 'Yuki Tanaka'
id     → '7b3e1d09-a4c2-4f8b-9e6d-1a2b3c4d5e6f'
born   → '2001-03-14T08:23:41.000Z'
status → 'active'`,
      `age    → 52
name   → 'Amara Osei'
id     → 'e72f1a9b-5c8d-4e2a-b3f7-9d0a1b2c3d4e'
born   → '1987-11-22T14:05:47.000Z'
status → 'inactive'`,
      `age    → 21
name   → 'Diego Fuentes'
id     → '550e8400-e29b-41d4-a716-446655440000'
born   → '2004-07-03T18:29:55.000Z'
status → 'active'`,
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

UserSchema.with('admin').create();`,
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
  .create();`,
    outputs: [
      `{
  user:  { id: 'a1b2c3d4', name: 'Amara Osei' },
  order: { id: 'e5f6a7b8', userId: 'a1b2c3d4', total: 129.99 }
}
✓ order.userId === user.id`,
      `{
  user:  { id: 'f9e8d7c6', name: 'Lena Björk' },
  order: { id: '1a2b3c4d', userId: 'f9e8d7c6', total: 42.50 }
}
✓ order.userId === user.id`,
      `{
  user:  { id: '5e6f7a8b', name: 'Diego Fuentes' },
  order: { id: '9c0d1e2f', userId: '5e6f7a8b', total: 384.00 }
}
✓ order.userId === user.id`,
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
      <div class="playground-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="switchTab(tab.id)"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>
      <button
        class="run-btn"
        :class="{ running: isAnimating }"
        @click="run"
        :disabled="isAnimating"
      >
        <span class="run-icon">▶️</span>
        {{ outputVisible ? 'Re-run' : 'Run' }}
      </button>
    </div>

    <div class="playground-body">
      <div class="code-panel">
        <div v-if="highlightedCode" class="code-block highlighted" v-html="highlightedCode"></div>
        <pre v-else class="code-block"><code>{{ currentExample.code }}</code></pre>
      </div>

      <Transition name="output">
        <div v-if="outputVisible" class="output-panel" :key="runCount">
          <div class="output-label">Output</div>
          <pre class="output-block"><code>{{ currentOutput }}</code></pre>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.playground {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  margin: 1.5rem 0;
  background: var(--vp-c-bg-soft);
}

.playground-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.playground-tabs {
  display: flex;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
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
  font-size: 16px;
}

.run-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px;
  margin: 6px 8px;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
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
  font-size: 10px;
}

.playground-body {
  display: flex;
  flex-direction: column;
}

.code-panel {
  padding: 0;
}

.code-block {
  margin: 0;
  padding: 20px 24px;
  background: var(--vp-code-block-bg);
  font-size: 13.5px;
  line-height: 1.7;
  overflow-x: auto;
  border-radius: 0;
}

.code-block code {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

.code-block.highlighted :deep(pre) {
  margin: 0;
  padding: 20px 24px;
  background: var(--vp-code-block-bg) !important;
  font-size: 13.5px;
  line-height: 1.7;
  overflow-x: auto;
  border-radius: 0;
}

.code-block.highlighted :deep(code) {
  font-family: var(--vp-font-family-mono);
}

.output-panel {
  border-top: 1px solid var(--vp-c-divider);
}

.output-label {
  padding: 10px 24px 0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}

.output-block {
  margin: 0;
  padding: 10px 24px 20px;
  background: transparent;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--vp-c-brand-1);
  overflow-x: auto;
}

.output-block code {
  font-family: var(--vp-font-family-mono);
}

/* Output slide animation */
.output-enter-active {
  transition: all 0.3s ease-out;
}
.output-leave-active {
  transition: all 0.15s ease-in;
}
.output-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.output-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .playground-header {
    flex-direction: column;
    gap: 0;
  }
  .playground-tabs {
    width: 100%;
  }
  .tab-btn {
    flex: 1;
    justify-content: center;
    padding: 10px 8px;
    font-size: 13px;
  }
  .run-btn {
    margin: 0 8px 8px;
    align-self: flex-end;
  }
  .code-block,
  .output-block {
    padding: 16px;
    font-size: 12.5px;
  }
  .output-label {
    padding: 10px 16px 0;
  }
}
</style>
