import { AppSidebar } from "@/components/app-sidebar";
import DashboardHistoryRecomendations from "@/components/dashboard/dashboard-history-recomendations";
import DashboardRecomendedCourses from "@/components/dashboard/dashboard-recomended-courses";
import DashboardSearchHistories from "@/components/dashboard/dashboard-search-histories";
import { RecommendedProgramsBanner } from "@/components/dashboard/recommended-programs-banner";
import WelcomeBanner from "@/components/dashboard/welcome-banner";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Color from "@/components/ui/Color";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Theme from "@/components/ui/theme";
import { useAuth } from "@/providers/AuthProvider";
import HeadProvider from "@/providers/HeadProvider";
import ProfileFormProvider from "@/providers/ProfileFormProvider";

function Dashboard() {
    const authHook = useAuth();

    return (
        <ProfileFormProvider>
            <SidebarProvider>
                <AppSidebar />
                <HeadProvider title="Usuario" />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Usuario
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
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <WelcomeBanner />
                        <Tabs defaultValue="recomendados" className="flex-1 flex flex-col items-start">
                            <TabsList className="mb-4">
                                <TabsTrigger value="recomendados">Recomendados</TabsTrigger>
                                <TabsTrigger value="historial">Historial</TabsTrigger>
                            </TabsList>
                            <TabsContent value="recomendados" className="space-y-8 h-full w-full">
                                <DashboardRecomendedCourses />
                                {(authHook?.user?.views !== undefined && authHook.user.views > 0)  && (
                                    <DashboardHistoryRecomendations />
                                )}
                            </TabsContent>
                            <TabsContent value="historial" className="space-y-4 w-full h-full overflow-hidden">
                                <DashboardSearchHistories />
                            </TabsContent>
                        </Tabs>
                        <RecommendedProgramsBanner />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ProfileFormProvider>
    );
}

export default Dashboard;