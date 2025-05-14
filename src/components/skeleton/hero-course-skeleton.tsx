import { Skeleton } from "@/components/ui/skeleton"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const HeroCourseSkeleton = () => {
    return (
        <section className="py-12 flex justify-center">
            <div className="w-full grid items-start px-4 md:px-8 xl:px-12 2xl:px-16 gap-10 lg:grid-cols-2 lg:gap-20">
                <div
                    className="w-full mx-auto flex flex-col items-center text-center md:ml-auto
                    lg:items-start lg:text-left top-0 h-fit lg:sticky"
                >
                    <div className="my-6 w-full">
                        <Skeleton className="h-16 w-full max-w-xl mb-3" />
                        <Skeleton className="h-16 w-full max-w-xl mb-3" />
                        <Skeleton className="h-16 w-3/4 max-w-xl" />
                    </div>

                    <div className="mb-8 w-full max-w-xl">
                        <Skeleton className="h-8 w-full mb-3" />
                        <Skeleton className="h-8 w-full mb-3" />
                        <Skeleton className="h-8 w-3/4" />
                    </div>

                    <div className="mb-12 flex w-full flex-col items-center gap-4 sm:flex-row">
                        <span className="inline-flex items-center -space-x-4">
                            {[...Array(3)].map((_, index) => (
                                <Skeleton key={index} className="size-14 rounded-full border" />
                            ))}
                        </span>

                        <div>
                            <div className="flex items-center gap-1 justify-center sm:justify-start">
                                {[...Array(5)].map((_, index) => (
                                    <Skeleton key={index} className="size-6" />
                                ))}
                            </div>
                            <Skeleton className="h-5 w-40 mt-2" />
                        </div>

                        <span className="inline-flex items-center -space-x-4">
                            {[...Array(3)].map((_, index) => (
                                <Skeleton key={index} className="size-12 rounded-full" />
                            ))}
                        </span>
                    </div>

                    <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start sm:items-center">
                        <Skeleton className="h-12 w-full sm:w-40" />
                        <Skeleton className="h-12 w-full sm:w-48" />
                        <Skeleton className="h-12 w-20 px-1 hidden sm:block" />
                    </div>
                </div>

                <div className="flex flex-col gap-12 md:gap-20">
                    <div className="flex bg-muted">
                        <Skeleton className="min-h-[350px] max-h-[600px] w-full rounded-md lg:h-[600px] lg:max-h-[800px]" />
                    </div>

                    <section className="pt-12">
                        <div className="text-center lg:text-left">
                            <Skeleton className="h-10 w-48 mb-6" />
                        </div>
                        <div className="mx-auto flex flex-col">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="flex items-center justify-between border-b py-6">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton
                                        className={cn(
                                            buttonVariants({
                                                variant: "outline",
                                                size: "sm",
                                            }),
                                            "pointer-events-none rounded-full h-8 w-24",
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="py-12">
                        <div className="text-center lg:text-left">
                            <Skeleton className="h-10 w-36 mb-6" />
                        </div>
                        <div className="mx-auto flex flex-col">
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="pt-6 flex">
                                    <Skeleton className="size-5 min-w-5 min-h-5 mr-1 mt-1" />
                                    <Skeleton className="h-6 w-full" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </section>
    )
}

export { HeroCourseSkeleton }

