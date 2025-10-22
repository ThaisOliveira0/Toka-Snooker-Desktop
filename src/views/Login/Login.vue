<template>
  <div class="auth-background">
  <div class="auth-container login">
    <div class="auth-side left">
      <img src="/images/logo.png" alt="Logo" class="logo" />
    </div>

    <div class="auth-side right">
      <form class="auth-form">
        <button class="back-button" @click="goBack">
          ← Voltar
        </button>

        <h2>Login</h2>
        <div class="avatar">
          <i class="fas fa-user"></i>
        </div>

        <input type="email" placeholder="E-mail" v-model="email" />
        <input type="password" placeholder="Senha" v-model="senha" />

        <button class="auth-button" @click.prevent="handleLogin">
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
    if (!email.value || !senha.value) {
      errorMessage.value = 'Preencha todos os campos.'
      return
    }
    await login(email.value, senha.value)
    router.push('/comandas')
  } catch {
    errorMessage.value = 'Login falhou. Verifique seus dados.'
  }
}
function goBack() {
  router.push('/') 
}
</script>

<style scoped src="./Login.css"></style>
