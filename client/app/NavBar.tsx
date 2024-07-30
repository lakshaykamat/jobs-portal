import { Button } from "@/components/ui/button";
import React from "react";

type Props = {};

const NavBar = (props: Props) => {
  return (
    <header>
      <nav className="bg-secondary justify-around items-center border-2 border-b p-4 flex">
        <h1 className="font-bold text-xl">EasyJobs</h1>
        <ol className="flex items-center gap-3 sm:gap-6">
          <li>
            <a href="" className="hover:underline hover:text-primary">
              Jobs
            </a>
          </li>
          <li>
            <a href="" className="hover:underline hover:text-primary">
              About
            </a>
          </li>
          <li>
            <a href="" className="hover:underline hover:text-primary">
              Contact
            </a>
          </li>
          <li className="hidden sm:block">
            <a href="">
              <Button>Login</Button>
            </a>
          </li>
        </ol>
      </nav>
    </header>
  );
};

export default NavBar;
