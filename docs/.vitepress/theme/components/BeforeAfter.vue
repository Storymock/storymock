<template>
  <div class="before-after">
    <div class="comparison">
      <div class="comparison-panel without-panel">
        <p class="comparison-label">Without storymock</p>
        <div class="comparison-code">
          <slot name="without" />
        </div>
      </div>
      <div class="comparison-panel with-panel">
        <p class="comparison-label">With storymock</p>
        <div class="comparison-code">
          <slot name="with" />
        </div>
      </div>
    </div>

    <ul class="callouts">
      <li class="callout">
        <span class="callout-icon" aria-hidden="true">🏷️</span>
        <div>
          <strong>Named states, not ad-hoc overrides</strong>
          <p>Define <code>'expiredAdmin'</code> or <code>'premium'</code> once. Apply by name — no copy-pasting field values.</p>
        </div>
      </li>
      <li class="callout">
        <span class="callout-icon" aria-hidden="true">🎲</span>
        <div>
          <strong>Realistic data without reinventing fakers</strong>
          <p><code>person().fullName()</code>, <code>temporal().past()</code>, <code>finance().amount().precision(2)</code> — built-in and composable.</p>
        </div>
      </li>
      <li class="callout">
        <span class="callout-icon" aria-hidden="true">🔗</span>
        <div>
          <strong>Complex relationships in one call</strong>
          <p><code>ref()</code> wires foreign keys. <code>.setup()</code> distributes members. One <code>.create()</code> gives you the whole graph.</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.before-after {
  margin: var(--sm-space-9) 0;
}

.comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sm-space-7);
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
  padding-left: var(--sm-space-6);
  margin: 0 0 var(--sm-space-3);
  font-size: var(--sm-text-md);
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.with-panel .comparison-label {
  color: var(--vp-c-brand-1);
}

.comparison-code :deep(div[class*='language-']) {
  margin: 0;
  border-radius: 0 var(--sm-radius-md) var(--sm-radius-md) 0;
}

.comparison-code :deep(pre) {
  padding: var(--sm-space-6) var(--sm-space-7);
}

.comparison-code :deep(button.copy) {
  display: none;
}

/* Callouts */

.callouts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sm-space-6);
  margin: var(--sm-space-8) 0 0;
  padding: 0;
  list-style: none;
}

.callout {
  display: flex;
  gap: var(--sm-space-5);
  padding: var(--sm-space-7);
  border-radius: var(--sm-radius-lg);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.callout-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  line-height: 1.4;
}

.callout strong {
  display: block;
  font-size: var(--sm-text-md);
  margin-bottom: var(--sm-space-1);
  color: var(--vp-c-text-1);
}

.callout p {
  font-size: var(--sm-text-base);
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin: 0;
}

.callout code {
  font-size: var(--sm-text-sm);
  padding: 0.0625rem var(--sm-space-1);
  border-radius: var(--sm-radius-sm);
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
