import { Card, PriceTag } from '@/components/ui';
type Props = { id:string; name:string; slug:string; imageUrl?:string|null; brand?:string|null; priceNaira:number }
export default function ProductCard({ id, name, slug, imageUrl, brand, priceNaira }: Props){
  return (
    <Card className="p-3">
      <a href={`/product/${slug}`}>
        <img src={imageUrl||'/placeholder.png'} alt={name} className="w-full h-40 object-contain mb-2" loading="lazy"/>
        <div className="text-xs text-gray-500">{brand||'NaijaPet'}</div>
        <div className="font-medium line-clamp-2">{name}</div>
        <div className="mt-1"><PriceTag value={priceNaira} /></div>
      </a>
    </Card>
  )
}
