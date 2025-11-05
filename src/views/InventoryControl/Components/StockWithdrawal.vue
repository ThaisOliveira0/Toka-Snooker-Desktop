<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <header class="modal-header">
        <h3>Retirada de Itens do Estoque</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </header>

      <div class="modal-body">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Estoque Atual</th>
              <th>Retirar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.nome }}</td>
              <td>{{ item.estoque }}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  :max="item.estoque"
                  v-model.number="withdrawals[item.id]"
                  class="input-small"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="modal-footer">
        <button class="cancel-btn" @click="$emit('close')">Cancelar</button>
        <button class="confirm-btn" @click="confirmWithdrawal">Confirmar Retirada</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import inventoryService from "@/service/inventoryService";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close", "update"]);

const items = ref([]);
const withdrawals = ref({});

onMounted(async () => {
  try {
    const data = await inventoryService.getInventory();
    items.value = data.map((i) => ({
      ...i,
      estoque: i.qtde_estoque,
    }));
  } catch (error) {
    console.error("Erro ao carregar estoque:", error);
  }
});

const confirmWithdrawal = async () => {
  const toWithdraw = Object.entries(withdrawals.value)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => ({
      id: parseInt(id),
      qty,
    }));

  if (toWithdraw.length === 0) {
    alert("Nenhum item selecionado para retirada.");
    return;
  }

  try {
    for (const item of toWithdraw) {
      await inventoryService.updateItem(item.id, { retirar: item.qty });
    }
    alert("Retirada realizada com sucesso!");
    emit("update"); 
    emit("close");
  } catch (error) {
    console.error("Erro ao retirar itens:", error);
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal {
  background: #fff;
  border-radius: 16px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.input-small {
  width: 80px;
  text-align: center;
}

.confirm-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #ccc;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 10px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

.close-btn:hover {
  color: #e74c3c;
  transform: scale(1.2);
}

.close-btn:active {
  transform: scale(1);
}

</style>
