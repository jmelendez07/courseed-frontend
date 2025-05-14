import React from "react";
import { Star } from "lucide-react";

interface RatinInputProps {
    rating: number;
    disabled?: boolean;
    setRating: (value: number) => void;
}

function RatingInput({ rating, disabled, setRating }: RatinInputProps) {
    const [hover, setHover] = React.useState<number>(0);

    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    className={`p-0
                        ${(hover || rating) >= star ? "text-yellow-400 hover:text-yellow-400/30" : "text-gray-300"}
                        ${disabled ? 'cursor-not-allowed': 'cursor-pointer'}
                    `}
                    onClick={() => {
                        if (!disabled) {
                            setRating(star);
                        }
                    }}
                    onMouseEnter={() => {
                        if (!disabled) {
                            setHover(star);
                        }
                    }}
                    onMouseLeave={() => {
                        if (!disabled) {
                            setHover(0);
                        }
                    }}
                    type="button"
                >
                    <Star className="size-5 fill-current" />
                </button>
            ))}
        </div>
    )
}

export default RatingInput;