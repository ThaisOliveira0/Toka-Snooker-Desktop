<template>
  <div v-if="show" class="confirm-modal" @click.self="close">
    <div class="confirm-content">
      <div class="confirm-header">{{ title }}</div>
      <p class="confirm-message">{{ message }}</p>
      <div class="confirm-actions">
        <button class="cancel-btn" @click="close">Cancelar</button>
        <button class="confirm-btn" @click="confirmAction">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: { type: String, default: 'Atenção' },
  message: { type: String, default: 'Tem certeza?' }
})

const emit = defineEmits(['close', 'confirm'])

const close = () => emit('close')
const confirmAction = () => emit('confirm')
</script>

<style scoped>
.confirm-modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirm-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #ddd;
  width: 90%;
  max-width: 360px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.confirm-header {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2e7d32;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.confirm-message {
  font-size: 1rem;
  color: #555;
  margin-top: 10px;
  margin-bottom: 20px;
}

.confirm-actions {
  display: flex;
  gap: 12px;
}

.confirm-actions button {
  all: unset; 
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  padding: 10px;
}

.confirm-actions .cancel-btn {
  background: #f0f0f0;
  color: #555;
}

.confirm-actions .cancel-btn:hover {
  background: #e0e0e0;
}

.confirm-actions .confirm-btn {
  background: #b71c1c;
  color: #fff;
}

.confirm-actions .confirm-btn:hover {
  background: #b71c1c;
}

</style>
