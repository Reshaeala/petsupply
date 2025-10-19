type Props = { page: number; pageSize: number; total: number; onPage: (p: number) => void };
export default function Pagination({ page, pageSize, total, onPage }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(pages, page + 1));
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={prev} className="px-3 py-1 border rounded bg-white disabled:opacity-50" disabled={page===1}>Prev</button>
      <div className="text-sm">Page {page} of {pages}</div>
      <button onClick={next} className="px-3 py-1 border rounded bg-white disabled:opacity-50" disabled={page===pages}>Next</button>
    </div>
  );
}
