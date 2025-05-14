import React from "react";
import AreaChart from "@/components/charts/area-chart";
import PieChart from "@/components/charts/pie-chart";
import axios, { AxiosResponse } from "axios";
import RolesWithUsersCount from "@/interfaces/roles-with-users-count";
import APIS from "@/enums/apis";
import ROLES from "@/enums/roles";
import MonthsWithUsersCount from "@/interfaces/months-with-users-count";
import { ColorContext } from "@/providers/ColorProvider";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwindcss/defaultConfig";

const tailwindShades: number[] = [700, 600, 500, 400, 300, 200, 100];

function DashboardChartUsers() {
    const [rolesWithUsersCount, setRolesWithUsersCount] = React.useState<RolesWithUsersCount[]>([]);
    const [monthsWithUsersCount, setMonthsWithUsersCount] = React.useState<MonthsWithUsersCount[]>([]);
    const [loadingRoles, setLoadingRoles] = React.useState<boolean>(true);
    const [loadingUsers, setLoadingUsers] = React.useState<boolean>(true);

    React.useEffect(() => {
        setLoadingRoles(true);
        axios.get(APIS.ROLES_WITH_USERS_COUNT)
            .then((response: AxiosResponse<RolesWithUsersCount[]>) => {
                console.log(response);
                setRolesWithUsersCount(response.data);
            })
            .catch(() => setRolesWithUsersCount([]))
            .finally(() => setLoadingRoles(false));
    }, []);

    React.useEffect(() => {
        setLoadingUsers(true);
        axios.get(APIS.USERS_COUNT_BY_MONTH)
            .then((response: AxiosResponse<MonthsWithUsersCount[]>) => {
                setMonthsWithUsersCount(response.data);
            })
            .catch(error => console.log(error))
            .finally(() => setLoadingUsers(false));
    }, []);

    const colorHook = React.useContext(ColorContext);
    const fullConfig = resolveConfig(tailwindConfig);
    function getTailwindColor(color: string, shade: number = 600): string {
        const colors = fullConfig.theme?.colors as Record<string, any>;
        if (colors[color]) {
            return typeof colors[color] === "string" ? colors[color] : colors[color]?.[shade] || null;
        }
        return "oklch(0.588 0.158 241.966)";
    }

    function getRoleName(role: string): string {
        if (role === ROLES.ADMIN) {
            return "Administradores";
        } else if (role === ROLES.SUBSCRIBER) {
            return "Suscriptores";
        } else {
            return "Usuarios.";
        }
    }

    return (
        <>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Panel de Usuarios</h1>
                <p className="text-muted-foreground">Gestiona tus usuarios – Agrega, edita y elimina cuentas fácilmente</p>
            </div>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <PieChart
                    title="Usuarios por Rol: Análisis Rápido 📑"
                    description="Analiza la cantidad de usuarios en cada rol y su proporción relativa."
                    chartData={rolesWithUsersCount.sort((a, b) => (a.totalUsers > b.totalUsers ? -1 : 1)).map((role, index) => ({
                        label: getRoleName(role.role),
                        value: role.totalUsers,
                        fill: getTailwindColor(colorHook ? colorHook.color : "sky", tailwindShades[index] || 100)
                    }))}
                    loading={loadingRoles}
                />
                <AreaChart
                    title="Progreso de Usuarios Creados en los Últimos 6 Meses 📈"
                    description="Muestra la tendencia de usuarios creados mes a mes en los últimos 6 meses."
                    chartData={monthsWithUsersCount.map(role => ({
                        month: role.month + " - " + role.year,
                        count: role.totalUsers
                    }))}
                    labelValueToolTip="Usuarios"
                    className="md:col-span-2"
                    loading={loadingUsers}
                />
            </div>
        </>
    );
}

export default DashboardChartUsers;