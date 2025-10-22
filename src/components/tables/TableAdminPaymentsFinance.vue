<template>
  <v-data-table
    :headers="computedHeaders"
    :items="items"
    :loading="isLoading"
    :items-per-page="itemsPerPage"
    class="custom-table"
    hover
    height="70vh"
    fixed-header
    hide-default-footer
  >
    <template #loading>
      <v-progress-circular indeterminate color="rgb(169, 55, 244)" />
    </template>
    <template #[`item.amount`]="{ item }">
      <div>{{ formatCompactUSD(item.amount) }}</div>
    </template>
    <template #[`item.actions`]="{ item }">
      <div class="table-checkbox">
        <v-tooltip text="Выплатить" location="bottom">
          <template #activator="{ props }">
            <v-checkbox
              v-model="selectedIds"
              :value="item.id"
              v-bind="props"
              color="rgb(169, 55, 244)"
              hide-details
            />
          </template>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'

import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import { formatCompactUSD } from '@/utils/formatNumbers.ts'

const props = defineProps({
  headers: {
    type: Array as PropType<ITableHeaders[]>,
    default: () => []
  },
  items: {
    type: Array as PropType<IUserInfoData[]>,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  itemsPerPage: {
    type: [Number, String],
    default: 10
  },
  selectedIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:selectedIds'])

const headersData = ref(props.headers)

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const selectedIds = computed({
  get() {
    return props.selectedIds
  },
  set(val) {
    emit('update:selectedIds', val)
  }
})
</script>
