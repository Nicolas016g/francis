import type { Metadata } from 'next';
import MolhosGrid from './MolhosGrid';

export const metadata: Metadata = {
  title: 'Molhos Autorais',
  description: "Molhos artesanais únicos: Ketchup, Mostarda, Barbecue, Cebola Caramelizada e Relish de Pepino. Receitas autorais da Franci's Creative Kitchen.",
};

const produtos = [
  { name: 'Ketchup Artesanal', price: 'R$ 28,90', rating: 5, slug: 'molho-ketchup', tag: 'Clássico', tipo: 'Clássico' },
  { name: 'Mostarda Artesanal', price: 'R$ 28,90', rating: 5, slug: 'molho-mostarda', tipo: 'Clássico' },
  { name: 'Barbecue Artesanal', price: 'R$ 28,90', rating: 5, slug: 'molho-barbecue', tag: 'Destaque', tipo: 'Defumado' },
  { name: 'Cebola Caramelizada', price: 'R$ 28,90', rating: 5, slug: 'molho-cebola-caramelizada', tipo: 'Especial' },
  { name: 'Relish de Pepino', price: 'R$ 28,90', rating: 5, slug: 'molho-relish-pepino', tipo: 'Especial' },
];

export default function Molhos() {
  return <MolhosGrid produtos={produtos} />;
}

