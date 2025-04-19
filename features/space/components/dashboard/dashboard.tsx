import { ChartLine } from "lucide-react";
import { getAdoptionStats } from "../../actions/dashboard/get-adoption-stats";
import {
  getDashboardMarketplaceRevenue,
  getTotalMarketplaceRevenue,
} from "../../actions/dashboard/get-marketplace-revenue";
import { getUserEngagement } from "../../actions/dashboard/get-user-engagement";
import { RevenueChart } from "./revenue-chart";
import { SectionCard } from "./section-card";
import { DashboardTable } from "./dashboard-table";
import { AdoptionChart } from "./adoption-chart";
import { UserEngagementChart } from "./user-engagement-chart";

export type SectionCardType = {
  title: string;
  description: string;
  value: string;
  badgeValue: string;
  trend: "up" | "down" | "noChange";
  previousValue: string;
  period: string;
};

export const Dashboard = async () => {
  const martketplaceRevenue = await getDashboardMarketplaceRevenue();
  const engagement = await getUserEngagement();
  const adoption = await getAdoptionStats();
  const chartData = await getTotalMarketplaceRevenue();

  const determineTrend = (
    current: number,
    previous: number,
  ): "up" | "down" | "noChange" => {
    if (current > previous) {
      return "up";
    } else if (current < previous) {
      return "down";
    } else {
      return "noChange";
    }
  };

  const sectionCardData: SectionCardType[] = [
    {
      title: "Marketplace Revenue",
      description: "Revenue generated from all marketplace sales this month.",
      value: `$${martketplaceRevenue.currentMonthRevenue.toFixed(2)}`,
      badgeValue: `${
        determineTrend(
          martketplaceRevenue.currentMonthRevenue,
          martketplaceRevenue.previousMonthRevenue,
        ) === "noChange"
          ? "0"
          : martketplaceRevenue.revenueGrowth.toFixed(1)
      }%`,
      trend: determineTrend(
        martketplaceRevenue.currentMonthRevenue,
        martketplaceRevenue.previousMonthRevenue,
      ),
      previousValue: `$${martketplaceRevenue.previousMonthRevenue.toFixed(2)}`,
      period: "vs. Last Month",
    },
    {
      title: "User Engagement",
      description:
        "Total user interactions (clicks, views, etc.) within the platform this month.",
      value: `${engagement.currentMonthEngagement.toFixed(0)}`,
      badgeValue: `${
        determineTrend(
          engagement.currentMonthEngagement,
          engagement.previousMonthEngagement,
        ) === "noChange"
          ? "0"
          : engagement.engagementGrowth.toFixed(1)
      }%`,
      trend: determineTrend(
        engagement.currentMonthEngagement,
        engagement.previousMonthEngagement,
      ),
      previousValue: `${engagement.previousMonthEngagement.toFixed(0)}`,
      period: "vs. Last Month",
    },
    {
      title: "Pet Adoption",
      description:
        "Number of pets adopted by users within the platform this month.",
      value: `${adoption.currentMonthAdoption.toFixed(0)}`,
      badgeValue: `${
        determineTrend(
          adoption.currentMonthAdoption,
          adoption.previousMonthAdoption,
        ) === "noChange"
          ? "0"
          : adoption.adoptionGrowth.toFixed(1)
      }%`,
      trend: determineTrend(
        adoption.currentMonthAdoption,
        adoption.previousMonthAdoption,
      ),
      previousValue: `${adoption.previousMonthAdoption.toFixed(0)}`,
      period: "vs. Last Month",
    },
  ];

  return (
    <div className="py-8 px-4 space-y-4">
      <div className="flex items-center gap-2 py-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <ChartLine className="w-8 h-8 animate-bounce text-primary" />
          </div>
          <p className="text-muted-foreground mt-1">
            Your data, visualized. Understand your performance instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectionCardData.map((card, index) => (
          <SectionCard
            key={index}
            title={card.title}
            description={card.description}
            value={card.value}
            badgeValue={card.badgeValue}
            trend={card.trend}
            previousValue={card.previousValue}
            period={card.period}
          />
        ))}
      </div>
      <RevenueChart data={chartData} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdoptionChart />
        <UserEngagementChart />
      </div>
      <DashboardTable />
    </div>
  );
};
