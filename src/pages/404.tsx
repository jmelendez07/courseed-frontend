import { Button } from "@/components/ui/button";
import HeadProvider from "@/providers/HeadProvider";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

function Page404() {
    return (
        <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 font-inter">
            <HeadProvider title="Pagina no Encontrada" />
            <div className="text-center">
                <p className="text-base font-semibold text-muted-foreground">
                    404
                </p>
                <h1 className="mt-4 text-3xl text-pretty font-bold tracking-tight sm:text-5xl">
                    Página no encontrada
                </h1>
                <p className="mt-6 text-base text-muted-foreground lg:text-xl leading-7 ">
                    Lo sentimos, no pudimos encontrar la página que estás buscando.
                </p>
                <Button asChild className="w-full sm:w-auto mt-10">
                    <Link
                        to="/"
                    >
                        <ChevronLeft />
                        Volver a la pagina principal
                    </Link>
                </Button>
            </div>
        </main>
    );
}

export default Page404;