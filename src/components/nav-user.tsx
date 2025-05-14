import {
	ChevronsUpDown,
	LogOut,
	UserPen,
} from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import AvatarProfile from "./ui/avatar-profile";

export function NavUser() {
	const { isMobile } = useSidebar();
	const auth = useAuth();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="size-8 relative shrink-0">	
								<AvatarProfile imageUrl={auth?.user?.image} name={auth?.getName() ?? ""} className="shadow-lg shrink-0" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{auth?.getName()}</span>
								<span className="truncate text-xs">{auth?.user?.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<AvatarProfile imageUrl={auth?.user?.image} name={auth?.getName() ?? ""} className="shadow-lg" />
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{auth?.getName()}</span>
									<span className="truncate text-xs">{auth?.user?.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<Link to="/perfil">
								<DropdownMenuItem>
									<UserPen />
									Perfil
								</DropdownMenuItem>
							</Link>
							<Link to="/salir">
								<DropdownMenuItem>
									<LogOut />
									Cerrar Sesión
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
