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
import { useToast } from 'vue-toastification'

const email = ref('')
const senha = ref('')
const errorMessage = ref('')
const router = useRouter()
const toast = useToast()

async function handleLogin() {
  errorMessage.value = '' 

  if (!email.value || !senha.value) {
    toast.warning('Por favor, preencha todos os campos.', { position: 'top-right' })
    return
  }

  try {
    const { token, role } = await login(email.value, senha.value)

    if (token) {
      toast.success('Login realizado com sucesso!', { position: 'top-right' })
      window.dispatchEvent(new Event('login-status-changed'))
      router.push('/')
    }
  } catch (error) {
    console.error('Erro no login:', error)

    if (error.response) {
      const status = error.response.status

      switch (status) {
        case 400:
          errorMessage.value = 'Dados inválidos. Verifique o e-mail e senha.'
          break
        case 401:
          errorMessage.value = 'E-mail ou senha incorretos ou não autorizados.'
          break
        case 404:
          errorMessage.value = 'E-mail não encontrado. Verifique e tente novamente.'
          break
        case 500:
          errorMessage.value = 'Erro interno no servidor. Tente novamente mais tarde.'
          break
        default:
          errorMessage.value = `Erro inesperado (${status}).`
      }
    } else {
      errorMessage.value = 'Falha de conexão. Verifique sua internet.'
      toast.error(errorMessage.value, { position: 'top-right' })
    }
  }
}

function goBack() {
  router.push('/')
}
</script>


<style scoped src="./Login.css"></style>
