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

const pedidosAdaptados = computed(() =>
  orders.map(comanda => ({
    mesa: `Mesa ${comanda.mesa.toString().padStart(2, "0")}`,
    pedido: (comanda.pedido || []).map(p => ({
      nome: p.nome,
      quantidade: p.quantidade,
      valor_total: p.valor_total
    })),
    musica_pedido: (comanda.musica_pedido || []).map(m => ({
      nome: m.nome,
      quantidade: m.quantidade,
      valor_total: m.valor_total
    }))
  }))
);

const filteredOrders = computed(() => {
  if (!search.value.trim()) return pedidosAdaptados.value;
  const query = search.value.toLowerCase();
  return pedidosAdaptados.value.filter(comanda =>
    String(comanda.mesa).toLowerCase().includes(query)
  );
});

const handleClose = (comanda) => {
  const safeComanda = {
    mesa: comanda.mesa || "Mesa desconhecida",
    pedido: (comanda.pedido || []).map(p => ({
      nome: p.nome || "Item desconhecido",
      quantidade: Number(p.quantidade) || 1,
      valor_total: Number(p.valor_total) || 0
    })),
    musica_pedido: (comanda.musica_pedido || []).map(m => ({
      nome: m.nome || "Música desconhecida",
      quantidade: Number(m.quantidade) || 1,
      valor_total: Number(m.valor_total) || 0
    }))
  };

  sessionStorage.setItem("selectedOrder", JSON.stringify(safeComanda));
  router.push({ name: "Payment" });
};
</script>


<style src="./tabs.css"></style>
