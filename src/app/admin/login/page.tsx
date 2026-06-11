import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin Login | Portfolio CMS",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <LoginForm />
    </div>
  );
}
