<template>
  <div class="kitchen-container">
    <header class="kitchen-header">
      <h4>Pedidos - Cozinha</h4>
      <div class="filters">
        <button v-for="status in ['All', 'PENDENTE', 'EM PREPARO', 'CONCLUIDO']" :key="status"
          :class="{ active: filterStatus === status }" @click="filterStatus = status">
          {{ statusLabels[status] }}
        </button>

      </div>
    </header>

    <main class="orders-grid">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card" :class="statusClass(order.status)">

        <div class="order-time">
          <span class="waiting-time"> {{ formatTimeAgo(order.data_criado) }}</span>
        </div>

        <div class="order-meta">
          <span class="order-number">Pedido #{{ order.id }}</span>
        </div>

        <ul class="order-items">
          <li v-for="item in order.itens" :key="item.id">
            {{ item.quantidade }}x {{ item.nome }}
          </li>
        </ul>

        <p v-if="order.observacao" class="order-observation">
          <strong>Obs:</strong> {{ order.observacao }}
        </p>

        <button v-if="order.status !== 'CONCLUIDO'" @click="advanceStatus(order.id)" class="complete-btn" :class="{
          'btn-in-progress': order.status === 'EM PREPARO',
          'btn-new': order.status === 'PENDENTE'
        }">
          {{
            order.status === 'PENDENTE'
              ? 'Iniciar preparo'
              : order.status === 'EM PREPARO'
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
        "EM PREPARO": "Em preparo",
        CONCLUIDO: "Prontos",
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
    statusClass(status) {
      if (!status) return "";
      switch (status) {
        case "PENDENTE":
          return "new";
        case "EM PREPARO":
          return "inProgress";
        case "CONCLUIDO":
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
      if (order.status === "PENDENTE") order.status = "EM PREPARO";
      else if (order.status === "EM PREPARO") order.status = "CONCLUIDO";
      await orderService.updateStatus(orderId, order.status);

    },
    formatTimeAgo(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
  
      const diffMinutes = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMinutes / 60);
  
      if (diffMinutes < 1) return "Agora mesmo";
      if (diffMinutes < 60) return `Há ${diffMinutes} min`;
      if (diffHours < 24) return `Há ${diffHours}h`;
  
      const diffDays = Math.floor(diffHours / 24);
      return `Há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
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
