import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-api-key": 12345,
  },
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
      console.log(response);
      
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
      return null;
    }
  },
};
