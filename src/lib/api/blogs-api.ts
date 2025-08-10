import { axiosClient } from './axiosClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  tags: {
    id: string;
    name: string;
  }[];
  commentCount?: number;
  likeCount?: number;
  comments?: Comment[];
  excerpt?: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  authorId: string;
  coverImage?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  tags?: string[];
}

export interface UpdateBlogData {
  title?: string;
  content?: string;
  coverImage?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  tags?: string[];
}

export interface BlogFilters {
  status?: 'DRAFT' | 'PUBLISHED';
  authorId?: string;
}

// API functions
export const blogsApi = {
  getBlogs: (filters?: BlogFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.authorId) params.append('authorId', filters.authorId);

    return axiosClient.get<Blog[]>(`/blogs?${params.toString()}`);
  },
  getBlog: (id: string) => axiosClient.get<Blog>(`/blogs/${id}`),
  getBlogBySlug: async (slug: string) => {
    const res = await axiosClient.get(`/blogs/${slug}`);
    return res.data;
  },
  createBlog: (data: CreateBlogData) => axiosClient.post<Blog>('/blogs', data),
  updateBlog: (id: string, data: UpdateBlogData) => axiosClient.put<Blog>(`/blogs/${id}`, data),
  deleteBlog: (id: string) => axiosClient.delete(`/blogs/${id}`),
};

// React Query hooks
export const useGetBlogs = (filters?: BlogFilters, options?: any) =>
  useQuery({
    queryKey: ['blogs', filters],
    queryFn: () => blogsApi.getBlogs(filters).then(res => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes for frequently changing data
    ...options,
  });

export const useGetBlog = (id: string, options?: any) =>
  useQuery({
    queryKey: ['blogs', id],
    queryFn: () => blogsApi.getBlog(id).then(res => res.data),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

export const useGetBlogBySlug = (slug: string, options?: any) =>
  useQuery({
    queryKey: ['blogs', 'slug', slug],
    queryFn: () => blogsApi.getBlogBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

export const useCreateBlog = (options?: any) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateBlogData) => blogsApi.createBlog(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    ...options,
  });
};

export const useUpdateBlog = (options?: any) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogData }) => 
      blogsApi.updateBlog(id, data).then(res => res.data),
    onSuccess: ( { id }) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    ...options,
  });
};

export const useDeleteBlog = (options?: any) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => blogsApi.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    ...options,
  });
};

// Convenience hooks for specific use cases
export const useGetPublishedBlogs = (options?: any) =>
  useGetBlogs({ status: 'PUBLISHED' }, options);

export const useGetUserBlogs = (authorId: string, options?: any) =>
  useGetBlogs({ authorId }, options);