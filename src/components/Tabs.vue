<template>
  <div class="tabs-component">
    <nav class="tab-header" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.path"
        :class="{ active: tab.path === selectedTab }"
        @click="selectTab(tab)"
        role="tab"
        :aria-selected="tab.path === selectedTab"
      >
        {{ tab.name }}
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  tabs: {
    type: Array,
    default: () => [
      { name: 'Comandas', path: '/comandas' },
      { name: 'Pedidos', path: '/pedidos' },
      { name: 'Pagamento', path: '/pagamento' },
      { name: 'Karaokê', path: '/karaoke' }
    ]
  }
})

const router = useRouter()
const route = useRoute()
const selectedTab = ref(route.path)  

watch(
  () => route.path,
  (newPath) => {
    selectedTab.value = newPath
  },
  { immediate: true }
)

const selectTab = (tab) => {
  if (tab.path !== selectedTab.value) {
    selectedTab.value = tab.path
    router.push(tab.path)
  }
}
</script>

<style scoped>
.tab-header {
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}
.tab-header button {
  background: transparent;
  border: none;
  padding: 0.5rem 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;
}
.tab-header button.active {
  color: #208c4a;
  border-bottom: 3px solid #208c4a;
}
</style>
