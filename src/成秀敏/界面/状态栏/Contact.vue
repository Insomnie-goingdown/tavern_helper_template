<template>
  <div class="contact-tab">
    <div class="contact-list">
      <div v-for="contact in props.contacts" :key="contact.name" class="contact-card">
        <div class="contact-header">
          <div class="contact-name">{{ contact.name }}</div>
          <span class="contact-tag">{{ contact.tag }}</span>
        </div>
        <div v-if="contact.relation" class="contact-relation">关系：{{ contact.relation }}</div>
        <div class="contact-meta">
          <span v-if="contact.status">状态：{{ contact.status }}</span>
          <span v-if="contact.score !== undefined">表现分 {{ contact.score }}</span>
        </div>
        <div v-if="contact.summary" class="contact-summary">{{ contact.summary }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type ContactCard = {
  name: string;
  tag: string;
  relation?: string;
  summary?: string;
  score?: number;
  status?: string;
};

const props = defineProps<{
  contacts: ContactCard[];
}>();
</script>

<style lang="scss" scoped>
.contact-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.contact-card {
  border: 1px solid var(--sb-border);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.8rem;
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.contact-name {
  font-weight: 600;
}

.contact-tag {
  border: 1px solid var(--sb-border);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.7rem;
  color: var(--sb-muted);
}

.contact-relation {
  color: var(--sb-muted);
}

.contact-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: var(--sb-muted);
}

.contact-summary {
  font-size: 0.75rem;
  color: var(--sb-text);
}
</style>
