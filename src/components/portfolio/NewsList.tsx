import { formatDate } from '@/lib/utils';

interface NewsItem {
  id: string;
  date: string;
  title: string;
  description?: string;
  link?: string;
  type?: 'blog' | 'award' | 'talk' | 'project' | 'other';
}

interface NewsListProps {
  news: NewsItem[];
}

const getTypeColor = (type: NewsItem['type']) => {
  switch (type) {
    case 'blog':
      return 'text-blue-600 bg-blue-50';
    case 'award':
      return 'text-yellow-600 bg-yellow-50';
    case 'talk':
      return 'text-green-600 bg-green-50';
    case 'project':
      return 'text-purple-600 bg-purple-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const getTypeLabel = (type: NewsItem['type']) => {
  switch (type) {
    case 'blog':
      return 'Blog';
    case 'award':
      return 'Award';
    case 'talk':
      return 'Talk';
    case 'project':
      return 'Project';
    default:
      return 'News';
  }
};

export default function NewsList({ news }: NewsListProps) {
  if (!news.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-light text-gray-900 mb-6">News</h2>
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex items-center gap-3 md:min-w-[200px]">
              <time className="text-sm text-gray-500 font-mono">
                {formatDate(item.date)}
              </time>
              {item.type && (
                <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(item.type)}`}>
                  {getTypeLabel(item.type)}
                </span>
              )}
            </div>
            <div className="flex-1">
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-colors duration-200"
                >
                  {item.title}
                </a>
              ) : (
                <span className="text-gray-900">{item.title}</span>
              )}
              {item.description && (
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}