import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketplaceTable from "./marketplace-table";
import { getMarketplaceOrders } from "../../actions/dashboard/get-marketplace-revenue";

export const DashboardTable = async () => {
  const marketplaceOrders = await getMarketplaceOrders();

  return (
    <Tabs>
      <TabsList defaultValue="marketplace" className="grid w-full grid-cols-2">
        <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        <TabsTrigger value="adoption">Adoptions</TabsTrigger>
      </TabsList>
      <TabsContent value="marketplace">
        <MarketplaceTable marketplaceOrders={marketplaceOrders} />
      </TabsContent>
      <TabsContent value="adoption">
        <p>Adoptions</p>
      </TabsContent>
    </Tabs>
  );
};
