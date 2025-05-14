import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { useAuth } from "@/providers/AuthProvider";
import { Info, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";
import useSelectedPlan from "@/hooks/useSelectedPlan";
import UserInterface from "@/interfaces/user";
import TOKEN from "@/enums/token";

interface FormProps {
    email: string;
    password: string;
    confirmPassword: string;
}

interface ErrorsProps {
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
}

function RegisterSubscriptorForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    const [form, setForm] = React.useState<FormProps>({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = React.useState<ErrorsProps>({
        email: null,
        password: null,
        confirmPassword: null,
    });

    const [loading, setLoading] = React.useState<boolean>(false);
    const [disabled, setDisabled] = React.useState<boolean>(false);
    const authHook = useAuth();
    const planHook = useSelectedPlan();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        axios.post(APIS.REGISTER_SUSCRIPTOR, form)
            .then((response: AxiosResponse) => {
                authHook?.handleToken(response.data.token);
                setErrors({ email: null, password: null, confirmPassword: null });
        
                toast({
                    title: `Bienvenido a coursed, sigue con el proceso de pago en payu!`,
                    description: dayjs().format("LLL"),
                });

                if (planHook.selectedPlan) {
                    handleLogin(response.data.token);
                } else {
                    navigate("/#precios", { replace: true });
                }
            })
            .catch((error: AxiosError<ErrorsProps>) => {
                setErrors({
                    email: error.response?.data.email ?? null,
                    password: error.response?.data.password ?? null,
                    confirmPassword: error.response?.data.confirmPassword ?? null,
                });
                setDisabled(true);
            })
            .finally(() => setLoading(false));
    }

    const handleLogin = (token: string) => {
        axios.get(APIS.USER_AUTHENTICATED, {
            headers: {
                Authorization: `${TOKEN.PREFIX} ${token}`
            }
        })
            .then((response: AxiosResponse<UserInterface>) => {
                if (response.data.id) {
                    planHook.redirectToPayU(response.data.id);
                    planHook.clearPlan();
                } else {
                    toast({
                        title: `Tuvimos un problema en nuestro servidor, intenta nuevamente.`,
                        description: "No pudimos encontrar al usuario autenticado.",
                        variant: 'destructive',
                    });
                    navigate("/#precios", { replace: true });
                }
            })
            .catch((error: AxiosError) => {
                toast({
                    title: `Tuvimos un problema en nuestro servidor, intenta nuevamente.`,
                    description: error.message,
                    variant: 'destructive',
                });
                navigate("/#precios", { replace: true });
            });
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    }
    
    const setError = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({
            ...errors,
            [e.target.id]: null
        });
    }

    React.useEffect(() => {
        if (Object.values(errors).every(value => value === null || value === undefined)) {
            setDisabled(false);
        }
    }, [errors]);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleRegister}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <Link
                            to="/"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <img 
                                src="/logo.png" 
                                className="w-10" 
                                alt="Courseed"
                            />
                            <span className="sr-only">Courseed</span>
                        </Link>
                        <h1 className="text-xl font-bold">Te damos la bienvenida a courseed</h1>
                        <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/acceso" className="underline underline-offset-4 text-zinc-900 dark:text-white">
                                Inicia Sesión Aqui
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo Electronico</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="m@example.com"
                                value={form.email}
                                onChange={e => {
                                    handleOnChange(e);
                                    setError(e);
                                }}
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
                                onChange={e => {
                                    handleOnChange(e);
                                    setError(e);
                                }}
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
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Confirmar Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                value={form.confirmPassword}
                                onChange={e => {
                                    handleOnChange(e);
                                    setError(e);
                                }}
                                disabled={loading}
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
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={loading || disabled}
                        >
                            Registrarse
                            {loading && (
                                <LoaderCircle className="animate-spin" />
                            )}
                        </Button>
                    </div>
                </div>
            </form>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                Al hacer click en registrarse, estas aceptando los <a href="#">Terminos del servicio</a>{" "}
                y la <a href="#">Politica de Privacidad</a>.
            </div>
        </div>
    );
}

export default RegisterSubscriptorForm;