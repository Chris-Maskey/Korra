"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, MapIcon, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AddLocationForm from "@/features/space/components/map/add-location-form";
import { PetShop } from "@/features/space/types";
import PetShopMap, {
  mockPetShops,
} from "@/features/space/components/map/pet-shop-map";

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredShops, setFilteredShops] = useState<PetShop[]>(mockPetShops);
  const [selectedService, setSelectedService] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("map");

  // Filter shops based on search query and selected service
  useEffect(() => {
    setIsLoading(true);

    // Simulate a small delay to show loading state
    const timer = setTimeout(() => {
      let filtered = mockPetShops;

      if (searchQuery) {
        filtered = filtered.filter(
          (shop) =>
            shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.description.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      if (selectedService) {
        filtered = filtered.filter((shop) =>
          shop.services.includes(selectedService),
        );
      }

      setFilteredShops(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedService]);

  const services = [
    { label: "Pet Supplies", value: "supplies" },
    { label: "Grooming", value: "grooming" },
    { label: "Veterinary", value: "veterinary" },
    { label: "Adoption", value: "adoption" },
    { label: "Training", value: "training" },
    { label: "Boarding", value: "boarding" },
    { label: "Daycare", value: "daycare" },
  ];

  return (
    <div className="bg-background">
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-4xl font-bold tracking-tight">
                    Pet Shop Locator
                  </h1>
                  <MapPin className="w-8 h-8 animate-bounce text-primary" />
                </div>
                <p className="text-muted-foreground mt-1">
                  Find pet shops and animal organizations near you
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for pet shops..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={activeTab === "map" ? "default" : "outline"}
                  onClick={() => {
                    setActiveTab("map");
                    document.getElementById("map-tab")?.click();
                  }}
                  className="gap-2"
                >
                  <MapIcon className="h-4 w-4" />
                  Map
                </Button>
                <Button
                  variant={activeTab === "list" ? "default" : "outline"}
                  onClick={() => {
                    setActiveTab("list");
                    document.getElementById("list-tab")?.click();
                  }}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  List
                </Button>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  selectedService === "" &&
                    "bg-primary text-primary-foreground",
                )}
                onClick={() => setSelectedService("")}
              >
                All Services
              </Badge>
              {services.map((service) => (
                <Badge
                  key={service.value}
                  variant="outline"
                  className={cn(
                    "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                    selectedService === service.value &&
                      "bg-primary text-primary-foreground",
                  )}
                  onClick={() => setSelectedService(service.value)}
                >
                  {service.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map and Listings Content */}
      <div className="container mx-auto px-4 pb-12 space-y-8">
        <Tabs
          defaultValue="map"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger id="map-tab" value="map">
              <MapIcon className="h-4 w-4 mr-2" />
              Map View
            </TabsTrigger>
            <TabsTrigger id="list-tab" value="list">
              <List className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-6">
            <div className="border rounded-lg overflow-hidden h-[600px] relative">
              <PetShopMap shops={filteredShops} />
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Pet Shops ({filteredShops.length})
              </h2>

              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="border rounded-lg overflow-hidden p-4 h-48"
                    >
                      <div className="animate-pulse flex flex-col h-full">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="flex gap-1 mb-4">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mt-auto"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredShops.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <p>No pet shops found matching your criteria.</p>
                  <p className="mt-2">Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredShops.map((shop) => (
                    <div
                      key={shop.id}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{shop.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {shop.address}
                        </p>
                        <div className="flex flex-wrap gap-1 my-2">
                          {shop.services.map((service) => (
                            <Badge
                              key={service}
                              variant="secondary"
                              className="text-xs"
                            >
                              {service}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm mt-2 line-clamp-2">
                          {shop.description}
                        </p>
                        {shop.phone && (
                          <p className="text-sm mt-2">📞 {shop.phone}</p>
                        )}
                        {shop.website && (
                          <a
                            href={shop.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline block mt-1"
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
