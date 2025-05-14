import CourseInterface from "@/interfaces/course";
import UserInterface from "@/interfaces/user";
import ReviewInterface from "@/interfaces/review";

interface ReviewCourseUserInterface extends ReviewInterface {
    user: UserInterface,
    course: CourseInterface
}

export default ReviewCourseUserInterface;