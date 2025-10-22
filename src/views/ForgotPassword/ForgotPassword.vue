<template>
  <div class="auth-background" @click="goBack">
    <div class="auth-container login" @click.stop>
      <div class="auth-side left">
        <img src="/images/logo.png" alt="Logo" class="logo" />
      </div>

      <div class="auth-side right">
        <form class="auth-form">
          <button class="back-button" @click="goBack">
            ← Voltar
          </button>

          <h2>Recuperar senha</h2>
          <div class="avatar">
            <i class="fas fa-envelope"></i>
          </div>

          <p class="info-text">
            Digite o e-mail cadastrado para receber o link de redefinição de senha.
          </p>

          <input
            type="email"
            placeholder="E-mail"
            v-model="email"
          />

          <button class="auth-button" @click.prevent="handlePasswordReset">
            Enviar link
          </button>

          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

async function handlePasswordReset() {
  if (!email.value) {
    errorMessage.value = 'Por favor, insira seu e-mail.'
    successMessage.value = ''
    return
  }

  try {
    successMessage.value = 'Link de redefinição enviado com sucesso!'
    errorMessage.value = ''
    router.push('/inserir-codigo')
  } catch (error) {
    errorMessage.value = 'Erro ao enviar o link. Verifique o e-mail informado.'
    successMessage.value = ''
  }
}

function goBack() {
  router.push('/')
}
</script>


<style scoped src="./ForgotPassword.css"></style>

