<template>
  <div class="payment-container">

    <main class="payment-content">
      <section class="payment-info">
        <h2>MESA {{ tableNumber }}</h2>

        <div class="payment-card">
          <h3>PEDIDOS</h3>
          <table>
            <thead>
              <tr>
                <th>ITEM</th>
                <th>QTDE</th>
                <th>VALOR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in orders" :key="index">
                <td>{{ item.name }}</td>
                <td>{{ item.qty }}</td>
                <td>R$ {{ item.total.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>

          <h3>KARAOKÊ</h3>
          <table>
            <thead>
              <tr>
                <th>MÚSICA</th>
                <th>QTDE</th>
                <th>VALOR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(song, index) in karaoke" :key="index">
                <td>{{ song.title }}</td>
                <td>{{ song.qty }}</td>
                <td>R$ {{ song.total.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            <p><strong>Total:</strong> R$ {{ total.toFixed(2) }}</p>
          </div>
        </div>
      </section>

      <section class="payment-actions">
        <button class="btn green" @click="makePayment">EFETUAR PAGAMENTO</button>
        <button class="btn outline" @click="editOrder">EDITAR COMANDA</button>

        <div class="split-section">
          <button class="btn green" @click="toggleSplit">DIVIDIR CONTA</button>

          <div v-if="showSplit" class="split-modal">
            <label for="people">Quantidade de pessoas:</label>
            <input
              id="people"
              type="number"
              v-model.number="peopleCount"
              min="1"
            />
            <p>Valor por pessoa: R$ {{ splitAmount.toFixed(2) }}</p>
          </div>
        </div>

        <div class="payment-method">
          <p><i class="fa-solid fa-credit-card"></i> Forma de Pagamento</p>
          <select v-model="paymentMethod">
            <option>Cartão de Crédito</option>
            <option>Cartão de Débito</option>
            <option>Dinheiro</option>
            <option>Pix</option>
          </select>
        </div>

        <div class="total-box">
          <p>VALOR TOTAL:</p>
          <h2>R$ {{ total.toFixed(2) }}</h2>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import './Payment.css'
import { ref, computed } from 'vue'

const tableNumber = '01'

const orders = [
  { name: 'X-Tudo', qty: 1, total: 25.0 },
  { name: 'X-Burguer', qty: 1, total: 20.0 },
  { name: 'Sex on the Beach', qty: 1, total: 25.0 },
  { name: 'Tequila', qty: 2, total: 30.0 },
]

const karaoke = [
  { title: 'Alma Gêmea', qty: 1, total: 3.0 },
  { title: 'Evidências', qty: 1, total: 3.0 },
]

const total = computed(() => {
  const orderTotal = orders.reduce((sum, o) => sum + o.total, 0)
  const karaokeTotal = karaoke.reduce((sum, k) => sum + k.total, 0)
  return orderTotal + karaokeTotal
})

const showSplit = ref(false)
const peopleCount = ref(1)

const splitAmount = computed(() =>
  peopleCount.value > 0 ? total.value / peopleCount.value : total.value
)

const paymentMethod = ref('Cartão de Crédito')

const toggleSplit = () => {
  showSplit.value = !showSplit.value
}

const makePayment = () => {
  alert('Pagamento efetuado com sucesso!')
}

const editOrder = () => {
  alert('fazer aqui dps')
}
</script>
