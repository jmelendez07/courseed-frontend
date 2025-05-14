import React from "react";
import ProfileFormDialog from "@/components/form/profile-form-dialog";
import ConfettiExplosion from "react-confetti-explosion";
import { useAuth } from "./AuthProvider";

interface ChildrenProps {
    children: React.ReactNode,
}

interface ProfileContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileContext = React.createContext<ProfileContextProps | null>(null);

function ProfileProvider({ children }: ChildrenProps) {

    const [open, setOpen] = React.useState<boolean>(false);
    const [isExploding, setIsExploding] = React.useState(false);
    const authHook = useAuth();

    React.useEffect(() => {
        if (authHook?.user && (!authHook.user.profile || Object.values(authHook.user.profile).some(value => value === null))) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [authHook?.user]);

    const contextValue: ProfileContextProps = React.useMemo(
        () => ({
            open,
            setOpen  
        }), [open]
    );

    return (
        <ProfileContext.Provider value={contextValue}>
            {children}
            <ProfileFormDialog 
                open={open} 
                setOpen={(value: boolean) => setOpen(value)} 
                setExploding={(value: boolean) => setIsExploding(value)}
            />
            <div className="fixed top-0 left-0 w-full h-full -z-50 items-center opacity-0 justify-center" style={{ display: isExploding ? "flex" : "none" }}>
                {isExploding && (
                    <ConfettiExplosion
                        force={0.8}
                        duration={3000}
                        particleCount={250}
                        width={window.innerWidth}
                        height={window.innerHeight}
                    />
                )}
            </div>
        </ProfileContext.Provider>
    );
}

export default ProfileProvider;
export { ProfileContext };