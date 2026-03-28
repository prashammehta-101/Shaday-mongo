import { useEffect, useState } from "react";
import { api } from "../api/http";
import { ProductGrid } from "../components/sections/ProductGrid";
import type { Product } from "../lib/types";

interface CatalogPageProps { onRequireAuth: () => void; }

export const CatalogPage = ({ onRequireAuth }: CatalogPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [color, setColor] = useState("");
  const [fit, setFit] = useState("");
  const [sleeve, setSleeve] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const loadProducts = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    if (color) params.set("color", color);
    if (fit) params.set("fit", fit);
    if (sleeve) params.set("sleeve", sleeve);
    if (maxPrice) params.set("maxPrice", maxPrice);
    api.get(`/products?${params}`).then(({ data }) =>
      setProducts(data.products.map((p: Product & { _id?: string }) => ({ ...p, id: p._id || p.id })))
    );
  };

  useEffect(() => { loadProducts(); }, [sort, color, fit, sleeve, maxPrice]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="editorial-shell h-fit p-6 lg:sticky lg:top-28">
        <div className="text-xs uppercase tracking-[0.34em] text-[var(--accent-deep)]">Filters</div>
        <h2 className="mt-2 font-serif text-3xl">Refine Collection</h2>
        <div className="mt-6 space-y-4">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search shirts" className="field" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="field">
            <option value="latest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
        <div className="mt-8 space-y-5">
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.28em] text-[var(--text-soft)]">Color</div>
            <select value={color} onChange={(e) => setColor(e.target.value)} className="field">
              <option value="">All colors</option>
              {["Ivory","Midnight Navy","Sage","Sandstone","Black","Coastal Blue","Bordeaux","Olive","Pearl White","Charcoal","Celeste Blue"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.28em] text-[var(--text-soft)]">Fit</div>
            <select value={fit} onChange={(e) => setFit(e.target.value)} className="field">
              <option value="">All fits</option>
              <option value="SLIM">Slim</option>
              <option value="REGULAR">Regular</option>
              <option value="RELAXED">Relaxed</option>
            </select>
          </div>
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.28em] text-[var(--text-soft)]">Sleeve</div>
            <select value={sleeve} onChange={(e) => setSleeve(e.target.value)} className="field">
              <option value="">All sleeves</option>
              <option value="FULL">Full sleeve</option>
              <option value="HALF">Half sleeve</option>
            </select>
          </div>
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.28em] text-[var(--text-soft)]">Budget</div>
            <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max price" className="field" type="number" />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <button type="button" onClick={loadProducts} className="accent-button rounded-full px-5 py-3 text-sm font-medium">Apply</button>
          <button type="button" onClick={() => { setSearch(""); setColor(""); setFit(""); setSleeve(""); setMaxPrice(""); setSort("latest"); }}
            className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-medium">Clear all</button>
        </div>
      </aside>

      <section className="space-y-6">
        <div>
          <div className="text-xs uppercase tracking-[0.34em] text-[var(--accent-deep)]">Product catalog</div>
          <h1 className="mt-2 font-serif text-4xl">Premium Shirt Collection</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-soft)]">
            Filter by color, fit, sleeve, and price to find your perfect SHADAY shirt.
          </p>
        </div>
        <ProductGrid products={products} onWishlist={() => onRequireAuth()} />
      </section>
    </div>
  );
};
