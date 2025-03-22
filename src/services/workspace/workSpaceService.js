import apiClient from '@/services/apiClient';

const API_URL = 'http://localhost:8080/api/v1/workspaces';

export default {
  createWorkSpace: async (userId, workSpaceName) => {
    const response = await apiClient.post(API_URL, { workSpaceName, userId });
    console.log(userId, workSpaceName)
    return response;
  },
  createChannel: async (userId, workSpaceId, channelName) => {
    const response = await apiClient.post(`${API_URL}/channels`, { userId, workSpaceId, channelName});
    return response;
  },
  getChannel: async (workSpaceId) => {
    const response = await apiClient.get(`${API_URL}/${workSpaceId}/channels`);
    return response;
  },
  getUser: async (workSpaceId) => {
    const response = await apiClient.get(`${API_URL}/${workSpaceId}/users`);
    return response;
  },
  inviteUser: async (workSpaceId, username) => {
    console.log(workSpaceId, username)
    const response = await apiClient.post(`${API_URL}/invite`, { workSpaceId, username })
    return response;
  },

};
