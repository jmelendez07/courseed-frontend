import CourseInterface from "@/interfaces/course";
import { Gallery } from "./ui/gallery";
import React from "react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";

interface ResponseProps {
    content: CourseInterface[];
    last: boolean;
    empty: boolean;
    totalElements: number;
}

function WorkShopsGallery() {
    const ref = React.useRef<HTMLDivElement>(null);
    const [courses, setCourses] = React.useState<CourseInterface[]>([]);
    const [isVisible, setIsVisible] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [ref.current]);

    React.useEffect(() => {
        if (!isVisible) return;
        setLoading(true);

        axios.get(APIS.COURSES_BY_TYPE, {
            params: {
                type: "seminario",
                page: 0,
                size: 8,
            }
        })
            .then((response: AxiosResponse<ResponseProps>) => {
                setCourses(response.data.content);
            })
            .catch(() => {
                setCourses([]);
            })
            .finally(() => setLoading(false));
    }, [isVisible]);
    
    return (
        <Gallery 
            ref={ref}
            heading="Seminarios 📚"
            url="/educacion"
            linkText="Descubre todos los seminarios que ofrecemos."
            items={courses}
            loading={loading}
        />
    )
}

export default WorkShopsGallery;