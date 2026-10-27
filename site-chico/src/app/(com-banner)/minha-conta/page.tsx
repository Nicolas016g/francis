import type { Metadata } from 'next';
import { User, ShoppingBag, MapPin, Lock } from "lucide-react";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSessionUserId, SESSION_COOKIE } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileForm from './ProfileForm';

export const metadata: Metadata = {
  title: 'Minha Conta',
  description: 'Gerencie seus dados, pedidos e endereços.',
};

export default async function MinhaConta() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = await getSessionUserId(token);
  if (!userId) redirect('/login?redirect=/minha-conta');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, phone: true },
  });
  if (!user) redirect('/login?redirect=/minha-conta');

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: { select: { name: true } } } }, payment: true },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-pitch mb-8">
        Minha <span className="text-brand">Conta</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <nav className="bg-white shadow-sm overflow-hidden">
            {[
              { icon: <User className="w-4 h-4" />, label: "Dados Pessoais", active: true },
              { icon: <ShoppingBag className="w-4 h-4" />, label: "Meus Pedidos", active: false },
              { icon: <MapPin className="w-4 h-4" />, label: "Endereços", active: false },
              { icon: <Lock className="w-4 h-4" />, label: "Segurança", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left border-b last:border-0 border-gray-50 ${
                  item.active ? "text-brand bg-orange-50" : "text-pitch/70 hover:text-brand hover:bg-orange-50"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Conteúdo */}
        <div className="md:col-span-3">
          <div className="bg-white shadow-sm p-6">
            <h2 className="font-bold text-pitch mb-6">Dados Pessoais</h2>
            <ProfileForm user={user} />
          </div>

          <div className="bg-white shadow-sm p-6 mt-6">
            <h2 className="font-bold text-pitch mb-6">Meus Pedidos</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-pitch/60">Você ainda não possui pedidos.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <article key={order.id} className="border border-gray-100 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div>
                        <p className="font-semibold text-pitch">Pedido #{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-pitch/50">{order.createdAt.toLocaleDateString('pt-BR')}</p>
                      </div>
                      <span className="text-xs font-semibold uppercase text-brand">{order.status}</span>
                    </div>
                    <ul className="text-sm text-pitch/70 space-y-1">
                      {order.items.map((item) => <li key={item.id}>{item.quantity}x {item.product.name}</li>)}
                    </ul>
                    <p className="text-sm font-bold text-pitch mt-3">Total: R$ {order.total.toString().replace('.', ',')}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
