<template>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Логи</div>
    </div>
  </div>
  <TableStreamerLogs
    :headers="headers"
    :is-loading="isLoading"
    :items="calcDataItems"
    :items-per-page="queryParams.perPage"
  />
  <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">
    <TablePagination
      v-model:query-params="queryParams"
      :loading="isLoading"
      :total-pages="totalPages"
      @change-page="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useStreamer } from '@/entities/streamer'
import { adminMainLogs } from '@/shared/config'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/shared/config/types/app-model'
import { TablePagination } from '@/shared/ui'
import { TableStreamerLogs } from '@/widgets/tables'

const headers = ref<ITableHeaders[]>(adminMainLogs)

const streamer = useStreamer()

const isLoading = computed(() => streamer.isLoading)
const router = useRouter()

const calcDataItems = computed<IUserInfoData[]>(() => streamer.items)

const queryParams = computed<ITableParams>({
  get() {
    return streamer.queryParams
  },
  set(val) {
    streamer.setQueryParams(val)
  }
})

const totalPages = computed(() =>
  queryParams.value?.total && queryParams.value?.perPage
    ? Math.ceil(queryParams.value.total / queryParams.value.perPage)
    : 0
)

const changePage = (page: number) => {
  queryParams.value = {
    ...queryParams.value,
    page: +page
  }
  getRequest()
}

const getRequest = () => {
  const { page, perPage } = queryParams.value
  router.push({
    query: {
      page: page ?? 1,
      perPage: perPage
    }
  })
  streamer.getLogList(queryParams.value)
}

onMounted(() => {
  const { page = 1, perPage = 50 } = router.currentRoute.value.query
  queryParams.value = {
    page,
    perPage
  }
  getRequest()
})
</script>
