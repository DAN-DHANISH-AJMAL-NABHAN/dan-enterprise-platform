import { Navigate } from "react-router-dom";
import { AdminModulePage } from "@/components/admin/AdminModulePage";
import { adminModulesById } from "@/modules/admin/adminModules";
import { ROUTES } from "@/constants/routes";

export function AdminModuleRoutePage({ moduleId }: { moduleId: string }) {
  const module = adminModulesById.get(moduleId);
  if (!module) return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  return <AdminModulePage module={module} />;
}
