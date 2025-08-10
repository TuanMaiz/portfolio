import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blogId, userId } = body;

    if (!blogId || !userId) {
      return NextResponse.json(
        { error: 'BlogId and userId are required' },
        { status: 400 }
      );
    }

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        blogId_userId: {
          blogId: BigInt(blogId),
          userId: BigInt(userId),
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: 'Blog already liked by this user' },
        { status: 409 }
      );
    }

    const like = await prisma.like.create({
      data: {
        blogId: BigInt(blogId),
        userId: BigInt(userId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
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
    const transformedLike = {
      ...like,
      id: like.id.toString(),
      blogId: like.blogId.toString(),
      userId: like.userId.toString(),
      user: {
        ...like.user,
        id: like.user.id.toString(),
      },
      blog: {
        ...like.blog,
        id: like.blog.id.toString(),
      },
    };

    return NextResponse.json(transformedLike, { status: 201 });
  } catch (error) {
    console.error('Error creating like:', error);
    return NextResponse.json(
      { error: 'Failed to create like' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blogId');
    const userId = searchParams.get('userId');

    if (!blogId || !userId) {
      return NextResponse.json(
        { error: 'BlogId and userId are required' },
        { status: 400 }
      );
    }

    await prisma.like.delete({
      where: {
        blogId_userId: {
          blogId: BigInt(blogId),
          userId: BigInt(userId),
        },
      },
    });

    return NextResponse.json(
      { message: 'Like removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing like:', error);
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to remove like' },
      { status: 500 }
    );
  }
}