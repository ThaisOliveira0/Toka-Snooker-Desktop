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
  { name: 'Comandas', path: '/comandas', roles: ['admin', 'funcionario'] },
  { name: 'Pedidos', path: '/pedidos', roles: ['admin', 'funcionario'] },
  { name: 'Karaokê', path: '/karaoke', roles: ['admin', 'funcionario'] },
  { name: 'Relatórios', path: '/relatorios', roles: ['admin'] },
  { name: 'Cadastro', path: '/cadastro', roles: ['admin'] },
  { name: 'Estoque', path: '/estoque', roles: ['admin', 'funcionario'] },
  { name: 'Cozinha', path: '/cozinha', roles: ['admin', 'funcionario'] },
]


const decoded = getDecodedToken()
const userRole = decoded?.role || null

console.log('👤 Role do usuário:', userRole)

const filteredTabs = computed(() =>
  allTabs.filter(tab => !tab.roles || tab.roles.includes(userRole))
)
</script>
