import { useAuth } from "@/providers/AuthProvider";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
    const auth = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
        auth?.setUser(null);
        navigate("/", { replace: true });
    }, []);

    return null;
}

export default Logout;