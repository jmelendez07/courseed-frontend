import { ArrowUpRight } from "lucide-react";
import React from "react";

import { Link } from "react-router-dom";
import Course from "./course";
import CourseInterface from "@/interfaces/course";
import FadeItem from "./fade-item";
import { useScroll, useTransform, motion } from "motion/react";
import CourseSkeleton from "../skeleton/course-skeleton";

interface GalleryCoursesProps {
    heading: string;
    linkText: string;
    url: string;
    items: CourseInterface[];
    loading?: boolean;
}

const Gallery = React.forwardRef<HTMLDivElement, GalleryCoursesProps> (
    ({
    heading,
    url,
    linkText,
    items,
    loading,
}, ref) => {

    const targetRef = React.useRef(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const [containerWidth, setContainerWidth] = React.useState(0);
    const padding = useTailwindPadding();

    React.useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.getBoundingClientRect().width);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [containerRef.current, items.length]);

    const x = useTransform(scrollYProgress, [0, 1], [0, -containerWidth - (padding * 2) + document.documentElement.clientWidth]);

    return (
        <section ref={targetRef} className="relative h-[300vh]"> 
            <div ref={ref} className="sticky top-0 flex h-screen flex-col justify-center items-start overflow-hidden px-4 md:px-8 xl:px-12 2xl:px-16">
                <div className="mb-4 xl:mb-10 w-full">
                    <FadeItem>
                        <h2 className="text-3xl font-semibold md:text-4xl 2xl:text-5xl xl:mb-6">
                            {heading}
                        </h2>
                    </FadeItem>
                    <FadeItem>
                        <Link
                            to={url}
                            className="group flex items-center gap-1 text-sm font-medium md:text-base lg:text-lg"
                        >
                            {linkText}
                            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </FadeItem>
                </div>
                <motion.div style={{ x }}>
                    <div ref={containerRef} className="flex gap-4">
                        { loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <CourseSkeleton 
                                    key={index} 
                                    optionsEnable={false} 
                                    className="w-[calc(100vw-2rem)] sm:w-96 h-full"
                                />
                            ))
                        ) : (
                            items.map((course) => (
                                <FadeItem key={course.id}>
                                    <Course 
                                        course={course}
                                        optionsEnable={false}
                                        className="w-[calc(100vw-2rem)] sm:w-96 h-full"
                                    />
                                </FadeItem>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
});

function useTailwindPadding() {
    const [padding, setPadding] = React.useState(16);

    React.useEffect(() => {
        const updatePadding = () => {
            const width = window.innerWidth;

            if (width >= 1536) setPadding(64);
            else if (width >= 1280) setPadding(48);
            else if (width >= 768) setPadding(32);
            else setPadding(16);
        };

        updatePadding();
        window.addEventListener("resize", updatePadding);
        return () => window.removeEventListener("resize", updatePadding);
    }, []);

    return padding;
}

export { Gallery };
