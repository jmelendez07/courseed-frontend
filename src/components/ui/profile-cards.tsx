import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Info, KeyRound, UserPen } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/providers/AuthProvider";
import axios, { AxiosError, AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";
import UserInterface from "@/interfaces/user";

interface ProfileProps {
    academicLevel: string;
    sex: string;
    birthdate: Date | undefined;
}

interface ProfileErrorProps {
    auth: string | null;
    academicLevel: string | null;
    sex: string | null;
    birthdate: string | null;
}

interface FormPassProps {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

interface FormPassErrorsProps {
    auth: string | null;
    currentPassword: string | null;
    newPassword: string | null;
    confirmNewPassword: string | null;
}

function ProfileCards() {
    const authHook = useAuth();
    const { toast } = useToast();

    const [profile, setProfile] = React.useState<ProfileProps>({
        academicLevel: authHook?.user?.academicLevel || "",
        sex: authHook?.user?.sex || "",
        birthdate: authHook?.user?.birthdate ? new Date(authHook.user.birthdate) : undefined
    });

    const [formPass, setFormPass] = React.useState<FormPassProps>({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const [profileErrors, setProfileErrors] = React.useState<ProfileErrorProps>({
        auth: null,
        academicLevel: null,
        sex: null,
        birthdate: null
    });

    const [formPassErrors, setFormPassErrors] = React.useState<FormPassErrorsProps>({
        auth: null,
        currentPassword: null,
        newPassword: null,
        confirmNewPassword: null,
    });

    const [yearInput, setYearInput] = React.useState<string>(`${profile.birthdate ? profile.birthdate.getFullYear() : new Date().getFullYear()}`);

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setYearInput(value);
            const year = parseInt(value);
            if (year > 1800 && year <= new Date().getFullYear()) {
                setProfile({
                    ...profile,
                    birthdate: new Date(year, profile.birthdate ? profile.birthdate.getMonth() : new Date().getMonth() )
                });
            }
        }
    };

    const handleProfileUpdate = () => {
        axios.put(APIS.UPDATE_PROFILE, profile)
            .then((response: AxiosResponse<UserInterface>) => {
                if (authHook?.user) {
                    authHook?.setUser({
                        ...authHook.user,
                        academicLevel: response.data.academicLevel,
                        sex: response.data.sex,
                        birthdate: response.data.birthdate,
                    });
                }
                toast({
                    title: `Tu perfil se ha actualizado!`,
                    description: dayjs(response.data.updatedAt).format("LLL"),
                });
                setProfileErrors({
                    auth: null,
                    academicLevel: null,
                    sex: null,
                    birthdate: null
                });
            })
            .catch((error: AxiosError<ProfileErrorProps>) => {
                if (error.response?.data.auth) {
                    toast({
                        title: 'No pudimos actualizar tu perfil, intenta mas tarde.',
                        description: error.response.data.auth,
                        variant: "destructive"
                    });
                } else {
                    setProfileErrors({
                        auth: null,
                        academicLevel: error.response?.data.academicLevel ?? null,
                        sex: error.response?.data.sex ?? null,
                        birthdate: error.response?.data.birthdate ?? null
                    });
                }
            });
    }

    const handlePasswordUpdate = () => {
        axios.put(APIS.UPDATE_AUTH_PASSWORD, formPass)
            .then((response: AxiosResponse) => {
                authHook?.handleToken(response.data.token);
                toast({
                    title: `Tu contraseña se ha actualizado!`,
                    description: dayjs(response.data.updatedAt).format("LLL"),
                });
                setFormPassErrors({
                    auth: null,
                    currentPassword: null,
                    newPassword: null,
                    confirmNewPassword: null,
                });
                setFormPass({
                    currentPassword: "",
                    newPassword: "",
                    confirmNewPassword: ""
                });
            })
            .catch((error: AxiosError<FormPassErrorsProps>) => {
                if (error.response?.data.auth) {
                    toast({
                        title: 'No pudimos actualizar tu contraseña, intenta mas tarde.',
                        description: error.response.data.auth,
                        variant: "destructive"
                    });
                } else {
                    setFormPassErrors({
                        auth: null,
                        currentPassword: error.response?.data.currentPassword ?? null,
                        newPassword: error.response?.data.newPassword ?? null,
                        confirmNewPassword: error.response?.data.confirmNewPassword ?? null
                    });

                    if (error.response?.data.confirmNewPassword) {
                        setFormPass({
                            ...formPass,
                            confirmNewPassword: ""
                        });
                    }
                }
            })
    }

    React.useEffect(() => {
        if (authHook?.user) {
            setProfile({
                academicLevel: authHook.user.academicLevel || "",
                sex: authHook.user.sex || "",
                birthdate: authHook.user.birthdate ? new Date(authHook.user.birthdate) : undefined
            });
        }
    }, [authHook?.user]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 md:items-start gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Actualiza tu información personal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="academicLevel">Nivel Académico</Label>
                        <Select
                            value={profile.academicLevel}
                            onValueChange={value => setProfile({
                                ...profile,
                                academicLevel: value
                            })}
                        >
                            <SelectTrigger id="academicLevel">
                                <SelectValue placeholder="Selecciona tu nivel académico" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="primaria">Primaria</SelectItem>
                                <SelectItem value="bachiller">Bachiller</SelectItem>
                                <SelectItem value="tecnologico">Técnico / Tecnológico</SelectItem>
                                <SelectItem value="pregrado">Pregrado / Universitario</SelectItem>
                                <SelectItem value="especialización">Especialización</SelectItem>
                                <SelectItem value="maestria">Maestría</SelectItem>
                                <SelectItem value="doctorado">Doctorado</SelectItem>
                                <SelectItem value="certificación profesional">Certificación Profesional</SelectItem>
                                <SelectItem value="diplomado">Diplomado</SelectItem>
                                <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                        {profileErrors.academicLevel && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{profileErrors.academicLevel}
								</span>
							</p>
						)}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Género</Label>
                        <Select
                            value={profile.sex}
                            onValueChange={value => setProfile({
                                ...profile,
                                sex: value
                            })
                            }>
                            <SelectTrigger id="gender">
                                <SelectValue placeholder="Selecciona tu género" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="masculino">Masculino</SelectItem>
                                <SelectItem value="femenino">Femenino</SelectItem>
                            </SelectContent>
                        </Select>
                        {profileErrors.sex && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{profileErrors.sex}
								</span>
							</p>
						)}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dob">Fecha de Nacimiento</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn("w-full justify-start text-left font-normal", !profile.birthdate && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {profile.birthdate ? format(profile.birthdate, "PPP", { locale: es }) : "Selecciona una fecha"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <div className="flex items-center text-sm gap-2 px-4 py-2">
                                    <span>Año:</span>
                                    <Input
                                        className="w-20 text-center"
                                        value={yearInput}
                                        onChange={handleYearChange}
                                        maxLength={4}
                                    />
                                </div>
                                <Calendar
                                    locale={es}
                                    mode="single"
                                    selected={profile.birthdate}
                                    onSelect={value => setProfile({
                                        ...profile,
                                        birthdate: value
                                    })}
                                    disabled={(date: Date) =>
										date > new Date() || date < new Date("1900-01-01")
									}
                                    month={profile.birthdate}
									required={true}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {profileErrors.birthdate && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{profileErrors.birthdate}
								</span>
							</p>
						)}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleProfileUpdate} className="ml-auto">
                        <UserPen className="mr-2 h-4 w-4" />
                        Guardar Cambios
                    </Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Actualizar Contraseña</CardTitle>
                    <CardDescription>Cambia tu contraseña de acceso</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Contraseña Actual</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            autoComplete="current-password"
                            value={formPass.currentPassword}
                            onChange={(e) => setFormPass({
                                ...formPass,
                                currentPassword: e.target.value
                            })}
                        />
                        {formPassErrors.currentPassword && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{formPassErrors.currentPassword}
								</span>
							</p>
						)}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Nueva Contraseña</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            autoComplete="new-password"
                            value={formPass.newPassword}
                            onChange={(e) => setFormPass({
                                ...formPass,
                                newPassword: e.target.value
                            })}
                        />
                        {formPassErrors.newPassword && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{formPassErrors.newPassword}
								</span>
							</p>
						)}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={formPass.confirmNewPassword}
                            onChange={(e) => setFormPass({
                                ...formPass,
                                confirmNewPassword: e.target.value
                            })}
                        />
                        {formPassErrors.confirmNewPassword && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{formPassErrors.confirmNewPassword}
								</span>
							</p>
						)}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handlePasswordUpdate} className="ml-auto">
                        <KeyRound className="mr-2 h-4 w-4" />
                        Actualizar Contraseña
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ProfileCards