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
        <button class="save-btn" @click="save">
          {{ editingItem ? "Atualizar" : "Salvar" }}
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
});

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
</script>