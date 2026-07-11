import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* TODO: <AdminSidebar /> with the nav list from the spec's Admin Navigation section */}
      <div className="flex-1">
        {/* TODO: <AdminTopbar /> */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
