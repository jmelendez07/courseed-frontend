import APIS from "@/enums/apis";
import REACTION from "@/enums/reaction";
import ReactionInterface from "@/interfaces/reaction";
import axios, { AxiosResponse } from "axios";
import React from "react";

interface useReactionsProps {
    size?: number; 
}

interface paramsProps {
    pageNumber: number;
    type: REACTION | string;
}

interface responseProps {
    content: ReactionInterface[];
    last: boolean;
    empty: boolean;
}

function useReactions({ size }: useReactionsProps) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [reactions, setReactions] = React.useState<ReactionInterface[]>([]);
    const pageSize = size ?? 12;
    const [params, setParams] = React.useState<paramsProps>({
        pageNumber: 0,
        type: ''
    });
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (isLastPage) return;
        setLoading(true);

        axios.get(APIS.REACTIONS_BY_AUTH_USER, {
            params: {
                size: pageSize,
                page: params.pageNumber,
                type: params.type
            }
        })
            .then((response: AxiosResponse<responseProps>) => {
                setReactions(current => params.pageNumber === 0 
                    ? response.data.content
                    : [...current, ...response.data.content]
                );
                setIsLastPage(response.data.last || response.data.empty);
            })
            .catch(() => setIsLastPage(true))
            .finally(() => setLoading(false));
    }, [params.type, params.pageNumber]);

    return {
        reactions, 
        setReactions,
        loading,
        setLoading,
        params,
        setParams,
        isLastPage,
        setIsLastPage
    }
}

export default useReactions;