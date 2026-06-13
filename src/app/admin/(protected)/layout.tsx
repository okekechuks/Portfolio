import { AuthGuard } from "@/components/admin/AuthGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-zinc-950">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </AuthGuard>
  );
}
