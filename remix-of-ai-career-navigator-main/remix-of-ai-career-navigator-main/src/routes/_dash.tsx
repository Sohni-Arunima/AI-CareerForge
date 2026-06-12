import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "../components/AppSidebar";

export const Route = createFileRoute("/_dash")({
  component: DashLayout,
});

function DashLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
