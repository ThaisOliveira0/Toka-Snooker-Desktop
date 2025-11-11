
const API_BASE_URL = "http://localhost:3000";
import axios from "axios";

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
  async closeTab(id) {
    try {
      const response = await api.patch(`/comandas/${id}/fechar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao fechar a comanda:", error);
      return { sucesso: false, mensagem: "Erro ao fechar a comanda:" };
    }
  },
  async editTab(id,comanda) {
    try {
      const response = await api.put(`/comandas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao editar a comanda:", error);
      return { sucesso: false, mensagem: "Erro ao editar a comanda:" };
    }
  },
}