<template>
  <div class="status-shell">
    <div class="status-bar" role="button" tabindex="0" @click="toggleExpanded" @keydown.enter="toggleExpanded">
      <div class="status-left">
        <div class="time">{{ story_time }}</div>
        <div class="date">{{ story_date }}</div>
      </div>

      <div class="status-middle">
        <div class="icon-group">
          <span class="icon-label">信号</span>
          <div class="icon-bars">
            <span v-for="n in 4" :key="`signal-${n}`" class="bar" :class="{ active: n <= signal_level }"></span>
          </div>
        </div>
        <div class="icon-group">
          <span class="icon-label">WiFi</span>
          <div class="icon-bars">
            <span v-for="n in 4" :key="`wifi-${n}`" class="bar" :class="{ active: n <= wifi_level }"></span>
          </div>
        </div>
        <div class="icon-group battery">
          <span class="icon-label">电池</span>
          <div class="battery-shell">
            <span class="battery-fill" :style="{ width: `${battery_level}%` }"></span>
          </div>
          <span class="battery-text">{{ battery_level }}%</span>
        </div>
      </div>

      <div class="status-right">
        <div class="notice-header">未读 {{ notifications.length }}</div>
        <div class="notice-list">
          <div v-for="item in notifications.slice(0, 3)" :key="item.name" class="notice-item">
            <span class="notice-name">{{ item.name }}</span>
            <span class="notice-snippet">{{ item.snippet }}</span>
          </div>
          <div v-if="notifications.length === 0" class="notice-item muted">暂无新消息</div>
        </div>
      </div>

      <button class="toggle-button" type="button" @click.stop="toggleExpanded">
        {{ expanded ? '收起' : '展开' }}
      </button>
    </div>

    <div v-show="expanded" class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">状态面板</div>
          <div class="panel-subtitle">{{ current_location }} · {{ current_scene }}</div>
        </div>
        <button class="ghost-button" type="button" @click="expanded = false">关闭</button>
      </div>

      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-button"
          :class="{ active: active_tab === tab.id, primary: tab.primary }"
          type="button"
          @click="active_tab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-content">
        <OverviewTab
          v-if="active_tab === 'overview'"
          :world-data="world_data"
          :role-data="role_data"
          :nsfw-data="nsfw_data"
        />
        <NewsTab v-else-if="active_tab === 'news'" />
        <Contact v-else-if="active_tab === 'contacts'" :contacts="contact_cards" />
        <HealthTab v-else-if="active_tab === 'health'" />

        <div v-else-if="active_tab === 'bank'" class="panel-section">
          <div class="section-title">银行与资源</div>
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-label">个人资产</div>
              <div class="metric-value">{{ format_money(bank_data.个人资产) }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">资源调动权限</div>
              <div class="metric-value">{{ bank_data.资源调动权限 }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">静室指挥权</div>
              <div class="metric-value">{{ bank_data.静室指挥权 ? '可用' : '不可用' }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">林泰成信任度</div>
              <div class="metric-value">{{ bank_data.林泰成信任度 }}</div>
            </div>
          </div>
        </div>

        <div v-else-if="active_tab === 'intranet'" class="panel-section">
          <div class="section-title">林氏内部网</div>
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-label">林氏电子股价</div>
              <div class="metric-value">{{ intranet_data.林氏电子股价 }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">林氏建设股价</div>
              <div class="metric-value">{{ intranet_data.林氏建设股价 }}</div>
            </div>
            <div class="metric-card wide">
              <div class="metric-label">路人评价</div>
              <div class="metric-value">{{ intranet_data.路人评价 }}</div>
            </div>
            <div class="metric-card wide">
              <div class="metric-label">粉丝态度</div>
              <div class="metric-value">{{ intranet_data.粉丝态度 }}</div>
            </div>
          </div>
        </div>

        <div v-else-if="active_tab === 'social'" class="panel-section">
          <div class="section-title">社交媒体</div>
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-label">团队凝聚力</div>
              <div class="metric-value">{{ social_data.团队凝聚力 }}</div>
              <div class="progress-bar">
                <span :style="{ width: `${social_data.团队凝聚力}%` }"></span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-label">专辑制作进度</div>
              <div class="metric-value">{{ social_data.专辑制作进度 }}%</div>
              <div class="progress-bar">
                <span :style="{ width: `${social_data.专辑制作进度}%` }"></span>
              </div>
            </div>
            <div class="metric-card wide">
              <div class="metric-label">CP热度</div>
              <div class="tag-list">
                <span v-for="cp in social_data.CP热度排行" :key="cp.name" class="tag-chip">
                  {{ cp.name }} {{ cp.热度值 }}
                </span>
                <span v-if="social_data.CP热度排行.length === 0" class="muted">暂无数据</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="panel-section">
          <div class="section-title">功能筹备中</div>
          <div class="muted">该栏目将在下一步完善。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import Contact from './Contact.vue';
import HealthTab from './HealthTab.vue';
import NewsTab from './NewsTab.vue';
import OverviewTab from './OverviewTab.vue';
import { useDataStore } from './store';

type ContactCard = {
  name: string;
  tag: string;
  relation?: string;
  summary?: string;
  score?: number;
  status?: string;
};

const store = useDataStore();
const expanded = ref(false);
const active_tab = ref('overview');

const tabs = [
  { id: 'overview', label: '主界面' },
  { id: 'news', label: '新闻', primary: true },
  { id: 'contacts', label: '联系人', primary: true },
  { id: 'health', label: '健康', primary: true },
  { id: 'bank', label: '银行' },
  { id: 'intranet', label: '林氏内网' },
  { id: 'social', label: '社交' },
];

const story_date = computed(() => store.data.世界系统?.全局时间?.日期 || '未知日期');
const story_time = computed(() => store.data.世界系统?.全局时间?.时间 || '未知时间');
const current_location = computed(() => store.data.世界系统?.当前地点 || '未知地点');
const current_scene = computed(() => store.data.世界系统?.当前场景 || '未知场景');

const signal_level = computed(() => scaleToBars(store.data.乐队系统?.团队凝聚力 ?? 0));
const wifi_level = computed(() => scaleToBars(store.data.乐队系统?.专辑制作进度 ?? 0));
const battery_level = computed(() => clampNumber(store.data.核心角色?.['<user>']?.核心状态?.身体健康 ?? 0, 0, 100));

const world_data = computed(() => ({
  世界系统: store.data.世界系统,
  事件记录: store.data.事件记录,
  乐队系统: store.data.乐队系统,
}));

const role_data = computed(() => {
  const core = _.mapValues(store.data.核心角色 ?? {}, role => _.omit(role as Record<string, unknown>, 'NSFW档案'));
  return {
    核心角色: core,
    重要NPC: store.data.重要NPC,
  };
});

const nsfw_data = computed(() => {
  const core = store.data.核心角色 ?? {};
  const nsfw_core: Record<string, unknown> = {};
  _.forEach(core, (role, name) => {
    const data = (role as { NSFW档案?: Record<string, unknown> })?.NSFW档案;
    if (data) {
      nsfw_core[name] = data;
    }
  });
  return { 核心角色: nsfw_core };
});

const contact_cards = computed<ContactCard[]>(() => {
  const result: ContactCard[] = [];
  const core_roles = store.data.核心角色 ?? {};
  _.forEach(core_roles, (role, name) => {
    if (name === '<user>') {
      return;
    }
    const typed = role as Record<string, any>;
    result.push({
      name,
      tag: '核心角色',
      relation: String(typed?.关系 ?? typed?.关系值?.['对<user>'] ?? ''),
      summary: buildCoreSummary(typed),
      score: Number(typed?.个人表现分 ?? 0),
      status: deriveFatigueStatus(Number(typed?.疲劳度 ?? 0)),
    });
  });

  const npc_roles = store.data.重要NPC ?? {};
  _.forEach(npc_roles, (role, name) => {
    const typed = role as Record<string, any>;
    result.push({
      name,
      tag: '重要NPC',
      relation: String(typed?.关系 ?? typed?.关系值?.['对<user>'] ?? ''),
      summary: buildNpcSummary(typed),
      score: Number(typed?.个人表现分 ?? 0),
      status: typed?.介入状态 === true ? '介入中' : '观察中',
    });
  });

  return result;
});

const notifications = computed(() =>
  contact_cards.value.map(contact => ({
    name: contact.name,
    snippet: truncateText(contact.relation || contact.summary || current_scene.value || '等待回复中', 18),
  })),
);

const bank_data = computed(() => ({
  个人资产: store.data.核心角色?.['<user>']?.资源与权力?.个人资产 ?? 0,
  资源调动权限: store.data.核心角色?.['<user>']?.资源与权力?.资源调动权限 ?? '未知',
  静室指挥权: store.data.核心角色?.['<user>']?.资源与权力?.静室指挥权 ?? false,
  林泰成信任度: store.data.核心角色?.['<user>']?.资源与权力?.林泰成信任度 ?? 0,
}));

const intranet_data = computed(() => ({
  林氏电子股价: store.data.世界系统?.林氏财团?.林氏电子股价 ?? 0,
  林氏建设股价: store.data.世界系统?.林氏财团?.林氏建设股价 ?? 0,
  路人评价: store.data.世界系统?.公众舆论?.路人评价 ?? '',
  粉丝态度: store.data.世界系统?.公众舆论?.粉丝态度 ?? '',
}));

const social_data = computed(() => {
  const cp_heat = store.data.乐队系统?.CP热度系统 ?? {};
  const sorted_cp = _(cp_heat)
    .entries()
    .map(([name, value]) => ({
      name,
      热度值: Number((value as { 热度值?: number })?.热度值 ?? 0),
    }))
    .orderBy(['热度值'], ['desc'])
    .take(5)
    .value();

  return {
    团队凝聚力: clampNumber(store.data.乐队系统?.团队凝聚力 ?? 0, 0, 100),
    专辑制作进度: clampNumber(store.data.乐队系统?.专辑制作进度 ?? 0, 0, 100),
    CP热度排行: sorted_cp,
  };
});

function toggleExpanded() {
  expanded.value = !expanded.value;
}

function scaleToBars(value: number) {
  return clampNumber(Math.round(value / 25), 0, 4);
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function truncateText(text: string, limit: number) {
  if (!text) {
    return '...';
  }
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
}

function format_money(value: number) {
  const numeric = Number.isFinite(value) ? value : 0;
  return numeric.toLocaleString('zh-CN');
}

function buildCoreSummary(role: Record<string, any>) {
  const mask = role?.面具稳定度;
  const hate = role?.恨意表现值;
  if (Number.isFinite(Number(mask))) {
    return `面具稳定度 ${mask}`;
  }
  if (Number.isFinite(Number(hate))) {
    return `恨意表现值 ${hate}`;
  }
  return '状态待更新';
}

function buildNpcSummary(role: Record<string, any>) {
  if (role?.成长轨迹?.理论知识 !== undefined) {
    return `成长轨迹 ${role.成长轨迹.理论知识} / ${role.成长轨迹.实践进度}`;
  }
  if (role?.与允儿的关系?.关系状态) {
    return `关系状态 ${role.与允儿的关系.关系状态}`;
  }
  return '状态待更新';
}

function deriveFatigueStatus(value: number) {
  if (value >= 70) {
    return '疲惫';
  }
  if (value >= 40) {
    return '微倦';
  }
  return '清醒';
}
</script>

<style lang="scss" scoped>
.status-shell {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--sb-text);
  font-family: var(--sb-font);
}

.status-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  border: 1px solid var(--sb-border);
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
}

.status-left {
  min-width: 120px;
}

.time {
  font-size: 1.2rem;
  font-weight: 600;
}

.date {
  color: var(--sb-muted);
  font-size: 0.85rem;
}

.status-middle {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
}

.icon-group {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--sb-border);
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
}

.icon-group.battery {
  gap: 8px;
}

.icon-label {
  color: var(--sb-muted);
}

.icon-bars {
  display: flex;
  gap: 3px;
}

.bar {
  width: 5px;
  height: 10px;
  border-radius: 2px;
  background: var(--sb-border);
}

.bar.active {
  background: var(--sb-accent);
}

.battery-shell {
  width: 40px;
  height: 8px;
  border: 1px solid var(--sb-border);
  border-radius: 999px;
  overflow: hidden;
}

.battery-fill {
  display: block;
  height: 100%;
  background: var(--sb-accent);
}

.battery-text {
  font-size: 0.75rem;
  color: var(--sb-muted);
}

.status-right {
  min-width: 160px;
}

.notice-header {
  font-size: 0.78rem;
  color: var(--sb-muted);
  margin-bottom: 4px;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notice-item {
  display: flex;
  gap: 6px;
  font-size: 0.78rem;
  align-items: baseline;
}

.notice-name {
  font-weight: 600;
}

.notice-snippet {
  color: var(--sb-muted);
}

.toggle-button {
  margin-left: auto;
  border: 1px solid var(--sb-border);
  border-radius: 999px;
  padding: 4px 12px;
  background: transparent;
  font-size: 0.75rem;
  color: var(--sb-muted);
}

.panel {
  border: 1px solid var(--sb-border);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
}

.panel-subtitle {
  font-size: 0.82rem;
  color: var(--sb-muted);
}

.ghost-button {
  border: 1px solid var(--sb-border);
  border-radius: 999px;
  padding: 4px 10px;
  background: transparent;
  font-size: 0.75rem;
  color: var(--sb-muted);
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tab-button {
  border: 1px solid var(--sb-border);
  border-radius: 999px;
  padding: 4px 12px;
  background: transparent;
  font-size: 0.8rem;
  color: var(--sb-muted);
}

.tab-button.primary {
  color: var(--sb-accent);
  border-color: var(--sb-accent);
}

.tab-button.active {
  background: var(--sb-accent);
  color: #fff;
  border-color: var(--sb-accent);
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-weight: 600;
  font-size: 0.9rem;
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

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-chip {
  border: 1px solid var(--sb-border);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.75rem;
}

.muted {
  color: var(--sb-muted);
}
</style>
