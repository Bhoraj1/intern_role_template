"use client";
import RouteGuard from "../guards/RouteGuard";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";

export default function AuthWrapper() {
  return (
    <RouteGuard>
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    </RouteGuard>
  );
}
