import { useEffect, useMemo, useState } from 'react';
import { http } from '@/lib/http';
import ProductCard from '@/components/storefront/ProductCard';
import CategoryChips from '@/components/storefront/CategoryChips';
import Pagination from '@/components/storefront/Pagination';
import { Card } from '@/components/ui';
type Cat = { id:string; name:string; slug:string; _count?:{ products:number } }
type Prod = { id:string; slug:string; name:string; brand?:string|null; imageUrl?:string|null; priceNaira:number }

type ListResponse<T> = { data:T[]; meta?:{ page:number; pageSize:number; total:number; totalPages:number } }

export default function LandingHome(){
  const [cats,setCats]=useState<Cat[]>([])
  const [items,setItems]=useState<Prod[]>([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState<string|null>(null)

  const [species,setSpecies]=useState<string|undefined>(undefined)
  const [catSlug,setCatSlug]=useState<string|null>(null)
  const [sort,setSort]=useState<'newest'|'price_asc'|'price_desc'|'popular'>('newest')
  const [page,setPage]=useState(1)
  const pageSize = 24

  // load categories
  useEffect(()=>{ (async()=>{
    try{
      const r = await http.get<ListResponse<Cat>>('/categories')
      setCats(r.data.data||[])
    } catch(e:any){ setError('Failed to load categories') }
  })() }, [])

  // load products
  useEffect(()=>{ (async()=>{
    setLoading(true); setError(null)
    const qs = new URLSearchParams()
    if (species) qs.set('species', species)
    if (catSlug) qs.set('categorySlug', catSlug)
    if (sort) qs.set('sort', sort)
    qs.set('page', String(page)); qs.set('pageSize', String(pageSize))
    try{
      const r = await http.get<ListResponse<Prod>>(`/products?${qs.toString()}`)
      setItems(r.data.data||[])
    } catch(e:any){ setError('Failed to load products') }
    finally{ setLoading(false) }
  })() }, [species, catSlug, sort, page])

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold">NaijaPet</h1>
        <p className="text-gray-600">Everything for dogs, cats, and birds — priced in ₦.</p>
        <div className="mt-4 flex gap-2">
          {['dog','cat','bird'].map(s=>(
            <button key={s} onClick={()=>{ setSpecies(s===species?undefined:s); setPage(1) }}
              className={`px-3 py-1 border rounded-full text-sm ${species===s?'bg-blue-50 border-blue-200 text-blue-700':'hover:bg-gray-50'}`}>{s[0].toUpperCase()+s.slice(1)}</button>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Browse by category</h2>
          <select className="border rounded px-2 py-1 text-sm" value={sort} onChange={e=>{ setSort(e.target.value as any); setPage(1) }}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="popular">Popularity</option>
          </select>
        </div>
        <CategoryChips categories={cats} active={catSlug||null} onPick={(slug)=>{ setCatSlug(slug); setPage(1) }} />
      </Card>

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading ? <div>Loading products…</div> :
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(p=>(<ProductCard key={p.id} {...p} />))}
          </div>
          <Pagination page={page} totalPages={10} onPage={setPage} />
        </>
      }
    </div>
  )
}
