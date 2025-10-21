<template>
  <Tabs :tabs="filteredTabs" />  
  <router-view />          
</template>

<script setup>
import Tabs from './components/Tabs.vue'
import { computed } from 'vue'
import { getDecodedToken } from './service/authService.js' 

const allTabs = [
  { name: 'Home', path: '/' },
  { name: 'Comandas', path: '/comandas', roles: ['ADMIN', 'FUNCIONARIO'] },
  { name: 'Pedidos', path: '/pedidos', roles: ['ADMIN', 'FUNCIONARIO'] },
  { name: 'Karaokê', path: '/karaoke', roles: ['ADMIN', 'FUNCIONARIO'] },
  { name: 'Relatórios', path: '/relatorios', roles: ['ADMIN'] },
  { name: 'Cadastro', path: '/cadastro' ,roles: ['ADMIN']},
  { name: 'Estoque', path: '/estoque', roles: ['ADMIN', 'FUNCIONARIO'] },
  // { name: 'Pagamento', path: '/pagamento', roles: ['ADMIN', 'FUNCIONARIO'] },
]

const decoded = getDecodedToken()
// const userRole = decoded?.role || null
const userRole = 'ADMIN'

const filteredTabs = computed(() =>
  allTabs.filter(tab => !tab.roles || tab.roles.includes(userRole))
)
</script>
