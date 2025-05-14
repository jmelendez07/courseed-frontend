import { ChevronRight, type LucideIcon } from "lucide-react"

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import React from "react"
import { ColorContext } from "@/providers/ColorProvider"

export function NavMain({
	items,
}: {
	items: {
		title: string
		icon?: LucideIcon
		url?: string
		items?: {
			title: string
			url?: string
			action?: () => void
		}[]
	}[]
}) {

	const location = useLocation();
	const colorContext = React.useContext(ColorContext); 

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Panel de Control</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.items?.some(subItem => decodeURIComponent(location.pathname) === subItem.url)}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							{item.items ? (
								<>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton
														onClick={() => {
															if (subItem.action) subItem.action()
														}}
														asChild
														className={decodeURIComponent(location.pathname) === subItem.url 
															? `bg-${colorContext?.color}-600 text-white hover:bg-${colorContext?.color}-700 hover:text-white` 
															: ""
														}
													>
														{(subItem.action || !subItem.url) ? (
															<span className="cursor-pointer">{subItem.title}</span>
														) : (
															<Link to={subItem.url}>
																<span>{subItem.title}</span>
															</Link>
														)}
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</>
							) : (
								<SidebarMenuButton 
									asChild 
									tooltip={item.title}
									className={decodeURIComponent(location.pathname) === item.url 
										? `bg-${colorContext?.color}-600 text-white hover:bg-${colorContext?.color}-700 hover:text-white` 
										: ""
									}
								>
									<Link to={item.url ?? ''}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							)}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
