import { AppSidebar } from "@/components/app-sidebar";
import DashboardMap from "@/components/dashboard/dashboard-map";
import DashboardReports from "@/components/dashboard/dashboard-reports";
import DashboardStats from "@/components/dashboard/dashboard-stats";
import {
    Breadcrumb,
    BreadcrumbItem,
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
import Theme from "@/components/ui/theme";
import DialogProvider from "@/providers/DialogProvider";
import HeadProvider from "@/providers/HeadProvider";
import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <SidebarProvider>
            <DialogProvider>
                <HeadProvider title="Administrador" />
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <Link to="/administrador" className="hover:text-gray-800">
                                            Administrador
                                        </Link>
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
                        <DashboardStats />
                        <DashboardMap />
                        <DashboardReports />
                    </div>
                </SidebarInset>
            </DialogProvider>
        </SidebarProvider>
    );
}

export default Dashboard;