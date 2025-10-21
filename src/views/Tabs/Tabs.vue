<template>
  <div class="page-root">
    <header class="topbar">
      <div class="logo">Toka</div>
      <div class="search">
        <input
          v-model="search"
          placeholder="Pesquisar Mesa"
        />
      </div>
    </header>

    <div class="carousel-wrap">
      <div class="cards-container" ref="cardsContainer">
        <TableCard
          v-for="(order, idx) in filteredOrders"
          :key="order.table + idx"
          :data="order"
          @close="handleClose"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router"; 
import TableCard from "@/components/TableCard.vue";
import { orders } from "@/mock/orders.js";

const cardsContainer = ref(null);
const search = ref(""); 
const router = useRouter();

const filteredOrders = computed(() => {
  if (!search.value.trim()) return orders;
  const query = search.value.toLowerCase();
  return orders.filter(order =>
    String(order.table).toLowerCase().includes(query)
  );
});

const handleClose = (order) => {
  const safeOrder = {
    table: order.table || "Mesa desconhecida",
    orders: (order.orders || []).map(o => ({
      item: o.item || "Item desconhecido",
      qty: Number(o.qty) || 1,
      price: Number(o.price) || 0
    })),
    karaoke: (order.karaoke || []).map(k => ({
      song: k.song || "Música desconhecida",
      qty: Number(k.qty) || 1,
      price: Number(k.price) || 0
    }))
  };

  sessionStorage.setItem("selectedOrder", JSON.stringify(safeOrder));
  router.push({ name: "Payment" });
};
</script>

<style src="./tabs.css"></style>
