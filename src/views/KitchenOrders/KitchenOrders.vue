<template>
  <div class="kitchen-container">
    <header class="kitchen-header">
      <h4>Lançamento de Pedido</h4>
      <div class="filters">
        <button
          v-for="status in ['All', 'New', 'InProgress', 'Completed']"
          :key="status"
          :class="{ active: filterStatus === status }"
          @click="filterStatus = status"
        >
          {{ statusLabels[status] }}
        </button>
      </div>
    </header>

    <main class="orders-grid">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-card"
        :class="order.status"
      >
        <div class="order-meta">
          <span class="order-time">{{ order.time }}</span>
          <span class="waiting-time">{{ order.waitingMinutes }} min</span>
        </div>

        <div class="order-header">
          <span class="order-number">Pedido #{{ order.id }}</span>
        </div>

        <ul class="order-items">
          <li v-for="item in order.items" :key="item.name">
            {{ item.quantity }}x {{ item.name }}
          </li>
        </ul>

        <p v-if="order.observation" class="order-observation">
          <strong>Observação:</strong> {{ order.observation }}
        </p>

        <button
  v-if="order.status !== 'completed'"
  @click="advanceStatus(order.id)"
  class="complete-btn"
  :class="{
    'btn-in-progress': order.status === 'inProgress',
    'btn-new': order.status === 'new'
  }"
>
  {{
    order.status === "new"
      ? "Iniciar preparo"
      : order.status === "inProgress"
      ? "Marcar como pronto"
      : ""
  }}
</button>

      </div>
    </main>
  </div>
</template>

<script>
import "./KitchenOrders.css";
export default {
  name: "KitchenOrders",
  data() {
    return {
      orders: [
        {
          id: 101,
          time: "12:34",
          status: "new",
          createdAt: new Date(new Date() - 5 * 60000),
          observation: "Sem cebola, com borda recheada",
          items: [
            { name: "Pizza Margherita", quantity: 2 },
            { name: "Coca-Cola 350ml", quantity: 2 },
          ],
        },
        {
          id: 102,
          time: "12:36",
          status: "new",
          createdAt: new Date(new Date() - 12 * 60000),
          observation: "Fritas bem crocantes",
          items: [
            { name: "Burger", quantity: 1 },
            { name: "Fritas", quantity: 1 },
          ],
        },
      ],

      filterStatus: "All",
      statusLabels: {
        All: "Todos",
        New: "Novos",
        InProgress: "Em preparo",
        Completed: "Prontos",
      },
    };
  },
  computed: {
    filteredOrders() {
      return this.orders
        .map((order) => ({
          ...order,
          waitingMinutes: Math.floor((new Date() - order.createdAt) / 60000),
        }))
        .filter((order) => {
          if (this.filterStatus === "All") return true;
          return order.status === this.filterStatus.toLowerCase();
        });
    },
  },
  methods: {
    advanceStatus(orderId) {
      const order = this.orders.find((o) => o.id === orderId);
      if (!order) return;

      if (order.status === "new") {
        order.status = "inProgress";
      } else if (order.status === "inProgress") {
        order.status = "completed";
      }
    },
  },

  mounted() {
    this.interval = setInterval(() => {
      this.orders = [...this.orders];
    }, 60000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
};
</script>

