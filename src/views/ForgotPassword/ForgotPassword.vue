<template>
  <div class="forgotPassword-container">
    <div class="forgotPassword-left">
      <!-- <img src="@/assets/logo.png" alt="Logo" class="logo" /> -->
    </div>

    <div class="forgotPassword-right">
      <div class="forgotPassword-form">
        <h2>forgotPassword</h2>
        <div class="avatar">
          <i class="fas fa-user"></i>
        </div>

        <input type="email" placeholder="E-mail" />
        <input type="password" placeholder="Senha" />

        <button class="forgotPassword-button">Entrar</button>
        <a href="#" class="forgot-password">Esqueci minha senha</a>
        <p class="signup-text">
          Novo por aqui? <a href="/cadastro">Cadastre-se!</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style src="./ForgotPassword.css"></style>
