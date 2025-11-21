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
          <div class="password-wrapper">
            <input :type="showPassword ? 'text' : 'password'" placeholder="Senha" v-model="senha" />
            <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" @click="togglePassword"></i>
          </div>


          <button type="submit" class="auth-button" :disabled="loading">
            <span v-if="!loading">Entrar</span>
            <span v-else class="spinner"></span>
          </button>


          <a href="/esqueci-senha" class="forgot-password">Esqueci minha senha</a>

          <p class="signup-text" v-if="isAdmin">
            <span>Não tem uma conta?</span>
            <router-link to="/cadastro">
              Cadastre-se
            </router-link>
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
import { login } from '@/service/authservice'
import { useToast } from 'vue-toastification'
import { getDecodedToken } from '@/service/authservice.js'

const decoded = getDecodedToken()
const loading = ref(false)
const isAdmin = decoded?.role === 'ADMIN' || decoded?.tipo_usuario === 'ADMIN'
const email = ref('')
const senha = ref('')
const errorMessage = ref('')
const router = useRouter()
const toast = useToast()
const showPassword = ref(false)

function togglePassword() {
  showPassword.value = !showPassword.value
}

async function handleLogin() {
  if (loading.value) return

  loading.value = true
  errorMessage.value = ''

  if (!email.value || !senha.value) {
    toast.warning('Por favor, preencha todos os campos.')
    loading.value = false
    return
  }

  try {
    const { token } = await login(email.value, senha.value)

    if (token) {
      sessionStorage.setItem("token", token)
      toast.success('Login realizado com sucesso!')
      window.location.href = '/'
    }

  } catch (error) {
    console.error('Erro no login:', error)

    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 400: errorMessage.value = 'Dados inválidos.'; break
        case 401: errorMessage.value = 'E-mail ou senha incorretos.'; break
        case 404: errorMessage.value = 'E-mail não encontrado.'; break
        case 500: errorMessage.value = 'Erro interno no servidor.'; break
        default:  errorMessage.value = `Erro inesperado (${status}).`
      }
    } else {
      errorMessage.value = 'Falha de conexão.'
      toast.error(errorMessage.value)
    }

  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/')
}
</script>


<style scoped src="./Login.css"></style>
