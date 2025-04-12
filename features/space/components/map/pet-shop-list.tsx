import { Badge } from "@/components/ui/badge";
import type { PetShop } from "@/features/space/types";
import { ExternalLink, Phone } from "lucide-react";

interface PetShopListProps {
  shops: PetShop[];
  isLoading: boolean;
  searchQuery: string;
}

/**
 * PetShopList Component
 *
 * Displays a grid of pet shop cards with shop details
 */
export default function PetShopList({
  shops,
  isLoading,
  searchQuery,
}: PetShopListProps) {
  if (isLoading) {
    return <PetShopListSkeleton />;
  }

  if (shops.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p>No pet shops found matching your criteria.</p>
        {searchQuery && (
          <p className="mt-2">
            No results for "<strong>{searchQuery}</strong>". Try a different
            search term.
          </p>
        )}
        <p className="mt-2">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pet Shops ({shops.length})</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <PetShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </div>
  );
}

function PetShopCard({ shop }: { shop: PetShop }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="font-bold text-lg">{shop.name}</h3>
        <p className="text-sm text-muted-foreground">{shop.address}</p>

        <div className="flex flex-wrap gap-1 my-2">
          {shop.services.map((service) => (
            <Badge key={service} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
        </div>

        <p className="text-sm mt-2 line-clamp-2">{shop.description}</p>

        {shop.phone && (
          <div className="flex items-center gap-1 text-sm mt-2">
            <Phone className="h-3 w-3" aria-hidden="true" />
            <a href={`tel:${shop.phone}`} className="hover:underline">
              {shop.phone}
            </a>
          </div>
        )}

        {shop.website && (
          <div className="flex items-center gap-1 mt-1">
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
            <a
              href={shop.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function PetShopListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="border rounded-lg overflow-hidden p-4 h-48"
          aria-hidden="true"
        >
          <div className="animate-pulse flex flex-col h-full">
            <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="flex gap-1 mb-4">
              <div className="h-6 bg-muted rounded w-16"></div>
              <div className="h-6 bg-muted rounded w-16"></div>
            </div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4 mt-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
