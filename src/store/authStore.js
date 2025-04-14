import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      tokens: null, // Add this to store tokens
      isAuthenticated: false,
      
      login: (userData, tokens) => set({ // Update to accept tokens
        user: userData,
        tokens: tokens, // Store tokens
        isAuthenticated: true 
      }),
      
      logout: async () => {
        try {
          await api.post('/users/logout', {}, {
            withCredentials: true 
          });
          
          set({ 
            user: null,
            tokens: null, // Clear tokens
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