import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './custom.css';

import BadgeBar from './components/BadgeBar.vue';
import BeforeAfter from './components/BeforeAfter.vue';
import InstallPackage from './components/InstallPackage.vue';
import LayerDiagram from './components/LayerDiagram.vue';
import PlaygroundDemo from './components/PlaygroundDemo.vue';
import Versus from './components/Versus.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PlaygroundDemo', PlaygroundDemo);
    app.component('BeforeAfter', BeforeAfter);
    app.component('LayerDiagram', LayerDiagram);
    app.component('BadgeBar', BadgeBar);
    app.component('InstallPackage', InstallPackage);
    app.component('Versus', Versus);
  },
} satisfies Theme;
