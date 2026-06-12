"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function ForgotPasswordForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"phone" | "reset" | "done">("phone");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const response = await authService.forgotPassword(phoneNumber);

    if (response.success) {
      setMessage(response.message);
      setStep("reset");
    } else {
      setError(response.message);
    }

    setIsLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await authService.resetPassword(phoneNumber, newPassword);

    if (response.success) {
      setMessage(response.message);
      setStep("done");
    } else {
      setError(response.message);
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
          <Phone size={24} />
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">Forgot Password</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {step === "phone"
            ? "Enter your registered phone number"
            : step === "reset"
              ? "Enter your new password"
              : "Password reset complete"}
        </p>
      </div>

      {step === "phone" && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            type="tel"
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="08029315311"
            required
            error={error || undefined}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send OTP
          </Button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleReset} className="space-y-4">
          {message && (
            <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
              {message}
            </p>
          )}
          <Input
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            error={error || undefined}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      )}

      {step === "done" && (
        <div className="space-y-4 text-center">
          <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
            {message}
          </p>
          <Link href="/admin/login">
            <Button className="w-full">Back to Login</Button>
          </Link>
        </div>
      )}

      {step !== "done" && (
        <div className="mt-4 text-center">
          <Link
            href="/admin/login"
            className="text-sm text-zinc-400 transition-colors hover:text-[var(--accent)]"
          >
            Back to Login
          </Link>
        </div>
      )}
    </Card>
  );
}
