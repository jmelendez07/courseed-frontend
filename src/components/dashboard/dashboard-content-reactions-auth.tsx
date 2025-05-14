
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";
import Course from "@/components/ui/course";
import LikeDraw from "@/components/draws/LikeDraw";
import useReactions from "@/hooks/useReactions";
import REACTION, { getReactionText } from "@/enums/reaction";
import { Link } from "react-router-dom";

interface DashboardContentLikesAuthProps {
    className?: string;
}

function DashboardContentLikesAuth({ className }: DashboardContentLikesAuthProps) {

    const reactionsHook = useReactions({});

    return (
        (reactionsHook.loading && reactionsHook.params.pageNumber === 0 && !reactionsHook.params.type) ? (
            <div className="flex items-center justify-center w-full h-full">
                <LoaderCircle className="animate-spin" />
            </div>
        ) : (
            <div className={`flex flex-col gap-4 h-full ${className}`}>
                <div className="flex items-center pb-4 flex-col gap-4 sm:flex-row sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Reacciones de Programas</h1>
                        <p className="text-muted-foreground">Visualiza tus reaccciones positivos, neutrales o negativas aqui.</p>
                    </div>
                    <div className="w-full sm:w-auto">
                        {Object.values(REACTION).map(reaction => (
                            <Button
                                key={reaction}
                                variant="ghost"
                                className={`
                                text-3xl px-0 
                                ${reactionsHook.params.type !== getReactionText(reaction) && 'grayscale'}`
                                }
                                onClick={() => {
                                    reactionsHook.setParams({
                                        ...reactionsHook.params,
                                        type: reactionsHook.params.type !== getReactionText(reaction) ? getReactionText(reaction) : ''
                                    });
                                }}
                            >
                                {reaction}
                            </Button>
                        ))}
                    </div>
                </div>
                {reactionsHook.reactions.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {reactionsHook.reactions.map(reaction => (
                                reaction.course && (<Course key={reaction.id} course={reaction.course} optionsEnable={false} />)
                            ))}
                        </div>
                        <div className="flex items-center justify-center space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (reactionsHook.isLastPage) {
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    } else {
                                        reactionsHook.setParams({
                                            ...reactionsHook.params,
                                            pageNumber: reactionsHook.params.pageNumber + 1
                                        });
                                    }
                                }}
                                disabled={reactionsHook.loading}
                            >
                                {reactionsHook.isLastPage ? (
                                    <>
                                        ¡Lo has visto todo! Vuelve arriba.
                                        <ChevronUp />
                                    </>
                                ) : (
                                    <>
                                        Mostrar mas reacciones
                                        {reactionsHook.loading ? (
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
                        <LikeDraw />
                        <p className="mb-8 text-base">
                            Parece que aún no has dado ningúna reacción.
                        </p>
                        <Button asChild className="group">
                            <Link to="/educacion">
                                Reacciona a un programa aqui
                                <ArrowUpRight className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        )
    );
}

export default DashboardContentLikesAuth;