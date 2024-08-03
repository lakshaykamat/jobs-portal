// Type for job posts
export interface JobPost {
    _id: string;
    slug:string;
    source: string;
    title: string;
    description: string;
    company: {
      name: string;
      link: string;
      image: string;
      location: string;
    };
    salary: string;
    applyLink: string;
    datePosted: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }