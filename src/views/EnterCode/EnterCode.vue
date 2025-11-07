<template>
  <div class="auth-background" @click="goBack">
    <div class="auth-container login" @click.stop>
      <div class="auth-side left">
        <img src="/images/logo.png" alt="Logo" class="logo" />
      </div>

      <div class="auth-side right">
        <form class="auth-form" @submit.prevent="verifyCode">
          <button class="back-button" @click.prevent="goBack"> <i class="fas fa-arrow-left"></i></button>

          <h2>Verificar código</h2>
          <div class="avatar">
            <i class="fas fa-key"></i>
          </div>

          <p class="info-text">
            Digite o código de verificação enviado para o seu e-mail.
          </p>

          <div class="code-inputs">
            <input
              v-for="(digit, index) in code"
              :key="index"
              type="text"
              maxlength="1"
              class="code-box"
              v-model="code[index]"
              @input="handleInput(index, $event)"
              @keydown.backspace="handleBackspace(index, $event)"
              @paste="handlePaste($event)"
              ref="codeRefs"
            />
          </div>

          <button class="auth-button" type="submit" :disabled="loading">
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-if="!loading">Verificar código</span>
          </button>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { verifyCode as verifyCodeAPI } from "@/service/authService.js";
import "./EnterCode.css";

const router = useRouter();
const code = ref(Array(6).fill(""));
const codeRefs = ref([]);
const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);

const email = sessionStorage.getItem("recoveryEmail");

function handleInput(index, event) {
  const value = event.target.value;
  if (/^[0-9A-Za-z]$/.test(value)) {
    code.value[index] = value;
    if (index < code.value.length - 1) {
      nextTick(() => codeRefs.value[index + 1].focus());
    }
  } else {
    code.value[index] = "";
  }
}

function handleBackspace(index, event) {
  if (event.key === "Backspace" && !code.value[index] && index > 0) {
    nextTick(() => codeRefs.value[index - 1].focus());
  }
}

function handlePaste(event) {
  const inputIndex = codeRefs.value.indexOf(event.target);
  if (inputIndex !== 0) return;

  event.preventDefault();
  const paste = event.clipboardData.getData("text").trim();

  if (!/^[0-9]+$/.test(paste)) return;

  const chars = paste.slice(0, code.value.length).split("");
  chars.forEach((char, i) => {
    code.value[i] = char;
  });

  nextTick(() => {
    const nextIndex = Math.min(chars.length, code.value.length - 1);
    codeRefs.value[nextIndex]?.focus();
  });
}

async function verifyCode() {
  const enteredCode = code.value.join('')

  if (enteredCode.length < 6) {
    errorMessage.value = 'Por favor, insira o código completo.'
    successMessage.value = ''
    return
  }

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
   const response = await verifyCodeAPI(email, enteredCode)

    if (response.sucesso) {
     successMessage.value = 'Código verificado com sucesso!'
     sessionStorage.setItem('recoveryUserId', response.id)

       router.push('/redefinir-senha')
    } else {
    errorMessage.value = response.mensagem || 'Código incorreto.'
    }
  } catch (error) {
    console.error('Erro ao verificar código:', error)
    errorMessage.value = 'Erro ao verificar código.'
  } finally {
    loading.value = false;
  }
}

function goBack() {
   router.push('/')
}
</script>
