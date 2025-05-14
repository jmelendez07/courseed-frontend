import Subscription from "@/interfaces/subscription";
import React from "react";
import { Button } from "../ui/button";
import { CalendarClock, ChevronDown, ChevronUp, CreditCard, LoaderCircle, Package2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import SubscriptionCard from "../ui/subscription-card";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

interface ResponseProps {
	content: Subscription[];
	empty: boolean;
	last: boolean;
}

function DashboardSubscriptionList() {
	const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [isLastPage, setIslastPage] = React.useState<boolean>(false);
	const [pageNumber, setPageNumber] = React.useState<number>(0);
	const pageSize = 6;

	React.useEffect(() => {
		setLoading(true);
		axios.get(APIS.SUBSCRIPTIONS_BY_AUTH_USER, {
			params: {
				page: pageNumber,
				size: pageSize
			}
		})
			.then((response: AxiosResponse<ResponseProps>) => {
				setSubscriptions(current => pageNumber === 0 
					? response.data.content
					: [...current, ...response.data.content]
				);
				setIslastPage(response.data.empty || response.data.last);
			})
			.catch(() => {
				setSubscriptions([]);
				setIslastPage(true);
			})
			.finally(() => setLoading(false));
	}, [pageNumber, pageSize]);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">Mis Suscripciones</h2>
				<Button asChild>
					<Link to="/#precios" className="h-8 gap-1">
						<RefreshCw className="h-3.5 w-3.5" />
						<span>Renovar</span>
					</Link>
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card className="hover:shadow-lg transition-shadow duration-300">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Plan Actual</CardTitle>
						<CardDescription>
							{loading ? (
								<Skeleton className="h-4 w-20" />
							) : subscriptions.find((s) => s.state.toLowerCase() === "active") ? (
								"Suscripción activa"
							) : (
								"Sin suscripción activa"
							)}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							<Package2 className="h-4 w-4 text-muted-foreground" />
							<div className="text-lg font-bold">
								{loading ? (
									<Skeleton className="h-8 w-20" />
								) : (
									subscriptions.find((s) => s.state.toLowerCase() === "active")?.plan || "Ninguno"
								)}
							</div>
						</div>
						<div className="text-xs text-muted-foreground mt-1">
							{loading ? (
								<Skeleton className="h-3 w-32" />
							) : subscriptions.find((s) => s.state.toLowerCase() === "active") ? (
								`${subscriptions.find((s) => s.state.toLowerCase() === "active")?.price.toFixed(2)} ${subscriptions.find((s) => s.state === "active")?.currency}/mensual`
							) : (
								"No hay plan activo actualmente"
							)}
						</div>
					</CardContent>
				</Card>
				<Card className="hover:shadow-lg transition-shadow duration-300">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Próxima Renovación</CardTitle>
						<CardDescription>
							{loading ? (
								<Skeleton className="h-4 w-20" />
							) : subscriptions.filter((s) => s.state.toLowerCase() === "active").length > 0 ? (
								"Fecha de renovación"
							) : (
								"No hay suscripciones activas"
							)}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							<CalendarClock className="h-4 w-4 text-muted-foreground" />
							<div className="text-sm font-medium">
								{loading ? (
									<Skeleton className="h-5 w-32" />
								) : subscriptions.filter((s) => s.state.toLowerCase() === "active").length > 0 ? (
									dayjs(subscriptions.find((s) => s.state.toLowerCase() === "active")?.endDate || "").format("L")
								) : (
									"N/A"
								)}
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="hover:shadow-lg transition-shadow duration-300">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Método de Pago</CardTitle>
						<CardDescription>
							{loading ? (
								<Skeleton className="h-4 w-20" />
							) : subscriptions.filter((s) => s.state.toLowerCase() === "active").length > 0 ? (
								"Método principal"
							) : (
								"No hay método configurado"
							)}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							<CreditCard className="h-4 w-4 text-muted-foreground" />
							<div className="text-sm font-medium">
								{loading ? (
									<Skeleton className="h-5 w-32" />
								) : subscriptions.filter((s) => s.state.toLowerCase() === "active").length > 0 ? (
									subscriptions.find((s) => s.state.toLowerCase() === "active")?.paymentMethod.replace("_", " ")
								) : (
									"No configurado"
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<h3 className="text-xl font-semibold mt-8 mb-4">Historial de Suscripciones</h3>

			{(loading && pageNumber === 0) ? (
				<div className="space-y-4">
					<Skeleton className="h-[200px] w-full" />
					<Skeleton className="h-[200px] w-full" />
				</div>
			) : subscriptions.length > 0 ? (
				<>
					<div className="space-y-4">
						{subscriptions.map((subscription) => (
							<SubscriptionCard key={subscription.id} subscription={subscription} />
						))}
					</div>
					<div className="flex items-center justify-center space-x-2 py-4">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								if (isLastPage) {
									window.scrollTo({ top: 0, behavior: "smooth" });
								} else {
									setPageNumber(current => current + 1);
								}
							}}
							disabled={loading}
						>
							{isLastPage ? (
								<>
									¡Lo has visto todo! Vuelve arriba.
									<ChevronUp />
								</>
							) : (
								<>
									Mostrar mas suscripciones
									{loading ? (
										<LoaderCircle className="animate-spin" />
									) : (
										<ChevronDown />
									)}
								</>
							)}
						</Button>
					</div>
				</>
			) : (
				<Card className="flex flex-col items-center justify-center p-8 text-center">
					<Package2 className="h-10 w-10 text-muted-foreground mb-4" />
					<h3 className="text-lg font-semibold">No hay suscripciones</h3>
					<p className="text-sm text-muted-foreground mt-2">No se encontraron suscripciones asociadas a tu cuenta.</p>
					<Button className="mt-4">Explorar Planes</Button>
				</Card>
			)}
		</div>
	)
}

export default DashboardSubscriptionList;