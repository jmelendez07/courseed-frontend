import PredictionInterface from "./prediction";
import ProfileInterface from "./profile";

interface UserInterface {
    id: string | null | undefined;
    email: string;
    roles?: string[];
    academicLevel?: string;
    sex?: string;
    birthdate?: string;
    createdAt?: string;
    updatedAt?: string;
    reviews?: number;
    views?: number;
    profile?: ProfileInterface;
    image?: string;
    prediction?: PredictionInterface;
}

export default UserInterface;