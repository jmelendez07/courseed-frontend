import CourseInterface from "@/interfaces/course";
import ViewInterface from "@/interfaces/view";
import { standardizeCategory } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import CategoryInterface from "@/interfaces/category";
import LazyImage from "../ui/LazyImage";
import { ArrowUpDown, DollarSign, Eye, MoreHorizontal, Star, Timer, Users } from "lucide-react";
import React from "react";
import ReviewInterface from "@/interfaces/review";
import ReactionInterface from "@/interfaces/reaction";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface RecomendedCoursesTableProps {
    title?: string;
    courses: CourseInterface[];
    className?: string;
    setSelectedCourse: (course: CourseInterface) => void;
}

function calculateAverageRating(reviews: ReviewInterface[]): number {
    if (!reviews || reviews.length === 0) {
        return 0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return totalRating / reviews.length;
}

function getMostPopularReaction(reactions: ReactionInterface[]): string {
    if (!reactions || reactions.length === 0) {
        return "Sin reacciones";
    }

    const reactionCounts = reactions.reduce((acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mostPopularType = Object.keys(reactionCounts).reduce((prev, current) => {
        return reactionCounts[current] > reactionCounts[prev] ? current : prev;
    });

    return mostPopularType || "Sin nombre";
}

function RecomendedCoursesTable({ title, courses, className, setSelectedCourse }: RecomendedCoursesTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const columns: ColumnDef<CourseInterface>[] = [
        {
            accessorKey: "title",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Titulo
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const title: string = row.getValue('title');
                const image: string = row.original.image ?? '';
                return (
                    <div className="flex items-center gap-2 pl-3.5 overflow-hidden">
                        <LazyImage
                            src={image}
                            width={128}
                            height={128}
                            className="!size-8 object-cover shrink-0 rounded-md"
                        />
                        <p className="truncate max-w-[240px]">{title}</p>
                    </div>
                );
            }
        },
        {
            accessorKey: "modality",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Modalidad
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const modality: string = row.getValue('modality');
                return (
                    <p className="truncate pl-4">{modality}</p>
                );
            }
        },
        {
            accessorKey: "duration",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Duración
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const duration = parseFloat(row.getValue("duration"))

                return <div className="flex items-center gap-x-1 pl-4">
                    {duration} horas
                    <Timer className="size-4 text-gray-600" />
                </div>
            },
        },
        {
            accessorKey: "price",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Precio
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const price = parseFloat(row.getValue("price"));

                return <div className="flex items-center gap-x-1 pl-4">
                    {price}
                    <DollarSign className="size-4 text-gray-600" />
                </div>
            },
        },
        {
            accessorKey: "category",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Categoria
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const category: CategoryInterface = row.getValue("category");
                const standardizedCategory = standardizeCategory(category.name ?? "");

                return (
                    <p className="pl-4">
                        {standardizedCategory}
                    </p>
                )
            }
        },
        {
            accessorKey: "reviews",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Valoración
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const reviews: ReviewInterface[] = row.getValue("reviews");
                const averageRating = calculateAverageRating(reviews);

                return (
                    <p className="pl-4">
                        {averageRating.toFixed(1)} / 5
                    </p>
                )
            }
        },
        {
            accessorKey: "reactions",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Reacción popular
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const reactions: ReactionInterface[] = row.getValue("reactions");
                const mostPopularReaction = getMostPopularReaction(reactions);

                return (
                    <p className="pl-4">
                        {mostPopularReaction}
                    </p>
                )
            }
        },
        {
            accessorKey: "views",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Vistas
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const views: ViewInterface[] = row.getValue("views");

                return (
                    <div className="flex items-center gap-x-1 pl-4">
                        <p>{views.length}</p>
                        <Eye className="size-4 text-gray-600" />
                    </div>

                )
            }
        },
        {
            id: "reviewCount",
            header: "Reseñas",
            cell: ({ row }) => {
                const reviews: ReviewInterface[] = row.getValue("reviews");

                return (
                    <div className="flex items-center gap-x-1">
                        <p>
                            {reviews.length}
                        </p>
                        <Star className="size-4 text-gray-600" />
                    </div>
                )
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir Opciones</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setSelectedCourse(row.original)}>
                                <Users /> Ver usuarios recomendados
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];

    const table = useReactTable({
        data: courses,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className={className}>
            <div className="flex sm:items-center pb-4 flex-col gap-2 sm:flex-row sm:justify-between">
                <div className="flex items-center">
                    <h2 className="text-xl font-semibold">{ title ?? 'Todos mis programas' }</h2>
                </div>
                <Input
                    placeholder="Buscar por titulo..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div
                className="rounded-md border border-zinc-200 dark:border-zinc-800 
                                            dark:file:text-zinc-50 dark:placeholder:text-zinc-400 
                                            dark:focus-visible:ring-zinc-300"
            >
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-5">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No hay Usuarios.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default RecomendedCoursesTable;