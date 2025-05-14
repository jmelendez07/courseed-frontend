import UserInterface from "@/interfaces/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { Info } from "lucide-react";
import axios, { AxiosError, AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { useToast } from "@/hooks/use-toast";
import { DialogContext } from "@/providers/DialogProvider";
import dayjs from "dayjs";
import ComboBoxResponsive from "@/components/ui/combo-box-responsive";
import ROLES from "@/enums/roles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface FormProps {
    email: string;
    password: string;
    roles: string[];
}

interface ErrorProps {
    userId: string | null;
    email: string | null;
    password: string | null;
    roles: string | null;
}

interface UpdateUserFormProps {
    user: UserInterface;
    onUpdate?: (user: UserInterface) => void;
}

function UpdateUserForm({ user, onUpdate }: UpdateUserFormProps) {
    const [form, setForm] = React.useState<FormProps>({
        email: user.email ?? '',
        password: '',
        roles: user.roles ?? []
    });
    const [errors, setErrors] = React.useState<ErrorProps>({
        userId: null,
        email: null,
        password: null,
        roles: null
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const { toast } = useToast();
    const dialogContext = React.useContext(DialogContext);

    const handleUpdateEmail = () => {
        setLoading(true);
        axios.put(APIS.USER_UPDATE_EMAIL + user.id, {
            email: form.email
        })
            .then((response: AxiosResponse<UserInterface>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `${response.data.email} Actualizado!`,
                    description: dayjs(response.data.updatedAt).format("LLL"),
                });
                if (onUpdate) onUpdate(response.data);
            })
            .catch((error: AxiosError<ErrorProps>) => {
                if (error.response?.data.userId) {
                    dialogContext?.setContext({
                        ...dialogContext.context,
                        open: false
                    });
                    toast({
                        title: `Error al actualizar a ${user.email}. Algo salió mal!`,
                        description: error.response?.data.userId || error.message,
                        variant: "destructive",
                    });
                } else {
                    setErrors({
                        userId: error.response?.data.userId ?? null,
                        email: error.response?.data.email ?? null,
                        password: error.response?.data.password ?? null,
                        roles: error.response?.data.roles ?? null
                    });
                }
            })
            .finally(() => setLoading(false));
    }

    const handleUpdatePassword = () => {
        setLoading(true);
        axios.put(APIS.USER_UPDATE_PASSWORD + user.id, {
            password: form.password
        })
            .then((response: AxiosResponse<UserInterface>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `Contraseña de ${response.data.email} Actualizada!`,
                    description: dayjs(response.data.updatedAt).format("LLL"),
                });
                if (onUpdate) onUpdate(response.data);
            })
            .catch((error: AxiosError<ErrorProps>) => {
                if (error.response?.data.userId) {
                    dialogContext?.setContext({
                        ...dialogContext.context,
                        open: false
                    });
                    toast({
                        title: `Error al actualizar a ${user.email}. Algo salió mal!`,
                        description: error.response?.data.userId || error.message,
                        variant: "destructive",
                    });
                } else {
                    setErrors({
                        userId: error.response?.data.userId ?? null,
                        email: error.response?.data.email ?? null,
                        password: error.response?.data.password ?? null,
                        roles: error.response?.data.roles ?? null
                    });
                }
            })
            .finally(() => setLoading(false));
    }

    const handleUpdateRol = () => {
        setLoading(true);
        axios.put(APIS.USER_UPDATE_ROLES + user.id, {
            roles: form.roles
        })
            .then((response: AxiosResponse<UserInterface>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `Rol de ${response.data.email} Actualizado!`,
                    description: dayjs(response.data.updatedAt).format("LLL"),
                });
                if (onUpdate) onUpdate(response.data);
            })
            .catch((error: AxiosError<ErrorProps>) => {
                if (error.response?.data.userId) {
                    dialogContext?.setContext({
                        ...dialogContext.context,
                        open: false
                    });
                    toast({
                        title: `Error al actualizar a ${user.email}. Algo salió mal!`,
                        description: error.response?.data.userId || error.message,
                        variant: "destructive",
                    });
                } else {
                    setErrors({
                        userId: error.response?.data.userId ?? null,
                        email: error.response?.data.email ?? null,
                        password: error.response?.data.password ?? null,
                        roles: error.response?.data.roles ?? null
                    });
                }
            })
            .finally(() => setLoading(false));
    }

    return (
        <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email">Correo Electronico</TabsTrigger>
                <TabsTrigger value="password">Contraseña</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
                <Card>
                    <form onSubmit={e => {
                        e.preventDefault();
                        handleUpdateEmail();
                    }}>
                        <CardHeader>
                            <CardTitle>Correo Electronico</CardTitle>
                            <CardDescription>
                                Introduce un nuevo correo disponible para el usuario.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 grid gap-2">
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
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loading} type="submit">Guardar cambios</Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <form onSubmit={e => {
                        e.preventDefault();
                        handleUpdatePassword();
                    }}>
                        <CardHeader>
                            <CardTitle>Nueva contraseña</CardTitle>
                            <CardDescription>
                                Reemplaza la actual contraseña del usuario.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 grid gap-2">
                            <Input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Escribe la nueva contraseña"
                                value={form.password}
                                onChange={e => setForm({
                                    ...form,
                                    password: e.target.value
                                })}
                                disabled={loading}
                            />
                            {errors.password && (
                                <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                                    <Info className="w-3 h-3 min-h-3 min-w-3" />
                                    <span>
                                        {errors.password}
                                    </span>
                                </p>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loading}>Guardar Contraseña</Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
            <TabsContent value="roles">
                <Card>
                    <form onSubmit={e => {
                        e.preventDefault();
                        handleUpdateRol();
                    }}>
                        <CardHeader>
                            <CardTitle>Nuevo Rol</CardTitle>
                            <CardDescription>
                                Reemplaza el rol actual del usuario seleccionandolo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 grid gap-2">
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
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loading}>Guardar Rol</Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

export default UpdateUserForm;