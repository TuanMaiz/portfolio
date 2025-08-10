# Portfolio API Documentation

This document provides comprehensive information about the Portfolio API built with Next.js, Prisma, and PostgreSQL.

## Overview

The Portfolio API is a RESTful API that provides endpoints for managing users, blogs, comments, likes, tags, and dashboard metrics. It's built using:

- **Next.js 15** with App Router
- **Prisma** as the ORM
- **PostgreSQL** as the database
- **TypeScript** for type safety
- **TanStack Query** for client-side state management

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

6. Seed the database (optional):
   ```bash
   npx prisma db seed
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check

- **GET** `/api/health` - Check API and database health

### Users

- **GET** `/api/users` - Get all users
- **POST** `/api/users` - Create a new user
- **GET** `/api/users/[id]` - Get user by ID with stats
- **PUT** `/api/users/[id]` - Update user by ID
- **DELETE** `/api/users/[id]` - Delete user by ID

### Blogs

- **GET** `/api/blogs` - Get all blogs (supports filtering)
  - Query params: `status`, `authorId`
- **POST** `/api/blogs` - Create a new blog
- **GET** `/api/blogs/[id]` - Get blog by ID with comments
- **PUT** `/api/blogs/[id]` - Update blog by ID
- **DELETE** `/api/blogs/[id]` - Delete blog by ID

### Comments

- **GET** `/api/comments` - Get all comments
  - Query params: `blogId`
- **POST** `/api/comments` - Create a new comment

### Likes

- **POST** `/api/likes` - Like a blog
- **DELETE** `/api/likes` - Unlike a blog
  - Query params: `blogId`, `userId`

### Tags

- **GET** `/api/tags` - Get all tags with blog counts
- **POST** `/api/tags` - Create a new tag

### Search

- **GET** `/api/search` - Search across blogs, users, and tags
  - Query params: `q` (required), `type` (optional), `limit` (optional)

### Dashboard

- **GET** `/api/dashboard` - Get dashboard metrics and recent activity

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'AUTHOR' | 'READER';
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Blog
```typescript
interface Blog {
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
  author: User;
  tags: Tag[];
  commentCount: number;
  likeCount: number;
}
```

### Comment
```typescript
interface Comment {
  id: string;
  content: string;
  createdAt: string;
  blogId: string;
  userId: string;
  user: User;
  blog: Blog;
}
```

### Tag
```typescript
interface Tag {
  id: string;
  name: string;
  blogCount: number;
}
```

## Client-Side Usage

The API comes with pre-built React Query hooks for easy integration:

```typescript
import { useGetBlogs, useCreateBlog, useGetUsers } from '@/lib/api';

// Get published blogs
const { data: blogs, isLoading } = useGetBlogs({ status: 'PUBLISHED' });

// Create a new blog
const createBlog = useCreateBlog({
  onSuccess: () => {
    console.log('Blog created successfully!');
  },
});

// Get all users
const { data: users } = useGetUsers();
```

## Error Handling

The API uses standard HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **409** - Conflict (e.g., duplicate email)
- **500** - Internal Server Error
- **503** - Service Unavailable (health check failed)

Error responses follow this format:
```json
{
  "error": "Error message description"
}
```

## Authentication

Currently, the API doesn't implement authentication, but it's structured to easily add JWT or session-based auth. The axios client is configured to automatically include auth tokens when available.

## Rate Limiting

No rate limiting is currently implemented, but it can be easily added using middleware.

## Caching Strategy

- **Server-side**: Prisma handles query optimization
- **Client-side**: TanStack Query provides intelligent caching with different stale times:
  - Users: 5 minutes
  - Blogs: 2 minutes  
  - Comments: 30 seconds
  - Dashboard: 1 minute
  - Tags: 10 minutes

## Development Tools

- **Prisma Studio**: `npx prisma studio` - Database GUI
- **React Query Devtools**: Available in development mode
- **API Documentation**: Available at `/api`

## Testing

Test the API endpoints using:

- **Health Check**: `curl http://localhost:3000/api/health`
- **Get Users**: `curl http://localhost:3000/api/users`
- **Get Blogs**: `curl http://localhost:3000/api/blogs`

## Deployment

1. Set up PostgreSQL database
2. Set environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Build the application: `npm run build`
5. Start the server: `npm start`

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Update this documentation for new endpoints
5. Test your changes

## License

This project is licensed under the MIT License.