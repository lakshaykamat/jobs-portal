"use client"

import useSWR from 'swr';
import axiosInstance from '../../../lib/axiosInstance';
import { JobPost } from '@/types';
import JobDetailCard from '../../../components/JobDetailCard';

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

const JobPage = ({ params }: { params: { id: string } }) => {

  const { data: job, isLoading,error } = useSWR<JobPost>(params.id ? `/api/v1/jobs/?id=${params.id}` : null, fetcher);

  if (error) return <div className="text-red-500">Failed to load job data</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!job) return <div className="text-red-500">Job not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <JobDetailCard job={job} />
    </div>
  );
};

export default JobPage;
