import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

export function AdminAuthBoundary() {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
}