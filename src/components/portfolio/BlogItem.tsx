'use client'
import { Blog, useGetBlogBySlug } from "@/lib/api";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { notFound } from "next/navigation";

interface BlogProps{
    slug: string;
}

export default function BlogItem({ slug }: BlogProps) {
  const {data: blog, isLoading, isError} = useGetBlogBySlug(slug)
  if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="animate-pulse">
              <div className="w-3/4 h-8 bg-gray-200 rounded mb-4"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-full h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
  
    if (isError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light text-gray-900 mb-4">Error loading blog post</h1>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      );
    }
    
    if (!blog) {
      notFound();
    }

    // Type guard to ensure blog has required properties
    const blogData = blog as Blog;

    return (
        <div className="min-h-screen bg-gray-50">
              <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Back link */}
                <div className="mb-8">
                  <a
                    href="/"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    ← Back to portfolio
                  </a>
                </div>
        
                {/* Blog header */}
                <header className="mb-12">
                  <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
                    {blogData.title}
                  </h1>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-4">
                      <time>{formatDate(blogData.publishedAt || blogData.createdAt)}</time>
                      <span>•</span>
                      <span>{formatRelativeTime(blogData.publishedAt || blogData.createdAt)}</span>
                    </div>
                    
                    {(blogData.commentCount || blogData.likeCount) && (
                      <>
                        <span className="hidden md:block">•</span>
                        <div className="flex items-center gap-4">
                          {blogData.commentCount !== undefined && blogData.commentCount > 0 && (
                            <span>{blogData.commentCount} comments</span>
                          )}
                          {blogData.likeCount !== undefined && blogData.likeCount > 0 && (
                            <span>{blogData.likeCount} likes</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
        
                  {blogData.tags && blogData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {blogData.tags.map((tag: { id: string; name: string }) => (
                        <span
                          key={tag.id}
                          className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </header>
        
                {/* Blog content */}
                <article className="prose prose-lg prose-gray max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                    {blogData.content}
                  </div>
                </article>
        
                {/* Author info */}
                <footer className="mt-16 pt-8 border-t border-gray-200">
                  {blogData.author && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {blogData.author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{blogData.author.name}</p>
                        <p className="text-sm text-gray-600">{blogData.author.email}</p>
                      </div>
                    </div>
                  )}
                </footer>
              </div>
            </div>
    )
}