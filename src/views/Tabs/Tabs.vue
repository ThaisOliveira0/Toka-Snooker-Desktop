<template>
  <div class="page-root">
    <header class="tabs-header">
      <h2>Comandas</h2>
      <div class="search-actions">
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input
            type="text"
            v-model="search"
            placeholder="Buscar por mesa..."
          />
        </div>
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
import { useRouter } from "vue-router"; 
import TableCard from "@/components/TableCard.vue";
import { onMounted, ref, computed } from "vue";
import tabsService from "../../service/tabsService";

const comandas = ref([]);
const search = ref("");
const router = useRouter();
const cardsContainer = ref(null);

onMounted(async () => {
  try {
    const response = await tabsService.getAllComandas(); 
    comandas.value = response || []; 
    console.log("Comandas recebidas:", comandas.value);
  } catch (err) {
    console.error("Erro ao buscar comandas:", err);
  }
});

const orders = computed(() =>
  comandas.value.map(comanda => ({
    id: comanda.id,
    mesa: `Mesa ${String(comanda.mesa ?? '??').padStart(2, "0")}`,
    pedido: (comanda.pedido || []).flatMap(p =>
      (p.itens || []).map(item => ({
        nome: item.nome ?? "Item desconhecido",
        quantidade: Number(item.quantidade) || 1,
        valor_total: Number(item.valor_unit) || 3,
        status: p.status,
        observacao: p.observacao
      }))
    ),
    musica_pedido: (comanda.musica_pedido || []).map(m => ({
      nome: m.nome ?? "Música desconhecida",
      quantidade: Number(m.qtde_pedidos) || 1,
      valor_total: Number(m.valor) || 0
    }))
  }))
);

const filteredOrders = computed(() => {
  if (!search.value.trim()) return orders.value;
  const query = search.value.toLowerCase();
  return orders.value.filter(c =>
    String(c.mesa).toLowerCase().includes(query)
  );
});

function handleClose(comanda) {
  
  const safeComanda = {
    id: comanda.id ,
    mesa: comanda.mesa || "Mesa desconhecida",
    pedido: (comanda.pedido || []).map(p => ({
      nome: p.nome || "Item desconhecido",
      quantidade: Number(p.quantidade) || 1,
      valor_total: Number(p.valor_total ?? p.valor_unit ?? 0)
    })),
    musica_pedido: (comanda.musica_pedido || []).map(m => ({
      nome: m.nome || "Música desconhecida",
      quantidade: Number(m.qtde_pedidos) || 1,
      valor_total: Number(m.valor_total ?? m.valor ?? 3)
    }))
  };

  sessionStorage.setItem("selectedOrder", JSON.stringify(safeComanda));
  router.push({ name: "Payment" });
}

</script>

<style src="./Tabs.css"></style>
