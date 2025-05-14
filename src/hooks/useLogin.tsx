import APIS from "@/enums/apis";
import ROLES from "@/enums/roles";
import TOKEN from "@/enums/token";
import { useAuth } from "@/providers/AuthProvider";
import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

interface CredentialsProps {
    email: string;
    password: string;
}

interface CredentialsErrorProps {
    email: string | null;
    password: string | null;
    auth: string | null;
}

interface AuthCredentialsProps {
    roles: Array<String> | null;
}

function useLogin() {
    const [credentials, setCredentials] = React.useState<CredentialsProps>({
        email: '',
        password: ''
    });
    const [credentialsErrors, setCredentialsErrors] = React.useState<CredentialsErrorProps>({
        email: null,
        password: null,
        auth: null
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const [disabled, setDisabled] = React.useState<boolean>(false);
    const [token, setToken] = React.useState<string | null>(null);

    const auth = useAuth();
    const navigate = useNavigate();

    const setCredential = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });
    }

    const setError = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentialsErrors({
            ...credentialsErrors,
            [e.target.id]: null,
            ...(e.target.id === "password" && credentialsErrors.auth ? { auth: null } : {})
        });
    }

    const handleLogin = async () => {
        setLoading(true);
        axios.post(APIS.LOGIN, credentials)
            .then(response => {
                if (!response.data) return;

                setCredentialsErrors({
                    email: null,
                    password: null,
                    auth: null
                });

                auth?.handleToken(response.data.token);
                redirectByRole(response.data.token);
            })
            .catch((error: AxiosError<CredentialsErrorProps>) => {
                if (!error.response?.data) return;

                if (error.response.data.auth) {
                    setCredentials({
                        ...credentials,
                        password: ''
                    });
                }

                setCredentialsErrors({
                    email: error.response.data.email ?? null,
                    password: error.response.data.password ?? null,
                    auth: error.response.data.auth ?? null
                });

                setDisabled(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const redirectByRole = (token: string) => {
        axios.get(APIS.USER_AUTHENTICATED, {
            headers: {
                Authorization: `${TOKEN.PREFIX} ${token}`
            }
        })
            .then((response: AxiosResponse<AuthCredentialsProps>) => {
                if (response.data && Array.isArray(response.data.roles)) {
                    if (response.data.roles.some(role => role === ROLES.ADMIN)) {
                        navigate("/administrador", { replace: true });
                    } else if (response.data.roles.some(role => role === ROLES.SUBSCRIBER)) {
                        navigate("/suscriptor", { replace: true });
                    } else {
                        navigate("/usuario", { replace: true });
                    }
                } else {
                    setCredentialsErrors({
                        ...credentialsErrors,
                        auth: "Le informamos que estamos experimentando problemas técnicos en nuestro servidor."
                    });
                }
            })
            .catch(error => {
                console.error(error);
                setCredentialsErrors({
                    ...credentialsErrors,
                    auth: "Le informamos que estamos experimentando problemas técnicos en nuestro servidor."
                });
            });
    }

    React.useEffect(() => {
        if (Object.values(credentialsErrors).every(value => value === null || value === undefined)) {
            setDisabled(false);
        }
    }, [credentialsErrors]);

    return {
        credentials,
        credentialsErrors,
        loading,
        token,
        disabled,
        setCredentials,
        setCredential,
        setCredentialsErrors,
        setLoading,
        setToken,
        handleLogin,
        setDisabled,
        setError
    };
}

export default useLogin;