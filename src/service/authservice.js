import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useToast } from "vue-toastification";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});

export async function login(email, senha) {
  try {
    const response = await api.post("/login", { email, senha });

    if (response.data.token) {
      const token = response.data.token;
      sessionStorage.setItem('token', token);

      const decoded = jwt_decode(token);
      const { id, role } = decoded;

      return { token, id, role };
    }
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error.response?.data || error);
    throw error;
  }
}

export async function register(nome, email, telefone, senha, tipo_usuario) {
  try {
    const response = await api.post("/usuarios", {
      nome,
      email,
      telefone,
      senha,
      tipo_usuario
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar:', error.response?.data || error);
    throw error;
  }
}

export function getToken() {
  return sessionStorage.getItem('token');
}

export function getDecodedToken() {
  const token = getToken();
  if (!token) return null;

  try {
    return jwt_decode(token);
  } catch {
    return null;
  }
}

export function logout() {
  sessionStorage.removeItem('token');
}

export function globalLogout() {
  logout();
  window.dispatchEvent(new Event('login-status-changed'));
  window.location.href = '/';
}

export async function sendCode(email) {
  const response = await api.post("/login/recuperacao", { email });
  return response.data;
}

export async function verifyCode(email, codigo) {
  const response = await api.post("/login/verificar-codigo", { email, codigo });
  return response.data;
}

export async function resetPassword(id, senha) {
  const response = await axios.put(`${API_URL}/login/alterar-senha/${id}`, { senha })
  return response.data
}


export function startSessionTimer() {
  const toast = useToast();

  const SESSION_LIMIT = 60 * 60 * 1000;

  function updateActivity() {
    sessionStorage.setItem('lastActivity', Date.now())
  }

  function checkInactivity() {
    const last = parseInt(sessionStorage.getItem('lastActivity') || '0')
    const now = Date.now()

    if (now - last > SESSION_LIMIT) {
      toast.warning('Sua sessão expirou por inatividade.', {
        timeout: 3000,
        position: "top-right",
        closeOnClick: true,
        pauseOnHover: true,
      })
      setTimeout(() => {
        globalLogout()
      }, 3000)
    }
  }

  window.addEventListener('mousemove', updateActivity)
  window.addEventListener('keydown', updateActivity)
  window.addEventListener('click', updateActivity)
  window.addEventListener('scroll', updateActivity)


  setInterval(checkInactivity, 30000)

  updateActivity()
}
