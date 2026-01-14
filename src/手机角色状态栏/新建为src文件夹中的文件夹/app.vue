<template>
  <div class="phone-container">
    <!-- 手机边框 -->
    <div class="phone-frame">
      <!-- 刘海 -->
      <div class="notch">
        <div class="notch-camera"></div>
        <div class="notch-speaker"></div>
      </div>

      <!-- 状态栏 -->
      <div class="status-bar">
        <div class="status-left">
          <span class="time">{{ currentTime }}</span>
        </div>
        <div class="status-right">
          <span class="signal">📶</span>
          <span class="wifi">📶</span>
          <span class="battery">🔋</span>
        </div>
      </div>

      <!-- 标签页导航 -->
      <div class="tab-navigation">
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

      <!-- 内容区域 -->
      <div class="content-area">
        <NewsTab v-if="activeTab === 'news'" />
        <MessagesTab v-if="activeTab === 'messages'" />
        <HealthTab v-if="activeTab === 'health'" />
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
  max-width: 375px;
  margin: 0 auto;
  aspect-ratio: 375 / 812;
  position: relative;
}

.phone-frame {
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 40px;
  padding: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 30px;
  background: #000;
  border-radius: 0 0 20px 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 20px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  padding-top: 40px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.status-right {
  display: flex;
  gap: 6px;
  font-size: 12px;
}

.tab-navigation {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
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
  flex: 1;
  overflow-y: auto;
  background: #f5f5f5;
  height: calc(100% - 120px);
}
</style>
