<template>
  <div class="payment-container">
    <main class="payment-content">
      <section class="payment-info">
        <div class="header-card">
          <h2>{{ tableNumber }}</h2>
          <p class="subtitle">Resumo do consumo</p>
        </div>

        <div class="payment-section">
          <div class="section-header">
            <h3> Pedidos</h3>
          </div>
          <table class="styled-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qtde</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in orders" :key="index">
                <td>{{ item.item || 'Item desconhecido' }}</td>
                <td>{{ item.qty ?? 1 }}</td>
                <td>R$ {{ ((item.price ?? 0) * (item.qty ?? 1)).toFixed(2) }}</td>
              </tr>
              <tr v-if="orders.length === 0">
                <td colspan="3">Nenhum pedido registrado.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="payment-section">
          <div class="section-header">
            <h3> Karaokê</h3>
          </div>
          <table class="styled-table">
            <thead>
              <tr>
                <th>Música</th>
                <th>Qtde</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(song, index) in karaoke" :key="index">
                <td>{{ song.song || 'Música desconhecida' }}</td>
                <td>{{ song.qty ?? 1 }}</td>
                <td>R$ {{ ((song.price ?? 0) * (song.qty ?? 1)).toFixed(2) }}</td>
              </tr>
              <tr v-if="karaoke.length === 0">
                <td colspan="3">Nenhuma música solicitada.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="total-summary">
          <p>Total a pagar:</p>
          <h2>R$ {{ total.toFixed(2) }}</h2>
        </div>
      </section>

      <section class="payment-actions">
        <div class="payment-box">
          <label>Forma de pagamento:</label>
          <select v-model="paymentMethod" class="payment-select">
            <option>Cartão de Crédito</option>
            <option>Cartão de Débito</option>
            <option>Dinheiro</option>
            <option>Pix</option>
          </select>
        </div>

      <div class="split-section">
        <div class="split-wrapper">
          <button class="btn secondary" @click="toggleSplit">
            <i class="fa-solid fa-users">
              </i> Dividir Conta
          </button>
          <button class="btn secondary " @click="editOrder">
             Editar Comanda
          </button>

          <div v-if="showSplit" class="split-modal">
            <label for="people">Quantidade de pessoas:</label>
            <input
              id="people"
              type="number"
              v-model.number="peopleCount"
              min="1"
            />
            <p>
              Valor por pessoa:
              <strong>R$ {{ splitAmount.toFixed(2) }}</strong>
            </p>
          </div>
        </div>
      </div>

        <div class="actions">
          <button class="btn primary" @click="makePayment">
             Efetuar Pagamento
          </button>

        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import "./Payment.css";

const router = useRouter();
const orderData = ref(null);

const tableNumber = ref("");
const orders = ref([]);
const karaoke = ref([]);

onMounted(() => {
  const saved = sessionStorage.getItem("selectedOrder");
  if (!saved) {
    router.push("/comandas");
    return;
  }

  const data = JSON.parse(saved);

  tableNumber.value = data.table || "Mesa desconhecida";
  orders.value = (data.orders || []).map(o => ({
    item: o.item || "Item desconhecido",
    qty: Number(o.qty) || 1,
    price: Number(o.price) || 0
  }));
  karaoke.value = (data.karaoke || []).map(k => ({
    song: k.song || "Música desconhecida",
    qty: Number(k.qty) || 1,
    price: Number(k.price) || 0
  }));
});

const total = computed(() => {
  const ordersTotal = orders.value.reduce((sum, o) => sum + (o.price * o.qty), 0);
  const karaokeTotal = karaoke.value.reduce((sum, k) => sum + (k.price * k.qty), 0);
  return ordersTotal + karaokeTotal;
});

const showSplit = ref(false);
const peopleCount = ref(1);
const paymentMethod = ref("Cartão de Crédito");

const splitAmount = computed(() =>
  peopleCount.value > 0 ? total.value / peopleCount.value : total.value
);

const toggleSplit = () => (showSplit.value = !showSplit.value);

const makePayment = () => {
  alert(`Pagamento de R$ ${total.value.toFixed(2)} efetuado com sucesso!`);
};

const editOrder = () => {
  alert("Abrir tela de edição de comanda...");
};
</script>
