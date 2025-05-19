import APIS from "@/enums/apis";
import CategoryInterface from "@/interfaces/category";
import CourseInterface from "@/interfaces/course";
import InstitutionInterface from "@/interfaces/institution";
import { useAuth } from "@/providers/AuthProvider";
import axios, { AxiosResponse } from "axios";
import React from "react";

interface ResponseCourseProps {
    content: CourseInterface[];
    last: boolean;
    empty: boolean;
    totalElements: number;
}

interface ParamsProps {
    pageNumber: number;
    search: string;
    institution: InstitutionInterface | null;
    faculty: CategoryInterface | null;
}

interface UseCoursesProps {
    size?: number;
    page?: number;
    isVisibleParam?: boolean;
    institutionParam?: InstitutionInterface;
    facultyParam?: CategoryInterface;
    searchParam?: string
}

function useCourses({ size, page, isVisibleParam = true, institutionParam, facultyParam, searchParam }: UseCoursesProps) {
    const [courses, setCourses] = React.useState<CourseInterface[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [isVisible, setIsVisible] = React.useState<boolean>(isVisibleParam);
    const [totalCourses, setTotalCourses] = React.useState<number | null>(null);
    const pageSize: number = size ?? 12;
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const authHook = useAuth();

    const [params, setParams] = React.useState<ParamsProps>({
        pageNumber: page ?? 0,
        search: searchParam || "",
        institution: institutionParam?.id ? institutionParam : null,
        faculty: facultyParam?.id ? facultyParam : null
    });

    const handleFetch = React.useCallback(() => {
        setLoading(true);

        axios.get(APIS.COURSES, {
            params: {
                page: params.pageNumber,
                size: pageSize,
                search: params.search,
                institutionId: params.institution?.id,
                categoryId: params.faculty?.id,
            },
        })
            .then((response: AxiosResponse<ResponseCourseProps>) => {
                setCourses(currentCourses => params.pageNumber === 0
                    ? response.data.content
                    : [
                        ...currentCourses,
                        ...response.data.content
                    ]
                );
                setIsLastPage(response.data.last || response.data.empty);
                setTotalCourses(response.data.totalElements);
            })
            .catch(() => {
                setIsLastPage(true);
            })
            .finally(() => setLoading(false));
    }, [pageSize, params]);

    const handleSearch = React.useCallback((search?: string) => {
        setLoading(true);
        axios.get(APIS.COURSES, {
            params: {
                page: 0,
                size: pageSize,
                search: search ? search : params.search,
                institutionId: params.institution?.id,
                categoryId: params.faculty?.id,
            },
        })
            .then((response: AxiosResponse<ResponseCourseProps>) => {
                setCourses(response.data.content);
                setIsLastPage(response.data.last || response.data.empty);
                setTotalCourses(response.data.totalElements);
            })
            .catch(() => {
                setIsLastPage(true);
            })
            .finally(() => setLoading(false));

        if (authHook?.user && params.search.trim().length > 0) {
            axios.post(APIS.SEARCH_HISTORY_CREATE, { search: params.search  })
        } 
    }, [pageSize, params]);

    const handleCreatedCourse = (course: CourseInterface) => {
        setCourses(currentCourses => [
            course,
            ...currentCourses
        ]);
    }

    const handleUpdateCourse = (course: CourseInterface) => {
        setCourses([
            ...courses.map(c => {
                if (c.id === course.id) {
                    return course;
                } else {
                    return c;
                }
            })
        ]);
    }

    const handleDeleteCourse = (course: CourseInterface) => {
        setCourses(courses.filter(c => c.id !== course.id));
    }

    React.useEffect(() => {
        if (isVisible) handleFetch();
    }, [params.pageNumber, isVisible, pageSize, params.institution?.id, params.faculty?.id]);

    return {
        courses,
        loading,
        pageSize,
        isLastPage,
        totalCourses,
        params,
        isVisible,
        setCourses,
        setLoading,
        setIsLastPage,
        setTotalCourses,
        setParams,
        handleSearch,
        handleCreatedCourse,
        handleUpdateCourse,
        handleDeleteCourse,
        setIsVisible
    };
}

export default useCourses;