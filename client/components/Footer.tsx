import { Instagram, Library, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="bg-secondary mt-24 border border-t-2 flex justify-between items-center p-7 text-secondary-foreground">
      <h2 className="flex gap-3 text-xl font-medium">
        <Library />
        JobVault
      </h2>
      <div className="flex gap-10 items-center">
        <Link href={`/about`} className="underline">
          About
        </Link>
        <Link href={`#`}>
          <Instagram className="hover:text-pink-500" />
        </Link>
        <Link href={`#`}>
          <Mail className="hover:text-primary" />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
