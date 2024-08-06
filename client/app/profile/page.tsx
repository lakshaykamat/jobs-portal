"use client";
import withAuth from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { User, useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { Building, Edit, PlusCircle, Swords } from "lucide-react";
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
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";

type Props = {};

const ProfilePage = (props: Props) => {
  const { toast } = useToast();
  const { logout, user } = useUser();
  const [skills, setSkills] = useState(user ? user.skills : []);
  const [inputSkills, setInputSkills] = useState("");
  const [experience, setExperience] = useState(user ? user.exp : []);
  const [inputExperience, setInputExperience] = useState({
    role: "",
    date: "",
    companyName: "",
    bio: "",
  });
  const router = useRouter();

  const handleLogOut = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      router.replace("/login");
    }
  };

  const updateSkills = async () => {
    try {
      const updatedSkills = inputSkills.split(",").map((skill) => skill.trim());
      setSkills(updatedSkills);

      await axiosInstance.post("/api/v1/users/update", {
        skills: updatedSkills,
      });

      const updatedUser = { ...user, skills: updatedSkills };
      localStorage.setItem("user", JSON.stringify(updatedUser));

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

  const handleSkillChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputSkills(e.target.value);
  };

  const updateExperience = async () => {
    try {
      const updatedExperience = [...experience, inputExperience];
      setExperience(updatedExperience);

      await axiosInstance.post("/api/v1/users/update", {
        exp: updatedExperience,
      });

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

  const handleExperienceChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setInputExperience((prev) => ({ ...prev, [name]: value }));
  };

  return (
    user && (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p>{user.email}</p>
        <Link href={`/savedjobs`}>
          <Button className="my-2">View Saved Jobs</Button>
        </Link>
        {skills.length > 0 ? (
          <SkillsSection
            skills={skills}
            updateSkills={updateSkills}
            inputSkills={inputSkills}
            handleSkillChange={handleSkillChange}
          />
        ) : (
          <Dialog>
            <DialogTrigger className="w-full">
              <div className="hover:bg-gray-300 transition-all hover:cursor-pointer my-5 border-dashed border-4 p-7 bg-secondary rounded-md">
                <h1 className="text-xl flex gap-3 font-bold mb-3">
                  <Swords /> Skills
                </h1>
                <h3 className="text-lg flex items-center gap-3 justify-center text-center font-medium">
                  <PlusCircle className="w-5 h-5" /> ADD SKILLS
                </h3>
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
        )}
        {experience.length > 0 ? (
          <WorkSection experience={experience} />
        ) : (
          <Dialog>
            <DialogTrigger className="w-full">
              <div className="hover:bg-gray-300 transition-all hover:cursor-pointer my-5 border-dashed border-4 p-7 bg-secondary rounded-md">
                <h1 className="text-xl flex gap-3 font-bold mb-3">
                  <Building /> Work Experience
                </h1>
                <h3 className="text-lg flex items-center gap-3 justify-center text-center font-medium">
                  <PlusCircle className="w-5 h-5" /> ADD EXPERIENCE
                </h3>
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
        )}
        <Button onClick={handleLogOut} variant={"destructive"}>
          Logout
        </Button>
      </div>
    )
  );
};

type SkillProps = {
  skills?: string[];
  inputSkills: string;
  handleSkillChange: (e: {
    target: {
      value: React.SetStateAction<string>;
    };
  }) => void;
  updateSkills: () => Promise<void>;
};
const SkillsSection = (props: SkillProps) => {
  return (
    <div className="my-5 border-dashed border-4 p-7 bg-secondary rounded-md">
      <h1 className="text-xl flex gap-3 font-bold mb-3">
        <Swords /> Skills
      </h1>
      <div className="flex gap-3">
        {props.skills &&
          props.skills.map((item, index) => {
            return (
              <p
                key={index}
                className="bg-primary text-primary-foreground px-3 py-1 rounded-md border"
              >
                {item}
              </p>
            );
          })}
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
            value={props.inputSkills}
            onChange={props.handleSkillChange}
          />
          <Button onClick={props.updateSkills}>Update Skills</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

type WorkProps = {
  experience: Array<{
    role: string;
    date: string;
    companyName: string;
    bio?: string;
  }>;
};
const WorkSection = (props: WorkProps) => {
  return (
    <div className="my-5 border-dashed border-4 p-7 bg-secondary rounded-md">
      <h1 className="text-xl flex gap-3 font-bold mb-3">
        <Building /> Work Experience
      </h1>
      {props.experience.map((item, index) => {
        return (
          <div key={index} className="bg-popover p-7 rounded-md mb-4">
            <div className="flex justify-between ">
              <h3 className="font-medium text-lg">{item.role}</h3>
              <p className="italic">{item.date}</p>
            </div>
            <p>{item.companyName}</p>
            <p>{item.bio}</p>
          </div>
        );
      })}
    </div>
  );
};

export default withAuth(ProfilePage);
