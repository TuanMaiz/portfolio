import { axiosClient } from './axiosClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface Tag {
  id: string;
  name: string;
  blogCount: number;
}

export interface CreateTagData {
  name: string;
}

export interface SearchResult {
  blogs?: any[];
  users?: any[];
  tags?: Tag[];
  metadata: {
    query: string;
    type: string;
    totalResults: number;
  };
}

export interface DashboardData {
  metrics: {
    totalUsers: number;
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalComments: number;
    totalLikes: number;
  };
  recentBlogs: any[];
  recentComments: any[];
  popularTags: Tag[];
}

// API functions
export const tagsApi = {
  getTags: () => axiosClient.get<Tag[]>('/tags'),
  createTag: (data: CreateTagData) => axiosClient.post<Tag>('/tags', data),
};

export const searchApi = {
  search: (query: string, type: string = 'all', limit: number = 10) => {
    const params = new URLSearchParams({
      q: query,
      type,
      limit: limit.toString(),
    });
    return axiosClient.get<SearchResult>(`/search?${params.toString()}`);
  },
};

export const dashboardApi = {
  getDashboard: () => axiosClient.get<DashboardData>('/dashboard'),
};

export const healthApi = {
  checkHealth: () => axiosClient.get('/health'),
};

// React Query hooks for tags
export const useGetTags = (options?: any) =>
  useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.getTags().then(res => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes - tags don't change often
    ...options,
  });

export const useCreateTag = (options?: any) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTagData) => tagsApi.createTag(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    ...options,
  });
};

// React Query hooks for search
export const useSearch = (query: string, type: string = 'all', limit: number = 10, options?: any) =>
  useQuery({
    queryKey: ['search', query, type, limit],
    queryFn: () => searchApi.search(query, type, limit).then(res => res.data),
    enabled: !!query && query.length > 2, // Only search if query is longer than 2 characters
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });

// React Query hooks for dashboard
export const useGetDashboard = (options?: any) =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getDashboard().then(res => res.data),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    ...options,
  });

// React Query hooks for health check
export const useHealthCheck = (options?: any) =>
  useQuery({
    queryKey: ['health'],
    queryFn: () => healthApi.checkHealth().then(res => res.data),
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
    ...options,
  });