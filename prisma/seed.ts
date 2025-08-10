import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: 'hashed_password_here', // In real app, use proper hashing
      role: 'ADMIN',
      bio: 'This is the admin user for the portfolio.',
      avatarUrl: 'https://via.placeholder.com/150',
    },
  });

  // Create author user
  const authorUser = await prisma.user.upsert({
    where: { email: 'author@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'author@example.com',
      passwordHash: 'hashed_password_here',
      role: 'AUTHOR',
      bio: 'Software developer and technical writer.',
      avatarUrl: 'https://via.placeholder.com/150',
    },
  });

  // Create reader user
  const readerUser = await prisma.user.upsert({
    where: { email: 'reader@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'reader@example.com',
      passwordHash: 'hashed_password_here',
      role: 'READER',
      bio: 'Avid reader and tech enthusiast.',
      avatarUrl: 'https://via.placeholder.com/150',
    },
  });

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'JavaScript' },
      update: {},
      create: { name: 'JavaScript' },
    }),
    prisma.tag.upsert({
      where: { name: 'TypeScript' },
      update: {},
      create: { name: 'TypeScript' },
    }),
    prisma.tag.upsert({
      where: { name: 'React' },
      update: {},
      create: { name: 'React' },
    }),
    prisma.tag.upsert({
      where: { name: 'Next.js' },
      update: {},
      create: { name: 'Next.js' },
    }),
    prisma.tag.upsert({
      where: { name: 'Prisma' },
      update: {},
      create: { name: 'Prisma' },
    }),
  ]);

  // Create sample blogs
  const blog1 = await prisma.blog.upsert({
    where: { slug: 'getting-started-with-nextjs' },
    update: {},
    create: {
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      content: `# Getting Started with Next.js

Next.js is a powerful React framework that makes building web applications easier and more efficient. In this post, we'll explore the basics of Next.js and how to get started.

## What is Next.js?

Next.js is a React framework that provides many features out of the box:
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- File-based routing
- And much more!

## Installation

To get started with Next.js, you can use create-next-app:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This will create a new Next.js application and start the development server.

## Conclusion

Next.js is an excellent choice for building modern web applications with React. Its built-in features and optimizations make it easy to create fast, scalable applications.`,
      coverImage: 'https://via.placeholder.com/800x400',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: authorUser.id,
      tags: {
        create: [
          { tag: { connect: { id: tags.find(t => t.name === 'Next.js')!.id } } },
          { tag: { connect: { id: tags.find(t => t.name === 'React')!.id } } },
          { tag: { connect: { id: tags.find(t => t.name === 'JavaScript')!.id } } },
        ],
      },
    },
  });

  const blog2 = await prisma.blog.upsert({
    where: { slug: 'typescript-best-practices' },
    update: {},
    create: {
      title: 'TypeScript Best Practices',
      slug: 'typescript-best-practices',
      content: `# TypeScript Best Practices

TypeScript has become an essential tool for JavaScript developers. Here are some best practices to help you write better TypeScript code.

## 1. Use Strict Mode

Always enable strict mode in your TypeScript configuration:

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

## 2. Define Interfaces for Objects

Instead of using \`any\`, define proper interfaces:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}
\`\`\`

## 3. Use Union Types

Union types are powerful for handling multiple possible types:

\`\`\`typescript
type Status = 'loading' | 'success' | 'error';
\`\`\`

## Conclusion

Following these best practices will help you write more maintainable and type-safe TypeScript code.`,
      coverImage: 'https://via.placeholder.com/800x400',
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      authorId: authorUser.id,
      tags: {
        create: [
          { tag: { connect: { id: tags.find(t => t.name === 'TypeScript')!.id } } },
          { tag: { connect: { id: tags.find(t => t.name === 'JavaScript')!.id } } },
        ],
      },
    },
  });

  const blog3 = await prisma.blog.upsert({
    where: { slug: 'building-apis-with-prisma' },
    update: {},
    create: {
      title: 'Building APIs with Prisma',
      slug: 'building-apis-with-prisma',
      content: `# Building APIs with Prisma

Prisma is a modern database toolkit that makes working with databases easier. In this post, we'll explore how to build APIs using Prisma.

## What is Prisma?

Prisma is a next-generation ORM that consists of:
- Prisma Client: Auto-generated and type-safe query builder
- Prisma Migrate: Migration system
- Prisma Studio: Database GUI

## Setting Up Prisma

First, install Prisma:

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## Defining Your Schema

Define your data model in \`schema.prisma\`:

\`\`\`prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
\`\`\`

## Conclusion

Prisma makes database operations type-safe and enjoyable. It's a great choice for modern applications.`,
      status: 'DRAFT',
      authorId: authorUser.id,
      tags: {
        create: [
          { tag: { connect: { id: tags.find(t => t.name === 'Prisma')!.id } } },
          { tag: { connect: { id: tags.find(t => t.name === 'TypeScript')!.id } } },
        ],
      },
    },
  });

  // Create sample comments
  await prisma.comment.createMany({
    data: [
      {
        blogId: blog1.id,
        userId: readerUser.id,
        content: 'Great introduction to Next.js! Very helpful for beginners.',
      },
      {
        blogId: blog1.id,
        userId: adminUser.id,
        content: 'Thanks for the feedback! Glad you found it useful.',
      },
      {
        blogId: blog2.id,
        userId: readerUser.id,
        content: 'These TypeScript tips are gold. Thanks for sharing!',
      },
    ],
  });

  // Create sample likes
  await prisma.like.createMany({
    data: [
      {
        blogId: blog1.id,
        userId: readerUser.id,
      },
      {
        blogId: blog1.id,
        userId: adminUser.id,
      },
      {
        blogId: blog2.id,
        userId: readerUser.id,
      },
    ],
  });

  // Create dashboard metrics
  await prisma.dashboardMetric.createMany({
    data: [
      {
        metricName: 'total_users',
        metricValue: BigInt(3),
      },
      {
        metricName: 'total_blogs',
        metricValue: BigInt(3),
      },
      {
        metricName: 'total_comments',
        metricValue: BigInt(3),
      },
      {
        metricName: 'total_likes',
        metricValue: BigInt(3),
      },
    ],
  });

  console.log('Database seeded successfully!');
  console.log('Created users:', { adminUser, authorUser, readerUser });
  console.log('Created blogs:', { blog1, blog2, blog3 });
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });