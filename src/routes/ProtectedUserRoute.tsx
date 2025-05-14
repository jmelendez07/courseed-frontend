import { useIsUser } from "@/providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedUserRoute() {
    const isAuth = useIsUser();
    if (isAuth === null) return null;
    return isAuth ? <Outlet /> : <Navigate to="/acceso" />;
}

export default ProtectedUserRoute;