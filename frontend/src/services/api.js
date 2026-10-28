import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Envia o token em todos os pedidos
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Se o token expirar, volta ao login
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const eLogin = erro.config?.url?.includes('/auth/login');
    if (erro.response?.status === 401 && !eLogin) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(erro);
  }
);

export default api;