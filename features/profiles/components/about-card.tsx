import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tables } from "@/database.types";
import { Instagram, LinkIcon, Mail, Twitter } from "lucide-react";

export const AboutCard = ({ profile }: { profile: Tables<"profiles"> }) => {
  return (
    <Card className="border shadow-md">
      <CardContent className="p-6 space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="h-5 w-1 bg-primary rounded-full"></span>
            About
          </h3>
          <p className="text-foreground/80">
            {profile.bio || "No bio provided"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="h-5 w-1 bg-primary rounded-full"></span>
            Contact Information
          </h3>
          <div className="flex flex-col gap-3">
            {profile.email && (
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span>{profile.email}</span>
              </div>
            )}

            {profile.website && (
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                  <LinkIcon className="h-4 w-4 text-primary" />
                </div>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-primary transition-colors"
                >
                  {profile.website}
                </a>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="h-5 w-1 bg-primary rounded-full"></span>
            Social Media
          </h3>
          <div className="flex gap-3">
            {profile.instagram && (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                asChild
              >
                <a
                  href={`https://instagram.com/${profile.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
            )}

            {profile.twitter && (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                asChild
              >
                <a
                  href={`https://twitter.com/${profile.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
