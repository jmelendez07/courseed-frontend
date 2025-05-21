import React from "react";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import ROLES from "@/enums/roles";

interface ChildrenProps {
    children: React.ReactNode,
}

interface ProfileContextProps {
    redirect: boolean;
    setRedirect: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileFormContext = React.createContext<ProfileContextProps | null>(null);

function ProfileFormProvider({ children }: ChildrenProps) {
    const authHook = useAuth();
    const [redirect, setRedirect] = React.useState<boolean>(false);
    const navigate = useNavigate();
    
    React.useEffect(() => {
        console.log(authHook?.user);
        if (authHook?.user && authHook.user.roles?.some(r => r === ROLES.USER) && (!authHook.user.profile || Object.values(authHook.user.profile).some(value => value === null))) {
            setRedirect(true);
            navigate("/formulario-perfil", { replace: true });
        } else {
            setRedirect(false);
        }
    }, []);

    const contextValue: ProfileContextProps = React.useMemo(
        () => ({
            redirect,
            setRedirect  
        }), [redirect]
    );

    return (
        <ProfileFormContext.Provider value={contextValue}>
            {children}
        </ProfileFormContext.Provider>
    );
}

export default ProfileFormProvider;