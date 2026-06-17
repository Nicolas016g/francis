'use client';

import { ReactNode } from 'react';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="flex min-h-screen">
      {/* Black bar esquerda */}
      <div className="hidden lg:block w-6 bg-dark-bar sticky top-0 h-screen shadow-lg"></div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col bg-white">{children}</div>

      {/* Black bar direita */}
      <div className="hidden lg:block w-6 bg-dark-bar sticky top-0 h-screen shadow-lg"></div>
    </div>
  );
}
