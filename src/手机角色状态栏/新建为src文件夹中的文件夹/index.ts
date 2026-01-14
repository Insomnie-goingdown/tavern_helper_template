import { createApp } from 'vue';
import app from './app.vue';

// Allow running both inside SillyTavern (has jQuery `$`) and plain browser previews
const onReady = (cb: () => void) => {
  const w = window as any;
  if (typeof w.$ === 'function' && w.$?.fn?.jquery) {
    // SillyTavern provides jQuery in the iframe
    w.$(cb);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cb, { once: true });
  } else {
    cb();
  }
};

onReady(() => {
  createApp(app).mount('#app');
});
