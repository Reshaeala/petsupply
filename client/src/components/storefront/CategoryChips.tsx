type Cat = { id:string; name:string; slug:string; _count?: { products:number } }
export default function CategoryChips({ categories, active, onPick }:{ categories: Cat[]; active?:string|null; onPick:(slug:string|null)=>void }){
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={()=>onPick(null)} className={`px-3 py-1 rounded-full border text-sm ${!active ? 'bg-blue-50 border-blue-200 text-blue-700' : 'hover:bg-gray-50'}`}>All</button>
      {categories.map(c=>(
        <button key={c.id} onClick={()=>onPick(c.slug)}
          className={`px-3 py-1 rounded-full border text-sm ${active===c.slug ? 'bg-blue-50 border-blue-200 text-blue-700' : 'hover:bg-gray-50'}`}>
          {c.name}{typeof c._count?.products==='number' ? ` (${c._count?.products})` : ''}
        </button>
      ))}
    </div>
  )
}
