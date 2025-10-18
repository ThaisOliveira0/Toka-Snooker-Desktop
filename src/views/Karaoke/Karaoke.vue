<template>
  <div class="karaoke-container" ref="karaokeRef">
    <header class="karaoke-header">

 <div class="header-right">
        <button class="fullscreen-button" @click="toggleFullscreen">
          <i v-if="!isFullscreen" class="fa-solid fa-expand"></i>
          <i v-else class="fa-solid fa-compress"></i>
        </button>
      </div>
    </header>

    <main class="karaoke-content">
      <section class="waitlist">
        <h2>LISTA DE ESPERA:</h2>
        <ul>
          <li v-for="(item, index) in waitlist" :key="index">
            <p>Mesa {{ item.table }} - {{ item.name }}</p>
            <p>Música: {{ item.song }}</p>
          </li>
        </ul>
      </section>

      <!-- Palco -->
      <section class="stage">
        <h2>O PALCO É SEU:</h2>
        <div class="stage-card">
          <p class="table">Mesa {{ current.table }}</p>
          <h1 class="name">{{ current.name }}</h1>
          <p class="song">Música: {{ current.song }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import './Karaoke.css'

// Referência pro container principal
const karaokeRef = ref(null)
const isFullscreen = ref(false)

// Lista de espera
const waitlist = [
  { table: '07', name: 'Mariana', song: 'Dancing Queen' },
  { table: '09', name: 'João', song: 'Blue Bird' },
  { table: '02', name: 'Carlos', song: 'Não Quero Dinheiro' },
]

// Cantor atual
const current = {
  table: '01',
  name: 'Marco',
  song: 'Evidências',
}

// Alterna o modo tela cheia
const toggleFullscreen = async () => {
  if (!isFullscreen.value) {
    await karaokeRef.value.requestFullscreen()
  } else {
    await document.exitFullscreen()
  }
}

// Atualiza flag quando o fullscreen muda
document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})
</script>

