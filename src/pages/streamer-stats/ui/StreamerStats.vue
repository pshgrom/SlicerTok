<template>
  <div class="chart-wrapper">
    <StreamerStatsChart
      v-if="showChart && chartValues"
      :key="`${chartKey}-${isDark}`"
      :values="chartValues"
      :is-dark="isDark"
    />
  </div>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Статистика за день</div>
    </div>
  </div>
  <TableStreamerStats
    :headers="headers"
    :is-loading="isLoading"
    :items="dailyStats"
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
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useThemeStore } from '@/app/stores'
import { useStreamer } from '@/entities/streamer'
import { streamerStats } from '@/shared/config'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/shared/config/types/app-model'
import { TablePagination } from '@/shared/ui'
const StreamerStatsChart = defineAsyncComponent(
  () => import('@/widgets/charts/StreamerStatsChart.vue')
)
import { TableStreamerStats } from '@/widgets/tables'

const headers = ref<ITableHeaders[]>(streamerStats)
const streamerStore = useStreamer()
const themeStore = useThemeStore()

const isDark = computed(() => themeStore.current === 'dark')

const showChart = ref(false)
const chartKey = ref(0)

const chartValues = computed(() => {
  const stats = streamerStore.allStats as Record<string, number> | undefined
  if (!stats) return null

  return {
    approved: stats.publication_approved_total ?? 0,
    moderation: stats.publication_moderation_total ?? 0,
    rejected: stats.publication_rejected_total ?? 0,
    paid: stats.publication_paid_total ?? 0,
    total: stats.publication_total ?? 0
  }
})
const router = useRouter()

const isLoading = computed(() => streamerStore.isLoading)
const queryParams = computed<ITableParams>({
  get() {
    return streamerStore.queryParams
  },
  set(val) {
    streamerStore.setQueryParams(val)
  }
})
const totalPages = computed(() =>
  queryParams.value?.total && queryParams.value?.perPage
    ? Math.ceil(queryParams.value.total / queryParams.value.perPage)
    : 0
)
const dailyStats = computed<IUserInfoData[]>(() => streamerStore.dailyStats as IUserInfoData[])

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
  streamerStore.getStreamerDailyStats(queryParams.value)
}

watch(
  chartValues,
  (values) => {
    const hasData =
      !!values &&
      [values.approved, values.moderation, values.rejected, values.paid].some((v) => v > 0)

    showChart.value = hasData
    if (hasData) chartKey.value++
  },
  { immediate: true }
)

onMounted(async () => {
  const { page = 1, perPage = 50 } = router.currentRoute.value.query
  queryParams.value = {
    page,
    perPage
  }
  getRequest()
  await streamerStore.getStreamerAllStats()
})
</script>

<style lang="scss" scoped>
.chart-wrapper {
  //width: 350px;
  height: 350px;
  margin-bottom: 20px;
}
</style>
