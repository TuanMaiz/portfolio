import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // 'blogs', 'users', 'tags', or 'all'
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const results: any = {};

    // Search blogs
    if (type === 'blogs' || type === 'all') {
      const blogs = await prisma.blog.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
          status: 'PUBLISHED', // Only search published blogs
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      results.blogs = blogs.map(blog => ({
        ...blog,
        id: blog.id.toString(),
        authorId: blog.authorId.toString(),
        author: {
          ...blog.author,
          id: blog.author.id.toString(),
        },
        tags: blog.tags.map(blogTag => ({
          id: blogTag.tag.id.toString(),
          name: blogTag.tag.name,
        })),
        commentCount: blog._count.comments,
        likeCount: blog._count.likes,
        // Add excerpt for search results
        excerpt: blog.content.substring(0, 200) + (blog.content.length > 200 ? '...' : ''),
      }));
    }

    // Search users
    if (type === 'users' || type === 'all') {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { bio: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatarUrl: true,
          role: true,
          _count: {
            select: {
              blogs: true,
            },
          },
        },
        take: limit,
      });

      results.users = users.map(user => ({
        ...user,
        id: user.id.toString(),
        blogCount: user._count.blogs,
      }));
    }

    // Search tags
    if (type === 'tags' || type === 'all') {
      const tags = await prisma.tag.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        include: {
          _count: {
            select: {
              blogs: true,
            },
          },
        },
        take: limit,
        orderBy: {
          blogs: {
            _count: 'desc',
          },
        },
      });

      results.tags = tags.map(tag => ({
        ...tag,
        id: tag.id.toString(),
        blogCount: tag._count.blogs,
      }));
    }

    // Add search metadata
    const metadata = {
      query,
      type,
      totalResults: Object.values(results).reduce((sum: number, items: any) => sum + items.length, 0),
    };

    return NextResponse.json({
      ...results,
      metadata,
    });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}