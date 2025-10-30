import { useEffect, useState } from "react";
import { useCartStore } from "@/contexts/cart";
import { api } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { formatNGN } from "@/utils/money";

export default function CartPage() {
  const { items, fetchCart, removeItem, total } = useCartStore();
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const checkout = async () => {
    setPlacing(true);
    try {
      await api("/api/orders", { method: "POST" });
      navigate("/orders");
    } catch (e) {
      console.error(e);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your cart</h1>
      {items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((i) => (
            <div
              key={i.id}
              className="bg-white rounded-xl p-3 shadow flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-20 h-16 rounded bg-gray-100 overflow-hidden">
                  {i.product?.imageUrl && (
                    <img
                      src={i.product.imageUrl}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="font-medium">{i.product?.name}</div>
                  <div className="text-sm text-gray-500">Qty: {i.qty}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-semibold">
                  {formatNGN((i.product?.price || 0) * i.qty)}
                </div>
                <button
                  onClick={() => removeItem(i.id)}
                  className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right text-lg font-semibold">
            Total: {formatNGN(total())}
          </div>
          <div className="text-right">
            <button
              onClick={checkout}
              disabled={placing}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {placing ? "Placing…" : "Place order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
