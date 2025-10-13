<template>
  <Tabs :tabs="tabs" />  
  <router-view />          
</template>

<script setup>
import Tabs from './components/Tabs.vue'

const tabs = [
  { name: 'Home', path: '/' },
  { name: 'Comandas', path: '/comandas' },
  { name: 'Pedidos', path: '/pedidos' },
  { name: 'Karaokê', path: '/karaoke' },
  { name: 'Relatórios', path: '/relatorios' },
  { name: 'Cadastro', path: '/cadastro' },
  { name: 'Estoque', path: '/estoque' },

]
</script>
