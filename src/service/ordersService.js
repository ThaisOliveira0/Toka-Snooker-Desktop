import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
  },

});

export default {

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
};
