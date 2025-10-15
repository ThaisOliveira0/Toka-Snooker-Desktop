<template>
  <div class="login-container">
    <div class="login-left">
      <!-- <img src="@/assets/logo.png" alt="Logo" class="logo" /> -->
    </div>

    <div class="login-right">
      <div class="login-form">
        <h2>LOGIN</h2>
        <div class="avatar">
          <i class="fas fa-user"></i>
        </div>

        <input type="email" placeholder="E-mail" v-model="email" />
        <input type="password" placeholder="Senha" v-model="senha" />

        <button class="login-button" @click="handleLogin">Entrar</button>

        <a href="#" class="forgot-password">Esqueci minha senha</a>
        <p class="signup-text">
          Novo por aqui? <a href="/cadastro">Cadastre-se!</a>
        </p>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/service/authService'; 


const email = ref('');
const senha = ref('');
const errorMessage = ref(''); 
const router = useRouter();

async function handleLogin() {
  errorMessage.value = ''; 

  if (!email.value || !senha.value) {
    errorMessage.value = 'Por favor, preencha todos os campos.';
    return;
  }

  try {
    const response = await login(email.value, senha.value);
    console.log('Login realizado com sucesso:', response);

    router.push('/comandas');
  } catch (error) {
    console.error('Erro no login:', error.response?.data || error);
    errorMessage.value = 'Login falhou. Verifique seus dados.';
  }
}
</script>

<style src="./login.css"></style>
