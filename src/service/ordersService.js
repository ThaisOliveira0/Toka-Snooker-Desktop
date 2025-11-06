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
    
    return response.data;
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return { sucesso: false, mensagem: "Erro ao criar pedido." };
  }
},
};
