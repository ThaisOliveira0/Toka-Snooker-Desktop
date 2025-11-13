<template>
  <div class="inventory-control">
    <header class="inventory-header">
      <h2>Controle de Estoque</h2>
      <div class="header-actions">
           <button class="add-btn" @click="openModal()">
          + Adicionar Item
        </button>
        <button class="stockWithdrawal" @click="openWithdrawal()">
          Retirar Itens
        </button>
      </div>
    </header>

    <main class="inventory-content">
      <section class="inventory-list">
        <div class="inventory-actions">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar item..."
          />
          <select v-model="selectedCategory">
            <option value="">Todas Categorias</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <div class="table-container-inventory">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço (R$)</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredItems"
                :key="item.id"
                :class="{
                  'low-stock-row': item.estoque <= (item.qtde_min ?? 5),
                }"
              >
                <td>
                  <div class="product-cell">
                    <span class="product-name">{{ item.nome }}</span>
                  </div>
                </td>
                <td>
                  <span class="category-tag">{{ item.categoria }}</span>
                </td>
                <td>R$ {{ (item.preco ?? 0).toFixed(2) }}</td>
                <td>
                  <div class="stock-wrapper">
                    <div class="stock-bar">
                      <div
                        class="bar-fill"
                        :style="{
                          width: Math.min((item.estoque / 40) * 100, 100) + '%',
                          background:
                            item.estoque <= (item.qtde_min ?? 5)
                              ? '#e74c3c'
                              : '#4caf50',
                        }"
                      ></div>
                    </div>
                    <span class="stock-value">{{ item.estoque }}</span>
                  </div>
                </td>

                <td class="actions">
                  <button class="edit-btn-control" @click="openModal(item)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="remove-btn" @click="requestDelete(item)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="filteredItems.length === 0">
                <td colspan="5" class="no-results">
                  Nenhum produto encontrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <aside class="inventory-summary">
        <h3>Resumo</h3>
        <div class="summary-item">
          <span>Total de Itens</span>
          <span>{{ totalItems }}</span>
        </div>
        <div class="summary-item">
          <span>Valor Total em Estoque</span>
          <span>R$ {{ totalValue.toFixed(2) }}</span>
        </div>
        <div
          class="summary-item clickable"
          :class="{ active: showLowStockOnly }"
          @click="filterLowStock"
        >
          <span>Itens com Estoque Baixo</span>
          <span>{{ lowStockCount }}</span>
        </div>
      </aside>
    </main>

    <ProductModal
      :show="showModal"
      :editingItem="editingItem"
      :form="form"
      :loading="saving"
      @close="closeModal"
      @save="saveItem"
    />

    <ConfirmModal
      :show="showConfirm"
      title="Excluir Produto"
      message="Tem certeza que deseja excluir este produto?"
      @close="showConfirm = false"
      @confirm="handleConfirmDelete"
    />

    <StockWithdrawal
      :show="showWithdrawal"
      @close="showWithdrawal = false"
      @update="refreshInventory"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import ProductModal from "./Components/ProductModal.vue";
import StockWithdrawal from "./Components/StockWithdrawal.vue";
import "./InventoryControl.css";
import inventoryService from "../../service/inventoryService";
import { useToast } from 'vue-toastification'

const toast = useToast()
const searchQuery = ref("");
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const selectedCategory = ref("");
const showModal = ref(false);
const editingItem = ref(null);
const items = ref([]);
const form = ref({
  nome: "",
  categoria: "",
  preco: 0,
  estoque: 0,
  qtde_min: 5,
});

const showConfirm = ref(false);
const itemToDelete = ref(null);

onMounted(async () => {
  loading.value = true;
  try {
    const data = await inventoryService.getInventory();
    if (Array.isArray(data)) {
      items.value = data.map((i) => ({
        ...i,
        preco: i.preco_unit,
        estoque: i.qtde_estoque,
        qtde_min: i.qtde_min ?? 5,
      }));
    }
  } catch (error) {
    console.error("Erro ao carregar itens:", error);
  } finally {
    loading.value = false;
  }
});
const showWithdrawal = ref(false);

const openWithdrawal = () => {
  showWithdrawal.value = true;
};

const refreshInventory = async () => {
  const data = await inventoryService.getInventory();
  items.value = data.map((i) => ({
    ...i,
    preco: i.preco_unit,
    estoque: i.qtde_estoque,
    qtde_min: i.qtde_min ?? 5,
  }));
};

const showLowStockOnly = ref(false);
const filterLowStock = () => (showLowStockOnly.value = !showLowStockOnly.value);

const filteredItems = computed(() => {
  return items.value.filter((i) => {
    const matchSearch =
      !searchQuery.value ||
      i.nome.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCategory =
      !selectedCategory.value || i.categoria === selectedCategory.value;
    const matchLowStock =
      !showLowStockOnly.value || i.estoque <= (i.qtde_min ?? 5);
    return matchSearch && matchCategory && matchLowStock;
  });
});

const categories = computed(() => [
  ...new Set(items.value.map((i) => i.categoria)),
]);

const totalItems = computed(() => items.value.length);
const totalValue = computed(() =>
  items.value.reduce((sum, i) => sum + (i.preco ?? 0) * (i.estoque ?? 0), 0)
);
const lowStockCount = computed(
  () => items.value.filter((i) => i.estoque <= (i.qtde_min ?? 5)).length
);

const openModal = (item = null) => {
  showModal.value = true;
  if (item) {
    editingItem.value = item;
    form.value = { ...item };
  } else {
    editingItem.value = null;
    form.value = {
      nome: "",
      categoria: "",
      preco: 0,
      estoque: 0,
      qtde_min: 5,
    };
  }
};

const closeModal = () => {
  showModal.value = false;
};

const saveItem = async (formData) => {
  saving.value = true;
  const payload = {
    nome: formData.nome,
    categoria: formData.categoria,
    preco_unit: formData.preco,
    qtde_estoque: formData.estoque,
    qtde_min: formData.qtde_min,
  };

  try {
  if (editingItem.value) {
     await inventoryService.updateItem(editingItem.value.id, payload);
      const index = items.value.findIndex((i) => i.id === editingItem.value.id);
      items.value[index] = { ...items.value[index], ...formData };
    toast.success('Item atualizado com sucesso!')
  } else {
    const newItem = await inventoryService.createItem(payload);
    items.value.push({
      ...newItem,
      preco: newItem.preco_unit,
      estoque: newItem.qtde_estoque,
      qtde_min: newItem.qtde_min,
  });
    toast.success('Item adicionado com sucesso!')
  }
    await refreshInventory();
    closeModal();
} catch (error) {
  console.error("Erro ao salvar item:", error);
  toast.error('Erro ao salvar o item. Tente novamente.')
} finally {
  saving.value = false;
}
};

const requestDelete = (item) => {
  itemToDelete.value = item;
  showConfirm.value = true;
};

const handleConfirmDelete = async () => {
  if (!itemToDelete.value) return;
  try {
    await inventoryService.deleteItem(itemToDelete.value.id);
    items.value = items.value.filter((i) => i.id !== itemToDelete.value.id);
  toast.success('Item excluído com sucesso!')
} catch (error) {
   console.error("Erro ao excluir item:", error);
  toast.error('Erro ao excluir o item. Tente novamente.')
} finally {
    showConfirm.value = false;
    itemToDelete.value = null;
}
};
</script>
