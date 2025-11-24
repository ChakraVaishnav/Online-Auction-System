import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'

export default function ProductView(){
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [product, setProduct] = useState(location.state?.product || null)
  const [loading, setLoading] = useState(!product)
  const [bidderName, setBidderName] = useState(null)

  useEffect(()=>{
    let mounted = true
    async function load(){
      if(!product){
        setLoading(true)
        try{
          const res = await fetch(`http://localhost:8082/api/products/${id}`, { credentials: 'include' })
          if(!res.ok){
            setProduct(null)
            setLoading(false)
            return
          }
          const data = await res.json()
          if(mounted) setProduct(data)
        }catch(e){
          console.error(e)
        }finally{
          if(mounted) setLoading(false)
        }
      }
    }

    load()

    return ()=>{ mounted = false }
  },[id])

  useEffect(()=>{
    let mounted = true
    async function loadBidder(){
      if(product?.highestBidderId){
        try{
          const r = await fetch(`http://localhost:8082/api/auth/by-id?id=${product.highestBidderId}`, { credentials: 'include' })
          if(r.ok){
            const u = await r.json()
            if(mounted) setBidderName(u.username || u.name || `#${product.highestBidderId}`)
          }else{
            if(mounted) setBidderName(`#${product.highestBidderId}`)
          }
        }catch(e){
          if(mounted) setBidderName(`#${product.highestBidderId}`)
        }
      }
    }

    loadBidder()
    return ()=>{ mounted = false }
  },[product])

  if(loading) return <div className="min-h-screen flex items-center justify-center text-slate-300">Loading...</div>
  if(!product) return <div className="min-h-screen flex items-center justify-center text-slate-300">Product not found</div>

  return (
    <div className="min-h-screen py-12">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-6">
          <button className="btn-outline" onClick={()=>navigate(-1)}>← Back</button>
          <div className="text-slate-400">Product #{product.id}</div>
        </div>

        <div className="glass p-6 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex items-center justify-center bg-slate-800 rounded-md p-4">
            {product.imageBase64 ? (
              <img src={product.imageBase64} alt={product.title} className="max-h-56 max-w-full object-contain rounded" />
            ) : (
              <div className="text-slate-400">No image</div>
            )}
          </div>

          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <div className="text-slate-300 mt-2">{product.description}</div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded">
                <div className="text-slate-400">Base Bid</div>
                <div className="font-semibold">${product.startingPrice?.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-white/5 rounded">
                <div className="text-slate-400">Current Bid</div>
                <div className="font-semibold">${product.currentBid?.toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-4 text-slate-300">Highest bidder: <span className="text-slate-100 font-medium">{product.highestBidderId ? (bidderName || `#${product.highestBidderId}`) : '—'}</span></div>

            <div className="mt-6 flex items-center gap-3">
              <button className="btn-primary" onClick={()=>alert('Place bid - placeholder')}>Place Bid</button>
              <button className="btn-outline" onClick={()=>alert('Message owner - placeholder')}>Message Owner</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
