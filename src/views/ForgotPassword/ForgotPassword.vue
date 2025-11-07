<template>
  <div class="auth-background" @click="goBack">
    <div class="auth-container login" @click.stop>
      <div class="auth-side left">
        <img src="/images/logo.png" alt="Logo" class="logo" />
      </div>

      <div class="auth-side right">
        <form class="auth-form" @submit.prevent="handlePasswordReset">
          <button class="back-button" @click.prevent="goBack">
            <i class="fas fa-arrow-left"></i>
          </button>

          <h2>Recuperar senha</h2>
          <div class="avatar">
            <i class="fas fa-envelope"></i>
          </div>

          <p class="info-text">
            Digite o e-mail cadastrado para receber o código de redefinição de
            senha.
          </p>

          <input type="email" placeholder="E-mail" v-model="email" />

          <button class="auth-button" type="submit" :disabled="loading">
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-if="!loading">Enviar código</span>
          </button>

          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { sendCode } from "@/service/authService.js";
import { useToast } from "vue-toastification";

const email = ref("");
const successMessage = ref("");
const errorMessage = ref("");
const loading = ref(false);
const router = useRouter();

async function handlePasswordReset() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!email.value) {
    errorMessage.value = "Por favor, insira seu e-mail.";
    return;
  }

  loading.value = true;

  try {
    const response = await sendCode(email.value);

    if (response) {
      successMessage.value = response.message || "Código enviado com sucesso!";
      sessionStorage.setItem("recoveryEmail", email.value);
      router.push("/inserir-codigo");
    } else {
      errorMessage.value = response.message || "Erro ao enviar o código.";
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = "Erro no servidor. Tente novamente mais tarde.";
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push("/");
}
</script>

<style scoped src="./ForgotPassword.css"></style>
