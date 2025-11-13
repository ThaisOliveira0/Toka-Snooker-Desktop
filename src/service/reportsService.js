import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  headers: {
    'x-api-key': process.env.VUE_APP_API_KEY 
  }
});

export default {
  async getReports(startDate, endDate) {
    
    try {
      const response = await api.get("/relatorio/pedidos", {
        params: {
          dataInicio: startDate,
          dataFim: endDate,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
      return null;
    }
  },
};
