import APIS from "@/enums/apis";
import axios, { AxiosError } from "axios";
import React from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";
import { DialogContext } from "@/providers/DialogProvider";
import UserInterface from "@/interfaces/user";

interface DeleteUserProps {
    user: UserInterface;
    onDeleted?: (user: UserInterface) => void
}

interface ErrorProps {
    userId: string | null;
}

function DeleteUserForm({ user, onDeleted }: DeleteUserProps) {
    const dialogContext = React.useContext(DialogContext);
    const [loading, setLoading] = React.useState<boolean>(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        
        axios.delete(`${APIS.USER_DELETE}${user.id}`)
            .then(() => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `${user.email} Eliminado!`,
                    description: dayjs().format("LLL"),
                });
                if (onDeleted) onDeleted(user);
            })
            .catch((error: AxiosError<ErrorProps>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `Error al eliminar a ${user.email}. Algo salió mal!`,
                    description: error.response?.data.userId || error.message,
                    variant: "destructive",
                });
            })
            .finally(() => setLoading(false));
    } 

    return (
        <form onSubmit={handleSubmit} className="grid items-center justify-center gap-2">
            <Button
                type="submit"
                disabled={loading}
            >
                <p className="max-w-full truncate inline-flex items-center gap-2">
                    Eliminar Permanentemente
                    {loading && (
                        <LoaderCircle className="animate-spin" />
                    )}
                </p>
            </Button>
        </form>
    );
}

export default DeleteUserForm;