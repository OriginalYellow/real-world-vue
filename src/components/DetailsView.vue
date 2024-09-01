<script setup lang="ts">
defineProps<{
  details: Record<string, any>
}>();
</script>

<template>
  <div class="details-view">
    <h2>Item Details</h2>
    <div v-for="(value, key) in details" :key="key" class="detail-item">
      <strong>{{ key }}:</strong> {{ value }}
    </div>
  </div>
</template>

<style scoped>
.details-view {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 1rem;
  width: 300px;
  color: #333; /* Added dark text color */
}

.detail-item {
  margin-bottom: 0.5rem;
}
</style>