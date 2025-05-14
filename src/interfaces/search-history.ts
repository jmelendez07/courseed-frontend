import CourseInterface from "./course";
import UserInterface from "./user";

interface SearchHistoryInterface {
    id: string;
    search: string;
    user: UserInterface;
    createdAt: string;
    courses?: CourseInterface[]; 
}

export default SearchHistoryInterface;