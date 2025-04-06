"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  AtSign,
  User,
  Mail,
  LinkIcon,
  Instagram,
  Twitter,
  Book,
  Save,
  Loader2,
  ImageIcon,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { settingSchema } from "@/features/auth/schema";
import { useUpdateUser } from "@/features/auth/hooks/use-update-user";
import AddLocationForm from "@/features/space/components/map/add-location-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ProfileFormValues = z.infer<typeof settingSchema>;

export default function Settings() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("profile");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      full_name: "",
      user_name: "",
      bio: "",
      email: "",
      website: "",
      instagram: "",
      twitter: "",
      avatar_url: "",
      banner_url: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        full_name: user.full_name || "",
        user_name: user.user_name || "",
        bio: user.bio || "",
        email: user.email || "",
        website: user.website || "",
        instagram: user.instagram || "",
        twitter: user.twitter || "",
        avatar_url: user.avatar_url || "",
        banner_url: user.banner_url || "",
      });

      setAvatarPreview(user.avatar_url || null);
      setBannerPreview(user.banner_url || null);
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    updateUser(data);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large. Maximum size is 5MB.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    form.setValue("avatar_image", file);
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large. Maximum size is 5MB.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setBannerPreview(e.target?.result as string);
    };
    form.setValue("banner_image", file);
    reader.readAsDataURL(file);
  };

  if (userLoading) {
    return (
      <div className="container mx-auto py-8 px-4 h-full md:px-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Update your profile information and manage your pet shop locations
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="profile"
        className="max-w-screen-md"
        onValueChange={setActiveTab}
      >
        <TabsList
          className={cn(
            "grid w-full mb-8",
            user?.role === "ORGANIZATION" ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile Settings
          </TabsTrigger>
          {user?.role === "ORGANIZATION" && (
            <TabsTrigger value="locations" className="gap-2">
              <MapPin className="h-4 w-4" />
              Pet Shop Locations
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <Card className="border shadow-md overflow-hidden max-w-screen-md mx-auto">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Banner Section */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                      <FormLabel className="text-base">
                        Profile Banner
                      </FormLabel>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            type="button"
                            className="gap-2"
                          >
                            <ImageIcon className="h-4 w-4" />
                            Change Banner
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Upload Banner Image</SheetTitle>
                            <SheetDescription>
                              Upload a new banner image for your profile.
                              Recommended size: 1500x500 pixels.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="flex flex-col items-center justify-center gap-4">
                              <div className="relative w-full h-40 rounded-md overflow-hidden border border-border">
                                {bannerPreview ? (
                                  <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{
                                      backgroundImage: `url(${bannerPreview})`,
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                    <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
                                  </div>
                                )}
                              </div>
                              <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="banner">Upload Banner</Label>
                                <Input
                                  id="banner_url"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleBannerChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Maximum file size: 10MB. Supported formats:
                                  JPEG, PNG, GIF.
                                </p>
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>

                    <div className="relative w-full h-40 rounded-md overflow-hidden border border-border">
                      {bannerPreview ? (
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${bannerPreview})` }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/30 to-primary/10">
                          <p className="text-muted-foreground text-sm">
                            No banner image selected
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <Avatar className="h-24 w-24 border border-primary shadow-lg">
                      <AvatarImage
                        src={avatarPreview || "/placeholder.svg"}
                        alt="Profile picture"
                      />
                      <AvatarFallback className="text-lg">
                        {form
                          .getValues("full_name")
                          ?.substring(0, 2)
                          .toUpperCase() || "JD"}
                      </AvatarFallback>
                    </Avatar>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" type="button">
                          Change Avatar
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Upload Profile Picture</SheetTitle>
                          <SheetDescription>
                            Upload a new profile picture to personalize your
                            account.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <Avatar className="h-32 w-32 border-2 border-primary shadow-lg">
                              <AvatarImage
                                src={avatarPreview || "/placeholder.svg"}
                                alt="Profile picture preview"
                              />
                              <AvatarFallback className="text-xl">
                                {form
                                  .getValues("full_name")
                                  ?.substring(0, 2)
                                  .toUpperCase() || "JD"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="grid w-full items-center gap-1.5">
                              <Label htmlFor="avatar">Upload Image</Label>
                              <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                              />
                              <p className="text-xs text-muted-foreground">
                                Maximum file size: 5MB. Supported formats: JPEG,
                                PNG, GIF.
                              </p>
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>

                  <Separator className="my-4" />

                  {/* Profile Fields */}
                  <div className="grid gap-6">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Username */}
                    <FormField
                      control={form.control}
                      name="user_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <AtSign className="h-4 w-4" />
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="yourusername" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your username will be used in your profile URL
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bio */}
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Book className="h-4 w-4" />
                            Bio
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself and your pets"
                              className="min-h-32 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Write a short bio to introduce yourself to other pet
                            lovers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contact Information */}
                    <div className="pt-2">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="h-5 w-1 bg-primary rounded-full"></span>
                        Contact Information
                      </h3>

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
                                placeholder="your.email@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Your email will not be displayed publicly
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Website */}
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" />
                            Website
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://yourwebsite.com"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Add your personal or business website
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Social Media */}
                    <div className="pt-2">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="h-5 w-1 bg-primary rounded-full"></span>
                        Social Media
                      </h3>

                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Instagram */}
                        <FormField
                          control={form.control}
                          name="instagram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Instagram className="h-4 w-4" />
                                Instagram
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="username"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormDescription>
                                Just your username, not the full URL
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Twitter */}
                        <FormField
                          control={form.control}
                          name="twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Twitter className="h-4 w-4" />
                                Twitter
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="username"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormDescription>
                                Just your username, not the full URL
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="gap-2"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role === "ORGANIZATION" && (
          <TabsContent value="locations">
            <AddLocationForm />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
