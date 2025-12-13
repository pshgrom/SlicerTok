<template>
  <div class="chart-wrapper">
    <Doughnut v-if="showChart" :data="dataGraphDef" :options="chartOptions" />
  </div>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Статистика</div>
    </div>
  </div>
  <TableStreamerStats
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
import { Chart, registerables } from 'chart.js'
import { computed, onMounted, ref } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { useRouter } from 'vue-router'

import TablePagination from '@/components/tables/TablePagination.vue'
import TableStreamerStats from '@/components/tables/TableStreamerStats.vue'
import { streamerStats } from '@/constants/tableHeaders'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import { useStreamer } from '@/stores/Streamer.ts'
Chart.register(...registerables)

const headers = ref<ITableHeaders[]>(streamerStats)

const showChart = ref(false)

const dataGraphDef = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ['rgb(255, 205, 86)', 'rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
      borderWidth: 0
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' }
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
const calcDataItems = computed<IUserInfoData[]>(() => streamerStore.items)

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
  streamerStore.getStreamerStats(queryParams.value)
}

const updateChart = () => {
  const stats = [
    {
      id: 1,
      name: 'Стример 1',
      username: 'streamer1',
      active: true,
      banned: false,
      views: 1540,
      clicks: 120,
      earnings: 234.5
    },
    {
      id: 2,
      name: 'Стример 2',
      username: 'streamer2',
      active: true,
      banned: false,
      views: 980,
      clicks: 75,
      earnings: 120.0
    },
    {
      id: 3,
      name: 'Стример 3',
      username: 'streamer3',
      active: false,
      banned: false,
      views: 420,
      clicks: 20,
      earnings: 50.0
    },
    {
      id: 4,
      name: 'Стример 4',
      username: 'streamer4',
      active: false,
      banned: false,
      views: 320,
      clicks: 10,
      earnings: 12.0
    },
    {
      id: 5,
      name: 'Стример 5',
      username: 'streamer5',
      active: false,
      banned: true,
      views: 0,
      clicks: 0,
      earnings: 0
    }
  ]

  if (!stats || stats.length === 0) return

  // пример: меняй под реальные данные
  dataGraphDef.value.labels = ['Активные', 'Неактивные', 'Заблокированные']

  dataGraphDef.value.datasets[0].data = [
    stats.filter((i) => i.active).length,
    stats.filter((i) => !i.active).length,
    stats.filter((i) => i.banned).length
  ]

  // включаем рендер графика после первого обновления
  showChart.value = true
}

onMounted(() => {
  const { page = 1, perPage = 50 } = router.currentRoute.value.query
  queryParams.value = {
    page,
    perPage
  }
  getRequest()
  updateChart()
})
</script>

<style lang="scss" scoped>
.chart-wrapper {
  //width: 350px;
  //height: 350px;
  margin-bottom: 20px;
}
</style>
