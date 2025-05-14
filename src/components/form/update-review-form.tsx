import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RatingInput from "@/components/ui/rating-input";
import React from "react";
import ReviewCourseUserInterface from "@/interfaces/review-course-user";
import axios, { AxiosError, AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { Info, LoaderCircle } from "lucide-react";
import { DialogContext } from "@/providers/DialogProvider";
import dayjs from "dayjs";
import { useToast } from "@/hooks/use-toast";
import ReviewInterface from "@/interfaces/review";

interface FormProps {
    rating: number;
    content: string;
}

interface ErrorProps {
    auth: string | null;
    reviewId: string | null;
    rating: string | null;
    content: string | null;
}

interface UpdateReviewFormProps {
    review: ReviewCourseUserInterface | ReviewInterface;
    onUpdated?: (review: ReviewCourseUserInterface) => void;
}

function UpdateReviewForm({ review, onUpdated }: UpdateReviewFormProps) {
    const dialogContext = React.useContext(DialogContext);
    const [form, setForm] = React.useState<FormProps>({
        rating: review.rating,
        content: review.content
    });
    const [errors, setErrors] = React.useState<ErrorProps>({
        auth: null,
        reviewId: null,
        rating: null,
        content: null
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        axios.put(APIS.REVIEWS_UPDATE + review.id, form)
            .then((response: AxiosResponse<ReviewCourseUserInterface>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `Reseña de ${response.data.course.title} Actualizado!`,
                    description: dayjs().format("LLL"),
                });
                if (onUpdated) {
                    onUpdated(response.data);
                }
            })
            .catch((error: AxiosError<ErrorProps>) => {
                if (error.response?.data.auth || error.response?.data.reviewId) {
                    dialogContext?.setContext({
                        ...dialogContext.context,
                        open: false
                    });
                    toast({
                        title: `Reseña de ${review.user.email} salió mal!`,
                        description: error.response.data.auth ? error.response.data.auth : error.response.data.reviewId,
                        variant: "destructive",
                    });
                } else {
                    setErrors({
                        auth: error.response?.data.auth ?? null,
                        reviewId: error.response?.data.reviewId ?? null,
                        rating: error.response?.data.rating ?? null,
                        content: error.response?.data.content ?? null
                    });
                }
            })
            .finally(() => setLoading(false));
    }

    return (
        <form onSubmit={handleSubmit} className="grid items-start gap-4">
            <div className="grid gap-2">
                <Label htmlFor="rating">Valoración</Label>
                <RatingInput 
                    rating={form.rating}
                    disabled={loading}
                    setRating={(rating) => setForm({
                        ...form,
                        rating: rating
                    })}
                />
                {errors.rating && (
                    <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                        <Info className="w-3 h-3 min-h-3 min-w-3" />
                        <span>
                            {errors.rating}
                        </span>
                    </p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="content">Contenido</Label>
                <Textarea 
                    id="content" 
                    value={form.content}
                    onChange={e => setForm({
                        ...form,
                        content: e.target.value
                    })}
                    disabled={loading}
                    rows={5} 
                />
                {errors.content && (
                    <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                        <Info className="w-3 h-3 min-h-3 min-w-3" />
                        <span>
                            {errors.content}
                        </span>
                    </p>
                )}
            </div>
            <Button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 overflow-hidden"
            >
                <p className="truncate">Actualizar Reseña</p>
                {loading && (
                    <LoaderCircle className="animate-spin" />
                )}
            </Button>
        </form>
    );
}

export default UpdateReviewForm;