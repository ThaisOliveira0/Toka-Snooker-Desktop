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
        <strong>{{ totalValor }}</strong>
      </div>
      <div class="report-card">
        <span>Item mais vendido:</span>
        <strong>{{ produtoMaisVendido }}</strong>
      </div>
      <div class="report-card">
        <span>Total de Músicas</span>
        <strong>{{ totalComandas }}</strong>
      </div>
      <div class="report-card">
        <span>Total Vendas em R$:</span>
        <strong>300</strong>
        <!-- <strong>{{ musicaMaisTocada }}</strong> -->
      </div>
      <div class="report-card">
        <span>Música mais tocada:</span>
        <strong>As It Was</strong>
        <!-- <strong>{{ musicaMaisTocada }}</strong> -->
      </div>
    </div>

    <div class="chart-container">
      <div class="chart-header">
        <select v-model="selectedMonth" class="month-filter">
          <option v-for="(month, index) in months" :key="index" :value="index + 1">
            {{ month }}
          </option>
        </select>
      </div>

      <MonthlyChart :month="selectedMonth" />
    </div>
  </div>
</template>

<script setup>
import MonthlyChart from "@/components/MonthlyChart.vue";
import reportsService from "@/service/reportsService";
import { ref } from "vue";
import "./AdmReport.css";

const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  .toISOString()
  .split("T")[0];
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  .toISOString()
  .split("T")[0];

const startDate = ref(firstDay);
const endDate = ref(lastDay);

const totalComandas = ref(0);
const totalPedidos = ref(0);
const totalValor = ref(0);
const produtoMaisVendido = ref("");
const musicaMaisTocada = ref("");

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
const selectedMonth = ref(today.getMonth());

async function applyFilter() {
  try {
    const data = await reportsService.getReports(startDate.value, endDate.value);
    if (data) {
      totalComandas.value = data.total_comandas || 0;
      totalPedidos.value = data.total_pedidos || 0;
      totalValor.value = data.total_valor || 0;
      produtoMaisVendido.value = data.produto_mais_vendido || "—";
      musicaMaisTocada.value = data.musica_mais_tocada || "—";
    }
  } catch (err) {
    console.error("Erro ao aplicar filtro:", err);
  }
}
</script>
