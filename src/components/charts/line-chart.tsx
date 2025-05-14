import { CartesianGrid, LabelList, Line, LineChart as LineChartRechart, XAxis } from "recharts";
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
import tailwindConfig from "tailwindcss/defaultConfig";
import React from "react";
import { ColorContext } from "@/providers/ColorProvider";
import resolveConfig from "tailwindcss/resolveConfig";
import { LoaderCircle } from "lucide-react";

interface LineChartProps {
    title?: string;
    description?: string;
    chartData: ChartItem[];
    labelValueToolTip?: String;
    loading?: boolean;
    className?: String;
}

interface ChartItem {
    month: String;
    count: number;
}

function LineChart({ 
    title="Line Chart - Label",
    description="January - June 2024",
    labelValueToolTip="count",
    chartData,
    loading,
    className
}: LineChartProps) {
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
        count: {
            label: labelValueToolTip,
        }
    } satisfies ChartConfig

    return (
        <Card className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg 
            transition-shadow duration-300 grid grid-rows-[auto_1fr] ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="max-h-full">
                {loading ? (
                    <div className="flex items-center justify-center w-full h-[220px]">
                        <LoaderCircle className="animate-spin text-zinc-400 dark:text-white" />
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="w-full max-h-[220px] overflow-visible">
                    <LineChartRechart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                            left: 30,
                            right: 30,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => isDesktop ? value.slice(0, 15) + "..." : value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent 
                                    indicator="line"
                                />
                            }
                        />
                        <Line
                            dataKey="count"
                            type="natural"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-desktop)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Line>
                    </LineChartRechart>
                </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}

export default LineChart;