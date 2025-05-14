import useViewsAuth from "@/hooks/useViewsAuth";
import Course from "../ui/course";
import { Button } from "../ui/button";
import { ArrowDown, LoaderCircle, Search } from "lucide-react";
import { Input } from "../ui/input";

function DashboardProgramsViewed() {

    const viewsHook = useViewsAuth();

    return (
        <div className="space-y-4 grid grid-cols-1 grid-rows-[auto_auto_1fr_auto] content-start h-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Historial de programas vistos</h1>
                <p className="text-muted-foreground">Explora todos los contenidos que has disfrutado, con acceso rápido a tus programas recientes y favoritos.</p>
            </div>
            <div className="relative w-full sm:w-80 md:w-96 lg:w-1/2 xl:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="search"
                    placeholder="Buscar historial"
                    className="pl-10 w-full"
                    value={viewsHook.search}
                    onChange={(e) => {
                        viewsHook.setSearch(e.target.value);
                        viewsHook.setPageNumber(0);
                    }}
                />
            </div>
            <div className="w-full h-full">
                {viewsHook.loading ? (
                    <div className="w-full h-full grid place-items-center">
                        <LoaderCircle className="size-5 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {viewsHook.views.map((view) => (
                            <Course key={view.id} course={view.course} optionsEnable={false} />
                        ))}
                    </div>
                )}
            </div>
            {(!viewsHook.loading && !viewsHook.isLastPage) && (
                <div className="grid place-items-center py-6">
                    <Button onClick={() => viewsHook.setPageNumber(viewsHook.pageNumber + 1)} variant="outline" type="button" className="flex items-center gap-2">
                        <span className="">Ver más resultados</span>
                        <ArrowDown className="size-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}

export default DashboardProgramsViewed;