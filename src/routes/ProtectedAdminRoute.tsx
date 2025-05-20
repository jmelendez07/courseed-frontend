import { useIsAdmin } from "@/providers/AuthProvider";
import { LoaderCircle } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedAdminRoute() {
    const isAuth = useIsAdmin();
    
    if (isAuth === null) {
        return (
            <div className="w-screen h-screen grid place-items-center place-content-center">
                <LoaderCircle className="animate-spin text-gray-600 size-5" />
            </div>
        );
    };

    return isAuth ? <Outlet /> : <Navigate to="/acceso" />;
}

export default ProtectedAdminRoute;