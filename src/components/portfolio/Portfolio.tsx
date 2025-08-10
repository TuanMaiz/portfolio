'use client';

import { useGetPublishedBlogs, Blog } from '@/lib/api';
import { portfolioConfig, sampleNewsData } from '@/lib/config/portfolio';
import Hero from '@/components/portfolio/Hero';
import ContactInfo from '@/components/portfolio/ContactInfo';
import NewsList from '@/components/portfolio/NewsList';
import BlogsList from '@/components/portfolio/BlogsList';
import Navigation from '@/components/portfolio/Navigation';

const navigationSections = [
  { id: "hero", label: "About" },
  ...(portfolioConfig.features.showNews ? [{ id: "news", label: "News" }] : []),
  ...(portfolioConfig.features.showBlogs ? [{ id: "blogs", label: "Blog Posts" }] : []),
];

export default function Portfolio() {
  const { data: blogs, isLoading, error } = useGetPublishedBlogs({
    enabled: portfolioConfig.features.showBlogs,
  });
  
  // Type guard to ensure blogs is an array of Blog objects
  const blogsList: Blog[] = Array.isArray(blogs) ? blogs : [];

  if (error) {
    console.error('Error loading blogs:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation sections={navigationSections} />
      
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div id="hero">
          <Hero
            name={portfolioConfig.personal.name}
            title={portfolioConfig.personal.title}
            description={portfolioConfig.personal.description}
          />
        </div>

        <ContactInfo
          email={portfolioConfig.personal.email}
          location={portfolioConfig.personal.location}
          cvUrl={portfolioConfig.personal.cvUrl}
          socialLinks={portfolioConfig.personal.socialLinks}
        />

        {portfolioConfig.features.showNews && (
          <div id="news">
            <NewsList news={sampleNewsData} />
          </div>
        )}

        {portfolioConfig.features.showBlogs && (
          <div id="blogs">
            {isLoading ? (
              <section className="mb-12">
                <h2 className="text-2xl font-light text-gray-900 mb-6">Blog Posts</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                        <div className="flex-1">
                          <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
                          <div className="w-full h-4 bg-gray-200 rounded mb-1"></div>
                          <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <BlogsList blogs={blogsList} />
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 {portfolioConfig.personal.name}. Built with Next.js, Prisma, and TailwindCSS.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}