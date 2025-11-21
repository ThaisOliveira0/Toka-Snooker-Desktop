<template>
  <div class="report-page">
    <header class="report-header">
      <h4>Relatório</h4>

      <div class="report-filters">
        <label class="date-label">
          De:
          <input type="date" v-model="startDate" class="date-filter" />
        </label>

        <label class="date-label">
          Até:
          <input type="date" v-model="endDate" class="date-filter" />
        </label>

        <button class="filter-btn" @click="applyFilter">
          Buscar
        </button>
      </div>
    </header>

    <div class="cards-container">
      <div class="report-card">
        <span>Total de Pedidos</span>
        <strong>{{ totalPedidos }}</strong>
      </div>
      <div class="report-card">
        <span>Total Vendas em R$:</span>
        <strong>{{ formatCurrency(totalValor) }}</strong>
      </div>
      <div class="report-card">
        <span>Item mais vendido:</span>
        <strong>{{ produtoMaisVendido }}</strong>
      </div>
      <div class="report-card">
        <span>Total Músicas em R$:</span>
        <strong>{{ formatCurrency(totalValorMusicas) }}</strong>
      </div>
      <div class="report-card">
        <span>Total Músicas R$:</span>
        <strong>{{ totalValorMusicas }}</strong>
      </div>
      <div class="report-card">
        <span>Música mais tocada:</span>
        <strong>{{ musicaMaisTocada }}</strong>
      </div>
    </div>

    <div class="chart-container">
      <div class="chart-header">

        <select v-model="selectedMonth" class="month-filter">
          <option v-for="(month, index) in months" :key="index" :value="index + 1">
            {{ month }}
          </option>
        </select>

        <select v-model="chartType" class="month-filter">
          <option value="orders">Pedidos</option>
          <option value="music">Músicas</option>
        </select>

      </div>

      <MonthlyChart :month="selectedMonth" :year="selectedYear" :type="chartType" :data="graphData" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import MonthlyChart from "@/components/MonthlyChart.vue";
import reportsService from "@/service/reportsService";
import "./AdmReport.css";

const today = new Date();

const selectedYear = ref(today.getFullYear());
const selectedMonth = ref(today.getMonth() + 1);
const chartType = ref("orders");

const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  .toISOString()
  .split("T")[0];

const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  .toISOString()
  .split("T")[0];

const startDate = ref(firstDay);
const endDate = ref(lastDay);

const totalMusicas = ref(0);
const totalPedidos = ref(0);
const totalValor = ref(0);
const totalValorMusicas = ref(0);
const produtoMaisVendido = ref("");
const musicaMaisTocada = ref("");

const graphData = ref([]);

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

watch([selectedMonth, chartType], () => {
  loadGraph();
});

onMounted(() => {
  loadGraph();
});

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});
const formatCurrency = (value) => currencyFormatter.format(value);
async function applyFilter() {
  try {
    const [orders, music] = await Promise.all([
      reportsService.getReportsOrder(startDate.value, endDate.value),
      reportsService.getReportsMusic(startDate.value, endDate.value)
    ]);

    if (orders) {
      totalPedidos.value = orders.total_pedidos || 0;
      totalValor.value = orders.total_valor || 0;
      produtoMaisVendido.value = orders.produto_mais_vendido || "—";
    }

    if (music) {
      totalMusicas.value = music.total_musicas_tocadas || 0;
      totalValorMusicas.value = music.total_valor_musicas || 0;
      musicaMaisTocada.value = music.musica_mais_tocada || "—";
    }

  } catch (err) {
    console.error("Erro ao aplicar filtro:", err);
  }
}


async function loadGraph() {
  try {
    const data = await reportsService.getGraphInfo(
      selectedYear.value,
      selectedMonth.value,
      chartType.value
    );

    graphData.value = data;

  } catch (err) {
    console.error("Erro ao carregar o gráfico:", err);
  }
}
</script>
