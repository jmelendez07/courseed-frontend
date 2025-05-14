import { AppSidebar } from "@/components/app-sidebar";
import DashboardSuscriptorCourseRecomendation from "@/components/dashboard/dashboard-suscriptor-course-recomendation";
import DashboardSuscriptorStats from "@/components/dashboard/dashboard-suscriptor-stats";
import WelcomeBanner from "@/components/dashboard/welcome-banner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Color from "@/components/ui/Color";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Theme from "@/components/ui/theme";
import HeadProvider from "@/providers/HeadProvider";
import InstitutionToSuscriptorProvider from "@/providers/InstitutionToSuscriptorProvider";

function Dashboard() {
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
                            <DashboardSuscriptorCourseRecomendation title="Programas Recomendados" />
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </InstitutionToSuscriptorProvider>
    );
}

export default Dashboard;