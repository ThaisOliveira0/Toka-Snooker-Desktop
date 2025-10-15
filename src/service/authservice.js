import axios from 'axios';

const API_URL = 'http://localhost:3000'; 

export async function login(email, senha) {
    
  try {
    const response = await axios.post(`${API_URL}/login`, { email, senha });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data; 
  } catch (error) {
    console.error('Erro ao fazer login:', error.response?.data || error);
    throw error;
  }
}
