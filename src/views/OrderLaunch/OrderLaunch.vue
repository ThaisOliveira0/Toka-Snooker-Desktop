<template>
  <div class="order-launch">
    <header class="order-header">
      <h4>Lançamento de Pedido</h4>
    </header>

    <section class="order-info">
      <div class="order-field">
        <label for="table-number">Mesa</label>
        <input
          id="table-number"
          type="number"
          v-model="tableNumber"
          placeholder="Número da mesa"
        />
      </div>

      <div class="order-field">
        <label for="order-id">ID da Comanda</label>
        <input
          id="order-id"
          type="number"
          v-model="comandaId"
          :disabled="novaComanda"
          placeholder="Digite o ID da comanda"
        />
        <div class="checkbox-field">
          <input type="checkbox" id="nova" v-model="novaComanda" />
          <label for="nova">Criar nova comanda</label>
        </div>
      </div>

      <div class="order-field">
        <label for="observacao">Observação</label>
        <textarea
          id="observacao"
          v-model="observacao"
          placeholder="Ex: sem molho, bem passado..."
        ></textarea>
      </div>
    </section>

    <main class="order-content">
      <section class="order-products">
        <div class="order-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            :class="{ active: tab === activeTab }"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <div class="order-items">
          <div 
            v-for="item in filteredItems" 
            :key="item.id" 
            class="order-item-card"
          >
            <div class="item-info">
              <h3>{{ item.name }}</h3>
              <p>{{ item.subtitle }}</p>
            </div>

            <div class="item-actions">
              <div class="item-price">
                <span>R$ {{ item.price.toFixed(2) }}</span>
              </div>

              <div class="item-quantity">
                <button @click="decreaseItem(item)">−</button>
                <span>{{ item.quantity }}</span>
                <button @click="addItem(item)">+</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside class="order-summary">
        <h2>Resumo do Pedido</h2>

        <div v-if="cart.length === 0" class="empty-cart">
          Nenhum item adicionado ainda.
        </div>

        <ul v-else class="cart-list">
          <li v-for="item in cart" :key="item.id" class="cart-item">
            <div class="cart-item-info">
              <strong>{{ item.name }}</strong>
              <span>R$ {{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
            <div class="cart-item-controls">
              <button @click="decreaseItem(item)">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="addItem(item)">+</button>
            </div>
          </li>
        </ul>

        <div v-if="cart.length > 0" class="cart-total">
          <strong>Total:</strong> R$ {{ cartTotal.toFixed(2) }}
        </div>

        <button 
          v-if="cart.length > 0" 
          class="confirm-btn"
          @click="confirmOrder"
        >
          Confirmar Pedido
        </button>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import orderService from '../../service/ordersService.js'
import productService from '../../service/productService.js'
import './orderLaunch.css'

const tableNumber = ref('')
const comandaId = ref('')
const novaComanda = ref(false)
const observacao = ref('')
const items = ref([])
const activeTab = ref('')

const tabs = computed(() => {
  const categorias = [...new Set(items.value.map(i => i.category))]
  return categorias.length ? categorias : ['Carregando...']
})

onMounted(async () => {
  try {
    const response = await productService.getAllProdutos()
    const produtos = response.data

    items.value = produtos.map(p => {
      const temPromo = p.preco_promo && p.preco_promo > 0 && p.preco_promo < p.preco

      return {
        id: p.id,
        category: p.categoria,
        name: p.nome,
        subtitle: p.descricao,
        price: temPromo ? p.preco_promo : p.preco,
        quantity: 0
      }
    })

    if (items.value.length > 0) {
      activeTab.value = items.value[0].category
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    alert('Não foi possível carregar os produtos.')
  }
})

const filteredItems = computed(() => 
  items.value.filter(i => i.category === activeTab.value)
)

const addItem = (item) => item.quantity++
const decreaseItem = (item) => { if (item.quantity > 0) item.quantity-- }

const cart = computed(() => items.value.filter(i => i.quantity > 0))
const cartTotal = computed(() => 
  cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
)

const confirmOrder = async () => {
  if (!tableNumber.value) {
    return alert("Informe o número da mesa.")
  }

  if (!novaComanda.value && !comandaId.value) {
    return alert("Informe o ID da comanda ou marque 'Criar nova comanda'.")
  }

  if (cart.value.length === 0) {
    return alert("Adicione pelo menos um item ao pedido.")
  }

  const pedido = {
    id_comanda: novaComanda.value ? null : Number(comandaId.value),
    status: "PENDENTE",
    observacao: observacao.value || "",
    produtos: cart.value.map(i => ({
      id_produto: i.id,
      quantidade: i.quantity,
      valor: i.price
    }))
  }

  try {
    await orderService.createPedido(pedido)
    alert("Pedido criado com sucesso!")

    comandaId.value = ""
    observacao.value = ""
    novaComanda.value = false
    items.value.forEach(i => (i.quantity = 0))
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    alert("Erro ao criar pedido.")
  }
}
</script>
