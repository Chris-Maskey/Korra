import { Minus, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionCardType } from "./dashboard";

export function SectionCard({
  title,
  description,
  value,
  badgeValue,
  trend,
  previousValue,
  period,
}: SectionCardType) {
  let trendMessage = "";
  let trendIcon = null;

  if (trend === "down") {
    trendMessage = "Decreased this month";
    trendIcon = <TrendingDownIcon className="size-4" />;
  } else if (trend === "up") {
    trendMessage = "Increased this month";
    trendIcon = <TrendingUpIcon className="size-4" />;
  } else {
    trendMessage = "No change this month";
    trendIcon = <Minus className="size-4" />;
  }

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            {trend === "down" ? (
              <TrendingDownIcon className="size-3" />
            ) : trend === "up" ? (
              <TrendingUpIcon className="size-3" />
            ) : (
              <Minus className="size-3" />
            )}
            {badgeValue}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {trendMessage} {trendIcon}
        </div>
        <div className="text-muted-foreground">{description}</div>
        <div className="text-muted-foreground">
          {period}: {previousValue}
        </div>
      </CardFooter>
    </Card>
  );
}
