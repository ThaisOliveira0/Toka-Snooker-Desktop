<template>
  <div class="auth-background" @click="goBack">
    <div class="auth-container login" @click.stop>
      <div class="auth-side left">
        <img src="/images/logo.png" alt="Logo" class="logo" />
      </div>

      <div class="auth-side right">
        <form class="auth-form" @submit.prevent="handlePasswordReset">
          <button class="back-button" type="button" @click.prevent="goBack">
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
const toast = useToast();

async function handlePasswordReset() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!email.value.trim()) {
    toast.warning("Por favor, preencha o campo de e-mail.", { position: "top-right" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    toast.warning("Por favor, insira um e-mail válido.", { position: "top-right" });
    return;
  }

  loading.value = true;

  try {
    const response = await sendCode(email.value);

    if (response) {
      toast.success(response.message || "Código enviado com sucesso!", {
        position: "top-right",
      });
      sessionStorage.setItem("recoveryEmail", email.value);
      router.push("/inserir-codigo");
    } else {
      toast.error("Não foi possível enviar o código. Tente novamente.", {
        position: "top-right",
      });
    }
  } catch (error) {
    console.error(error);

    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          toast.warning("E-mail inválido ou mal formatado.", { position: "top-right" });
          break;
        case 401:
          toast.error("E-mail não autorizado ou não cadastrado.", { position: "top-right" });
          break;
        case 404:
          toast.error("E-mail não encontrado no sistema.", { position: "top-right" });
          break;
        case 500:
          toast.error("Erro interno do servidor. Tente novamente mais tarde.", { position: "top-right" });
          break;
        default:
          toast.error(`Erro inesperado (${status}).`, { position: "top-right" });
      }
    } else {
      toast.error("Falha na conexão. Verifique sua internet e tente novamente.", {
        position: "top-right",
      });
    }
  } finally {
    loading.value = false;
  }
}


function goBack() {
  router.push("/");
}
</script>

<style scoped src="./ForgotPassword.css"></style>
