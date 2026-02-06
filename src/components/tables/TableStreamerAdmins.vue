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
    @click:row="onRowClick"
  >
    <template #loading>
      <v-progress-circular indeterminate color="rgb(169, 55, 244)" />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'

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
    default: 20
  }
})

const router = useRouter()
const headersData = ref(props.headers)
const route = useRoute()

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const onRowClick = (event, { item }) => {
  const streamerId = route.params.id
  const adminId = item.id
  router.push({ name: 'AdminStats', params: { streamerId, adminId } })
}
</script>
