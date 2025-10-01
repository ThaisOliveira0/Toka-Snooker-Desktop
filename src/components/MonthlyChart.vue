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
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Relatório Mensal' }
      },
      scales: {
        y: { beginAtZero: true }
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
