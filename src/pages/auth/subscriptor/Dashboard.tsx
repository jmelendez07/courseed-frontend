import { AppSidebar } from "@/components/app-sidebar";
import DashboardSuscriptorCourseRecomendation from "@/components/dashboard/dashboard-suscriptor-course-recomendation";
import DashboardSuscriptorStats from "@/components/dashboard/dashboard-suscriptor-stats";
import WelcomeBanner from "@/components/dashboard/welcome-banner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import Color from "@/components/ui/Color";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Theme from "@/components/ui/theme";
import APIS from "@/enums/apis";
import { useAuth } from "@/providers/AuthProvider";
import HeadProvider from "@/providers/HeadProvider";
import InstitutionToSuscriptorProvider from "@/providers/InstitutionToSuscriptorProvider";
import axios, { AxiosResponse } from "axios";
import React from "react";
import { useSearchParams } from "react-router-dom";

function Dashboard() {
    const [searchParams] = useSearchParams();
    const authHook = useAuth();

    React.useEffect(() => {
        if (searchParams.get('lapResponseCode') === "APPROVED") {
            axios.get(APIS.AUTH_TOKEN)
                .then((response: AxiosResponse) => {
                    authHook?.handleToken(response.data.token);
                })
        }
    }, [searchParams.get('lapResponseCode')]);

    return (
        <InstitutionToSuscriptorProvider>
            <SidebarProvider>
                <AppSidebar />
                <HeadProvider title="Suscriptor" />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Suscriptor
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Inicio</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex items-center gap-2 px-4">
                            <Color />
                            <Theme />
                        </div>
                    </header>
                    <main className="flex-1 p-6">
                        <div className="mb-8 space-y-6">
                            <WelcomeBanner />
                            <DashboardSuscriptorStats />
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-0">
                                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                                        <iframe title="PowerbiCourseed" width="100%" height="100%" src="https://app.powerbi.com/view?r=eyJrIjoiNDgyOTU3OTctOTBlOC00ZTZmLWIzNWUtNWU1ZmIzMjM5M2VkIiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9" allowFullScreen={true}></iframe>
                                    </div>
                                </CardContent>
                            </Card>
                            <DashboardSuscriptorCourseRecomendation title="Programas Recomendados" />
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </InstitutionToSuscriptorProvider>
    );
}

export default Dashboard;