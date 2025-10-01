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

        <input type="email" placeholder="E-mail" />
        <input type="password" placeholder="Senha" />

        <button class="login-button">Entrar</button>
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

<style src="./login.css"></style>
