import { AppSidebar } from "@/components/app-sidebar";
import DashboardContentProfile from "@/components/dashboard/dashboard-content-profile";
import DashboardContentUserWithProfile from "@/components/dashboard/dashboard-content-user-with-profile";
import DashboardInstitutionProfile from "@/components/dashboard/dashboard-institution-profile";
import DashboardStatsProfile from "@/components/dashboard/dashboard-stats-profile";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Color from "@/components/ui/Color";
import ProfileCards from "@/components/ui/profile-cards";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import Theme from "@/components/ui/theme";
import ROLES from "@/enums/roles";
import { useAuth } from "@/providers/AuthProvider";
import DialogProvider from "@/providers/DialogProvider";
import HeadProvider from "@/providers/HeadProvider";
import ProfileFormProvider from "@/providers/ProfileFormProvider";

function Profile() {
    const authHook = useAuth();

    return (
        <ProfileFormProvider>
            <SidebarProvider>
                <DialogProvider>
                    <AppSidebar />
                    <HeadProvider title="Mi cuenta" />
                    <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href="#">
                                                Perfil
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
                        <div className="flex flex-col gap-2 p-4 pt-0">
                            { (authHook?.user?.profile && !Object.values(authHook.user.profile).some(value => value === null)) ? (
                                <DashboardContentUserWithProfile />
                            ) : (
                                <DashboardContentProfile />
                            ) }
                            {authHook?.user?.roles?.some((role: string) => role === ROLES.SUBSCRIBER) && (
                                <>
                                    <Separator className="my-4" />
                                    <DashboardInstitutionProfile />
                                </>
                            )}
                            <Separator className="my-4" />
                            <ProfileCards />
                            <Separator className="my-4" />
                            <DashboardStatsProfile />
                        </div>
                    </SidebarInset>
                </DialogProvider>
            </SidebarProvider>
        </ProfileFormProvider>
    );
}

export default Profile;