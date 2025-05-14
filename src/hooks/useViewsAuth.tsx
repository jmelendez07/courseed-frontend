import APIS from "@/enums/apis";
import ViewInterface from "@/interfaces/view";
import axios, { AxiosResponse } from "axios";
import React from "react";

interface UseViewsAuthReturn {
    content: ViewInterface[];
    empty: boolean;
    last: boolean;
}

function useViewsAuth() {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [views, setViews] = React.useState<ViewInterface[]>([]);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [pageNumber, setPageNumber] = React.useState<number>(0);
    const [search, setSearch] = React.useState<string>("");
    const pageSize = 10;

    React.useEffect(() => {
        setLoading(true);
        axios.get(APIS.VIEWS_BY_AUTH_USER, {
            params: {
                page: pageNumber,
                size: pageSize,
                search: search,
            }
        })
            .then((response: AxiosResponse<UseViewsAuthReturn>) => {
                console.log(response);
                setViews(pageNumber === 0 ? response.data.content : [...views, ...response.data.content]);
                setIsLastPage(response.data.last || response.data.empty || response.data.content.length < pageSize);
            })
            .catch(() => {
                setIsLastPage(true);
            })
            .finally(() => setLoading(false));
    }, [pageNumber, search]);

    return {
        views,
        setViews,
        isLastPage,
        setIsLastPage,
        pageNumber,
        setPageNumber,
        loading,
        setLoading,
        search,
        setSearch
    }
}

export default useViewsAuth;