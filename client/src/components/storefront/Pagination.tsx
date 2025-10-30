export default function Pagination({ page, totalPages, onPage }:{ page:number; totalPages:number; onPage:(p:number)=>void }){
  if (totalPages<=1) return null
  const prev = () => onPage(Math.max(1, page-1))
  const next = () => onPage(Math.min(totalPages, page+1))
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={prev} disabled={page===1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
      <span className="text-sm">Page {page} / {totalPages}</span>
      <button onClick={next} disabled={page===totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
    </div>
  )
}
