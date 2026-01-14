<template>
  <div class="health-tab">
    <div class="health-header">
      <h2>健康监测系统</h2>
      <p class="health-subtitle">实时生理数据记录</p>
    </div>

    <div class="health-content">
      <!-- 当前交互对象 -->
      <div class="health-section">
        <h3 class="section-title">
          <i class="fa fa-user"></i>
          当前交互对象
        </h3>
        <div class="info-card">
          <p class="info-item">
            <span class="info-label">对象名称：</span>
            <span class="info-value">{{ currentPartner.name || '未记录' }}</span>
          </p>
        </div>
      </div>

      <!-- 基础数据 -->
      <div class="health-section">
        <h3 class="section-title">
          <i class="fa fa-heartbeat"></i>
          基础数据统计
        </h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">做爱次数</div>
            <div class="stat-value">{{ stats.intercourseCount }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">射精次数</div>
            <div class="stat-value">{{ stats.ejaculationCount }}</div>
          </div>
        </div>
      </div>

      <!-- 详细记录 -->
      <div class="health-section">
        <h3 class="section-title">
          <i class="fa fa-file-text"></i>
          详细记录
        </h3>

        <!-- 内射量 -->
        <div class="info-card">
          <p class="info-item">
            <span class="info-label">内射量：</span>
            <span class="info-value">{{ details.internalEjaculation || '未记录' }}</span>
          </p>
        </div>

        <!-- 体位偏好 -->
        <div class="info-card">
          <p class="info-item">
            <span class="info-label">体位偏好：</span>
            <span class="info-value">{{ details.positionPreferences || '未记录' }}</span>
          </p>
        </div>

        <!-- 敏感点开发 -->
        <div class="info-card">
          <p class="info-item">
            <span class="info-label">敏感点开发：</span>
            <span class="info-value">{{ details.sensitivePoints || '未记录' }}</span>
          </p>
        </div>
      </div>

      <!-- 器官数据 -->
      <div class="health-section">
        <h3 class="section-title">
          <i class="fa fa-stethoscope"></i>
          器官数据
        </h3>

        <div class="organ-data">
          <div class="organ-group">
            <h4 class="organ-title">攻方数据</h4>
            <div class="info-card">
              <p class="info-item">
                <span class="info-label">颜色：</span>
                <span class="info-value">{{ organData.attacker.color || '未记录' }}</span>
              </p>
              <p class="info-item">
                <span class="info-label">尺寸：</span>
                <span class="info-value">{{ organData.attacker.size || '未记录' }}</span>
              </p>
              <p class="info-item">
                <span class="info-label">状态：</span>
                <span class="info-value">{{ organData.attacker.status || '未记录' }}</span>
              </p>
            </div>
          </div>

          <div class="organ-group">
            <h4 class="organ-title">受方数据</h4>
            <div class="info-card">
              <p class="info-item">
                <span class="info-label">颜色：</span>
                <span class="info-value">{{ organData.receiver.color || '未记录' }}</span>
              </p>
              <p class="info-item">
                <span class="info-label">尺寸：</span>
                <span class="info-value">{{ organData.receiver.size || '未记录' }}</span>
              </p>
              <p class="info-item">
                <span class="info-label">状态：</span>
                <span class="info-value">{{ organData.receiver.status || '未记录' }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 避孕措施 -->
      <div class="health-section">
        <h3 class="section-title">
          <i class="fa fa-shield"></i>
          避孕措施
        </h3>
        <div class="info-card">
          <p class="info-item">
            <span class="info-label">是否使用：</span>
            <span class="info-value" :class="{ 'has-protection': protection.used, 'no-protection': !protection.used }">
              {{ protection.used ? '是' : '否' }}
            </span>
          </p>
          <p v-if="protection.used" class="info-item">
            <span class="info-label">措施类型：</span>
            <span class="info-value">{{ protection.type || '未记录' }}</span>
          </p>
        </div>
      </div>

      <!-- 怀孕概率 -->
      <div class="health-section">
        <h3 class="section-title">
          <i class="fa fa-line-chart"></i>
          怀孕概率分析
        </h3>
        <div class="pregnancy-chart">
          <div v-for="(item, index) in pregnancyData" :key="index" class="pregnancy-item">
            <div class="pregnancy-label">{{ item.condition }}</div>
            <div class="pregnancy-bar">
              <div class="pregnancy-fill" :style="{ width: `${item.probability}%` }"></div>
            </div>
            <div class="pregnancy-value">{{ item.probability }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const currentPartner = ref({
  name: '',
});

const stats = ref({
  intercourseCount: 0,
  ejaculationCount: 0,
});

const details = ref({
  internalEjaculation: '',
  positionPreferences: '',
  sensitivePoints: '',
});

const organData = ref({
  attacker: {
    color: '',
    size: '',
    status: '',
  },
  receiver: {
    color: '',
    size: '',
    status: '',
  },
});

const protection = ref({
  used: false,
  type: '',
});

const pregnancyData = ref([
  { condition: '标准体位（无保护）', probability: 15 },
  { condition: '标准体位（有保护）', probability: 2 },
  { condition: '后入式（无保护）', probability: 18 },
  { condition: '后入式（有保护）', probability: 2 },
  { condition: '侧位（无保护）', probability: 12 },
  { condition: '侧位（有保护）', probability: 1 },
]);

function loadHealthData() {
  const variables = getVariables({ type: 'message', message_id: getCurrentMessageId() });

  // 尝试从变量中读取健康数据
  const healthData = variables['健康数据'] || variables['health_data'] || {};
  const nsfwData = variables['NSFW数据'] || variables['nsfw_data'] || {};

  // 合并数据
  const data = { ...healthData, ...nsfwData };

  if (data.currentPartner) {
    currentPartner.value = data.currentPartner;
  }

  if (data.stats) {
    stats.value = { ...stats.value, ...data.stats };
  }

  if (data.details) {
    details.value = { ...details.value, ...data.details };
  }

  if (data.organData) {
    organData.value = { ...organData.value, ...data.organData };
  }

  if (data.protection) {
    protection.value = { ...protection.value, ...data.protection };
  }

  if (data.pregnancyData) {
    pregnancyData.value = data.pregnancyData;
  }
}

onMounted(() => {
  loadHealthData();
});
</script>

<style lang="scss" scoped>
.health-tab {
  padding: 16px;
  background: #f5f5f5;
  min-height: 100%;
}

.health-header {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: #fff;

  h2 {
    margin: 0 0 8px 0;
    font-size: 22px;
    font-weight: bold;
  }

  .health-subtitle {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
}

.health-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.health-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;

  i {
    color: #667eea;
  }
}

.info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
}

.info-item {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.6;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: 600;

  &.has-protection {
    color: #28a745;
  }

  &.no-protection {
    color: #dc3545;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  color: #fff;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.organ-data {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.organ-group {
  .organ-title {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #667eea;
  }
}

.pregnancy-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pregnancy-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pregnancy-label {
  flex: 0 0 140px;
  font-size: 13px;
  color: #666;
}

.pregnancy-bar {
  flex: 1;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.pregnancy-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b 0%, #ee5a6f 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.pregnancy-value {
  flex: 0 0 40px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
</style>
