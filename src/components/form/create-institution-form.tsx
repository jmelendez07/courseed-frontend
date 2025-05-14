import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LoaderCircle, Upload } from "lucide-react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import InstitutionInterface from "@/interfaces/institution";
import { toast } from "@/hooks/use-toast";
import dayjs from "dayjs";

interface CreateInstitutionFormProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    setExploding: (value: boolean) => void;
}

interface FormProps {
    name: string;
    image: File | null;
}

function CreateInstitutionForm({ open, setOpen, setExploding }: CreateInstitutionFormProps) {

    const [form, setForm] = React.useState<FormProps>({
        name: "",
        image: null,
    });

    const [loading, setLoading] = React.useState<boolean>(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0]
          setForm({ ...form, image: file });
        }
    }

    const handleSubmit = React.useCallback(() => {
        setLoading(true);

        axios.post(APIS.INSTITUTION_CREATE, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then((response: AxiosResponse<InstitutionInterface>) => {
                if (response.data.id) {
                    setOpen(false);
                    setExploding(true);
                    toast({
                        variant: "default",
                        title: "¡Tu institución ha sido creada 😀!",
                        description: response.data.name + " creada el " + dayjs().format("LLL")
                    })
                }
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "¡Oh no! Algo salió mal.",
                    description: error.response?.data || "Error al crear la institución",
                });
            })
            .finally(() => setLoading(false));
    }, [form.name, form.image]);

    return (
        open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Información de la institución</h2>
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
                                                Cambiar
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

export default CreateInstitutionForm;