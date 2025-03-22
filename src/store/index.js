import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    userId(state) {
      if (state.token) {
        try {
          const decoded = jwtDecode(state.token);
          return decoded.userId;
        } catch (error) {
          console.error('토큰 디코딩 오류', error);
          return null;
        }
      }
      return null;
    }
  },
  actions: {
    login(token) {
      this.token = token;
      localStorage.setItem('token', token);
      this.setUserFromToken();
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
    setUserFromToken() {
      if (this.token) {
        try {
          const decoded = jwtDecode(this.token);
          this.user = { username: decoded.sub };
        } catch (error) {
          console.error('토큰 디코딩 오류', error);
          this.logout();
        }
      }
    }
  }
});
