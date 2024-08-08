"use client";
import WithAuth from "@/components/ProtectedRoute";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "../context/UserContext";
import SkillsSection from "./SkillsSection";
import WorkSection from "./WorkSection";
import PreferredRolesSection from "./PreferredRolesSection";
import PreferredLocationSection from "./PreferredLocationSection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProfilePage: React.FC = () => {
  const { logout, user } = useUser();
  const router = useRouter();

  const handleLogOut = () => {
    logout();
    router.replace("/login");
  };

  return (
    user && (
      <>
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

          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant={"destructive"}>Logout</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will logout will delete
                  your account and remove your data from your device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogOut}
                  className="bg-destructive"
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </>
    )
  );
};

export default WithAuth(ProfilePage);
