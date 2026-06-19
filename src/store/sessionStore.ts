import { create } from "zustand";
import { authService } from "@/services/authService";

interface SessionState {
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isAuthenticated: false,

  refreshSession: async () => {
    const authed = await authService.checkSession();
    set({ isAuthenticated: authed });
  },

  clearSession: () => {
    set({ isAuthenticated: false });
  },
}));
