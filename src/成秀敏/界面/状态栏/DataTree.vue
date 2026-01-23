<template>
  <ul class="tree">
    <li v-for="([key, value], index) in entries" :key="`${key}-${index}`" class="tree-item">
      <div class="row">
        <span class="key">{{ key }}</span>
        <span v-if="isPrimitive(value)" class="value">{{ formatValue(value) }}</span>
      </div>

      <div v-if="Array.isArray(value)" class="array-list">
        <span v-if="value.length === 0" class="muted">空</span>
        <span v-for="(item, idx) in value" :key="`${key}-item-${idx}`" class="chip">
          {{ formatValue(item) }}
        </span>
      </div>

      <DataTree v-else-if="isRecord(value)" :data="asRecord(value)" />
    </li>
  </ul>
</template>

<script setup lang="ts">
defineOptions({ name: 'DataTree' });

const props = defineProps<{
  data: Record<string, unknown>;
}>();

const entries = computed(() => Object.entries(props.data ?? {}));

function isRecord(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isPrimitive(value: unknown) {
  return !Array.isArray(value) && !isRecord(value);
}

function asRecord(value: unknown) {
  return value as Record<string, unknown>;
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  if (typeof value === 'boolean') {
    return value ? '是' : '否';
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : '—';
  }
  return String(value);
}
</script>

<style lang="scss" scoped>
.tree {
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tree-item {
  border-left: 1px dashed var(--sb-border);
  padding-left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: baseline;
  font-size: 0.8rem;
}

.key {
  font-weight: 600;
}

.value {
  color: var(--sb-muted);
}

.array-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-left: 6px;
}

.chip {
  border: 1px solid var(--sb-border);
  border-radius: 999px;
  padding: 2px 6px;
  font-size: 0.72rem;
}

.muted {
  color: var(--sb-muted);
  font-size: 0.72rem;
}
</style>
