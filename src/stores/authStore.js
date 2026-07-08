import { defineStore } from 'pinia';
import api from '../utils/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Mengambil token dan data user dari localStorage jika sudah pernah login
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/api/auth/login', { email, password });
        
        // Simpan ke state Pinia
        this.token = response.data.data.token;
        this.user = response.data.data.user;
        
        // Simpan ke localStorage agar tidak hilang saat refresh
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});