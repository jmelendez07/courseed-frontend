import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Eye, TrendingDown } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

interface Course {
  id: number
  title: string
  instructor: string
  category: string
  rating: number
  views: number
  image: string
  isCreatedByUser: boolean
  viewsDecline?: number
  issues?: string[]
}

interface CourseCarouselProps {
  courses: Course[]
  type: "top" | "unwatched" | "poor"
}

function DashboardCourseCarousel({ courses, type }: CourseCarouselProps) {
    return (
        <Carousel className="w-full">
            <CarouselContent>
                {courses.map((course) => (
                    <CarouselItem key={course.id} className={`md:basis-1/2 lg:basis-1/3 ${type === 'top' && '2xl:basis-1/4'}`}>
                        <div className="p-1 h-full">
                            <Card className="h-full">
                                <CardHeader className="p-0">
                                    <div className="relative">
                                        <img
                                            src="https://picsum.photos/200"
                                            alt={course.title}
                                            className="w-full h-[150px] object-cover rounded-t-lg"
                                        />
                                        <div className="absolute top-2 right-2">
                                            {type === "top" && (
                                                <Badge className="bg-green-50 text-green-700">
                                                    <Star className="mr-1 h-3 w-3" fill="currentColor" />
                                                    {course.rating}
                                                </Badge>
                                            )}
                                            {type === "unwatched" && (
                                                <Badge variant="destructive">
                                                    <TrendingDown className="mr-1 h-3 w-3" />-{course.viewsDecline}%
                                                </Badge>
                                            )}
                                            {type === "poor" && (
                                                <Badge variant="destructive">
                                                    <Star className="mr-1 h-3 w-3" />
                                                    {course.rating}
                                                </Badge>
                                            )}
                                        </div>
                                        {course.isCreatedByUser && (
                                            <div className="absolute top-2 left-2">
                                                <Badge variant="secondary">Tu curso</Badge>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-sm line-clamp-1">{course.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{course.instructor}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <Badge variant="outline" className="text-xs">
                                            {course.category}
                                        </Badge>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <Eye className="h-3 w-3 mr-1" />
                                            {course.views.toLocaleString()}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    {course.isCreatedByUser && (
                                        <Button variant="outline" size="sm" className="w-full">
                                            {type === "top" ? "Ver estadísticas" : "Mejorar curso"}
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}

export default DashboardCourseCarousel;