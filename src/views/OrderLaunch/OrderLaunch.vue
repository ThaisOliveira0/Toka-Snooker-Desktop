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
        <label for="customer-name">Nome</label>
        <input
          id="customer-name"
          type="text"
          v-model="customerName"
          placeholder="Nome do cliente"
        />
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
                <template v-if="item.promo">
                  <!-- <span class="old-price">R$ {{ item.oldPrice.toFixed(2) }}</span> -->
                  <span class="promo-price">R$ {{ item.price.toFixed(2) }}</span>
                </template>
                <template v-else>
                  R$ {{ item.price.toFixed(2) }}
                </template>
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
import { ref, computed, onMounted, watch } from 'vue'
import orderService from '../../service/ordersService.js'
import './orderLaunch.css'
import productService from '../../service/productService.js'

const tableNumber = ref('')
const customerName = ref('')

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
    oldPrice: temPromo ? p.preco : null,
    promo: temPromo,
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
const decreaseItem = (item) => {
  if (item.quantity > 0) item.quantity--
}

const cart = computed(() => 
  items.value.filter(i => i.quantity > 0)
)

const cartTotal = computed(() => 
  cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
)

const confirmOrder = async () => {
  if (!tableNumber.value || !customerName.value) {
    return alert("Informe o número da mesa e o nome do cliente.");
  }

  if (cart.value.length === 0) {
    return alert("Adicione pelo menos um item ao pedido.");
  }

  const novoPedido = {
    mesa: tableNumber.value,
    cliente: customerName.value,
    itens: cart.value.map(i => ({
      produto_id: i.id,
      quantidade: i.quantity,
      preco_unit: i.price
    })),
    total: cartTotal.value
  };

  try {
    const resultado = await orderService.createPedido(novoPedido);
    alert(`Pedido da mesa ${tableNumber.value} criado com sucesso!`);

    tableNumber.value = "";
    customerName.value = "";
    items.value.forEach(i => (i.quantity = 0));
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    alert("Não foi possível criar o pedido.");
  }
};

</script>
