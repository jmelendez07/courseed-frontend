import APIS from "@/enums/apis";
import axios, { AxiosResponse } from "axios";
import React from "react";
import BeginnerDraw from "../draws/BeginnerDraw";
import IntermediateDraw from "../draws/IntermediateDraw";
import ExpertDraw from "../draws/ExpertDraw";
import { ArrowRight, BadgeDollarSign, Check, ChevronsUpDown, Clock12, Clock2, Clock3, Clock4, Clock5, Clock6, Clock7, Clock8, Clock9, DollarSign, Gem, LoaderCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";
import ClockDraw from "../draws/ClockDraw";
import InPersonDraw from "../draws/InPersonDraw";
import VirtualDraw from "../draws/VirtualDraw";
import RemotelyDraw from "../draws/RemotelyDraw";
import HybridDraw from "../draws/HybridDraw";
import BudgetDraw from "../draws/BudgetDraw";
import AreaInterestDraw from "../draws/AreaInterestDraw";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import ProfileInterface from "@/interfaces/profile";

interface FormProps {
    knowledgeLevel: string | null;
    availableHoursTime: number | null;
    platformPrefered: string | null;
    budget: number | null;
    interest: string | null;
}

interface KnowledgeLevelProps {
    setLevel: (level: string) => void
}

interface AvailableHoursTimeProps {
    setHours: (hourse: number) => void
}

interface PlatformPreferedProps {
    setPlatform: (platform: string) => void
}

interface BudgetProps {
    setBudget: (budget: number) => void
}

interface AreaInterestProps {
    setArea: (area: string) => void,
}

function ProfileForm() {
    const [form, setForm] = React.useState<FormProps>({
        knowledgeLevel: null,
        availableHoursTime: null,
        platformPrefered: null,
        budget: null,
        interest: null
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const authHook = useAuth();

    React.useEffect(() => {
        if (Object.values(form).every(value => value !== null)) {
            setLoading(true);
            axios.post(APIS.CREATE_PROFILE, form)
                .then((response: AxiosResponse<ProfileInterface>) => {
                    authHook?.setProfile(response.data);
                    navigate("/usuario", { replace: true });
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => setLoading(false));
        }
    }, [form]);

    return (
        <div 
            className="w-screen relative h-screen grid place-items-center overflow-x-hidden overflow-y-auto"
        >
            <div
                className={`
                    bg-sky-600 absolute top-0 left-0 h-1.5
                    ${form.interest !== null 
                        ? 'w-full' 
                        : form.budget !== null
                            ? 'w-[80%]'
                            : form.platformPrefered !== null 
                                ? 'w-[60%]'
                                : form.availableHoursTime !== null 
                                    ? 'w-[40%]'
                                    : form.knowledgeLevel !== null 
                                        ? 'w-[20%]' 
                                        : ''}
                `}
            />
            <div className="p-6 lg:p-16 w-full relative">
                { !loading ? (
                    <div className="grid grid-cols-1">
                        {form.knowledgeLevel === null ? (
                            <KnowledgeLevel
                                setLevel={(level) => setForm({
                                    ...form,
                                    knowledgeLevel: level
                                })}
                            />
                        ) : form.availableHoursTime === null ? (
                            <AvailableHoursTime
                                setHours={(hours) => setForm({
                                    ...form,
                                    availableHoursTime: hours
                                })}
                            />
                        ) : form.platformPrefered === null ? (
                            <PlatformPrefered
                                setPlatform={(platform) => setForm({
                                    ...form,
                                    platformPrefered: platform
                                })}
                            />
                        ) : form.budget === null ? (
                            <Budget
                                setBudget={(budget) => setForm({
                                    ...form,
                                    budget: budget
                                })}
                            />
                        ) : form.interest === null && (
                            <AreaInterests
                                setArea={(area) => setForm({
                                    ...form,
                                    interest: area
                                })}
                            />
                        )}
                    </div>
                ) : (
                    <div className="grid place-items-center w-full h-full">
                        <LoaderCircle className="size-5 animate-spin" />
                    </div>
                ) }
            </div>
        </div>
    );
}

function KnowledgeLevel({ setLevel }: KnowledgeLevelProps) {
    return (
        <div className="grid grid-cols-1 h-full">
            <div className="w-full shrink-0 text-center space-y-1">
                <h3 className="text-2xl lg:text-4xl font-medium antialiased">Selecciona tu nivel de educación</h3>
                <p className="text-gray-400">
                    Selecciona el nivel que mejor se adapte a tus conocimientos actuales
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-content-center gap-4 px-4 mt-10">
                <button
                    onClick={() => setLevel("principiante")}
                    type="button"
                    className="bg-gray-50 border border-gray-100 shadow hover:shadow-md rounded-md cursor-pointer grid grid-cols-1 place-items-center p-4 gap-2 hover:bg-gray-100 hover:border-gray-200 transition-all duration-300 ease-in-out"
                >
                    <BeginnerDraw className="!size-52 lg:!size-80" />    
                    <h4 className="text-xl">Principiante</h4>
                    <p className="text-gray-500">Ideal para quienes estan comenzando su viaje de aprendizaje</p>
                </button>
                <button
                    onClick={() => setLevel("intermedio")}
                    type="button"
                    className="bg-gray-50 border border-gray-100 shadow hover:shadow-md rounded-md cursor-pointer grid grid-cols-1 place-items-center p-4 gap-2 hover:bg-gray-100 hover:border-gray-200 transition-all duration-300 ease-in-out"
                >
                    <IntermediateDraw className="!size-52 lg:!size-80" />
                    <h4 className="text-xl">Intermedio</h4>
                    <p className="text-gray-500">Para estudiantes con conocimientos básicos que buscan profundizar</p>
                </button>
                <button
                    onClick={() => setLevel("experto")}
                    type="button"
                    className="bg-gray-50 border border-gray-100 shadow hover:shadow-md rounded-md cursor-pointer grid grid-cols-1 place-items-center p-4 gap-2 hover:bg-gray-100 hover:border-gray-200 transition-all duration-300 ease-in-out"
                >
                    <ExpertDraw className="!size-52 lg:!size-80" />    
                    <h4 className="text-xl">Experto</h4>
                    <p className="text-gray-500">Para estudiantes experimentados que buscan dominar el tema</p>
                </button>
            </div>
        </div>
    );
}

function AvailableHoursTime({ setHours }: AvailableHoursTimeProps) {
    return (
        <div className="grid max-h-full">
            <div className="w-full text-center space-y-1">
                <h3 className="text-2xl lg:text-4xl font-medium antialiased">¿Cuánto tiempo tienes disponible?</h3>
                <p className="text-gray-400">
                    Selecciona cuántas horas dedicas a tu aprendizaje
                </p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 max-h-full md:mt-10 gap-4 lg:gap-8">
                <div className="order-2 xl:order-1 grid grid-cols-1 place-items-center items-start">
                    <div className="grid grid-cols-3 grid-rows-3 justify-between gap-2 md:gap-4 w-full h-full">
                        <button
                            onClick={() => setHours(0)}
                            type="button"
                            className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 p-4 transition-all duration-300 ease-in-out"
                        >
                            <Clock12 className="size-10 md:size-14 lg:size-16 text-gray-500" />
                            <p className="text-base antialiased">0 Horas</p>
                        </button>
                        <button
                            onClick={() => setHours(1)}
                            type="button"
                            className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 transition-all duration-300 ease-in-out p-4"
                        >
                            <Clock2 className="size-10 md:size-14 lg:size-16 text-gray-500" />
                            <p className="text-base antialiased">1 Hora</p>
                        </button>
                        <button
                            onClick={() => setHours(2)}
                            type="button"
                            className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 transition-all duration-300 ease-in-out p-4"
                        >
                            <Clock3 className="size-10 md:size-14 lg:size-16 text-gray-500" />
                            <p className="text-base antialiased">2 Horas</p>
                        </button>
                        <button
                            onClick={() => setHours(3)}
                            type="button"
                            className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 transition-all duration-300 ease-in-out p-4"
                        >
                            <Clock4 className="size-10 md:size-14 lg:size-16 text-gray-500" />
                            <p className="text-base antialiased">3 Horas</p>
                        </button>
                        <button
                            onClick={() => setHours(4)}
                            type="button"
                            className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 transition-all duration-300 ease-in-out p-4"
                        >
                            <Clock5 className="size-10 md:size-14 lg:size-16 text-gray-500" />
                            <p className="text-base antialiased">4 Horas</p>
                        </button>
                        <button
                            onClick={() => setHours(5)}
                            type="button"
                            className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 transition-all duration-300 ease-in-out p-4"
                        >
                            <Clock6 className="size-10 md:size-14 lg:size-16 text-gray-500" />
                            <p className="text-base antialiased">5 Horas</p>
                        </button>
                        <button
                            onClick={() => setHours(6)}
                            type="button"
                            className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 transition-all duration-300 ease-in-out p-4"
                        >
                            <Clock7 className="size-10 md:size-14 lg:size-16 text-gray-500" />
                            <p className="text-base antialiased">6 Horas</p>
                        </button>
                        <button
                            onClick={() => setHours(7)}
                            type="button"
                            className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 transition-all duration-300 ease-in-out p-4"
                        >
                            <Clock8 className="size-10 md:size-14 lg:size-16 text-gray-500" />
                            <p className="text-base antialiased">7 Horas</p>
                        </button>
                        <button
                            onClick={() => setHours(8)}
                            type="button"
                            className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 transition-all duration-300 ease-in-out p-4"
                        >
                            <Clock9 className="size-10 md:size-14 lg:size-16 text-gray-500" />
                            <p className="text-base antialiased">8 Horas</p>
                        </button>
                    </div>
                </div>
                <ClockDraw className="order-1 xl:order-2 !h-64 md:!h-72 lg:!h-96" />
            </div>
        </div>
    );
}

function PlatformPrefered({ setPlatform }: PlatformPreferedProps) {
    return (
        <div className="w-full grid grid-cols-1 grid-rows-[auto_1fr]">
            <div className="w-full text-center space-y-1">
                <h3 className="text-2xl lg:text-4xl font-medium antialiased">¿Que modalidad prefieres?</h3>
                <p className="text-gray-400">
                    Selecciona una de las modalidades que te ofrecemos
                </p>
            </div>
            <div className="grid w-full grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 place-content-center gap-4 mt-10">
                <button 
                    type="button" onClick={() => setPlatform("presencial")} className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 p-4 transition-all duration-300 ease-in-out"
                >
                    <InPersonDraw className="!size-52 lg:!size-72" />
                    <div className="flex items-center flex-col">
                        <h3 className="text-xl text-center">Presencial</h3>
                        <p className="text-gray-500 text-center">Aprende cara a cara</p>
                    </div>
                </button>
                <button 
                    type="button" onClick={() => setPlatform("a distancia")} className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 p-4 transition-all duration-300 ease-in-out"
                >
                    <RemotelyDraw className="!size-52 lg:!size-72" />
                    <div className="flex items-center flex-col">
                        <h3 className="text-xl">A distancia</h3>
                        <p className="text-gray-500">Estudia sin importar donde estes</p>
                    </div>
                </button>
                <button 
                    type="button" onClick={() => setPlatform("hibrido")} className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 p-4 transition-all duration-300 ease-in-out"
                >
                    <HybridDraw className="!size-52 lg:!size-72" />
                    <div className="flex items-center flex-col">
                        <h3 className="text-xl">Híbrido</h3>
                        <p className="text-gray-500">Estudia conociendo ambas modalidades de aprendizaje</p>
                    </div>
                </button>
                <button 
                    type="button" onClick={() => setPlatform("virtual")} className="bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:border-gray-200 shadow hover:shadow-md cursor-pointer grid grid-cols-1 place-items-center place-content-center gap-2 p-4 transition-all duration-300 ease-in-out"
                >
                    <VirtualDraw className="!size-52 lg:!size-72" />
                    <div className="flex items-center flex-col">
                        <h3 className="text-xl">Virtual</h3>
                        <p className="text-gray-500">Estudia desde donde quieras</p>
                    </div>
                </button>
            </div>
        </div>
    );
}

function Budget({ setBudget }: BudgetProps) {
    return (
        <div className="">
            <div className="w-full text-center space-y-1">
                <h3 className="text-2xl lg:text-4xl font-medium antialiased">¿De cuánto dinero dispones aproximadamente?</h3>
                <p className="text-gray-400">
                    Indícanos tu presupuesto estimado para ayudarte a encontrar opciones que se ajusten a ti.
                </p>
            </div>
            <div className="w-full grid grid-cols-1 xl:grid-cols-2 place-items-center xl:mt-10 items-center">
                <div className="w-full order-2 grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <button
                        type="button"
                        onClick={() => setBudget(500000)}
                        className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg shadow hover:shadow-lg transition-all duration-200 ease-in-out p-4"
                    >
                        <DollarSign className="shrink-0 size-5" />
                        <p className="text-sm md:text-lg font-medium antialiased">500.000,00</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setBudget(1000000)}
                        className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg shadow hover:shadow-lg transition-all duration-200 ease-in-out p-4"
                    >
                        <DollarSign className="shrink-0 size-5" />
                        <p className="text-sm md:text-lg font-medium antialiased">1.000.000,00</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setBudget(1500000)}
                        className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg shadow hover:shadow-lg transition-all duration-200 ease-in-out p-4"
                    >
                        <DollarSign className="shrink-0 size-5" />
                        <p className="text-sm md:text-lg font-medium antialiased">1.500.000,00</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setBudget(2000000)}
                        className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg shadow hover:shadow-lg transition-all duration-200 ease-in-out p-4"
                    >
                        <BadgeDollarSign className="shrink-0 size-5" />
                        <p className="text-sm md:text-lg font-medium antialiased">2.000.000,00</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setBudget(2500000)}
                        className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg shadow hover:shadow-lg transition-all duration-200 ease-in-out p-4"
                    >
                        <BadgeDollarSign className="shrink-0 size-5" />
                        <p className="text-sm md:text-lg font-medium antialiased">2.500.000,00</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setBudget(3000000)}
                        className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg shadow hover:shadow-lg transition-all duration-200 ease-in-out p-4"
                    >
                        <BadgeDollarSign className="shrink-0 size-5" />
                        <p className="text-sm md:text-lg font-medium antialiased">3.000.000,00</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setBudget(3500000)}
                        className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg shadow hover:shadow-lg transition-all duration-200 ease-in-out p-4"
                    >
                        <BadgeDollarSign className="shrink-0 size-5" />
                        <p className="text-sm md:text-lg font-medium antialiased">3.500.000,00</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setBudget(4000000)}
                        className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg shadow hover:shadow-lg transition-all duration-200 ease-in-out p-4"
                    >
                        <Gem className="shrink-0 size-5" />
                        <p className="text-sm md:text-lg font-medium antialiased">4.000.000,00</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setBudget(4500000)}
                        className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg shadow hover:shadow-lg transition-all duration-200 ease-in-out p-4"
                    >
                        <Gem className="shrink-0 size-5" />
                        <p className="text-sm md:text-lg font-medium antialiased">4.500.000,00</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setBudget(5000000)}
                        className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg shadow hover:shadow-lg transition-all duration-200 ease-in-out p-4"
                    >
                        <Gem className="shrink-0 size-5" />
                        <p className="text-sm md:text-lg font-medium antialiased">5.000.000,00</p>
                    </button>
                </div>
                <BudgetDraw className="order-1 xl:order-2 !h-64 md:!h-72 md:w-96 lg:!h-[24rem] lg:w-[34rem] xl:w-[40rem]" />
            </div>
        </div>
    );
}

function AreaInterests({ setArea }: AreaInterestProps) {

    const [open, setOpen] = React.useState(false);
    const [areaSelected, setAreaSelected] = React.useState<string | null>(null);

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

    return (
        <div className="grid grid-cols-1">
            <div className="w-full text-center space-y-1">
                <h3 className="text-2xl lg:text-4xl font-medium antialiased">¿Qué áreas de estudio te interesan?</h3>
                <p className="text-gray-400">Selecciona la categoría que más te llamen la atención.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 items-center place-items-center mt-10">
                <div className="flex items-center gap-4">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full text-lg overflow-hidden text-gray-600 font-normal"
                            >
                                <span className="truncate">
                                    { areaSelected ?? "Selecciona las categorías disponibles"}
                                </span>
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 z-[200]">
                            <Command>
                                <CommandInput placeholder="Buscar una categoria..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No framework found.</CommandEmpty>
                                    <CommandGroup>
                                        {categories.map((category) => (
                                            <CommandItem
                                                key={category}
                                                value={category}
                                                onSelect={(currentValue) => {
                                                    setAreaSelected((prev) => {
                                                        return prev === currentValue ? null : category;
                                                    });
                                                }}
                                            >
                                                {category}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        areaSelected === category ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    { areaSelected !== null  && (
                        <button
                            type="button"
                            className="p-2 text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition duration-200 ease-in-out"
                            onClick={() => setArea(areaSelected ?? "")}
                        >
                            <ArrowRight className="size-5" />
                        </button>
                    )}
                </div>
                <AreaInterestDraw className="w-full h-52 md:h-80 lg:h-[30rem]" />
            </div>  
        </div>
    );
}

export default ProfileForm;