import React from "react";
import { useAuth } from "./AuthProvider";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import ConfettiExplosion from "react-confetti-explosion";
import CreateInstitutionForm from "@/components/form/create-institution-form";
import InstitutionInterface from "@/interfaces/institution";
import { Link } from "react-router-dom";

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
    const [verified, setVerified] = React.useState<boolean | null>(null);
    const [isExploding, setIsExploding] = React.useState(false);
    const authHook = useAuth();

    const contextValue: ContextProps = React.useMemo(
        () => ({
            open,
            setOpen  
        }), [open]
    );

    React.useEffect(() => {
        axios.get(APIS.VERIFY_SUBSCRIPTOR)
            .then((response: AxiosResponse<boolean>) => {
                if (typeof response.data === "boolean" && response.data) {
                    setVerified(true);
                    axios.get(APIS.INSTITUTION_BY_AUTH)
                        .then((response: AxiosResponse<InstitutionInterface>) => {
                            setOpen(!response.data.id);
                        })
                        .catch(() => {
                            setOpen(true);
                        });
                } else {
                    setVerified(false);
                }
            })
            .catch(() => {
                setVerified(false);
            });
    }, [authHook?.user]);

    return (
        <InstitutionToSuscriptorContext.Provider value={contextValue}>
            {children}
            { verified === true ? (
                <CreateInstitutionForm
                    open={open} 
                    setOpen={(value: boolean) => setOpen(value)} 
                    setExploding={(value: boolean) => setIsExploding(value)}
                />
            ) : verified === false && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:border-zinc-800 dark:bg-zinc-950 rounded-lg w-full max-w-md p-6 shadow-lg">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Suscripción no completada</h2>
                        </div>

                        <p className="text-gray-500 mb-6">Por favor completa la Suscripción para poder acceder a este contenido.</p>

                        <Link to="/#precios">Suscribirse</Link>
                    </div>
                </div>
            )}
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