import { useEffect, useMemo, useState } from "react";
import { api } from "@/utils/api";
import ProductCard from "@/components/ProductCard";
import axios from "axios";

type Category = { id: number; name: string; slug: string };
type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  vendor?: string;
  species?: string; // ← add
  category?: Category;
};

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [vendor, setVendor] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [cat, setCat] = useState("");

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (vendor) p.set("vendor", vendor);
    if (cat) p.set("category", cat);
    return p.toString();
  }, [q, vendor, cat]);

  useEffect(() => {
    setLoading(true);
    axios
      .get<{ items: Product[]; total: number }>(
        `http://localhost:4000/api/products`
      )
      .then((res) => {
        setItems(res.data.items);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch products");
      })
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Shop</h1>

      <div className="bg-white rounded-xl p-4 shadow mb-4 grid gap-3 md:grid-cols-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="border rounded px-3 py-2 w-full"
        />
        <input
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          placeholder="Filter by vendor (e.g., Purina)"
          className="border rounded px-3 py-2 w-full"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">All categories</option>
          {cats.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-4">{total} results</div>
        </>
      )}
    </div>
  );
}
