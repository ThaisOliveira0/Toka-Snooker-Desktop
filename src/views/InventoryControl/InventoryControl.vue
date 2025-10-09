<template>
  <div class="inventory-control">

    <header class="inventory-header">
      <h1>Controle de Estoque</h1>
    </header>

    <main class="inventory-content">
      <section class="inventory-list">
        <div class="inventory-actions">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar produto..." 
          />

          <button @click="openModal()">+ Adicionar Produto</button>
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
              :class="{ 'low-stock': item.stock <= 5 }"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.price.toFixed(2) }}</td>
              <td>{{ item.stock }}</td>
              <td>
                <button class="edit-btn" @click="openModal(item)">Editar</button>
                <button class="remove-btn" @click="removeItem(item.id)">Excluir</button>
              </td>
            </tr>

            <tr v-if="filteredItems.length === 0">
              <td colspan="5" class="no-results">Nenhum produto encontrado</td>
            </tr>
          </tbody>
        </table>
      </section>

      <aside class="inventory-summary">
        <h2>Resumo</h2>
        <p><strong>Total de Itens:</strong> {{ totalItems }}</p>
        <p><strong>Valor Total em Estoque:</strong> R$ {{ totalValue.toFixed(2) }}</p>
        <p><strong>Itens com Estoque Baixo:</strong> {{ lowStockCount }}</p>
      </aside>
    </main>

    <div v-if="showModal" class="inventory-modal" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ editingItem ? 'Editar Produto' : 'Novo Produto' }}</h3>

        <label>Nome</label>
        <input v-model="form.name" type="text" />

        <label>Categoria</label>
        <input v-model="form.category" type="text" />

        <label>Preço (R$)</label>
        <input v-model.number="form.price" type="number" min="0" />

        <label>Quantidade em Estoque</label>
        <input v-model.number="form.stock" type="number" min="0" />

        <div class="modal-actions">
          <button @click="saveItem">Salvar</button>
          <button class="cancel-btn" @click="closeModal">Cancelar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import './inventoryControl.css'

const searchQuery = ref('')
const showModal = ref(false)
const editingItem = ref(null)

const items = ref([
  { id: 1, name: 'Pão de Hambúrguer', category: 'Lanches', price: 1.5, stock: 40 },
  { id: 2, name: 'Queijo Mussarela', category: 'Laticínios', price: 45, stock: 10 },
  { id: 3, name: 'Refrigerante Lata', category: 'Bebidas', price: 6, stock: 4 },
])

const form = ref({
  name: '',
  category: '',
  price: 0,
  stock: 0
})

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  return items.value.filter(i =>
    i.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalItems = computed(() => items.value.length)
const totalValue = computed(() =>
  items.value.reduce((sum, i) => sum + (i.price * i.stock), 0)
)
const lowStockCount = computed(() => 
  items.value.filter(i => i.stock <= 5).length
)

const openModal = (item = null) => {
  showModal.value = true
  if (item) {
    editingItem.value = item
    form.value = { ...item }
  } else {
    editingItem.value = null
    form.value = { name: '', category: '', price: 0, stock: 0 }
  }
}

const closeModal = () => {
  showModal.value = false
  form.value = { name: '', category: '', price: 0, stock: 0 }
}

const saveItem = () => {
  if (!form.value.name.trim()) return alert('Informe o nome do produto.')

  if (editingItem.value) {
    Object.assign(editingItem.value, { ...form.value })
  } else {
    const newItem = { ...form.value, id: Date.now() }
    items.value.push(newItem)
  }
  closeModal()
}

const removeItem = (id) => {
  if (confirm('Deseja realmente excluir este item?')) {
    items.value = items.value.filter(i => i.id !== id)
  }
}
</script>
