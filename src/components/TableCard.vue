<template>
  <div class="table-card" role="group" :aria-label="data.table">
    <h3 class="table-title">{{ data.table }}</h3>

    <div class="section orders">
      <h4>PEDIDOS</h4>
      <table>
        <thead>
          <tr>
            <th>ITEM</th>
            <th>QTDE</th>
            <th>VALOR</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(o, i) in data.orders" :key="i">
            <td>{{ o.item }}</td>
            <td>{{ o.qty }}</td>
            <td>R$ {{ (o.price * o.qty).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section karaoke">
      <h4>KARAOKÊ</h4>
      <table>
        <thead>
          <tr>
            <th>MÚSICA</th>
            <th>QTDE</th>
            <th>VALOR</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(k, idx) in data.karaoke" :key="idx">
            <td>{{ k.song }}</td>
            <td>{{ k.qty ?? 1 }}</td>
            <td>R$ {{ (k.price * (k.qty ?? 1)).toFixed(2) }}</td>
          </tr>
          <tr v-if="!data.karaoke || data.karaoke.length === 0">
            <td colspan="3">Esse serviço não foi utilizado.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer">
      <div class="total">
        Total: <strong>R$ {{ total.toFixed(2) }}</strong>
      </div>
      <button class="close-btn" @click="$emit('close', data.table)">
        Fechar comanda
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  data: { type: Object, required: true },
});

const total = computed(() => {
  const ordersSum = (props.data.orders || []).reduce(
    (sum, o) => sum + o.price * (o.qty ?? 1),
    0
  );
  const karaokeSum = (props.data.karaoke || []).reduce(
    (sum, k) => sum + k.price * (k.qty ?? 1),
    0
  );
  return ordersSum + karaokeSum;
});
</script>

<style scoped>
.table-card {
  background: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 20%;  
  height: 60vh;  
}

.table-title {
  text-align: center;
  color: #208c4a;
  margin: 0 0 0.6rem;
  font-size: 1.05rem;
  letter-spacing: 0.6px;
}
.section {
  margin-bottom: 0.6rem;
}
.section h4 {
  color: #d9534f;
  margin: 0 0 0.4rem;
  font-size: 0.85rem;
  text-align: center;
}
table {
  width: 100%;
  font-size: 0.87rem;
  border-collapse: collapse;
}
thead th {
  text-align: left;
  font-weight: 700;
  font-size: 0.78rem;
  color: #444;
}
tbody td {
  padding: 4px 0;
  color: #333;
}
.footer {
  margin-top: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.total {
  text-align: center;
  font-size: 0.95rem;
  color: #333;
}
.close-btn {
  background: #208c4a;
  color: #fff;
  border: none;
  padding: 0.5rem;
  border-radius: 20px;
  cursor: pointer;
  width: 100%;
}
</style>
