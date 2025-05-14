import APIS from "@/enums/apis";
import { useToast } from "@/hooks/use-toast";
import ReviewCourseUserInterface from "@/interfaces/review-course-user";
import { DialogContext } from "@/providers/DialogProvider";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import React from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import ReviewInterface from "@/interfaces/review";

interface DeleteReviewForm {
    review: ReviewCourseUserInterface | ReviewInterface,
    onDeleted?: (review: ReviewCourseUserInterface | ReviewInterface) => void
}

interface ErrorProps {
    auth: string | null;
    reviewId: string | null;
}

function DeleteReviewForm({ review, onDeleted }: DeleteReviewForm) {
    const dialogContext = React.useContext(DialogContext);
    const [loading, setLoading] = React.useState<boolean>(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        
        axios.delete(`${APIS.REVIEWS_DELETE}${review.id}`)
            .then(() => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `Reseña de ${review.user.email} Eliminada!`,
                    description: dayjs().format("LLL"),
                });
                if (onDeleted) onDeleted(review);
            })
            .catch((error: AxiosError<ErrorProps>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `Reseña de ${review.user.email} salió mal!`,
                    description: error.response?.data.auth || error.response?.data.reviewId || error.message,
                    variant: "destructive",
                });
            })
            .finally(() => setLoading(false));
    } 

    return (
        <form onSubmit={handleSubmit} className="grid items-center justify-center gap-2">
            <Button
                type="submit"
                disabled={loading}
            >
                <p className="max-w-full truncate inline-flex items-center gap-2">
                    Eliminar Permanentemente
                    {loading && (
                        <LoaderCircle className="animate-spin" />
                    )}
                </p>
            </Button>
        </form>
    );
}

export default DeleteReviewForm;