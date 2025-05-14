import CourseInterface from "./course";
import UserInterface from "./user";

interface ReactionInterface {
    id: string;
    user: UserInterface;
    course: CourseInterface;
    type: string;
    createdAt: string;
}

export default ReactionInterface;