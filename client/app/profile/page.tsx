"use client";
import withAuth from "@/components/ProtectedRoute";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "../context/UserContext";
import SkillsSection from "./SkillsSection";
import WorkSection from "./WorkSection";
import PreferredRolesSection from "./PreferredRolesSection";
import PreferredLocationSection from "./PreferredLocationSection";

const ProfilePage: React.FC = () => {
  const { logout, user } = useUser();
  const router = useRouter();

  const handleLogOut = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      router.replace("/login");
    }
  };

  return (
    user && (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p>{user.email}</p>
        <Link href={`/savedjobs`}>
          <Button className="my-2">View Saved Jobs</Button>
        </Link>
        <SkillsSection user={user} />
        <WorkSection user={user} />
        <PreferredRolesSection user={user} />
        <PreferredLocationSection user={user} />
        <Button onClick={handleLogOut} variant={"destructive"}>
          Logout
        </Button>
      </div>
    )
  );
};

export default withAuth(ProfilePage);
