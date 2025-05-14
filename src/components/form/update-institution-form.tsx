import InstitutionInterface from "@/interfaces/institution";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { LoaderCircle, Upload, X } from "lucide-react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { toast } from "@/hooks/use-toast";
import dayjs from "dayjs";

interface UpdateInstitutionFormProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    institution: InstitutionInterface;
    setInstitution: (value: InstitutionInterface) => void;
}

interface FormProps {
    id: string;
    name: string;
    image: File | null;
}

function UpdateInstitutionForm({ open, setOpen, institution, setInstitution }: UpdateInstitutionFormProps) {

    const [form, setForm] = React.useState<FormProps>({
        id: institution.id ?? "",
        name: institution.name ?? "",
        image: null,
    });

    const [loading, setLoading] = React.useState<boolean>(false);

    async function urlToFileAuto(url: string): Promise<File> {
        const response = await fetch(url);
        const blob = await response.blob();
    
        const mimeType = blob.type || 'application/octet-stream';
    
        const urlParts = url.split('/');
        const guessedName = urlParts[urlParts.length - 1] || 'file';
    
        return new File([blob], guessedName, { type: mimeType });
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setForm({ ...form, image: file });
        }
    }

    function handleSubmit() {
        setLoading(true);

        axios.put(APIS.INSTITUTION_UPDATE + form.id, {
            name: form.name,
            image: form.image,
        }, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response: AxiosResponse<InstitutionInterface>) => {
                if (response.data.id) {
                    setOpen(false);
                    setInstitution(response.data);
                    toast({
                        variant: "default",
                        title: "¡Tu institución ha sido actualizada 😀!",
                        description: response.data.name + " actualizada el " + dayjs().format("LLL")
                    })
                }
            })
            .catch((error) => {
                console.log(error);
                toast({
                    variant: "destructive",
                    title: "Error al actualizar la institución",
                    description: error.message,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }

    React.useEffect(() => {
        if (institution.image) {
            urlToFileAuto(institution.image).then((file) => {
                setForm((prevForm) => ({
                    ...prevForm,
                    image: file,
                }));
            });
        }
    }, [institution.image]);

    return (
        open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Información de la institución</h2>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="hover:bg-gray-200 rounded-md p-1"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    <p className="text-gray-500 mb-6">Por favor proporciona el nombre y logo de tu institución.</p>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre de la institución</Label>
                            <Input
                                id="nombre"
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                placeholder="Ej. Universidad Nacional"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imagen">Logo de la institución</Label>
                            <Card className="border-dashed">
                                <CardContent className="relative h-40 max-h-40 !p-0 flex flex-col items-center justify-center">
                                    {form.image ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={URL.createObjectURL(form.image) || "/placeholder.svg"}
                                                alt="Vista previa"
                                                className="w-full h-full object-contain"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="absolute bottom-2 right-2"
                                                onClick={() => {
                                                    setForm({ ...form, image: null });
                                                }}
                                            >
                                                Restablecer
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="w-full py-8 flex flex-col items-center justify-center gap-2">
                                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                <Upload className="h-6 w-6 text-gray-500" />
                                            </div>
                                            <p className="text-sm text-gray-500">Arrastra y suelta o haz clic para subir</p>
                                            <p className="text-xs text-gray-400">PNG, JPG o SVG (máx. 2MB)</p>
                                        </div>
                                    )}
                                    <input
                                        id="imagen"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className={form.image ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button 
                                variant="outline" 
                                onClick={() => setOpen(false)} 
                                disabled={loading}
                                className="inline-flex items-center gap-2 justify-center"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                onClick={handleSubmit} 
                                disabled={!form.name || loading}
                                className="inline-flex items-center gap-2 justify-center"
                            >
                                {loading 
                                    ? (
                                        <>
                                            Cargando... 
                                            <LoaderCircle className="size-5 animate-spin" />
                                        </>
                                    )
                                    : "Guardar"
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default UpdateInstitutionForm;