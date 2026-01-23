<template>
  <div class="health-tab">
    <div class="header-card">
      <div class="header-title">健康监测</div>
      <div class="header-sub">当前交互对象：{{ partner_name }}</div>
    </div>

    <div class="section">
      <div class="section-title">基础数据</div>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">做爱次数</div>
          <div class="metric-value">{{ base_stats.做爱次数 }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">射精次数（估算）</div>
          <div class="metric-value">{{ base_stats.射精次数 }}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">详细记录</div>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">累计内射量</div>
          <div class="metric-value">{{ detail_stats.内射量 }}</div>
        </div>
        <div class="metric-card wide">
          <div class="metric-label">体位偏好</div>
          <div class="tag-list">
            <span v-for="item in detail_stats.体位偏好" :key="item" class="tag-chip">{{ item }}</span>
            <span v-if="detail_stats.体位偏好.length === 0" class="muted">暂无偏好记录</span>
          </div>
        </div>
        <div class="metric-card wide">
          <div class="metric-label">敏感点开发</div>
          <div class="tag-list">
            <span v-for="item in detail_stats.敏感点开发" :key="item.label" class="tag-chip">
              {{ item.label }} {{ item.value }}
            </span>
            <span v-if="detail_stats.敏感点开发.length === 0" class="muted">暂无数据</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">器官数据</div>
      <div class="metric-grid">
        <div class="metric-card wide">
          <div class="metric-label">攻方</div>
          <div class="metric-value">
            颜色 {{ organ_stats.攻方.颜色 }} · 尺寸 {{ organ_stats.攻方.尺寸 }} · 状态 {{ organ_stats.攻方.状态 }}
          </div>
        </div>
        <div class="metric-card wide">
          <div class="metric-label">受方</div>
          <div class="metric-value">
            颜色 {{ organ_stats.受方.颜色 }} · 尺寸 {{ organ_stats.受方.尺寸 }} · 状态 {{ organ_stats.受方.状态 }}
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">避孕措施</div>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">是否使用</div>
          <div class="metric-value">{{ contraception.used ? '是' : '否' }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">措施类型</div>
          <div class="metric-value">{{ contraception.type }}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">怀孕概率分析</div>
      <div class="analysis-list">
        <div v-for="item in pregnancy_analysis" :key="item.name" class="analysis-item">
          <div class="analysis-name">{{ item.name }}</div>
          <div class="analysis-value">{{ item.value }}%</div>
          <div class="progress-bar">
            <span :style="{ width: `${item.value}%` }"></span>
          </div>
          <div class="analysis-note">{{ item.note }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from './store';

const store = useDataStore();

const partner_name = computed(() => {
  const names = Object.keys(store.data.核心角色 ?? {}).filter(name => name !== '<user>');
  return names[0] || '未知对象';
});

const user_nsfw = computed(() => store.data.核心角色?.['<user>']?.NSFW档案 ?? {});
const partner_nsfw = computed(() => store.data.核心角色?.[partner_name.value]?.NSFW档案 ?? {});

const base_stats = computed(() => {
  const sex_count = Number(user_nsfw.value?.状态记录?.累计被内射次数 ?? 0);
  const amount = Number(partner_nsfw.value?.状态记录?.累计内射量 ?? 0);
  const ejaculate = amount > 0 ? Math.max(1, Math.round(amount / 2)) : 0;
  return {
    做爱次数: sex_count,
    射精次数: ejaculate,
  };
});

const detail_stats = computed(() => {
  const positions = Object.entries(user_nsfw.value?.体位偏好 ?? {})
    .filter(([, value]) => value)
    .map(([name]) => name);
  const partner_positions = _(partner_nsfw.value?.姿势偏好 ?? {})
    .entries()
    .orderBy(entry => entry[1], 'desc')
    .map(entry => `${entry[0]} ${entry[1]}`)
    .take(5)
    .value();
  const sensitive = _(user_nsfw.value?.敏感点开发度 ?? {})
    .entries()
    .map(([label, value]) => ({ label, value }))
    .orderBy('value', 'desc')
    .take(6)
    .value();

  return {
    内射量: Number(partner_nsfw.value?.状态记录?.累计内射量 ?? 0),
    体位偏好: positions.length > 0 ? positions : partner_positions,
    敏感点开发: sensitive,
  };
});

const organ_stats = computed(() => {
  const organ = partner_nsfw.value?.器官数据 ?? {};
  const target = user_nsfw.value?.器官状态 ?? {};
  const receiver_state = [target.阴道, target.宫颈, target.乳头].filter(Boolean).join(' / ') || '正常';
  const receiver_color = mapReceiverColor(target.阴道 || '正常');
  const receiver_size = mapReceiverSize(user_nsfw.value?.液体状态?.润滑水平, user_nsfw.value?.液体状态?.溢出程度);

  return {
    攻方: {
      颜色: mapAttackerColor(organ.状态 || '疲软'),
      尺寸: organ.尺寸 ?? '—',
      状态: organ.状态 ?? '未知',
    },
    受方: {
      颜色: receiver_color,
      尺寸: receiver_size,
      状态: receiver_state,
    },
  };
});

const contraception = computed(() => {
  const type = user_nsfw.value?.风险评估?.避孕措施 ?? '无';
  return {
    type,
    used: type !== '无',
  };
});

const pregnancy_analysis = computed(() => {
  const base = clampNumber(Number(user_nsfw.value?.风险评估?.怀孕概率 ?? 0), 0, 100);
  const method_factor = getMethodFactor(contraception.value.type);
  const positions = buildPositionList();
  return positions.map((name, index) => {
    const weight = 8 - index * 2;
    const value = clampNumber(Math.round(base * method_factor + weight), 0, 100);
    return {
      name,
      value,
      note: `${contraception.value.type} · 体位权重 ${weight}`,
    };
  });
});

function buildPositionList() {
  const user_positions = Object.entries(user_nsfw.value?.体位偏好 ?? {})
    .filter(([, value]) => value)
    .map(([name]) => name);
  const partner_positions = _(partner_nsfw.value?.姿势偏好 ?? {})
    .entries()
    .orderBy(entry => entry[1], 'desc')
    .map(entry => entry[0])
    .value();
  const merged = [...new Set([...user_positions, ...partner_positions])];
  if (merged.length > 0) {
    return merged.slice(0, 3);
  }
  return ['传教', '后入', '侧位'];
}

function getMethodFactor(type: string) {
  switch (type) {
    case '体外':
      return 0.7;
    case '安全套':
      return 0.4;
    case '药物':
      return 0.25;
    default:
      return 1.1;
  }
}

function mapAttackerColor(state: string) {
  switch (state) {
    case '全勃起':
      return '深红';
    case '半勃起':
      return '暖红';
    default:
      return '健康色';
  }
}

function mapReceiverColor(state: string) {
  switch (state) {
    case '红肿':
      return '绯红';
    case '干涩':
      return '浅粉';
    case '湿润':
      return '透红';
    case '敏感':
      return '潮红';
    case '触痛':
      return '暗红';
    case '瘀紫':
    case '破损':
      return '微紫';
    default:
      return '淡粉';
  }
}

function mapReceiverSize(lubrication?: string, overflow?: string) {
  if (overflow === '滴落' || lubrication === '泛滥') {
    return '扩张';
  }
  if (overflow === '明显' || lubrication === '充足') {
    return '放松';
  }
  if (lubrication === '微湿') {
    return '适中';
  }
  return '紧致';
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}
</script>

<style lang="scss" scoped>
.health-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header-card {
  border: 1px solid var(--sb-border);
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title {
  font-weight: 600;
  font-size: 1rem;
}

.header-sub {
  font-size: 0.8rem;
  color: var(--sb-muted);
}

.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.metric-card {
  border: 1px solid var(--sb-border);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.8rem;
}

.metric-card.wide {
  grid-column: span 2;
}

.metric-label {
  color: var(--sb-muted);
}

.metric-value {
  font-weight: 600;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-chip {
  border: 1px solid var(--sb-border);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.72rem;
}

.analysis-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.analysis-item {
  border: 1px solid var(--sb-border);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.analysis-name {
  font-weight: 600;
}

.analysis-value {
  font-size: 0.9rem;
}

.analysis-note {
  color: var(--sb-muted);
  font-size: 0.75rem;
}

.progress-bar {
  height: 6px;
  border-radius: 999px;
  background: var(--sb-border);
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  background: var(--sb-accent);
}

.muted {
  color: var(--sb-muted);
}
</style>
