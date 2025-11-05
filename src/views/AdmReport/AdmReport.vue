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
      <MonthlyChart :startDate="startDate" :endDate="endDate" />
    </div>
  </div>
</template>


<script setup>
import MonthlyChart from "@/components/MonthlyChart.vue";
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
</script>

