import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform the response
    const transformedTags = tags.map(tag => ({
      ...tag,
      id: tag.id.toString(),
      blogCount: tag._count.blogs,
    }));

    return NextResponse.json(transformedTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
      },
    });

    // Transform the response
    const transformedTag = {
      ...tag,
      id: tag.id.toString(),
    };

    return NextResponse.json(transformedTag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Tag already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}