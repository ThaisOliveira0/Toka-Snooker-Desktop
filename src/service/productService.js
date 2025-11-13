import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  headers: {
    'x-api-key': process.env.VUE_APP_API_KEY
  }
});

export default {
  async getAllProdutos() {
    try {
      const response = await api.get("/produtos/");
      return response.data; 
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return []; 
    }
  },

    createProduto(produtoData) {
        return api.post("/produtos/", produtoData);
    },

    updateProduto(id, produtoData) {
        return api.put(`/produtos/${id}`, produtoData);
    },

    deleteProduto(id) {
        return api.delete(`/produtos/${id}`);

    }
}