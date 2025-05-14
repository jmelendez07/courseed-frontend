import CategoryInterface from "./category";
import ContentInterface from "./content";
import InstitutionInterface from "./institution";
import LikeInterface from "./like";
import PredictionInterface from "./prediction";
import ReactionInterface from "./reaction";
import ReviewInterface from "./review";
import ViewInterface from "./view";

interface CourseInterface {
    id: string;
    url: string;
    title: string;
    image?: string;
    description?: string;
    prerequisites?: string;
    price?: number;
    duration?: string;
    modality?: string;
    category: CategoryInterface;
    institution: InstitutionInterface;
    contents: ContentInterface[];
    likes: LikeInterface[];
    reactions: ReactionInterface[];
    reviews: ReviewInterface[];
    views: ViewInterface[];
    prediction?: PredictionInterface;
}

export default CourseInterface;