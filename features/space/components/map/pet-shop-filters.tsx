"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ServiceOption } from "@/features/space/types";

interface PetShopFiltersProps {
  selectedService: string;
  onServiceChange: (service: string) => void;
  services: ServiceOption[];
}

/**
 * PetShopFilters Component
 *
 * Displays a horizontal scrollable list of service filters
 */
export default function PetShopFilters({
  selectedService,
  onServiceChange,
  services,
}: PetShopFiltersProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin"
      role="radiogroup"
      aria-label="Filter by service"
    >
      <Badge
        variant="outline"
        className={cn(
          "cursor-pointer hover:bg-primary hover:text-primary-foreground",
          selectedService === "" && "bg-primary text-primary-foreground",
        )}
        onClick={() => onServiceChange("")}
        role="radio"
        aria-checked={selectedService === ""}
        tabIndex={selectedService === "" ? 0 : -1}
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
          onClick={() => onServiceChange(service.value)}
          role="radio"
          aria-checked={selectedService === service.value}
          tabIndex={selectedService === service.value ? 0 : -1}
        >
          {service.label}
        </Badge>
      ))}
    </div>
  );
}
