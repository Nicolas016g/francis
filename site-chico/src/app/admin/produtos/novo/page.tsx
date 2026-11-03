import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { PageTitle } from '../../_components/badges';
import ProductForm, { emptyProduct } from '../../_components/ProductForm';

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <>
      <Link href="/admin/produtos" className="text-sm text-pitch/70 hover:text-brand">← Voltar para produtos</Link>
      <div className="mt-3">
        <PageTitle title="Novo produto" subtitle="Preencha os dados abaixo. Você poderá alterar tudo depois." />
      </div>
      <ProductForm values={emptyProduct} />
    </>
  );
}
