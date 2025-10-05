import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET blog by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            bio: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const transformedBlog = {
      ...blog,
      id: blog.id.toString(),
      authorId: blog.authorId.toString(),
      author: {
        ...blog.author,
        id: blog.author.id.toString(),
      },
      tags: blog.tags.map((blogTag: { tag: { id: { toString: () => any; }; name: any; }; }) => ({
        id: blogTag.tag.id.toString(),
        name: blogTag.tag.name,
      })),
      comments: blog.comments.map((comment: { id: { toString: () => any; }; blogId: { toString: () => any; }; userId: { toString: () => any; }; user: { id: { toString: () => any; }; }; }) => ({
        ...comment,
        id: comment.id.toString(),
        blogId: comment.blogId.toString(),
        userId: comment.userId.toString(),
        user: {
          ...comment.user,
          id: comment.user.id.toString(),
        },
      })),
      likeCount: blog._count.likes,
    };

    return NextResponse.json(transformedBlog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

// UPDATE blog by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, content, coverImage, status, tags } = body;

    let newSlug: string | undefined;
    if (title) {
      newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (newSlug) updateData.slug = newSlug;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (status) {
      updateData.status = status;
      if (status === 'PUBLISHED') {
        updateData.publishedAt = new Date();
      }
    }

    if (tags) {
      await prisma.blogTag.deleteMany({
        where: { blog: { slug } },
      });

      updateData.tags = {
        create: tags.map((tagName: string) => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName },
              create: { name: tagName },
            },
          },
        })),
      };
    }

    const blog = await prisma.blog.update({
      where: { slug },
      data: updateData,
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

    const transformedBlog = {
      ...blog,
      id: blog.id.toString(),
      authorId: blog.authorId.toString(),
      author: {
        ...blog.author,
        id: blog.author.id.toString(),
      },
      tags: blog.tags.map((blogTag: { tag: { id: { toString: () => any; }; name: any; }; }) => ({
        id: blogTag.tag.id.toString(),
        name: blogTag.tag.name,
      })),
    };

    return NextResponse.json(transformedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// DELETE blog by slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await prisma.blog.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting blog:', error);

    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
