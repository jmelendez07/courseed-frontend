import { AppSidebar } from "@/components/app-sidebar";
import DashboardContentReactionsAuth from "@/components/dashboard/dashboard-content-reactions-auth";
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
import Theme from "@/components/ui/theme";
import HeadProvider from "@/providers/HeadProvider";
import ProfileFormProvider from "@/providers/ProfileFormProvider";

function Likes() {
    return (
        <ProfileFormProvider>
            <SidebarProvider>
                <AppSidebar />
                <HeadProvider title="Usuario | Reacciones" />
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
                                        <BreadcrumbPage>Reacciones</BreadcrumbPage>
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
                        <DashboardContentReactionsAuth />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ProfileFormProvider>
    );
}

export default Likes;