import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

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
          // Call the backend logout endpoint
          await axios.post('http://localhost:8000/api/v1/users/logout', {}, {
            withCredentials: true // Important to include cookies
          });
          
          // Clear auth state
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
      name: 'auth-storage', // name of the item in storage
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);