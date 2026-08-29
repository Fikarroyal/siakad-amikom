"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { RoleDashboardPlaceholder } from "@/components/dashboard/role-dashboard-placeholder";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case "mahasiswa":
      return <StudentDashboard />;
    default:
      return <RoleDashboardPlaceholder role={user.role} />;
  }
}
