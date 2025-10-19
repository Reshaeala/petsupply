import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { formatNGN } from "@/utils/money";
import { useCartStore } from "@/context/cart"; // <-- single source of truth

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  imageUrl?: string;
  vendor?: string;
  sku?: string;
  stock?: number;
  species?: string;
};

const http = axios.create({ baseURL: "/api", timeout: 15000 });

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [p, setP] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [adding, setAdding] = useState(false);

  // cart store
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!id) return;
    setLoadingProduct(true);
    http
      .get<Product>(`/products/${id}`)
      .then((res) => {
        const prod = res.data;
        // normalize price to number
        setP({ ...prod, price: Number(prod.price) || 0 });
      })
      .finally(() => setLoadingProduct(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!p) return;
    setAdding(true);
    try {
      // Try server-backed add-to-cart first
      const res = await http.post("/cart/items", {
        productId: p.id,
        quantity: 1,
      });
      // Expecting API to return the cart item or cart summary; adapt as needed
      const item = res.data?.item || {
        productId: p.id,
        name: p.name,
        price: Number(p.price) || 0,
        imageUrl: p.imageUrl,
        sku: p.sku,
        quantity: 1,
      };
      addItem(item);
      alert("Item added to cart!");
    } catch (e) {
      // Fallback to local-only cart if API not implemented
      addItem({
        productId: p.id,
        name: p.name,
        price: Number(p.price) || 0,
        imageUrl: p.imageUrl,
        sku: p.sku,
        quantity: 1,
      });
      alert("Item added to cart!");
    } finally {
      setAdding(false);
    }
  };

  if (loadingProduct) return <div>Loading…</div>;
  if (!p) return <div>Not found</div>;

  const outOfStock = (p.stock ?? 0) <= 0;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-3 shadow">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.name}
            className="w-full h-auto object-cover rounded-lg"
          />
        ) : (
          <div className="aspect-[4/3] bg-gray-100 rounded-lg grid place-items-center text-gray-400">
            No image
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{p.name}</h1>
        <div className="text-sm text-gray-500">
          Vendor: {p.vendor || "—"}
          {p.sku && <> • SKU: {p.sku}</>}
          {p.species && (
            <>
              {" "}
              • Species:{" "}
              {p.species.charAt(0).toUpperCase() + p.species.slice(1)}
            </>
          )}
        </div>

        <div className="text-3xl font-bold mt-2">
          {formatNGN(Number(p.price) || 0)}
        </div>

        <p className="mt-4 text-gray-700">
          {p.description || "No description."}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={adding || outOfStock}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
          {outOfStock && (
            <span className="text-sm text-red-600">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
