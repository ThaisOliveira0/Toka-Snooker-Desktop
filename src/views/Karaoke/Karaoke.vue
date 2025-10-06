<template>
  <div class="karaoke-container">
    <header class="karaoke-header">
      <button class="back-button">←</button>
      <!-- <img src="@/assets/toka-logo.png" alt="Toka Logo" class="logo" /> -->
      <div class="header-icon">TOKA</div>
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
import './Karaoke.css'

const waitlist = [
  { table: '07', name: 'Mariana', song: 'Dancing Queen' },
  { table: '09', name: 'João', song: 'Blue Bird' },
  { table: '02', name: 'Carlos', song: 'Não Quero Dinheiro' },
]

const current = {
  table: '01',
  name: 'Marco',
  song: 'Evidências',
}
</script>
