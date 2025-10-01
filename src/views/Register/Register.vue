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

        <input type="text" placeholder="Nome completo" />
        <input type="email" placeholder="E-mail" />
        <input type="password" placeholder="Senha" />
        <input type="password" placeholder="Confirmar senha" />

        <label for="role">Tipo de usuário:</label>
        <select id="role">
          <option value="funcionario">Funcionário</option>
          <option value="admin">Administrador</option>
        </select>

        <button class="register-button">Cadastrar</button>

        <p class="signup-text">
          Já tem uma conta? <a href="/login">Faça Login!</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style src="./register.css"></style>
