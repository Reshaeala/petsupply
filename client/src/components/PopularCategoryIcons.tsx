type Item = { name: string; icon?: React.ReactNode; onClick?: () => void };
export default function PopularCategoryIcons({ items }: { items: Item[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="font-semibold mb-3">Explore popular categories</div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
        {items.map((it) => (
          <button
            key={it.name}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:bg-gray-50"
            onClick={it.onClick}
          >
            <div className="w-16 h-16 rounded-full bg-blue-50 grid place-items-center text-2xl">🏷️</div>
            <div className="text-sm">{it.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
