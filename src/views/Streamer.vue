<template>
  <div class="admin-info d-flex">
    <div class="admin-info__wrap" :class="{ 'admin-info__wrap_half': activePanel }">
      <div class="table-actions table-actions_admin">
        <div class="table-actions__left">
          <div class="table-actions__label">Заявки</div>
        </div>
      </div>
      <TableStreamer
        v-model:active-panel="activePanel"
        :headers="headers"
        :is-loading="isLoading"
        :items="calcDataItems"
        :selected-index="selectedIndex"
        :items-per-page="queryParams.perPage"
        @row-click="onRowClick"
        @finish-check="finishCheck"
      />
      <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">
        <TablePagination
          v-model:query-params="queryParams"
          :loading="isLoading"
          :total-pages="totalPages"
          @change-page="changePage"
        />
      </div>
    </div>
    <transition name="scale-fade">
      <SidePanelStreamer
        v-show="activePanel"
        v-model:current-item="currentRecord"
        v-model:active-panel="activePanel"
        :is-first="selectedIndex === 0"
        :is-last="selectedIndex === calcDataItems.length - 1"
        @change-state="changeState"
        @prev="prevRow"
        @next="nextRow"
    /></transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import SidePanelStreamer from '@/components/base/SidePanelStreamer.vue'
import TablePagination from '@/components/tables/TablePagination.vue'
import TableStreamer from '@/components/tables/TableStreamer.vue'
import { useTableQuery } from '@/composables/useTableQuery.ts'
import { adminMain } from '@/constants/tableHeaders'
import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import { useError } from '@/stores/Errors.ts'
import { useStreamer } from '@/stores/Streamer.ts'

const headers = ref<ITableHeaders[]>(adminMain)

const streamerStore = useStreamer()
const errorStore = useError()
const activePanel = ref(false)
const currentRecord = ref({})
const selectedIndex = ref(-1)

const { queryParams, totalPages, changePage, getRequest } = useTableQuery({
  getQueryParams: () => streamerStore.queryParams,
  setQueryParams: (params) => streamerStore.setQueryParams(params),
  fetchData: (params) => streamerStore.getPublicationsListMain(params)
})

const isLoading = computed(() => streamerStore.isLoading)

const calcDataItems = computed<IUserInfoData[]>(() => streamerStore.items)

const onRowClick = (item) => {
  currentRecord.value = item?.item ?? {}
  selectedIndex.value = item.index
  activePanel.value = true
}

const prevRow = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
    currentRecord.value = calcDataItems.value[selectedIndex.value]
  }
}

const nextRow = () => {
  if (selectedIndex.value < calcDataItems.value.length - 1) {
    selectedIndex.value++
    currentRecord.value = calcDataItems.value[selectedIndex.value]
  }
}

const finishCheck = async (id: number) => {
  const { data } = await streamerStore.finishCheckStreamer(id)
  const msg = data?.message ?? ''
  errorStore.setErrors(msg, 'success')
  if (data?.code === 200) {
    getRequest()
  }
}

const cleanNumber = (str: string) => str.replace(/\D/g, '')

const changeState = async (item, selectedTasks) => {
  const { status, status_comment, number_views_moderation, coefficient } =
    item.status_moderation_streamer.current ?? {}
  const data = {
    id: item.id,
    status,
    status_comment,
    number_views_moderation: cleanNumber(number_views_moderation),
    rules: selectedTasks,
    coefficient
  }
  try {
    await streamerStore.setPublicationStreamerStatus(data)
    getRequest()
  } catch (error: any) {
    errorStore.setErrors(error.response?.data?.message ?? '')
  }
}

const handleKeydown = (e) => {
  if (!calcDataItems.value.length) return
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    prevRow()
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    nextRow()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  streamerStore.getCoeffsList()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
.admin-info {
  &__wrap {
    width: 100%;

    &_half {
      width: 100%;
      min-width: 100px;
    }
  }
}
</style>
