<template>
  <div class="order-launch">
    <header class="order-header">
      <h4>Lançamento de Pedido</h4>
      <button class="new-product-btn" @click="openNewProductModal">+ Novo Produto</button>
    </header>

    <section class="order-info">
      <div class="order-field">
        <label for="table-number">Mesa:</label>
        <input id="table-number" type="number" v-model="tableNumber" placeholder="Número da mesa" />
      </div>

      <div class="order-field order-id-field">
        <label for="order-id">ID da Comanda:</label>
        <div class="order-id-row">
          <input id="order-id" type="number" v-model="comandaId" :disabled="novaComanda" placeholder="Digite o ID" />

          <div class="checkbox-field below">
            <input type="checkbox" id="nova" v-model="novaComanda" />
            <label for="nova">Criar nova comanda</label>
          </div>
        </div>

      </div>

      <div class="order-field full-width">
        <label for="observacao">Observação:</label>
        <textarea id="observacao" v-model="observacao" placeholder="Ex: sem molho, bem passado..."></textarea>
      </div>
    </section>

    <main class="order-content">
      <section class="order-products">
        <div class="order-tabs">
          <button v-for="tab in tabs" :key="tab" :class="{ active: tab === activeTab }" @click="activeTab = tab">
            {{ tab }}
          </button>
        </div>

        <div class="order-items">
          <div v-for="item in filteredItems" :key="item.id" class="order-item-card">
            <div class="item-info">
              <h3>{{ item.name }}</h3>
            </div>

            <div class="item-actions">
              <div class="item-price">
                <span>R$ {{ item.price.toFixed(2) }}</span>
              </div>

              <div class="item-quantity">
                <button @click="decreaseItem(item)">−</button>
                <span>{{ item.quantity }}</span>
                <button @click="addItem(item)">+</button>
              </div>
            </div>
            <button class="edit-btn" @click="openEditProductModal(item)">Editar</button>
          </div>
        </div>
      </section>

      <aside class="order-summary">
        <h2>Resumo do Pedido</h2>

        <div v-if="cart.length === 0" class="empty-cart">
          Nenhum item adicionado ainda.
        </div>

        <ul v-else class="cart-list">
          <li v-for="item in cart" :key="item.id" class="cart-item">
            <div class="cart-item-info">
              <strong>{{ item.name }}</strong>
              <span>R$ {{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
            <div class="cart-item-controls">
              <button @click="decreaseItem(item)">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="addItem(item)">+</button>
            </div>
          </li>
        </ul>

        <div v-if="cart.length > 0" class="cart-total">
          <strong>Total:</strong> R$ {{ cartTotal.toFixed(2) }}
        </div>

        <button v-if="cart.length > 0" class="confirm-btn" @click="confirmOrder">
          Confirmar Pedido
        </button>
      </aside>
    </main>
  </div>
  <NewProduct :show="showNewProductModal" :form="newProductForm" :editingItem="editingItem"
    @close="closeNewProductModal" @save="saveNewProduct" @delete="deleteProduto" />


</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import orderService from "../../service/ordersService.js";
import productService from "../../service/productService.js";
import NewProduct from "./Components/NewProduct.vue";
import "./orderLaunch.css";

const toast = useToast();

const tableNumber = ref("");
const comandaId = ref("");
const novaComanda = ref(false);
const observacao = ref("");
const items = ref([]);
const activeTab = ref("");

const showNewProductModal = ref(false);
const newProductForm = ref({
  nome: "",
  categoria: "",
  preco: 0,
  estoque: 0,
  qtde_min: 0,
});

const openNewProductModal = () => {
  newProductForm.value = { nome: "", categoria: "", preco: 0, estoque: 0, qtde_min: 0 };
  showNewProductModal.value = true;
};
const editingItem = ref(null);

const openEditProductModal = (item) => {
  editingItem.value = { ...item };
  newProductForm.value = {
    nome: item.name,
    categoria: item.category,
    preco: item.price,
    descricao: item.subtitle || "",
    preco_promo: item.preco_promo || 0,
    foto: item.foto || "default.jpg"
  };
  showNewProductModal.value = true;
};

const closeNewProductModal = () => {
  showNewProductModal.value = false;
};

const saveNewProduct = async (product) => {
  try {
    const payload = {
      nome: product.nome,
      descricao: product.descricao || "",
      promo: product.preco_promo && product.preco_promo > 0 ? true : false,
      preco: Number(product.preco) || 0,
      preco_promo: product.preco_promo ? Number(product.preco_promo) : null,
      categoria: product.categoria || "Outros",
      foto: product.foto || "default.jpg",
    };

    if (editingItem.value) {
      await productService.updateProduto(editingItem.value.id, payload);
      toast.success("Produto atualizado com sucesso!");
      const index = items.value.findIndex(i => i.id === editingItem.value.id);
      if (index !== -1) {
        items.value[index] = {
          ...items.value[index],
          name: payload.nome,
          subtitle: payload.descricao,
          price: payload.preco_promo && payload.preco_promo < payload.preco ? payload.preco_promo : payload.preco,
          category: payload.categoria
        };
      }
    } else {
      await productService.createProduto(payload);
      toast.success("Produto criado com sucesso!");

      const response = await productService.getAllProdutos();
      const produtos = response.data || response;

      items.value = produtos.map((p) => {

        const temPromo = p.preco_promo && p.preco_promo > 0 && p.preco_promo < p.preco;
        return {
          id: p.id,
          category: p.categoria,
          name: p.nome,
          subtitle: p.descricao,
          price: temPromo ? p.preco_promo : p.preco,
          quantity: 0,
        };
      });
    }

    showNewProductModal.value = false;
    editingItem.value = null;

    if (items.value.length > 0) activeTab.value = items.value[0].category;
  } catch (error) {
    console.error("Erro ao salvar produto:", error);
    toast.error("Não foi possível salvar o produto.");
  }
};


const tabs = computed(() => {
  const categorias = [...new Set(items.value.map((i) => i.category))];
  return categorias.length ? categorias : ["Carregando..."];
});

onMounted(async () => {
  try {
    const response = await productService.getAllProdutos();
    const produtos = response.data || response;

    items.value = produtos.map((p) => {
      const temPromo = p.preco_promo && p.preco_promo > 0 && p.preco_promo < p.preco;
      return {
        id: p.id,
        category: p.categoria,
        name: p.nome,
        subtitle: p.descricao,
        price: temPromo ? p.preco_promo : p.preco,
        quantity: 0,
      };
    });


    if (items.value.length > 0) activeTab.value = items.value[0].category;
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    toast.error("Não foi possível carregar os produtos.");
  }
});

const filteredItems = computed(() =>
  items.value.filter((i) => i.category === activeTab.value)
);
const deleteProduto = async (id) => {
  try {
    await productService.deleteProduto(id);
    toast.success("Produto excluído com sucesso!");

    items.value = items.value.filter((i) => i.id !== id);
    showNewProductModal.value = false;
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    toast.error("Não foi possível excluir o produto.");
  }
};

const addItem = (item) => item.quantity++;
const decreaseItem = (item) => {
  if (item.quantity > 0) item.quantity--;
};

const cart = computed(() => items.value.filter((i) => i.quantity > 0));
const cartTotal = computed(() =>
  cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
);

const confirmOrder = async () => {
  if (!tableNumber.value) return toast.warning("Informe o número da mesa.");
  if (!novaComanda.value && !comandaId.value) return toast.warning("Informe o ID da comanda.");
  if (cart.value.length === 0) return toast.info("Adicione pelo menos um item ao pedido.");

  const pedido = {
    id_comanda: novaComanda.value ? null : Number(comandaId.value),
    status: "PENDENTE",
    observacao: observacao.value || "",
    produtos: cart.value.map((i) => ({
      id_produto: i.id,
      quantidade: i.quantity,
      valor_unit: i.price,
    })),
  };

  try {
    const response = await orderService.createPedido(pedido);

    if (response.data.sucesso === true) {
      toast.success(response.data.mensagem || "Pedido criado com sucesso!");
      comandaId.value = "";
      observacao.value = "";
      novaComanda.value = false;
      items.value.forEach((i) => (i.quantity = 0));
    } else {
      console.error("Erro na resposta da API:", response.data);
      toast.error("Erro ao criar pedido.");
    }

  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    toast.error("Erro ao criar pedido.");
  }
};
</script>
