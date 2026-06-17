import Link from 'next/link';
import Image from 'next/image';

export default function LogoBanner() {
  return (
    <div className="bg-pitch w-full pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
        {/* Logo grande */}
        <Link href="/">
          <div className="relative h-64 w-[480px] max-w-full">
            <Image
              src="/logo_principal.png"
              alt="Franci's Creative Kitchen"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        {/* Separador decorativo */}
        <div className="flex items-center gap-4 w-full max-w-xl">
          <div className="flex-1 h-px bg-brand/40" />
          <span className="text-brand text-xs font-bold uppercase tracking-[0.3em]">Artesanal & Autoral</span>
          <div className="flex-1 h-px bg-brand/40" />
        </div>
      </div>
    </div>
  );
}

