<template>
  <div class="register-container">
    <div class="register-left">
      <!-- <img src="@/assets/logo.png" alt="Logo" class="logo" /> -->
    </div>

    <div class="register-right">
      <div class="register-form">
        <h2>CADASTRO</h2>
        <div class="avatar">
          <i class="fas fa-user-plus"></i>
        </div>

        <input type="text" placeholder="Nome completo" v-model="nome" />
        <input type="email" placeholder="E-mail" v-model="email" />
        <input type="text" placeholder="Telefone" v-model="telefone" />
        <input type="password" placeholder="Senha" v-model="senha" />
        <input type="password" placeholder="Confirmar senha" v-model="confirmarSenha" />

        <label for="role">Tipo de usuário:</label>
        <select id="role" v-model="tipoUsuario">
          <option value="FUNCIONARIO">Funcionário</option>
          <option value="ADMIN">Administrador</option>
        </select>

        <button class="register-button" @click="handleRegister">Cadastrar</button>

        <p class="signup-text">
          Já tem uma conta? <a href="/login">Faça Login!</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { register } from '@/service/authService.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const nome = ref('');
const email = ref('');
const telefone = ref('');
const senha = ref('');
const confirmarSenha = ref('');
const tipoUsuario = ref('FUNCIONARIO');

const handleRegister = async () => {
  if (!nome.value || !email.value || !telefone.value || !senha.value || !confirmarSenha.value) {
    alert('Preencha todos os campos!');
    return;
  }

  if (senha.value !== confirmarSenha.value) {
    alert('As senhas não coincidem!');
    return;
  }

  try {
    await register(nome.value, email.value, telefone.value, senha.value, tipoUsuario.value);
    alert('Usuário cadastrado com sucesso!');
    router.push('/login');
  } catch (error) {
    alert(error.response?.data?.message || 'Erro ao cadastrar usuário');
  }
};
</script>



<style src="./register.css"></style>
