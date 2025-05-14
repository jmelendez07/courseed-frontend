import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, BookOpen, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CategoryCharts from "../charts/CategoryCharts";

const popularCategories = [
    {
        id: 1,
        name: "Desarrollo Web",
        views: 12500,
        reviews: 4.8,
        growth: 23,
        isCreatedByUser: true,
    },
    {
        id: 2,
        name: "Inteligencia Artificial",
        views: 10200,
        reviews: 4.7,
        growth: 45,
        isCreatedByUser: false,
    },
    {
        id: 3,
        name: "Diseño UX/UI",
        views: 8700,
        reviews: 4.6,
        growth: 18,
        isCreatedByUser: true,
    },
    {
        id: 4,
        name: "Ciencia de Datos",
        views: 7800,
        reviews: 4.5,
        growth: 32,
        isCreatedByUser: false,
    },
    {
        id: 5,
        name: "Desarrollo Móvil",
        views: 6500,
        reviews: 4.4,
        growth: 15,
        isCreatedByUser: true,
    },
]

const predictedCategories = [
    {
        id: 1,
        name: "Blockchain y Web3",
        confidence: 92,
        trend: "up",
        isCreatedByUser: false,
    },
    {
        id: 2,
        name: "Inteligencia Artificial Generativa",
        confidence: 88,
        trend: "up",
        isCreatedByUser: true,
    },
    {
        id: 3,
        name: "Ciberseguridad",
        confidence: 85,
        trend: "up",
        isCreatedByUser: false,
    },
    {
        id: 4,
        name: "Desarrollo Sostenible",
        confidence: 78,
        trend: "up",
        isCreatedByUser: true,
    },
    {
        id: 5,
        name: "Realidad Aumentada",
        confidence: 75,
        trend: "up",
        isCreatedByUser: false,
    },
]

const decliningCategories = [
    {
        id: 1,
        name: "jQuery",
        decline: 68,
        trend: "down",
        isCreatedByUser: true,
    },
    {
        id: 2,
        name: "Flash",
        decline: 95,
        trend: "down",
        isCreatedByUser: false,
    },
    {
        id: 3,
        name: "SOAP APIs",
        decline: 72,
        trend: "down",
        isCreatedByUser: true,
    },
    {
        id: 4,
        name: "Objective-C",
        decline: 65,
        trend: "down",
        isCreatedByUser: false,
    },
    {
        id: 5,
        name: "PHP Legacy",
        decline: 58,
        trend: "down",
        isCreatedByUser: true,
    },
]

function DashboardCategoriesAnalytics() {

    const [viewFilter, setViewFilter] = React.useState("all")

    const filteredPopular =
        viewFilter === "mine" ? popularCategories.filter((cat) => cat.isCreatedByUser) : popularCategories

    const filteredPredicted =
        viewFilter === "mine" ? predictedCategories.filter((cat) => cat.isCreatedByUser) : predictedCategories

    const filteredDeclining =
        viewFilter === "mine" ? decliningCategories.filter((cat) => cat.isCreatedByUser) : decliningCategories


    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-[100vw]">
            <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Analisis de Programas</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={viewFilter} onValueChange={setViewFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Ver categorías" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            <SelectItem value="mine">Solo mis categorías</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>Análisis de Categorías</CardTitle>
                        <CardDescription>Visualización de tendencias y métricas clave</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CategoryCharts
                            popularCategories={filteredPopular}
                            predictedCategories={filteredPredicted}
                            decliningCategories={filteredDeclining}
                        />
                    </CardContent>
                </Card>
                <Tabs defaultValue="popular" className="space-y-4">
                    <div className="max-w-full overflow-auto">
                        <TabsList>
                            <TabsTrigger value="popular">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Categorías Populares
                            </TabsTrigger>
                            <TabsTrigger value="predicted">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Predicciones
                            </TabsTrigger>
                            <TabsTrigger value="declining">
                                <TrendingDown className="mr-2 h-4 w-4" />
                                En Declive
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="popular" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Categorías Más Populares</CardTitle>
                                <CardDescription>Las categorías de programas con más vistas y mejores reseñas.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="py-4">Categoría</TableHead>
                                            <TableHead className="py-4 text-right">Vistas</TableHead>
                                            <TableHead className="py-4 text-right">Reseñas</TableHead>
                                            <TableHead className="py-4 text-right">Crecimiento</TableHead>
                                            <TableHead className="py-4">Creador</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPopular.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="py-4 font-medium">{category.name}</TableCell>
                                                <TableCell className="py-4 text-right">{category.views.toLocaleString()}</TableCell>
                                                <TableCell className="py-4 text-right">{category.reviews}/5.0</TableCell>
                                                <TableCell className="py-4 text-right">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-green-50 rounded-full text-green-700 hover:bg-green-50 hover:text-green-700 dark:bg-green-800"
                                                    >
                                                        +{category.growth}%
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {category.isCreatedByUser ? (
                                                        <Badge variant="secondary" className="rounded-full">Tú</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="rounded-full">Otros</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="predicted" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Predicciones para el Próximo Mes</CardTitle>
                                <CardDescription>Categorías que se prevé tendrán alta demanda en el próximo mes.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="py-4">Categoría</TableHead>
                                            <TableHead className="py-4 text-right">Confianza</TableHead>
                                            <TableHead className="py-4">Tendencia</TableHead>
                                            <TableHead className="py-4">Creador</TableHead>
                                            <TableHead className="py-4"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPredicted.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="py-4 font-medium">{category.name}</TableCell>
                                                <TableCell className="py-4 text-right">{category.confidence}%</TableCell>
                                                <TableCell className="py-4">
                                                    {category.trend === "up" ? (
                                                        <Badge className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700 rounded-full">
                                                            <TrendingUp className="mr-1 h-3 w-3" />
                                                            En aumento
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="destructive" className="rounded-full">
                                                            <TrendingDown className="mr-1 h-3 w-3" />
                                                            En declive
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {category.isCreatedByUser ? (
                                                        <Badge variant="secondary" className="rounded-full">Tú</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="rounded-full">Otros</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {!category.isCreatedByUser && (
                                                        <Button variant="outline" size="sm">
                                                            <BookOpen className="mr-1 h-3 w-3" />
                                                            Crear programa
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="declining" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Categorías en Declive</CardTitle>
                                <CardDescription>Categorías que están perdiendo relevancia y demanda.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="py-4">Categoría</TableHead>
                                            <TableHead className="py-4 text-right">Declive</TableHead>
                                            <TableHead className="py-4">Tendencia</TableHead>
                                            <TableHead className="py-4">Creador</TableHead>
                                            <TableHead className="py-4"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredDeclining.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="py-4 font-medium">{category.name}</TableCell>
                                                <TableCell className="py-4 text-right">{category.decline}%</TableCell>
                                                <TableCell className="py-4">
                                                    <Badge variant="destructive" className="rounded-full">
                                                        <TrendingDown className="mr-1 h-3 w-3" />
                                                        En declive
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {category.isCreatedByUser ? (
                                                        <Badge variant="secondary" className="rounded-full">Tú</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="rounded-full">Otros</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {category.isCreatedByUser && (
                                                        <Button variant="outline" size="sm">
                                                            Actualizar
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default DashboardCategoriesAnalytics;