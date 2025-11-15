<template>
  <Tabs :tabs="filteredTabs" />
  <router-view />
</template>

<script setup>
import Tabs from './components/Tabs.vue'
import { computed } from 'vue'
import { getDecodedToken } from './service/authservice.js'
import { onMounted } from 'vue'
import { startSessionTimer } from './service/authservice.js'

onMounted(() => {
  startSessionTimer()
})


const allTabs = [
  { name: 'Home', path: '/' },
  { name: 'Comandas', path: '/comandas', roles: ['ADMIN', 'funcionario'] },
  { name: 'Pedidos', path: '/pedidos', roles: ['ADMIN', 'funcionario'] },
  { name: 'Karaokê', path: '/karaoke', roles: ['ADMIN', 'funcionario'] },
  { name: 'Relatórios', path: '/relatorios', roles: ['ADMIN'] },
  { name: 'Cadastro', path: '/cadastro', roles: ['ADMIN'] },
  { name: 'Estoque', path: '/estoque', roles: ['ADMIN', 'funcionario'] },
  { name: 'Cozinha', path: '/cozinha', roles: ['ADMIN', 'funcionario'] },
]

const decoded = getDecodedToken()
const userRole = decoded?.role || null

const filteredTabs = computed(() =>
  allTabs.filter(tab => !tab.roles || tab.roles.includes(userRole))
)
</script>
