import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddProductForm from '../components/AddProductForm'
import DashboardLayout from '../components/DashboardLayout'
import { checkAuth } from '../utils/auth'

export default function MyProducts(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [bidderNames, setBidderNames] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    let mounted = true
    async function load(){
      setLoading(true)
      try{
        // get user id from localStorage or fallback to /api/auth/me
        let user = null
        try{ user = JSON.parse(localStorage.getItem('bidbuy_user')) }catch(e){ user = null }
        if(!user){
          try{
            const r = await fetch('http://localhost:8082/api/auth/me', { credentials: 'include' })
            if(r.ok) user = await r.json()
          }catch(e){}
        }
        if(!user){ setProducts([]); setLoading(false); return }

        const ownerId = user.id
        let res = await fetch(`http://localhost:8082/api/products/owner/${ownerId}`, { credentials: 'include' })
        if(!res.ok) res = await fetch(`http://localhost:8082/api/products/ower/${ownerId}`, { credentials: 'include' })
        const data = res.ok ? await res.json() : []
        if(!mounted) return
        setProducts(data)

        const ids = Array.from(new Set(data.map(p=>p.highestBidderId).filter(Boolean)))
        const names = {}
        await Promise.all(ids.map(async id=>{
          try{ const r = await fetch(`http://localhost:8082/api/auth/by-id?id=${id}`, { credentials: 'include' }); if(r.ok){ const u = await r.json(); names[id] = u.username || u.name || `#${id}` } else names[id] = `#${id}` }catch(e){ names[id] = `#${id}` }
        }))
        if(!mounted) return
        setBidderNames(names)
      }catch(e){ console.error(e); setProducts([]) }
      if(mounted) setLoading(false)
    }
    load()
    return ()=>{ mounted = false }
  }, [])

  async function handleCreate(form){
    setCreating(true)
    const auth = await checkAuth()
    if(!auth.ok){ navigate('/login'); setCreating(false); return }
    try{
      const payload = {
        title: form.title,
        description: form.description,
        startingPrice: Number(form.startingPrice),
        currentBid: Number(form.startingPrice),
        highestBidderId: null,
        status: 'LIVE',
        imageBase64: form.imageBase64 || null,
      }
      const res = await fetch('http://localhost:8082/api/products/add', {
        method: 'POST', headers: {'Content-Type':'application/json'}, credentials: 'include', body: JSON.stringify(payload)
      })
      if(!res.ok){ setToast('Failed to create product'); setCreating(false); return }
      setToast('Product created')
      setShowAdd(false)
      // refresh own products
      const user = JSON.parse(localStorage.getItem('bidbuy_user') || 'null')
      if(user){
        const refreshed = await fetch(`http://localhost:8082/api/products/owner/${user.id}`, { credentials: 'include' })
        setProducts(refreshed.ok ? await refreshed.json() : [])
      }
    }catch(e){ console.error(e); setToast('Network error') }
    setCreating(false)
    setTimeout(()=>setToast(null), 3000)
  }

  async function handleEndBidding(productId){
    const auth = await checkAuth()
    if(!auth.ok){ navigate('/login'); return }
    if(!confirm('End bidding for this product?')) return
    try{
      const res = await fetch(`http://localhost:8082/api/products/end/${productId}`, {
        method: 'POST', credentials: 'include'
      })
      if(!res.ok){ setToast('Failed to end bidding'); setTimeout(()=>setToast(null),3000); return }
      setToast('Bidding ended')
      // refresh
      const user = JSON.parse(localStorage.getItem('bidbuy_user') || 'null')
      if(user){
        let refreshed = await fetch(`http://localhost:8082/api/products/owner/${user.id}`, { credentials: 'include' })
        if(!refreshed.ok) refreshed = await fetch(`http://localhost:8082/api/products/ower/${user.id}`, { credentials: 'include' })
        setProducts(refreshed.ok ? await refreshed.json() : [])
      }
    }catch(e){ console.error(e); setToast('Network error') }
    setTimeout(()=>setToast(null),3000)
  }

  async function handleEndBidding(productId){
    if(!confirm('End bidding for this product?')) return
    try{
      const res = await fetch(`http://localhost:8082/api/products/end/${productId}`, {
        method: 'POST',
        credentials: 'include'
      })
      if(!res.ok){ setToast('Failed to end bidding'); setTimeout(()=>setToast(null),3000); return }
      setToast('Bidding ended')
      // refresh list
      const user = JSON.parse(localStorage.getItem('bidbuy_user') || 'null')
      if(user){
        let refreshed = await fetch(`http://localhost:8082/api/products/owner/${user.id}`, { credentials: 'include' })
        if(!refreshed.ok) refreshed = await fetch(`http://localhost:8082/api/products/ower/${user.id}`, { credentials: 'include' })
        setProducts(refreshed.ok ? await refreshed.json() : [])
      }
    }catch(e){ console.error(e); setToast('Network error') }
    setTimeout(()=>setToast(null),3000)
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Products</h1>
            <div className="text-slate-400 text-sm">Products you created</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-primary" onClick={()=>setShowAdd(true)}>Add Product</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-300">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 && <div className="glass p-6 rounded-lg text-slate-300">No products found.</div>}
          {products.map(p=> (
            <div key={p.id} className="glass p-4 rounded-lg flex flex-col">
              <div className="h-52 bg-slate-700 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                {p.imageBase64 ? (
                  <img src={p.imageBase64} alt={p.title} className="max-h-48 max-w-full object-contain rounded-md" />
                ) : (
                  <span className="text-slate-400">No image</span>
                )}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-lg">{p.title}</div>
                <div className="text-slate-300 text-sm mt-2">{p.description}</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-white/5 rounded"><div className="text-slate-400">Base Bid</div><div className="font-semibold">₹{Number(p.startingPrice||0).toFixed(2)}</div></div>
                <div className="p-3 bg-white/5 rounded"><div className="text-slate-400">Current Bid</div><div className="font-semibold">₹{Number(p.currentBid||p.startingPrice||0).toFixed(2)}</div></div>
              </div>

              <div className="mt-3 text-sm text-slate-300">Highest bidder: <span className="text-slate-100 font-medium">{p.highestBidderId ? bidderNames[p.highestBidderId] || `#${p.highestBidderId}` : '—'}</span></div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-400">Status: <span className="text-slate-200 ml-1">{p.status}</span></div>
                <div className="flex items-center gap-2">
                  <button className="btn-outline" onClick={()=>navigate(`/product/${p.id}`, { state: { product: p } })}>View</button>
                  <button className="btn-primary" onClick={()=>handleEndBidding(p.id)}>End Bidding</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setShowAdd(false)} />
          <div className="relative w-full max-w-lg bg-slate-900 rounded-xl p-6 glass z-50">
            <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-semibold">Add Product</h3><button className="btn-outline" onClick={()=>setShowAdd(false)}>Close</button></div>
            <AddProductForm onCreate={handleCreate} creating={creating} />
          </div>
        </div>
      )}

      {toast && (<div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2 rounded shadow">{toast}</div>)}
    </DashboardLayout>
  )
}
