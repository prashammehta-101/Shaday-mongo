import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/http";
import { useAuth } from "../context/AuthContext";
import type { Order } from "../lib/types";

export const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    api.get("/orders/mine").then(({ data }) => setOrders(data.orders));
  }, [user]);

  if (!user) return (
    <div className="glass-panel p-8 text-white">
      Please <Link to="/login" className="underline">login</Link> to view your orders.
    </div>
  );

  return (
    <div className="space-y-5">
      <section className="glass-panel p-6">
        <div className="text-xs uppercase tracking-[0.34em] text-white/45">Orders</div>
        <h1 className="mt-2 font-serif text-4xl text-white">Your Order History</h1>
      </section>
      {orders.map((order) => (
        <article key={order.id} className="glass-panel p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-white/45">{order.orderNumber}</div>
              <div className="mt-2 font-serif text-2xl text-white">{order.status}</div>
              {order.shipping?.city && (
                <div className="mt-1 text-sm text-white/50">
                  {order.shipping.line1}, {order.shipping.city}, {order.shipping.state}
                </div>
              )}
            </div>
            <div className="text-right text-sm text-white/60">
              <div>{new Date(order.createdAt).toLocaleDateString()}</div>
              <div>{order.paymentMethod} • {order.paymentStatus}</div>
              <div className="mt-1 text-base font-semibold text-white">Rs. {order.total}</div>
            </div>
          </div>
          <div className="mt-5 space-y-2 text-sm text-white/68">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} • {item.size} × {item.quantity}</span>
                <span>Rs. {item.totalPrice}</span>
              </div>
            ))}
          </div>
        </article>
      ))}
      {orders.length === 0 && <div className="text-sm text-white/55">No orders placed yet.</div>}
    </div>
  );
};
