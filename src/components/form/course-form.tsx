import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { DialogContext } from "@/providers/DialogProvider";
import CourseInterface from "@/interfaces/course";
import useInstitution from "@/hooks/useInstitution";
import InstitutionInterface from "@/interfaces/institution";
import useFaculty from "@/hooks/useFaculty";
import CategoryInterface from "@/interfaces/category";
import axios, { AxiosError, AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { ImagePlus, Info, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";
import { useAuth } from "@/providers/AuthProvider";
import ROLES from "@/enums/roles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DialogFooter } from "../ui/dialog";
import LazyImage from "../ui/LazyImage";

interface FormProps {
    title: string;
    price: number;
    duration: string;
    institution: InstitutionInterface | null;
    category: CategoryInterface | null,
    modality: string | undefined,
    url: string;
    image: File | null;
    description: string;
};

interface ErrorProps {
    url: string | null;
    title: string | null;
    modality: string | null;
    price: string | null;
    duration: string | null;
    categoryId: string | null;
    institutionId: string | null;
    courseId: string | null;
    image: string | null;
}

interface CourseFormProps {
    course?: CourseInterface;
    onCreated?: (course: CourseInterface) => void;
    onUpdated?: (course: CourseInterface) => void;
}

function CourseForm({ course, onCreated, onUpdated }: CourseFormProps) {
    const [form, setForm] = React.useState<FormProps>({
        url: course?.url ?? "",
        title: course?.title ?? "",
        image: null,
        description: course?.description ?? "",
        modality: course?.modality,
        price: course?.price ?? 0,
        duration: course?.duration ?? "",
        category: course?.category ?? null,
        institution: course?.institution ?? null,
    });
    const [errors, setErrors] = React.useState<ErrorProps>({
        url: null,
        title: null,
        modality: null,
        price: null,
        duration: null,
        categoryId: null,
        institutionId: null,
        courseId: null,
        image: null
    });
    const [imagenPreview, setImagenPreview] = React.useState<string | null>(course?.image ?? null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadingInstitution, setLoadingInstitution] = React.useState<boolean>(true);
    const dialogContext = React.useContext(DialogContext);
    const institutionHook = useInstitution({ size: 8 });
    const facultyHook = useFaculty({ size: 20 });
    const { toast } = useToast();

    const authHook = useAuth();

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0]
          setForm(prev => ({ ...prev, image: file  }));
          setImagenPreview(URL.createObjectURL(file))
        }
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (course) {
            handleUpdate();
        } else {
            handleCreate();
        }
    }

    const handleCreate = () => {
        setLoading(true);
        axios.post(APIS.COURSES_CREATE, {
            url: form.url,
            title: form.title,
            image: form.image,
            description: form.description,
            modality: form.modality,
            price: parseFloat(form.price.toString()),
            duration: form.duration,
            categoryId: form.category?.id,
            institutionId: form.institution?.id
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then((response: AxiosResponse<CourseInterface>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `${response.data.title} Creado!`,
                    description: dayjs().format("LLL"),
                });
                if (onCreated) {
                    onCreated(response.data);
                }
            })
            .catch((error: AxiosError<ErrorProps>) => {
                setErrors({
                    url: error.response?.data.url ?? null,
                    title: error.response?.data.title ?? null,
                    modality: error.response?.data.modality ?? null,
                    price: error.response?.data.price ?? null,
                    duration: error.response?.data.duration ?? null,
                    categoryId: error.response?.data.categoryId ?? null,
                    institutionId: error.response?.data.institutionId ?? null,
                    courseId: error.response?.data.courseId ?? null,
                    image: error.response?.data.image ?? null
                });
            })
            .finally(() => setLoading(false))
    }

    const handleUpdate = () => {
        setLoading(true);
        axios.put(`${APIS.COURSES_UPDATE}${course?.id}`, {
            url: form.url,
            title: form.title,
            image: form.image,
            description: form.description,
            modality: form.modality,
            price: parseFloat(form.price.toString()),
            duration: form.duration,
            categoryId: form.category?.id,
            institutionId: form.institution?.id
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then((response: AxiosResponse<CourseInterface>) => {
                console.log(response);
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `${response.data.title} Actualizado!`,
                    description: dayjs().format("LLL"),
                });
                if (onUpdated) {
                    onUpdated(response.data);
                }
            })
            .catch((error: AxiosError<ErrorProps>) => {
                console.log(error);
                if (error.response?.data.courseId) {
                    dialogContext?.setContext({
                        ...dialogContext.context,
                        open: false
                    });
                    toast({
                        title: `${course?.title}. Algo salió mal!`,
                        description: error.response.data.courseId,
                        variant: "destructive",
                    });
                } else {
                    setErrors({
                        url: error.response?.data.url ?? null,
                        title: error.response?.data.title ?? null,
                        modality: error.response?.data.modality ?? null,
                        price: error.response?.data.price ?? null,
                        duration: error.response?.data.duration ?? null,
                        categoryId: error.response?.data.categoryId ?? null,
                        institutionId: error.response?.data.institutionId ?? null,
                        courseId: error.response?.data.courseId ?? null,
                        image: error.response?.data.image ?? null
                    });
                }

            })
            .finally(() => setLoading(false));
    }

    React.useEffect(() => {
        if (authHook?.user?.roles?.some(r => r === ROLES.SUBSCRIBER) && institutionHook.institutions.some(i => i.name === "Institución para suscriptores")) {
            setForm({
                ...form,
                institution: institutionHook.institutions.find(i => i.name === "Institución para suscriptores") ?? null
            });
        }
    }, [authHook?.user, institutionHook.institutions]);

    React.useEffect(() => {
        setLoadingInstitution(true);
        axios.get(APIS.INSTITUTION_BY_AUTH)
            .then((response: AxiosResponse<InstitutionInterface>) => {
                setForm(prev => ({ ...prev, institution: response.data }));
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => setLoadingInstitution(false));
    }, []);

    return (
        <form onSubmit={handleSubmit} className="grid items-start gap-4">
            <div className="space-y-2">
                <Label htmlFor="imagen">Imagen</Label>
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => document.getElementById("imagen")?.click()}
                    >
                        {imagenPreview ? (
                            <img
                                src={imagenPreview}
                                alt="Vista previa"
                                className="max-h-40 object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-500">
                                <ImagePlus className="h-14 stroke-1 w-14 mb-2" />
                                <span className="text-sm">Haga clic para seleccionar una imagen</span>
                            </div>
                        )}
                        <Input id="imagen" type="file" accept="image/*" className="hidden" onChange={handleImagenChange} />
                    </div>
                </div>
                {errors.image && (
                    <p className="text-xs text-red-500 flex items-start gap-1">
                        <Info className="size-4" />
                        {errors.image}
                    </p>
                )}
            </div>

            {/* Título */}
            <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" value={form.title} onChange={handleOnChange} placeholder="Título del programa" />
                {errors.title && (
                    <p className="text-xs text-red-500 flex items-start gap-1">
                        <Info className="size-4" />
                        {errors.title}
                    </p>
                )}
            </div>

            {/* Institución */}
            <div className="space-y-2">
                <Label htmlFor="institution">Institución</Label>
                { loadingInstitution ? (
                    <LoaderCircle className="animate-spin size-4 text-gray-600" />
                ) : authHook?.user?.roles?.some((r: string) => r === ROLES.SUBSCRIBER) && (
                    <div className="grid grid-cols-[auto_1fr] gap-2">
                        <LazyImage src={form.institution?.image ?? ''} className="shrink-0 size-9 bg-gray-100 rounded-md" />
                        <Input id="institution" placeholder={form.institution?.name} disabled />
                    </div>
                )}
                {errors.institutionId && (
                    <p className="text-xs text-red-500 flex items-start gap-1">
                        <Info className="size-4" />
                        {errors.title}
                    </p>
                )}
            </div>

            {/* Categoría */}
            <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select defaultValue={form.category?.id ?? ''} onValueChange={(value) => setForm({ ...form, category: facultyHook.faculties.find(f => f.id === value) ?? null })}>
                    <SelectTrigger id="categoria">
                        <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        { facultyHook.faculties.map((faculty) => (
                            <SelectItem key={faculty.id} value={faculty.id ?? ''}>{faculty.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.categoryId && (
                    <p className="text-xs text-red-500 flex items-start gap-1">
                        <Info className="size-4" />
                        {errors.title}
                    </p>
                )}
            </div>

            {/* Modalidad */}
            <div className="space-y-2">
                <Label htmlFor="modality">Modalidad</Label>
                <Select defaultValue={form.modality} onValueChange={(value) => setForm({ ...form, modality: value })}>
                    <SelectTrigger id="modality">
                        <SelectValue placeholder="Seleccione una modalidad" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                        <SelectItem value="a distancia">A distancia</SelectItem>
                        <SelectItem value="hibrido">Híbrido</SelectItem>
                        <SelectItem value="none">Otro</SelectItem>
                    </SelectContent>
                </Select>
                {errors.modality && (
                    <p className="text-xs text-red-500 flex items-start gap-1">
                        <Info className="size-4" />
                        {errors.title}
                    </p>
                )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
                <Label htmlFor="descritcion">Descripción</Label>
                <Textarea id="description" value={form.description} onChange={handleOnChange} placeholder="Descripción del curso" className="min-h-[100px]" />
            </div>

            {/* URL */}
            <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" value={form.url} onChange={handleOnChange} placeholder="https://ejemplo.com/curso" type="url" />
                {errors.url && (
                    <p className="text-xs text-red-500 flex items-start gap-1">
                        <Info className="size-4" />
                        {errors.title}
                    </p>
                )}
            </div>

            {/* Duración y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="duration">Duración (Horas)</Label>
                    <Input id="duration" value={form.duration} onChange={handleOnChange} type="number" min="1" step="1" placeholder="Ej: 2/8 horas" />
                    {errors.duration && (
                        <p className="text-xs text-red-500 flex items-start gap-1">
                            <Info className="size-4" />
                            {errors.title}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                        <Input id="price" value={form.price} onChange={handleOnChange} type="number" min="0" step="1000" placeholder="0.00" className="pl-8" />
                    </div>
                    {errors.price && (
                        <p className="text-xs text-red-500 flex items-start gap-1">
                            <Info className="size-4" />
                            {errors.title}
                        </p>
                    )}
                </div>
            </div>

            <DialogFooter>
                <Button 
                    type="submit"
                    disabled={loading}
                >
                    { loading ? (
                        <div className="flex items-center gap-2">
                            <span>Guardando...</span>
                            <LoaderCircle className="animate-spin size-4"></LoaderCircle>
                        </div>
                    ) : (
                        <>Guardar programa</>
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}

export default CourseForm;