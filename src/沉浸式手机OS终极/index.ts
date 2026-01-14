import { createApp } from 'vue';
import App from './app.vue';

// Run with or without jQuery (SillyTavern or plain browser)
const onReady = (cb: () => void) => {
  const w = window as any;
  if (typeof w.$ === 'function' && w.$?.fn?.jquery) w.$(cb);
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cb, { once: true });
  else cb();
};

onReady(() => {
  createApp(App).mount('#app');
});

