import { Link } from "react-router-dom";
import { formatNGN } from "@/utils/money";

type Props = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  vendor?: string;
  species?: string; // ← add
};

const SPECIES_STYLES: Record<string, string> = {
  dog: "bg-amber-100 text-amber-800",
  cat: "bg-purple-100 text-purple-800",
  bird: "bg-green-100 text-green-800",
};

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  vendor,
  species,
}: Props) {
  const pill = species?.toLowerCase();
  const pillClass = pill
    ? SPECIES_STYLES[pill] || "bg-gray-100 text-gray-700"
    : "";

  return (
    <div className="bg-white rounded-xl shadow p-3 flex flex-col">
      <div className="relative">
        <Link
          to={`/products/${id}`}
          className="block aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </Link>

        {/* Species pill */}
        {pill && (
          <span
            className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-medium ${pillClass}`}
            title={species}
          >
            {(species ?? "").charAt(0).toUpperCase() + (species ?? "").slice(1)}
          </span>
        )}
      </div>

      <div className="mt-3 flex-1">
        <Link to={`/products/${id}`} className="font-medium line-clamp-2">
          {name}
        </Link>
        <div className="text-xs text-gray-500">{vendor || "—"}</div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="font-semibold">{formatNGN(price)}</div>
        <Link
          to={`/products/${id}`}
          className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          View
        </Link>
      </div>
    </div>
  );
}
