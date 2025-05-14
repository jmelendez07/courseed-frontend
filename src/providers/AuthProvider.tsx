import React from "react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import TOKEN from "@/enums/token";
import ROLES from "@/enums/roles";
import UserInterface from "@/interfaces/user";
import ProfileInterface from "@/interfaces/profile";

interface ChildrenProps {
    children: React.ReactNode
}

interface AuthContextProps {
    token: string | null;
    user: UserInterface | null;
    loading: boolean;
    handleToken: (newToken: string) => undefined;
    handleUser: () => Promise<any>;
    setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    getName: () => string;
    getRoleName: () => string;
    setImage: (image: string) => void;
    setProfile: (profile: ProfileInterface) => void;
    addViewCount: () => void;
}

const AuthContext = React.createContext<AuthContextProps | null>(null);

function AuthProvider({ children }: ChildrenProps) {
    const [token, setToken] = React.useState(localStorage.getItem('token'));
    const [user, setUser] = React.useState<UserInterface | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    const handleToken = function(newToken: string): undefined {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    const handleUser = async () => {
        try {
            const res = await axios.get(APIS.USER_AUTHENTICATED);
            setUser(typeof res.data === "object" ? res.data : null);
        } catch (error) {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }

    const getName = React.useCallback(() => {
        const name = user?.email.split('@')[0].replace(".", " ");
        if (name) {
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return '';
    }, [user?.email]);

    const getRoleName = React.useCallback(() => {
        if (user?.roles?.some(r => r === ROLES.ADMIN)) {
            return "Administrador";
        } else if (user?.roles?.some(r => r === ROLES.SUBSCRIBER)) {
            return "Suscriptor";
        } else {
            return "Usuario";
        }
    }, [user?.roles]);

    const setImage = React.useCallback((image: string) => {
        if (user) {
            setUser({ ...user, image: image });
        }
    }, [user]);

    const setProfile = React.useCallback((profile: ProfileInterface) => {
        if (user) {
            setUser({ ...user, profile: profile });
        }
    }, [user]);

    const addViewCount = React.useCallback(() => {
        if (user) {
            setUser({ ...user, views: (user.views ?? 0) + 1 });
        }
    }, [user]);

    React.useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `${TOKEN.PREFIX} ${token}`;
            localStorage.setItem('token', token);
            handleUser();
            setTimeout(() => setLoading(false), 300);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    const contextValue: AuthContextProps = React.useMemo(
        () => ({
          token,
          user,
          loading,
          handleToken,
          handleUser,
          setUser,
          setLoading,
          getName,
          getRoleName,
          setImage,
          setProfile,
          addViewCount
        }),
        [token, user, loading]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return React.useContext(AuthContext);
}

function useIsAuth() {
    const [isAuth, setIsAuth] = React.useState<boolean | null>(null);
    const auth = useAuth();

    React.useEffect(() => {
        if (auth?.user) {
            setIsAuth(true);
        } else {
            axios.get(APIS.USER_AUTHENTICATED, {
                headers: {
                    Authorization: `${TOKEN.PREFIX} ${localStorage.getItem('token')}`
                }
            })
                .then(response => setIsAuth(typeof response.data === "object"))
                .catch(() => setIsAuth(false));
        }
    }, [auth?.user]);

    return isAuth;
}

function useIsAdmin() {
    const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
    const auth = useAuth();

    React.useEffect(() => {
        if (auth?.user && Array.isArray(auth.user.roles)) {
            setIsAdmin(auth.user.roles.some(role => role === ROLES.ADMIN));
        } else {
            axios.get(APIS.USER_AUTHENTICATED, {
                headers: {
                    Authorization: `${TOKEN.PREFIX} ${localStorage.getItem('token')}`
                }
            })
                .then((response: AxiosResponse<UserInterface | null>) => {
                    setIsAdmin(
                        typeof response.data === "object" && 
                        Array.isArray(response.data?.roles) &&
                        response.data.roles.some(role => role === ROLES.ADMIN)
                    )
                })
                .catch(() => setIsAdmin(false));
        }
    }, [auth?.user]);
    
    return isAdmin;
}

function useIsUser() {
    const [isUser, setIsUser] = React.useState<boolean | null>(null);
    const auth = useAuth();

    React.useEffect(() => {
        if (auth?.user && Array.isArray(auth.user.roles)) {
            setIsUser(auth.user.roles.some(role => role === ROLES.USER));
        } else {
            axios.get(APIS.USER_AUTHENTICATED, {
                headers: {
                    Authorization: `${TOKEN.PREFIX} ${localStorage.getItem('token')}`
                }
            })
                .then((response: AxiosResponse<UserInterface | null>) => {
                    setIsUser(
                        typeof response.data === "object" && 
                        Array.isArray(response.data?.roles) &&
                        response.data.roles.some(role => role === ROLES.USER)
                    )
                })
                .catch(() => setIsUser(false));
        }
    }, [auth?.user]);

    return isUser;
}

function useIsPublisher() {
    const [isPublisher, setIsPublisher] = React.useState<boolean | null>(null);
    const auth = useAuth();

    React.useEffect(() => {
        if (auth?.user && Array.isArray(auth.user.roles)) {
            setIsPublisher(auth.user.roles.some(role => role === ROLES.SUBSCRIBER));
        } else {
            axios.get(APIS.USER_AUTHENTICATED, {
                headers: {
                    Authorization: `${TOKEN.PREFIX} ${localStorage.getItem('token')}`
                }
            })
                .then((response: AxiosResponse<UserInterface | null>) => {
                    setIsPublisher(
                        typeof response.data === "object" && 
                        Array.isArray(response.data?.roles) &&
                        response.data.roles.some(role => role === ROLES.SUBSCRIBER)
                    )
                })
                .catch(() => setIsPublisher(false));
        }
    }, [auth?.user]);

    return isPublisher;
}

export default AuthProvider;
export { useAuth, useIsAuth, useIsAdmin, useIsUser, useIsPublisher }