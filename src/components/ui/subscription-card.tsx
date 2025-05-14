import Subscription from "@/interfaces/subscription";
import { Badge } from "./badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { CalendarClock, Check, CreditCard, X } from "lucide-react";
import { Separator } from "./separator";
import dayjs from "dayjs";

function SubscriptionCard({ subscription }: { subscription: Subscription }) {

    const getStatusBadge = () => {
        switch (subscription.state) {
            case "active":
                return <Badge className="bg-green-500 hover:bg-green-600">Activa</Badge>
            case "expired":
                return <Badge variant="secondary">Expirada</Badge>
            case "cancelled":
                return <Badge variant="destructive">Cancelada</Badge>
            case "pending":
                return (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        Pendiente
                    </Badge>
                )
            default:
                return <Badge variant="outline">{subscription.state}</Badge>
        }
    }

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-base">{subscription.plan.toUpperCase()}</CardTitle>
                        <CardDescription>Ref: {subscription.referenceCode}</CardDescription>
                    </div>
                    {getStatusBadge()}
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Precio</p>
                        <p className="text-sm font-medium">
                            {subscription.price.toFixed(2)} {subscription.currency}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Método de pago</p>
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                            <p className="text-sm font-medium">{subscription.paymentMethod.replace("_", " ")}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Fecha de inicio</p>
                        <div className="flex items-center gap-2">
                            <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                            <p className="text-sm font-medium">{dayjs(subscription.startDate).format("LLL")}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Fecha de fin</p>
                        <div className="flex items-center gap-2">
                            <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                            <p className="text-sm font-medium">{dayjs(subscription.endDate).format("LLL")}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <Separator />
            <CardFooter className="pt-3">
                <div className="flex items-center text-sm text-muted-foreground">
                    {subscription.responseMessage === "APPROVED" ? (
                        <>
                            <Check className="mr-1 h-3.5 w-3.5 text-green-500" />
                            <span>Transacción aprobada</span>
                        </>
                    ) : (
                        <>
                            <X className="mr-1 h-3.5 w-3.5 text-red-500" />
                            <span>{subscription.responseMessage}</span>
                        </>
                    )}
                    <span className="mx-2">•</span>
                    <span>Auth: {subscription.authorizationCode}</span>
                </div>
            </CardFooter>
        </Card>
    );
}

export default SubscriptionCard;