<template>
  <div v-show="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <header class="modal-header">
        <h3>Retirada de Itens do Estoque</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </header>

      <div class="filter-box">
        <input type="text" v-model="searchQuery" placeholder="Buscar produto..." class="filter-input" />
        <button class="confirm-btn" @click="confirmWithdrawal">
          Confirmar Retirada
        </button>
      </div>

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
            <tr v-for="item in filteredItems" :key="item.id">
              <td>{{ item.nome }}</td>
              <td>{{ item.estoque }}</td>
              <td>
                <div class="input-wrapper">
                  <button type="button" class="input-btn" @click="decrease(item.id)"
                    :disabled="withdrawals[item.id] <= 0">
                    -
                  </button>
                  <input type="number" min="0" :max="item.estoque" v-model.number="withdrawals[item.id]"
                    class="input-number" />
                  <button type="button" class="input-btn" @click="increase(item.id, item.estoque)">
                    +
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import inventoryService from "@/service/inventoryService";
import { useToast } from "vue-toastification"
const toast = useToast()
const props = defineProps({
  show: Boolean,
});


const emit = defineEmits(["close", "update"]);

const items = ref([]);
const withdrawals = ref({});
const searchQuery = ref("");


onMounted(async () => {
  try {
    const data = await inventoryService.getInventory();
    items.value = data.map((i) => ({
      ...i,
      estoque: i.qtde_estoque,
    }));

    withdrawals.value = Object.fromEntries(items.value.map((i) => [i.id, 0]));
  } catch (error) {
    console.error("Erro ao carregar estoque:", error);
  }
});
watch(() => props.show, async (val) => {
  if (val) {
    try {
      const data = await inventoryService.getInventory();
      items.value = data.map((i) => ({
        ...i,
        estoque: i.qtde_estoque,
      }));

      withdrawals.value = Object.fromEntries(items.value.map((i) => [i.id, 0]));
    } catch (error) {
      console.error("Erro ao recarregar estoque:", error);
      toast.error("Erro ao atualizar o estoque.");
    }
  }
});


const increase = (id, max) => {
  if (withdrawals.value[id] < max) withdrawals.value[id]++;
};

const decrease = (id) => {
  if (withdrawals.value[id] > 0) withdrawals.value[id]--;
};

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return items.value.filter((i) => i.nome.toLowerCase().includes(query));
});

const confirmWithdrawal = async () => {
  const toWithdraw = Object.entries(withdrawals.value)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = items.value.find(i => i.id === parseInt(id));
      const novoEstoque = item.estoque - qty;

      return {
        id: parseInt(id),
        qtde: novoEstoque,
      };
    });

  if (toWithdraw.length === 0) {
    toast.warning("Nenhum item selecionado para retirada.");
    return;
  }

  try {
    await inventoryService.patchItem(toWithdraw);
    toast.success("Retirada realizada com sucesso!");

    withdrawals.value = Object.fromEntries(items.value.map((i) => [i.id, 0]));

    emit("update");
    emit("close");
  } catch (error) {
    console.error("Erro ao retirar itens:", error);
    toast.error("Erro ao retirar itens do estoque.");
  }
};

</script>

<style scoped>
.modal-overlay {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999 !important;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  position: relative;
  display: block;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

.input-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.input-number {
  width: 60px;
  text-align: center;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.input-number:focus {
  border-color: #4caf50;
}

.input-btn {
  background-color: #e0e0e0;
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.input-btn:hover {
  background-color: #d5d5d5;
}

.input-btn:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.input-number::-webkit-outer-spin-button,
.input-number::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* .input-number[type="number"] {
  -moz-appearance: textfield;
} */

.filter-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.filter-input {
  flex: 1;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.filter-input:focus {
  border-color: #4caf50;
}

.confirm-btn {
  height: 40px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.confirm-btn:hover {
  background-color: #45a049;
}
</style>
