import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': 12345 
  }
});

export default {


async getAllComandas() {
    try {
      const response = await api.get("/comandas");

      return response.data; 
    } catch (error) {
      console.error("Erro ao buscar comandas:", error);
      return { sucesso: false, mensagem: "Erro ao buscar comandas.", dados: [] };
    }
  },
  async createPedido(pedido) { 
    try {
      const response = await api.post("/pedidos", pedido);
    
    return response;
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return { sucesso: false, mensagem: "Erro ao criar pedido." };
  }
},
  async getAllPedidos() { 
    try {
      const response = await api.get("/pedidos");
    
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar pedido:", error);
    return { sucesso: false, mensagem: "Erro ao carregar pedido." };
  }
},
async updateStatus(id, status) {
    try {
      const response = await api.put(`/pedidos/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      return { sucesso: false, mensagem: "Erro ao atualizar status do pedido." };
    }
  },

async closeTab(id) {
    try {
      const response = await api.patch(`/comandas/${id}/fechar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao fechar a comanda:", error);
      return { sucesso: false, mensagem: "Erro ao fechar a comanda:" };
    }
  },
};
