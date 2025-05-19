import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useCourses from "@/hooks/useCourses";
import useInstitution from "@/hooks/useInstitution";
import { GraduationCap, LucideProps } from "lucide-react";
import { Link } from "react-router-dom";
import DialogCourses from "../dialog-courses";
import React from "react";
import FadeItem from "./fade-item";
import LazyImage from "./LazyImage";

interface HeroProps {
    heading?: string;
    description?: string;
    button?: {
        text: string;
        icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
        url: string;
    };
}

const Hero = ({
    heading = "Tu educación continua en un solo lugar.",
    description = "¡Bienvenido a CourSeed! Navega entre cursos, talleres y diplomados. Lleva tu educación al siguiente nivel.",
    button = {
        text: "Explorar Educación",
        icon: GraduationCap,
        url: "/educacion",
    },
}: HeroProps) => {

    const institutionHook = useInstitution({ size: 3 });
    const courseHook = useCourses({ size: 4, page: Math.floor(Math.random() * 21) });

    return (
        <section
            className="py-12 flex justify-center"
        >
            <div
                className="w-full px-4 md:px-8 xl:px-12 2xl:px-16"
            >
                <div className="flex flex-col items-center gap-8 md:flex-row">
                    <div className="flex-1">
                        <div className="flex flex-col gap-4 lg:gap-8">
                            <FadeItem>
                                <h1 className="max-w-[80%] text-4xl font-semibold leading-tight text-foreground lg:text-5xl xl:text-7xl">
                                    {heading}
                                </h1>
                            </FadeItem>
                            <FadeItem>
                                <p className="text-lg leading-relaxed text-muted-foreground xl:text-2xl">
                                    {description}
                                </p>
                            </FadeItem>
                        </div>
                        <FadeItem className="my-6 lg:my-10 flex items-center gap-2">
                            <div>   
                                <Button asChild size="lg">
                                    <Link to={button.url}>{button.text}<button.icon /></Link>
                                </Button>
                            </div>
                            <div>
                                <DialogCourses />
                            </div>
                        </FadeItem>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative flex -space-x-[1.5rem]">
                                {institutionHook.institutions.map((institution, index) => (
                                    <FadeItem key={index}>
                                        <Avatar
                                            key={index}
                                            className={`relative flex h-12 w-12 flex-shrink-0 rounded-full border border-gray-200 dark:border-0 object-cover`}
                                        >
                                            <AvatarImage src={institution.image ?? ''} />
                                            <AvatarFallback>
                                                {institution.name
                                                    ? institution.name.slice(0, 2).toUpperCase()
                                                    : 'UL'
                                                }
                                            </AvatarFallback>
                                        </Avatar>
                                    </FadeItem>
                                ))}
                            </div>
                            <div>
                                <FadeItem>
                                    <p className="mb-1 text-sm italic text-muted2-foreground">
                                        &quot;Cursos diseñados para tu éxito&quot;
                                    </p>
                                </FadeItem>
                                {institutionHook.institutions.length > 0 && (
                                    <FadeItem>
                                        <p className="text-sm font-medium text-muted2-foreground xl:max-w-[70%]">
                                            {institutionHook.institutions.map(i => i.name).join(", ")}.
                                        </p>
                                    </FadeItem>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex-1">
                        <div className="w-full">
                            <AspectRatio ratio={1 / 1} className="h-full w-full overflow-hidden">
                                <div
                                    className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[3.5%]"
                                >
                                    <div className="overflow-hidden rounded-[5.2%] bg-gray-100 dark:bg-zinc-950">
                                        {courseHook.courses.length > 0 && (
                                            <FadeItem
                                                className="h-full w-full"
                                            >
                                                <Link className="w-full h-full" to={`/educacion/${courseHook.courses[0].id}`}>
                                                    <LazyImage 
                                                        src={courseHook.courses[0].image ?? ""}
                                                        width={1100}
                                                        height={600}
                                                        className="object-cover h-full w-full object-center"
                                                    />
                                                </Link>
                                            </FadeItem>
                                        )}
                                    </div>
                                    <div className="relative overflow-hidden rounded-[5.2%] bg-gray-100 dark:bg-zinc-950">
                                        {courseHook.courses.length > 1 && (
                                            <div className="absolute left-[5%] top-1/2 w-[110%] max-w-[25rem] -translate-y-1/2 overflow-hidden rounded-md">
                                                <FadeItem>
                                                    <Link to={`/educacion/${courseHook.courses[1].id}`}>
                                                        <AspectRatio ratio={1.739130435 / 1}>
                                                            <LazyImage 
                                                                src={courseHook.courses[1].image ?? ""}
                                                                width={1100}
                                                                height={600}
                                                                className="size-full object-cover object-center"
                                                            />
                                                        </AspectRatio>
                                                    </Link>
                                                </FadeItem>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative overflow-hidden rounded-[5.2%] bg-gray-100 dark:bg-zinc-950">
                                        {courseHook.courses.length > 2 && (
                                            <div className="absolute left-[9%] top-[9%] w-[200%] max-w-[37.5rem] overflow-hidden rounded-md">
                                                <FadeItem>
                                                    <Link to={`/educacion/${courseHook.courses[2].id}`}>
                                                        <AspectRatio ratio={1.6 / 1}>
                                                            <LazyImage 
                                                                src={courseHook.courses[2].image ?? ""}
                                                                width={1100}
                                                                height={600}
                                                                className="size-full object-cover object-center"
                                                            />
                                                        </AspectRatio>
                                                    </Link>
                                                </FadeItem>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative overflow-hidden rounded-[5.2%] bg-gray-100 dark:bg-zinc-950">
                                        <FadeItem>
                                            <Link to={`/educacion/${courseHook.courses[3].id}`} className="relative left-[50%] top-[12%] w-[70%] max-w-[17.5rem] -translate-x-[50%]">
                                                <AspectRatio ratio={0.52 / 1}>
                                                    <img
                                                        src="https://shadcnblocks.com/images/block/mockups/phone-1.png"
                                                        alt=""
                                                        className="absolute z-20 w-full"
                                                    />
                                                    {courseHook.courses.length > 3 && (
                                                        <LazyImage 
                                                            src={courseHook.courses[3].image ?? ""}
                                                            width={1100}
                                                            height={600}
                                                            className="absolute z-10 w-full rounded-[16%] h-full object-cover"
                                                        />
                                                    )}
                                                </AspectRatio>
                                            </Link>
                                        </FadeItem>
                                    </div>
                                </div>
                            </AspectRatio>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Hero };