<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import DataGrid from './components/DataGrid.vue';
import DetailsView from './components/DetailsView.vue';
import { fetchGridData, fetchGridItemDetails } from './services/apiService';

const gridData = ref<{ key: string; type: string; label: string; }[]>([]);
const gridColumns = ['key', 'type', 'label'];
const selectedKeys = ref<Set<string>>(new Set());
const selectedItemDetails = ref<Record<string, any> | null>(null);
const filterKey = ref('');

onMounted(async () => {
  gridData.value = await fetchGridData();
});

watch(selectedKeys, async (newSelectedKeys) => {
  if (newSelectedKeys.size === 1) {
    const selectedKey = Array.from(newSelectedKeys)[0];
    selectedItemDetails.value = await fetchGridItemDetails(selectedKey);
  } else {
    selectedItemDetails.value = null;
  }
});
</script>

<template>
  <div class="app-container">
    <div class="grid-container">
      <h1>Welcome to Our Vue Application</h1>
      <input v-model="filterKey" placeholder="Filter rows" class="filter-input" />
      <DataGrid 
        v-model:selectedKeys="selectedKeys" 
        :data="gridData" 
        :columns="gridColumns" 
        :filterKey="filterKey"
      />
    </div>
    <DetailsView v-if="selectedItemDetails" :details="selectedItemDetails" />
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  max-width: 2000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.grid-container {
  flex: 1;
  margin-right: 2rem;
  width: 100%; // Added to ensure full width

  h1 {
    color: #007bff;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .filter-input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
}
</style>
