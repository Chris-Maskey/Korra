import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

const CreateAdoptionDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          List for Adoption
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Adoption Listing</DialogTitle>
          <DialogDescription>
            Fill out the details about the pet you want to put up for adoption.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="pet-name">Pet Name</Label>
            <Input id="pet-name" placeholder="Enter pet's name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pet-type">Pet Type</Label>
            <Input id="pet-type" placeholder="Dog, Cat, etc." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your pet..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Image</Label>
            <Input id="image" type="file" />
          </div>
        </div>
        <Button className="w-full">Create Listing</Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdoptionDialog;
