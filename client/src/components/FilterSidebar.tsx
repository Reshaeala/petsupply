import { useMemo, useState } from "react";

export type FiltersState = {
  slug: {};
  search: string;
  inStock: boolean;

  // Brand (existing)
  brands: Record<string, boolean>;
  brandQuery?: string;

  // Price — MULTI SELECT like Brand
  priceBuckets?: Record<string, boolean>;

  // Optional: species chips (kept; auto-hidden if absent)
  species?: Record<string, boolean>;

  // (Optional explicit range; keep if you already use)
  minPrice?: number;
  maxPrice?: number;
};

type ProductLike = {
  vendor?: string | null;
  stock?: number | null;
  price: number | string;
  species?: string | null;
};

type Props = {
  products: ProductLike[];
  filters: FiltersState;
  onChange: (next: FiltersState) => void;
};

// NGN price buckets (adjust as you like)
export const PRICE_BUCKETS = [
  { id: "0-10000", label: "Less than ₦10,000", min: 0, max: 10000 },
  { id: "10000-20000", label: "₦10,000 to ₦20,000", min: 10000, max: 20000 },
  { id: "20000-30000", label: "₦20,000 to ₦30,000", min: 20000, max: 30000 },
  { id: "30000-40000", label: "₦30,000 to ₦40,000", min: 30000, max: 40000 },
  { id: "40000-50000", label: "₦40,000 to ₦50,000", min: 40000, max: 50000 },
  { id: "50000-75000", label: "₦50,000 to ₦75,000", min: 50000, max: 75000 },
  { id: "75000-100000", label: "₦75,000 to ₦100,000", min: 75000, max: 100000 },
  { id: "100000+", label: "₦100,000 & Above", min: 100000, max: Infinity },
];

export default function FilterSidebar({ products, filters, onChange }: Props) {
  // ----- Derived facets -----
  const allBrands = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) if (p.vendor) set.add(p.vendor);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const speciesList = useMemo(() => {
    const set = new Set<string>();
    for (const p of products)
      if (p.species) set.add(String(p.species).toLowerCase());
    return Array.from(set).sort();
  }, [products]);

  // ----- Brand: search + show more -----
  const [showAllBrands, setShowAllBrands] = useState(false);
  const brandQuery = (filters.brandQuery ?? "").toLowerCase();
  const filteredBrands = allBrands.filter((b) =>
    b.toLowerCase().includes(brandQuery)
  );
  const visibleBrands = showAllBrands
    ? filteredBrands
    : filteredBrands.slice(0, 7);
  const hiddenBrandCount = Math.max(
    0,
    filteredBrands.length - visibleBrands.length
  );

  // ----- Price: show more just like Brand -----
  const [showAllPrices, setShowAllPrices] = useState(false);
  const visibleBuckets = showAllPrices
    ? PRICE_BUCKETS
    : PRICE_BUCKETS.slice(0, 7);
  const hiddenPriceCount = Math.max(
    0,
    PRICE_BUCKETS.length - visibleBuckets.length
  );

  // ----- Helpers -----
  const update = (patch: Partial<FiltersState>) =>
    onChange({ ...filters, ...patch });

  const toggleBrand = (b: string) => {
    const brands = { ...(filters.brands || {}) };
    brands[b] = !brands[b];
    update({ brands });
  };

  const toggleSpecies = (s: string) => {
    const species = { ...(filters.species || {}) };
    species[s] = !species[s];
    update({ species });
  };

  const togglePriceBucket = (id: string) => {
    const next = { ...(filters.priceBuckets || {}) };
    next[id] = !next[id];
    update({ priceBuckets: next });
  };

  const clearAll = () =>
    onChange({
      search: "",
      inStock: false,
      brands: {},
      brandQuery: "",
      priceBuckets: {},
      species: {},
      minPrice: undefined,
      maxPrice: undefined,
    });

  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="font-semibold">Filters</div>
        <button
          type="button"
          className="text-xs text-blue-600 hover:underline"
          onClick={clearAll}
        >
          Clear all
        </button>
      </div>

      {/* Search within results (kept) */}
      <section>
        <div className="font-semibold mb-2">Search</div>
        <input
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search within results"
          className="w-full border rounded px-3 py-2"
        />
      </section>

      {/* Brand */}
      <section>
        <div className="font-semibold mb-2">Brand</div>
        <div className="relative mb-2">
          <input
            value={filters.brandQuery ?? ""}
            onChange={(e) => update({ brandQuery: e.target.value })}
            placeholder="Find a brand"
            className="w-full border rounded-lg px-3 py-2 pr-8"
          />
          <svg
            className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.9 14.32a6.5 6.5 0 111.414-1.414l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387zM13 8.5a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="space-y-1 max-h-48 overflow-auto pr-1">
          {visibleBrands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!filters.brands?.[b]}
                onChange={() => toggleBrand(b)}
              />
              {b}
            </label>
          ))}
          {filteredBrands.length === 0 && (
            <div className="text-xs text-gray-500">No brands found</div>
          )}
        </div>
        {hiddenBrandCount > 0 && !showAllBrands && (
          <button
            type="button"
            onClick={() => setShowAllBrands(true)}
            className="text-xs text-blue-600 mt-1"
          >
            + {hiddenBrandCount} more
          </button>
        )}
      </section>

      {/* Price — like Brand (checkboxes + show more + clear) */}
      <section>
        <div className="font-semibold mb-2">Price</div>
        <div className="space-y-1 max-h-48 overflow-auto pr-1">
          {visibleBuckets.map((b) => (
            <label key={b.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!filters.priceBuckets?.[b.id]}
                onChange={() => togglePriceBucket(b.id)}
              />
              {b.label}
            </label>
          ))}
        </div>
        {hiddenPriceCount > 0 && !showAllPrices && (
          <button
            type="button"
            onClick={() => setShowAllPrices(true)}
            className="text-xs text-blue-600 mt-1"
          >
            + {hiddenPriceCount} more
          </button>
        )}
        <div className="mt-1">
          <button
            type="button"
            onClick={() => update({ priceBuckets: {} })}
            className="text-xs text-blue-600"
          >
            Clear price
          </button>
        </div>
      </section>

      {/* Availability */}
      <section>
        <div className="font-semibold mb-2">Availability</div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => update({ inStock: e.target.checked })}
          />
          In Stock
        </label>
      </section>

      {/* Species (chips) — auto-hidden unless variety exists */}
      {speciesList.length > 1 && (
        <section>
          <div className="font-semibold mb-2">Species</div>
          <div className="flex flex-wrap gap-2">
            {speciesList.map((s) => {
              const active = !!filters.species?.[s];
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecies(s)}
                  className={[
                    "px-3 py-1 rounded-full text-sm border",
                    active
                      ? "bg-blue-50 border-blue-400 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700",
                  ].join(" ")}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              );
            })}
          </div>
        </section>
      )}
    </aside>
  );
}
