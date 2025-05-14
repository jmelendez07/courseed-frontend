import useReviews from "@/hooks/useReviews";
import { DialogContext } from "@/providers/DialogProvider";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, LoaderCircle, Search } from "lucide-react";
import ComboBoxResponsive from "@/components/ui/combo-box-responsive";
import ReviewLarge from "@/components/ui/review-large";
import useUsers from "@/hooks/useUsers";
import UpdateReviewForm from "@/components/form/update-review-form";
import DeleteReviewForm from "@/components/form/delete-review-form";

function DashboardContentReviews({ className }: { className?: string }) {

    const dialogContext = React.useContext(DialogContext);
	const reviewHook = useReviews({});
    const userHook = useUsers({});

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <div className="flex items-center">
                <h2 className="text-xl font-semibold">Gestion de Reseñas</h2>
            </div>
            <div className="grid grid-cols-1 items-center md:grid-cols-[1fr,auto] gap-4">
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        reviewHook.setParams({
                            ...reviewHook.params,
                            searchSubmit: true,
                            pageNumber: 0
                        });
                        reviewHook.handleFetch();
                    }}
                    className="flex items-center gap-2"
                >
                    <Input
                        type="text"
                        disabled={reviewHook.loading}
                        value={reviewHook.params.searchText}
                        placeholder="Buscar por calificación, descripción..."
                        onChange={e => {
                            if (e.target.value.trim() === "") {
                                reviewHook.setParams({
                                    ...reviewHook.params,
                                    searchSubmit: false
                                });
                            }
                            reviewHook.setParams({
                                ...reviewHook.params,
                                searchText: e.target.value
                            });
                        }}
                        className="max-w-sm"
                    />
                    <Button
                        type="submit"
                        disabled={reviewHook.loading}
                    >
                        {reviewHook.loading ? <LoaderCircle className="animate-spin" /> : <Search />}
                    </Button>
                </form>
                <ComboBoxResponsive
                    placeholder="Filtrar por Usuario..."
                    labelAll="Todos los usuarios"
                    statuses={userHook.users.map(u => { return { id: u.id, name: u.email } })}
                    selectedStatus={reviewHook.params.user
                        ? { id: reviewHook.params.user.id, name: reviewHook.params.user.email }
                        : null
                    }
                    setSelectedStatus={u => {
                        reviewHook.setParams({
                            ...reviewHook.params,
                            user: { id: u?.id, email: u?.name ? u.name : '' },
                            pageNumber: 0
                        });
                    }}
                    pagination={!userHook.isLastPage}
                    onPaginate={() => userHook.setPageNumber(userHook.pageNumber + 1)}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {reviewHook.reviews.map(review => (
                    <ReviewLarge
                        key={review.id}
                        review={review}
                        handleEdit={() => dialogContext?.setContext({
                            title: "Actualizar Reseña",
                            description: "Modifica los detalles de la reseña para reflejar la experiencia más reciente.",
                            open: true,
                            dialogChildren: <UpdateReviewForm 
                                review={review} 
                                onUpdated={(r) => reviewHook.handleReviewUpdated(r)}
                            />
                        })}
                        handleDelete={() => dialogContext?.setContext({
                            title: "Eliminar Reseña",
                            description: "¿Estas seguro de querer eliminar esta reseña? No podras recuperarla",
                            open: true,
                            dialogChildren: <DeleteReviewForm 
                                review={review} 
                                onDeleted={(r) => reviewHook.handleReviewDeleted(r)}
                            />
                        })}
                    />
                ))}
            </div>
            <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        if (reviewHook.isLastPage) {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        } else {
                            reviewHook.setParams({
                                ...reviewHook.params,
                                pageNumber: reviewHook.params.pageNumber + 1
                            });
                        }
                    }}
                    disabled={reviewHook.loading}
                >
                    {reviewHook.isLastPage ? (
                        <>
                            ¡Lo has visto todo! Vuelve arriba.
                            <ChevronUp />
                        </>
                    ) : (
                        <>
                            Mostrar mas reseñas
                            {reviewHook.loading ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <ChevronDown />
                            )}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

export default DashboardContentReviews;