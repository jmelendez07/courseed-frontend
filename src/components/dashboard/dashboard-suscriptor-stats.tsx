import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Eye, Star, ThumbsUp, Users } from "lucide-react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import SlotCounter from 'react-slot-counter';

function DashboardSuscriptorStats() {
    const [totalCourses, setTotalCourses] = React.useState<number>(0);
    const [totalReviews, setTotalReviews] = React.useState<number>(0);
    const [totalReactions, setTotalReactions] = React.useState<number>(0);
    const [totalViews, setTotalViews] = React.useState<number>(0);

    React.useEffect(() => {
        axios.get(APIS.COURSES_TOTAL_BY_SUSCRIPTOR)
            .then((response: AxiosResponse<number>) => {
                setTotalCourses(response.data);
            });
    }, []);

    React.useEffect(() => {
        axios.get(APIS.REVIEWS_TOTAL_BY_SUSCRIPTOR)
            .then((response: AxiosResponse<number>) => {
                setTotalReviews(response.data);
            });
    }, []);

    React.useEffect(() => {
        axios.get(APIS.REACTIONS_TOTAL_BY_SUSCRIPTOR)
            .then((response: AxiosResponse<number>) => {
                setTotalReactions(response.data);
            });
    }, []);

    React.useEffect(() => {
        axios.get(APIS.VIEWS_TOTAL_BY_SUSCRIPTOR)
            .then((response: AxiosResponse<number>) => {
                setTotalViews(response.data);
            });
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Programas</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <p className="text-2xl font-bold">
                        {totalCourses > 0 ? <SlotCounter value={totalCourses} /> : totalCourses}
                    </p>
                    <Users className={`size-8 text-blue-500`} />
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Reseñas</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <p className="text-2xl font-bold">
                        {totalReviews > 0 ? <SlotCounter value={totalReviews} /> : totalReviews}
                    </p>
                    <Star className={`size-8 text-yellow-500`} />
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Reacciones</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <p className="text-2xl font-bold">
                        {totalReactions > 0 ? <SlotCounter value={totalReactions} /> : totalReactions}
                    </p>
                    <ThumbsUp className={`size-8 text-purple-500`} />
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Visualizaciones</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <p className="text-2xl font-bold">
                        {totalViews > 0 ? <SlotCounter value={totalViews} /> : totalViews}
                    </p>
                    <Eye className={`size-8 text-green-500`} />
                </CardContent>
            </Card>
        </div>
    );
}

export default DashboardSuscriptorStats;