import React from "react";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { LoaderCircle, Search } from "lucide-react";
import { Button } from "./ui/button";
import useCourses from "@/hooks/useCourses";
import { Link } from "react-router-dom";

function DialogCourses() {
    const [open, setOpen] = React.useState<boolean>(false);
    const courseHook = useCourses({ isVisibleParam: false });

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open);
                courseHook.setIsVisible(true);
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, []);

    return (
        <div className="flex items-center gap-2">
            <Button size="icon" onClick={() => {
                setOpen(true);
                courseHook.setIsVisible(true);
            }}>
                <Search />
            </Button>
            <p className="text-sm text-gray-600 hidden lg:block">
                Presiona{" "}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-gray-100 dark:bg-zinc-950 border dark:border-0 px-1.5 font-mono text-[10px] font-medium opacity-100">
                    <span className="text-xs">⌘ K</span>
                </kbd>
            </p>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Buscar por titulo, descripción, duración..." />
                <CommandList>
                    {(courseHook.loading && courseHook.params.pageNumber === 0)  ? (
                        <div className="w-full h-40 flex items-center justify-center">
                            <LoaderCircle className="animate-spin text-zinc-400 dark:text-white" />
                        </div>
                    ) : (
                        <CommandEmpty>No hay resultados.</CommandEmpty>
                    )}
                    {courseHook.courses.map(course => (
                        <CommandItem asChild key={course.id} className="cursor-pointer">
                            <Link to={`/educacion/${course.id}`}>
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="size-10 object-cover rounded-sm"
                                />
                                <span>{course.title}</span>
                            </Link>
                        </CommandItem>
                    ))}
                    <CommandSeparator />
                    {(!courseHook.isLastPage && !courseHook.loading) && (
                        <CommandItem>
                            <span
                                className="w-full text-center"
                                onClick={() => courseHook.setParams({
                                    ...courseHook.params,
                                    pageNumber: courseHook.params.pageNumber + 1
                                })}
                            >
                                ...
                            </span>
                        </CommandItem>
                    )}
                </CommandList>
            </CommandDialog>
        </div>
    );
}

export default DialogCourses;