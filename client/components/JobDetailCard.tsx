import { JobPost } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Bookmark,
  Building2,
  DollarSign,
  Linkedin,
  MapPin,
  Save,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useToast } from "./ui/use-toast";

interface JobDetailCardProps {
  job: JobPost;
}

const JobDetailCard: React.FC<JobDetailCardProps> = ({ job }) => {
  const { toast } = useToast();
  const saveJob = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/users/savejob", {
        jobId: job.slug,
      });
      toast({
        description: "Saved to job list",
      });
    } catch (error) {
      toast({
        description: "Unable to Save",
      });
    }
  };
  return (
    <Card className="px-4 py-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex  justify-between items-center">
        {job.title}{" "}
        {job.source === "linkedin.com" && (
          <Linkedin className="text-white outline p-2 bg-blue-600 w-8 rounded h-8" />
        )}
      </h1>
      <div className="flex text-sm gap-3 items-center mb-4">
        <div
          title={`Company: ${job.company.name}`}
          className="flex items-center gap-2"
        >
          <Building2 className="text-gray-500 w-5" />
          <Link
            href={job.company.link}
            target="_blank"
            className="text-sm hover:underline hover:text-blue-500"
          >
            {job.company.name}
          </Link>
        </div>
        <div
          title={`Location: ${job.company.location}`}
          className="flex items-center gap-2"
        >
          <MapPin className="text-gray-500 w-5" />
          <p className="text-sm">{job.company.location}</p>
        </div>
      </div>
      <div title={`Salary: ${job.salary}`} className="flex items-center gap-2">
        <DollarSign className="text-gray-500 w-5" />
        <p className="text-sm">{job.salary}</p>
      </div>
      <Link href={job.applyLink} target="_blank" rel="noopener noreferrer">
        <Button className="my-4 w-full">Apply</Button>
      </Link>
      <Button className="mb-3 w-full" variant={"secondary"} onClick={saveJob}>
        <Bookmark className="w-5 h-5 mr-2" /> Save
      </Button>

      <p className="text-lg mb-4 font-bold">Full Job Description</p>
      <p
        className="text-md mb-4 prose"
        dangerouslySetInnerHTML={{ __html: job.description }}
      />
    </Card>
  );
};

export default JobDetailCard;
