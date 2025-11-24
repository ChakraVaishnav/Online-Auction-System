import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [bidderNames, setBidderNames] = useState({})
  const navigate = useNavigate()

  useEffect(()=>{
    async function load(){
      setLoading(true)
      try{
        const res = await fetch('http://localhost:8082/api/products/all', { credentials: 'include' })
        if(!res.ok){
          const text = await res.text()
          console.error('Failed to fetch products', text)
          setProducts([])
          setLoading(false)
          return
        }
        const data = await res.json()
        setProducts(data || [])

        // gather unique bidder ids
        const ids = Array.from(new Set((data || []).map(p=>p.highestBidderId).filter(Boolean)))
        const names = {}
        await Promise.all(ids.map(async id=>{
          try{
            const r = await fetch(`http://localhost:8082/api/auth/by-id?id=${id}`, { credentials: 'include' })
            if(r.ok){
              const u = await r.json()
              names[id] = u.username || u.name || `#${id}`
            }else{
              names[id] = `#${id}`
            }
          }catch(e){
            names[id] = `#${id}`
          }
        }))
        setBidderNames(names)
      }catch(err){
        console.error(err)
        setProducts([])
      }finally{
        setLoading(false)
      }
    }

    load()
  },[])

  return (
    <div className="min-h-screen py-12">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="text-slate-400 text-sm">Your auctions and marketplace overview</div>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-outline" onClick={()=>navigate('/')}>Back</button>
            <button className="btn-primary" onClick={()=>alert('Add Product - UI placeholder')}>Add Product</button>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-300">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 && (
              <div className="glass p-6 rounded-lg text-slate-300">No products found.</div>
            )}

            {products.map(p=> (
              <div key={p.id} className="glass p-4 rounded-lg flex flex-col">
                <div className="h-40 bg-slate-700 rounded-md mb-4 flex items-center justify-center text-slate-400">{p.imageUrl ? <img src={p.imageUrl} alt={p.title} className="object-cover h-full w-full rounded-md" /> : 'No image'}</div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{p.title}</div>
                  <div className="text-slate-300 text-sm mt-2">{p.description}</div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-white/5 rounded">
                    <div className="text-slate-400">Base Bid</div>
                    <div className="font-semibold">${p.startingPrice?.toFixed(2) || '0.00'}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <div className="text-slate-400">Current Bid</div>
                    <div className="font-semibold">${p.currentBid?.toFixed(2) || p.startingPrice?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-300">Highest bidder: <span className="text-slate-100 font-medium">{p.highestBidderId ? (bidderNames[p.highestBidderId] || `#${p.highestBidderId}`) : '—'}</span></div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-slate-400">Status: <span className="text-slate-200 ml-1">{p.status || 'UNKNOWN'}</span></div>
                  <button className="btn-primary" onClick={()=>alert('Open product - placeholder')}>View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
