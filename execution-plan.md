# Execution Plan for Backend with Prisma in a Next.js (TypeScript) Portfolio Project

## 1. Set Up the Project


### Install Prisma and Dependencies
```bash
npm install prisma @prisma/client
```

### Initialize Prisma
```bash
npx prisma init
```

This generates:
- `prisma/schema.prisma`
- `.env`

### Configure PostgreSQL Database in `.env`
```env
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"
```

## 2. Define the Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            BigInt     @id @default(autoincrement())
  name          String
  email         String     @unique
  passwordHash  String
  role          Role       @default(READER)
  bio           String?
  avatarUrl     String?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  blogs         Blog[]
  comments      Comment[]
  likes         Like[]
}

model Blog {
  id            BigInt      @id @default(autoincrement())
  authorId      BigInt
  title         String
  slug          String      @unique
  content       String
  coverImage    String?
  status        BlogStatus  @default(DRAFT)
  publishedAt   DateTime?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  author        User        @relation(fields: [authorId], references: [id])
  tags          BlogTag[]
  comments      Comment[]
  likes         Like[]
}

model Tag {
  id            BigInt      @id @default(autoincrement())
  name          String      @unique
  blogs         BlogTag[]
}

model BlogTag {
  blogId        BigInt
  tagId         BigInt
  blog          Blog        @relation(fields: [blogId], references: [id], onDelete: Cascade)
  tag           Tag         @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@id([blogId, tagId])
}

model Comment {
  id            BigInt      @id @default(autoincrement())
  blogId        BigInt
  userId        BigInt
  content       String
  createdAt     DateTime    @default(now())
  blog          Blog        @relation(fields: [blogId], references: [id], onDelete: Cascade)
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model DashboardMetric {
  id            BigInt      @id @default(autoincrement())
  metricName    String
  metricValue   BigInt
  recordedAt    DateTime    @default(now())
}

model Like {
  id            BigInt      @id @default(autoincrement())
  blogId        BigInt
  userId        BigInt
  createdAt     DateTime    @default(now())
  blog          Blog        @relation(fields: [blogId], references: [id], onDelete: Cascade)
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([blogId, userId])
}

enum Role {
  ADMIN
  AUTHOR
  READER
}

enum BlogStatus {
  DRAFT
  PUBLISHED
}
```

### Validate Schema
```bash
npx prisma validate
```

## 3. Migrate the Database

```bash
npx prisma migrate dev --name init
```

This:
- Creates tables.
- Generates migration files in `prisma/migrations`.

### Inspect Database
```bash
npx prisma studio
```

## 4. Generate Prisma Client

```bash
npx prisma generate
```

### Example TypeScript API Route (`pages/api/users.ts`)
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
}
```

## 5. Seed the Database (Optional)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: 'hashed_password',
      role: 'ADMIN',
      bio: 'This is the admin user.',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Update `package.json`:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

Run the seed:

```bash
npx prisma db seed
```

## 6. Develop API Endpoints

Example Blog API (`pages/api/blogs.ts`):

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, content, authorId } = req.body;
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        authorId,
        slug: title.toLowerCase().replace(/ /g, '-'),
      },
    });
    res.status(201).json(blog);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

## 7. Test and Debug

### Testing
Use Postman or Thunder Client to test API endpoints.

### Enable Prisma Logging
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```