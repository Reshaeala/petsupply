export function Card(p:{children:React.ReactNode,className?:string}){return <div className={`bg-white rounded-2xl shadow-card ${p.className||""}`}>{p.children}</div>}
export function Button(p:{children:React.ReactNode;onClick?:()=>void;type?:"button"|"submit";disabled?:boolean;variant?:"primary"|"ghost";className?:string}){
  const styles=p.variant==="ghost"?"border hover:bg-gray-50":"bg-brand text-white hover:bg-blue-700"
  return <button type={p.type||"button"} disabled={p.disabled} onClick={p.onClick} className={`px-4 py-2 rounded-xl ${styles} disabled:opacity-50 ${p.className||""}`}>{p.children}</button>
}
export function PriceTag({value}:{value:number}){ return <span className='font-semibold'>{new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN'}).format(value)}</span> }