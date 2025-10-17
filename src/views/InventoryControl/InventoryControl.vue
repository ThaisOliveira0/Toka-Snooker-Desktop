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
              :class="{ 'low-stock': item.estoque <= 5 }"
            >
              <td>{{ item.nome }}</td>
              <td>{{ item.categoria }}</td>
              <td>{{ (item.preco ?? 0).toFixed(2) }}</td>
              <td>{{ item.estoque }}</td>
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

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import './inventoryControl.css'
import orderService from '../../service/ordersService'

const searchQuery = ref('')
const showModal = ref(false)
const editingItem = ref(null)
const items = ref([])
const form = ref({
  nome: '',
  categoria: '',
  preco: 0,
  estoque: 0
})

onMounted(async () => {
  try {
    const response = await orderService.getAllProdutos()
    items.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    items.value = []
  }
})

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  return items.value.filter(i =>
    i.nome.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    i.categoria.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalItems = computed(() => items.value.length)
const totalValue = computed(() => {
  if (!Array.isArray(items.value)) return 0
  return items.value.reduce((sum, i) => sum + ((i.preco ?? 0) * (i.estoque ?? 0)), 0)
})

const lowStockCount = computed(() => 
  items.value.filter(i => i.estoque <= 5).length
)

const openModal = (item = null) => {
  showModal.value = true
  if (item) {
    editingItem.value = item
    form.value = { ...item } 
  } else {
    editingItem.value = null
    form.value = { nome: '', categoria: '', preco: 0, estoque: 0 }
  }
}

const closeModal = () => {
  showModal.value = false
  form.value = { nome: '', categoria: '', preco: 0, estoque: 0 }
}

const saveItem = async () => {
  if (!form.value.nome.trim()) return alert('Informe o nome do produto.')

  try {
    if (editingItem.value) {
      await orderService.updateProduto(editingItem.value.id, form.value)
      const index = items.value.findIndex(i => i.id === editingItem.value.id)
      items.value[index] = { ...editingItem.value, ...form.value }
    } else {
      const newItem = await orderService.createProduto(form.value)
      items.value.push(newItem)
    }
    closeModal()
  } catch (error) {
    console.error('Erro ao salvar item:', error)
    alert('Erro ao salvar o produto.')
  }
}


const removeItem = async (id) => {
  if (confirm('Deseja realmente excluir este item?')) {
    try {
      await orderService.deleteProduto(id)
      items.value = items.value.filter(i => i.id !== id)
    } catch (error) {
      console.error('Erro ao excluir item:', error)
      alert('Erro ao excluir produto.')
    }
  }
}
</script>
