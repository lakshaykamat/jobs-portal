"use client";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Library, LogIn, User, Vault } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import React from "react";
import { useUser } from "./context/UserContext";

type Props = {};

const NavBar = (props: Props) => {
  const { user } = useUser();
  return (
    <header>
      <nav className="text-sm sm:text-base bg-secondary justify-around items-center border-2 border-b p-4 flex">
        <Link href={"/"} className="font-bold text-xl flex gap-3">
          <Library />
          Job Vault
        </Link>
        <ol className="flex items-center gap-3 sm:gap-6">
          {user && (
            <li>
              <Link href="/jobs" className="hover:underline hover:text-primary">
                Jobs
              </Link>
            </li>
          )}
          <li>
            <Link href="/about" className="hover:underline hover:text-primary">
              About
            </Link>
          </li>
          <li>
            <ModeToggle />
          </li>
          {user ? (
            <li className="hidden sm:block">
              <Link href="/profile">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              </Link>
            </li>
          ) : (
            <li className="hidden sm:block">
              <Link href="/login">
                <Button>
                  <LogIn className="w-5 h-5 mr-2" />
                  <span>Login</span>
                </Button>
              </Link>
            </li>
          )}
        </ol>
      </nav>
    </header>
  );
};

export default NavBar;
