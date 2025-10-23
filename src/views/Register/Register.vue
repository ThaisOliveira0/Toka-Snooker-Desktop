<template>
  <div class="register-background" @click="handleBackgroundClick">
    <div class="register-container" @click.stop>
      <div class="register-side right">
        <img src="/images/logo.png" alt="Logo" class="register-logo" />
      </div>

      <div class="register-side left">
        <form class="register-form" @submit.prevent="handleRegister">
          <h2>Crie sua conta</h2>
          <div class="register-avatar">
            <i class="fas fa-user-plus"></i>
          </div>

          <input type="text" placeholder="Nome completo" v-model="nome" />
          <input type="email" placeholder="E-mail" v-model="email" />
          <input type="password" placeholder="Senha" v-model="senha" />
          <input type="password" placeholder="Confirmar senha" v-model="confirmarSenha" />

          <label for="role">Tipo de usuário:</label>
          <select id="role" v-model="tipo_usuario">
            <option value="funcionario">Funcionário</option>
            <option value="admin">Administrador</option>
          </select>

          <button class="register-button">Cadastrar</button>

          <p class="register-text">
            Já tem uma conta?
            <router-link to="/login">Faça login</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { register } from "@/service/authService.js"
import { useRouter } from "vue-router"

const router = useRouter()

const nome = ref("")
const email = ref("")
const telefone = ref("")
const senha = ref("")
const confirmarSenha = ref("")
const tipo_usuario = ref("funcionario")
const erro = ref("")
const sucesso = ref("")
const loading = ref(false)

async function handleRegister() {
  erro.value = ""
  sucesso.value = ""

  if (senha.value !== confirmarSenha.value) {
    erro.value = "As senhas não conferem."
    return
  }

  try {
    loading.value = true
    await register(nome.value, email.value, telefone.value, senha.value, tipo_usuario.value)
    sucesso.value = "Cadastro realizado com sucesso!"

    setTimeout(() => {
      router.push("/login")
    }, 2000)
  } catch (err) {
    erro.value = err.response?.data?.message || "Erro ao cadastrar. Tente novamente."
  } finally {
    loading.value = false
  }
}

function handleBackgroundClick() {
  router.push("/")
}
</script>

<style scoped src="./Register.css"></style>
