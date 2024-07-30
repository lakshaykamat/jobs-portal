// components/JobDetailCard.tsx

import { JobPost } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, DollarSign, MapPin } from "lucide-react";

interface JobDetailCardProps {
  job: JobPost;
}

const JobDetailCard: React.FC<JobDetailCardProps> = ({ job }) => {
  return (
    <Card className="px-4 py-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{job.title}</h1>
      <div className="flex text-sm gap-3 items-center mb-4">
        <div title={`Company: ${job.company.name}`} className="flex items-center gap-2">
          <Building2 className="text-gray-500 w-5" />
          <Link
            href={job.company.link}
            target="_blank"
            className="text-sm hover:underline hover:text-blue-500"
          >
            {job.company.name}
          </Link>
        </div>
        <div title={`Location: ${job.location}`} className="flex items-center gap-2">
          <MapPin className="text-gray-500 w-5" />
          <p className="text-sm">{job.location}</p>
        </div>
      </div>
      <div title={`Salary: ${job.salary}`} className="flex items-center gap-2">
        <DollarSign className="text-gray-500 w-5" />
        <p className="text-sm">{job.salary}</p>
      </div>
        <Link href={job.applyLink} target="_blank" rel="noopener noreferrer">
      <Button className="my-4 w-full">
          Apply
      </Button>
        </Link>
      
      <p className="text-lg mb-4 font-bold">Full Job Description</p>
      <p
        className="text-md mb-4"
        dangerouslySetInnerHTML={{ __html: job.description }}
      />
    </Card>
  );
};

export default JobDetailCard;
