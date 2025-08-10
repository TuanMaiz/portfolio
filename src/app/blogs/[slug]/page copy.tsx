// app/blog/[slug]/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { blogsApi } from '@/lib/api';
import BlogItem from '@/components/portfolio/BlogItem';

interface Props {
  params: { slug: string };
}

export default async function BlogPage({ params }: Props) {
  const queryClient = new QueryClient();

  // Prefetch blog data server-side
  await queryClient.prefetchQuery({
    queryKey: ['blog', params.slug],
    queryFn: () => blogsApi.getBlogBySlug(params.slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogItem slug={params.slug} />
    </HydrationBoundary>
  );
}
