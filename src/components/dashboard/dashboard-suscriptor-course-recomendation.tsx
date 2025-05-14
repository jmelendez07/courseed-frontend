import APIS from "@/enums/apis";
import CourseInterface from "@/interfaces/course";
import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import TableRecomendedUsersByCourse from "../table-recomended-users-by-course";
import RecomendedCoursesTable from "../tables/recomended-courses-table";

interface ResponseProps {
    content: CourseInterface[];
    empty: boolean;
    last: boolean;
}

function DashboardSuscriptorCourseRecomendation({ title }: { title?: string }) {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [courses, setCourses] = React.useState<CourseInterface[]>([]);
    const [pageNumber, setPageNumber] = React.useState<number>(0);
    const [selectedCourse, setSelectedCourse] = React.useState<CourseInterface | null>(null);

    React.useEffect(() => {
        setLoading(true);

        axios.get(APIS.COURSES_BY_AUTH_USER, {
            params: {
                page: pageNumber,
                size: 12
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
    }, [pageNumber]);

    return (
        <AnimatePresence mode="popLayout">
            <motion.div
                key={selectedCourse?.id}
                className={`grid grid-cols-1 h-full ${loading ? 'place-items-center' : 'place-content-start'}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
            >
                {selectedCourse ? (
                    <TableRecomendedUsersByCourse
                        course={selectedCourse}
                        exit={() => setSelectedCourse(null)}
                    />
                ) : (
                    loading ? (
                        <LoaderCircle className="text-gray-600 animate-spin" />
                    ) : (
                        <>
                            <RecomendedCoursesTable title={title} setSelectedCourse={setSelectedCourse} courses={courses} />
                            <div className="flex items-center justify-end space-x-2 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPageNumber(pageNumber - 1)}
                                    disabled={pageNumber <= 0}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPageNumber(pageNumber + 1)}
                                    disabled={isLastPage}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </>
                    )
                )}
            </motion.div>
        </AnimatePresence>
    );
}

export default DashboardSuscriptorCourseRecomendation;