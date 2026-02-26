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
    <template #[`item.link`]="{ item }">
      <a :href="item.link" target="_blank" class="custom-table-ref">
        <span> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
      </a>
    </template>
    <template #[`item.wallet`]="{ item }">
      <div>{{ item?.wallet?.address }}</div>
    </template>
    <template #[`item.publication`]="{ item }">
      <div class="flex flex-col gap-1">
        <div v-for="pub in item.publication" :key="pub.id">
          ID {{ pub.id }} —
          {{ pub.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
        </div>
      </div>
    </template>
    <template #[`item.amount`]="{ item }">
      <div>{{ formatCompactUSD(item.amount) }}</div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import type { IAdminFinishedFinanceItem, ITableHeaders } from '@/shared/config/types/app-model'

interface Props {
  headers: ITableHeaders[]
  items: IAdminFinishedFinanceItem[]
  isLoading: boolean
  itemsPerPage: number | string
}

const props = defineProps<Props>()

const headersData = ref<ITableHeaders[]>(props.headers)

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const formatCompactUSD = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(amount)
}
</script>
