"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ForgotPasswordForm() {
  return (
    <Card className="w-full max-w-md">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
          <Phone size={24} />
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">Forgot Password</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Self-service password reset is disabled for this admin portal.
        </p>
      </div>

      <div className="space-y-4">
        <p className="rounded-lg bg-zinc-900 p-4 text-sm leading-relaxed text-zinc-300">
          Reset the admin password manually through your deployment environment or
          update the stored value in Supabase. This avoids exposing a weak recovery
          flow on a public-facing route.
        </p>
        <Link href="/admin/login">
          <Button className="w-full">Back to Login</Button>
        </Link>
      </div>
    </Card>
  );
}
