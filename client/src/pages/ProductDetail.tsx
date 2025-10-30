import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '@/lib/http';
import { Button, Card, PriceTag } from '@/components/ui';
type Prod = { id:string; name:string; brand?:string|null; imageUrl?:string|null; priceNaira:number; description?:string|null; stock:number }
export default function ProductDetail(){
  const { idOrSlug } = useParams(); const [p,setP]=useState<Prod|null>(null); const [loading,setLoading]=useState(true)
  useEffect(()=>{ (async()=>{ const r=await http.get(`/products/${idOrSlug}`); setP(r.data.data); setLoading(false) })() },[idOrSlug])
  if (loading) return <div>Loading…</div>
  if (!p) return <div>Not found</div>
  return (<Card className='p-6 grid md:grid-cols-2 gap-6'>
    <img src={p.imageUrl||'/placeholder.png'} alt={p.name} className='w-full h-80 object-contain' loading='lazy'/>
    <div>
      <h1 className='text-2xl font-semibold'>{p.name}</h1>
      <div className='text-sm text-gray-500'>{p.brand}</div>
      <div className='mt-2 text-xl'><PriceTag value={p.priceNaira}/></div>
      <p className='mt-3 text-gray-700'>{p.description||'Great pet product.'}</p>
      <div className='mt-4 text-sm'>Stock: {p.stock}</div>
      <Button className='mt-4'>Add to cart</Button>
    </div>
  </Card>)
}