<template>
  <div class="inventory-control">
    <header class="inventory-header">
      <h2>Controle de Estoque</h2>
    </header>

    <main class="inventory-content">
      <section class="inventory-list">
        <div class="inventory-actions">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar produto..."
          />
          <select v-model="selectedCategory">
            <option value="">Todas Categorias</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
          <button class="add-btn" @click="openModal()">
            + Adicionar Produto
          </button>
        </div>

        <table class="inventory-table">
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
              :class="{ 'low-stock': item.estoque <= 5 }"
            >
              <td>{{ item.nome }}</td>
              <td>{{ item.categoria }}</td>
              <td>{{ (item.preco ?? 0).toFixed(2) }}</td>
              <td>{{ item.estoque }}</td>
              <td class="action-icons">
                <button class="edit-btn" @click="openModal(item)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="remove-btn" @click="requestDelete(item)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>

            <tr v-if="filteredItems.length === 0">
              <td colspan="5" class="no-results">Nenhum produto encontrado</td>
            </tr>
          </tbody>
        </table>
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
          class="summary-item"
          :class="{ active: showLowStockOnly }"
          @click="filterLowStock"
        >
          <span>Itens com Estoque Baixo</span>
          <span>{{ lowStockCount }}</span>
        </div>
      </aside>
    </main>

    <div v-if="showModal" class="inventory-modal" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ editingItem ? "Editar Produto" : "Novo Produto" }}</h3>

        <label>Nome</label>
        <input v-model="form.nome" type="text" />

        <label>Categoria</label>
        <input v-model="form.categoria" type="text" />

        <label>Preço (R$)</label>
        <input v-model.number="form.preco" type="number" min="0" />

        <label>Quantidade em Estoque</label>
        <input v-model.number="form.estoque" type="number" min="0" />

        <div class="modal-actions">
          <button @click="saveItem">Salvar</button>
          <button class="cancel-btn" @click="closeModal">Cancelar</button>
        </div>
      </div>
    </div>

    <ConfirmModal
      :show="showConfirm"
      title="Excluir Produto"
      message="Tem certeza que deseja excluir este produto?"
      @close="showConfirm = false"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import "./inventoryControl.css";
import orderService from "../../service/ordersService";

const searchQuery = ref("");
const selectedCategory = ref("");
const showModal = ref(false);
const editingItem = ref(null);
const items = ref([]);
const form = ref({
  nome: "",
  categoria: "",
  preco: 0,
  estoque: 0,
});

const showConfirm = ref(false);
const itemToDelete = ref(null);

const mockItems = [
  { id: 1, nome: "X-Burguer", categoria: "Lanches", preco: 12.5, estoque: 10 },
  {
    id: 2,
    nome: "Coca-Cola 350ml",
    categoria: "Bebidas",
    preco: 5.0,
    estoque: 3,
  },
  {
    id: 3,
    nome: "Sorvete Chocolate",
    categoria: "Sobremesas",
    preco: 8.0,
    estoque: 2,
  },
  {
    id: 4,
    nome: "Pizza Calabresa",
    categoria: "Lanches",
    preco: 35.0,
    estoque: 6,
  },
];

onMounted(async () => {
  try {
    const response = await orderService.getAllProdutos();
    if (Array.isArray(response.data) && response.data.length) {
      items.value = response.data;
    } else {
      items.value = mockItems;
    }
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
});
const showLowStockOnly = ref(false)

const filterLowStock = () => {
  showLowStockOnly.value = !showLowStockOnly.value
}

const filteredItems = computed(() => {
  return items.value.filter((i) => {
    const matchSearch =
      !searchQuery.value ||
      i.nome.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory =
      !selectedCategory.value || i.categoria === selectedCategory.value
    const matchLowStock = !showLowStockOnly.value || i.estoque <= 5
    return matchSearch && matchCategory && matchLowStock
  })
})


const categories = computed(() => [
  ...new Set(items.value.map((i) => i.categoria)),
]);

const totalItems = computed(() => items.value.length);
const totalValue = computed(() => {
  return items.value.reduce(
    (sum, i) => sum + (i.preco ?? 0) * (i.estoque ?? 0),
    0
  );
});
const lowStockCount = computed(
  () => items.value.filter((i) => i.estoque <= 5).length
);

const openModal = (item = null) => {
  showModal.value = true;
  if (item) {
    editingItem.value = item;
    form.value = { ...item };
  } else {
    editingItem.value = null;
    form.value = { nome: "", categoria: "", preco: 0, estoque: 0 };
  }
};

const closeModal = () => {
  showModal.value = false;
  form.value = { nome: "", categoria: "", preco: 0, estoque: 0 };
};

const saveItem = async () => {
  if (!form.value.nome.trim()) return alert("Informe o nome do produto.");

  try {
    if (editingItem.value) {
      await orderService.updateProduto(editingItem.value.id, form.value);
      const index = items.value.findIndex((i) => i.id === editingItem.value.id);
      items.value[index] = { ...editingItem.value, ...form.value };
    } else {
      const newItem = await orderService.createProduto(form.value);
      items.value.push(newItem);
    }
    closeModal();
  } catch (error) {
    console.error("Erro ao salvar item:", error);
    alert("Erro ao salvar o produto.");
  }
};

const requestDelete = (item) => {
  itemToDelete.value = item;
  showConfirm.value = true;
};

const handleConfirmDelete = async () => {
  if (!itemToDelete.value) return;
  try {
    await orderService.deleteProduto(itemToDelete.value.id);
    items.value = items.value.filter((i) => i.id !== itemToDelete.value.id);
  } catch (error) {
    console.error("Erro ao excluir item:", error);
    alert("Erro ao excluir produto.");
  } finally {
    showConfirm.value = false;
    itemToDelete.value = null;
  }
};
</script>
