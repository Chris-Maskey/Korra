"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PetShop } from "../../types";
import { Loader2 } from "lucide-react";

interface PetShopMapProps {
  shops: PetShop[];
}

export default function PetShopMap({ shops }: PetShopMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // eslint-disable-next-line
  const leafletMap = useRef<any>(null);
  // eslint-disable-next-line
  const markersLayerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to update markers
  const updateMarkers = useCallback(
    // eslint-disable-next-line
    async (L: any) => {
      if (!leafletMap.current || !markersLayerRef.current) return;

      // Clear existing markers
      markersLayerRef.current.clearLayers();

      // Create custom icon
      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // Add markers for each shop
      const markers = shops.map((shop) => {
        return L.marker([shop.latitude, shop.longitude], { icon }).bindPopup(
          `
          <div class="p-2">
            <h3 class="font-bold">${shop.name}</h3>
            <p class="text-sm">${shop.address}</p>
            <div class="flex flex-wrap gap-1 my-2">
              ${shop.services
                .map(
                  (service) =>
                    `<span class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">${service}</span>`
                )
                .join(" ")}
            </div>
            <p class="text-sm mt-2">${shop.description}</p>
            ${shop.phone ? `<p class="text-sm mt-2">📞 ${shop.phone}</p>` : ""}
            ${
              shop.website
                ? `<p class="text-sm mt-2"><a href="${shop.website}" target="_blank" class="text-blue-500 hover:underline">Visit Website</a></p>`
                : ""
            }
          </div>
        `,
          {
            maxWidth: 300,
            className: "custom-popup",
          }
        );
      });

      // Add all markers to the layer group
      markers.forEach((marker) => markersLayerRef.current.addLayer(marker));

      // If we have shops, fit the map to show all markers
      if (shops.length > 0 && markers.length > 0) {
        const group = L.featureGroup(markers);
        leafletMap.current.fitBounds(group.getBounds().pad(0.1));
      }
    },
    [shops]
  );

  // Initialize map after component mounts
  useEffect(() => {
    let isMounted = true;

    // Check if window is available (client-side)
    if (typeof window === "undefined") return;

    const initializeMap = async () => {
      try {
        setIsLoading(true);

        // Dynamically import Leaflet
        const L = (await import("leaflet")).default;

        // Import CSS
        // @ts-ignore
        await import("leaflet/dist/leaflet.css");

        // Make sure the map container exists and component is still mounted
        if (!mapRef.current || !isMounted) return;

        // Initialize map if not already initialized
        if (!leafletMap.current) {
          console.log("Initializing map...");

          // Create map centered on New York
          leafletMap.current = L.map(mapRef.current).setView(
            [40.7128, -74.006],
            13
          );

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(leafletMap.current);

          // Create a layer group for markers
          markersLayerRef.current = L.layerGroup().addTo(leafletMap.current);

          // Try to get user location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                if (leafletMap.current && isMounted) {
                  const { latitude, longitude } = position.coords;
                  leafletMap.current.setView([latitude, longitude], 13);
                }
              },
              (error) => {
                console.log("Geolocation error:", error);
              }
            );
          }

          setMapLoaded(true);
        }

        // Update markers
        updateMarkers(L);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading map:", error);
        setIsLoading(false);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      isMounted = false;
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markersLayerRef.current = null;
      }
    };
  }, [updateMarkers]); // Only run on mount

  // Update markers when shops change
  useEffect(() => {
    const updateMarkersForShops = async () => {
      if (!mapLoaded) return;

      try {
        const L = (await import("leaflet")).default;
        updateMarkers(L);
      } catch (error) {
        console.error("Error updating markers:", error);
      }
    };

    updateMarkersForShops();
  }, [shops, mapLoaded, updateMarkers]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (leafletMap.current) {
        leafletMap.current.invalidateSize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full h-full min-h-[500px] rounded-lg z-0"
      ></div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-2 text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      )}

      {/* Custom styles for popups */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          padding: 0;
          overflow: hidden;
          border-radius: 0.5rem;
        }
        .leaflet-popup-content {
          margin: 0;
          min-width: 200px;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          box-shadow: 0 3px 14px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
