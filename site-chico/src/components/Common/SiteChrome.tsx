'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import LayoutWrapper from './LayoutWrapper';

/** Moldura do site público; o painel administrativo (/admin) usa o próprio layout. */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return <>{children}</>;

  return (
    <>
      <LayoutWrapper>
        <Header />
        <main className="flex-1 min-h-screen">{children}</main>
        <Footer />
      </LayoutWrapper>
      <WhatsAppButton />
    </>
  );
}
