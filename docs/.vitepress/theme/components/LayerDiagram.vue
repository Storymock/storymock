<template>
  <div class="layer-diagram">
    <div class="layer faker-layer">
      <div class="layer-top">
        <span class="layer-name">Faker</span>
        <span class="layer-desc">Generate a single value</span>
      </div>
      <div class="layer-code">
        <code>numeric().min(1).max(100) · person().fullName() · text().uuid()</code>
      </div>
      <div class="layer-methods">.min() · .max() · .precision() · .not() · .unique()</div>
    </div>

    <div class="connector">
      <div class="connector-line" />
      <div class="connector-dot dot-1" />
      <div class="connector-dot dot-2" />
      <div class="connector-dot dot-3" />
    </div>

    <div class="layer schema-layer">
      <div class="layer-top">
        <span class="layer-name">Schema</span>
        <span class="layer-desc">Map fields to fakers, define named states</span>
      </div>
      <div class="layer-code">
        <code>schema&lt;User&gt;({ id: text().uuid(), name: person().fullName() }).trait('admin', { ... })</code>
      </div>
      <div class="layer-methods">.trait() · when() · derive() · .id()</div>
    </div>

    <div class="connector">
      <div class="connector-line" />
      <div class="connector-dot dot-1" />
      <div class="connector-dot dot-2" />
      <div class="connector-dot dot-3" />
    </div>

    <div class="layer story-layer">
      <div class="layer-top">
        <span class="layer-name">Story</span>
        <span class="layer-desc">Compose schemas, wire relationships</span>
      </div>
      <div class="layer-code">
        <code>story().add('user', UserSchema).add('order', OrderSchema, { userId: ref('user') })</code>
      </div>
      <div class="layer-methods">ref() · .setup() · .with() · .addMany()</div>
    </div>
  </div>
</template>

<style scoped>
.layer-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem auto;
  max-width: 640px;
}

.layer {
  width: 100%;
  padding: 20px 24px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.layer:hover {
  transform: scale(1.015);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
}
.dark .layer:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
}

.layer-top {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
}

.layer-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.layer-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.layer-code {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layer-methods {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  letter-spacing: 0.02em;
}

/* Connectors with animated dots */
.connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 36px;
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
  0% {
    top: 0;
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .layer {
    padding: 16px;
  }
  .layer-top {
    flex-direction: column;
    gap: 2px;
  }
  .layer-code {
    font-size: 11px;
  }
}
</style>
