import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function DashboardCourseOferts() {
    return (
        <>
            <div className="flex items-center">
                <h2 className="text-xl font-semibold">Ofertas y descuentos</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {[
                    {
                        title: "50% de descuento en cursos de Desarrollo",
                        description: "Válido hasta el 30 de marzo",
                        color: "bg-blue-50 dark:bg-blue-950",
                    },
                    {
                        title: "Curso gratis de Introducción a la IA",
                        description: "Por tiempo limitado",
                        color: "bg-purple-50 dark:bg-purple-950",
                    },
                ].map((offer, i) => (
                    <Card key={i} className={`${offer.color} border-none`}>
                        <CardHeader>
                            <CardTitle className="text-lg">{offer.title}</CardTitle>
                            <CardDescription>{offer.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button size="sm">Ver oferta</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default DashboardCourseOferts;