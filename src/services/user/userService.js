import axios from 'axios';
import apiClient from '@/services/apiClient';

const API_URL = 'http://localhost:8080/api/v1/users';

export default {
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, { username, password }); // 직접 요청
    return response;
  },
  signup: async (username, password, nickname, userRole) => {
    const response = await axios.post(API_URL, { username, password, nickname, userRole }); // 직접 요청
    return response;
  },
  getWorkSpace: async (userId) => {
    const response = await apiClient.get('/users/workspaces', { params: { userId } });
    return response;
  },
};
