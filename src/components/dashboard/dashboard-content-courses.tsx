import useCourses from "@/hooks/useCourses";
import useInstitution from "@/hooks/useInstitution";
import { ChevronDown, ChevronUp, LoaderCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComboBoxResponsive from "@/components/ui/combo-box-responsive";
import Course from "@/components/ui/course";
import { Input } from "@/components/ui/input";
import React from "react";
import { DialogContext } from "@/providers/DialogProvider";
import CourseForm from "@/components/form/course-form";
import DeleteCourseForm from "@/components/form/delete-course-form";

function DashboardContentCourses({ className }: { className?: string }) {

    const courseHook = useCourses({});
	const institutionHook = useInstitution({});
    const dialogContext = React.useContext(DialogContext);

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <div className="flex items-center">
                <h2 className="text-xl font-semibold">Gestion de Programas</h2>
            </div>
            <div className="grid grid-cols-1 items-center md:grid-cols-[1fr,auto] gap-4">
                <form 
                    onSubmit={e => {
                        e.preventDefault();
                        courseHook.setParams({
                            ...courseHook.params,
                            pageNumber: 0,
                        });
                        courseHook.handleSearch();
                    }}
                    className="flex items-center gap-2"
                >
                    <Input
                        type="text"
                        disabled={courseHook.loading}
                        value={courseHook.params.search}
                        placeholder="Buscar por titulo, descripción, duracion..."
                        onChange={e => {
                            courseHook.setParams({
                                ...courseHook.params,
                                pageNumber: 0,
                                search: e.target.value
                            });
                        }}
                        className="max-w-sm"
                    />
                    <Button
                        type="submit"
                        disabled={courseHook.loading}
                    >
                        {courseHook.loading ? <LoaderCircle className="animate-spin" /> : <Search />}
                    </Button>
                </form>
                <ComboBoxResponsive
                    placeholder="Filtrar por Institución..."
                    labelAll="Todas las instituciones"
                    statuses={institutionHook.institutions}
                    selectedStatus={courseHook.params.institution}
                    setSelectedStatus={i => {
                        courseHook.setParams({
                            ...courseHook.params,
                            institution: i ? { ...i, image: '', user: null } : null,
                            pageNumber: 0
                        });
                    }}
                    disabled={courseHook.loading}
                    pagination={!institutionHook.isLastPage}
                    onPaginate={() => institutionHook.setPageNumber(institutionHook.pageNumber + 1)}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {courseHook.courses.map((course) => (
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
                                onUpdated={(c) => courseHook.handleUpdateCourse(c)} 
                            />
                        })}
                        handleDelete={() => dialogContext?.setContext({
                            title: `Eliminar ${course.title}`,
                            description: "¿Estas seguro de querer eliminar esta educación? No podras recuperarla",
                            open: true,
                            dialogChildren: <DeleteCourseForm 
                                course={course} 
                                onDeleted={(c) => courseHook.handleDeleteCourse(c)} 
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
                        if (courseHook.isLastPage) {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        } else {
                            courseHook.setParams({
                                ...courseHook.params,
                                pageNumber: courseHook.params.pageNumber + 1
                            });
                        }
                    }}
                    disabled={courseHook.loading}
                >
                    {courseHook.isLastPage ? (
                        <>
                            ¡Lo has visto todo! Vuelve arriba.
                            <ChevronUp />
                        </>
                    ) : (
                        <>
                            Mostrar mas programas
                            {courseHook.loading ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <ChevronDown />
                            )}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

export default DashboardContentCourses;