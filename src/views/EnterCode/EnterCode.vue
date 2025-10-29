<template>
  <div class="auth-background" @click="goBack">
    <div class="auth-container login" @click.stop>
      <div class="auth-side left">
        <img src="/images/logo.png" alt="Logo" class="logo" />
      </div>

      <div class="auth-side right">
        <form class="auth-form" @submit.prevent="verifyCode">
          <button class="back-button" @click.prevent="goBack">
            ← Voltar
          </button>

          <h2>Verificar código</h2>
          <div class="avatar">
            <i class="fas fa-key"></i>
          </div>

          <p class="info-text">
            Digite o código de verificação enviado para o seu e-mail.
          </p>

          <div class="code-inputs">
            <input v-for="(digit, index) in code" :key="index" type="text" maxlength="1" class="code-box"
              v-model="code[index]" @input="handleInput(index, $event)"
              @keydown.backspace="handleBackspace(index, $event)" ref="codeRefs" />
          </div>

          <button class="auth-button" type="submit">
            Verificar código
          </button>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { verifyCode as verifyCodeAPI } from '@/service/authService.js'
import './EnterCode.css'

const router = useRouter()
const code = ref(Array(6).fill(''))
const codeRefs = ref([])
const errorMessage = ref('')
const successMessage = ref('')

const email = sessionStorage.getItem('recoveryEmail')

function handleInput(index, event) {
  const value = event.target.value
  if (/^[0-9A-Za-z]$/.test(value)) {
    code.value[index] = value
    if (index < code.value.length - 1) {
      nextTick(() => codeRefs.value[index + 1].focus())
    }
  } else {
    code.value[index] = ''
  }
}

function handleBackspace(index, event) {
  if (event.key === 'Backspace' && !code.value[index] && index > 0) {
    nextTick(() => codeRefs.value[index - 1].focus())
  }
}

async function verifyCode() {
  const enteredCode = code.value.join('')

  if (enteredCode.length < 6) {
    errorMessage.value = 'Por favor, insira o código completo.'
    successMessage.value = ''
    return
  }

  try {
    const response = await verifyCodeAPI(email, enteredCode)

    if (response.sucesso) {
      successMessage.value = 'Código verificado com sucesso!'
      errorMessage.value = ''
      sessionStorage.setItem('recoveryUserId', response.id)

       router.push('/redefinir-senha')
    } else {
      errorMessage.value = response.mensagem || 'Código incorreto.'
      successMessage.value = ''
    }

  } catch (error) {
    console.error('Erro ao verificar código:', error)
    errorMessage.value = 'Erro ao verificar código.'
    successMessage.value = ''
  }
}

function goBack() {
  router.push('/')
}
</script>
