import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";

type Props = {
  name: string;
  price: string;
  rating: number;
  slug: string;
  tag?: string;
};

export default function ProductCard({ name, price, rating, slug, tag }: Props) {
  return (
    <Link href={`/produto/${slug}`}>
      <div className="bg-white shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer">
        {/* Imagem placeholder */}
        <div className="bg-off-white h-52 relative">
          {tag && (
            <span className="absolute top-3 left-3 bg-brand text-white text-xs font-semibold px-2 py-1">
              {tag}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-pitch text-sm mb-1 group-hover:text-brand transition-colors">
            {name}
          </h3>

          {/* Estrelas */}
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < rating ? "fill-brand text-brand" : "text-gray-300"}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-pitch font-bold text-base">{price}</span>
            <div className="bg-brand hover:bg-brand-dark text-white p-2 transition-colors">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
