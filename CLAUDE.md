# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Database operations
npx prisma migrate dev    # Run migrations in development
npx prisma generate       # Generate Prisma client
npx prisma db seed        # Seed database with sample data
npx prisma studio         # Open Prisma Studio
```

## Architecture Overview

This is a modern portfolio website built with Next.js 15, TypeScript, TailwindCSS, and Prisma. The application follows a minimalist design philosophy with a focus on typography and performance.

### Key Architectural Patterns

- **Next.js App Router**: Uses the app directory structure for routing and layouts
- **API Routes**: RESTful API built with Next.js API routes under `/api/`
- **Database Layer**: PostgreSQL with Prisma ORM, featuring a blog system with users, comments, likes, and tags
- **State Management**: TanStack Query for server state management and caching
- **Component Architecture**: Modular React components organized under `src/components/portfolio/`
- **Configuration-Driven**: Personal information and feature toggles managed via `src/lib/config/portfolio.ts`

### Data Models

The application uses Prisma with these core models:
- **User**: Authentication and author management with roles (ADMIN, AUTHOR, READER)
- **Blog**: Blog posts with status (DRAFT, PUBLISHED), tags, and relationships
- **Comment/Like**: User engagement system for blog posts
- **Tag**: Blog categorization system
- **DashboardMetric**: Analytics data storage

### API Structure

All API endpoints are organized under `/api/`:
- `/api/blogs` - Blog CRUD operations
- `/api/users` - User management
- `/api/comments` - Comment system
- `/api/likes` - Like functionality
- `/api/tags` - Tag management
- `/api/search` - Search functionality
- `/api/dashboard` - Analytics data

### Frontend Components

Portfolio-specific components in `src/components/portfolio/`:
- `Portfolio.tsx` - Main portfolio layout
- `Hero.tsx` - Personal introduction section
- `ContactInfo.tsx` - Contact and social links
- `Navigation.tsx` - Section navigation
- `BlogsList.tsx` - Blog posts listing
- `BlogItem.tsx` - Individual blog post preview
- `NewsList.tsx` - News and updates section

### Configuration System

Personal information and features are configured in `src/lib/config/portfolio.ts`:
- Personal details (name, title, bio, contact info)
- SEO metadata
- Feature toggles (showNews, showBlogs, showProjects, enableComments, enableLikes)
- Sample news data for demonstration

## Development Notes

- Uses TypeScript throughout for type safety
- TanStack Query for data fetching with caching strategies
- TailwindCSS for styling with mobile-first responsive design
- Prisma for type-safe database operations
- Environment variables required: `DATABASE_URL`
- Database seeding script: `prisma/seed.ts`