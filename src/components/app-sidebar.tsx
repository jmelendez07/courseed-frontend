import {
	CreditCard,
	Drama,
	GraduationCap,
	LayoutPanelLeft,
	ListChecks,
	MessageSquareText,
	ScanEye,
	TextSearch,
	UserPlus,
	Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import React from "react";
import { DialogContext } from "@/providers/DialogProvider";
import CreateUserForm from "@/components/form/create-user-form";
import CourseForm from "@/components/form/course-form";
import { useAuth } from "@/providers/AuthProvider";
import ROLES from "@/enums/roles";
import { NavRecords } from "./nav-record";
import { NavRecomendations } from "./nav-recomendations";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

	const dialogContext = React.useContext(DialogContext);
	const authHook = useAuth();

	const isAdmin = (): boolean | undefined => {
		return authHook?.user?.roles?.some(r => r === ROLES.ADMIN);
	}

	const isSubscriber = (): boolean | undefined => {
		return authHook?.user?.roles?.some(r => r === ROLES.SUBSCRIBER);
	}

	const getNavMain = () => {
		if (isAdmin()) {
			return dataAdmin.navMain;
		} else if (isSubscriber()) {
			return dataSubscriber.navMain;
		} else {
			return dataUser.navMain;
		}
	}

	const userForm = {
		title: "Registrar Nuevo Usuario",
		description: "Añade un nuevo usuario a la plataforma con su correo y una contraseña segura.",
		open: true,
		dialogChildren: <CreateUserForm />
	}

	const courseForm = {
		title: "Crea un Nuevo Programa",
		description: "Añade un nuevo programa a la plataforma con su titulo, precio, duración...",
		open: true,
		dialogChildren: <CourseForm />
	}

	const dataAdmin = {
		actions: [
			{
				name: "Nuevo Usuario",
				logo: UserPlus,
				action: () => dialogContext?.setContext(userForm)
			},
			{
				name: "Nuevo Programa",
				logo: GraduationCap,
				action: () => dialogContext?.setContext(courseForm)
			},
		],
		navMain: [
			{
				title: "Panel",
				icon: LayoutPanelLeft,
				url: "/administrador"
			},
			{
				title: "Usuarios",
				icon: Users,
				items: [
					{
						title: "Ver todos",
						url: "/administrador/usuarios",
					},
					{
						title: "Registrar Nuevo",
						action: () => dialogContext?.setContext(userForm)
					},
				],
			},
			{
				title: "Educación Continua",
				icon: GraduationCap,
				items: [
					{
						title: "Ver todos",
						url: "/administrador/educacion",
					},
					{
						title: "Registrar Nuevo",
						action: () => dialogContext?.setContext(courseForm)
					}
				],
			},
			{
				title: "Reseñas",
				icon: MessageSquareText,
				url: "/administrador/reseñas"
			},
		],
		navRecomendation: [
			{
				name: "Programas",
				icon: ListChecks,
				url: "/administrador/recomendaciones/programas",
			},
		]
	};

	const dataUser = {
		actions: [],
		navMain: [
			{
				title: "Panel",
				icon: LayoutPanelLeft,
				url: "/usuario"
			},
			{
				title: "Reseñas",
				icon: MessageSquareText,
				url: "/usuario/reseñas"
			},
			{
				title: "Reacciones",
				icon: Drama,
				url: "/usuario/reacciones"
			},
		],
		navRecord: [
			{
				name: "Historial de Busqueda",
				icon: TextSearch,
				url: "/usuario/historial-busqueda",
			},
			{
				name: "Programas visualizados",
				icon: ScanEye,
				url: "/usuario/programas-visualizados",
			}
		]
	}

	const dataSubscriber = {
		actions: [],
		navMain: [
			{
				title: "Panel",
				icon: LayoutPanelLeft,
				url: "/suscriptor"
			},
			{
				title: "Programas",
				icon: GraduationCap,
				url: "/suscriptor/programas"
			},
			{
				title: "Suscripciones",
				icon: CreditCard,
				url: "/suscriptor/suscripciones"
			},
		],
		navRecomendation: [
			{
				name: "Programas",
				icon: ListChecks,
				url: "/suscriptor/recomendaciones/programas",
			},
		]
	}

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher
					teams={isAdmin() ? dataAdmin.actions : dataUser.actions}
					role={authHook?.getRoleName() ? authHook.getRoleName() : ""}
				/>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={getNavMain()} />
				{ authHook?.user?.roles?.some(r => r === ROLES.USER) ? (
					<NavRecords records={dataUser.navRecord} />
				) : authHook?.user?.roles?.some(r => r === ROLES.ADMIN || r === ROLES.SUBSCRIBER) && (
					<NavRecomendations recomendations={authHook?.user?.roles?.some(r => r === ROLES.ADMIN) ? dataAdmin.navRecomendation : dataSubscriber.navRecomendation} />
				)}
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
