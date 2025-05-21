import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import InstitutionsWithCoursesCount from "@/interfaces/institutions-with-courses-count";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

function DashboardMap() {
    const mapRef = React.useRef<HTMLDivElement | null>(null);
    const [mapHeight, setMapHeight] = React.useState<number>(0);
    const [institutions, setInstitutions] = React.useState<InstitutionsWithCoursesCount[]>([]);

    React.useEffect(() => {
		axios.get(APIS.INSTITUTIONS_COURSES_COUNT, {
			params: { page: 0, size: 10 }
		})
			.then((response: AxiosResponse<InstitutionsWithCoursesCount[]>) => {
				setInstitutions(response.data);
			})
			.catch(() => {
				setInstitutions([]);
			})
	}, []);

    React.useEffect(() => {
        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                setMapHeight(entries[0].contentRect.height);
            }
        });

        if (mapRef.current) {
            observer.observe(mapRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div className="flex items-center">
                <h2 className="text-xl font-semibold">Distribución Geográfica de Instituciones</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-4 max-h-full xl:grid-rows-1 gap-4 items-start">
                <Card ref={mapRef} className="xl:col-span-3 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                        {/* width="1140" height="541.25" */}
                            <iframe title="PowerbiCourseed"  src="https://app.powerbi.com/reportEmbed?reportId=b39dcde8-4b8c-4d3b-b687-879eeaabc3aa&autoAuth=true&ctid=9d12bf3f-e4f6-47ab-912f-1a2f0fc48aa4" allowFullScreen={true}></iframe>
                        </div>
                    </CardContent>
                </Card>
                <div 
                    style={{ height: mapHeight }} 
                    className="min-h-[600px] xl:min-h-0 xl:h-auto xl:max-h-full flex flex-col"
                >
                    <div className="pb-4">
                        <h3 className="text-xl font-semibold">Programas por Institución</h3>
                        <p className="text-base">Total de Programas activos {institutions.length}</p>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <ScrollArea className="h-full">
                            <div className="space-y-2">
                                {institutions.map((institution, i) => (
                                    <Link to={`/educacion?institucion=${institution.id}`}
                                        key={i}
                                        className="
                                            flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 dark:border-zinc-800
                                            hover:shadow-lg transition-shadow duration-300 group cursor-pointer
                                        "
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">{institution.name}</p>
                                            <p className="text-sm text-muted-foreground">{institution.totalCourses} programas</p>
                                        </div>
                                        <ArrowUpRight className="size-5 min-w-5 ml-1 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardMap;