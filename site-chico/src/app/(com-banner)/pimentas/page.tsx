import type { Metadata } from 'next';
import PimentasGrid from './PimentasGrid';

export const metadata: Metadata = {
  title: 'Pimentas Artesanais',
  description: 'Pimentas artesanais com diferentes níveis de ardência. Caseira, Dedo de Moça, Jalapeño, Sweet Chilli Chipotle e Malagueta com Pequi.',
};

const produtos = [
  { name: 'Pimenta Caseira', price: 'R$ 28,90', rating: 5, slug: 'pimenta-caseira', ardencia: 1 },
  { name: 'Pimenta Dedo de Moça', price: 'R$ 28,90', rating: 5, slug: 'pimenta-dedo-de-moca', tag: 'Mais Vendida', ardencia: 2 },
  { name: 'Pimenta Jalapeño', price: 'R$ 28,90', rating: 5, slug: 'pimenta-jalapeno', ardencia: 3 },
  { name: 'Sweet Chilli Chipotle', price: 'R$ 28,90', rating: 5, slug: 'pimenta-sweet-chilli-chipotle', ardencia: 3 },
  { name: 'Malagueta com Pequi', price: 'R$ 28,90', rating: 5, slug: 'pimenta-malagueta-com-pequi', tag: 'Especial', ardencia: 4 },
];

export default function Pimentas() {
  return <PimentasGrid produtos={produtos} />;
}

