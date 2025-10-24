<template>
  <div class="chart-wrapper">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

Chart.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement
)

const props = defineProps({
  month: { type: Number, default: new Date().getMonth() + 1 },
  year: { type: Number, default: new Date().getFullYear() }
})

const chartCanvas = ref(null)
let chartInstance = null

function renderChart() {
  let labels = []
  let data = []

  if (props.month === 0) {
    labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
    data = labels.map(() => Math.floor(Math.random() * 100))
  } else {
    const daysInMonth = new Date(props.year, props.month, 0).getDate()
    labels = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    data = labels.map(() => Math.floor(Math.random() * 100))
  }

  const chartLabel = props.month === 0 ? `Vendas Ano ${props.year}` : `Vendas ${props.month}/${props.year}`

  if (chartInstance) {
    chartInstance.data.labels = labels
    chartInstance.data.datasets[0].data = data
    chartInstance.data.datasets[0].label = chartLabel
    chartInstance.options.plugins.title.text = props.month === 0 
      ? `Relatório Anual - ${props.year}`
      : `Relatório Mensal - ${props.month}/${props.year}`
    chartInstance.update()
  } else {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'line',
      data: { labels, datasets: [{ label: chartLabel, data, borderColor: '#43a047', backgroundColor: 'rgba(67,160,71,0.2)', fill: true, tension: 0.4, pointBackgroundColor: '#a5d6a7', pointBorderColor: '#ffffff44' }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: chartLabel, color: '#305532', font: { size: 18, weight: '600' } }
        },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#333' }, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { ticks: { color: '#333' }, grid: { color: 'rgba(0,0,0,0.05)' } }
        }
      }
    })
  }
}

onMounted(async () => {
  await nextTick()
  renderChart()
})

watch([() => props.month, () => props.year], () => {
  renderChart()
})
</script>

<style scoped>
.chart-wrapper {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  height: 400px;
  width: 100%;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
