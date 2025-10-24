<template>
  <div class="report-page">
    <header class="report-header">
      <h4>Relatório</h4>
    <div class="report-filters">
      <select v-model="selectedMonth">
        <option :value="0">Todos os meses</option>
        <option
          v-for="(month, index) in months"
          :key="index"
          :value="index + 1"
        >
          {{ month }}
        </option>
      </select>

      <select v-model="selectedYear">
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>
    </header>

<div class="cards-container">
  <div class="report-card">
    <span>Total de Pedidos</span>
    <strong>120</strong>
  </div>
  <div class="report-card">
    <span>Total Vendas em R$:</span>
    <strong>3400</strong>
  </div>
  <div class="report-card">
    <span>Total em Músicas:</span>
    <strong>75</strong>
  </div>
  <div class="report-card">
    <span>Item mais vendido:</span>
    <strong>75</strong>
  </div>
  <div class="report-card">
    <span>Música mais tocada:</span>
    <strong>feiticeira</strong>
  </div>
</div>


    <div class="chart-container">
      <MonthlyChart :month="selectedMonth" :year="selectedYear" />
    </div>
  </div>
</template>

<script setup>
import Card from "@/components/Card.vue";
import MonthlyChart from "@/components/MonthlyChart.vue";
import { ref } from "vue";
import "./AdmReport.css";

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(currentYear);
</script>
