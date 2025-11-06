import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-api-key": 12345,
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
