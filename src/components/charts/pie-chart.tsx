import { LabelList, Pie, PieChart as PieChartRechart } from "recharts";

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
import { LoaderCircle } from "lucide-react";

interface PieChartProps {
    title?: string;
    description?: string;
    chartData: ChartItem[];
    loading?: boolean;
    className?: string;
}

interface ChartItem {
    label: string;
    value: number;
    fill: string;
}

function renderLabel(props: any) {
    if (typeof props === "string") {
        return props.slice(0, 10) + "...";
    } else {
        return "";
    }
};

function PieChart({
    title = "Pie Chart - Label List",
    description = "January - June 2024",
    chartData,
    loading,
    className
}: PieChartProps) {
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#991b1b",
        }
    } satisfies ChartConfig

    return (
        <Card className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg 
            transition-shadow duration-300 grid grid-rows-[auto_1fr] ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center w-full h-[250px]">
                        <LoaderCircle className="animate-spin text-zinc-400 dark:text-white" />
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-h-[250px] overflow-hidden">
                        <PieChartRechart>
                            <ChartTooltip
                                content={<ChartTooltipContent nameKey="value" hideLabel />}
                            />
                            <Pie data={chartData} dataKey="value" nameKey="label" label>
                                <LabelList
                                    dataKey="label"
                                    offset={8}
                                    fontWeight={2}
                                    fontSize={12}
                                    className="fill-foreground"
                                    formatter={renderLabel}
                                />
                            </Pie>
                        </PieChartRechart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}

export default PieChart;