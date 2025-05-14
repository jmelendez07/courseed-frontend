import { HeroCourseSkeleton } from "@/components/skeleton/hero-course-skeleton";
import { BlogReviews } from "@/components/ui/blog-reviews";
import { Footer } from "@/components/ui/footer";
import { HeroCourse } from "@/components/ui/hero-course";
import { Navbar } from "@/components/ui/navbar";
import useCourse from "@/hooks/useCourse";
import DialogProvider from "@/providers/DialogProvider";
import HeadProvider from "@/providers/HeadProvider";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function Course() {
    const params = useParams();
    const courseHook = useCourse({ id: params.id });
    const navigate = useNavigate();
    const BlogReviewsRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        if (courseHook.course === null) {
            navigate("/404", { replace: true });
        }
    }, [courseHook.course]);

    const location = useLocation();
    React.useLayoutEffect(() => {
        document.documentElement.scrollTo({ top:0, left:0, behavior: "smooth" });
    }, [location.pathname]);

    return (
        <DialogProvider>
            <HeadProvider title={`Courseed ${courseHook.course && '| ' + courseHook.course.title}`} />
            <Navbar />
            {courseHook.course ? (
                <>
                    <HeroCourse 
                        course={courseHook.course}
                        handlePrimaryButton={() => {
                            if (BlogReviewsRef.current) BlogReviewsRef.current.scrollIntoView({ behavior: 'smooth' });
                        }}
                        handleCreatedReaction={(reaction) => courseHook.handleCreatedReaction(reaction)}
                        handleUpdatedReaction={(reaction) => courseHook.handleUpdatedReaction(reaction)}
                        handleDeletedReaction={(id) => courseHook.handleDeletedReaction(id)}
                        handleCreatedView={(view) => courseHook.newView(view)}
                    />
                    <BlogReviews
                        ref={BlogReviewsRef}
                        course={courseHook.course}
                        tagline = "Opiniones compartidas"
                        heading = "Reseñas"
                        newReview = {courseHook.newReview}
                        updateReview = {courseHook.updateReview}
                        deleteReview = {courseHook.deleteReview}
                        description = "Conoce las valoraciones de otros participantes y toma una decisión informada. Las reseñas te permiten conocer tanto los aspectos positivos como las áreas de mejora que los estudiantes han experimentado, lo que te ayudará a tener una visión completa del curso."
                    />
                </>
            ) : (
                <HeroCourseSkeleton />
            )}
            <Footer />
        </DialogProvider>
    );
}

export default Course;