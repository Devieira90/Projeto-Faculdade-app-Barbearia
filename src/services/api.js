// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.107:3000',
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;