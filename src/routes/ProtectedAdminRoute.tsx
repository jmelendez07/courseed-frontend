import { useIsAdmin } from "@/providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedAdminRoute() {
    const isAuth = useIsAdmin();
    if (isAuth === null) return null;
    return isAuth ? <Outlet /> : <Navigate to="/acceso" />;
}

export default ProtectedAdminRoute;