"use client";
import JobPostCard from "@/components/JobPostCard";
import axiosInstance from "@/lib/axiosInstance";
import { JobPost } from "@/types";
import React from "react";
import useSWR from "swr";

type Props = {};
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);
const SavedJobs = (props: Props) => {
  const { data, isLoading } = useSWR("/api/v1/users/view-saved-jobs", fetcher);
  if (isLoading) return;
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold my-7">Saved Jobs</h1>
      <div>
        {data && data.jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.jobs.map((job: JobPost) => (
              <JobPostCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center">No jobs found.</div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
