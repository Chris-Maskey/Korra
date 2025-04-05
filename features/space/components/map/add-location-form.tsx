"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Store,
  MapIcon,
  Phone,
  Globe,
  FileText,
  Save,
  Loader2,
  ImageIcon,
  Building,
  Navigation,
  Mail,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PetShop } from "../../types";
import { mockPetShops } from "./pet-shop-map";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Please enter a valid address" }),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  services: z
    .array(z.string())
    .min(1, { message: "Select at least one service" }),
  phone: z.string().optional(),
  website: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .optional()
    .or(z.literal("")),
  openingHours: z.string().optional(),
});

const serviceOptions = [
  { id: "supplies", label: "Pet Supplies" },
  { id: "grooming", label: "Grooming" },
  { id: "veterinary", label: "Veterinary" },
  { id: "adoption", label: "Adoption" },
  { id: "training", label: "Training" },
  { id: "boarding", label: "Boarding" },
  { id: "daycare", label: "Daycare" },
];

export default function AddLocationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shopImagePreview, setShopImagePreview] = useState<string | null>(null);
  const [mapPreview, setMapPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      description: "",
      services: [],
      phone: "",
      website: "",
      email: "",
      openingHours: "",
    },
  });

  const handleShopImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setShopImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMapImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMapPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to save to Supabase
      // For now, we'll just simulate adding to our mock data
      const newShop: PetShop = {
        id: (mockPetShops.length + 1).toString(),
        name: values.name,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude,
        description: values.description,
        services: values.services,
        phone: values.phone || undefined,
        website: values.website || undefined,
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, we would update the state with the new shop
      console.log("New shop added:", newShop);

      toast.success("Location added successfully");

      form.reset();
      setShopImagePreview(null);
      setMapPreview(null);

      // Navigate back to map view
      router.push("/map");
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error("Failed to add location");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude);
          form.setValue("longitude", position.coords.longitude);
          toast.success("Location retrieved successfully");
        },
        (error) => {
          let errorMessage = "Failed to retrieve location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permission to access location was denied";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out";
              break;
            default:
              errorMessage = "Failed to retrieve location";
          }

          toast.error(errorMessage);
        },
      );
    } else {
      toast.error("Geolocation is not supported by this browser");
    }
  };

  return (
    <Card className="border shadow-md overflow-hidden max-w-screen-md mx-auto">
      <CardHeader className="bg-muted/50 border-b">
        <CardTitle>Add Pet Shop Location</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Shop Image Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <FormLabel className="text-base">Shop Image</FormLabel>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" type="button" className="gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Upload Image
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Upload Shop Image</SheetTitle>
                      <SheetDescription>
                        Upload an image of your pet shop to help customers
                        recognize your business. Recommended size: 1200x800
                        pixels.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative w-full h-40 rounded-md overflow-hidden border border-border">
                          {shopImagePreview ? (
                            <div
                              className="w-full h-full bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${shopImagePreview})`,
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted/50">
                              <Store className="h-10 w-10 text-muted-foreground/60" />
                            </div>
                          )}
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                          <Label htmlFor="shop_image">Upload Image</Label>
                          <Input
                            id="shop_image"
                            type="file"
                            accept="image/*"
                            onChange={handleShopImageChange}
                          />
                          <p className="text-xs text-muted-foreground">
                            Maximum file size: 10MB. Supported formats: JPEG,
                            PNG, GIF.
                          </p>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="relative w-full h-40 rounded-md overflow-hidden border border-border">
                {shopImagePreview ? (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${shopImagePreview})` }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/30 to-primary/10">
                    <p className="text-muted-foreground text-sm">
                      No shop image selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Basic Information */}
            <div className="grid gap-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="h-5 w-1 bg-primary rounded-full"></span>
                Basic Information
              </h3>

              {/* Shop Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      Shop Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Happy Paws Pet Shop" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St, City, State, ZIP"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Coordinates */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location Coordinates
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    className="gap-2"
                  >
                    <Navigation className="h-4 w-4" />
                    Use Current Location
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Map Preview */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <FormLabel className="text-base">Location Map</FormLabel>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" type="button" className="gap-2">
                        <MapIcon className="h-4 w-4" />
                        Upload Map Image
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Upload Map Image</SheetTitle>
                        <SheetDescription>
                          Upload a map image showing your location to help
                          customers find you.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="relative w-full h-40 rounded-md overflow-hidden border border-border">
                            {mapPreview ? (
                              <div
                                className="w-full h-full bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${mapPreview})`,
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                <MapIcon className="h-10 w-10 text-muted-foreground/60" />
                              </div>
                            )}
                          </div>
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="map_image">Upload Map</Label>
                            <Input
                              id="map_image"
                              type="file"
                              accept="image/*"
                              onChange={handleMapImageChange}
                            />
                            <p className="text-xs text-muted-foreground">
                              Maximum file size: 10MB. Supported formats: JPEG,
                              PNG, GIF.
                            </p>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="relative w-full h-40 rounded-md overflow-hidden border border-border">
                  {mapPreview ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${mapPreview})` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50">
                      <p className="text-muted-foreground text-sm">
                        No map image selected
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your pet shop and the services you offer..."
                        className="min-h-32 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of your pet shop to help
                      customers understand what you offer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="h-5 w-1 bg-primary rounded-full"></span>
                Services Offered
              </h3>

              <FormField
                control={form.control}
                name="services"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {serviceOptions.map((service) => (
                        <FormField
                          key={service.id}
                          control={form.control}
                          name="services"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={service.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(service.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            service.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== service.id,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {service.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="h-5 w-1 bg-primary rounded-full"></span>
                Contact Information
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="contact@yourpetshop.com"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Website */}
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.yourpetshop.com"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Opening Hours */}
                <FormField
                  control={form.control}
                  name="openingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Opening Hours
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mon-Fri: 9am-6pm, Sat: 10am-4pm"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/map")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Add Location
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
