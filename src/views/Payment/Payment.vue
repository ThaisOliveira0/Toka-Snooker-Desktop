<template>
  <div class="payment-container">
    <main class="payment-content">
      <section class="payment-info">
        <div class="header-card">
          <h2>Mesa {{ mesa }}</h2>
          <p class="subtitle">Resumo do consumo</p>
        </div>

        <div class="payment-section">
          <div class="section-header">
            <h3>Pedidos</h3>

            <button class="edit-btn-payment" @click="editingPedidos = !editingPedidos">
              <i class="fas fa-edit"></i>
            </button>
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
                <td>{{ p.nome }}</td>

                <td v-if="!editingPedidos">{{ p.quantidade }}</td>
                <td v-else>
                  <input type="number" v-model.number="p.quantidade" min="0"
                    @change="() => { handleQuantityChange(p, pedido); saveChanges(); }" />

                </td>
                <td>R$ {{ (p.valor_total * p.quantidade).toFixed(2) }}</td>

              </tr>
            </tbody>
          </table>
        </div>


        <div class="payment-section">
          <div class="section-header">
            <h3>Karaokê</h3>

            <button class="edit-btn-payment" @click="editingKaraoke = !editingKaraoke">
              <i class="fas fa-edit"></i>
            </button>
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

                <td>{{ m.nome }}</td>

                <td v-if="!editingKaraoke">{{ m.quantidade }}</td>
                <td v-else>
                  <input type="number" v-model.number="m.quantidade" min="0"
                    @change="() => { handleQuantityChange(m, musica_pedido); saveChanges(); }" />


                </td>
                <td>R$ {{ (m.valor_total * m.quantidade).toFixed(2) }}</td>

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
              <input id="people" type="number" v-model.number="peopleCount" min="1" />
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
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();
const mesa = ref("");
const editingPedidos = ref(false)
const editingKaraoke = ref(false)
const pedido = ref([]);
const musica_pedido = ref([]);

onMounted(() => {
  const saved = sessionStorage.getItem("selectedOrder");

  if (!saved) {
    router.push("/comandas");
    return;
  }

  const data = JSON.parse(saved);

  mesa.value = Number(data.mesa.replace(/\D/g, "")) || null;
  pedido.value = (data.pedido || []).map(p => ({
    id_produto: p.id_produto,
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
const handleQuantityChange = (item, list) => {
  if (item.quantidade < 0) {
    item.quantidade = 1;

    toast.error("Digite um valor válido! A quantidade não pode ser negativa.", {
      timeout: 2500,
    });

    return;
  }

  if (item.quantidade === 0) {
    const confirmRemove = confirm("Deseja realmente remover este item da comanda?");

    if (confirmRemove) {
      const index = list.indexOf(item);
      if (index !== -1) list.splice(index, 1);
    } else {
      item.quantidade = 1;
    }
  }
};

const saveChanges = async () => {
  const saved = sessionStorage.getItem("selectedOrder");
  if (!saved) return;

  const data = JSON.parse(saved);
  const idComanda = data.id;

  if (!idComanda) return;

  const novaComanda = {
    mesa: mesa.value,
    pedido: pedido.value,
    musica_pedido: musica_pedido.value
  };

  try {
    const response = await tabService.editTab(idComanda, novaComanda);

    if (response.sucesso) {
      toast.success("Alterações salvas com sucesso!", { timeout: 2000 });
    } else {
      toast.error("Erro ao salvar alterações.");
    }

  } catch (err) {
    toast.error("Erro inesperado ao salvar.");
    console.error(err);
  }
};

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
