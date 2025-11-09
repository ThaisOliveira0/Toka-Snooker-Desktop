<template>
  <div class="reset-background" @click="goBack">
    <div class="reset-container" @click.stop>
      <div class="reset-side left">
        <img src="/images/logo.png" alt="Logo" class="reset-logo" />
      </div>

      <div class="reset-side right">
        <form class="reset-form" @submit.prevent="handleResetPassword">
          <h2>Redefinir Senha</h2>

          <div class="reset-avatar">
            <i class="fas fa-lock-open"></i>
          </div>

          <p class="reset-info-text">
            Digite e confirme sua nova senha para concluir a redefinição.
          </p>

          <div class="password-field">
            <input
              :type="showNovaSenha ? 'text' : 'password'"
              placeholder="Nova senha"
              v-model="novaSenha"
            />
            <i
              class="fas"
              :class="showNovaSenha ? 'fa-eye-slash' : 'fa-eye'"
              @click="showNovaSenha = !showNovaSenha"
            ></i>
          </div>

          <div class="password-field">
            <input
              :type="showConfirmarSenha ? 'text' : 'password'"
              placeholder="Confirmar nova senha"
              v-model="confirmarSenha"
            />
            <i
              class="fas"
              :class="showConfirmarSenha ? 'fa-eye-slash' : 'fa-eye'"
              @click="showConfirmarSenha = !showConfirmarSenha"
            ></i>
          </div>

          <button class="reset-button" type="submit">
            Redefinir senha
          </button>

          <p v-if="successMessage" class="reset-success">{{ successMessage }}</p>
          <p v-if="errorMessage" class="reset-error">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { resetPassword } from "@/service/authService.js"

const router = useRouter()

const novaSenha = ref("")
const confirmarSenha = ref("")
const successMessage = ref("")
const errorMessage = ref("")
const userId = sessionStorage.getItem('recoveryUserId')

const showNovaSenha = ref(false)
const showConfirmarSenha = ref(false)

async function handleResetPassword() {
  errorMessage.value = ""
  successMessage.value = ""

  if (!novaSenha.value || !confirmarSenha.value) {
    errorMessage.value = "Preencha todos os campos."
    return
  }

  if (novaSenha.value !== confirmarSenha.value) {
    errorMessage.value = "As senhas não conferem."
    return
  }

  try {
    const response = await resetPassword(userId, novaSenha.value)
    if (response.sucesso) {
      successMessage.value = response.mensagem || "Senha redefinida com sucesso!"
      sessionStorage.removeItem('recoveryUserId')
      sessionStorage.removeItem('recoveryEmail')
      router.push("/login")
    } else {
      errorMessage.value = response.mensagem || "Erro ao redefinir senha."
    }
  } catch (err) {
    console.error("Erro ao redefinir senha:", err)
    errorMessage.value = "Erro ao redefinir senha. Tente novamente."
  }
}

function goBack() {
  router.push('/')
}
</script>

<style scoped src="./ResetPassword.css"></style>
