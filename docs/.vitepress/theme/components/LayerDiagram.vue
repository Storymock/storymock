<template>
  <div class="layer-diagram">
    <div class="layer">
      <div class="layer-header">
        <span class="layer-name">Faker</span>
        <span class="layer-desc">Generate a single value</span>
      </div>
      <p class="layer-code">
        <code>numeric().min(1).max(100) · person().fullName() · text().uuid()</code>
      </p>
      <p class="layer-methods">.min() · .max() · .precision() · .not() · .unique()</p>
    </div>

    <div class="connector" aria-hidden="true">
      <div class="connector-line" />
      <div class="connector-dot dot-1" />
      <div class="connector-dot dot-2" />
      <div class="connector-dot dot-3" />
    </div>

    <div class="layer">
      <div class="layer-header">
        <span class="layer-name">Schema</span>
        <span class="layer-desc">Map fields to fakers, define named states</span>
      </div>
      <p class="layer-code">
        <code>schema&lt;User&gt;({ id: text().uuid(), name: person().fullName() }).trait('admin', { ... })</code>
      </p>
      <p class="layer-methods">.trait() · when() · derive() · .id()</p>
    </div>

    <div class="connector" aria-hidden="true">
      <div class="connector-line" />
      <div class="connector-dot dot-1" />
      <div class="connector-dot dot-2" />
      <div class="connector-dot dot-3" />
    </div>

    <div class="layer">
      <div class="layer-header">
        <span class="layer-name">Story</span>
        <span class="layer-desc">Compose schemas, wire relationships</span>
      </div>
      <p class="layer-code">
        <code>story().add('user', UserSchema).add('order', OrderSchema, { userId: ref('user') })</code>
      </p>
      <p class="layer-methods">ref() · .setup() · .with() · .addMany()</p>
    </div>
  </div>
</template>

<style scoped>
.layer-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: var(--sm-space-9) auto;
  max-width: 640px;
}

.layer {
  width: 100%;
  padding: var(--sm-space-7) var(--sm-space-8);
  border-radius: var(--sm-radius-lg);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  transition: transform var(--sm-duration) var(--sm-easing), box-shadow var(--sm-duration) var(--sm-easing);
}

.layer:hover {
  transform: scale(1.015);
  box-shadow: var(--sm-shadow-sm);
}

.layer-header {
  display: flex;
  align-items: baseline;
  gap: var(--sm-space-5);
  margin-bottom: var(--sm-space-3);
}

.layer-name {
  font-size: var(--sm-text-xl);
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.layer-desc {
  font-size: var(--sm-text-md);
  color: var(--vp-c-text-2);
}

.layer-code {
  font-family: var(--vp-font-family-mono);
  font-size: var(--sm-text-sm);
  color: var(--vp-c-text-3);
  margin: 0 0 var(--sm-space-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layer-methods {
  font-size: var(--sm-text-sm);
  font-weight: 600;
  color: var(--vp-c-text-3);
  letter-spacing: 0.02em;
  margin: 0;
}

/* Connectors with animated dots */

.connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 2.25rem;
  position: relative;
  width: 2px;
}

.connector-line {
  width: 2px;
  height: 100%;
  background: var(--vp-c-divider);
}

.connector-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  animation: dot-flow 2.4s ease-in-out infinite;
}

.dot-1 { animation-delay: 0s; }
.dot-2 { animation-delay: 0.7s; }
.dot-3 { animation-delay: 1.4s; }

@keyframes dot-flow {
  0% { top: 0; opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

@media (max-width: 640px) {
  .layer {
    padding: var(--sm-space-6);
  }

  .layer-header {
    flex-direction: column;
    gap: var(--sm-space-0);
  }

  .layer-code {
    font-size: 0.6875rem;
  }
}
</style>
