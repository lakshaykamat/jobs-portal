import React, { useState } from "react";
import { Building, PlusCircle } from "lucide-react";
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

interface Experience {
  role: string;
  date: string;
  companyName: string;
  bio: string;
}

interface User {
  exp?: Experience[];
}

interface WorkSectionProps {
  user: User;
}

const WorkSection: React.FC<WorkSectionProps> = ({ user }) => {
  const { toast } = useToast();
  const [experience, setExperience] = useState<Experience[]>(user.exp || []);
  const [inputExperience, setInputExperience] = useState<Experience>({
    role: "",
    date: "",
    companyName: "",
    bio: "",
  });

  const updateExperience = async () => {
    try {
      const updatedExperience = [...experience, inputExperience];
      setExperience(updatedExperience);

      await axiosInstance.post("/api/v1/users/update", {
        exp: updatedExperience,
      });
      const updatedUser = { ...user, exp: updateExperience };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast({
        title: "Experience Updated",
        description: "Your work experience has been updated successfully.",
      });
      setInputExperience({ role: "", date: "", companyName: "", bio: "" });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update experience.",
      });
    }
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputExperience((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="my-5 border-dashed border-4 p-7 bg-secondary rounded-md">
      <h1 className="text-xl flex gap-3 font-bold mb-3">
        <Building /> Work Experience
      </h1>
      {experience.map((item, index) => (
        <div key={index} className="bg-popover p-7 rounded-md mb-4">
          <div className="flex justify-between ">
            <h3 className="font-medium text-lg">{item.role}</h3>
            <p className="italic">{item.date}</p>
          </div>
          <p>{item.companyName}</p>
          <p>{item.bio}</p>
        </div>
      ))}
      <Dialog>
        <DialogTrigger className="w-full">
          <div className="hover:bg-gray-300 transition-all hover:cursor-pointer my-5 border-dashed border-4 p-7 bg-secondary rounded-md">
            <h1 className="text-xl flex gap-3 font-bold mb-3">
              <PlusCircle className="w-5 h-5" /> ADD EXPERIENCE
            </h1>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Experience</DialogTitle>
            <DialogDescription>
              This will show on your profile as work experience
            </DialogDescription>
          </DialogHeader>
          <Label>Role</Label>
          <Input
            name="role"
            placeholder="Role"
            value={inputExperience.role}
            onChange={handleExperienceChange}
          />
          <Label>Date</Label>
          <Input
            name="date"
            placeholder="Date"
            value={inputExperience.date}
            onChange={handleExperienceChange}
          />
          <Label>Company Name</Label>
          <Input
            name="companyName"
            placeholder="Company Name"
            value={inputExperience.companyName}
            onChange={handleExperienceChange}
          />
          <Label>Bio</Label>
          <Input
            name="bio"
            placeholder="Bio"
            value={inputExperience.bio}
            onChange={handleExperienceChange}
          />
          <Button onClick={updateExperience}>Update Experience</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkSection;
