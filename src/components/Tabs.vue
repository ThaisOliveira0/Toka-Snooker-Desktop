<template>
  <div class="tabs-component">
    <nav class="tab-header" role="tablist">
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.path" :class="{ active: tab.path === selectedTab }"
          @click="selectTab(tab)">
          {{ tab.name }}
        </button>
      </div>

      <button v-if="!isLoggedIn" class="login-btn" @click="login">Login</button>

      <div v-else class="user-menu" ref="menuRef">
        <img src="../assets/user-icon.png" alt="User" class="user-icon" @click.stop="toggleDropdown" />

        <div v-show="showDropdown" class="dropdown-menu">
          <p class="user-email">{{ userLabel }}</p>
          <button class="logout-btn" @click="logoutUser">Sair</button>
        </div>
      </div>


    </nav>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { logout } from '@/service/authService'

const props = defineProps({
  tabs: Array
})

const router = useRouter()
const route = useRoute()

const selectedTab = ref(route.path)
const isLoggedIn = ref(false)
const userLabel = ref('Usuário logado')
const showDropdown = ref(false)
const menuRef = ref(null)

watch(
  () => route.path,
  (newPath) => {
    selectedTab.value = newPath
  },
  { immediate: true }
)

function checkLogin() {
  const token = sessionStorage.getItem('token')
  isLoggedIn.value = !!token

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      userLabel.value = decoded.email || 'Usuário logado'
    } catch {
      userLabel.value = 'Usuário logado'
    }
  }
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    showDropdown.value = false
  }
}

function logoutUser() {
  logout() 
  showDropdown.value = false
  isLoggedIn.value = false
  window.dispatchEvent(new Event('login-status-changed'))
  router.push('/')
}

function login() {
  router.push('/login')
}

function selectTab(tab) {
  if (tab.path !== selectedTab.value) {
    selectedTab.value = tab.path
    router.push(tab.path)
  }
}

onMounted(() => {
  checkLogin()
  window.addEventListener('login-status-changed', checkLogin)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('login-status-changed', checkLogin)
  document.removeEventListener('click', handleClickOutside)
})
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
  background-color: #000;
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
  color: #f3cf2c;
  transition: color 0.3s;
}

.tab-header button.active {
  color: #fff;
}

.tab-header button:hover {
  color: #fff;
}

.login-btn {
  background-color: #f3cf2c;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 600;
  transition: background 0.3s, color 0.3s;
}

.user-menu {
  position: relative;
  display: inline-block;
}

.user-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 120%;
  background-color: #fff;
  color: #000;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  padding: 0.8rem 1rem;
  width: 180px;
  z-index: 9999;
}

.user-email {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 0.6rem;
  word-break: break-word;
}

.logout-btn {
  background-color: #f3cf2c;
  color: #000;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.logout-btn:hover {
  background-color: #000;
  color: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.user-menu {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  background: #fff;
  color: #000;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  padding: 0.8rem 1rem;
  width: 180px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-email {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 0.6rem;
  word-break: break-word;
}

.logout-btn {
  background: #f3cf2c;
  color: #000;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  text-align: center;
}

.logout-btn:hover {
  background: #000;
  color: #fff;
}

</style>
