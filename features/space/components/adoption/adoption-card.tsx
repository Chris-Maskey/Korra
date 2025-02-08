import Image from "next/image";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Heart, MessageCircle, Share } from "lucide-react";

type AdoptionCardProps = {
  name: string;
  breed: string;
  age: string;
  description: string;
};

const AdoptionCard = ({ name, breed, age, description }: AdoptionCardProps) => {
  return (
    <Card>
      <CardHeader className="p-0">
        <Image
          src="/placeholder.svg"
          alt="A cute dog sitting on a path"
          width={400}
          height={300}
          className="object-cover h-48 w-full rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {breed} • {age}
            </p>
          </div>
          <Button variant="ghost" size="icon">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        <p className="mt-2 text-sm line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1">
          <MessageCircle className="w-4 h-4 mr-2" />
          Connect
        </Button>
        <Button variant="outline" size="icon">
          <Share className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdoptionCard;
