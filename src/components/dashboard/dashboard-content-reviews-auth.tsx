import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronDown, ChevronUp, LoaderCircle, Search } from "lucide-react";
import ReviewLarge from "@/components/ui/review-large";
import useReviewsAuth from "@/hooks/useReviewsAuth";
import ReviewsDraw from "@/components/draws/ReviewsDraw";
import { Link } from "react-router-dom";

interface DashboardContentReviewsAuthProps {
    className?: string;
}

function DashboardContentReviewsAuth({ className }: DashboardContentReviewsAuthProps) {
    const reviewsHook = useReviewsAuth({});

    return (
        reviewsHook.loading ? (
            <div className="flex items-center justify-center w-full h-full">
                <LoaderCircle className="animate-spin" />
            </div>
        ) : (
            <div className = {`flex flex-col gap-4 h-full ${className}`}>
                {
                    reviewsHook.reviews.length > 0 ? (
                        <>
                            <div className="flex sm:items-center pb-4 flex-col gap-2 sm:flex-row sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Reseñas de Programas</h1>
                                    <p className="text-muted-foreground">Visualiza tus valoraciones y comentarios.</p>
                                </div>
                                <form
                                    onSubmit={e => {
                                        e.preventDefault();
                                        reviewsHook.handleSearch();
                                    }}
                                    className="flex items-center gap-2 w-full"
                                >
                                    <Input
                                        type="text"
                                        disabled={reviewsHook.loading}
                                        value={reviewsHook.params.searchText}
                                        placeholder="Buscar por calificación o descripción"
                                        onChange={e => {
                                            reviewsHook.setParams({
                                                ...reviewsHook.params,
                                                searchText: e.target.value
                                            });
                                        }}
                                        className="w-full sm:max-w-sm"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={reviewsHook.loading}
                                    >
                                        {reviewsHook.loading ? <LoaderCircle className="animate-spin" /> : <Search />}
                                    </Button>
                                </form>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {reviewsHook.reviews.map(review => (
                                    <ReviewLarge
                                        key={review.id}
                                        review={review}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center justify-center space-x-2 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (reviewsHook.isLastPage) {
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        } else {
                                            reviewsHook.setParams({
                                                ...reviewsHook.params,
                                                pageNumber: reviewsHook.params.pageNumber + 1
                                            });
                                        }
                                    }}
                                    disabled={reviewsHook.loading}
                                >
                                    {reviewsHook.isLastPage ? (
                                        <>
                                            ¡Lo has visto todo! Vuelve arriba.
                                            <ChevronUp />
                                        </>
                                    ) : (
                                        <>
                                            Mostrar mas reseñas
                                            {reviewsHook.loading ? (
                                                <LoaderCircle className="animate-spin" />
                                            ) : (
                                                <ChevronDown />
                                            )}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center gap-4">
                            <ReviewsDraw />
                            <p className="mb-8 text-base">
                                Parece que aún no has creado ninguna reseña.
                            </p>
                            <Button asChild className="group">
                                <Link to="/educacion">
                                    Reseñar una educación continua
                                    <ArrowUpRight className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    )
                }
            </div >
        )
    );
}

export default DashboardContentReviewsAuth;