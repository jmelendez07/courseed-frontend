import * as React from "react";
import { ChevronRight, ChevronsUpDown, House, LogOut, UserPen } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
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

export function TeamSwitcher({
	teams,
	role,
}: {
	teams: {
		name: string
		logo: React.ElementType,
		action?: () => void
	}[]
	role: string
}) {
	const { isMobile } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<img
								src="/logo.png"
								alt="Courseed"
								title="Courseed"
								className="h-8"
							/>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									Courseed
								</span>
								<span className="truncate text-xs">
									{role}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-xs text-zinc-500 dark:text-zinc-400">
							Acciones Rapidas
						</DropdownMenuLabel>
						<DropdownMenuItem
							className="gap-2 p-2 flex justify-between"
						>
								<Link to="/" className="flex gap-2">
									<div className="flex size-6 items-center justify-center rounded-sm border">
										<House className="size-4 shrink-0" />
									</div>
									Página Principal
								</Link>
								<ChevronRight />
							</DropdownMenuItem>
						{teams.length > 0 && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuLabel className="text-xs text-zinc-500 dark:text-zinc-400">
									Acciones Rapidas
								</DropdownMenuLabel>
								{teams.map((team, _) => (
									<DropdownMenuItem
										key={team.name}
										onClick={() => {
											if (team.action) team.action()
										}}
										className="gap-2 p-2 flex justify-between"
									>
										<div className="flex gap-2">
											<div className="flex size-6 min-w-6 items-center justify-center rounded-sm border">
												<team.logo className="size-4 shrink-0" />
											</div>
											{team.name}
										</div>
										<ChevronRight />
									</DropdownMenuItem>
								))}	
							</>
						)}
						<DropdownMenuItem
							className="gap-2 flex justify-between"
						>
							<Link to="/perfil" className="flex p-2 gap-2 w-full">
								<UserPen className="size-4 shrink-0" />
								Perfil
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 flex justify-between"
						>
							<Link to="/salir" className="flex p-2 gap-2 w-full">
								<LogOut className="size-4 shrink-0" />
								Cerrar Sesión
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
