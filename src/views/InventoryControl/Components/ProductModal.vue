<template>
  <div v-if="show" class="inventory-modal" @click.self="close">
    <div class="modal-content">
      <h3>{{ editingItem ? "Editar Produto" : "Novo Produto" }}</h3>

      <div class="form-group">
        <label>Nome</label>
        <input
          v-model="localForm.nome"
          type="text"
          placeholder="Digite o nome do produto"
        />
      </div>

      <div class="form-group">
        <label>Categoria</label>
        <input
          v-model="localForm.categoria"
          type="text"
          placeholder="Ex: Bebidas, Lanches..."
        />
      </div>

      <div class="form-group">
        <label>Preço (R$)</label>
        <input
          v-model.number="localForm.preco"
          type="number"
          min="0"
          placeholder="0.00"
        />
      </div>

      <div class="form-group">
        <label>Quantidade em Estoque</label>
        <input
          v-model.number="localForm.estoque"
          type="number"
          min="0"
          placeholder="0"
        />
      </div>

      <div class="form-group">
        <label>Quantidade Mínima</label>
        <input
          v-model.number="localForm.qtde_min"
          type="number"
          min="0"
          placeholder="Ex: 5"
        />
      </div>

      <div class="modal-actions">
        <button class="cancel-btn" @click="close">Cancelar</button>
        <button class="save-btn" @click="save" :disabled="loading">
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ editingItem ? "Atualizar" : "Salvar" }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from "vue";

const props = defineProps({
  show: Boolean,
  editingItem: Object,
  form: Object,
  loading: Boolean,
});

const loading = ref(false);
const emit = defineEmits(["close", "save"]);

const localForm = ref({ ...props.form });

watch(
  () => props.form,
  (newVal) => {
    localForm.value = { ...newVal };
  },
  { deep: true }
);

const close = () => emit("close");
const save = () => emit("save", localForm.value);
const saveItem = async () => {
  loading.value = true;
  try {
    await emit("save", localForm.value);
  } finally {
    loading.value = false;
  }
};
</script>
<style scoped>
.inventory-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999; 
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-content .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.modal-content label {
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
}

.modal-content input {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.modal-content input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.modal-actions .save-btn {
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-actions .save-btn:hover {
  background-color: #43a047;
}

.modal-actions .cancel-btn {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.modal-actions .cancel-btn:hover {
  background-color: #bdbdbd;
}

</style>