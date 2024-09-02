<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useVirtualList } from '@vueuse/core'
import type { DataGridProps, DataItem } from './dataGrid.types';
import { capitalize } from '@/utils/stringHelpers';

const props = defineProps<DataGridProps>();

// ===== Refs, v-models, and computed properties =====
const sortKey = ref('')
const selectedKeys = defineModel<Set<string>>('selectedKeys', { default: () => new Set() });

// initialize sortOrders a new object with the keys from the column names an
// give each the value of 1
const sortOrders = ref(
  props.columns.reduce<Record<string, number>>((o, key) => {
    o[key] = 1;
    return o;
  }, {})
)

const filteredSortedData = computed(() => {
  let { data, filterKey } = props
  // this will check if any values of a row contains the filterKey and filter
  // for them
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

// ===== Virtual list =====
const { list, containerProps, wrapperProps } = useVirtualList(
  filteredSortedData,
  {
    itemHeight: 40,
  }
)

// ===== Methods =====
function sortBy(key: string) {
  sortKey.value = key
  sortOrders.value[key] *= -1
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
  <div v-if="filteredSortedData.length" class="container">
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
             :class="{ row: true, 'selected-row': isSelected(entry.key) }"
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

<style scoped lang="scss">
@import "@/styles/styles.scss";

/* container styles */
.container {
  @include card-container;
  min-width: 100%;
  overflow: hidden;
}

/* header styles */
.header {
  @include blue-bottom-border;
  display: flex;
  background-color: #2c3e50;
}

/* table styles */
.column {
  flex: 1;
  color: #fff;
  cursor: pointer;
  user-select: none;
  padding: 1rem;
  min-width: 120px;
  font-weight: 600;

  &.active {
    @include blue-bottom-border;
    font-weight: bold;
  }
}

.row {
  display: flex;
  cursor: pointer;

  &:nth-child(even) {
    background-color: $alternate-list-background;
  }

  &.selected-row {
    background-color: #e1f0fa;

    .cell {
      background-color: transparent;
    }
  }
}

.cell {
  flex: 1;
  padding: 0.75rem 1rem;
  min-width: 120px;
}

/* arrow styles */
.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.8;

  $arrow-side-border: 4px solid transparent;
  $arrow-top-border: 4px solid #fff;

  &.asc {
    border-left: $arrow-side-border;
    border-right: $arrow-side-border;
    border-bottom: $arrow-top-border;
  }

  &.dsc {
    border-left: $arrow-side-border;
    border-right: $arrow-side-border;
    border-top: $arrow-top-border;
  }
}

/* virtual list container styles */
.virtual-list-container {
  height: 400px;
  overflow-y: auto;
}
</style>