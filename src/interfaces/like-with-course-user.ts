import CourseInterface from "./course";
import UserInterface from "./user";

interface LikeWithCourseUser {
    id: string;
    createdAt: string;
    user: UserInterface;
    course:CourseInterface;
}

export default LikeWithCourseUser;