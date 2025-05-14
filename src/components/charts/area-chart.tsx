import { Area, AreaChart as AreaChartReChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useMediaQuery } from "@/hooks/use-media-query";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwindcss/defaultConfig";
import React from "react";
import { ColorContext } from "@/providers/ColorProvider";
import { LoaderCircle } from "lucide-react";

interface AreaChartProps {
    title?: string;
    description?: string;
    chartData: ChartItem[];
    labelValueToolTip?: String;
    loading?: boolean;
    className?: string;
}

interface ChartItem {
    month: String;
    count: number;
}

function AreaChart({
    title = "Area Chart - Stacked",
    description = "Showing total visitors for the last 6 months",
    chartData = [],
    labelValueToolTip = "count",
    loading,
    className
}: AreaChartProps) {

    const isDesktop = useMediaQuery("(min-width: 768px)");
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "oklch(0.588 0.158 241.966)",
        },
        count: {
            label: labelValueToolTip,
        }
    } satisfies ChartConfig

    const colorHook = React.useContext(ColorContext);
    const fullConfig = resolveConfig(tailwindConfig);
    function getTailwindColor(color: string, shade: number = 600): string {
        const colors = fullConfig.theme?.colors as Record<string, any>;
        if (colors[color]) {
            return typeof colors[color] === "string" ? colors[color] : colors[color]?.[shade] || null;
        }
        return "oklch(0.588 0.158 241.966)";
    }

    return (
        <Card className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg 
            transition-shadow duration-300 grid grid-rows-[auto_1fr] ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-[250px] w-full">
                        <LoaderCircle className="animate-spin text-zinc-400 dark:text-white" />
                    </div>
                ): (
                        <ChartContainer config = { chartConfig } className = "w-full max-h-[220px] overflow-hidden">
                    <AreaChartReChart
                        accessibilityLayer
                        data = { chartData }
                        margin = {{
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
                    tickFormatter={(value) => value.slice(0, isDesktop ? 5 : 3)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <defs>
                    <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor={getTailwindColor(colorHook ? colorHook.color : "sky", 600)}
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor={getTailwindColor(colorHook ? colorHook.color : "sky", 600)}
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="count"
                    fill="url(#fillDesktop)"
                    fillOpacity={0.4}
                    stroke={getTailwindColor(colorHook ? colorHook.color : "sky", 600)}
                    stackId="a"
                    type="monotone"
                    dot={{
                        fill: getTailwindColor(colorHook ? colorHook.color : "sky", 600),
                    }}
                    activeDot={{
                        r: 5,
                    }}
                >
                    <LabelList
                        position="top"
                        offset={6}
                        className="fill-foreground"
                        fontSize={12}
                    />
                </Area>
            </AreaChartReChart>
        </ChartContainer>
    )
}
            </CardContent >
        </Card >
    );
}

export default AreaChart;