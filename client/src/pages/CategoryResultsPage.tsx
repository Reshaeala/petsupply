import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import FilterSidebar, {
  FiltersState,
  PRICE_BUCKETS,
} from "@/components/FilterSidebar";
import SortBar from "@/components/SortBar";
import ProductCard from "@/components/ProductCard";

type Category = { id: number; name: string; slug: string };
type Product = {
  id: number;
  name: string;
  price: number | string; // normalize to number on fetch
  imageUrl?: string;
  vendor?: string;
  stock?: number;
  createdAt: string;
  species?: string;
  category?: Category;
};

const PAGE_SIZE = 36;
const api = axios.create({ baseURL: "/api", timeout: 15000 });

export default function CategoryResultsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [params, setParams] = useSearchParams();

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    inStock: false,
    brands: {},
    // new in your FilterSidebar: multi-select price buckets
    priceBuckets: {},
    // optional species chips supported by sidebar:
    species: {},
  });

  const [sort, setSort] = useState<string>(params.get("sort") || "relevance");
  const page = Number(params.get("page") || 1);

  // Fetch products for this category
  useEffect(() => {
    if (!slug) return;
    const ctrl = new AbortController();
    setLoading(true);

    api
      .get<{ items: Product[]; total: number } | Product[]>("/products", {
        params: { category: slug, take: 500 },
        signal: ctrl.signal,
      })
      .then((res) => {
        const data = res.data as any;
        const list: Product[] = Array.isArray(data) ? data : data?.items ?? [];
        // normalize price to number so sort & bucket filters work
        const normalized = list.map((p) => ({
          ...p,
          price: Number(p.price) || 0,
        }));
        setItems(normalized);
      })
      .catch((err) => {
        console.error("Error fetching category products:", err);
        setItems([]);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [slug]);

  const filtered = useMemo(() => {
    let list = items.slice();

    // search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.vendor || "").toLowerCase().includes(q) ||
          (p.species || "").toLowerCase().includes(q)
      );
    }

    // availability
    if (filters.inStock) list = list.filter((p) => (p.stock || 0) > 0);

    // brand
    const activeBrands = Object.entries(filters.brands || {})
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (activeBrands.length) {
      list = list.filter((p) => activeBrands.includes(p.vendor || ""));
    }

    // species (chips)
    const activeSpecies = Object.entries(filters.species || {})
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (activeSpecies.length) {
      list = list.filter((p) =>
        activeSpecies.includes((p.species || "").toLowerCase())
      );
    }

    // price buckets (MULTI-SELECT union)
    const activeBucketIds = Object.entries(filters.priceBuckets || {})
      .filter(([, v]) => v)
      .map(([id]) => id);

    if (activeBucketIds.length) {
      const ranges = PRICE_BUCKETS.filter((b) =>
        activeBucketIds.includes(b.id)
      ).map((b) => ({ min: b.min, max: b.max }));

      list = list.filter((p) => {
        const price = Number(p.price) || 0;
        return ranges.some(
          (r) => price >= r.min && (r.max === Infinity ? true : price <= r.max)
        );
      });
    }

    // sort
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "price-desc":
        list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // "relevance" — leave as-is
        break;
    }

    return list;
  }, [items, filters, sort]);

  // Pagination (client-side)
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = (filtered ?? []).slice(start, start + PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil((filtered?.length ?? 0) / PAGE_SIZE));

  const goPage = (p: number) => {
    const next = Math.max(1, Math.min(pageCount, p));
    params.set("page", String(next));
    setParams(params, { replace: true });
  };

  const onSort = (v: string) => {
    setSort(v);
    params.set("sort", v);
    setParams(params, { replace: true });
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Sidebar */}
      <div className="md:col-span-3">
        <div className="bg-white rounded-xl shadow p-4 sticky top-4">
          <div className="font-semibold mb-3 capitalize">
            {slug?.replace(/-/g, " ")}
          </div>
          <FilterSidebar
            products={items ?? []}
            filters={filters}
            onChange={setFilters}
          />
        </div>
      </div>

      {/* Results */}
      <div className="md:col-span-9 space-y-4">
        <SortBar
          total={filtered?.length ?? 0}
          sort={sort}
          onSort={onSort}
          page={page}
          pageSize={PAGE_SIZE}
        />

        {loading ? (
          <div>Loading...</div>
        ) : (filtered?.length ?? 0) > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => goPage(page - 1)}
                className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                disabled={page <= 1}
              >
                Prev
              </button>
              <div className="text-sm">
                Page {page} of {pageCount}
              </div>
              <button
                onClick={() => goPage(page + 1)}
                className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                disabled={page >= pageCount}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div>No products found for this category.</div>
        )}
      </div>
    </div>
  );
}
