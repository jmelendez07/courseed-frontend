import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RadarChartRechart } from "recharts"
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
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 285 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 203 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 264 },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface RadarChartProps {
    title: string;
    description: string;
}

function RadarChart({ title, description }: RadarChartProps) {
    return (
        <Card className="bg-white border border-gray-200 rounded-lg hover:shadow-lg 
        transition-shadow duration-300 grid grid-rows-[auto_1fr]">
          <CardHeader className="pb-4">
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-full overflow-hidden">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadarChartRechart data={chartData}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarGrid className="fill-[--color-desktop] opacity-20" />
                <PolarAngleAxis dataKey="month" />
                <Radar
                  dataKey="desktop"
                  fill="var(--color-desktop)"
                  fillOpacity={0.5}
                />
              </RadarChartRechart>
            </ChartContainer>
          </CardContent>
        </Card>
      )
}

export default RadarChart;