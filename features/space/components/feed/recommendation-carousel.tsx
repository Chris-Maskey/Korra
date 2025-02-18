"use client";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

export function RecommendationCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      orientation="vertical"
      className="hidden md:block w-full max-w-xs"
    >
      <CarouselContent className="-mt-1 h-[400px]">
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index} className="pt-1 ">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center cursor-pointer p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
