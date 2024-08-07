import React, { useState } from "react";
import { Edit, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";

interface User {
  preferredLocations?: string[];
}

interface PreferredLocationSectionProps {
  user: User;
}

const PreferredLocationSection: React.FC<PreferredLocationSectionProps> = ({
  user,
}) => {
  const { toast } = useToast();
  const [preferredLocations, setPreferredLocations] = useState<string[]>(
    user.preferredLocations || []
  );
  const [inputLocations, setInputLocations] = useState<string>("");

  const updatePreferredLocations = async () => {
    try {
      const updatedLocations = inputLocations
        .split(",")
        .map((location) => location.trim());
      setPreferredLocations(updatedLocations);

      await axiosInstance.post("/api/v1/users/update", {
        preferredLocations: updatedLocations,
      });

      const updatedUser = { ...user, preferredLocations: updatedLocations };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast({
        title: "Preferred Locations Updated",
        description: "Your preferred locations have been updated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update preferred locations.",
      });
    }
  };

  const handleLocationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLocations(e.target.value);
  };

  return (
    <div className="my-5 border-dashed border-4 p-7 bg-secondary rounded-md">
      <h1 className="text-xl flex gap-3 font-bold mb-3">
        <PlusCircle className="w-5 h-5" /> Preferred Locations
      </h1>
      <div className="flex gap-3">
        {preferredLocations.map((item, index) => (
          <p
            key={index}
            className="bg-primary text-primary-foreground px-3 py-1 rounded-md border"
          >
            {item}
          </p>
        ))}
      </div>
      <Dialog>
        <DialogTrigger className="w-full">
          <span className="flex mt-3 gap-3">
            <Edit className="w-5 h-5" />
            Edit
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Preferred Locations</DialogTitle>
            <DialogDescription>
              This will show on your profile as your preferred job locations
            </DialogDescription>
          </DialogHeader>
          <Label>Your Preferred Locations</Label>
          <Input
            placeholder="Comma-separated values e.g., New York, San Francisco"
            value={inputLocations}
            onChange={handleLocationsChange}
          />
          <Button onClick={updatePreferredLocations}>Update Locations</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreferredLocationSection;
