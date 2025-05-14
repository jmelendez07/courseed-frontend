interface PredictionInterface {
    userInterest: string;
    userAvailableTime: number;
    budget: number;
    platformPreference: string;
    courseModality: string;
    courseDuration: number;
    coursePrice: number;
    courseCategory: string;
    courseRatingAvg: number;
    courseMaxReaction: string;
    courseVisits: number;
    courseReviewsCount: number;
    courseRecomended: boolean;
    confidence: string;
}

export default PredictionInterface;