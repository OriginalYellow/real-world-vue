<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import DataGrid from './dataGrid/DataGrid.vue';
import DetailsView from './DetailsView.vue';
import { fetchGridData, fetchGridItemDetails } from '../services/apiService';

const gridData = ref<{ key: string; type: string; label: string; }[]>([]);
const selectedKeys = ref<Set<string>>(new Set());
const selectedItemDetails = ref<Record<string, any> | null>(null);
const filterKey = ref('');
const loading = ref(false);

// column names are hardcoded but the component can handle anything:
const gridColumns = ['key', 'type', 'label'];

onMounted(async () => {
  gridData.value = await fetchGridData();
});

// when there is only one item selected, fetch the details
watch(selectedKeys, async (newSelectedKeys) => {
  if (newSelectedKeys.size === 1) {
    loading.value = true;
    const selectedKey = Array.from(newSelectedKeys)[0];
    selectedItemDetails.value = await fetchGridItemDetails(selectedKey);
    loading.value = false;
  } else {
    selectedItemDetails.value = null;
  }
});
</script>

<template>
  <div class="app-container">
    <h1>All of the Latest Deals</h1>
    <div class="app-body">
      <div class="grid-container">
        <input v-model="filterKey" placeholder="Filter rows" class="filter-input" />
        <DataGrid 
          v-model:selectedKeys="selectedKeys" 
          :data="gridData" 
          :columns="gridColumns" 
          :filterKey="filterKey"
        />
      </div>
      <DetailsView v-if="selectedItemDetails || loading" :details="selectedItemDetails" :loading="loading" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  width: 75vw;
  margin: 0 auto;
  padding: 2rem;

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: 600;
  }
}

.app-body {
  display: flex;
}

.grid-container {
  margin-right: 2rem;
  width: 100%;

  .filter-input {
    width: 250px;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
}
</style>