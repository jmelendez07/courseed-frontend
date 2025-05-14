import CourseInterface from "./course";
import UserInterface from "./user";

interface LikeInterface {
    id: string;
    user?: UserInterface;
    course?: CourseInterface;
    createdAt: string;
}

export default LikeInterface;