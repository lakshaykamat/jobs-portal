import Link from "next/link";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { JobPost } from "@/types";

const JobPostCard = ({ job }: { job: JobPost }) => {
    return (
      <Card className="max-w-sm px-4 py-4 flex items-start flex-col cursor-pointer">
          <Link href={`/job/${job._id}`}>
          <h2 className="text-lg font-bold hover:underline">{job.title}</h2>
      </Link>
          <div className="flex flex-col text-sm flex-grow text-muted-foreground mt-1">
            <Link href={job.company.link} target="_blank" className="hover:underline">
              {job.company.name}
            </Link>
            <p>{job.location}</p>
          </div>
          <Button className="mt-2">
            <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
              Apply
            </a>
          </Button>
        </Card>
    );
  };
  export default JobPostCard