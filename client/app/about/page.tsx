import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const AboutPage = (props: Props) => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-7">About</h1>
      <p>
        JobVault is a comprehensive job portal that provides a seamless
        experience for job seekers. It includes a Next.js client for displaying
        job listings, a scraper server for fetching jobs from popular job
        portals like LinkedIn, Indeed, and Naukri, and a main server that
        provides API routes for client interactions.
      </p>
      <Link href={`mailto:lakshaykamat.dev@gmail.com`}>
        <Button className="my-3">
          <Mail className="mr-2 w-5 h-5" /> Contact us
        </Button>
      </Link>
    </div>
  );
};

export default AboutPage;
