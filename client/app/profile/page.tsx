"use client";
import withAuth from "@/components/ProtectedRoute";
import React from "react";

type Props = {};

const ProfilePage = (props: Props) => {
  return <div>ProfilePage</div>;
};

export default withAuth(ProfilePage);
