import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/http";
import { useAuth } from "../context/AuthContext";
import type { CartItem } from "../lib/types";

export const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);

  const loadCart = async () => {
    if (!user) return;
    const { data } = await api.get("/cart");
    setItems(data.items);
  };

  useEffect(() => { if (user) void loadCart(); }, [user]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.product.price * i.quantity, 0), [items]);

  if (!user) return (
    <div className="glass-panel p-8 text-white">
      Please <Link to="/login" className="underline">login</Link> to view your cart.
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <section className="glass-panel p-6">
        <div className="text-xs uppercase tracking-[0.34em] text-white/45">Cart</div>
        <h1 className="mt-2 font-serif text-4xl text-white">Your Selections</h1>
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-[1.75rem] border border-white/12 bg-white/8 p-4 md:flex-row">
              <img src={item.product.images[0]?.url} alt={item.product.name} className="h-36 w-full rounded-[1.2rem] object-cover md:w-36" />
              <div className="flex-1">
                <div className="font-serif text-2xl text-white">{item.product.name}</div>
                <div className="mt-2 text-sm text-white/58">Size: {item.size}</div>
                <div className="mt-4 flex items-center gap-3">
                  <input
                    type="number" min={1} value={item.quantity}
                    onChange={async (e) => {
                      await api.patch(`/cart/${item.id}`, { quantity: Number(e.target.value) });
                      void loadCart();
                    }}
                    className="w-24 rounded-full border border-white/14 bg-black/20 px-4 py-2 text-sm text-white outline-none"
                  />
                  <button type="button" onClick={async () => { await api.delete(`/cart/${item.id}`); void loadCart(); }}
                    className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm text-white">
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-lg font-medium text-white">Rs. {item.product.price * item.quantity}</div>
            </article>
          ))}
          {items.length === 0 && <div className="text-sm text-white/55">Your cart is empty.</div>}
        </div>
      </section>

      <aside className="glass-panel p-6">
        <div className="text-xs uppercase tracking-[0.34em] text-white/45">Summary</div>
        <div className="mt-6 space-y-3 text-sm text-white/68">
          <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{subtotal > 3999 ? "Free" : "Rs. 199"}</span></div>
          <div className="flex justify-between border-t border-white/12 pt-3 text-base text-white">
            <span>Total</span><span>Rs. {subtotal > 3999 ? subtotal : subtotal + 199}</span>
          </div>
        </div>
        <button type="button" disabled={items.length === 0} onClick={() => navigate("/checkout")}
          className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 disabled:opacity-40">
          Continue to Checkout
        </button>
      </aside>
    </div>
  );
};
