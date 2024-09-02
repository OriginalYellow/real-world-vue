<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  details: Record<string, any> | null;
  loading: boolean;
}>();
</script>

<template>
  <div class="container">
    <h2>Item Details</h2>
    <div :class="{ 'loading-content': loading }">
      <div v-if="loading" class="spinner"></div>
      <div v-else v-for="(value, key) in details" :key="key" class="detail-item">
        <strong>{{ key }}:</strong> {{ value }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/styles.scss";

/* container styles */
.container {
  @include card-container;
  padding: 1.5rem;
  width: 400px;
}

h2 {
  @include blue-bottom-border;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}

/* item styles */
.detail-item {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: flex-start;
}

.detail-item strong {
  min-width: 100px;
  margin-right: 0.5rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
}

.detail-item:nth-child(even) {
  background-color: $alternate-list-background;
  border-radius: 4px;
}

/* spinner styles */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid $blue-highlight-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 20px;
}
</style>