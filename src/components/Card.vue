<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
})
</script>

<style scoped>
.card {
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  text-align: center;
  min-width: 20%;
}
</style>
