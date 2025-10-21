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
      <button class="close-btn" @click="$emit('close', data)">
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
  position: relative;
  background: #fffef8; 
  padding: 1rem 1.2rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 350px;
  max-width: 400px;
  min-height: 500px;
  border: 1px solid #e0e0e0;
  font-family: 'Courier New', monospace; 
  overflow: hidden;
}

.table-title {
  text-align: center;
  color: #323a29;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 1px;
  border-bottom: 2px dashed #ccc;
  padding-bottom: 0.3rem;
}

.section {
  margin-bottom: 0.8rem;
}

.section h4 {
  text-align: center;
  font-size: 0.75rem;
  color: #666;
  letter-spacing: 0.5px;
  margin-bottom: 0.3rem;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 0.2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

thead th {
  text-align: left;
  color: #444;
  border-bottom: 1px dotted #aaa;
  padding-bottom: 2px;
}

table th:nth-child(1),
table td:nth-child(1) {
  text-align: left; 
}

table th:nth-child(2), 
table td:nth-child(2) {
  text-align: center; 
}

table th:nth-child(3),
table td:nth-child(3) {
  text-align: right; 
}


tbody td {
  padding: 2px 0;
  color: #333;
}

.footer {
  border-top: 1px dashed #ccc;
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.total {
  text-align: right;
  font-size: 0.9rem;
  font-weight: bold;
  color: #111;
}

.close-btn {
  background: #222;
  color: #fff;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-family: inherit;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #444;
}


</style>
