import { ArrowDown, ExternalLink, LayoutGrid, List, LoaderCircle, MoreVertical, Search, SearchX } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Separator } from "../ui/separator"
import React from "react"
import { Input } from "../ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import useSearchHistories from "@/hooks/useSearchHistories"
import SearchHistoryInterface from "@/interfaces/search-history"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import LazyImage from "../ui/LazyImage"
import { Checkbox } from "../ui/checkbox"

interface SearchDayInterface {
    date: Date;
    items: SearchHistoryInterface[];
}

interface SearchDayCardProps { 
    day: SearchDayInterface,
    selectedItems: Set<string>,
    onDelete: (id: string) => void,
    setSelectedItems: React.Dispatch<React.SetStateAction<Set<string>>>;
}

function formatDayHeader(date: Date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
        return "Ayer";
    } else {
        return dayjs(date).format("DD/MM/YYYY");
    }
}

function groupSearchHistoriesByDay(histories: SearchHistoryInterface[]): SearchDayInterface[] {
    const groups: Record<string, SearchHistoryInterface[]> = {};

    histories.forEach(history => {
        const date = new Date(history.createdAt);
        date.setHours(0, 0, 0, 0);
        const dateString = date.toISOString();

        if (!groups[dateString]) {
            groups[dateString] = [];
        }

        groups[dateString].push(history);
    });

    return Object.entries(groups)
        .map(([dateString, items]) => ({
            date: new Date(dateString),
            items: items.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime());
}

function SearchGroupCard({ group, onDelete }: { group: SearchHistoryInterface, onDelete: (id: string) => void }) {
    return (
        <Card className="mb-4 shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out">
            <CardContent className="p-0">
                <div className="p-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">"{group.search}"</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{dayjs(group.createdAt).fromNow()}</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Link to={"/educacion?busqueda=" + group.search} target="_blank" className="inline-flex justify-between items-center gap-2">
                                        Abrir en una nueva pagina
                                        <ExternalLink className="size-4" />
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete(group.id)}
                                    className="w-full inline-flex items-center justify-between cursor-pointer text-red-500 hover:!text-red-600 gap-2"
                                >
                                    Eliminar del historial
                                    <SearchX />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {(group.courses && group.courses?.length > 0) && (
                    <>
                        <Separator />
                        <div className="py-2">
                            {group.courses.map((item) => (
                                <Link to={item.url} key={item.id} target="_blank" className="flex items-center group justify-between gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-900">
                                    <div className="grid items-center grid-cols-[auto_1fr] gap-3 overflow-hidden">
                                        <div className="relative size-8 shrink-0">
                                            <LazyImage src={item.image ?? ""} width={50} height={50} className="size-8 rounded object-cover" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-medium text-sm line-clamp-2">{item.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{item.url}</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="size-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out" />
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

function SearchDayCard({ day, onDelete, selectedItems, setSelectedItems }: SearchDayCardProps) {

    const toggleItemSelection = (id: string) => {
        const newSelectedItems = new Set(selectedItems);
        if (newSelectedItems.has(id)) {
            newSelectedItems.delete(id);
        } else {
            newSelectedItems.add(id);
        }
        setSelectedItems(newSelectedItems);
    };

    return (
        <div className="border dark:border-zinc-800 overflow-hidden rounded-md mb-4 shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out">
            <h3 className="px-4 py-2 font-medium bg-gray-50 dark:bg-zinc-900">{formatDayHeader(day.date)}</h3>
            <div className="divide-y">
                {day.items.map((item) => (
                    <div key={item.id} className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-900 gap-3">
                        <Checkbox
                            id={`check-${item.id}`}
                            checked={selectedItems.has(item.id)}
                            onCheckedChange={() => toggleItemSelection(item.id)}
                            className="mr-1"
                        />
                        <div className="w-16 text-xs text-gray-500">{dayjs(item.createdAt).format("h:mm A")}</div>
                        {item.courses && item.courses.length > 0 && (
                            <div className="relative size-8">
                                <LazyImage src={item.courses[0].image ?? ""} width={50} height={50} className="size-8 rounded object-cover" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">"{item.search}"</p>
                            {item.courses && item.courses.length > 0 && (
                                <p className="text-xs text-gray-500 truncate">
                                    <Link target="_blank" className="text-gray-900 dark:text-gray-400 hover:underline" to={item.courses[0].url}>{item.courses[0].url}</Link>
                                    { item.courses.length > 1 && ( 
                                        <>{" "} y {item.courses.length - 1} programas mas encontrados</>
                                    ) }
                                </p>
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Link to={"/educacion?busqueda=" + item.search} target="_blank" className="inline-flex justify-between items-center gap-2">
                                        Abrir en una nueva pagina
                                        <ExternalLink className="size-4" />
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete(item.id)}
                                    className="w-full inline-flex items-center justify-between cursor-pointer text-red-500 hover:!text-red-600 gap-2"
                                >
                                    Eliminar del historial
                                    <SearchX />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DashboardSearchHistory() {
    const [activeTab, setActiveTab] = React.useState<string>("grupo")
    const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());
    const historiesHook = useSearchHistories({ size: 4 });

    const searchHistoriesByDay = React.useMemo(() => groupSearchHistoriesByDay(historiesHook.searchHistories), [historiesHook.searchHistories]);

    return (
        <div className="space-y-4 grid grid-cols-1 grid-rows-[auto_1fr_auto] content-start h-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Historial de Busqueda</h1>
                <p className="text-muted-foreground">Consulta aquí las búsquedas recientes realizadas para encontrar programas.</p>
            </div>

            <Tabs defaultValue="grupo" className="grid grid-cols-1 grid-rows-[auto_1fr] content-start" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative w-full">
                        { selectedItems.size > 0 ? (
                            <Button variant="destructive" onClick={async () => {
                                if (await historiesHook.handleDeleteSearchHistories(Array.from(selectedItems))) {
                                    setSelectedItems(new Set());
                                }
                            }}>
                                Eliminar {selectedItems.size} seleccionados
                            </Button>
                        ) : (
                            <>
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="search"
                                    placeholder="Buscar historial"
                                    className="pl-10 w-full"
                                    value={historiesHook.search}
                                    onChange={(e) => {
                                        historiesHook.setParams({ ...historiesHook.params, pageNumber: 0 });
                                        historiesHook.setSearch(e.target.value);
                                    }}
                                />
                            </>
                        )}
                    </div>
                    <TabsList className="grid w-full grid-cols-2 max-w-[250px]">
                        <TabsTrigger value="fecha" className="flex items-center gap-2">
                            <List className="h-4 w-4" />
                            <span>Por fecha</span>
                        </TabsTrigger>
                        <TabsTrigger value="grupo" className="flex items-center gap-2">
                            <LayoutGrid className="h-4 w-4" />
                            <span>Por grupo</span>
                        </TabsTrigger>
                    </TabsList>
                </div>
                
                {historiesHook.loading ? (
                    <div className="w-full h-full grid place-items-center">
                        <LoaderCircle className="size-5 animate-spin" />
                    </div>
                ) : (
                    <>
                        <TabsContent value="fecha" className="mt-4">
                            {searchHistoriesByDay.map((dayGroup) => (
                                <SearchDayCard 
                                    key={dayGroup.date.toISOString()} 
                                    day={dayGroup} 
                                    selectedItems={selectedItems}
                                    onDelete={historiesHook.handleDeleteSearchHistory} 
                                    setSelectedItems={setSelectedItems}
                                />
                            ))}
                        </TabsContent>

                        <TabsContent value="grupo" className="mt-4">
                            {historiesHook.searchHistories.map((group) => (
                                <SearchGroupCard key={group.id} group={group} onDelete={historiesHook.handleDeleteSearchHistory} />
                            ))}
                        </TabsContent>
                    </>
                )}
            </Tabs>

            {(!historiesHook.loading && !historiesHook.isLastPage) && (
                <div className="grid place-items-center py-6">
                    <Button onClick={() => historiesHook.setParams({ pageNumber: historiesHook.params.pageNumber + 1 })} variant="outline" type="button" className="flex items-center gap-2">
                        <span className="">Ver más resultados</span>
                        <ArrowDown className="size-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}

export default DashboardSearchHistory;