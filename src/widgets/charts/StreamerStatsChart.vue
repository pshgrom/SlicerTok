<template>
  <Doughnut
    v-if="chartData"
    :data="chartData"
    :options="chartOptions"
    :plugins="[centerTextPlugin]"
  />
</template>

<script setup lang="ts">
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'

type ChartValues = {
  approved: number
  moderation: number
  rejected: number
  paid: number
  total: number
}

const props = defineProps<{
  values: ChartValues
  isDark: boolean
}>()

ChartJS.register(ArcElement, Tooltip, Legend)

const CHART_LABELS = ['Принято', 'На модерации', 'Отклонено', 'Выплачено']

const CHART_COLORS_LIGHT = ['#059669', '#2563eb', '#dc2626', '#7c3aed']
const CHART_COLORS_DARK = ['#34d399', '#60a5fa', '#f87171', '#a78bfa']

const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart: any) {
    const { ctx, chartArea } = chart
    if (!chartArea) return

    const total = props.values.total ?? 0
    const x = (chartArea.left + chartArea.right) / 2
    const y = (chartArea.top + chartArea.bottom) / 2

    const textColor = props.isDark ? 'rgba(255,255,255,0.87)' : '#333'
    const subColor = props.isDark ? 'rgba(255,255,255,0.6)' : '#666'

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

const chartData = computed(() => {
  const { approved, moderation, rejected, paid } = props.values

  return {
    labels: CHART_LABELS,
    datasets: [
      {
        data: [approved, moderation, rejected, paid],
        backgroundColor: props.isDark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT,
        borderWidth: 0
      }
    ]
  }
})

const chartOptions = computed(() => {
  const labelTextColor = props.isDark ? 'rgba(255,255,255,0.87)' : 'rgba(0,0,0,0.87)'
  const tooltipBg = props.isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)'
  const tooltipBorder = props.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
  const total = props.values.total || 0

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    hover: { mode: null as const },
    parsing: false,
    normalized: true,
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

            return data.labels.map((label, i) => {
              const value = (data.datasets[0].data[i] as number) ?? 0
              const percent = total ? ((value / total) * 100).toFixed(1) : '0.0'
              return {
                text: `${label} — ${value} (${percent}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].backgroundColor[i],
                fontColor: labelTextColor,
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
</script>
