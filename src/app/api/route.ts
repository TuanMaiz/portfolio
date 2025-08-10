import { NextResponse } from 'next/server';

export async function GET() {
  const apiDocumentation = {
    title: 'Portfolio API Documentation',
    version: '1.0.0',
    description: 'REST API for the portfolio blog application built with Next.js and Prisma',
    baseUrl: '/api',
    endpoints: {
      users: {
        'GET /api/users': 'Get all users',
        'POST /api/users': 'Create a new user',
        'GET /api/users/[id]': 'Get user by ID with stats',
        'PUT /api/users/[id]': 'Update user by ID',
        'DELETE /api/users/[id]': 'Delete user by ID',
      },
      blogs: {
        'GET /api/blogs': 'Get all blogs (supports ?status=PUBLISHED&authorId=1)',
        'POST /api/blogs': 'Create a new blog',
        'GET /api/blogs/[id]': 'Get blog by ID with comments',
        'PUT /api/blogs/[id]': 'Update blog by ID',
        'DELETE /api/blogs/[id]': 'Delete blog by ID',
      },
      comments: {
        'GET /api/comments': 'Get all comments (supports ?blogId=1)',
        'POST /api/comments': 'Create a new comment',
      },
      likes: {
        'POST /api/likes': 'Like a blog',
        'DELETE /api/likes?blogId=1&userId=1': 'Unlike a blog',
      },
      tags: {
        'GET /api/tags': 'Get all tags with blog counts',
        'POST /api/tags': 'Create a new tag',
      },
      search: {
        'GET /api/search?q=query&type=all&limit=10': 'Search across blogs, users, and tags',
      },
      dashboard: {
        'GET /api/dashboard': 'Get dashboard metrics and recent activity',
      },
    },
    examples: {
      createUser: {
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          passwordHash: 'hashed_password',
          role: 'AUTHOR',
          bio: 'Software developer',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      },
      createBlog: {
        method: 'POST',
        url: '/api/blogs',
        body: {
          title: 'My First Blog Post',
          content: 'This is the content of my blog post...',
          authorId: '1',
          coverImage: 'https://example.com/cover.jpg',
          status: 'PUBLISHED',
          tags: ['JavaScript', 'React'],
        },
      },
      createComment: {
        method: 'POST',
        url: '/api/comments',
        body: {
          blogId: '1',
          userId: '2',
          content: 'Great blog post!',
        },
      },
      likeBlog: {
        method: 'POST',
        url: '/api/likes',
        body: {
          blogId: '1',
          userId: '2',
        },
      },
    },
    notes: [
      'All IDs are returned as strings but should be sent as strings or numbers',
      'BigInt fields (IDs) are automatically converted to strings in responses',
      'Passwords should be properly hashed before sending to the API',
      'Only published blogs are returned in search results',
      'Blog slugs are automatically generated from titles',
      'Tags are created automatically when creating/updating blogs',
    ],
  };

  return NextResponse.json(apiDocumentation);
}