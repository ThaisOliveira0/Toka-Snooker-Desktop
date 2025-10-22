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

          <input
            type="password"
            placeholder="Nova senha"
            v-model="novaSenha"
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            v-model="confirmarSenha"
          />

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

const router = useRouter()

const novaSenha = ref("")
const confirmarSenha = ref("")
const successMessage = ref("")
const errorMessage = ref("")

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
    successMessage.value = "Senha redefinida com sucesso!"
    setTimeout(() => router.push("/login"), 2000)
  } catch (err) {
    errorMessage.value = "Erro ao redefinir senha. Tente novamente."
  }
}

function goBack() {
  router.push('/')
}
</script>


<style scoped src="./ResetPassword.css"></style>
