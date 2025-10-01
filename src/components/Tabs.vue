<template>
  <div class="tabs-component">
    <nav class="tab-header" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="{ active: tab === selectedTab }"
        @click="selectedTab = tab"
        role="tab"
        :aria-selected="tab === selectedTab"
      >
        {{ tab }}
      </button>
    </nav>

    <div class="tab-content">
      <slot :name="selectedTab" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  tabs: { type: Array, default: () => ['Comandas', 'Pedidos', 'Pagamento', 'Karaokê'] }
});

const selectedTab = ref(props.tabs[0] || '');

watch(() => props.tabs, (newTabs) => {
  if (newTabs && newTabs.length) selectedTab.value = newTabs[0];
});
</script>

<style scoped>
.tab-header {
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: .5rem;
}
.tab-header button {
  background: transparent;
  border: none;
  padding: 0.5rem 0.8rem;
  font-weight: 600;
  cursor: pointer;
}
.tab-header button.active {
  color: #208c4a;
  border-bottom: 3px solid #208c4a;
}
.tab-content { 
  padding-top: 1rem; 
}
</style>
