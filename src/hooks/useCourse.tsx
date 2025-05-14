import APIS from "@/enums/apis";
import CourseInterface from "@/interfaces/course";
import ReactionInterface from "@/interfaces/reaction";
import ReviewInterface from "@/interfaces/review";
import ViewInterface from "@/interfaces/view";
import { useAuth } from "@/providers/AuthProvider";
import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";

interface useCourseProps {
    id: string | undefined
}

function useCourse({ id }: useCourseProps) {
    const [course, setCourse] = React.useState<CourseInterface | null | undefined>(undefined);
    const [loading, setLoading] = React.useState(false);
    const authHook = useAuth();

    console.log(authHook);

    React.useEffect(() => {
        setLoading(true)
        axios.get(`${APIS.COURSES}/${id}`)
            .then((response: AxiosResponse) => {
                setCourse(response.data);
            })
            .catch((error: AxiosError) => {
                console.error(error);
                setCourse(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleCreatedReaction = (reaction: ReactionInterface) => {
        if (!course) return;
        setCourse({
            ...course,
            reactions: [...course.reactions, reaction]
        });
    }

    const handleUpdatedReaction = (reaction: ReactionInterface) => {
        if (!course) return;
        setCourse({
            ...course,
            reactions: course.reactions.map(r => r.id === reaction.id ? reaction : r)
        });
    }

    const handleDeletedReaction = (id: string) => {
        if (!course) return;
        setCourse({
            ...course,
            reactions: course.reactions.filter(reaction => reaction.id !== id)
        });
    }

    const newReview = (newReview: ReviewInterface) => {
        if (!course) return;
        setCourse({
            ...course,
            reviews: [newReview, ...course.reviews]
        });
    }

    const updateReview = (review: ReviewInterface) => {
        if (!course) return;
        setCourse({ 
            ...course, 
            reviews: course.reviews.map(r => r.id === review.id ? review : r) 
        });
    }

    const deleteReview = (review: ReviewInterface) => {
        if (!course) return;
        setCourse({
            ...course,
            reviews: course.reviews.filter(r => r.id !== review.id)
        });
    } 

    const newView = (newView: ViewInterface) => {
        if (!course) return;
        setCourse({
            ...course,
            views: [ newView, ...course.views ]
        });
        authHook?.addViewCount();
    }

    return {
        course,
        loading,
        setCourse,
        setLoading,
        handleCreatedReaction,
        handleUpdatedReaction,
        handleDeletedReaction,
        newReview,
        updateReview,
        deleteReview,
        newView
    };
}

export default useCourse;