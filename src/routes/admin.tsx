import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    const role = localStorage.getItem("user_role");
    const passkeyVerified = localStorage.getItem("admin_passkey_verified");
    if (role !== "admin" || passkeyVerified !== "true") {
      throw redirect({
        to: "/auth",
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Topbar Navigation */}
        <AdminTopbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
