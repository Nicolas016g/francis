import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentAdmin } from '@/lib/admin';
import AdminNav from './_components/AdminNav';

export const metadata: Metadata = {
  title: 'Painel',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin, authenticated } = await getCurrentAdmin();

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white shadow-sm rounded p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-pitch mb-2">Área restrita</h1>
          <p className="text-pitch/70 mb-6">
            {authenticated
              ? 'Esta conta não tem acesso ao painel. Peça a quem cuida do site para liberar seu acesso.'
              : 'Entre com a conta de administrador para continuar.'}
          </p>
          <Link
            href={authenticated ? '/' : '/login?redirect=/admin'}
            className="inline-block bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded"
          >
            {authenticated ? 'Voltar ao site' : 'Entrar'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-pitch">
      <AdminNav adminName={admin.name} />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
