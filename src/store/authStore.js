import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import api from '../services/api';
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (userData) => set({ 
        user: userData, 
        isAuthenticated: true 
      }),
      
      logout: async () => {
        try {
          await api.post('/users/logout', {}, {
            withCredentials: true 
          });
          
          set({ 
            user: null, 
            isAuthenticated: false 
          });
          
          return { success: true };
        } catch (error) {
          console.error("Logout failed:", error);
          return { 
            success: false, 
            error: error.response?.data?.message || "Logout failed" 
          };
        }
      }
    }),
    {
      name: 'auth-storage', 
      getStorage: () => localStorage, 
    }
  )
);