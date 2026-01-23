<template>
  <div class="overview">
    <details open class="overview-section">
      <summary class="section-title">世界</summary>
      <DataTree :data="props.worldData" />
    </details>

    <details open class="overview-section">
      <summary class="section-title">角色状态</summary>
      <DataTree :data="props.roleData" />
    </details>

    <details open class="overview-section">
      <summary class="section-title">NSFW</summary>
      <DataTree :data="props.nsfwData" />
    </details>
  </div>
</template>

<script setup lang="ts">
import DataTree from './DataTree.vue';

const props = defineProps<{
  worldData: Record<string, unknown>;
  roleData: Record<string, unknown>;
  nsfwData: Record<string, unknown>;
}>();
</script>

<style lang="scss" scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.overview-section {
  border: 1px solid var(--sb-border);
  border-radius: 12px;
  padding: 10px;
}

.section-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 8px;
  cursor: pointer;
}
</style>
