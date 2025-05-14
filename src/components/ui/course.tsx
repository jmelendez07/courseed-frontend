import { ArrowUpRight, CalendarClock, Clipboard, Edit, GraduationCap, MoreVertical, RefreshCcw, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CourseInterface from "@/interfaces/course";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Link } from "react-router-dom";
import LazyImage from "@/components/ui/LazyImage";
import React from "react";

interface CourseComponentProps {
	className?: string;
	course: CourseInterface;
	optionsEnable: boolean;
	handleEdit?: (course: CourseInterface) => void;
	handleDelete?: (course: CourseInterface) => void;
}

function Course({ className, course, optionsEnable, handleEdit, handleDelete }: CourseComponentProps) {

	const [isReverse, setIsReverse] = React.useState<boolean>(false);
	const [optionsOpen, setOptionsOpen] = React.useState<boolean>(false);

	const getAvgRating = (): number => {
		if (!course.reviews || course.reviews.length === 0) {
			return 0;
		}

		const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
		return totalRating / course.reviews.length;
	}

	const getFormatPrice = (): string => {

		if (course.price === 0) return "Gratuito";

		return course.price
			? course.price.toLocaleString('es-CO', {
				style: 'currency',
				currency: 'COP',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			})
			: "Sin información";
	}

	const copyPrediction = () => {
		if (course.prediction) {
			const wrapWithQuotes = (value: string): string => {
				return value.includes(" ") ? `'${value}'` : value;
			};
	
			const predictionMessage = `${wrapWithQuotes(course.prediction.userInterest)},${course.prediction.userAvailableTime},${course.prediction.budget},${wrapWithQuotes(course.prediction.platformPreference)},${wrapWithQuotes(course.prediction.courseModality)},${course.prediction.courseDuration},${course.prediction.coursePrice},${wrapWithQuotes(course.prediction.courseCategory)},${course.prediction.courseRatingAvg},${wrapWithQuotes(course.prediction.courseMaxReaction)},${course.prediction.courseVisits},${course.prediction.courseReviewsCount},?`;
	
			navigator.clipboard.writeText(predictionMessage.trim())
				.then(() => {
					alert("Predicción copiada al portapapeles.");
				})
				.catch((err) => {
					console.error("Error al copiar al portapapeles:", err);
					alert("No se pudo copiar al portapapeles.");
				});
		}
	}

	return (
		<Card
			className={`
				flex flex-col rounded-lg hover:shadow-lg transition-shadow duration-300 ${className}
			`}
		>
			{ (isReverse && course.prediction) ? (
				<>
					<CardHeader>
						<div className="grid grid-cols-[1fr_auto] gap-2 items-center">
							<CardTitle className="text-xl truncate">Datos de la predicción</CardTitle>
							<div className="flex items-center gap-1">
								<Button type="button" onClick={() => setIsReverse(false)} className="w-6 h-6 p-0 bg-gray-100 text-gray-800 hover:bg-gray-200">
									<RefreshCcw className="size-4" />
								</Button>
								<Button type="button" onClick={() => copyPrediction()} className="w-6 h-6 p-0 bg-gray-100 text-gray-800 hover:bg-gray-200">
									<Clipboard className="size-4" />
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent className="grid grid-cols-1 gap-1">
						<div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
							<p>user_interest</p>
							<b>{ course.prediction.userInterest }</b>
						</div>
						<div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
							<p>user_availableTime</p>
							<b>{ course.prediction.userAvailableTime }</b>
						</div>
						<div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
							<p>budget</p>
							<b>{ course.prediction.budget }</b>
						</div>
						<div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
							<p>platform_preference</p>
							<b>{ course.prediction.platformPreference }</b>
						</div>
						<div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
							<p>course_modality</p>
							<b>{ course.prediction.courseModality }</b>
						</div>
						<div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
							<span>course_duration</span>
							<b>{ course.prediction.courseDuration }</b>
						</div>
						<div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
							<p>course_price</p>
							<b>{ course.prediction.coursePrice }</b>
						</div>
						<div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
							<p>course_category</p>
							<b>{ course.prediction.courseCategory }</b>
						</div>
						<div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
							<p>course_rating_avg</p>
							<b>{ course.prediction.courseRatingAvg }</b>
						</div>
						<div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
							<p>course_max_reaction</p>
							<b>{ course.prediction.courseMaxReaction }</b>
						</div>
						<div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
							<p>course_visits</p>
							<b>{ course.prediction.courseVisits }</b>
						</div>
						<div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
							<p>course_reviews_count</p>
							<b>{ course.prediction.courseReviewsCount }</b>
						</div>
					</CardContent>
					<CardFooter className="grid grid-cols-[1fr_auto] items-center border-t py-4 justify-between gap-2">
						<p>Recomendado: {course.prediction.courseRecomended ? "true" : "false"}</p>
						<b>{ course.prediction.confidence }</b>
					</CardFooter>
				</>
			) : (
				<>
					<div className="relative">
						<LazyImage 
							src={course.image ?? ""} 
							className="w-full h-[200px] object-cover rounded-t-lg"
						/>
						<Badge variant="secondary" className={`absolute top-2 max-w-[220px] ${optionsEnable ? "left-2" : "right-2"}`}>
							<p className="truncate">{course.category.name}</p>
						</Badge>
						{course.prediction && (
							<Button type="button" onClick={() => setIsReverse(true)} className="absolute top-2 left-2 w-6 h-6 p-0 bg-gray-100 text-gray-800 hover:bg-gray-200">
								<RefreshCcw className="size-4" />
							</Button>
						) }
						{optionsEnable && (
							<DropdownMenu open={optionsOpen} onOpenChange={setOptionsOpen}>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="absolute top-2 right-2 h-8 w-8 p-0 bg-gray-100 text-gray-800 hover:bg-gray-200">
										<MoreVertical className="h-4 w-4" />
										<span className="sr-only">Mostrar Opciones</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => {
										if (handleEdit) {
											handleEdit(course);
											setOptionsOpen(false);
										}
									}}>
										<Edit className="mr-2 h-4 w-4" />
										<span>Editar</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => {
										if (handleDelete) {
											handleDelete(course);
											setOptionsOpen(false);
										}
									}}>
										<Trash2 className="mr-2 h-4 w-4" />
										<span>Eliminar</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
					<CardHeader className="space-y-1 py-3">
						<CardTitle className="text-xl line-clamp-3">{course.title}</CardTitle>
					</CardHeader>
					<CardContent className="flex-grow space-y-4 flex flex-col justify-between">
						<div className="space-y-4">
							<p className="text-sm flex items-start gap-2">
								<CalendarClock className="size-5 min-w-5" />
								<span className="text-gray-600 dark:text-gray-300 line-clamp-1">{course.duration}</span>
							</p>
							<p className="text-sm flex items-start gap-2">
								<GraduationCap className="size-5 min-w-5" />
								<span className="text-gray-600 dark:text-gray-300 line-clamp-1">{course.modality}</span>
							</p>
						</div>
						<div className="flex flex-wrap justify-between gap-x-2 gap-y-1">
							<p className="text-lg font-bold">
								{getFormatPrice()}
							</p>
							<div className="flex items-center gap-1">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star
										key={i}
										className={`w-4 h-4 ${i < getAvgRating() ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
									/>
								))}
								<span className="text-sm text-gray-600 ml-1">({course.reviews ? course.reviews.length : 0})</span>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button asChild className="w-full group">
							<Link
								to={`/educacion/${course.id}`} 
							>
								Ver Información
								<ArrowUpRight className="transition-transform group-hover:translate-x-1" />
							</Link>
						</Button>
					</CardFooter>
				</>
			) }
		</Card>
	);
}

export default Course;