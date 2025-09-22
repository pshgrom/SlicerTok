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
      <v-progress-circular indeterminate color="#0070ba" />
    </template>
    <template #[`item.url`]="{ item }">
      <a class="custom-table__link" :href="item.url" target="_blank">
        {{ formatUrl(item.url) }}
      </a>
    </template>
    <template #[`item.video_stat_link`]="{ item }">
      <a class="custom-table__link" :href="item.video_stat_link" target="_blank">
        {{ formatUrl(item.video_stat_link) }}
      </a>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'

import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
// import VCustomSelect from '@/components/base/VCustomSelect.vue'

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
  }
})

const headersData = ref(props.headers)

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const formatUrl = (url: string) => {
  if (!url) return ''
  const firstPart = url.slice(0, 30)
  const lastPart = url.slice(url.length - 3)
  return `${firstPart}...${lastPart}`
}
</script>

<style lang="scss">
.cell-link {
  text-decoration: underline;
  transition: opacity 0.15s ease-in;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
}

.custom-table__link {
  cursor: pointer;
  transition: opacity 0.15s ease-in;
  border-bottom: 1px solid transparent;

  &:hover {
    opacity: 0.7;
    border-color: #000;
  }
}
</style>
