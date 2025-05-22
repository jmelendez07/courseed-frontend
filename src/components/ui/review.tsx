import ReviewInterface from "@/interfaces/review";
import { Card, CardContent, CardHeader } from "./card";
import { Avatar, AvatarFallback } from "./avatar";
import { Edit, MoreVertical, Star, Trash2 } from "lucide-react";
import React from "react";
import dayjs from "dayjs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";

interface ReviewProps {
    review: ReviewInterface;
    optionsEnabled?: boolean;
    handleEdit?: (review: ReviewInterface) => void;
	handleDelete?: (review: ReviewInterface) => void;
    className?: string;
}

function Review({ review, optionsEnabled = false, handleEdit, handleDelete, className }: ReviewProps) {

    const [optionsOpen, setOptionsOpen] = React.useState<boolean>(false);

    const getName = React.useCallback(() => {
        const name = review.user.email.split('@')[0];
        if (name) {
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return '';
    }, [review.user.email]);

    return (
        <Card
            className={`flex flex-col transition-shadow duration-300 ease-in-out hover:shadow-lg ${className}`}
        >
            <CardHeader className="flex items-start flex-row justify-between">
                <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>{review.user.email.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">{getName()}</p>
                        <p className="text-xs text-muted-foreground">{review.user.email}</p>
                    </div>
                </div>
                {optionsEnabled && (
					<DropdownMenu open={optionsOpen} onOpenChange={setOptionsOpen}>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0 min-w-8">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => {
								if (handleEdit) {
                                    handleEdit(review);
                                    setOptionsOpen(false);
                                }
							}}>
								<Edit className="mr-2 h-4 w-4" />
								<span>Editar</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => {
								if (handleDelete) {
                                    handleDelete(review);
                                    setOptionsOpen(false);
                                }
							}}>
								<Trash2 className="mr-2 h-4 w-4" />
								<span>Eliminar</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
            </CardHeader>
            <CardContent>
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, index) => (
                        <Star
                            key={index}
                            className={`h-5 w-5 ${index < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                    ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-4">{review.content}</p>
                <p className="text-xs text-muted-foreground">
                    {dayjs(review.createdAt).format("LLL")}
                </p>
            </CardContent>
        </Card>
    );
}

export default Review;