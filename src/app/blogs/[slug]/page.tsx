import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { blogsApi } from '@/lib/api';
import BlogItem from '@/components/portfolio/BlogItem';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogsApi.getBlogBySlug(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogItem slug={slug} />
    </HydrationBoundary>
  );
}
