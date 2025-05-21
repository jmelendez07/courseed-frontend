import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Brain, Clock, DollarSign, Edit3, ImagePlus, Laptop, Lightbulb, LoaderCircle, LogOut, Pencil, RefreshCw, Save, X } from "lucide-react";
import AvatarProfile from "../ui/avatar-profile";
import axios, { AxiosResponse } from "axios";
import UserInterface from "@/interfaces/user";
import React from "react";
import APIS from "@/enums/apis";
import { ColorContext } from "@/providers/ColorProvider";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ProfileInterface from "@/interfaces/profile";
import { Input } from "../ui/input";
import dayjs from "dayjs";
import { useToast } from "@/hooks/use-toast";

const categories = [
    "filosofia",
    "ciencias",
    "derecho",
    "artes y humanidades",
    "ciencias politicas",
    "ingenieria",
    "ambiental",
    "ciencias de la salud",
    "arquitectura",
    "comunicacion y lenguaje",
    "ciencias sociales",
    "direccion de internacionalizacion",
    "ciencias de la educacion",
    "nutricion y dietetica",
    "ciencias economicas"
];

function DashboardContentUserWithProfile() {
    const authHook = useAuth();
    const colorContext = React.useContext(ColorContext);
    const { toast } = useToast();

    const [loadingUploadedImage, setLoadingUploadedImage] = React.useState<boolean>(false);
    const [loadingUpdateProfile, setLoadingUpdateProfile] = React.useState<boolean>(false);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);

    const [editedProfile, setEditedProfile] = React.useState<ProfileInterface>(authHook?.user?.profile ?? {
        id: "",
        knowledgeLevel: "",
        availableHoursTime: 0,
        platformPrefered: "",
        budget: 0,
        interest: "",
        createdAt: "",
        updatedAt: ""
    });

    const handleChange = (field: keyof ProfileInterface, value: string | number) => {
        setEditedProfile((prev) => ({
          ...prev,
          [field]: value,
        }))
    };

    const handleEdit = () => {
        setIsEditing(true);
        if (authHook?.user?.profile) setEditedProfile(authHook.user.profile);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = () => {
        setLoadingUpdateProfile(true);
        axios.put(APIS.UPDATE_USER_PROFILE, editedProfile)
            .then((response: AxiosResponse<ProfileInterface>) => {
                authHook?.setProfile(response.data);
                setIsEditing(false);
            })
            .catch((error) => {
                const errorMessage: string = (error.response?.data && typeof Object.values(error.response.data)[0] === "string")
                    ? Object.values(error.response.data)[0] as string
                    : "Tenemos problemas en el servidor. Por favor, inténtalo de nuevo.";
                
                toast({
                    title: "No se pudo actualizar el perfil.",
                    description: errorMessage,
                    variant: "destructive",
                });
            })
            .finally(() => setLoadingUpdateProfile(false));
    };

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
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="relative lg:col-span-1">
                <Card className="sticky top-2 max-w-full hover:shadow-lg transition-shadow duration-300">
                    <div className="p-4 pb-0 w-full flex items-center justify-between">
                        <span className={`text-xs px-3 py-1.5 bg-${colorContext?.color}-600 text-white rounded-full`}>{ authHook?.getRoleName() }</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link to="/salir" className="p-2 bg-red-500 hover:bg-red-600 transition-all duration-200 ease-in-out text-white rounded">
                                        <LogOut className="size-4" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Cerrar sesión</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <CardHeader className="text-center grid place-items-center">
                        <div className="relative size-24 xl:size-32 bg-white group shadow hover:shadow-lg transition-all duration-200 rounded-lg overflow-hidden">
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
                                className="!size-24 xl:!size-32 z-0 absolute" 
                            />
                            <input id="image" name="image" type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                        </div>
                        <CardTitle className="text-2xl">
                            { authHook?.getName() }
                        </CardTitle>
                        <p className="text-muted-foreground truncate md:max-w-[95%]">{ authHook?.user?.email }</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center items-center flex-col xl:flex-row xl:divide-x-2 xl:gap-4">
                            <div>
                                <span className="text-xl lg:text-2xl font-bold">{authHook?.user?.views}</span>
                                <span className="ml-1 text-muted-foreground truncate md:max-w-[95%]">Programas visitados</span>
                            </div>
                            <div className="xl:pl-3">
                                <span className="text-xl lg:text-2xl font-bold">{authHook?.user?.reviews}</span>
                                <span className="ml-1 text-muted-foreground truncate md:max-w-[95%]">reseñas</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Tabs defaultValue="info">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger disabled={loadingUpdateProfile} value="info">Información</TabsTrigger>
                        <TabsTrigger disabled={loadingUpdateProfile} value="stats">Estadísticas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info" className="mt-4">
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-3.5 pt-4">
                                <div>
                                    <CardTitle>Detalles del Perfil</CardTitle>
                                    <CardDescription>Información sobre tus preferencias y configuración</CardDescription>
                                </div>
                                {!isEditing ? (
                                    <Button onClick={() => handleEdit()} variant="outline" size="icon">
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <Button disabled={loadingUpdateProfile} onClick={() => handleCancel()} variant="outline" size="icon">
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <Button disabled={loadingUpdateProfile} onClick={() => handleSave()} variant="default" size="icon">
                                            {
                                                loadingUpdateProfile ? (
                                                    <LoaderCircle className="animate-spin size-4" />
                                                ) : (
                                                    <Save className="h-4 w-4" />
                                                )
                                            }
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="knowledgeLevel" className="flex items-center gap-2">
                                                <Brain className="h-4 w-4" /> Nivel de Conocimiento
                                            </Label>
                                            <Select
                                                disabled={loadingUpdateProfile}
                                                value={editedProfile.knowledgeLevel}
                                                onValueChange={(value) => handleChange("knowledgeLevel", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un nivel" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="principiante">Principiante</SelectItem>
                                                    <SelectItem value="intermedio">Intermedio</SelectItem>
                                                    <SelectItem value="experto">Experto</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="availableHoursTime" className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" /> Horas Disponibles por Semana
                                            </Label>
                                            <Input
                                                id="availableHoursTime"
                                                type="number"
                                                min={0}
                                                max={8}
                                                disabled={loadingUpdateProfile}
                                                value={editedProfile.availableHoursTime}
                                                onChange={(e) => handleChange("availableHoursTime", Number.parseInt(e.target.value))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="platformPrefered" className="flex items-center gap-2">
                                                <Laptop className="h-4 w-4" /> Modalidad Preferida
                                            </Label>
                                            <Select
                                                value={editedProfile.platformPrefered}
                                                disabled={loadingUpdateProfile}
                                                onValueChange={(value) => handleChange("platformPrefered", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una Modalidad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="presencial">Presencial</SelectItem>
                                                    <SelectItem value="a distancia">A distancia</SelectItem>
                                                    <SelectItem value="hibrido">Híbrido</SelectItem>
                                                    <SelectItem value="virtual">Virtual</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="budget" className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4" /> Presupuesto
                                            </Label>
                                            <Input
                                                id="budget"
                                                type="number"
                                                min={0}
                                                max={5000000}
                                                step={500000}
                                                disabled={loadingUpdateProfile}
                                                value={editedProfile.budget}
                                                onChange={(e) => handleChange("budget", Number.parseInt(e.target.value))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="interest" className="flex items-center gap-2">
                                                <Lightbulb className="h-4 w-4" /> Interés Principal
                                            </Label>
                                            <Select
                                                value={editedProfile.interest}
                                                disabled={loadingUpdateProfile}	
                                                onValueChange={(value) => handleChange("interest", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un area de interés" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    { categories.map((category, index) => (
                                                        <SelectItem key={index} value={category}>{category}</SelectItem>
                                                    )) }
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`bg-${colorContext?.color}-600 text-white p-2 rounded-full`}>
                                                        <Brain className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Nivel de Conocimiento</p>
                                                        <p className="text-sm text-muted-foreground">{authHook?.user?.profile?.knowledgeLevel}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className={`bg-${colorContext?.color}-600 text-white p-2 rounded-full`}>
                                                        <Clock className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Horas Disponibles</p>
                                                        <p className="text-sm text-muted-foreground">{authHook?.user?.profile?.availableHoursTime} horas/semana</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className={`bg-${colorContext?.color}-600 text-white p-2 rounded-full`}>
                                                        <Laptop className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Modalidad Preferida</p>
                                                        <p className="text-sm text-muted-foreground">{authHook?.user?.profile?.platformPrefered}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`bg-${colorContext?.color}-600 text-white p-2 rounded-full`}>
                                                        <DollarSign className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Presupuesto</p>
                                                        <p className="text-sm text-muted-foreground">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(authHook?.user?.profile?.budget ?? 0)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className={`bg-${colorContext?.color}-600 text-white p-2 rounded-full`}>
                                                        <Lightbulb className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Interés Principal</p>
                                                        <p className="text-sm text-muted-foreground">{authHook?.user?.profile?.interest}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className={`bg-${colorContext?.color}-600 text-white p-2 rounded-full`}>
                                                        <RefreshCw className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Última Actualización</p>
                                                        <p className="text-sm text-muted-foreground">{dayjs(authHook?.user?.profile?.updatedAt).format("LLL")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="border-t pt-4 pb-4">
                                <p className="text-xs text-muted-foreground">
                                    La información de tu perfil nos ayuda a personalizar tu experiencia.
                                </p>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="stats" className="mt-4">
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle>Estadísticas de Actividad</CardTitle>
                                <CardDescription>Visualiza tu actividad y progreso</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Nivel de Conocimiento</h3>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-${colorContext?.color}-600 rounded-full`}
                                                style={{
                                                    width:
                                                    authHook?.user?.profile?.knowledgeLevel === "principiante"
                                                        ? "25%"
                                                        : authHook?.user?.profile?.knowledgeLevel === "intermedio"
                                                            ? "50%"
                                                            : "100%",
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>Principiante</span>
                                            <span>Intermedio</span>
                                            <span>Experto</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Distribución de Intereses</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-primary/10 p-4 rounded-lg text-center">
                                                <div className={`mx-auto bg-${colorContext?.color}-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2`}>
                                                    <Lightbulb className="h-6 w-6" />
                                                </div>
                                                <h4 className="font-medium">Interés Principal</h4>
                                                <p className="text-sm text-muted-foreground">{ authHook?.user?.profile?.interest }</p>
                                            </div>
                                            <div className="bg-muted p-4 rounded-lg text-center">
                                                <div className="mx-auto bg-muted/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                                                    <Laptop className="h-6 w-6" />
                                                </div>
                                                <h4 className="font-medium">Modalidad</h4>
                                                <p className="text-sm text-muted-foreground">{ authHook?.user?.profile?.platformPrefered }</p>
                                            </div>
                                            <div className="bg-muted p-4 rounded-lg text-center">
                                                <div className="mx-auto bg-muted/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                                                    <DollarSign className="h-6 w-6" />
                                                </div>
                                                <h4 className="font-medium">Presupuesto</h4>
                                                <p className="text-sm text-muted-foreground">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(authHook?.user?.profile?.budget ?? 0)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Tiempo Disponible</h3>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-16 h-16 rounded-full border-4 border-${colorContext?.color}-600 flex items-center justify-center`}>
                                                <span className="text-2xl font-bold">{authHook?.user?.profile?.availableHoursTime}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">Horas por semana</p>
                                                <p className="text-sm text-muted-foreground">Disponibilidad actual</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default DashboardContentUserWithProfile;