import { ArrowUpRight, BookMarked, CalendarClock, Check, DollarSign, Eye, Landmark, MessageSquareText, SquareStack, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CourseInterface from "@/interfaces/course";
import { useAuth } from "@/providers/AuthProvider";
import React from "react";
import ConfettiExplosion from 'react-confetti-explosion';
import FadeItem from "./fade-item";
import REACTION from "@/enums/reaction";
import ReactionInterface from "@/interfaces/reaction";
import useReaction from "@/hooks/useReaction";
import useView from "@/hooks/useView";
import ViewInterface from "@/interfaces/view";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface HeroCourseProps {
    course: CourseInterface;
    handlePrimaryButton?: () => void;
    handleCreatedReaction: (reaction: ReactionInterface) => void;
    handleUpdatedReaction: (reaction: ReactionInterface) => void;
    handleDeletedReaction: (id: string) => void;
    handleCreatedView: (view: ViewInterface) => void;
}

const HeroCourse = ({
    course,
    handlePrimaryButton,
    handleCreatedReaction,
    handleUpdatedReaction,
    handleDeletedReaction,
    handleCreatedView
}: HeroCourseProps) => {

    const authHook = useAuth();
    const reactionHook = useReaction();
    const viewHook = useView({ cId: course.id });
    const [isExploding, setIsExploding] = React.useState<boolean>(false);

    function getAverageRating(): number {
        if (!course.reviews) return 0;
        const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
        return course.reviews.length > 0 ? totalRating / course.reviews.length : 0;
    }

    const getFormatPrice = (): string => {

        if (course.price === 0) return "Gratuito";

        return course.price
            ? course.price.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).replace("$", "").trim() + " COP"
            : "Sin información";
    }

    const options = [
        {
            "icon": Landmark,
            "name": "Institución",
            "value": course.institution.name
        },
        {
            "icon": SquareStack,
            "name": "Facultad",
            "value": course.category.name
        },
        {
            "icon": CalendarClock,
            "name": "Duración",
            "value": course.duration + " horas"
        },
        {
            "icon": BookMarked,
            "name": "Modalidad",
            "value": course.modality
        },
        {
            "icon": DollarSign,
            "name": "Precio",
            "value": getFormatPrice()
        }
    ];

    const handleReaction = React.useCallback(async (type: keyof typeof REACTION) => {
        if (!authHook?.user) return;

        setIsExploding(false);
        const currentReaction = course.reactions.find(reaction => reaction.user.id === authHook?.user?.id);

        if (currentReaction?.type === type) {
            if (await reactionHook.handleDelete(currentReaction.id)) handleDeletedReaction(currentReaction.id);
        } else if (currentReaction) {
            const updatedReaction = await reactionHook.handleUpdate(course.id, type);
            if (updatedReaction) handleUpdatedReaction(updatedReaction);
        } else {
            const createdReaction = await reactionHook.handleCreate(course.id, type);
            if (createdReaction) {
                if (REACTION[createdReaction.type as keyof typeof REACTION] === REACTION.GOOD) setIsExploding(true);
                handleCreatedReaction(createdReaction);
            }
        }
    }, [reactionHook, authHook, course.reactions]);

    const getReactionCount = React.useCallback(() => {
        return Object.keys(REACTION)
            .map(type => ({
                type: type as keyof typeof REACTION,
                total: course.reactions.filter(reaction => reaction.type === type).length
            }))
    }, [course.reactions, authHook?.user]);

    const handleCreateView = React.useCallback(async () => {
        if (!authHook?.user || course.views.some(view => view.user.id === authHook.user?.id)) return;
        const createdView = await viewHook.handleCreate();
        if (createdView) handleCreatedView(createdView);
    }, [authHook?.user]);

    return (
        <section className="py-12 flex justify-center">
            <div className="w-full grid items-start px-4 md:px-8 xl:px-12 2xl:px-16 gap-10 lg:grid-cols-2 lg:gap-20">
                <div
                    className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl 
                    lg:items-start lg:text-left top-0 h-fit lg:sticky"
                >
                    <FadeItem>
                        <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl xl:text-7xl">
                            {course.title}
                        </h1>
                    </FadeItem>
                    <FadeItem>
                        <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl text-justify line-clamp-3">
                            {course.description}
                        </p>
                    </FadeItem>
                    <div className="mb-12 flex w-fit flex-col items-center gap-4 sm:flex-row">
                        <span className="inline-flex items-center -space-x-4">
                            {course.reviews && course.reviews.slice(0, 3).map((review, index) => (
                                <FadeItem key={index} >
                                    <Avatar className="size-12 border dark:border-0">
                                        <AvatarFallback className="rounded-lg">{review.user.email.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </FadeItem>
                            ))}
                        </span>
                        <div>
                            <div className="flex items-center gap-1 justify-center sm:justify-start">
                                {[...Array(5)].map((_, index) => (
                                    <FadeItem key={index}>
                                        <Star
                                            className={`size-5 ${index < getAverageRating()
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'fill-gray-300 text-gray-300'
                                                }`}
                                        />
                                    </FadeItem>
                                ))}
                            </div>
                            <FadeItem>
                                <p className="text-left font-medium text-muted-foreground">
                                    {(course.reviews && course.reviews.length > 0) ? (
                                        <>{course.reviews.length} Reseñas de Usuarios</>
                                    ) : (
                                        <>Aun no hay reseñas</>
                                    )}
                                </p>
                            </FadeItem>
                        </div>
                        <span className="inline-flex items-center -space-x-4">
                            {getReactionCount().map((reaction, index) => (
                                <FadeItem
                                    key={index}
                                    className={`
                                        text-4xl rounded-full bg-white dark:bg-zinc-800 drop-shadow-lg py-1 flex items-center justify-center
                                        ${reaction.total > 0 ? 'group' : 'grayscale'}
                                        ${authHook?.user && 'cursor-pointer hover:bg-zinc-100'}
                                    `}
                                    onClick={() => handleReaction(reaction.type)}
                                >
                                    {REACTION[reaction.type]}
                                    <span className="text-3xl opacity-0 group-hover:opacity-100 hidden group-hover:inline-block group-hover:mr-4 transition">
                                        {reaction.total}
                                    </span>
                                </FadeItem>
                            ))}
                            {isExploding && <ConfettiExplosion />}
                        </span>
                    </div>
                    <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start sm:items-center">
                        <FadeItem>
                            <Button onClick={() => {
                                if (handlePrimaryButton) handlePrimaryButton()
                            }} className="w-full sm:w-auto">
                                Reseñas
                                <MessageSquareText />
                            </Button>
                        </FadeItem>
                        <FadeItem>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={handleCreateView}
                            >
                                <a
                                    href={course.url}
                                    target="_blank"
                                >
                                    Visitar Sitio Oficial
                                    <ArrowUpRight className="ml-2 size-4" />
                                </a>
                            </Button>
                        </FadeItem>
                        {course.views.length > 0 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" className="cursor-default px-1">
                                            <FadeItem className="inline-flex items-center gap-2 text-gray-500 dark:text-white justify-center text-sm">
                                                <Eye />
                                                {course.views.length}
                                            </FadeItem>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Usuarios que han visto este programa</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-12 md:gap-20">
                    <FadeItem className="flex bg-muted">
                        <img
                            src={course.image}
                            alt={course.title}
                            className="min-h-[350px] max-h-[600px] w-full rounded-md object-cover lg:h-[600px] lg:max-h-[800px]"
                        />
                    </FadeItem>
                    <section className="pt-12">
                        <div className="text-center lg:text-left">
                            <FadeItem>
                                <h1 className="text-left text-3xl font-medium md:text-4xl">
                                    Caracteristicas
                                </h1>
                            </FadeItem>
                        </div>
                        <div className="mx-auto flex flex-col">
                            {options.map((option, index) => (
                                <FadeItem key={index}>
                                    <div
                                        className="flex items-center justify-between border-b py-6"
                                    >
                                        <p className="font-semibold inline-flex gap-2">
                                            <option.icon className="min-w-6" />
                                            {option.value}
                                        </p>
                                        <div
                                            className={cn(
                                                buttonVariants({
                                                    variant: "outline",
                                                    size: "sm",
                                                }),
                                                "pointer-events-none rounded-full text-wrap",
                                            )}
                                        >
                                            {option.name}
                                        </div>
                                    </div>
                                </FadeItem>
                            ))}
                        </div>
                    </section>
                    {course.contents.length > 0 && (
                        <section className="py-12">
                            <div className="text-center lg:text-left">
                                <FadeItem>
                                    <h1 className="text-left text-3xl font-medium md:text-4xl">
                                        Contenidos
                                    </h1>
                                </FadeItem>
                            </div>
                            <div className="mx-auto flex flex-col">
                                {course.contents.slice(0, 4).map((content, _) => (
                                    <FadeItem key={content.id}>
                                        <p className="pt-6 text-muted-foreground lg:text-xl inline-flex">
                                            <Check className="size-5 min-w-5 min-h-5 mr-1 mt-1" />
                                            <span className="line-clamp-3">{content.description}</span>
                                        </p>
                                    </FadeItem>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </section>
    );
};

export { HeroCourse };
