"use client";

import { ThemeToggle } from "@/components/ThemeToggle";

export function ContrastToggle() {
  return (
    <div className="fixed top-5 right-5 z-50">
      <ThemeToggle showLabel />
    </div>
  );
}
