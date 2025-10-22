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

          <h2>Verificar Código</h2>
          <div class="avatar">
            <i class="fas fa-key"></i>
          </div>

          <p class="info-text">
            Insira o código de verificação enviado para o seu e-mail.
          </p>

          <input
            type="text"
            placeholder="Código"
            v-model="codigo"
          />

          <button class="auth-button" @click.prevent="handleVerifyCode">
            Verificar
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
// import { verifyCode } from '@/service/authService'

const codigo = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

async function handleVerifyCode() {
  if (!codigo.value) {
    errorMessage.value = 'Por favor, insira o código.'
    successMessage.value = ''
    return
  }

  try {
    successMessage.value = 'Código verificado com sucesso!'
    errorMessage.value = ''
     router.push('/redefinir-senha')
  } catch {
    errorMessage.value = 'Código inválido. Tente novamente.'
    successMessage.value = ''
  }
}

function goBack() {
  router.push('/esqueci-senha')
}
</script>

<style scoped src="./EnterCode.css"></style>
