import Link from "next/link";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { JobPost } from "@/types";
import { Link2 } from "lucide-react";

const JobPostCard = ({ job }: { job: JobPost }) => {
  return (
    <Card className="max-w-md px-4 py-4 flex items-start flex-col cursor-pointer">
      <Link href={`/job/${job.slug.toString()}`}>
        <h2 className="text-lg font-bold hover:underline">{job.title}</h2>
      </Link>
      <div className="flex flex-col text-base flex-grow text-muted-foreground mt-1">
        <Link
          href={job.company.link}
          target="_blank"
          className="hover:underline"
        >
          {job.company.name}
        </Link>
        <span className="text-sm">{job.company.location}</span>
      </div>
      <Button className="mt-2">
        <Link
          className="flex gap-3 items-center"
          href={`/job/${job.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read more
        </Link>
      </Button>
    </Card>
  );
};
export default JobPostCard;
