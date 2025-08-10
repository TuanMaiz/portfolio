import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blogId');

    const where: any = {};
    if (blogId) {
      where.blogId = BigInt(blogId);
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        blog: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the response
    const transformedComments = comments.map(comment => ({
      ...comment,
      id: comment.id.toString(),
      blogId: comment.blogId.toString(),
      userId: comment.userId.toString(),
      user: {
        ...comment.user,
        id: comment.user.id.toString(),
      },
      blog: {
        ...comment.blog,
        id: comment.blog.id.toString(),
      },
    }));

    return NextResponse.json(transformedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blogId, userId, content } = body;

    if (!blogId || !userId || !content) {
      return NextResponse.json(
        { error: 'BlogId, userId, and content are required' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        blogId: BigInt(blogId),
        userId: BigInt(userId),
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        blog: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Transform the response
    const transformedComment = {
      ...comment,
      id: comment.id.toString(),
      blogId: comment.blogId.toString(),
      userId: comment.userId.toString(),
      user: {
        ...comment.user,
        id: comment.user.id.toString(),
      },
      blog: {
        ...comment.blog,
        id: comment.blog.id.toString(),
      },
    };

    return NextResponse.json(transformedComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}