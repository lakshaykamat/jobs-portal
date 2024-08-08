"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

const WithAuth = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const { user, loading } = useUser();
    const router = useRouter();

    if (loading) return <div>Loading...</div>; // Show loading indicator

    if (!user) {
      router.push("/login"); // Redirect to login if user is not authenticated
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
