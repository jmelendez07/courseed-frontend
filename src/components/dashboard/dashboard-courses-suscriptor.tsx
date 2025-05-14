import { DialogContext } from "@/providers/DialogProvider";
import React from "react";
import CourseForm from "../form/course-form";
import { ChevronDown, ChevronUp, LoaderCircle, Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios, { AxiosError, AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import CourseInterface from "@/interfaces/course";
import LearningDraw from "../draws/LearninDraw";
import Course from "../ui/course";
import DeleteCourseForm from "../form/delete-course-form";

interface ResponseProps {
    content: CourseInterface[];
    empty: boolean;
    last: boolean;
}

function DashboardCoursesSuscriptor() {
    const dialogContext = React.useContext(DialogContext);
    const [search, setSearch] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(true);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [courses, setCourses] = React.useState<CourseInterface[]>([]);
    const [pageNumber, setPageNumber] = React.useState<number>(0);

    const handleCreated = React.useCallback((course: CourseInterface) => {
        setCourses(current => [course, ...current]);
    }, [courses]);

    const handleUpdated = React.useCallback((course: CourseInterface) => {
        setCourses(current => current.map(c => c.id === course.id ? course : c));
    }, [courses]);

    const handleDeleted = React.useCallback((course: CourseInterface) => {
        setCourses(current => current.filter(c => c.id !== course.id))
    }, [courses]);

    React.useEffect(() => {
        setLoading(true);

        axios.get(APIS.COURSES_BY_AUTH_USER, {
            params: {
                page: pageNumber,
                size: 12,
                search
            }
        })
            .then((response: AxiosResponse<ResponseProps>) => {
                setCourses(current => pageNumber === 0 
                    ? response.data.content
                    : [...current, ...response.data.content]
                );
                setIsLastPage(response.data.empty || response.data.last);
            })
            .catch((error: AxiosError) => {
                console.log(error)
                setIsLastPage(true);
            })
            .finally(() => setLoading(false));
    }, [pageNumber, search]);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mis Programas</h1>
                </div>
                <div className="flex md:flex-row flex-col gap-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar programas..."
                            className="w-full md:w-[300px] pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={() => dialogContext?.setContext({
                            title: "Crea un Nuevo Programa",
                            description: "Añade un nuevo programa a la plataforma con su titulo, precio, duración...",
                            open: true,
                            dialogChildren: <CourseForm 
                                onCreated={handleCreated}
                            />
                        })}
                    >
                        <Plus className="h-4 w-4" />
                        Crear
                    </Button>
                </div>
            </div>
            <div className="flex-1 flex flex-col h-full">
                {(loading && pageNumber === 0) ? (
                    <div className="h-full flex items-center justify-center">
                        <LoaderCircle className="animate-spin" />
                    </div>
                ) : (
                    courses.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {courses.map(course => (
                                    <Course 
                                        key={course.id} 
                                        course={course} 
                                        optionsEnable={true}
                                        handleEdit={() => dialogContext?.setContext({
                                            title: `Renueva ${course.title}`,
                                            description: "Actualiza el contenido con los últimos enfoques de titulo, precio, duración...",
                                            open: true,
                                            dialogChildren: <CourseForm 
                                                course={course}
                                                onUpdated={handleUpdated} 
                                            />
                                        })}
                                        handleDelete={() => dialogContext?.setContext({
                                            title: `Eliminar ${course.title}`,
                                            description: "¿Estas seguro de querer eliminar esta educación? No podras recuperarla",
                                            open: true,
                                            dialogChildren: <DeleteCourseForm
                                                course={course} 
                                                onDeleted={handleDeleted} 
                                            />
                                        })}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center justify-center space-x-2 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (isLastPage) {
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        } else {
                                            setPageNumber(current => current + 1);
                                        }
                                    }}
                                    disabled={loading}
                                >
                                    {isLastPage ? (
                                        <>
                                            ¡Lo has visto todo! Vuelve arriba.
                                            <ChevronUp />
                                        </>
                                    ) : (
                                        <>
                                            Mostrar mas programas
                                            {loading ? (
                                                <LoaderCircle className="animate-spin" />
                                            ) : (
                                                <ChevronDown />
                                            )}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center gap-4">
                            <LearningDraw />
                            <p className="mb-8 text-base">
                                {search ? 'No hay resultados para esta busqueda.' : 'Parece que aún no has creado ningún programa.'} 
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default DashboardCoursesSuscriptor;