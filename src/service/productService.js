import axios from "axios";

const API_BASE_URL = "http://localhost:3000";


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'x-api-key': 12345
    }
});

export default {
    async getAllProdutos() {
        try {
            const response = await api.get("/produtos/")
            return response.data
        } catch (error) {
            console.error('Erro ao buscar produtos:', error)
            return { data: [] }
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