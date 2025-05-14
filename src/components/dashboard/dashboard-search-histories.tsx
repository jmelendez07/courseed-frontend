import { ArrowUpRight, ChevronDown, ChevronUp, Clock, LoaderCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import useSearchHistories from "@/hooks/useSearchHistories";
import SearchDraw from "@/components/draws/SearchDraw";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

function DashboardSearchHistories() {
    const historiesHook = useSearchHistories({ size: 8 });

    return (
        <>
            <h2 className="text-xl font-semibold">Tu historial de búsquedas</h2>
            {historiesHook.loading && historiesHook.params.pageNumber === 0 ? (
                <div className="flex items-center justify-center w-full h-52 md:h-full">
                    <LoaderCircle className="animate-spin" />
                </div>
            ) : (
                historiesHook.searchHistories.length > 0 ? (
                    <div className="space-y-2">
                        {historiesHook.searchHistories.map((item, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{item.search}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">{dayjs(item.createdAt).fromNow()}</span>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link to={"/educacion?busqueda=" + item.search}>
                                            <Search className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center mt-4">
                            <Button 
                                variant="ghost"
                                onClick={() => {
                                    if (historiesHook.isLastPage) {
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    } else {
                                        historiesHook.setParams({
                                            ...historiesHook.params,
                                            pageNumber: historiesHook.params.pageNumber + 1
                                        });
                                    }
                                }}
                            >
                                {historiesHook.isLastPage ? (
                                    <>
                                        ¡Lo has visto todo! Vuelve arriba.
                                        <ChevronUp />
                                    </>
                                ) : (
                                    <>
                                        Ver más
                                        <ChevronDown className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center p-4 text-center gap-4">
                        <SearchDraw />
                        <p className="mb-8 text-base">
                            Parece que aún no has buscado nada aún.
                        </p>
                        <Button asChild className="group">
                            <Link to="/educacion">
                                Busca un programa aqui
                                <ArrowUpRight className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                )
            )}
        </>
    );
}

export default DashboardSearchHistories;