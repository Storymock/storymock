<template>
  <div class="comparison">
    <div class="comparison-panel without-panel">
      <div class="comparison-label">Without storymock</div>
      <div class="comparison-code">
        <slot name="without" />
      </div>
    </div>
    <div class="comparison-panel with-panel">
      <div class="comparison-label">With storymock</div>
      <div class="comparison-code">
        <slot name="with" />
      </div>
    </div>
  </div>

  <div class="callouts">
    <div class="callout">
      <span class="callout-icon">🏷️</span>
      <div>
        <strong>Named states, not ad-hoc overrides</strong>
        <p>Define <code>'expiredAdmin'</code> or <code>'premium'</code> once. Apply by name — no copy-pasting field values.</p>
      </div>
    </div>
    <div class="callout">
      <span class="callout-icon">🎲</span>
      <div>
        <strong>Realistic data without reinventing fakers</strong>
        <p><code>person().fullName()</code>, <code>temporal().past()</code>, <code>finance().amount().precision(2)</code> — built-in and composable.</p>
      </div>
    </div>
    <div class="callout">
      <span class="callout-icon">🔗</span>
      <div>
        <strong>Complex relationships in one call</strong>
        <p><code>ref()</code> wires foreign keys. <code>.setup()</code> distributes members. One <code>.create()</code> gives you the whole graph.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 1.5rem 0;
}

.comparison-panel {
  border-left: 3px solid var(--vp-c-divider);
  min-width: 0;
}

.without-panel {
  border-left-color: var(--vp-c-text-3);
  opacity: 0.75;
}

.with-panel {
  border-left-color: var(--vp-c-brand-1);
}

.comparison-label {
  padding-left: 16px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.with-panel .comparison-label {
  color: var(--vp-c-brand-1);
}

.comparison-code :deep(div[class*="language-"]) {
  margin: 0;
  border-radius: 0 8px 8px 0;
}

.comparison-code :deep(pre) {
  padding: 16px 20px;
}

.comparison-code :deep(button.copy) {
  display: none;
}

/* Callouts */
.callouts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 1.5rem 0 0;
}

.callout {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.callout-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 1px;
}

.callout strong {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  color: var(--vp-c-text-1);
}

.callout p {
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin: 0;
}

.callout code {
  font-size: 12px;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--vp-c-bg-mute);
  font-family: var(--vp-font-family-mono);
}

@media (max-width: 768px) {
  .comparison {
    grid-template-columns: 1fr;
  }
  .callouts {
    grid-template-columns: 1fr;
  }
}
</style>
