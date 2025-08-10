import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const authorId = searchParams.get('authorId');

    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (authorId) {
      where.authorId = BigInt(authorId);
    }

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the response to make it more user-friendly
    const transformedBlogs = blogs.map(blog => ({
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
    }));

    return NextResponse.json(transformedBlogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorId, coverImage, status, tags } = body;

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: 'Title, content, and authorId are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create blog with tags if provided
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        slug,
        authorId: BigInt(authorId),
        coverImage,
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        tags: tags ? {
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Transform the response
    const transformedBlog = {
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
    };

    return NextResponse.json(transformedBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    
    // Handle unique constraint violation for slug
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Blog with this title already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}