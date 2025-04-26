import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketplaceTable from "./marketplace-table";
import { getMarketplaceOrders } from "../../actions/dashboard/get-marketplace-revenue";
import AdoptionTable from "./adoption-table";
import { getUserListedAdoptions } from "../../actions/adoption/get-user-listed-adoptions";

export const DashboardTable = async () => {
  const marketplaceOrders = await getMarketplaceOrders();
  const adoptionList = await getUserListedAdoptions();

  return (
    <Tabs defaultValue="marketplace">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        <TabsTrigger value="adoption">Adoptions</TabsTrigger>
      </TabsList>
      <TabsContent value="marketplace">
        <MarketplaceTable marketplaceOrders={marketplaceOrders} />
      </TabsContent>
      <TabsContent value="adoption">
        <AdoptionTable adoptionList={adoptionList} />
      </TabsContent>
    </Tabs>
  );
};
