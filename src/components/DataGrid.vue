<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useVirtualList } from '@vueuse/core'

interface DataItem {
  key: any;
  [key: string]: any;
}

interface DataGridProps {
  data: Array<DataItem>;
  columns: Array<string>;
  filterKey?: string;
}

const props = defineProps<DataGridProps>();

const sortKey = ref('')
// this is going to create a new object with the keys equal to the columns and the value of 1
const sortOrders = ref(
  props.columns.reduce<Record<string, number>>((o, key) => {
    o[key] = 1;
    return o;
  }, {})
)

const filteredData = computed(() => {
  let { data, filterKey } = props
  // this will check if any values of a row contains the filterKey and filter for them
  if (filterKey && typeof filterKey === 'string') {
    filterKey = filterKey.toLowerCase()
    data = data.filter((row) => {
      return Object.keys(row).some((key) => {
        return String(row[key]).toLowerCase().indexOf(filterKey as string) > -1
      })
    })
  }
  // this will sort the data by the sortKey
  const key = sortKey.value
  if (key) {
    const order = sortOrders.value[key]
    data = data.slice().sort((a, b) => {
      a = a[key]
      b = b[key]
      return (a === b ? 0 : a > b ? 1 : -1) * order
    })
  }
  return data
})

const { list, containerProps, wrapperProps } = useVirtualList(
  filteredData,
  {
    itemHeight: 40, // Adjust this value based on your actual row height
  }
)

// Replace the computed selectedKeys with a simple ref
const selectedKeys = defineModel<Set<string>>('selectedKeys', { default: () => new Set() });

function sortBy(key: string) {
  sortKey.value = key
  sortOrders.value[key] *= -1
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function isSelected(key: string): boolean {
  return selectedKeys.value.has(key);
}

function toggleSelection(key: string) {
  const newSet = new Set(selectedKeys.value);
  if (newSet.has(key)) {
    newSet.delete(key);
  } else {
    newSet.add(key);
  }
  selectedKeys.value = newSet;
}

</script>

<template>
  <div v-if="filteredData.length" class="data-grid">
    <div class="header">
      <div v-for="key in columns" 
           @click="sortBy(key)" 
           :class="['column', { active: sortKey == key }]">
        {{ capitalize(key) }}
        <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"></span>
      </div>
    </div>
    <div v-bind="containerProps" class="virtual-list-container">
      <div v-bind="wrapperProps">
        <div v-for="{ data: entry } in list" 
             :key="entry.key" 
             class="row"
             :class="{ 'selected-row': isSelected(entry.key) }"
             @click="toggleSelection(entry.key)">
          <div v-for="key in columns" class="cell">
            {{entry[key]}}
          </div>
        </div>
      </div>
    </div>
  </div>
  <p v-else>No matches found.</p>
</template>

<style>
.data-grid {
  min-width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.header {
  display: flex;
  background-color: #2c3e50;
  border-bottom: 2px solid #3498db;
}

.column {
  flex: 1;
  color: #fff;
  cursor: pointer;
  user-select: none;
  padding: 1rem;
  min-width: 120px;
  font-weight: 600;
}

.row {
  display: flex;
  cursor: pointer;
}

.cell {
  flex: 1;
  padding: 0.75rem 1rem;
  min-width: 120px;
}

.row:nth-child(even) {
  background-color: #f8f9fa;
}

.column.active {
  font-weight: bold;
  border-bottom: 2px solid #3498db;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.8;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}

.virtual-list-container {
  height: 400px;
  overflow-y: auto;
}

.selected-row {
  background-color: #e1f0fa !important;
}

.selected-row .cell {
  background-color: transparent;
}
</style>