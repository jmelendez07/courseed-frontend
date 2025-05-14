import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Course from "@/components/ui/course";
import React from "react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import CourseInterface from "@/interfaces/course";
import CourseSkeleton from "../skeleton/course-skeleton";
import { useAuth } from "@/providers/AuthProvider";

interface DashboardRecomendedCoursesResponseProps {
    content: CourseInterface[];
}

function DashboardHistoryRecomendations() {
    const [courses, setCourses] = React.useState<CourseInterface[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const authHook = useAuth();

    React.useEffect(() => {
        setLoading(true);
        axios.get(APIS.USER_COURSES_RECOMENDED_BY_HISTORY)
            .then((response: AxiosResponse<DashboardRecomendedCoursesResponseProps>) => {
                setCourses(response.data.content);
            })
            .catch((error) => {
                console.error("Error fetching recommended courses 2:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    const ordenedCourses: CourseInterface[] = React.useMemo(() => {
        if (!courses.length || !authHook?.user?.profile?.interest) {
            return courses;
        }

        const userInterest = authHook.user.profile.interest.toLowerCase();
        
        return [...courses].sort((a, b) => {
            const aMatchesInterest = a.prediction?.courseCategory?.toLowerCase() === userInterest;
            const bMatchesInterest = b.prediction?.courseCategory?.toLowerCase() === userInterest;
            
            if (aMatchesInterest === bMatchesInterest) {
                return 0;
            }
            
            if (aMatchesInterest) {
                return -1;
            }
            
            return 1;
        });
    }, [courses]);

    return (
        <div className="grid grid-cols-1 overflow-hidden gap-4">
            <h2 className="text-xl font-semibold">
                Te recomendamos estos programas basandonos en lo que has visto.
            </h2>
            <Carousel
                opts={{
                    align: "start"
                }}
            >
                <CarouselContent>
                    {loading ? (
                        Array(10).fill(0).map((_, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 2xl:basis-1/4">
                                <div className="p-1 h-full">
                                    <CourseSkeleton 
                                        optionsEnable={false}
                                    />
                                </div>
                            </CarouselItem> 
                        ))
                    ) : (
                        ordenedCourses.map(course => (
                            <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/3 2xl:basis-1/4">
                                <div className="p-1 h-full">
                                    <Course
                                        course={course}
                                        optionsEnable={false}
                                        className="h-full"
                                    />
                                </div>
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
            </Carousel>
        </div>
    )
}

export default DashboardHistoryRecomendations;