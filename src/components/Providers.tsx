"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useThemeStore((s) => s.hydrate);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    hydrate();
    initialize();
  }, [hydrate, initialize]);

  return <>{children}</>;
}
