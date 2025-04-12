"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, MapIcon, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import PetShopMap from "@/features/space/components/map/pet-shop-map";
import { useGetPetShopLocation } from "@/features/space/hooks/adoption/map/use-get-petshop-location";
import { SERVICES } from "@/features/space/constants";
import PetShopFilters from "@/features/space/components/map/pet-shop-filters";
import PetShopList from "@/features/space/components/map/pet-shop-list";

export default function MapPage() {
  const { data: petShops = [], isLoading, error } = useGetPetShopLocation();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("map");

  // Apply filters using useMemo to avoid unnecessary recalculations
  const filteredShops = useMemo(() => {
    if (!petShops.length) return [];

    let result = [...petShops];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (shop) =>
          shop.name.toLowerCase().includes(query) ||
          shop.address.toLowerCase().includes(query) ||
          shop.description.toLowerCase().includes(query),
      );
    }

    // Apply service filter
    if (selectedService) {
      result = result.filter((shop) => shop.services.includes(selectedService));
    }

    return result;
  }, [petShops, searchQuery, selectedService]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle service selection
  const handleServiceChange = (service: string) => {
    setSelectedService(service === selectedService ? "" : service);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // If there's an error fetching data
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          Error loading pet shops
        </h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="relative">
        <div className="container mx-auto px-4 py-8 relative">
          <header className="mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Pet Shop Locator
              </h1>
              <MapPin
                className="w-8 h-8 animate-bounce text-primary"
                aria-hidden="true"
              />
            </div>
            <p className="text-muted-foreground mt-1">
              Find pet shops and animal organizations near you
            </p>
          </header>

          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
                aria-hidden="true"
              />
              <Input
                className="pl-9"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for pet shops..."
                aria-label="Search for pet shops"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={activeTab === "map" ? "default" : "outline"}
                onClick={() => handleTabChange("map")}
                className="gap-2"
                aria-pressed={activeTab === "map"}
              >
                <MapIcon className="h-4 w-4" aria-hidden="true" />
                <span>Map</span>
              </Button>
              <Button
                variant={activeTab === "list" ? "default" : "outline"}
                onClick={() => handleTabChange("list")}
                className="gap-2"
                aria-pressed={activeTab === "list"}
              >
                <List className="h-4 w-4" aria-hidden="true" />
                <span>List</span>
              </Button>
            </div>
          </div>

          {/* Service Filters */}
          <PetShopFilters
            selectedService={selectedService}
            onServiceChange={handleServiceChange}
            services={SERVICES}
          />
        </div>
      </div>

      {/* Map and Listings Content */}
      <div className="container mx-auto px-4 pb-12">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">
              <MapIcon className="h-4 w-4 mr-2" aria-hidden="true" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" aria-hidden="true" />
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-6">
            <div className="border rounded-lg overflow-hidden h-[600px] relative">
              <PetShopMap shops={filteredShops} />
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <PetShopList
              shops={filteredShops}
              isLoading={isLoading}
              searchQuery={searchQuery}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
