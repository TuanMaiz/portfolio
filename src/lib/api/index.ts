// Export axios client
export { axiosClient } from './axiosClient';

// Export all API functions and hooks
export * from './users-api';
export * from './blogs-api';
export * from './comments-likes-api';
export * from './misc-api';

// Re-export commonly used types
export type { User, CreateUserData, UpdateUserData } from './users-api';
export type { Blog, CreateBlogData, UpdateBlogData, BlogFilters } from './blogs-api';
export type { Comment, CreateCommentData, Like, CreateLikeData } from './comments-likes-api';
export type { Tag, CreateTagData, SearchResult, DashboardData } from './misc-api';