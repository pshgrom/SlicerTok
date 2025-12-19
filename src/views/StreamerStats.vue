<template>
  <div class="chart-wrapper">
    <Doughnut
      v-if="showChart"
      :key="dataGraphDef.datasets[0].data.join('-')"
      :data="dataGraphDef"
      :options="chartOptions"
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
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { computed, onMounted, ref, watch } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { useRouter } from 'vue-router'

import TablePagination from '@/components/tables/TablePagination.vue'
import TableStreamerStats from '@/components/tables/TableStreamerStats.vue'
import { streamerStats } from '@/constants/tableHeaders'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import { useStreamer } from '@/stores/Streamer.ts'
ChartJS.register(ArcElement, Tooltip, Legend)

const headers = ref<ITableHeaders[]>(streamerStats)

const showChart = ref(false)

const dataGraphDef = ref({
  labels: ['Общее количество заявок', 'Принято', 'На модерации', 'Отклонено', 'Выплачено'],
  datasets: [
    {
      data: [],
      backgroundColor: ['#FFC107', '#4CAF50', '#2196F3', '#F44336', '#9C27B0'],
      borderWidth: 0
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    tooltip: {
      callbacks: {
        label(context) {
          const data = context.dataset.data
          const total = data.reduce((a: number, b: number) => a + b, 0)
          const value = context.raw
          const percent = total ? ((value / total) * 100).toFixed(1) : 0

          return `${context.label}: ${value} (${percent}%)`
        }
      }
    }
  }
}

const streamerStore = useStreamer()
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
const dailyStats = computed<IUserInfoData[]>(() => streamerStore.dailyStats)
const allStats = computed<IUserInfoData[]>(() => streamerStore.allStats)

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
  allStats,
  (stats) => {
    if (!stats) return

    dataGraphDef.value.datasets[0].data = [
      stats.publication_total,
      stats.publication_approved_total,
      stats.publication_moderation_total,
      stats.publication_rejected_total,
      stats.publication_paid_total
    ]

    showChart.value = true
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
