import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface CourseSkeletonProps {
    className?: string
    optionsEnable?: boolean
}

function CourseSkeleton({ className, optionsEnable = false }: CourseSkeletonProps) {
    return (
        <Card
            className={`
                flex flex-col rounded-lg hover:shadow-lg transition-shadow duration-300 
                ${className}
            `}
        >
            <div className="relative">
                <div className="w-full h-[200px] bg-muted animate-pulse rounded-t-lg" />

                <div className={`absolute top-2 ${optionsEnable ? "left-2" : "right-2"}`}>
                    <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                </div>

                {optionsEnable && (
                    <div className="absolute top-2 right-2">
                        <div className="h-8 w-8 bg-muted animate-pulse rounded-md" />
                    </div>
                )}
            </div>

            <CardHeader className="space-y-1 py-3">
                <div className="h-6 w-full bg-muted animate-pulse rounded-md" />
            </CardHeader>

            <CardContent className="flex-grow space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="flex items-start gap-2">
                        <div className="size-5 min-w-5 bg-muted animate-pulse rounded-md" />
                        <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
                    </div>

                    <div className="flex items-start gap-2">
                        <div className="size-5 min-w-5 bg-muted animate-pulse rounded-md" />
                        <div className="h-4 w-28 bg-muted animate-pulse rounded-md" />
                    </div>
                </div>

                <div className="flex flex-wrap justify-between gap-x-2 gap-y-1">
                    <div className="h-6 w-24 bg-muted animate-pulse rounded-md" />

                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-muted animate-pulse rounded-full" />
                        ))}
                        <div className="h-4 w-8 bg-muted animate-pulse rounded-md ml-1" />
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
            </CardFooter>
        </Card>
    )
}

export default CourseSkeleton

