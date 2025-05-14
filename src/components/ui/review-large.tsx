import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";
import { ArrowUpRight, Edit, MoreVertical, Star, Trash2 } from "lucide-react";
import ReviewCourseUserInterface from "@/interfaces/review-course-user";
import { Avatar, AvatarFallback } from "./avatar";
import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";

interface ReviewComponentProps {
	review: ReviewCourseUserInterface;
	handleEdit?: (review: ReviewCourseUserInterface) => void;
	handleDelete?: (review: ReviewCourseUserInterface) => void;
	className?: String;
}

function ReviewLarge({ review, handleEdit, handleDelete, className }: ReviewComponentProps) {
	return (
		<Card
			className={`flex flex-col bg-white ease-in-out hover:shadow-lg transition-shadow duration-300 group ${className}`}
		>
			<CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
				<h2 className="text-lg font-semibold leading-tight">{review.course.title}</h2>
				{(handleDelete || handleEdit) ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0 min-w-8">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => {
								if (handleEdit) handleEdit(review);
							}}>
								<Edit className="mr-2 h-4 w-4" />
								<span>Editar</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => {
								if (handleDelete) handleDelete(review);
							}}>
								<Trash2 className="mr-2 h-4 w-4" />
								<span>Eliminar</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Button 
						className="px-2 transition-transform group-hover:translate-x-1"
						size="sm"
						asChild
					>
						<Link 
							to={`/educacion/${review.course.id}`}
							target="_blank"
						>
							<ArrowUpRight />
						</Link>
					</Button>
				)}
			</CardHeader>
			<CardContent>
				<div className="relative w-full overflow-hidden mb-2">
					<LazyImage 
						src={review.course.image ?? ""}
						className="w-full object-cover rounded-lg h-32 max-h-32 bg-zinc-100 dark:bg-zinc-900"
					/>
				</div>
				<p className="text-sm text-gray-600 mb-2 line-clamp-3">{review.content}</p>
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center text-xs text-gray-500 gap-2 overflow-hidden">
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarFallback className="rounded-full">{review.user.email.slice(0, 2).toUpperCase()}</AvatarFallback>
						</Avatar>
						<span className="truncate">{review.user.email}</span>
					</div>
					<div className="flex items-center mb-2">
						{[...Array(5)].map((_, index) => (
							<Star
								key={index}
								className={`h-5 w-5 min-w-5 ${index < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
							/>
						))}
					</div>
				</div>
				
			</CardContent>
		</Card>
	);
}

export default ReviewLarge;