import { Badge } from "@/components/ui/badge";
import React, { forwardRef } from "react";
import Review from "./review";
import { Button } from "./button";
import { ChevronUp } from "lucide-react";
import FadeItem from "./fade-item";
import { useAuth } from "@/providers/AuthProvider";
import CreateReviewCard from "./createReviewCard";
import { DialogContext } from "@/providers/DialogProvider";
import CreateReviewForm from "@/components/form/create-review-form";
import UserInterface from "@/interfaces/user";
import CourseInterface from "@/interfaces/course";
import ReviewInterface from "@/interfaces/review";
import UpdateReviewForm from "@/components/form/update-review-form";
import DeleteReviewForm from "@/components/form/delete-review-form";

interface BlogReviewsProps {
    tagline: string;
    heading: string;
    description: string;
    course: CourseInterface;
    newReview: (newReview: ReviewInterface) => void;
    updateReview: (review: ReviewInterface) => void;
    deleteReview: (review: ReviewInterface) => void;
}

const BlogReviews = forwardRef<HTMLElement, BlogReviewsProps>(({
    tagline,
    heading,
    description,
    course,
    newReview,
    updateReview,
    deleteReview
}, ref) => {

    const authHook = useAuth();
    const dialogContext = React.useContext(DialogContext);

    return (
        <section ref={ref} className="py-12">
            <div className="w-full mx-auto flex px-4 md:px-8 xl:px-12 2xl:px-16 flex-col items-center gap-16 lg:px-16">
                <div className="text-center">
                    <FadeItem>
                        <Badge variant="secondary" className="mb-6">
                            {tagline}
                        </Badge>
                    </FadeItem>
                    <FadeItem>
                        <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
                            {heading}
                        </h2>
                    </FadeItem>
                    <FadeItem>
                        <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
                            {description}
                        </p>
                    </FadeItem>
                </div>
                {(course.reviews.length > 0 || authHook?.user) && (
                    <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:flex 2xl:flex-wrap justify-center">
                        {(authHook?.user && !course.reviews.some(r => r.user.id === authHook.user?.id)) && (
                            <CreateReviewCard 
                                user={authHook.user} 
                                onClick={() => dialogContext?.setContext({
                                    title: "Crea una nueva reseña",
                                    description: "Añade una nueva reseña al curso con una valoración y contenido.",
                                    open: true,
                                    dialogChildren: <CreateReviewForm 
                                        course={course}
                                        user={authHook.user as UserInterface}
                                        onCreated={(review) => newReview(review)} 
                                    />
                                })}
                                className="w-full md:max-w-[400px]"
                            />
                        )}
                        {course.reviews.map(review => (
                            <FadeItem key={review.id} className="w-full md:max-w-[400px]">
                                <Review
                                    review={review}
                                    optionsEnabled={authHook?.user?.id === review.user.id}
                                    handleEdit={() => dialogContext?.setContext({
                                        title: "Actualizar Reseña",
                                        description: "Modifica los detalles de la reseña para reflejar la experiencia más reciente.",
                                        open: true,
                                        dialogChildren: <UpdateReviewForm 
                                            review={review} 
                                            onUpdated={(r) => updateReview(r)}
                                        />
                                    })}
                                    handleDelete={() => dialogContext?.setContext({
                                        title: "Eliminar Reseña",
                                        description: "¿Estas seguro de querer eliminar esta reseña? No podras recuperarla",
                                        open: true,
                                        dialogChildren: <DeleteReviewForm
                                            review={review} 
                                            onDeleted={(r) => deleteReview(r)}
                                        />
                                    })}
                                    className="w-full md:max-w-[400px]"
                                />
                            </FadeItem>
                        ))}
                    </div>
                )}
                {(course.reviews.length === 0 && !authHook?.user) && (
                    <div className="flex items-center justify-center space-x-2 py-4">
                        <FadeItem>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            >
                                ¡No hay Reseñas! Vuelve arriba.
                                <ChevronUp />
                            </Button>
                        </FadeItem>
                    </div>
                )}
            </div>
        </section>
    );
});

export { BlogReviews };
