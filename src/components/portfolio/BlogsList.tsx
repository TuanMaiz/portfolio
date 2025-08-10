'use client'
import { Blog } from '@/lib/api';
import { formatDate, extractExcerpt } from '@/lib/utils';

interface BlogsListProps {
  blogs: Blog[];
}

export default function BlogsList({ blogs }: BlogsListProps) {
  if (!blogs.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-light text-gray-900 mb-6">Blog Posts</h2>
      <div className="space-y-8">
        {blogs.map((blog) => (
          <article key={blog.id} className="group">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="md:min-w-[120px]">
                <time className="text-sm text-gray-500 font-mono">
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </time>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors duration-200">
                  <a href={`/blogs/${blog.slug}`}>
                    {blog.title}
                  </a>
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {extractExcerpt(blog.content, 200)}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {blog.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 bg-gray-100 rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="text-gray-400">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    {blog.commentCount !== undefined && blog.commentCount > 0 && (
                      <span>{blog.commentCount} comments</span>
                    )}
                    {blog.likeCount !== undefined && blog.likeCount > 0 && (
                      <span>{blog.likeCount} likes</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-3">
                  <a
                    href={`/blogs/${blog.slug}`}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}