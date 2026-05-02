import { create } from "zustand";
import { authService } from "@/services/authService";
import type { UserSession } from "@/types";

interface SessionState {
  session: UserSession | null;
  refreshSession: () => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,

  refreshSession: () => {
    const session = authService.getSession();
    set({ session });
  },

  clearSession: () => {
    set({
      session: {
        isAuthenticated: false,
        token: null,
        expiresAt: null,
      },
    });
  },
}));
