<template>
  <div class="chart-wrapper">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
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
} from "chart.js";

Chart.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement
);

const props = defineProps({
  month: Number,
  year: Number,
  data: Array,
  type: String
});

const chartCanvas = ref(null);
let chartInstance = null;

const chartTitle = computed(() => {
  const tipo = props.type === "orders" ? "Pedidos" : "Músicas";
  return `${tipo} – ${props.month}/${props.year}`;
});

function renderChart() {
  if (!props.data || props.data.length === 0) return;

  const labels = props.data.map(item => new Date(item.dia).getDate());
  const comandasData = props.data.map(item => item.total_comandas);
  const pedidosData = props.data.map(item => item.total_pedidos);
  const valorData = props.data.map(item => item.total_valor);

  const chartLabelTitle = chartTitle.value;

  const datasets = [
    {
      label: "Total de Comandas",
      data: comandasData,
      borderColor: "#2196F3",
      backgroundColor: "rgba(33,150,243,0.2)",
      fill: true,
      tension: 0.3
    },
    {
      label: "Total de Pedidos",
      data: pedidosData,
      borderColor: "#4CAF50",
      backgroundColor: "rgba(76,175,80,0.2)",
      fill: true,
      tension: 0.3
    },
    {
      label: "Total em Valor (R$)",
      data: valorData,
      borderColor: "#FF9800",
      backgroundColor: "rgba(255,152,0,0.2)",
      fill: true,
      tension: 0.3
    }
  ];

  if (chartInstance) {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets = datasets;
    chartInstance.options.plugins.title.text = chartLabelTitle;
    chartInstance.update();
    return;
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: chartLabelTitle,
          font: {
            size: 22,     
            weight: "bold"
          },
          padding: {
            top: 15,
            bottom: 20
          }
        }

      }
    }
  });
}

watch(
  () => [props.data, props.month, props.year, props.type],
  renderChart,
  { deep: true }
);

onMounted(renderChart);
</script>



<style scoped>
.chart-wrapper {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  height: 500px;
  width: 100%;
}


canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
