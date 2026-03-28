import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../lib/types";

interface ProductGridProps {
  products: Product[];
  onWishlist?: (productId: string) => void;
  onQuickAdd?: (product: Product) => void;
}

export const ProductGrid = ({ products, onWishlist, onQuickAdd }: ProductGridProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const pid = product.id || (product as Product & { _id?: string })._id || "";
        return (
          <article key={pid} className="group overflow-hidden border-[3px] border-[var(--border)] bg-[var(--surface)] shadow-[10px_10px_0_var(--border)]">
            <div className="relative h-96 overflow-hidden">
              <img src={product.images[0]?.url} alt={product.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                <span className="border-[3px] border-[var(--border)] bg-[var(--accent)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--text-main)] shadow-[4px_4px_0_var(--border)]">
                  {product.color}
                </span>
                {onWishlist && (
                  <button type="button" onClick={() => onWishlist(pid)}
                    className="grid h-10 w-10 place-items-center border-[3px] border-[var(--border)] bg-[var(--surface)] shadow-[4px_4px_0_var(--border)]">
                    <Heart size={16} />
                  </button>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.88)_100%)] p-5 text-white">
                <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/75">{product.fabric}</div>
                <Link to={`/products/${product.slug}`} className="mt-2 block font-serif text-4xl leading-tight">
                  {product.name}
                </Link>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm leading-6 text-[var(--text-soft)]">{product.shortDesc}</p>
                <div className="text-right shrink-0">
                  <div className="text-xl font-semibold">Rs. {product.price}</div>
                  {product.compareAtPrice && (
                    <div className="text-sm text-[var(--text-soft)] line-through">Rs. {product.compareAtPrice}</div>
                  )}
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t-[3px] border-[var(--border)] pt-4">
                <div className="text-sm text-[var(--text-soft)]">
                  {product.fit} fit • {product.sleeve === "FULL" ? "Full sleeve" : "Half sleeve"}
                </div>
                {onQuickAdd && (
                  <button type="button" onClick={() => onQuickAdd(product)}
                    className="accent-button inline-flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em]">
                    <ShoppingBag size={16} />Quick Add
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
      {products.length === 0 && (
        <div className="col-span-full text-center py-12 text-[var(--text-soft)]">
          No products found. Try different filters.
        </div>
      )}
    </div>
  );
};
