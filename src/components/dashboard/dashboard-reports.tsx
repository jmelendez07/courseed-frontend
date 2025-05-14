import { Star, TrendingDown } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";

interface CourseAverageRating {
    courseId: number;
    total: number;
}

function DashboardReports() {

    const [coursesNegativeRating, setCoursesNegativeRating] = React.useState<CourseAverageRating[]>([]);
    const [coursesDecreasingViews, setCoursesDecreasingViews] = React.useState<[]>([]);

    React.useEffect(() => {
        axios.get(APIS.REVIEWS_TOTAL_NEGATIVE)
            .then((response: AxiosResponse<CourseAverageRating[]>) => {
                setCoursesNegativeRating(response.data);
            })
            .catch(() => setCoursesNegativeRating([]))
    }, []);

    React.useEffect(() => {
        axios.get(APIS.VIEWS_COURSES_DECREASING)
            .then((response: AxiosResponse) => {
                setCoursesDecreasingViews(response.data);
            })
            .catch(() => setCoursesDecreasingViews([]));
    }, []);

    return (
        <>
            <div className="flex items-center">
                <h2 className="text-xl font-semibold">Reportes Automáticos</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    {
                        title: "Baja Interacción",
                        description: coursesDecreasingViews.length + " cursos con baja interacción en los últimos 30 días",
                        icon: TrendingDown,
                        color: "text-yellow-500",
                    },
                    {
                        title: "Reseñas Negativas",
                        description: coursesNegativeRating.length + " cursos con aumento de reseñas negativas",
                        icon: Star,
                        color: "text-orange-500",
                    },
                ].map((report, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center gap-2">
                            <report.icon className={`h-5 w-5 ${report.color}`} />
                            <CardTitle className="text-base">{report.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{report.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" size="sm" className="w-full">
                                Ver detalles
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default DashboardReports;