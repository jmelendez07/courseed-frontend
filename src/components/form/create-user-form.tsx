import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { Info, LoaderCircle } from "lucide-react";
import UserInterface from "@/interfaces/user";
import ROLES from "@/enums/roles";
import ComboBoxResponsive from "@/components/ui/combo-box-responsive";
import { DialogContext } from "@/providers/DialogProvider";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";

interface FormProps {
    email: string;
    password: string;
    confirmPassword: string;
    roles: string[];
}

interface ErrorProps {
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
    roles: string | null;
}

function CreateUserForm() {
    const dialogContext = React.useContext(DialogContext);
    const { toast } = useToast();
    const [form, setForm] = React.useState<FormProps>({
        email: "",
        password: "",
        confirmPassword: "",
        roles: [ROLES.USER]
    });
    const [errors, setErrors] = React.useState<ErrorProps>({
        email: null,
        password: null,
        confirmPassword: null,
        roles: null
    });
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        axios.post(APIS.USER_CREATE, form)
            .then((response: AxiosResponse<UserInterface>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `Usuario con email ${response.data.email} Creado!`,
                    description: dayjs(response.data.createdAt).format("LLL"),
                });
            })
            .catch((error: AxiosError<ErrorProps>) => {
                setErrors({
                    email: error.response?.data.email ?? null,
                    password: error.response?.data.password ?? null,
                    confirmPassword: error.response?.data.confirmPassword ?? null,
                    roles: error.response?.data.roles ?? null
                });
                
                if (error.response?.data.confirmPassword) {
                    setForm({ ...form, confirmPassword: '' });
                }
            })
            .finally(() => setLoading(false));
    }

    return (
        <form onSubmit={handleSubmit} className="grid items-start gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Correo Electronico</Label>
                <Input 
                    type="email" 
                    autoComplete="email" 
                    id="email" 
                    placeholder="nombre@organizacion.tipo" 
                    value={form.email}
                    onChange={e => setForm({
                        ...form,
                        email: e.target.value
                    })}
                    disabled={loading}
                />
                {errors.email && (
                    <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                        <Info className="w-3 h-3 min-h-3 min-w-3" />
                        <span>
                            {errors.email}
                        </span>
                    </p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                    id="password" 
                    type="password" 
                    autoComplete="new-password" 
                    value={form.password}
                    disabled={loading}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                />
                {errors.password && (
                    <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                        <Info className="w-3 h-3 min-h-3 min-w-3" />
                        <span>
                            {errors.password}
                        </span>
                    </p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input 
                    id="confirmPassword" 
                    type="password" 
                    autoComplete="new-password" 
                    value={form.confirmPassword}
                    disabled={loading}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                />
                {errors.confirmPassword && (
                    <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                        <Info className="w-3 h-3 min-h-3 min-w-3" />
                        <span>
                            {errors.confirmPassword}
                        </span>
                    </p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="roles">Roles</Label>
                <ComboBoxResponsive
                    placeholder="Selecciona un rol" 
                    statuses={[
                        { id: ROLES.ADMIN, name: 'Administrador' }, 
                        { id: ROLES.USER, name: 'Usuario' } 
                    ]}
                    selectedStatus={
                        form.roles.length > 0 
                            ? { 
                                id: form.roles[0], 
                                name: form.roles[0] === ROLES.ADMIN 
                                    ? 'Administrador' 
                                    : form.roles[0] === ROLES.USER 
                                        ? 'Usuario'
                                        : form.roles[0] 
                            } 
                            : null
                    }
                    setSelectedStatus={newRole => setForm({
                        ...form,
                        roles: [newRole?.id ?? '']
                    })}
                />
                {errors.roles && (
                    <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                        <Info className="w-3 h-3 min-h-3 min-w-3" />
                        <span>
                            {errors.roles}
                        </span>
                    </p>
                )}
            </div>
            <Button 
                type="submit"
                className="flex gap-2 overflow-hidden"
                disabled={loading}
            >
                <p className="truncate">Registrar Usuario</p> 
                {loading && (
                    <LoaderCircle className="animate-spin" />
                )}
            </Button>
        </form>
    );
}

export default CreateUserForm;