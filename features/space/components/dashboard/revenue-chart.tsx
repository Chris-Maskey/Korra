"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

type ChartData = Array<{
  total_price: number;
  order_date: string;
}>;

export function RevenueChart({ data }: { data: ChartData }) {
  const formattedData = data.map((item) => ({
    ...item,
    revenue: item.total_price,
    date: item.order_date,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle> Marketplace Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={formattedData} margin={{ left: 20, right: 20 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.revenue.color} // Using the defined color
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.revenue.color} // Using the defined color
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={chartConfig.revenue.color} // Using the defined color
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
