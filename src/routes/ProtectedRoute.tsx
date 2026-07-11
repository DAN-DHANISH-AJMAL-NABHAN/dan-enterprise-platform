import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";

/**
 * Per the spec: admin status is derived from whether the logged-in user's
 * email/phone matches VITE_ADMIN_EMAILS / VITE_ADMIN_PHONES — not a role
 * field. Non-admins are bounced back to the public site.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null; // TODO: swap for a loading skeleton

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!user.isAdmin) {
    alert("You are not an administrator.");
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
