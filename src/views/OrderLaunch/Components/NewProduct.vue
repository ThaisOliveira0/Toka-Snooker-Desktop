<template>
  <div v-if="show" class="product-modal-overlay" @click.self="close">
    <div class="product-modal-content">
      <h3>{{ editingItem ? "Editar Produto" : "Novo Produto" }}</h3>

      <div class="product-form-group">
        <label>Nome</label>
        <input v-model="localForm.nome" type="text" placeholder="Digite o nome do produto" />
      </div>

      <div class="product-form-group">
        <label>Descrição</label>
        <input v-model="localForm.descricao" type="text" placeholder="Ex: Coca, Guaraná..." />
      </div>

      <div class="product-form-group">
        <label>Categoria</label>
        <input v-model="localForm.categoria" type="text" placeholder="Ex: Bebidas, Lanches..." />
      </div>

      <div class="product-form-group">
        <label>Preço</label>
        <input v-model.number="localForm.preco" type="number" min="0" placeholder="0.00" />
      </div>

      <div class="product-form-group">
        <label>Preço Promocional</label>
        <input v-model.number="localForm.preco_promo" type="number" min="0" placeholder="0.00" />
      </div>

      <div class="product-form-group">
        <label>Promo?</label>
        <input type="checkbox" v-model="localForm.promo" />
      </div>

      <div class="product-form-group">
        <label>Foto</label>
        <input v-model="localForm.foto" type="text" placeholder="Nome do arquivo, ex: coca_cola.jpg" />
      </div>

      <div class="product-modal-actions">
        <button class="product-cancel-btn" @click="close">Cancelar</button>
        <button class="product-save-btn" @click="save" :disabled="loading">
          <span v-if="loading" class="product-spinner"></span>
          <span v-else>{{ editingItem ? "Atualizar" : "Salvar" }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  show: Boolean,
  editingItem: Object,
  form: Object,
});

const emit = defineEmits(["close", "save"]);
const loading = ref(false);
const localForm = ref({ ...props.form });

watch(
  () => props.form,
  (newVal) => {
    localForm.value = { ...newVal };
  },
  { deep: true }
);

const close = () => emit("close");

const save = async () => {
  loading.value = true;
  try {
    await emit("save", localForm.value);
  } finally {
    loading.value = false;
  }
};
</script>


<style scoped>
.product-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.product-modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-form-group {
  display: flex;
  flex-direction: column;
}

.product-form-group label {
  font-weight: 500;
  margin-bottom: 4px;
}

.product-form-group input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.product-form-group input:focus {
  border-color: #4caf50;
  outline: none;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.product-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.product-save-btn {
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.product-save-btn:hover {
  background-color: #43a047;
}

.product-cancel-btn {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.product-cancel-btn:hover {
  background-color: #bdbdbd;
}

.product-spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4caf50;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: product-spin 1s linear infinite;
  display: inline-block;
}

@keyframes product-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
