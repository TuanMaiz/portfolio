'use client';

import Portfolio from '@/components/portfolio/Portfolio';
import QueryProvider from '@/lib/providers/QueryProvider';

export default function Home() {
  return (
        <QueryProvider >
          <Portfolio />
        </QueryProvider>

  );
}