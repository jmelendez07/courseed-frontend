import APIS from "@/enums/apis";
import ReviewInterface from "@/interfaces/review";
import ReviewCourseUserInterface from "@/interfaces/review-course-user";
import UserInterface from "@/interfaces/user";
import axios, { AxiosResponse } from "axios";
import React from "react";

interface ResponseReviewProps {
	content: ReviewCourseUserInterface[];
	last: boolean;
	empty: boolean;
    totalElements: number;
}

interface ParamsProps {
    pageNumber: number;
    searchText: string;
    searchSubmit: boolean;
    user: UserInterface | null
}

interface UseReviewsProps {
    size?: number;
}

function useReviews({ size }: UseReviewsProps) {
    const [reviews, setReviews] = React.useState<ReviewCourseUserInterface[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [totalCourses, setTotalCourses] = React.useState<number | null>(null);
    const pageSize: number = size ?? 12;
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);

    const [params, setParams] = React.useState<ParamsProps>({
        pageNumber: 0,
        searchText: "",
        searchSubmit: false,
        user: null
    });

    const handleFetch = React.useCallback(() => {
        setLoading(true);
		axios.get(APIS.REVIEWS, {
            params: {
                page: params.pageNumber,
                size: pageSize,
                search: params.searchText,
                userId: params.user?.id
            }
        })
			.then((response: AxiosResponse<ResponseReviewProps>) => {
                console.log(response);
				setReviews(currentReviews => params.pageNumber === 0 
                    ? response.data.content 
                    : [
					    ...currentReviews,
					    ...response.data.content
                    ]
                );
				setIsLastPage(response.data.last || response.data.empty);
                setTotalCourses(response.data.totalElements);
			})
			.catch(() => setIsLastPage(true))
			.finally(() => setLoading(false));
    }, [params.pageNumber, pageSize, params.searchText, params.searchSubmit, params.user]);

    const handleSearch = () => {
        setParams({
            ...params,
            pageNumber: 0
        });
        setLoading(true);
        axios.get(`${APIS.REVIEWS}?search=${params.searchText}`, {
            params: {
                page: 0,
                size: pageSize
            },
        })
            .then((response: AxiosResponse<ResponseReviewProps>) => {
                setReviews(response.data.content);
                setIsLastPage(response.data.last || response.data.empty);
                setTotalCourses(response.data.totalElements);
            })
            .catch(() => setIsLastPage(true))
            .finally(() => setLoading(false));
    }

    const handleReviewUpdated = (review: ReviewCourseUserInterface) => {
        setReviews(reviews.map(r => {
            return r.id === review.id ? review : r;
        }));
    }
    
    const handleReviewDeleted = (review: ReviewCourseUserInterface | ReviewInterface) => {
        setReviews(reviews.filter(r => r.id !== review.id));
    }

    React.useEffect(() => handleFetch(), [params.pageNumber, pageSize, params.user]);

    return {
        reviews,
        loading,
        pageSize,
        isLastPage,
        totalCourses,
        params,
        setReviews,
        setLoading,
        setIsLastPage,
        setTotalCourses,
        setParams,
        handleFetch,
        handleSearch,
        handleReviewUpdated,
        handleReviewDeleted
    };
}

export default useReviews;