import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Rabbit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AdoptionCard from "@/features/space/components/adoption/adoption-card";
import CreateAdoptionDialog from "@/features/space/components/adoption/create-adoption-dialog";

export default function AdoptionPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden">
        <div className="" />
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-4xl font-bold">Pet Adoption</h1>
                  <Rabbit
                    className="w-8 h-8 animate-bounce text-primary"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
                <p className="text-muted-foreground mt-1">
                  Find your perfect companion today
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input className="pl-9" placeholder="Search for pets..." />
              </div>
              <div className="flex gap-2">
                <CreateAdoptionDialog />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                All Pets
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Dogs
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Cats
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Rabbits
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Birds
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Small Pets
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the content */}
      <div className="container mx-auto px-4 pb-12 space-y-8">
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Pets</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
          </TabsList>
          <TabsContent value="available" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AdoptionCard
                name="Korra"
                breed="Dog"
                age={"3 years"}
                description="Korra is a very friendly dog. She loves to play and cuddle."
              />
              <AdoptionCard
                name="Korra"
                breed="Dog"
                age={"3 years"}
                description="Korra is a very friendly dog. She loves to play and cuddle."
              />
              <AdoptionCard
                name="Korra"
                breed="Dog"
                age={"3 years"}
                description="Korra is a very friendly dog. She loves to play and cuddle."
              />
              <AdoptionCard
                name="Korra"
                breed="Dog"
                age={"3 years"}
                description="Korra is a very friendly dog. She loves to play and cuddle."
              />
            </div>
          </TabsContent>
          <TabsContent value="my-listings" className="mt-6">
            <div className="text-center text-muted-foreground py-12">
              <p>You haven't created any adoption listings yet.</p>
              <p className="mt-2">
                Click the "List for Adoption" button to get started.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
