import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import ReviewCourseUserInterface from "@/interfaces/review-course-user";
import { Button } from "@/components/ui/button";
import ViewInterface from "@/interfaces/view";
import { Link } from "react-router-dom";

interface ResponseReviewProps {
    content: ReviewCourseUserInterface[];
}

function DashboardStatsProfile() {
    const [reviews, setReviews] = React.useState<ReviewCourseUserInterface[]>([]);
    const [views, setViews] = React.useState<ViewInterface[]>([]);

    React.useEffect(() => {
        axios.get(APIS.REVIEWS_BY_AUTH_USER, {
            params: {
                page: 0,
                size: 4
            }
        })
            .then((response: AxiosResponse<ResponseReviewProps>) => {
                setReviews(response.data.content);
            })
            .catch(() => setReviews([]));
    }, []);

    React.useEffect(() => {
        axios.get(APIS.VIEWS_BY_AUTH_USER, {
            params: {
                page: 0,
                size: 4
            }
        })
            .then((response: AxiosResponse<{ content: ViewInterface[] }>) => {
                setViews(response.data.content);
            })
            .catch(() => setViews([]));
    }, []);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        Últimos Programas Reseñados
                        <CalendarDays className="ml-2 h-4 w-4 min-w-4" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-6">
                        {reviews.length > 0 ? reviews.map((review) => (
                            <li key={review.id} className="flex justify-between items-center gap-2 group">
                                <div className="flex items-center gap-2 flex-1">
                                    <img
                                        src={review.course.image}
                                        alt={review.course.title}
                                        title={review.course.title}
                                        className="size-14 min-w-14 rounded-md object-cover"
                                    />
                                    <p className="font-medium text-sm line-clamp-3">
                                        {review.course.title}. <span className="text-xs text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </p>
                                </div>
                                <Button asChild size="sm">
                                    <Link
                                        to={`/educacion/${review.course.id}`}
                                        className="px-[0.5rem] rounded transition-transform group-hover:translate-x-1"
                                    >
                                        <ArrowUpRight className="size-4" />
                                    </Link>
                                </Button>
                            </li>
                        )) : (
                            <div className="w-full flex items-center justify-center h-64 overflow-hidden">
                                <p className="text-gray-600">No hay programas reseñados</p>
                            </div>
                        )}
                    </ul>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        Últimos Programas Visitados
                        <CalendarDays className="ml-2 h-4 w-4 min-w-4" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-6">
                        {views.length > 0 ? views.map((like) => (
                            <li key={like.id} className="flex justify-between items-center gap-2 group">
                                <div className="flex items-center gap-2 flex-1">
                                    <img
                                        src={like.course.image}
                                        alt={like.course.title}
                                        title={like.course.title}
                                        className="size-14 rounded-md object-cover"
                                    />
                                    <p className="font-medium text-sm line-clamp-3">
                                        {like.course.title}. <span className="text-xs text-gray-600">{new Date(like.createdAt).toLocaleDateString()}</span>
                                    </p>
                                </div>
                                <Button asChild size="sm">
                                    <Link
                                        to={`/educacion/${like.course.id}`}
                                        className="px-[0.5rem] rounded transition-transform group-hover:translate-x-1"
                                    >
                                        <ArrowUpRight className="size-4" />
                                    </Link>
                                </Button>
                            </li>
                        )) : (
                            <div className="w-full flex items-center justify-center h-64 overflow-hidden">
                                <p className="text-gray-600">No hay programas visitados</p>
                            </div>
                        )}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

export default DashboardStatsProfile;