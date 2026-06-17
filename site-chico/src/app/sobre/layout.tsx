import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conheça a história e os valores da Franci\'s Creative Kitchen — pimentas artesanais e molhos autorais.',
};

export default function SobreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
