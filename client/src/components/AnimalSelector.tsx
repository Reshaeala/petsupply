import { useNavigate } from "react-router-dom";
// import css
import "./components.css";
type Item = { name: string; image?: string; value?: string };

interface AnimalSelectorProps {
  items: Item[];

  onItemClick?: (item: Item) => void;
}

export default function AnimalSelector({
  items,
  onItemClick,
}: AnimalSelectorProps) {
  const nav = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow p-4 ">
      <div className="font-semibold mb-3">Who are you shopping for today?</div>
      <div className="flex gap-4 overflow-x-auto pb-2 animalSelector">
        {items.map((it) => (
          <button
            key={it.name}
            onClick={() =>
              nav(
                `/species/${encodeURIComponent(
                  (it.value || it.name).toLowerCase()
                )}`
              )
            }
            className="flex-shrink-0 w-28"
            title={it.name}
          >
            <div className="w-28 h-28 rounded-full overflow-hidden border">
              {it.image ? (
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400">
                  {it.name}
                </div>
              )}
            </div>
            <div className="text-sm mt-2 text-center">{it.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
