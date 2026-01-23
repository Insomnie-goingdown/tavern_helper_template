<template>
  <div class="news-tab">
    <div class="ticker">
      <div class="ticker-track">
        <span v-for="(item, index) in headline_items" :key="`headline-${index}`" class="ticker-item">
          {{ item }}
        </span>
      </div>
    </div>

    <div class="banner">
      <div class="banner-title">{{ banner_title }}</div>
      <div class="banner-subtitle">{{ story_date }} · {{ current_location }}</div>
    </div>

    <div class="category-row">
      <span v-for="category in categories" :key="category" class="category-chip">{{ category }}</span>
    </div>

    <div class="news-list">
      <article v-for="(item, index) in news_items" :key="item.title" class="news-card">
        <div class="news-header">
          <span class="news-category">{{ item.category }}</span>
          <span class="news-time">{{ item.time }}</span>
        </div>
        <div class="news-title">{{ item.title }}</div>
        <div class="news-body">{{ item.body }}</div>

        <details class="comment-box">
          <summary>评论区 · {{ item.comments.length }}</summary>
          <div class="comment-list">
            <div v-for="(comment, cindex) in item.comments" :key="`comment-${index}-${cindex}`" class="comment-item">
              <div class="comment-meta">
                <span class="comment-user">{{ comment.user }}</span>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <div class="comment-text">{{ comment.text }}</div>
            </div>
          </div>
        </details>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from './store';

type NewsItem = {
  category: string;
  title: string;
  body: string;
  time: string;
  comments: { user: string; text: string; time: string }[];
};

const store = useDataStore();

const categories = ['快讯', '本地', '世界', '突发', '民生', '娱乐', '健康'];

const story_date = computed(() => store.data.世界系统?.全局时间?.日期 || '未知日期');
const story_time = computed(() => store.data.世界系统?.全局时间?.时间 || '00:00');
const current_location = computed(() => store.data.世界系统?.当前地点 || '未知地区');

const banner_title = computed(() => {
  const location = String(store.data.世界系统?.当前地点 || '世界');
  const name = location.replace(/(市|区|县|州|省)$/g, '') || '世界';
  return `${name}早报`;
});

const headline_items = computed(() => news_items.value.slice(0, 3).map(item => item.title));

const news_items = computed<NewsItem[]>(() => {
  const world = store.data.世界系统 ?? {};
  const band = store.data.乐队系统 ?? {};
  const weather = world.环境与新闻?.天气 || '天气多变';
  const local_news = world.环境与新闻?.本地新闻 || '本地暂无重大新闻';
  const entertainment = world.环境与新闻?.娱乐圈舆论 || '娱乐动态持续发酵';
  const stock = world.林氏财团?.林氏电子股价 ?? 0;
  const stock2 = world.林氏财团?.林氏建设股价 ?? 0;
  const public_view = world.公众舆论?.路人评价 || '舆论氛围暂时平稳';
  const fan_view = world.公众舆论?.粉丝态度 || '粉丝群体保持活跃';
  const event_name = Object.entries(store.data.事件记录 ?? {}).find(([, value]) => value)?.[0] || '暂无突发事件';

  const items = [
    {
      category: '本地',
      title: `${current_location.value}气象提醒升级`,
      body: normalizeText(`${local_news} 当前天气：${weather}。`),
      time: story_time.value,
    },
    {
      category: '娱乐',
      title: `巡演${band.巡演状态 || '进行中'}引发讨论`,
      body: normalizeText(`${entertainment} 团队凝聚力${band.团队凝聚力 ?? 0}。`),
      time: shiftTime(story_time.value, -20),
    },
    {
      category: '世界',
      title: `林氏财团股价波动引发关注`,
      body: normalizeText(`林氏电子${stock}、林氏建设${stock2}，资本面呈现谨慎态势。`),
      time: shiftTime(story_time.value, -45),
    },
    {
      category: '民生',
      title: `舆论温度计持续刷新`,
      body: normalizeText(`${public_view} ${fan_view}`),
      time: shiftTime(story_time.value, -60),
    },
    {
      category: '突发',
      title: `${event_name}进入监测清单`,
      body: normalizeText('内部关注事件进展，相关人员保持警觉，后续将持续追踪。'),
      time: shiftTime(story_time.value, -90),
    },
  ];

  return items.map((item, index) => ({
    ...item,
    comments: buildComments(item, index),
  }));
});

function buildComments(item: NewsItem, index: number) {
  const world = store.data.世界系统 ?? {};
  const band = store.data.乐队系统 ?? {};
  const pool = [
    { user: '路过网友', text: world.公众舆论?.路人评价 || '等后续跟进。' },
    { user: '嘉人后援会', text: world.公众舆论?.粉丝态度 || '保持关注。' },
    { user: '财经观察', text: `股价波动至${world.林氏财团?.林氏电子股价 ?? 0}，谨慎为上。` },
    { user: '舞台前线', text: `巡演${band.巡演状态 || '进行中'}，数据仍在刷新。` },
    { user: '夜班值守', text: '继续保持警觉，关注突发事件动态。' },
  ];

  const start = index % pool.length;
  const comments = [pool[start], pool[(start + 2) % pool.length]];
  return comments.map((comment, offset) => ({
    ...comment,
    time: shiftTime(story_time.value, -10 * (index + offset + 1)),
  }));
}

function normalizeText(text: string) {
  const clean = String(text || '').replace(/\s+/g, '');
  const min = 20;
  const max = 50;
  const filler = '后续仍在跟进，现场反馈持续更新，细节待证实。';
  const padded = clean.length < min ? `${clean}${filler.repeat(2)}` : clean;
  if (padded.length < min) {
    return padded.padEnd(min, '。');
  }
  if (padded.length > max) {
    return `${padded.slice(0, max - 1)}…`;
  }
  return padded;
}

function shiftTime(time: string, minutes: number) {
  const match = time.match(/(\d{1,2}):(\d{2})/);
  if (!match) {
    return time;
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const total = (hour * 60 + minute + minutes + 24 * 60) % (24 * 60);
  const nextHour = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const nextMinute = (total % 60).toString().padStart(2, '0');
  return `${nextHour}:${nextMinute}`;
}
</script>

<style lang="scss" scoped>
.news-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ticker {
  border: 1px solid var(--sb-border);
  border-radius: 999px;
  overflow: hidden;
  padding: 4px 8px;
}

.ticker-track {
  display: inline-flex;
  gap: 20px;
  animation: ticker 16s linear infinite;
  white-space: nowrap;
}

.ticker-item {
  font-size: 0.78rem;
  color: var(--sb-muted);
}

.banner {
  border: 1px solid var(--sb-border);
  border-radius: 14px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.banner-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.banner-subtitle {
  font-size: 0.8rem;
  color: var(--sb-muted);
}

.category-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.category-chip {
  border: 1px solid var(--sb-border);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.72rem;
  color: var(--sb-muted);
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-card {
  border: 1px solid var(--sb-border);
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.news-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--sb-muted);
}

.news-category {
  font-weight: 600;
}

.news-title {
  font-weight: 600;
  font-size: 0.95rem;
}

.news-body {
  font-size: 0.82rem;
  color: var(--sb-muted);
}

.comment-box {
  border-top: 1px dashed var(--sb-border);
  padding-top: 6px;
  font-size: 0.78rem;
  color: var(--sb-muted);
}

.comment-box summary {
  cursor: pointer;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
}

.comment-item {
  border: 1px solid var(--sb-border);
  border-radius: 10px;
  padding: 6px 8px;
  background: transparent;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--sb-muted);
}

.comment-user {
  font-weight: 600;
}

.comment-text {
  color: var(--sb-text);
  margin-top: 2px;
}

@keyframes ticker {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticker-track {
    animation: none;
  }
}
</style>
