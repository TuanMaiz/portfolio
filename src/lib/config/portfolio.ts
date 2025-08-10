export interface PortfolioConfig {
  personal: {
    name: string;
    title: string;
    description: string;
    email: string;
    location: string;
    cvUrl?: string;
    socialLinks?: {
      github?: string;
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  features: {
    showNews: boolean;
    showBlogs: boolean;
    showProjects: boolean;
    enableComments: boolean;
    enableLikes: boolean;
  };
}

export const portfolioConfig: PortfolioConfig = {
  personal: {
    name: "John Doe",
    title: "Full Stack Developer & AI Enthusiast",
    description: "I'm a passionate full stack developer with expertise in modern web technologies and artificial intelligence. I love building scalable applications and exploring the intersection of technology and human experience.",
    email: "john.doe@example.com",
    location: "San Francisco, CA",
    cvUrl: "/cv.pdf",
    socialLinks: {
      github: "https://github.com/johndoe",
      twitter: "https://twitter.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
    },
  },
  seo: {
    title: "John Doe - Full Stack Developer",
    description: "Full Stack Developer & AI Enthusiast based in San Francisco. Passionate about building scalable applications and exploring modern web technologies.",
    keywords: ["full stack developer", "AI", "web development", "Next.js", "React", "TypeScript"],
    ogImage: "/og-image.jpg",
  },
  features: {
    showNews: true,
    showBlogs: true,
    showProjects: false,
    enableComments: true,
    enableLikes: true,
  },
};

// Sample news data - in a real app, this would come from your API
export const sampleNewsData = [
  {
    id: "1",
    date: "2024-01-15",
    title: "Started new position as Senior Full Stack Developer",
    description: "Joined an amazing team working on cutting-edge AI applications",
    type: "other" as const,
  },
  {
    id: "2", 
    date: "2024-01-10",
    title: "Published article on Next.js 15 features",
    description: "Deep dive into the latest features and improvements",
    type: "blog" as const,
    link: "/blog/nextjs-15-features",
  },
  {
    id: "3",
    date: "2023-12-20",
    title: "Spoke at React Conference 2023",
    description: "Presented on 'Building Scalable React Applications'",
    type: "talk" as const,
  },
  {
    id: "4",
    date: "2023-12-01",
    title: "Open sourced portfolio template",
    description: "A modern, minimalist portfolio built with Next.js and Prisma",
    type: "project" as const,
    link: "https://github.com/johndoe/portfolio",
  },
];