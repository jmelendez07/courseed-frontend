import UserInterface from "./user";

interface ReviewInterface {
    id: string;
    rating: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: UserInterface;
}

export default ReviewInterface;