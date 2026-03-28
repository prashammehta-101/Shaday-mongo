import { useEffect, useState } from "react";
import { api } from "../api/http";
import { ProductGrid } from "../components/sections/ProductGrid";
import { Hero } from "../components/sections/Hero";
import type { Product } from "../lib/types";

export const HomePage = () => {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/products?featured=true").then(({ data }) =>
      setFeatured(
        data.products
          .slice(0, 3)
          .map((p: Product & { _id?: string }) => ({ ...p, id: p._id || p.id }))
      )
    );
  }, []);

  return (
    <div className="space-y-10">
      <Hero />
      <section className="glass-panel p-6 md:p-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="brutal-label">Launch Collection</div>
            <h2 className="mt-4 font-serif text-5xl">Featured Shirts</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--text-soft)]">
            Browse the full catalog after login — filter by fit, sleeve, color, and price.
          </p>
        </div>
        <div className="mt-8">
          <ProductGrid products={featured} />
        </div>
      </section>
    </div>
  );
};
