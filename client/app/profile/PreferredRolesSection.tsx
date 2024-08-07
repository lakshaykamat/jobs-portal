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
  preferredRoles?: string[];
}

interface PreferredRolesSectionProps {
  user: User;
}

const PreferredRolesSection: React.FC<PreferredRolesSectionProps> = ({
  user,
}) => {
  const { toast } = useToast();
  const [preferredRoles, setPreferredRoles] = useState<string[]>(
    user.preferredRoles || []
  );
  const [inputRoles, setInputRoles] = useState<string>("");

  const updatePreferredRoles = async () => {
    try {
      const updatedRoles = inputRoles.split(",").map((role) => role.trim());
      setPreferredRoles(updatedRoles);

      await axiosInstance.post("/api/v1/users/update", {
        preferredRoles: updatedRoles,
      });

      const updatedUser = { ...user, preferredRoles: updatedRoles };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast({
        title: "Preferred Roles Updated",
        description: "Your preferred roles have been updated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update preferred roles.",
      });
    }
  };

  const handleRolesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputRoles(e.target.value);
  };

  return (
    <div className="my-5 border-dashed border-4 p-7 bg-secondary rounded-md">
      <h1 className="text-xl flex gap-3 font-bold mb-3">
        <PlusCircle className="w-5 h-5" /> Preferred Roles
      </h1>
      <div className="flex gap-3">
        {preferredRoles.map((item, index) => (
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
            <DialogTitle>Add Preferred Roles</DialogTitle>
            <DialogDescription>
              This will show on your profile as your preferred job roles
            </DialogDescription>
          </DialogHeader>
          <Label>Your Preferred Roles</Label>
          <Input
            placeholder="Comma-separated values e.g., Backend Developer, Frontend Developer"
            value={inputRoles}
            onChange={handleRolesChange}
          />
          <Button onClick={updatePreferredRoles}>Update Roles</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreferredRolesSection;
