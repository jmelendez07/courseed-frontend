import { AppSidebar } from "@/components/app-sidebar";
import DashboardSubscriptionList from "@/components/dashboard/dashboard-subscription-list";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Color from "@/components/ui/Color";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Theme from "@/components/ui/theme";
import HeadProvider from "@/providers/HeadProvider";
import InstitutionToSuscriptorProvider from "@/providers/InstitutionToSuscriptorProvider";

function Subscriptions() {
    return (
        <InstitutionToSuscriptorProvider>
            <SidebarProvider>
                <AppSidebar />
                <HeadProvider title="Mi Cuenta | Suscripciones" />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">Mi Cuenta</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Suscripciones</BreadcrumbPage>
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
                        <DashboardSubscriptionList />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </InstitutionToSuscriptorProvider>
    );
}

export default Subscriptions;