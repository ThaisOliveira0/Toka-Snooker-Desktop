<template>
  <div class="report-page">
    <h1>Relatório</h1>

    <div class="cards-container">
      <Card title="Total de Pedidos" :value="120" />
      <Card title="Total Vendas em R$:" :value="3400" />
      <Card title="Total em Músicas: " :value="75" />
      <Card title="Item mais vendido" :value="75" />
    </div>

    <div class="chart-container">
      <MonthlyChart />
    </div>
  </div>
</template>

<script setup>
import Card from '@/components/Card.vue'
import MonthlyChart from '@/components/MonthlyChart.vue'
import './AdmReport.css'

</script>
