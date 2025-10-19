import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import FilterSidebar, {
  FiltersState,
  PRICE_BUCKETS,
} from "@/components/FilterSidebar";
import SortBar from "@/components/SortBar";

type Product = {
  id: number;
  name: string;
  price: number | string; // normalize to number after fetch
  imageUrl?: string;
  vendor?: string;
  stock?: number;
  createdAt: string;
  species?: string;
};

const PAGE_SIZE = 12;

export default function SpeciesResultsPage() {
  const { species } = useParams<{ species: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    inStock: false,
    brands: {},
    priceBuckets: {}, // multi-select buckets
    species: {}, // chips (optional)
  });
  const [sort, setSort] = useState("relevance");

  const page = Number(searchParams.get("page") || 1);
  const goPage = (p: number, maxPages: number) => {
    const to = Math.max(1, Math.min(p, maxPages));
    searchParams.set("page", String(to));
    setSearchParams(searchParams, { replace: true });
  };

  useEffect(() => {
    if (!species) return;
    const ctrl = new AbortController();

    axios
      .get<Product[]>(`http://localhost:4000/api/products/species/${species}`, {
        signal: ctrl.signal,
      })
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : [];
        // normalize price to number so sorting and buckets work
        const list = raw.map((p) => ({ ...p, price: Number(p.price) || 0 }));
        setItems(list);
      })
      .catch(() => setItems([]));

    return () => ctrl.abort();
  }, [species]);

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
        activeSpecies.includes((p.species || "").toUpperCase())
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
        // relevance: leave order as-is
        break;
    }

    return list;
  }, [items, filters, sort]);

  const total = filtered.length;
  const maxPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="md:col-span-3">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-3 capitalize">{species}</div>
          <FilterSidebar
            products={items}
            filters={filters}
            onChange={setFilters}
          />
        </div>
      </div>

      <div className="md:col-span-9 space-y-4">
        <SortBar
          total={total}
          sort={sort}
          onSort={setSort}
          page={page}
          pageSize={PAGE_SIZE}
        />

        {pageItems.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mt.6">
              <button
                className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => goPage(page - 1, maxPages)}
              >
                Prev
              </button>
              <span>
                Page {page} of {maxPages}
              </span>
              <button
                className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                disabled={page >= maxPages}
                onClick={() => goPage(page + 1, maxPages)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div>No products found for this species.</div>
        )}
      </div>
    </div>
  );
}
