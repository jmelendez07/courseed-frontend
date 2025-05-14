import REACTION from "@/enums/reaction";

interface ReactionCount {
    type: keyof typeof REACTION;
    total: number;
}

export default ReactionCount;