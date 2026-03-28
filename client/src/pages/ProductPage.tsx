import { Heart, ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/http";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../lib/types";

export const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [wishlistSaved, setWishlistSaved] = useState(false);
  const [addingCart, setAddingCart] = useState(false);

  useEffect(() => {
    api.get(`/products/${slug}`).then(({ data }) => {
      const p = data.product;
      setProduct({ ...p, id: p._id || p.id });
      setSelectedSize(p.variants[0]?.size || "M");
    });
  }, [slug]);

  if (!product) return <div className="glass-panel p-8 text-white">Loading product...</div>;

  const requireUser = () => { if (!user) { navigate("/login"); return false; } return true; };

  const addToCart = async () => {
    if (!requireUser()) return;
    setAddingCart(true);
    try {
      await api.post("/cart", { productId: product.id || product._id, size: selectedSize, quantity: 1 });
      navigate("/cart");
    } finally { setAddingCart(false); }
  };

  const toggleWishlist = async () => {
    if (!requireUser()) return;
    const { data } = await api.post("/wishlist/toggle", { productId: product.id || product._id });
    setWishlistSaved(data.saved);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-panel overflow-hidden p-4">
        <img src={product.images[0]?.url} alt={product.name} className="h-[560px] w-full rounded-[1.8rem] object-cover" />
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {product.images.map((img) => (
              <img key={img.id} src={img.url} alt={img.alt || product.name} className="h-20 w-20 shrink-0 rounded-xl object-cover opacity-70 hover:opacity-100 cursor-pointer" />
            ))}
          </div>
        )}
      </div>

      <section className="glass-panel p-8">
        <div className="text-xs uppercase tracking-[0.34em] text-white/45">{product.fabric}</div>
        <h1 className="mt-3 font-serif text-5xl text-white">{product.name}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">{product.description}</p>
        <div className="mt-6 flex items-end gap-4">
          <div className="text-3xl font-semibold text-white">Rs. {product.price}</div>
          {product.compareAtPrice && (
            <div className="pb-1 text-lg text-white/35 line-through">Rs. {product.compareAtPrice}</div>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5 text-sm text-white/70">
            <div className="font-medium text-white">Specifications</div>
            <div className="mt-3 space-y-2">
              <div>Color: {product.color}</div>
              <div>Fit: {product.fit}</div>
              <div>Sleeve: {product.sleeve}</div>
              <div>Pattern: {product.pattern}</div>
              <div>Collar: {product.collar}</div>
              {product.gsm && <div>GSM: {product.gsm}</div>}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5 text-sm text-white/70">
            <div className="font-medium text-white">Available Sizes</div>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button key={variant.id} type="button" onClick={() => setSelectedSize(variant.size)}
                  className={`rounded-full border px-4 py-2 text-sm ${selectedSize === variant.size ? "border-white bg-white text-slate-950" : "border-white/16 bg-white/8 text-white"}`}>
                  {variant.size}
                  <span className="ml-1 text-xs opacity-60">({variant.stock})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button type="button" onClick={addToCart} disabled={addingCart}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 disabled:opacity-60">
            <ShoppingBag size={16} />{addingCart ? "Adding..." : "Add to Cart"}
          </button>
          <button type="button" onClick={toggleWishlist}
            className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium ${wishlistSaved ? "border-white bg-white text-slate-950" : "border-white/16 bg-white/10 text-white"}`}>
            <Heart size={16} fill={wishlistSaved ? "currentColor" : "none"} />
            {wishlistSaved ? "Saved" : "Save"}
          </button>
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-white/12 bg-white/8 p-6">
          <div className="flex items-center gap-3">
            <Star size={18} className="text-amber-300" />
            <h2 className="font-serif text-2xl text-white">Reviews</h2>
            {product.rating ? (
              <span className="ml-auto text-sm text-amber-300 font-medium">{product.rating}/5</span>
            ) : null}
          </div>
          <div className="mt-5 space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-[1.25rem] border border-white/10 bg-black/12 p-4">
                <div className="text-sm text-white">{review.user.name}</div>
                <div className="mt-1 text-sm text-white/65">{review.title} • {review.rating}/5</div>
                <p className="mt-2 text-sm leading-6 text-white/58">{review.comment}</p>
              </div>
            ))}
            {product.reviews.length === 0 && <div className="text-sm text-white/55">No reviews yet.</div>}
          </div>
        </div>
      </section>
    </div>
  );
};
