import axios from "axios";

const API_BASE_URL = "http://localhost:3000";


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // 'Authorization': `Bearer ${token}`,
    'x-api-key': 'API_KEY_AQUI' 
  }
});

export default {
  getAllProdutos() {
    return api.get("/produtos/");
  },

  getProdutosPromo() {
    return api.get("/produtos/promo");
  },

  getProdutoById(id) {
    return api.get(`/produtos/${id}`);
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
};
