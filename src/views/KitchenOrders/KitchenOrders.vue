<template>
  <div class="kitchen-container">
    <header class="kitchen-header">
      <h4>Pedidos - Cozinha</h4>
      <div class="filters">
        <button
          v-for="status in ['All', 'PENDENTE', 'EM_PREPARO', 'PRONTO']"
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
        :class="statusClass(order.status)"
      >
        <div class="order-meta">
          <span class="order-number">Pedido #{{ order.id }}</span>
          <span class="order-value">Total: R$ {{ order.valor_total }}</span>
        </div>

        <ul class="order-items">
          <li v-for="item in order.itens" :key="item.id">
            {{ item.quantidade }}x {{ item.nome }}
          </li>
        </ul>

        <p v-if="order.observacao" class="order-observation">
          <strong>Observação:</strong> {{ order.observacao }}
        </p>

        <button
          v-if="order.status !== 'PRONTO'"
          @click="advanceStatus(order.id)"
          class="complete-btn"
          :class="{
            'btn-in-progress': order.status === 'EM_PREPARO',
            'btn-new': order.status === 'PENDENTE'
          }"
        >
          {{
            order.status === 'PENDENTE'
              ? 'Iniciar preparo'
              : order.status === 'EM_PREPARO'
              ? 'Marcar como pronto'
              : ''
          }}
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import "./KitchenOrders.css";
import orderService from "@/service/ordersService";

export default {
  name: "KitchenOrders",
  data() {
    return {
      orders: [],
      filterStatus: "All",
      statusLabels: {
        All: "Todos",
        PENDENTE: "Pendentes",
        EM_PREPARO: "Em preparo",
        PRONTO: "Prontos",
      },
    };
  },
  computed: {
    filteredOrders() {
      if (this.filterStatus === "All") return this.orders;
      return this.orders.filter((o) => o.status === this.filterStatus);
    },
  },
  methods: {
    // mapeia o status do backend para as classes CSS originais
    statusClass(status) {
      if (!status) return "";
      switch (status) {
        case "PENDENTE":
          return "new";
        case "EM_PREPARO":
          return "inProgress";
        case "PRONTO":
          return "completed";
        default:
          return "";
      }
    },

    async loadOrders() {
      try {
        const data = await orderService.getAllPedidos();
        this.orders = data;
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      }
    },

    async advanceStatus(orderId) {
      const order = this.orders.find((o) => o.id === orderId);
      if (!order) return;

      if (order.status === "PENDENTE") order.status = "EM_PREPARO";
      else if (order.status === "EM_PREPARO") order.status = "PRONTO";
      await orderService.updateStatus(orderId, order.status);
    },
  },
  mounted() {
    this.loadOrders();
    this.interval = setInterval(() => this.loadOrders(), 60000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
};
</script>
