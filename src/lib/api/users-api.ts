import { axiosClient } from './axiosClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'AUTHOR' | 'READER';
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    blogCount: number;
    commentCount: number;
    likeCount: number;
  };
  blogs?: {
    id: string;
    title: string;
    slug: string;
    status: 'DRAFT' | 'PUBLISHED';
    publishedAt?: string;
    createdAt: string;
    commentCount: number;
    likeCount: number;
  }[];
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role?: 'ADMIN' | 'AUTHOR' | 'READER';
  bio?: string;
  avatarUrl?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  role?: 'ADMIN' | 'AUTHOR' | 'READER';
}

// API functions
export const usersApi = {
  getUsers: () => axiosClient.get<User[]>('/users'),
  getUser: (id: string) => axiosClient.get<User>(`/users/${id}`),
  createUser: (data: CreateUserData) => axiosClient.post<User>('/users', data),
  updateUser: (id: string, data: UpdateUserData) => axiosClient.put<User>(`/users/${id}`, data),
  deleteUser: (id: string) => axiosClient.delete(`/users/${id}`),
};

// React Query hooks
export const useGetUsers = (options?: any) =>
  useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers().then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

export const useGetUser = (id: string, options?: any) =>
  useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getUser(id).then(res => res.data),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

export const useCreateUser = (options?: any) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateUserData) => usersApi.createUser(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    ...options,
  });
};

export const useUpdateUser = (options?: any) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => 
      usersApi.updateUser(id, data).then(res => res.data),
    onSuccess: ({id}) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id]});
    },
    ...options,
  });
};

export const useDeleteUser = (options?: any) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    ...options,
  });
};