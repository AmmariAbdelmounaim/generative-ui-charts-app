"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

interface BarData {
  dataKey: string;
  fill: string;
}

interface GraphComponentProps {
  chartConfig: ChartConfig;
  chartData: any[];
  cardTitle: string;
  cardDescription: string;
  xAxisLabel: string;
  indicator: "line" | "dashed" | "dot";
  barData: BarData[];
  cardFooter: string;
  cardFooter2: string;
}
export const BarChartComponent = ({
  chartConfig,
  chartData,
  cardTitle,
  cardDescription,
  xAxisLabel,
  indicator,
  barData,
  cardFooter,
  cardFooter2,
}: GraphComponentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisLabel}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator={indicator} />}
            />
            {barData.map((bar) => {
              return (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  fill={bar.fill}
                  radius={4}
                />
              );
            })}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">{cardFooter}</div>
        <div className="leading-none text-muted-foreground">{cardFooter2}</div>
      </CardFooter>
    </Card>
  );
};
