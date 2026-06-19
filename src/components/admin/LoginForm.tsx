"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const response = await login(password);
    if (response.success) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
          <Lock size={24} />
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">Admin Login</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Enter your password to access the dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          required
          error={error ?? undefined}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Login
        </Button>

        <div className="text-center">
          <Link
            href="/admin/forgot-password"
            className="text-sm text-zinc-400 transition-colors hover:text-[var(--accent)]"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </Card>
  );
}
