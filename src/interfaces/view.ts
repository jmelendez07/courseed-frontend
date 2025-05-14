import CourseInterface from "./course";
import UserInterface from "./user";

interface ViewInterface {
    id: string;
    user: UserInterface;
    course: CourseInterface;
    createdAt: string;
}

export default ViewInterface;