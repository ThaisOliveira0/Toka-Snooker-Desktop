<template>
  <div class="order-launch">
<Tabs :tabs="['Comandas', 'Pedidos', 'Pagamento', 'Karaokê']"/>
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
            <img :src="item.icon" alt="icon" class="item-icon" />

            <div class="item-info">
              <h3>{{ item.name }}</h3>
              <p>{{ item.subtitle }}</p>
            </div>

            <div class="item-actions">
              <div class="item-price">R$ {{ item.price.toFixed(2) }}</div>

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
import { ref, computed } from 'vue'
import Tabs from "@/components/Tabs.vue";
import './orderLaunch.css'

const tabs = ref(['Lanches', 'Coquetéis', 'Doses e Drinks'])
const activeTab = ref('Lanches')

const items = ref([
  {
    id: 1,
    category: 'Lanches',
    name: 'X-Tudo',
    subtitle: 'Pão com tudo que tem num x-tudo',
    price: 25,
    icon: 'https://img.icons8.com/emoji/48/hamburger-emoji.png',
    quantity: 0
  },
  {
    id: 5,
    category: 'Lanches',
    name: 'X-Tudo',
    subtitle: 'Pão com tudo que tem num x-tudo',
    price: 25,
    icon: 'https://img.icons8.com/emoji/48/hamburger-emoji.png',
    quantity: 0
  },
  {
    id: 7,
    category: 'Lanches',
    name: 'X-Tudo',
    subtitle: 'Pão com tudo que tem num x-tudo',
    price: 25,
    icon: 'https://img.icons8.com/emoji/48/hamburger-emoji.png',
    quantity: 0
  },
  {
    id: 2,
    category: 'Coquetéis',
    name: 'Mojito',
    subtitle: 'Drink alcoólico refrescante',
    price: 20,
    icon: 'https://img.icons8.com/color/48/cocktail.png',
    quantity: 0
  },
  {
    id: 3,
    category: 'Doses e Drinks',
    name: 'Caipirinha',
    subtitle: 'Clássico brasileiro',
    price: 18,
    icon: 'https://img.icons8.com/color/48/lime.png',
    quantity: 0
  }
])

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

const confirmOrder = () => {
  alert('Pedido confirmado com sucesso!')
  items.value.forEach(i => (i.quantity = 0))
}
</script>
