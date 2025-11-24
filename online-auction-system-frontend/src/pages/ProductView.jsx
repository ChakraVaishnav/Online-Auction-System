import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { checkAuth } from '../utils/auth'

export default function ProductView(){
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [product, setProduct] = useState(location.state?.product || null)
  const [loading, setLoading] = useState(!product)
  const [bidderName, setBidderName] = useState(null)

  useEffect(() => {
  let active = true;

  async function fetchProduct() {
    if (document.hidden) return; // <-- only refresh when tab is active

    try {
      const res = await fetch(`http://localhost:8082/api/products/${id}`, {
        credentials: "include"
      });
      if (res.ok && active) {
        const data = await res.json();
        setProduct(data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Load once immediately
  fetchProduct();

  // Auto refresh every 5 seconds
  const interval = setInterval(fetchProduct, 5000);

  return () => {
    active = false;
    clearInterval(interval);
  };
}, [id]);


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
                <div className="font-semibold">₹{Number(product.startingPrice || 0).toFixed(2)}</div>
              </div>
              <div className="p-4 bg-white/5 rounded">
                <div className="text-slate-400">Current Bid</div>
                <div className="font-semibold">₹{Number(product.currentBid || product.startingPrice || 0).toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-4 text-slate-300">Highest bidder: <span className="text-slate-100 font-medium">{product.highestBidderId ? (bidderName || `#${product.highestBidderId}`) : '—'}</span></div>

            <div className="mt-6 flex items-center gap-3">
              <PlaceBid product={product} onSuccess={()=>{
                // refresh product data
                (async ()=>{
                  try{
                    const r = await fetch(`http://localhost:8082/api/products/${product.id}`, { credentials: 'include' })
                    if(r.ok){
                      const d = await r.json()
                      setProduct(d)
                    }
                  }catch(e){console.error(e)}
                })()
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaceBid({ product, onSuccess }){
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [toast, setToast] = useState(null)

  async function getCurrentUserId(){
    // Try a common endpoint to fetch current user. If backend doesn't expose, return null and backend should derive from cookie.
    try{
      const r = await fetch('http://localhost:8082/api/auth/me', { credentials: 'include' })
      if(r.ok){
        const u = await r.json()
        return u.id || u.userId || u.id
      }
    }catch(e){ }
    return null
  }

  async function submit(e){
    e.preventDefault()
    const auth = await checkAuth()
    if(!auth.ok){
      navigate('/login')
      return
    }
    const base = Number(product.startingPrice || 0)
    const bid = Number(amount)
    if(isNaN(bid) || bid <= 0){
      setToast('Enter a valid amount')
      setTimeout(()=>setToast(null),2000)
      return
    }

    if(bid < base){
      setToast('Bid must be at least base bid')
      setTimeout(()=>setToast(null),2000)
      return
    }

    const userId = await getCurrentUserId()

    try{
      // send as request params as requested. If userId is not available (httpOnly cookie), omit it and let backend derive from cookie.
      const paramsObj = { productId: String(product.id), amount: String(bid) }
      if(userId) paramsObj.userId = String(userId)
      const params = new URLSearchParams(paramsObj)
      const r = await fetch(`http://localhost:8082/api/bids/place?${params.toString()}`, {
        method: 'POST',
        credentials: 'include'
      })

      if(!r.ok){
        const t = await r.text()
        setToast(t || 'Failed to place bid')
        setTimeout(()=>setToast(null),2000)
        return
      }

      setToast('Bid placed')
      setTimeout(()=>setToast(null),2000)
      setOpen(false)
      setAmount('')
      if(onSuccess) onSuccess()
    }catch(e){
      console.error(e)
      setToast('Network error')
      setTimeout(()=>setToast(null),2000)
    }
  }

  return (
    <div>
      <button className="btn-primary" onClick={()=>setOpen(true)}>Place Bid</button>

      {open && (
        <div className="mt-3 bg-slate-800 p-4 rounded">
          <form onSubmit={submit} className="flex items-center gap-2">
            <label className="text-slate-300">₹</label>
            <input className="form-input" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" />
            <button className="btn-primary" type="submit">Submit</button>
            <button type="button" className="btn-outline" onClick={()=>{ setOpen(false); setAmount('') }}>Cancel</button>
          </form>
          {toast && (<div className="mt-2 text-sm text-amber-300">{toast}</div>)}
        </div>
      )}
    </div>
  )
}
