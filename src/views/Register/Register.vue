<template>
 <div class="auth-background">
  <div class="auth-container register">
    <div class="auth-side right">
      <img src="/images/logo.png" alt="Logo" class="logo" />
    </div>

    <div class="auth-side left">
      <form class="auth-form">
        <h2>Crie sua conta</h2>
        <div class="avatar">
          <i class="fas fa-user-plus"></i>
        </div>

        <input type="text" placeholder="Nome completo" />
        <input type="email" placeholder="E-mail" />
        <input type="password" placeholder="Senha" />
        <input type="password" placeholder="Confirmar senha" />

        <label for="role">Tipo de usuário:</label>
        <select id="role">
          <option value="funcionario">Funcionário</option>
          <option value="admin">Administrador</option>
        </select>

        <button class="auth-button">Cadastrar</button>

        <p class="signup-text">
          Já tem uma conta? <router-link to="/login">Faça login</router-link>
        </p>
      </form>
    </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style  src="./Register.css"></style>
