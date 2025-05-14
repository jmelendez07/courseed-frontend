import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import React from "react";
import { ColorContext } from "@/providers/ColorProvider";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwindcss/defaultConfig";
import { LoaderCircle } from "lucide-react";

interface BarChartHorizontalProps {
    title?: String;
    description?: String;
    chartData: ChartItem[];
    labelValueToolTip?: String;
    loading?: boolean;
    className?: String;
} 

interface ChartItem {
    label: String;
    value: number;
}

function BarChartHorizontal({ 
    title = "Bar Chart - Horizontal",
    description = "January - June 2024",
    labelValueToolTip = "value",
    chartData,
    loading,
    className 
}: BarChartHorizontalProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
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
        desktop: {
            label: "Desktop",
            color: getTailwindColor(colorHook ? colorHook.color : "sky", 600),
        },
        value: {
            label: labelValueToolTip
        }
    } satisfies ChartConfig

    return (
        <Card className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg 
            transition-shadow duration-300 grid grid-rows-[auto_1fr] ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="max-h-full overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center w-full h-[220px]">
                        <LoaderCircle className="animate-spin text-zinc-400 dark:text-white" />
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="w-full max-h-[220px] overflow-hidden">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: isDesktop ? -180 : -100,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="label"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis 
                            dataKey="value" 
                            type="number" 
                            domain={[0, 8]}
                            hide
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="value"
                            layout="vertical"
                            fill="var(--color-desktop)"
                            radius={4}
                        >
                            <LabelList
                                dataKey="label"
                                position="insideLeft"
                                offset={8}
                                fill="#fff"
                                fontSize={12}
                                formatter={(value: string) => value.slice(0, isDesktop ? 20 : 15) + "..."}
                            />
                            <LabelList
                                dataKey="value"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                                formatter={(value: number) => Number(value.toFixed(2)) + "⭐"}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}

export default BarChartHorizontal;