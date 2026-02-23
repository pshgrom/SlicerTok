<template>
  <div class="chart-wrapper">
    <Doughnut
      v-if="showChart && chartData"
      :key="`${chartKey}-${isDark}`"
      :data="chartData"
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

import { useThemeStore } from '@/app/stores'
import { useStreamer } from '@/entities/streamer'
import { streamerStats } from '@/shared/config'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/shared/config/types/app-model'
import { TablePagination } from '@/shared/ui'
import { TableStreamerStats } from '@/widgets/tables'

const headers = ref<ITableHeaders[]>(streamerStats)
const streamerStore = useStreamer()
const themeStore = useThemeStore()

const isDark = computed(() => themeStore.current === 'dark')

function createCenterTextPlugin() {
  return {
    id: 'centerText',
    beforeDraw(chart: {
      ctx: CanvasRenderingContext2D
      chartArea: { left: number; right: number; top: number; bottom: number } | null
    }) {
      const { ctx, chartArea } = chart
      if (!chartArea) return
      const total = (streamerStore.allStats?.publication_total as number) ?? 0
      const x = (chartArea.left + chartArea.right) / 2
      const y = (chartArea.top + chartArea.bottom) / 2
      const dark = themeStore.current === 'dark'
      const textColor = dark ? 'rgba(255,255,255,0.87)' : '#333'
      const subColor = dark ? 'rgba(255,255,255,0.6)' : '#666'
      ctx.save()
      ctx.font = 'bold 20px sans-serif'
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('100%', x, y - 8)
      ctx.font = '12px sans-serif'
      ctx.fillStyle = subColor
      ctx.fillText(`Всего ${total} заявок`, x, y + 14)
      ctx.restore()
    }
  }
}

ChartJS.register(ArcElement, Tooltip, Legend, createCenterTextPlugin())

const showChart = ref(false)
const chartKey = ref(0)

const CHART_LABELS = ['Принято', 'На модерации', 'Отклонено', 'Выплачено']

const CHART_COLORS_LIGHT = ['#059669', '#2563eb', '#dc2626', '#7c3aed']

const CHART_COLORS_DARK = ['#34d399', '#60a5fa', '#f87171', '#a78bfa']

const chartLabelColor = computed(() =>
  isDark.value ? 'rgba(255,255,255,0.87)' : 'rgba(0,0,0,0.87)'
)

const chartSegmentColors = computed(() => (isDark.value ? CHART_COLORS_DARK : CHART_COLORS_LIGHT))

const chartData = computed(() => {
  const stats = streamerStore.allStats as Record<string, number> | undefined
  if (!stats) return null
  const data = [
    stats.publication_approved_total ?? 0,
    stats.publication_moderation_total ?? 0,
    stats.publication_rejected_total ?? 0,
    stats.publication_paid_total ?? 0
  ]
  return {
    labels: CHART_LABELS,
    datasets: [
      {
        data,
        backgroundColor: chartSegmentColors.value,
        borderWidth: 0
      }
    ]
  }
})

const chartOptions = computed(() => {
  const labelTextColor = chartLabelColor.value
  const tooltipBg = isDark.value ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)'
  const tooltipBorder = isDark.value ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: labelTextColor,
          font: { size: 12 },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          generateLabels(chart: {
            data: { labels: string[]; datasets: { data: unknown[]; backgroundColor: string[] }[] }
          }) {
            const { data } = chart
            const stats = streamerStore.allStats as Record<string, number> | undefined
            const total = (stats?.publication_total as number) || 0
            const textColor = chartLabelColor.value

            return data.labels.map((label, i) => {
              const value = (data.datasets[0].data[i] as number) ?? 0
              const percent = total ? ((value / total) * 100).toFixed(1) : '0.0'
              return {
                text: `${label} — ${value} (${percent}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].backgroundColor[i],
                fontColor: textColor,
                lineWidth: 0,
                hidden: false,
                index: i
              }
            })
          }
        }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: labelTextColor,
        bodyColor: labelTextColor,
        borderColor: tooltipBorder,
        borderWidth: 1
      }
    }
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
  chartData,
  (data) => {
    showChart.value = !!data && (data.datasets[0].data as number[]).some((v) => v > 0)
    if (data) chartKey.value++
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
