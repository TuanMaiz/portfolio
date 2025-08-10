import { axiosClient } from './axiosClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  blogId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  blog: {
    id: string;
    title: string;
  };
}

export interface CreateCommentData {
  blogId: string;
  userId: string;
  content: string;
}

export interface Like {
  id: string;
  createdAt: string;
  blogId: string;
  userId: string;
  user: {
    id: string;
    name: string;
  };
  blog: {
    id: string;
    title: string;
  };
}

export interface CreateLikeData {
  blogId: string;
  userId: string;
}

// API functions
export const commentsApi = {
  getComments: (blogId?: string) => {
    const params = blogId ? `?blogId=${blogId}` : '';
    return axiosClient.get<Comment[]>(`/comments${params}`);
  },
  createComment: (data: CreateCommentData) => axiosClient.post<Comment>('/comments', data),
};

export const likesApi = {
  likeBlog: (data: CreateLikeData) => axiosClient.post<Like>('/likes', data),
  unlikeBlog: (blogId: string, userId: string) => 
    axiosClient.delete(`/likes?blogId=${blogId}&userId=${userId}`),
};

// React Query hooks for comments
export const useGetComments = (blogId?: string, options?: any) =>
  useQuery({
    queryKey: ['comments', blogId],
    queryFn: () => commentsApi.getComments(blogId).then(res => res.data),
    staleTime: 30 * 1000, // 30 seconds for real-time feel
    ...options,
  });

export const useCreateComment = (options?: any) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCommentData) => commentsApi.createComment(data).then(res => res.data),
    onSuccess: (data: Comment) => {
      // Invalidate comments for the specific blog
      queryClient.invalidateQueries({ queryKey: ['comments', data.blogId] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      // Invalidate the blog to update comment count
      queryClient.invalidateQueries({ queryKey: ['blogs', data.blogId] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    ...options,
  });
};

// React Query hooks for likes
export const useLikeBlog = (options?: any) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateLikeData) => likesApi.likeBlog(data).then(res => res.data),
    onSuccess: (data: Like) => {
      // Invalidate the blog to update like count
      queryClient.invalidateQueries({ queryKey: ['blogs', data.blogId] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    ...options,
  });
};

export const useUnlikeBlog = (options?: any) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ blogId, userId }: { blogId: string; userId: string }) => 
      likesApi.unlikeBlog(blogId, userId),
    onSuccess: ({ blogId } ) => {
      // Invalidate the blog to update like count
      queryClient.invalidateQueries({ queryKey: ['blogs', blogId] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    ...options,
  });
};