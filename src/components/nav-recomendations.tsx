import {
    type LucideIcon,
} from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import React from "react"
import { ColorContext } from "@/providers/ColorProvider"
import { Collapsible } from "./ui/collapsible"

export function NavRecomendations({
    recomendations,
}: {
    recomendations: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const location = useLocation();
	const colorContext = React.useContext(ColorContext); 

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Recomendaciones</SidebarGroupLabel>
            <SidebarMenu>
                {recomendations.map((item) => (
                    <Collapsible
                        key={item.name}
                        asChild
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                asChild
                                className={decodeURIComponent(location.pathname) === item.url 
                                    ? `bg-${colorContext?.color}-600 text-white hover:bg-${colorContext?.color}-700 hover:text-white` 
                                    : ""
                                }
                                tooltip={item.name}
                            >
                                <Link to={item.url}>
                                    <item.icon />
                                    <span>{item.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
