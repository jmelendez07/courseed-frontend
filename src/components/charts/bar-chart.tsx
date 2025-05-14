import { Bar, BarChart as BarChartRechart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ColorContext } from "@/providers/ColorProvider";
import React from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwindcss/defaultConfig";
import { LoaderCircle } from "lucide-react";

interface BarChartProps {
    title?: string;
    chartData: ChartItem[];
    description?: string;
    labelBar1?: string;
    labelBar2?: string;
    loading?: boolean;
    className?: string;
}

interface ChartItem {
    label: string;
    bar1: number;
    bar2: number;
}

function BarChart({ 
    title="Bar Chart - Multiple",
    description="January - June 2024",
    chartData,
    labelBar1="Desktop",
    labelBar2="Mobile",
    loading,
    className
}: BarChartProps) {

    const colorHook = React.useContext(ColorContext);
    const fullConfig = resolveConfig(tailwindConfig);
    function getTailwindColor(color: string, shade: number = 600): string {
        const colors = fullConfig.theme?.colors as Record<string, any>;
        if (colors[color]) {
          return typeof colors[color] === "string" ? colors[color] : colors[color]?.[shade] || null;
        }
        return "oklch(0.588 0.158 241.966)";
    }
    
    const chartConfig = {
        bar1: {
            label: labelBar1,
            color: getTailwindColor(colorHook ? colorHook.color : "sky", 600),
        },
        bar2: {
            label: labelBar2,
            color: getTailwindColor(colorHook ? colorHook.color : "sky", 500),
        },
    } satisfies ChartConfig

    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <Card
            className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg 
            transition-shadow duration-300 grid grid-rows-[auto_1fr] ${className}`}
        >
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent
                className="max-h-full overflow-hidden"
            >
                {loading ? (
                    <div className="h-[250px] w-full flex items-center justify-center">
                        <LoaderCircle className="animate-spin text-zinc-400 dark:text-white" />
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="w-full max-h-[250px] overflow-hidden">
                        <BarChartRechart accessibilityLayer data={chartData}>
                            <CartesianGrid stroke="#e2e8f0" vertical={false} />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, isDesktop ? 5 : 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent
                                    indicator="dot"
                                />}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="bar1" fill="var(--color-bar1)" radius={4} />
                            <Bar dataKey="bar2" fill="var(--color-bar2)" radius={4} />
                        </BarChartRechart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>

    );
}

export default BarChart;