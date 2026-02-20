<!--<template>-->
<!--  <div class="chart-wrapper">-->
<!--    <Doughnut-->
<!--      v-if="showChart"-->
<!--      :key="dataGraphDef.datasets[0].data.join('-')"-->
<!--      :data="dataGraphDef"-->
<!--      :options="chartOptions"-->
<!--    />-->
<!--  </div>-->
<!--  <div class="table-actions table-actions_admin">-->
<!--    <div class="table-actions__left">-->
<!--      <div class="table-actions__label">Статистика за день</div>-->
<!--    </div>-->
<!--  </div>-->
<!--  <TableStreamerStats-->
<!--    :headers="headers"-->
<!--    :is-loading="isLoading"-->
<!--    :items="dailyStats"-->
<!--    :items-per-page="queryParams.perPage"-->
<!--  />-->
<!--  <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">-->
<!--    <TablePagination-->
<!--      v-model:query-params="queryParams"-->
<!--      :loading="isLoading"-->
<!--      :total-pages="totalPages"-->
<!--      @change-page="changePage"-->
<!--    />-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'-->
<!--import { computed, onMounted, ref, watch } from 'vue'-->
<!--import { Doughnut } from 'vue-chartjs'-->
<!--import { useRouter } from 'vue-router'-->

<!--import TablePagination from '@/components/tables/TablePagination.vue'-->
<!--import TableStreamerStats from '@/components/tables/TableStreamerStats.vue'-->
<!--import { streamerStats } from '@/constants/tableHeaders'-->
<!--import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'-->
<!--import { useStreamer } from '@/stores/Streamer.ts'-->

<!--const headers = ref<ITableHeaders[]>(streamerStats)-->

<!--const centerTextPlugin = {-->
<!--  id: 'centerText',-->
<!--  beforeDraw(chart) {-->
<!--    const { ctx, chartArea } = chart-->
<!--    if (!chartArea) return-->

<!--    const total = streamerStore.allStats?.publication_total ?? 0-->

<!--    const x = (chartArea.left + chartArea.right) / 2-->
<!--    const y = (chartArea.top + chartArea.bottom) / 2-->

<!--    ctx.save()-->

<!--    // 100%-->
<!--    ctx.font = 'bold 20px sans-serif'-->
<!--    ctx.fillStyle = '#333'-->
<!--    ctx.textAlign = 'center'-->
<!--    ctx.textBaseline = 'middle'-->
<!--    ctx.fillText('100%', x, y - 8)-->

<!--    // количество заявок-->
<!--    ctx.font = '12px sans-serif'-->
<!--    ctx.fillStyle = '#666'-->
<!--    ctx.fillText(`Всего ${total} заявок`, x, y + 14)-->

<!--    ctx.restore()-->
<!--  }-->
<!--}-->

<!--ChartJS.register(ArcElement, Tooltip, Legend, centerTextPlugin)-->

<!--const showChart = ref(false)-->

<!--const dataGraphDef = ref({-->
<!--  // labels: ['Общее количество заявок', 'Принято', 'На модерации', 'Отклонено', 'Выплачено'],-->
<!--  labels: ['Принято', 'На модерации', 'Отклонено', 'Выплачено'],-->
<!--  datasets: [-->
<!--    {-->
<!--      data: [],-->
<!--      // backgroundColor: ['#FFC107', '#4CAF50', '#2196F3', '#F44336', '#9C27B0'],-->
<!--      backgroundColor: ['#4CAF50', '#2196F3', '#F44336', '#9C27B0'],-->
<!--      borderWidth: 0-->
<!--    }-->
<!--  ]-->
<!--})-->

<!--const chartOptions = {-->
<!--  responsive: true,-->
<!--  maintainAspectRatio: false,-->
<!--  plugins: {-->
<!--    legend: {-->
<!--      position: 'bottom',-->
<!--      labels: {-->
<!--        generateLabels(chart) {-->
<!--          const data = chart.data-->
<!--          const stats = streamerStore.allStats-->
<!--          const total = stats?.publication_total || 0-->

<!--          return data.labels.map((label, i) => {-->
<!--            const value = data.datasets[0].data[i] as number-->
<!--            const percent = total ? ((value / total) * 100).toFixed(1) : '0.0'-->

<!--            return {-->
<!--              text: `${label} — ${value} (${percent}%)`,-->
<!--              fillStyle: data.datasets[0].backgroundColor[i],-->
<!--              strokeStyle: data.datasets[0].backgroundColor[i],-->
<!--              lineWidth: 0,-->
<!--              hidden: false,-->
<!--              index: i-->
<!--            }-->
<!--          })-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--const streamerStore = useStreamer()-->
<!--const router = useRouter()-->

<!--const isLoading = computed(() => streamerStore.isLoading)-->
<!--const queryParams = computed<ITableParams>({-->
<!--  get() {-->
<!--    return streamerStore.queryParams-->
<!--  },-->
<!--  set(val) {-->
<!--    streamerStore.setQueryParams(val)-->
<!--  }-->
<!--})-->
<!--const totalPages = computed(() =>-->
<!--  queryParams.value?.total && queryParams.value?.perPage-->
<!--    ? Math.ceil(queryParams.value.total / queryParams.value.perPage)-->
<!--    : 0-->
<!--)-->
<!--const dailyStats = computed<IUserInfoData[]>(() => streamerStore.dailyStats)-->
<!--const allStats = computed<IUserInfoData[]>(() => streamerStore.allStats)-->

<!--const changePage = (page: number) => {-->
<!--  queryParams.value = {-->
<!--    ...queryParams.value,-->
<!--    page: +page-->
<!--  }-->
<!--  getRequest()-->
<!--}-->

<!--const getRequest = () => {-->
<!--  const { page, perPage } = queryParams.value-->
<!--  router.push({-->
<!--    query: {-->
<!--      page: page ?? 1,-->
<!--      perPage: perPage-->
<!--    }-->
<!--  })-->
<!--  streamerStore.getStreamerDailyStats(queryParams.value)-->
<!--}-->

<!--watch(-->
<!--  allStats,-->
<!--  (stats) => {-->
<!--    if (!stats) return-->

<!--    dataGraphDef.value.datasets[0].data = [-->
<!--      // stats.publication_total,-->
<!--      stats.publication_approved_total,-->
<!--      stats.publication_moderation_total,-->
<!--      stats.publication_rejected_total,-->
<!--      stats.publication_paid_total-->
<!--    ]-->

<!--    showChart.value = true-->
<!--  },-->
<!--  { immediate: true }-->
<!--)-->

<!--onMounted(async () => {-->
<!--  const { page = 1, perPage = 50 } = router.currentRoute.value.query-->
<!--  queryParams.value = {-->
<!--    page,-->
<!--    perPage-->
<!--  }-->
<!--  getRequest()-->
<!--  await streamerStore.getStreamerAllStats()-->
<!--})-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--.chart-wrapper {-->
<!--  //width: 350px;-->
<!--  height: 350px;-->
<!--  margin-bottom: 20px;-->
<!--}-->
<!--</style>-->

<template>
  <div class="chart-wrapper">
    graph
    <ApexChart v-if="showChart" type="donut" :series="series" :options="chartOptions" />
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ApexChart from 'vue3-apexcharts'

import TablePagination from '@/components/tables/TablePagination.vue'
import TableStreamerStats from '@/components/tables/TableStreamerStats.vue'
import { streamerStats } from '@/constants/tableHeaders'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import { useStreamer } from '@/stores/Streamer.ts'

const headers = ref<ITableHeaders[]>(streamerStats)
const showChart = ref(false)
const series = ref<number[]>([])

const streamerStore = useStreamer()
const router = useRouter()

const chartOptions = ref({
  chart: {
    type: 'donut',
    toolbar: { show: false }
  },
  labels: ['Принято', 'На модерации', 'Отклонено', 'Выплачено'],
  legend: {
    position: 'bottom',
    formatter: (label: string, opts: any) => {
      const value = series.value[opts.seriesIndex] ?? 0
      const total = series.value.reduce((a, b) => a + b, 0)
      const percent = total ? ((value / total) * 100).toFixed(1) : '0.0'
      return `${label} — ${value} (${percent}%)`
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          name: { show: false },
          value: { show: false },
          total: {
            show: true,
            label: 'Всего заявок',
            formatter: () => {
              return streamerStore.allStats?.publication_total ?? 0
            }
          }
        }
      }
    }
  }
})

const isLoading = computed(() => streamerStore.isLoading)

const queryParams = computed<ITableParams>({
  get: () => streamerStore.queryParams,
  set: (val) => streamerStore.setQueryParams(val)
})

const totalPages = computed(() =>
  queryParams.value?.total && queryParams.value?.perPage
    ? Math.ceil(queryParams.value.total / queryParams.value.perPage)
    : 0
)

const dailyStats = computed<IUserInfoData[]>(() => streamerStore.dailyStats)
const allStats = computed<IUserInfoData[]>(() => streamerStore.allStats)

const changePage = (page: number) => {
  queryParams.value = { ...queryParams.value, page: +page }
  getRequest()
}

const getRequest = () => {
  const { page, perPage } = queryParams.value
  router.push({ query: { page: page ?? 1, perPage } })
  streamerStore.getStreamerDailyStats(queryParams.value)
}

// Обновляем series при изменении данных
watch(
  allStats,
  (stats) => {
    if (!stats) return

    series.value = [
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
  queryParams.value = { page, perPage }
  getRequest()
  await streamerStore.getStreamerAllStats()
})
</script>

<style scoped lang="scss">
.chart-wrapper {
  height: 350px;
  margin-bottom: 20px;
}
</style>
