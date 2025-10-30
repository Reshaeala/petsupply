type Props = {
  total: number;
  sort: string;
  onSort: (v: string) => void;
  page: number;
  pageSize: number;
};

export default function SortBar({
  total,
  sort,
  onSort,
  page,
  pageSize,
}: Props) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl p-3 md:p-4 border">
      <div className="text-sm text-gray-700">
        {total > 0 ? `${start} – ${end} of ${total} Results` : `0 Results`}
      </div>

      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-600 hidden sm:block">Sort By</div>

        {/* Select pill */}
        <div className="relative">
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="appearance-none bg-white border rounded-xl px-3 pr-9 py-2 text-sm shadow-sm
                       hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            {/* Uncomment to add:
            <option value="alpha-asc">Name: A–Z</option>
            <option value="alpha-desc">Name: Z–A</option>
            */}
          </select>

          {/* Chevron */}
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
