<template>
  <div class="payment-container">
    <main class="payment-content">
      <section class="payment-info">
        <div class="header-card">
          <h2>{{ mesa }}</h2>
          <p class="subtitle">Resumo do consumo</p>
        </div>

        <div class="payment-section">
          <div class="section-header">
            <h3>Pedidos</h3>
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
              <tr v-for="(p, i) in pedido" :key="i">
                <td>{{ p.nome || 'Item desconhecido' }}</td>
                <td>{{ p.quantidade }}</td>
                <td>R$ {{ (p.valor_total * p.quantidade).toFixed(2) }}</td>
              </tr>
              <tr v-if="!pedido || pedido.length === 0">
                <td colspan="3">Nenhum pedido registrado.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="payment-section">
          <div class="section-header">
            <h3>Karaokê</h3>
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
              <tr v-for="(m, i) in musica_pedido" :key="i">
                <td>{{ m.nome || 'Música desconhecida' }}</td>
                <td>{{ m.quantidade }}</td>
                <td>R$ {{ (m.valor_total * m.quantidade).toFixed(2) }}</td>
              </tr>
              <tr v-if="!musica_pedido || musica_pedido.length === 0">
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
              <i class="fa-solid fa-users"></i> Dividir Conta
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
import tabService from "../../service/tabsService";
import { useRouter } from "vue-router";
import "./Payment.css";

const router = useRouter();

const mesa = ref("");
const pedido = ref([]);
const musica_pedido = ref([]);

onMounted(() => {
  const saved = sessionStorage.getItem("selectedOrder");

  if (!saved) {
    router.push("/comandas");
    return;
  }

  const data = JSON.parse(saved);

  console.log("Música Pedido:", data)
  mesa.value = data.mesa || "Mesa desconhecida";
  pedido.value = (data.pedido || []).map(p => ({
    nome: p.nome || "Item desconhecido",
    quantidade: Number(p.quantidade) || 1,
    valor_total: Number(p.valor_total) || 0
  }));

  musica_pedido.value = (data.musica_pedido || []).map(m => ({
    nome: m.nome || "Música desconhecida",
    quantidade: Number(m.quantidade) || 1,
    valor_total: Number(m.valor_total) || 0
  }));
});

const total = computed(() => {
  const pedidosTotal = pedido.value.reduce(
    (sum, p) => sum + p.valor_total * p.quantidade,
    0
  );
  const musicaTotal = musica_pedido.value.reduce(
    (sum, m) => sum + m.valor_total * m.quantidade,
    0
  );
  return pedidosTotal + musicaTotal;
});

const showSplit = ref(false);
const peopleCount = ref(1);
const paymentMethod = ref("Cartão de Crédito");

const splitAmount = computed(() =>
  peopleCount.value > 0 ? total.value / peopleCount.value : total.value
);

const toggleSplit = () => (showSplit.value = !showSplit.value);

const makePayment = async () => {
  try {
    const saved = sessionStorage.getItem("selectedOrder")
    if (!saved) {
      alert("Nenhuma comanda selecionada.")
      return
    }

    const data = JSON.parse(saved)
    const idComanda = data.id

    if (!idComanda) {
      alert("ID da comanda não encontrado.")
      return
    }

    alert(`Pagamento de R$ ${total.value.toFixed(2)} efetuado com sucesso!`)

    const response = await tabService.closeTab(idComanda)

    if (response.sucesso === false) {
      alert("Erro ao fechar comanda.")
      console.error(response.mensagem)
      return
    }

    alert("Comanda fechada com sucesso!")

    sessionStorage.removeItem("selectedOrder")
    router.push("/comandas")

  } catch (error) {
    console.error("Erro ao efetuar pagamento:", error)
    alert("Ocorreu um erro ao fechar a comanda.")
  }
}


const editOrder = () => {
  alert("Abrir tela de edição de comanda...");
};
</script>
