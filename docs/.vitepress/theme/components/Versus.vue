<script setup lang="ts">
defineProps<{
  other?: string
}>()
</script>

<template>
  <div class="versus">
    <div class="versus-block versus-other-block">
      <div class="versus-header other-header">
        <span class="versus-icon">○</span>
        {{ other || 'Other' }}
      </div>
      <div class="versus-content">
        <slot name="other" />
      </div>
    </div>
    <div class="versus-divider">
      <span>vs</span>
    </div>
    <div class="versus-block versus-storymock-block">
      <div class="versus-header storymock-header">
        <span class="versus-icon">◆</span>
        storymock
      </div>
      <div class="versus-content">
        <slot name="storymock" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.versus {
  margin: 1.5rem 0 2rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.versus-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.other-header {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  border-bottom: 1px solid var(--vp-c-divider);
}

.storymock-header {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
}

.versus-icon {
  font-size: 10px;
}

.versus-other-block {
  opacity: 0.75;
  transition: opacity 0.2s ease;
}

.versus:hover .versus-other-block {
  opacity: 0.9;
}

.versus-storymock-block {
  border-left: 3px solid var(--vp-c-brand-1);
}

.versus-content :deep(div[class*="language-"]) {
  border-radius: 0;
  margin: 0;
  border: none;
}

.versus-content :deep(pre) {
  margin: 0;
  border-radius: 0;
}

.versus-content :deep(button.copy) {
  top: 8px;
  right: 8px;
}

.versus-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.versus-divider span {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-alt);
  padding: 2px 14px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
}
</style>
