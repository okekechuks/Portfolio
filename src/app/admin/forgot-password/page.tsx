import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | Portfolio CMS",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <ForgotPasswordForm />
    </div>
  );
}
