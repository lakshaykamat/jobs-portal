"use client";
import JobPostCard from "@/components/JobPostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { JobPost } from "@/types";

interface JobSearch {
  role: string;
  location: string;
}

interface JobData {
  totalJobs: number;
  totalPages: number;
  currentPage: number;
  jobs: JobPost[];
}

const JobsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobSearch, setJobSearch] = useState<JobSearch>({ role: "", location: "" });
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchJobs = async (role: string, location: string) => {
    try {
      const response = await axiosInstance.get<JobData>(`/api/v1/jobs?title=${role}&location=${location}`);
      setJobData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = searchParams.get("role") || "";
    const location = searchParams.get("location") || "";

    setJobSearch({ role, location });
    fetchJobs(role, location);
  }, [searchParams]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobSearch((prev) => ({ ...prev, [name]: value }));
  };

  const searchJobs = () => {
    let query = "/jobs?";
    if (jobSearch.role) query += `role=${encodeURIComponent(jobSearch.role)}&`;
    if (jobSearch.location) query += `location=${encodeURIComponent(jobSearch.location)}`;
    router.replace(query);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-7">Jobs</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-7">
        <Input
          name="role"
          value={jobSearch.role}
          onChange={handleChange}
          placeholder="Job Title"
          aria-label="Job Title"
        />
        <Input
          name="location"
          value={jobSearch.location}
          onChange={handleChange}
          placeholder="Location"
          aria-label="Location"
        />
        <Button onClick={searchJobs}>Find Jobs</Button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div>
          {jobData && jobData.jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobData.jobs.map((job) => (
                <JobPostCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center">No jobs found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobsPage;
