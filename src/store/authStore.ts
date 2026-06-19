import { create } from "zustand";
import { authService } from "@/services/authService";
import type { AuthResponse } from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    const authed = await authService.checkSession();
    set({ isAuthenticated: authed, isInitialized: true });
  },

  login: async (password: string) => {
    set({ isLoading: true, error: null });
    const response = await authService.login(password);

    if (response.success) {
      set({ isAuthenticated: true, isLoading: false });
    } else {
      set({ isAuthenticated: false, isLoading: false, error: response.message });
    }

    return response;
  },

  logout: async () => {
    await authService.logout();
    set({ isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
