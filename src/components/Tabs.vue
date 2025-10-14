<template>
  <div class="tabs-component">
    <nav class="tab-header" role="tablist">
      <div class="tabs">
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
      </div>
      <button class="login-btn" @click="login">
        Login
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  tabs: {
    type: Array, }
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
  const login = () => {
  router.push('/login')
}
</script>

<style scoped>
.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 6vh;
  gap: 2rem;
  border-bottom: 2px solid #eee;
  padding: 0.5rem 1rem;
  background-color: #000000;
  font-family: 'Poppins', sans-serif;
}

.tabs {
  display: flex;
  gap: 2rem;
}

.tab-header button {
  background: transparent;
  border: none;
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
  color: #f3cf2c;
}

.tab-header button::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 3px;
  background-color: #ffffff; 
  transition: width 0.3s;
  border-radius: 2px;
}

.tab-header button.active {
  color: #ffffff;
}

.tab-header button.active::after {
  width: 100%;
}

.tab-header button:hover {
  color: #ffffff;
}

.tab-header button:hover::after {
  width: 100%;
}

/* .login-btn {
  background-color: #f3cf2c;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 600;
  transition: background 0.3s, color 0.3s;
}

.login-btn:hover {
  background-color: #ffffff;
  color: #000;
} */


</style>
