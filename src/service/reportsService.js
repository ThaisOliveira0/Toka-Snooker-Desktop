import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
  },

});

export default {
  async getReportsOrder(startDate, endDate) {

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

  async getReportsMusic(startDate, endDate) {

    try {
      const response = await api.get("/relatorio/musicas", {
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

async getGraphInfo(year, month) {
  try {
    const response = await api.get(`/relatorio/pedidos/ano/${year}/mes/${month}`);

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatório:", error);
    return null;
  }
}

};
