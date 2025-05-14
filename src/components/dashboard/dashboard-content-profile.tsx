import { useAuth } from "@/providers/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImagePlus, LoaderCircle, LogOut, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import AvatarProfile from "../ui/avatar-profile";
import React from "react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import UserInterface from "@/interfaces/user";

function DashboardContentProfile() {
    const authHook = useAuth();

    const [loadingUploadedImage, setLoadingUploadedImage] = React.useState<boolean>(false);
    const handleUploadImage = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLoadingUploadedImage(true);
            axios.put(APIS.UPLOAD_AVATAR, { image: file }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((response: AxiosResponse<UserInterface>) => {
                    if (response.data.image) {
                        authHook?.setImage(response.data.image)
                    };
                })
                .catch((error) => {
                    console.error("Error al subir la imagen:", error);
                })
                .finally(() => setLoadingUploadedImage(false));
        }
        
    }, []);

    return (
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
            <div className="relative size-32 bg-white group shadow hover:shadow-lg transition-all duration-200 rounded-lg overflow-hidden">
                <label htmlFor="image" className="absolute cursor-pointer w-full h-full z-10 bg-gray-100 text-gray-600 opacity-0 group-hover:opacity-40 group-hover:backdrop-blur-md transition-all duration-200 ease-in-out grid place-items-center">
                    {loadingUploadedImage 
                        ? <LoaderCircle className="animate-spin size-10 stroke-[1.5]" />
                        : authHook?.user?.image 
                            ? <Pencil className="size-10 stroke-[1.5]" />
                            : <ImagePlus className="size-10 stroke-[1.5]" />
                    }
                </label>
                <AvatarProfile 
                    imageUrl={authHook?.user?.image} 
                    name={authHook?.getName() ?? ""} 
                    className="!size-32 z-0 absolute" 
                />
                <input id="image" name="image" type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
            </div>
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold">{authHook?.getName()}</h1>
                <p className="text-xl text-muted-foreground">{authHook?.user?.email}</p>
                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                    <Badge variant="secondary">{authHook?.getRoleName()}</Badge>
                    {authHook?.user?.academicLevel && (
                        <Badge variant="secondary">
                            Nivel Academico: {authHook.user.academicLevel.charAt(0).toUpperCase() + authHook.user.academicLevel.slice(1, authHook.user.academicLevel.length)}
                        </Badge>
                    )}
                </div>
                <div className="flex justify-center gap-4 md:justify-start">
                    <div>
                        <span className="text-2xl font-bold">{authHook?.user?.views}</span>
                        <span className="ml-1 text-muted-foreground">Programas visitados</span>
                    </div>
                    <div>
                        <span className="text-2xl font-bold">{authHook?.user?.reviews}</span>
                        <span className="ml-1 text-muted-foreground">reseñas</span>
                    </div>
                </div>
            </div>
            <div className="flex-grow" />
            <Button asChild>
                <Link to="/salir">
                    <LogOut className="mr-1 h-4 w-4" /> Cerrar Sesión
                </Link>
            </Button>
        </div>
    );
}

export default DashboardContentProfile;