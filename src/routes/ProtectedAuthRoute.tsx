import { useIsAuth } from "@/providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedAuthRoute() {
    const isAuth = useIsAuth();
    if (isAuth === null) return null;
    return isAuth ? <Outlet /> : <Navigate to="/acceso" />;
}

export default ProtectedAuthRoute;