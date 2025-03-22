import apiClient from '@/services/apiClient';

const API_URL = 'http://localhost:8080/api/v1/channels';

export default {
  createChannel: async (userId, workSpaceId, channelName) => {
    const response = await apiClient.post(API_URL, { userId, workSpaceId, channelName});
    return response;
  },
  getMessages: async (channelId) => {
    const response = await apiClient.get(`${API_URL}/${channelId}/messages`);
    return response;
  },
};
