<template>
  <div class="auth-background" @click="goBack">
    <div class="auth-container login" @click.stop>
      <div class="auth-side left">
        <img src="/images/logo.png" alt="Logo" class="logo" />
      </div>

      <div class="auth-side right">
        <form class="auth-form" @submit.prevent="handleLogin" @keydown.enter.prevent="handleLogin">
          <button class="back-button" @click.prevent="goBack">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2>Login</h2>
          <div class="avatar">
            <i class="fas fa-user"></i>
          </div>

          <input type="email" placeholder="E-mail" v-model="email" />
          <input type="password" placeholder="Senha" v-model="senha" />


          <button type="submit" class="auth-button" @click.stop="handleLogin">
            Entrar
          </button>

          <a href="/esqueci-senha" class="forgot-password">Esqueci minha senha</a>

          <p class="signup-text">
            Novo por aqui? <router-link to="/cadastro">Cadastre-se!</router-link>
          </p>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/service/authService'

const email = ref('')
const senha = ref('')
const errorMessage = ref('')
const router = useRouter()

 async function handleLogin() {
  try {
    const { token } = await login(email.value, senha.value)

    if (token) {
      window.dispatchEvent(new Event('login-status-changed')) 
      router.push('/') 
    }
  } catch (error) {
    console.error('Erro no login:', error)
  }
}

function goBack() {
  router.push('/')
}
</script>


<style scoped src="./Login.css"></style>
