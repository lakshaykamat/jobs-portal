import React, { useState } from "react";
import { Swords, Edit, PlusCircleIcon } from "lucide-react";
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
  skills?: string[];
}

interface SkillsSectionProps {
  user: User;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ user }) => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [inputSkills, setInputSkills] = useState<string>("");

  const updateSkills = async () => {
    try {
      if (inputSkills === "") {
        setSkills([]);

        await axiosInstance.post("/api/v1/users/update", {
          skills: [],
        });
        const updatedUser = { ...user, skills: [] };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        const updatedSkills = inputSkills
          .split(",")
          .map((skill) => skill.trim());
        setSkills(updatedSkills);

        await axiosInstance.post("/api/v1/users/update", {
          skills: updatedSkills,
        });

        const updatedUser = { ...user, skills: updatedSkills };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      toast({
        title: "Skills Updated",
        description: "Your skills have been updated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update skills.",
      });
    }
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSkills(e.target.value);
  };

  return (
    <div className="my-5 border-dashed border-4 p-7 bg-secondary rounded-md">
      <h1 className="text-xl flex gap-3 font-bold mb-3">
        <Swords /> Skills
      </h1>
      {skills.length > 0 ? (
        <>
          <div className="flex gap-3 flex-wrap">
            {skills.map((item, index) => (
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
                <DialogTitle>Add Skills</DialogTitle>
                <DialogDescription>
                  This will show on your profile as an achievement
                </DialogDescription>
              </DialogHeader>
              <Label>Your Skills</Label>
              <Input
                placeholder="Comma-separated values e.g., Nodejs, C, C++"
                value={inputSkills}
                onChange={handleSkillChange}
              />
              <Button onClick={updateSkills}>Update Skills</Button>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          <Dialog>
            <DialogTrigger className="w-full">
              <div>
                <h1 className="flex gap-2 justify-center text-lg font-medium items-center">
                  <PlusCircleIcon className="w-5 h-5" /> ADD SKILLS
                </h1>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Skills</DialogTitle>
                <DialogDescription>
                  This will show on your profile as an achievement
                </DialogDescription>
              </DialogHeader>
              <Label>Your Skills</Label>
              <Input
                placeholder="Comma-separated values e.g., Nodejs, C, C++"
                value={inputSkills}
                onChange={handleSkillChange}
              />
              <Button onClick={updateSkills}>Update Skills</Button>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default SkillsSection;
