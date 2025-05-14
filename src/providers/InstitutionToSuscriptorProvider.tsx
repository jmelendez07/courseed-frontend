import React from "react";
import { useAuth } from "./AuthProvider";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import ConfettiExplosion from "react-confetti-explosion";
import CreateInstitutionForm from "@/components/form/create-institution-form";
import InstitutionInterface from "@/interfaces/institution";

interface ChildrenProps {
    children: React.ReactNode,
}

interface ContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InstitutionToSuscriptorContext = React.createContext<ContextProps | null>(null);

function InstitutionToSuscriptorProvider({ children }: ChildrenProps) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [isExploding, setIsExploding] = React.useState(false);
    const authHook = useAuth();

    const contextValue: ContextProps = React.useMemo(
        () => ({
            open,
            setOpen  
        }), [open]
    );

    React.useEffect(() => {
        axios.get(APIS.INSTITUTION_BY_AUTH)
            .then((response: AxiosResponse<InstitutionInterface>) => {
                setOpen(!response.data.id);
            })
            .catch(() => {
                setOpen(true);
            });
    }, [authHook?.user]);

    return (
        <InstitutionToSuscriptorContext.Provider value={contextValue}>
            {children}
            <CreateInstitutionForm
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
        </InstitutionToSuscriptorContext.Provider>
    );
}

export default InstitutionToSuscriptorProvider;