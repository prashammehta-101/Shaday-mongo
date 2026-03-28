import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/http";
import { useAuth } from "../context/AuthContext";
import type { Address, CartItem } from "../lib/types";

export const CheckoutPage = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressForm, setAddressForm] = useState({
    label: "Home", line1: "", line2: "", city: "", state: "", country: "India", postalCode: "", isPrimary: true,
  });
  const [saving, setSaving] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get("/cart").then(({ data }) => setItems(data.items));
    if (user.addresses?.length) {
      const primary = user.addresses.find((a) => a.isPrimary) || user.addresses[0];
      setSelectedAddressId(primary.id);
    }
  }, [user]);

  if (!user) return (
    <div className="glass-panel p-8 text-white">
      Please <Link to="/login" className="underline">login</Link> to checkout.
    </div>
  );

  const saveAddress = async () => {
    setSaving(true);
    try {
      const { data } = await api.post("/auth/addresses", addressForm);
      await refreshProfile();
      setSelectedAddressId(data.address._id || data.address.id);
    } finally { setSaving(false); }
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const addrId = selectedAddressId;
      if (!addrId) {
        alert("Please select or save a delivery address first.");
        return;
      }
      await api.post("/orders", { addressId: addrId, notes: "Cash on Delivery" });
      navigate("/orders");
    } finally { setPlacing(false); }
  };

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <section className="glass-panel p-6">
        <div className="text-xs uppercase tracking-[0.34em] text-white/45">Checkout</div>
        <h1 className="mt-2 font-serif text-4xl text-white">Delivery & COD</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-white/12 bg-white/8 p-5">
            <div className="font-medium text-white">Saved Addresses</div>
            <div className="mt-4 space-y-3">
              {(user.addresses || []).map((address: Address) => (
                <label key={address.id} className="flex items-start gap-3 rounded-[1.25rem] border border-white/10 bg-black/15 p-4 text-sm text-white/72 cursor-pointer">
                  <input type="radio" checked={selectedAddressId === address.id} onChange={() => setSelectedAddressId(address.id)} />
                  <span>{address.label}: {address.line1}, {address.city}, {address.state} - {address.postalCode}</span>
                </label>
              ))}
              {(!user.addresses || user.addresses.length === 0) && (
                <p className="text-sm text-white/50">No saved addresses. Add one below.</p>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/12 bg-white/8 p-5">
            <div className="font-medium text-white">Add New Address</div>
            <div className="mt-4 space-y-3">
              <input placeholder="Label (e.g. Home)" value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} className="field" />
              <input placeholder="Address line 1 *" value={addressForm.line1} onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })} className="field" />
              <input placeholder="Address line 2" value={addressForm.line2} onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })} className="field" />
              <input placeholder="City *" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="field" />
              <input placeholder="State *" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="field" />
              <input placeholder="Postal code *" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} className="field" />
              <button type="button" onClick={saveAddress} disabled={saving} className="rounded-full border border-white/14 bg-white/10 px-5 py-3 text-sm text-white disabled:opacity-50">
                {saving ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside className="glass-panel p-6">
        <div className="font-serif text-2xl text-white">Order Summary</div>
        <div className="mt-4 space-y-3 text-sm text-white/68">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.product.name} × {item.quantity}</span>
              <span>Rs. {item.product.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-white/12 pt-3 text-base text-white">
            <span>Shipping</span>
            <span>{total > 3999 ? "Free" : "Rs. 199"}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-white">
            <span>Total</span>
            <span>Rs. {total > 3999 ? total : total + 199}</span>
          </div>
        </div>
        <div className="mt-5 rounded-[1.5rem] border border-white/12 bg-black/18 p-4 text-sm text-white/70">
          Payment: Cash on Delivery
        </div>
        <button type="button" onClick={placeOrder} disabled={placing || items.length === 0} className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 disabled:opacity-40">
          {placing ? "Placing..." : "Place COD Order"}
        </button>
      </aside>
    </div>
  );
};
