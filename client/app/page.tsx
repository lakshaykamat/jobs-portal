"use client";

import useSWR from "swr";
import axiosInstance from "../lib/axiosInstance";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, ChangeEvent, useCallback } from "react";
import { JobPost } from "@/types";
import JobPostCard from "@/components/JobPostCard";

// Fetcher function for SWR
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

// Custom hook for debouncing
// const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
//   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const debouncedCallback = useCallback(
//     (...args: any[]) => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//       timeoutRef.current = setTimeout(() => {
//         callback(...args);
//       }, delay);
//     },
//     [callback, delay]
//   );

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   return debouncedCallback;
// };

const HomePage: React.FC = () => {
  const {
    data: jobs,
    isLoading,
    error,
  } = useSWR<{
    totalJobs: number;
    totalPages: number;
    currentPage: number;
    jobs: JobPost[];
  }>("/api/v1/jobs", fetcher);
  const [jobSearch, setJobSearch] = useState({ role: "", location: "" });
  const router = useRouter();
  // const [filteredData, setFilteredData] = useState<JobPost[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (data) {
  //     setFilteredData(data.jobs);
  //     setLoading(false);
  //   }
  // }, [data]);

  // const handleSearch = useDebounce(() => {
  //   if (data) {
  //     const filtered = data.jobs.filter((job) => {
  //       return (
  //         (jobSearch.role === "" || job.title.toLowerCase().includes(jobSearch.role.toLowerCase())) &&
  //         (jobSearch.location === "" || job.location.toLowerCase().includes(jobSearch.location.toLowerCase()))
  //       );
  //     });
  //     setFilteredData(filtered);
  //   }
  // }, 300);

  // useEffect(() => {
  //   handleSearch();
  // }, [jobSearch, handleSearch]);

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error</h1>;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobSearch((prev) => ({ ...prev, [name]: value }));
  };

  const searchJobs = () => {
    let query = "jobs/";
    // Construct the query string manually
    if (jobSearch.role || jobSearch.location) {
      query += "?";
      if (jobSearch.role) {
        query += `role=${encodeURIComponent(jobSearch.role)}`;
      }
      if (jobSearch.location) {
        if (jobSearch.role) {
          query += "&";
        }
        query += `location=${encodeURIComponent(jobSearch.location)}`;
      }
    }

    // Redirect to the new URL
    router.push(query);
  };

  if (error)
    return (
      <div className="text-red-500">
        Failed to load data. Please try again later.
      </div>
    );

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

      <div>
        {jobs && jobs.jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.jobs.map((item) => (
              <JobPostCard key={item._id} job={item} />
            ))}
          </div>
        ) : (
          <div className="text-center">No jobs found.</div>
        )}
        <div className="text-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
                <PaginationLink href="#">2</PaginationLink>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
