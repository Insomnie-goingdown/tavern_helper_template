<template>
  <div class="news-tab">
    <!-- 滚动播报 -->
    <div class="news-ticker">
      <div class="ticker-content" :style="{ transform: `translateX(${tickerOffset}px)` }">
        <span v-for="(item, index) in tickerItems" :key="index" class="ticker-item"> {{ item }} · </span>
      </div>
    </div>

    <!-- Banner -->
    <div class="news-banner">
      <h2>{{ newspaperTitle }}</h2>
      <p class="banner-date">{{ currentDate }}</p>
    </div>

    <!-- 新闻分类标签 -->
    <div class="news-categories">
      <button
        v-for="category in categories"
        :key="category"
        class="category-tag"
        :class="{ active: selectedCategory === category }"
        @click="selectedCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <!-- 新闻列表 -->
    <div class="news-list">
      <div v-for="(news, index) in filteredNews" :key="index" class="news-item" @click="expandNews(index)">
        <div class="news-header">
          <span class="news-category-badge">{{ news.category }}</span>
          <span class="news-time">{{ news.time }}</span>
        </div>
        <h3 class="news-title">{{ news.title }}</h3>
        <p class="news-content" :class="{ expanded: expandedNews.has(index) }">
          {{ news.content }}
        </p>

        <!-- 评论区 -->
        <div v-if="expandedNews.has(index)" class="news-comments">
          <div v-for="(comment, cIndex) in news.comments" :key="cIndex" class="comment-item">
            <div class="comment-header">
              <span class="comment-user">{{ comment.user }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const tickerItems = ref<string[]>([]);
const tickerOffset = ref(0);
const newspaperTitle = ref('城市早报');
const currentDate = ref('');
const categories = ['快讯', '本地', '世界', '突发', '民生', '娱乐', '健康'];
const selectedCategory = ref('快讯');
const expandedNews = ref(new Set<number>());

interface NewsItem {
  category: string;
  title: string;
  content: string;
  time: string;
  comments: Array<{
    user: string;
    content: string;
    time: string;
  }>;
}

const newsList = ref<NewsItem[]>([]);

const filteredNews = computed(() => {
  if (selectedCategory.value === '快讯') {
    return newsList.value;
  }
  return newsList.value.filter(news => news.category === selectedCategory.value);
});

function expandNews(index: number) {
  if (expandedNews.value.has(index)) {
    expandedNews.value.delete(index);
  } else {
    expandedNews.value.add(index);
  }
}

function generateNewsFromWorldbook() {
  const variables = getVariables({ type: 'message', message_id: getCurrentMessageId() });

  // 从 MVU 变量中尝试获取世界信息（优先 stat_data.世界）
  const world = variables?.stat_data?.世界 || variables?.世界 || {};
  const place: string = world.当前地点 || variables['世界观名称'] || variables['world_name'] || '未知城市';

  // 根据时间生成“早报/夜讯”标题
  const nowString: string = world.当前时间 || '';
  let hour = new Date().getHours();
  const timeMatch = nowString.match(/(\d{2}):(\d{2})/);
  if (timeMatch) {
    hour = Number(timeMatch[1]);
  }
  const suffix = hour >= 18 ? '夜讯' : '早报';
  newspaperTitle.value = `${place}${suffix}`;

  // 生成滚动播报
  tickerItems.value = [
    `${place}今日天气适宜，出行良好`,
    `本地交通运行平稳，暂无重大异常`,
    `公共服务高效稳定，市民生活有序`,
  ];

  // 生成示例新闻（20～50字）
  newsList.value = [
    {
      category: '快讯',
      title: `${place}今日简讯`,
      content: '城市运转正常，社区活动井然开展，重点民生项目推进中，整体秩序稳定向好。',
      time: '10:30',
      comments: [
        { user: '市民A', content: '感觉生活越来越方便了。', time: '10:35' },
        { user: '市民B', content: '希望公共交通再加密一点。', time: '10:40' },
      ],
    },
    {
      category: '本地',
      title: '社区志愿服务周启动',
      content: '多项便民服务同步开展，居民反响积极，参与度提高，邻里关系更加融洽。',
      time: '09:15',
      comments: [{ user: '居民C', content: '活动安排很贴心。', time: '09:20' }],
    },
    {
      category: '世界',
      title: '国际合作稳步推进',
      content: '多国达成联合倡议，持续加强在民生与科技方面的交流合作，前景被普遍看好。',
      time: '08:00',
      comments: [],
    },
  ];
}

let tickerInterval: ReturnType<typeof setInterval> | null = null;

function updateTicker() {
  if (tickerItems.value.length > 0) {
    tickerOffset.value -= 1;
    const totalWidth = tickerItems.value.length * 300;
    if (Math.abs(tickerOffset.value) >= totalWidth) {
      tickerOffset.value = 0;
    }
  }
}

onMounted(() => {
  const now = new Date();
  currentDate.value = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

  generateNewsFromWorldbook();

  tickerInterval = setInterval(updateTicker, 50);
});

onUnmounted(() => {
  if (tickerInterval) {
    clearInterval(tickerInterval);
  }
});
</script>

<style lang="scss" scoped>
.news-tab {
  padding: 0;
  background: #f5f5f5;
}

.news-ticker {
  background: #ff6b6b;
  color: #fff;
  padding: 8px 0;
  overflow: hidden;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
}

.ticker-content {
  display: inline-block;
  transition: transform 0.05s linear;
}

.ticker-item {
  display: inline-block;
  margin-right: 20px;
}

.news-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 20px;
  text-align: center;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }

  .banner-date {
    margin: 8px 0 0 0;
    font-size: 14px;
    opacity: 0.9;
  }
}

.news-categories {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #fff;
  overflow-x: auto;
  border-bottom: 1px solid #e0e0e0;
}

.category-tag {
  padding: 6px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: #fff;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    background: #667eea;
    color: #fff;
    border-color: #667eea;
  }
}

.news-list {
  padding: 12px;
}

.news-item {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.news-category-badge {
  background: #667eea;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.news-time {
  font-size: 12px;
  color: #999;
}

.news-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.news-content {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &.expanded {
    display: block;
    -webkit-line-clamp: unset;
    line-clamp: unset;
  }
}

.news-comments {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.comment-item {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.comment-user {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
}

.comment-time {
  font-size: 11px;
  color: #999;
}

.comment-content {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}
</style>
