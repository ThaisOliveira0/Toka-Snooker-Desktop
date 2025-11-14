import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
  },

});

export default {
  async getInventory() {
    try {
      const response = await api.get("/ingredientes");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estoque:", error);
      return [];
    }
  },

  async createItem(item) {
    try {
      const response = await api.post("/ingredientes", item);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar ingrediente:", error);
    }
  },

  async updateItem(id, item) {
    try {
      const response = await api.put(`/ingredientes/${id}`, item);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar ingrediente:", error);
    }
  },

  async patchItem(items) {
    try {
      const response = await api.patch(`/ingredientes`, items);
      return response.data;
    } catch (error) {
      console.error("Erro ao aplicar patch no ingrediente:", error);
    }
  },


  async deleteItem(id) {
    try {
      const response = await api.delete(`/ingredientes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar ingrediente:", error);
    }
  },
};
