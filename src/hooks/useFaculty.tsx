import APIS from "@/enums/apis";
import CategoryInterface from "@/interfaces/category";
import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";

interface UseFacultyProps {
	size?: number
}

interface ResponseFacultyProps {
	content: CategoryInterface[];
	last: boolean;
}

function useFaculty({ size }: UseFacultyProps) {
    const [faculties, setFaculties] = React.useState<CategoryInterface[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const pageSize: number = size ?? 10;
    const [pageNumber, setPageNumber] = React.useState<number>(0);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);

    React.useEffect(() => {
        setLoading(true);
        axios.get(APIS.FACULTIES, {
            params: {
                page: pageNumber,
                size: pageSize
            }
        })
            .then((response: AxiosResponse<ResponseFacultyProps>) => {
                setFaculties(currentFaculties => 
                    [
                        ...pageNumber > 0 ? currentFaculties : [],
                        ...response.data.content
                    ]
                );
                setIsLastPage(response.data.last);
            })
            .catch((error: AxiosError) => console.error(error))
            .finally(() => setLoading(false));
    }, [pageNumber, pageSize]);

    return {
        faculties,
        loading,
        pageSize,
        pageNumber,
        isLastPage,
        setFaculties,
        setLoading,
        setPageNumber,
        setIsLastPage
    };
}

export default useFaculty;