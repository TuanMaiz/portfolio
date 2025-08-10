import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { portfolioConfig } from '@/lib/config/portfolio';
import './globals.css';
import QueryProvider from '@/lib/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: portfolioConfig.seo.title,
  description: portfolioConfig.seo.description,
  keywords: portfolioConfig.seo.keywords,
  authors: [{ name: portfolioConfig.personal.name, url: portfolioConfig.personal.email }],
  creator: portfolioConfig.personal.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourportfolio.com',
    title: portfolioConfig.seo.title,
    description: portfolioConfig.seo.description,
    siteName: portfolioConfig.personal.name,
    images: portfolioConfig.seo.ogImage ? [
      {
        url: portfolioConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: portfolioConfig.seo.title,
      }
    ] : [],
  },
  twitter: {
    card: 'summary_large_image',
    title: portfolioConfig.seo.title,
    description: portfolioConfig.seo.description,
    creator: portfolioConfig.personal.socialLinks?.twitter,
    images: portfolioConfig.seo.ogImage ? [portfolioConfig.seo.ogImage] : [],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>

        <QueryProvider>

          {children}
        </QueryProvider>

      </body>
    </html>
  );
}