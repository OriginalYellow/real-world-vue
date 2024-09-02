<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  details: Record<string, any> | null;
  loading: boolean;
}>();
</script>

<template>
  <div class="details-view">
    <h2>Item Details</h2>
    <div :class="{ 'loading-content': loading }">
      <div v-if="loading" class="spinner"></div>
      <div v-else v-for="(value, key) in details" :key="key" class="detail-item">
        <strong>{{ key }}:</strong> {{ value }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-view {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  width: 400px;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.detail-item {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: flex-start;
}

.detail-item strong {
  min-width: 100px;
  margin-right: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
}

.detail-item:nth-child(even) {
  background-color: #f8f9fa;
  border-radius: 4px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
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