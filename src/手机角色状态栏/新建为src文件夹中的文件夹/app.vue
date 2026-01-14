<template>
  <div class="phone-container">
    <div class="phone-frame">
      <!-- 刘海 -->
      <div class="notch">
        <div class="notch-camera"></div>
        <div class="notch-speaker"></div>
      </div>

      <!-- 顶部状态栏 -->
      <div class="status-bar">
        <div class="status-left">
          <i class="fa fa-signal"></i>
          <i class="fa fa-wifi"></i>
        </div>
        <div class="status-mid">
          <span class="time">{{ currentTime }}</span>
        </div>
        <div class="status-right">
          <span class="weather">{{ weather }}</span>
          <i class="fa fa-battery-three-quarters"></i>
        </div>
      </div>

      <!-- 中间内容区（顶部和底部栏之间自适应） -->
      <div class="content-area">
        <NewsTab v-if="activeTab === 'news'" />
        <MessagesTab v-if="activeTab === 'messages'" />
        <HealthTab v-if="activeTab === 'health'" />
      </div>

      <!-- 底部标签栏 -->
      <div class="tab-navigation bottom">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-button"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import NewsTab from './components/NewsTab.vue';
import MessagesTab from './components/MessagesTab.vue';
import HealthTab from './components/HealthTab.vue';

const tabs = [
  { id: 'news', label: '新闻', icon: 'fa fa-newspaper-o' },
  { id: 'messages', label: '短信', icon: 'fa fa-comment' },
  { id: 'health', label: '健康', icon: 'fa fa-heartbeat' },
];

const activeTab = ref('news');
const currentTime = ref('');
const weather = ref('晴 22℃');

function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  currentTime.value = `${hours}:${minutes}`;
}

let timeInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  try {
    const vars = typeof getVariables === 'function' && typeof getCurrentMessageId === 'function'
      ? getVariables({ type: 'message', message_id: getCurrentMessageId() })
      : {};
    const world = (vars && (vars.stat_data && vars.stat_data.世界)) || vars.世界 || {};
    const w = world.天气 || world.当前天气 || vars.weather || '';
    const t = world.温度 || world.temperature;
    weather.value = [w || '晴', typeof t === 'number' ? `${t}℃` : (t || '22℃')].join(' ');
  } catch (e) {
    // ignore
  }
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style lang="scss" scoped>
.phone-container {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  aspect-ratio: 390 / 844;
  position: relative;
}

.phone-frame {
  position: relative;
  height: 100%;
  background: #000;
  border-radius: 32px;
  padding: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 30px;
  background: #0a0a0a; /* slightly lighter than frame for visibility */
  border-radius: 0 0 20px 20px;
  z-index: 50; /* ensure on top of status bar */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,.6);
}

.notch-camera {
  width: 8px;
  height: 8px;
  background: #333;
  border-radius: 50%;
}

.notch-speaker {
  width: 40px;
  height: 4px;
  background: #333;
  border-radius: 2px;
}

.status-bar {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 76px; /* include notch */
  padding: 38px 14px 10px 14px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  color: #fff;
  font-size: 12px;
  /* transparent top bar so the notch is visible; subtle fade for readability */
  background: linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 100%);
  z-index: 40;
}
.status-left, .status-right { display: flex; align-items: center; gap: 6px; }
.status-mid { text-align: center; font-weight: 700; letter-spacing: 0.5px; }
.status-right .weather { font-weight: 600; margin-right: 4px; }

.tab-navigation.bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 56px;
  display: flex;
  background: #fff;
  border-top: 1px solid #e0e0e0;
}

.tab-button {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;

  i {
    font-size: 18px;
  }

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    color: #667eea;
    border-bottom-color: #667eea;
    background: #f8f9ff;
  }
}

.content-area {
  position: absolute;
  left: 0;
  right: 0;
  top: 76px;
  bottom: 56px;
  overflow-y: auto;
  background: #f5f5f5;
}
</style>
