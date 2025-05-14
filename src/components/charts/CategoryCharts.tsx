import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"

interface CategoryChartsProps {
    popularCategories: any[]
    predictedCategories: any[]
    decliningCategories: any[]
}

function CategoryCharts({ popularCategories, predictedCategories, decliningCategories }: CategoryChartsProps) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const pieCanvasRef = React.useRef<HTMLCanvasElement>(null)
    const lineCanvasRef = React.useRef<HTMLCanvasElement>(null)

    React.useEffect(() => {
        // Gráfico de barras para categorías populares
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d")
            if (ctx) {
                // Limpiar el canvas
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

                const width = canvasRef.current.width
                const height = canvasRef.current.height
                const barWidth = width / (popularCategories.length * 2)
                const maxViews = Math.max(...popularCategories.map((cat) => cat.views))

                // Dibujar ejes
                ctx.beginPath()
                ctx.moveTo(40, 20)
                ctx.lineTo(40, height - 40)
                ctx.lineTo(width - 20, height - 40)
                ctx.strokeStyle = "#d1d5db"
                ctx.stroke()

                // Dibujar barras
                popularCategories.forEach((category, index) => {
                    const x = 60 + index * (barWidth * 2)
                    const barHeight = (category.views / maxViews) * (height - 80)

                    // Barra
                    ctx.fillStyle = category.isCreatedByUser ? "#8b5cf6" : "#d1d5db"
                    ctx.fillRect(x, height - 40 - barHeight, barWidth, barHeight)

                    // Etiqueta
                    ctx.fillStyle = "#6b7280"
                    ctx.font = "10px sans-serif"
                    ctx.textAlign = "center"
                    ctx.fillText(category.name.substring(0, 8), x + barWidth / 2, height - 25)

                    // Valor
                    ctx.fillStyle = "#6b7280"
                    ctx.font = "10px sans-serif"
                    ctx.textAlign = "center"
                    ctx.fillText(category.views.toLocaleString(), x + barWidth / 2, height - 40 - barHeight - 5)
                })

                // Título
                ctx.fillStyle = "#111827"
                ctx.font = "bold 12px sans-serif"
                ctx.textAlign = "center"
                ctx.fillText("Vistas por Categoría", width / 2, 15)
            }
        }

        // Gráfico circular para categorías en predicción
        if (pieCanvasRef.current) {
            const ctx = pieCanvasRef.current.getContext("2d")
            if (ctx) {
                // Limpiar el canvas
                ctx.clearRect(0, 0, pieCanvasRef.current.width, pieCanvasRef.current.height)

                const width = pieCanvasRef.current.width
                const height = pieCanvasRef.current.height

                const centerX = width / 2
                const centerY = height / 2
                const radius = Math.min(centerX, centerY) - 30

                const total = predictedCategories.reduce((sum, cat) => sum + cat.confidence, 0)
                let startAngle = 0

                // Título
                ctx.fillStyle = "#111827"
                ctx.font = "bold 12px sans-serif"
                ctx.textAlign = "center"
                ctx.fillText("Predicciones por Confianza", width / 2, 15)

                // Dibujar sectores
                predictedCategories.forEach(category => {
                    const sliceAngle = (category.confidence / total) * 2 * Math.PI

                    // Sector
                    ctx.beginPath()
                    ctx.moveTo(centerX, centerY)
                    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
                    ctx.closePath()

                    // Color basado en si es del usuario o no
                    ctx.fillStyle = category.isCreatedByUser ? "#8b5cf6" : "#d1d5db"
                    ctx.fill()

                    // Borde
                    ctx.strokeStyle = "#ffffff"
                    ctx.lineWidth = 1
                    ctx.stroke()

                    // Etiqueta
                    const labelAngle = startAngle + sliceAngle / 2
                    const labelX = centerX + radius * 0.7 * Math.cos(labelAngle)
                    const labelY = centerY + radius * 0.7 * Math.sin(labelAngle)

                    ctx.fillStyle = "#111827"
                    ctx.font = "9px sans-serif"
                    ctx.textAlign = "center"
                    ctx.fillText(category.name.substring(0, 6), labelX, labelY)

                    startAngle += sliceAngle
                })
            }
        }

        // Gráfico de líneas para categorías en declive
        if (lineCanvasRef.current) {
            const ctx = lineCanvasRef.current.getContext("2d")
            if (ctx) {
                // Limpiar el canvas
                ctx.clearRect(0, 0, lineCanvasRef.current.width, lineCanvasRef.current.height)

                const width = lineCanvasRef.current.width
                const height = lineCanvasRef.current.height
                const maxDecline = Math.max(...decliningCategories.map((cat) => cat.decline))

                // Dibujar ejes
                ctx.beginPath()
                ctx.moveTo(40, 20)
                ctx.lineTo(40, height - 40)
                ctx.lineTo(width - 20, height - 40)
                ctx.strokeStyle = "#d1d5db"
                ctx.stroke()

                // Dibujar línea
                ctx.beginPath()
                decliningCategories.forEach((category, index) => {
                    const x = 60 + index * ((width - 80) / (decliningCategories.length - 1))
                    const y = height - 40 - (category.decline / maxDecline) * (height - 80)

                    if (index === 0) {
                        ctx.moveTo(x, y)
                    } else {
                        ctx.lineTo(x, y)
                    }

                    // Puntos
                    ctx.fillStyle = category.isCreatedByUser ? "#ef4444" : "#f87171"
                    ctx.beginPath()
                    ctx.arc(x, y, 4, 0, 2 * Math.PI)
                    ctx.fill()

                    // Etiqueta
                    ctx.fillStyle = "#6b7280"
                    ctx.font = "10px sans-serif"
                    ctx.textAlign = "center"
                    ctx.fillText(category.name.substring(0, 8), x, height - 25)

                    // Valor
                    ctx.fillStyle = "#6b7280"
                    ctx.font = "10px sans-serif"
                    ctx.textAlign = "center"
                    ctx.fillText(`${category.decline}%`, x, y - 10)
                })

                ctx.strokeStyle = "#ef4444"
                ctx.lineWidth = 2
                ctx.stroke()

                // Título
                ctx.fillStyle = "#111827"
                ctx.font = "bold 12px sans-serif"
                ctx.textAlign = "center"
                ctx.fillText("Porcentaje de Declive", width / 2, 15)
            }
        }
    }, [popularCategories, predictedCategories, decliningCategories])

    return (
        <Tabs defaultValue="bar" className="w-full">
            <div className="overflow-auto">
                <TabsList className="mb-4">
                    <TabsTrigger value="bar">
                        <BarChart className="h-4 w-4 mr-2" />
                        Categorías Populares
                    </TabsTrigger>
                    <TabsTrigger value="pie">
                        <PieChart className="h-4 w-4 mr-2" />
                        Predicciones
                    </TabsTrigger>
                    <TabsTrigger value="line">
                        <LineChart className="h-4 w-4 mr-2" />
                        Tendencias de Declive
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="bar" className="w-full">
                <div className="w-full h-[300px] flex justify-center">
                    <canvas ref={canvasRef} width={600} height={300} className="w-full h-full" />
                </div>
                <div className="flex justify-center mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center mr-4">
                        <div className="w-3 h-3 bg-[#8b5cf6] mr-1 rounded-sm"></div>
                        <span>Tus categorías</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#d1d5db] mr-1 rounded-sm"></div>
                        <span>Otras categorías</span>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="pie" className="w-full">
                <div className="w-full h-[300px] flex justify-center">
                    <canvas ref={pieCanvasRef} width={600} height={300} className="w-full h-full" />
                </div>
                <div className="flex justify-center mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center mr-4">
                        <div className="w-3 h-3 bg-[#8b5cf6] mr-1 rounded-sm"></div>
                        <span>Tus categorías</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#d1d5db] mr-1 rounded-sm"></div>
                        <span>Otras categorías</span>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="line" className="w-full">
                <div className="w-full h-[300px] flex justify-center">
                    <canvas ref={lineCanvasRef} width={600} height={300} className="w-full h-full" />
                </div>
                <div className="flex justify-center mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center mr-4">
                        <div className="w-3 h-3 bg-[#ef4444] mr-1 rounded-sm"></div>
                        <span>Tus categorías</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#f87171] mr-1 rounded-sm"></div>
                        <span>Otras categorías</span>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    )
}

export default CategoryCharts;