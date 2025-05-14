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
    confirmPassword: string;
    academicLevel: string | undefined;
    sex: string | undefined;
    birthdate: Date | undefined;
}

interface CredentialsErrorsProps {
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
    academicLevel: string | null;
    sex: string | null;
    birthdate: string | null;
}

interface CredentialLoginErrorsProps {
    email: string | null;
    password: string | null;
    auth: string | null;
}

interface AuthCredentialsProps {
    roles: Array<String> | null;
}

function useRegister() {
    const [credentials, setCredentials] = React.useState<CredentialsProps>({
        email: '',
        password: '',
        confirmPassword: '',
        academicLevel: undefined,
        sex: undefined,
        birthdate: undefined
    });
    const [credentialsErrors, setCredentialsErrors] = React.useState<CredentialsErrorsProps>({
        email: null,
        password: null,
        confirmPassword: null,
        academicLevel: null,
        sex: null,
        birthdate: null
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const [disabled, setDisabled] = React.useState<boolean>(false);
    
    const auth = useAuth();
    const navigate = useNavigate();

    const setCredential = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });
    }

    const handleRegister = async () => {
        setLoading(true);
        axios.post(APIS.REGISTER, credentials)
            .then((response: AxiosResponse) => {
                if (response.data) {
                    setCredentialsErrors({
                        email: null,
                        password: null,
                        confirmPassword: null,
                        academicLevel: null,
                        sex: null,
                        birthdate: null
                    });

                    handleLogin();
                }
            })
            .catch((error: AxiosError<CredentialsErrorsProps>) => {
                if (!error.response?.data) return;

                if (error.response.data.confirmPassword) {
                    setCredentials({
                        ...credentials,
                        confirmPassword: ''
                    });
                }

                setCredentialsErrors({
                    email: error.response.data.email,
                    password: error.response.data.password,
                    confirmPassword: error.response.data.confirmPassword,
                    academicLevel: error.response.data.academicLevel,
                    sex: error.response.data.sex,
                    birthdate: error.response.data.birthdate
                });

                setDisabled(true);
            })
            .finally(() => setLoading(false));
    }

    const handleLogin = async () => {
        axios.post(APIS.LOGIN, {
            email: credentials.email,
            password: credentials.password
        })
            .then((response: AxiosResponse) => {
                auth?.handleToken(response.data.token);
                redirectByRole(response.data.token);
            })
            .catch((error: AxiosError<CredentialLoginErrorsProps>) => {
                if (!error.response?.data) return;
                
                setCredentialsErrors({
                    email: error.response.data.email,
                    password: error.response.data.password,
                    confirmPassword: error.response.data.auth,
                    academicLevel: null,
                    sex: null,
                    birthdate: null,
                });
            });
    }

    const redirectByRole = (token: string) => {
        axios.get(APIS.USER_AUTHENTICATED, {
            headers: {
                Authorization: `${TOKEN.PREFIX} ${token}`
            }
        })
            .then((response: AxiosResponse<AuthCredentialsProps>) => {
                if (response.data && Array.isArray(response.data.roles)) {
                    navigate(response.data.roles.some(role => role === ROLES.ADMIN)
                            ? "/administrador"
                            : "/formulario-perfil",
                        { replace: true }
                    );
                } else {
                    setCredentialsErrors({
                        ...credentialsErrors,
                        confirmPassword: "Le informamos que estamos experimentando problemas técnicos en nuestro servidor."
                    });
                }
            })
            .catch(error => {
                console.error(error);
                setCredentialsErrors({
                    ...credentialsErrors,
                    confirmPassword: "Le informamos que estamos experimentando problemas técnicos en nuestro servidor."
                });
            });
    }

    const setError = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentialsErrors({
            ...credentialsErrors,
            ...(
                (
                    e.target.id === "password" && 
                    e.target.value === credentials.confirmPassword && 
                    credentialsErrors.confirmPassword === "La confirmación de la contraseña no coincide con la contraseña original."
                ) ? { confirmPassword: null } : {}
            ),
            [e.target.id]: null
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
        disabled,
        setCredentials,
        setCredentialsErrors,
        setLoading,
        setCredential,
        handleRegister,
        setDisabled,
        setError
    }
}

export default useRegister;