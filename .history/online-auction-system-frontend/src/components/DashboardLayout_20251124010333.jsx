import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { checkAuth } from '../utils/auth'

export default function DashboardLayout({ children }){
  const [user, setUser] = useState(()=>{
    try{ const raw = localStorage.getItem('bidbuy_user'); return raw ? JSON.parse(raw) : null }catch(e){ return null }
  })
  const navigate = useNavigate()

  useEffect(()=>{
    let mounted = true
    async function fetchUser(){
      try{
        const r = await checkAuth()
        if(!r.ok){
          // not authenticated — navigate to login
          try{ navigate('/login') }catch(e){}
          return
        }
        const u = r.user
        if(mounted){ setUser(u) }
      }catch(e){}
    }
    fetchUser()
    return ()=>{ mounted = false }
  },[])

  async function handleLogout(){
    try{ await fetch('http://localhost:8082/api/auth/logout', { method: 'POST', credentials: 'include' }) }catch(e){}
    try{ localStorage.removeItem('bidbuy_user') }catch(e){}
    setUser(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800/60 py-3 glass">
        <div className="container-wide flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center font-bold text-slate-900">BB</div>
            <div className="text-white font-semibold text-lg">BidBuy</div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-slate-200">
                  {user.username || user.name || user.email}
                  {typeof user.balance !== 'undefined' && (
                    <span className="text-slate-400 ml-3">₹{Number(user.balance).toFixed(2)}</span>
                  )}
                </div>
                <button className="btn-outline" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-outline">Login</Link>
                <Link to="/signup" className="btn-primary">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-wide grid grid-cols-12 gap-6 py-8">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="glass p-4 rounded-lg">
            <nav className="flex flex-col gap-2">
              <Link to="/dashboard/all" className="block px-3 py-2 rounded text-slate-300 hover:bg-slate-700">All Products</Link>
              <Link to="/dashboard/mine" className="block px-3 py-2 rounded text-slate-300 hover:bg-slate-700">My Products</Link>
              <Link to="/profile" className="block px-3 py-2 rounded text-slate-300 hover:bg-slate-700">Profile</Link>
            </nav>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          {children}
        </main>
      </div>
    </div>
  )
}
