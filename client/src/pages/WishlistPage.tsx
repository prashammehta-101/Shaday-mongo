import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/http";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../lib/types";

export const WishlistPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!user) return;
    api.get("/wishlist").then(({ data }) =>
      setProducts(
        data.items.map((item: { product: Product & { _id?: string } }) => ({
          ...item.product,
          id: item.product._id || item.product.id,
        }))
      )
    );
  }, [user]);

  if (!user) return (
    <div className="glass-panel p-8 text-white">
      Please <Link to="/login" className="underline">login</Link> to view your wishlist.
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="glass-panel p-6">
        <div className="text-xs uppercase tracking-[0.34em] text-white/45">Wishlist</div>
        <h1 className="mt-2 font-serif text-4xl text-white">Saved Luxury Picks</h1>
      </section>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <Link key={product.id} to={`/products/${product.slug}`} className="glass-panel overflow-hidden">
            <img src={product.images[0]?.url} alt={product.name} className="h-80 w-full object-cover" />
            <div className="p-5">
              <div className="font-serif text-2xl text-white">{product.name}</div>
              <div className="mt-2 text-sm text-white/58">Rs. {product.price}</div>
            </div>
          </Link>
        ))}
        {products.length === 0 && <div className="text-sm text-white/55">No saved products yet.</div>}
      </div>
    </div>
  );
};
