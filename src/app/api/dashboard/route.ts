import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get real-time metrics from the database
    const [userCount, blogCount, commentCount, likeCount, publishedBlogCount] = await Promise.all([
      prisma.user.count(),
      prisma.blog.count(),
      prisma.comment.count(),
      prisma.like.count(),
      prisma.blog.count({ where: { status: 'PUBLISHED' } }),
    ]);

    // Get recent activity
    const recentBlogs = await prisma.blog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    const recentComments = await prisma.comment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        blog: {
          select: {
            title: true,
          },
        },
      },
    });

    // Get popular tags
    const popularTags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
      orderBy: {
        blogs: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // Transform the response
    const metrics = {
      totalUsers: userCount,
      totalBlogs: blogCount,
      publishedBlogs: publishedBlogCount,
      draftBlogs: blogCount - publishedBlogCount,
      totalComments: commentCount,
      totalLikes: likeCount,
    };

    const transformedRecentBlogs = recentBlogs.map(blog => ({
      ...blog,
      id: blog.id.toString(),
      authorId: blog.authorId.toString(),
      commentCount: blog._count.comments,
      likeCount: blog._count.likes,
    }));

    const transformedRecentComments = recentComments.map(comment => ({
      ...comment,
      id: comment.id.toString(),
      blogId: comment.blogId.toString(),
      userId: comment.userId.toString(),
    }));

    const transformedPopularTags = popularTags.map(tag => ({
      ...tag,
      id: tag.id.toString(),
      blogCount: tag._count.blogs,
    }));

    const dashboardData = {
      metrics,
      recentBlogs: transformedRecentBlogs,
      recentComments: transformedRecentComments,
      popularTags: transformedPopularTags,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}