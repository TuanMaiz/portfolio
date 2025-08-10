# Modern Portfolio Website

A clean, minimalist portfolio website built with Next.js 15, TypeScript, TailwindCSS, and Prisma. This portfolio follows the design principles inspired by [mattdeitke.com](https://mattdeitke.com) with a focus on typography, spacing, and subtle interactions.

## Features

- **Minimalist Design**: Clean aesthetic with generous whitespace and thoughtful typography
- **Responsive Layout**: Works beautifully on all device sizes
- **Blog System**: Full-featured blog with tagging, search, and metadata
- **Performance Optimized**: Fast loading with efficient caching strategies
- **Type Safety**: Complete TypeScript coverage for reliability
- **SEO Friendly**: Proper metadata and Open Graph tags
- **Smooth Animations**: Subtle transitions and scroll effects
- **Dark Mode Ready**: Easily extendable for dark mode support

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Prisma** ORM for database management
- **PostgreSQL** as the database
- **TanStack Query** for data fetching and caching
- **Axios** for HTTP requests

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the database URL in `.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

6. Seed the database:
   ```bash
   npx prisma db seed
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # Backend API routes
│   ├── blog/              # Blog pages
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main portfolio page
├── components/            # React components
│   └── portfolio/         # Portfolio-specific components
├── lib/                   # Library and utilities
│   ├── api/               # API client and hooks
│   ├── config/            # Configuration files
│   ├── providers/         # React providers
│   └── utils.ts           # Utility functions
└── prisma/                # Prisma schema and migrations
```

## Customization

### Personal Information

Update your personal information in `src/lib/config/portfolio.ts`:

```typescript
export const portfolioConfig: PortfolioConfig = {
  personal: {
    name: "Your Name",
    title: "Your Professional Title",
    description: "Your bio/description",
    email: "your.email@example.com",
    location: "Your Location",
    cvUrl: "/cv.pdf",
    socialLinks: {
      github: "https://github.com/yourusername",
      twitter: "https://twitter.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
    },
  },
  // ... other configuration
};
```

### Feature Toggles

Enable or disable features in the configuration:

```typescript
features: {
  showNews: true,      // Show news/updates section
  showBlogs: true,     // Show blog posts section
  showProjects: false, // Show projects section (not implemented yet)
  enableComments: true, // Enable comments on blog posts
  enableLikes: true,    // Enable likes on blog posts
}
```

## Components

### Hero Section
Displays your name, title, and description with proper typography.

### Contact Info
Shows your email, location, and social links in a clean layout.

### News List
Chronological list of updates, awards, talks, and other highlights.

### Blogs List
Displays your published blog posts with excerpts, tags, and metadata.

### Navigation
Floating navigation that smoothly scrolls to sections on larger screens.

## API Integration

The portfolio integrates with a REST API built using Next.js API routes. The API provides:

- User management
- Blog post management
- Comments and likes
- Search functionality
- Dashboard metrics

All API calls are managed through TanStack Query hooks for optimal performance and caching.

## Styling

The portfolio uses TailwindCSS for styling with a custom configuration focused on:

- **Typography**: Carefully chosen font sizes and line heights
- **Spacing**: Consistent spacing using a modular scale
- **Colors**: Soft, accessible color palette
- **Responsiveness**: Mobile-first approach with breakpoints

## Performance

- **Caching**: Smart caching strategies with TanStack Query
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Built-in Next.js image optimization
- **Minification**: Automatic minification in production builds

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspiration from [mattdeitke.com](https://mattdeitke.com)
- Built with [Next.js](https://nextjs.org)
- Styled with [TailwindCSS](https://tailwindcss.com)
- Data management with [Prisma](https://prisma.io)
- State management with [TanStack Query](https://tanstack.com/query)