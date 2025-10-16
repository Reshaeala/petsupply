import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { formatNGN } from "@/utils/money";

type OrderItem = {
  id: number;
  qty: number;
  price: number;
  product: { name: string };
};
type Order = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api<Order[]>("/api/orders")
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your orders</h1>
      {loading ? (
        "Loading…"
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl p-3 shadow">
              <div className="flex items-center justify-between">
                <div className="font-medium">Order #{o.id}</div>
                <div className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-600">Status: {o.status}</div>
              <ul className="mt-2 text-sm list-disc pl-6">
                {o.items.map((i) => (
                  <li key={i.id}>
                    {i.qty} × {i.product.name} @ {formatNGN(i.price)}
                  </li>
                ))}
              </ul>
              <div className="mt-2 font-semibold">
                Total: {formatNGN(o.total)}
              </div>
            </div>
          ))}
          {orders.length === 0 && <div>No orders yet.</div>}
        </div>
      )}
    </div>
  );
}
