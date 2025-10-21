<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
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

const chartCanvas = ref(null)

onMounted(async () => {
  await nextTick()
  new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        {
          label: 'Vendas',
          data: [30, 45, 28, 80, 99, 43, 60, 70, 50, 75, 90, 100],
          borderColor: '#7ee787',       
          backgroundColor: 'rgba(126, 231, 135, 0.2)', 
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#c0f2c0', 
          pointBorderColor: '#ffffff44'   
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Relatório Mensal', color: '#e0e6ed', font: { size: 18 } }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#e0e6ed' }, 
          grid: { color: 'rgba(255,255,255,0.1)' } 
        },
        x: {
          ticks: { color: '#e0e6ed' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        }
      }
    }
  })
})
</script>

<style scoped>
div {
  position: relative;
  height: 400px; 
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
