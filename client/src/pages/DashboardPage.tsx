import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/http";
import { useAuth } from "../context/AuthContext";
import type { Order, Product } from "../lib/types";

interface Metrics { users?: number; products: number; orders: number; revenue: number; }
const emptyForm = { name: "", price: 0, compareAtPrice: 0, shortDesc: "", description: "", fabric: "", color: "", fit: "SLIM", sleeve: "FULL", pattern: "", collar: "", gsm: "", stock: 0, featured: false, published: true, images: "", sizes: "S,M,L,XL" };

export const DashboardPage = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    if (!user) return;
    if (user.role === "ADMIN") {
      const [m, o, p] = await Promise.all([
        api.get("/dashboard/admin"),
        api.get("/orders/admin/all"),
        api.get("/products"),
      ]);
      setMetrics(m.data.metrics);
      setOrders(o.data.orders);
      setProducts(p.data.products.map((pr: Product & { _id?: string }) => ({ ...pr, id: pr._id || pr.id })));
    } else if (user.role === "SELLER") {
      const [m, p] = await Promise.all([api.get("/dashboard/seller"), api.get("/products/seller")]);
      setMetrics(m.data.metrics);
      setProducts(p.data.products.map((pr: Product & { _id?: string }) => ({ ...pr, id: pr._id || pr.id })));
    }
  };

  useEffect(() => { void load(); }, [user]);

  if (!user) return <div className="glass-panel p-8 text-white">Please <Link to="/login" className="underline">login</Link>.</div>;
  if (user.role === "CUSTOMER") return <div className="glass-panel p-8 text-white">Dashboard is for Admin and Seller roles.</div>;

  const createProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreating(true);
    try {
      await api.post("/products", {
        ...form,
        images: form.images.split(",").map((u) => u.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map((s) => ({ label: s.trim(), stock: Math.max(1, Math.floor(Number(form.stock) / 4)) || 5 })),
      });
      setForm(emptyForm);
      void load();
    } finally { setCreating(false); }
  };

  return (
    <div className="space-y-8">
      <section className="glass-panel p-6 md:p-8">
        <div className="text-xs uppercase tracking-[0.34em] text-white/45">
          {user.role === "ADMIN" ? "Admin control center" : "Seller workspace"}
        </div>
        <h1 className="mt-2 font-serif text-4xl text-white">
          {user.role === "ADMIN" ? "Operations Dashboard" : "Seller Dashboard"}
        </h1>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        {user.role === "ADMIN" && (
          <div className="glass-panel p-6">
            <div className="text-sm text-white/55">Total Users</div>
            <div className="mt-2 font-serif text-4xl text-white">{metrics?.users || 0}</div>
          </div>
        )}
        <div className="glass-panel p-6">
          <div className="text-sm text-white/55">Products</div>
          <div className="mt-2 font-serif text-4xl text-white">{metrics?.products || 0}</div>
        </div>
        <div className="glass-panel p-6">
          <div className="text-sm text-white/55">Orders</div>
          <div className="mt-2 font-serif text-4xl text-white">{metrics?.orders || 0}</div>
        </div>
        <div className="glass-panel p-6">
          <div className="text-sm text-white/55">Revenue</div>
          <div className="mt-2 font-serif text-4xl text-white">Rs. {metrics?.revenue || 0}</div>
        </div>
      </div>

      {user.role === "ADMIN" && (
        <section className="glass-panel p-6">
          <h2 className="font-serif text-3xl text-white">Order Oversight</h2>
          <div className="mt-5 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-[1.5rem] border border-white/12 bg-white/8 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm text-white">{order.orderNumber}</div>
                    <div className="mt-1 text-sm text-white/58">{order.status} • Rs. {order.total}</div>
                  </div>
                  <select defaultValue={order.status}
                    onChange={async (e) => { await api.patch(`/orders/${order.id}/status`, { status: e.target.value }); void load(); }}
                    className="rounded-full border border-white/14 bg-black/25 px-4 py-2 text-sm text-white">
                    {["PLACED","PROCESSING","PACKED","SHIPPED","DELIVERED","CANCELLED"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {orders.length === 0 && <div className="text-sm text-white/55">No orders yet.</div>}
          </div>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="glass-panel p-6">
          <h2 className="font-serif text-3xl text-white">Product Catalog</h2>
          <div className="mt-5 space-y-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-[1.4rem] border border-white/12 bg-white/8 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-white">{product.name}</div>
                    <div className="mt-1 text-sm text-white/55">{product.color} • {product.stock} in stock</div>
                  </div>
                  <div className="text-sm text-white/70">Rs. {product.price}</div>
                </div>
              </div>
            ))}
            {products.length === 0 && <div className="text-sm text-white/55">No products yet.</div>}
          </div>
        </section>

        <section className="glass-panel p-6">
          <h2 className="font-serif text-3xl text-white">Create Product</h2>
          <form onSubmit={createProduct} className="mt-5 grid gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name *" className="field" required />
            <div className="grid gap-3 md:grid-cols-2">
              <input value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price *" className="field" type="number" required />
              <input value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })} placeholder="Compare price" className="field" type="number" />
            </div>
            <input value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} placeholder="Short description" className="field" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Full description" className="field min-h-24 rounded-[1.5rem]" />
            <div className="grid gap-3 md:grid-cols-2">
              <input value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} placeholder="Fabric (e.g. Linen)" className="field" />
              <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Color (e.g. Ivory)" className="field" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <select value={form.fit} onChange={(e) => setForm({ ...form, fit: e.target.value })} className="field">
                <option value="SLIM">SLIM</option><option value="REGULAR">REGULAR</option><option value="RELAXED">RELAXED</option>
              </select>
              <select value={form.sleeve} onChange={(e) => setForm({ ...form, sleeve: e.target.value })} className="field">
                <option value="FULL">FULL</option><option value="HALF">HALF</option>
              </select>
              <input value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} placeholder="Total stock" className="field" type="number" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input value={form.pattern} onChange={(e) => setForm({ ...form, pattern: e.target.value })} placeholder="Pattern (e.g. Solid)" className="field" />
              <input value={form.collar} onChange={(e) => setForm({ ...form, collar: e.target.value })} placeholder="Collar (e.g. Spread)" className="field" />
            </div>
            <input value={form.gsm} onChange={(e) => setForm({ ...form, gsm: e.target.value })} placeholder="GSM (e.g. 180)" className="field" />
            <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="Image URLs (comma-separated)" className="field" />
            <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="Sizes comma-separated (e.g. S,M,L,XL)" className="field" />
            <button type="submit" disabled={creating} className="mt-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 disabled:opacity-50">
              {creating ? "Publishing..." : "Publish Product"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};
