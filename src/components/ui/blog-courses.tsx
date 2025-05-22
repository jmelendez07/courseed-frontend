import { Badge } from "@/components/ui/badge";
import useCourses from "@/hooks/useCourses";
import Course from "./course";
import { Button } from "./button";
import { ChevronDown, ChevronUp, ClipboardCheck, LoaderCircle, Search } from "lucide-react";
import { Input } from "./input";
import useInstitution from "@/hooks/useInstitution";
import useFaculty from "@/hooks/useFaculty";
import ComboBoxResponsive from "./combo-box-responsive";
import { useSearchParams } from "react-router-dom";
import React from "react";
import FadeItem from "./fade-item";
import CourseSkeleton from "../skeleton/course-skeleton";
import SearchDraw from "../draws/SearchDraw";
import InstitutionInterface from "@/interfaces/institution";

interface BlogCoursesProps {
    heading: string;
    description: string;
}

const BlogCourses = ({
    heading,
    description,
}: BlogCoursesProps) => {

    const [searchParams] = useSearchParams();
    const [clipboardText, setClipboardText] = React.useState<string>("");
    const courseHook = useCourses({
        institutionParam: { id: searchParams.get('institucion'), name: undefined, image: "", user: null },
        facultyParam: { id: searchParams.get('facultad'), name: undefined },
        searchParam: searchParams.get("busqueda") || undefined,
        isVisibleParam: false
    });
    const institutionHook = useInstitution({ size: 7 });
    const facultyHook = useFaculty({ size: 7 });
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    courseHook.setIsVisible(true);
                    observer.disconnect();
                }
            },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [ref.current]);

    React.useEffect(() => {
        const institutionParamId = searchParams.get('institucion');
        const facultyParamId = searchParams.get('facultad');

        courseHook.setParams({
            ...courseHook.params,
            institution: institutionParamId ? { id: institutionParamId, name: undefined, image: "", user: null } : null,
            faculty: facultyParamId ? { id: facultyParamId, name: undefined } : null,
            pageNumber: 0,
        });
    }, [searchParams.get('institucion'), searchParams.get('facultad')]);

    React.useEffect(() => {
        const getClipboardText = async () => {
            try {
                const text = await navigator.clipboard.readText();
                if (text.trim()) setClipboardText(text);
            } catch (err) {
                console.error("No se pudo acceder al portapapeles", err);
            }
        };

        getClipboardText();
    }, []);

    return (
        <section className="py-20 lg:py-32">
            <div className="w-full mx-auto flex flex-col items-center gap-16 px-4 md:px-8 lg:px-16">
                <div className="flex flex-col items-center">
                    <FadeItem>
                        <Badge variant="secondary" className="mb-6">
                            {courseHook.totalCourses} Cursos, Diplomados y Talleres
                        </Badge>
                    </FadeItem>
                    <FadeItem>
                        <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl text-center">
                            {heading}
                        </h2>
                    </FadeItem>
                    <FadeItem>
                        <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg text-center">
                            {description}
                        </p>
                    </FadeItem>
                </div>
                <div className="w-full max-w-full">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                        <form onSubmit={e => {
                            e.preventDefault();
                            courseHook.handleSearch();
                        }} className="flex items-center gap-2 w-full lg:w-[28rem] lg:max-w-md">
                            <FadeItem className="relative w-full">
                                <Input
                                    type="text"
                                    placeholder={clipboardText ? clipboardText : `Buscar por titulo, descripción, duración...`}
                                    value={courseHook.params.search}
                                    onChange={e => {
                                        courseHook.setParams({
                                            ...courseHook.params,
                                            pageNumber: 0,
                                            search: e.target.value
                                        });
                                    }}
                                    className="pr-10 w-full"
                                />
                                <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full cursor-pointer hover:bg-gray-100 rounded-md">
                                    <Search className="h-4 w-4" />
                                    <span className="sr-only">Buscar</span>
                                </Button>
                            </FadeItem>
                            {(clipboardText && clipboardText !== courseHook.params.search) && (
                                <Button 
                                    size="icon" 
                                    type="button"
                                    onClick={e => {
                                        e.preventDefault();
                                        courseHook.setParams({
                                            ...courseHook.params,
                                            search: clipboardText
                                        });
                                        courseHook.handleSearch(clipboardText)
                                    }}
                                    title="Usar el texto del portapapeles"
                                >
                                    <ClipboardCheck />
                                </Button>
                            )}
                        </form>
                        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2">
                            <FadeItem className="w-full">
                                <ComboBoxResponsive
                                    placeholder="Filtrar por Institución..."
                                    labelAll="Todas las instituciones"
                                    statuses={institutionHook.institutions}
                                    selectedStatus={courseHook.params.institution}
                                    setSelectedStatus={i => {
                                        courseHook.setParams({
                                            ...courseHook.params,
                                            institution: i as InstitutionInterface,
                                            pageNumber: 0
                                        });
                                    }}
                                    pagination={!institutionHook.isLastPage}
                                    onPaginate={() => institutionHook.setPageNumber(institutionHook.pageNumber + 1)}
                                />
                            </FadeItem>
                            <FadeItem className="w-full">
                                <ComboBoxResponsive
                                    placeholder="Filtrar por Facultad..."
                                    labelAll="Todas las facultades"
                                    statuses={facultyHook.faculties}
                                    selectedStatus={courseHook.params.faculty}
                                    setSelectedStatus={f => {
                                        courseHook.setParams({
                                            ...courseHook.params,
                                            faculty: f,
                                            pageNumber: 0,
                                        });
                                    }}
                                    pagination={!facultyHook.isLastPage}
                                    onPaginate={() => facultyHook.setPageNumber(facultyHook.pageNumber + 1)}
                                />
                            </FadeItem>
                        </div>
                    </div>
                    {/* <div className="mt-6 border-t border-gray-200 pt-4 text-lg inline-flex items-center gap-2">
                        Hemos encontrado <b>597</b> programas recomendados para ti
                        <ThumbsUp className="text-sky-600" />
                    </div> */}
                </div>
                <div className="w-full" ref={ref}>
                    {(
                        !courseHook.isVisible ||
                        (
                            courseHook.loading &&
                            !courseHook.params.search &&
                            !courseHook.params.faculty &&
                            !courseHook.params.institution &&
                            courseHook.params.pageNumber === 0
                        )
                    ) ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:flex 2xl:flex-wrap justify-center">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <CourseSkeleton
                                    key={index}
                                    className="md:w-full md:max-w-[400px] h-full"
                                    optionsEnable={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            {(courseHook.courses.length === 0) ? (
                                <div className="w-full flex flex-col items-center justify-center">
                                    <SearchDraw />
                                    <p>No encontramos ningún programa para esta busqueda.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:flex 2xl:flex-wrap justify-center">
                                    {courseHook.courses.map((course) => (
                                        <FadeItem key={course.id} className="md:w-full md:max-w-[400px]">
                                            <Course
                                                course={course}
                                                optionsEnable={false}
                                                className="md:w-full md:max-w-[400px] h-full"
                                            />
                                        </FadeItem>
                                    ))}
                                </div>
                            )}
                            <FadeItem className="flex items-center justify-center space-x-2 py-4">
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
                            </FadeItem>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export { BlogCourses };