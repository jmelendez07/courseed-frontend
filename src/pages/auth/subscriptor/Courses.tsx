import { AppSidebar } from "@/components/app-sidebar";
import DashboardCoursesSuscriptor from "@/components/dashboard/dashboard-courses-suscriptor";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Color from "@/components/ui/Color";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Theme from "@/components/ui/theme";
import DialogProvider from "@/providers/DialogProvider";
import HeadProvider from "@/providers/HeadProvider";
import InstitutionToSuscriptorProvider from "@/providers/InstitutionToSuscriptorProvider";

function Courses() {
    return (
        <InstitutionToSuscriptorProvider>
            <SidebarProvider>
                <DialogProvider>
                    <AppSidebar />
                    <HeadProvider title="Suscriptor | Cursos" />
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
                                            <BreadcrumbPage>Programas</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                            <div className="flex items-center gap-2 px-4">
                                <Color />
                                <Theme />
                            </div>
                        </header>
                        <DashboardCoursesSuscriptor />
                    </SidebarInset>
                </DialogProvider>
            </SidebarProvider>
        </InstitutionToSuscriptorProvider>
    );
}

export default Courses;