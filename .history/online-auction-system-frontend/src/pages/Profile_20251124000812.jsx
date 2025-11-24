import { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'

export default function Profile(){
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    async function load(){
      setLoading(true)
      try{
        let user = null
        try{ user = JSON.parse(localStorage.getItem('bidbuy_user')) }catch(e){ user = null }
        if(!user){
          const r = await fetch('http://localhost:8082/api/auth/me', { credentials: 'include' })
          if(r.ok) user = await r.json()
        }
        if(!user){ setProfile(null); setLoading(false); return }
        // fetch authoritative profile if possible
        try{
          const r = await fetch(`http://localhost:8082/api/auth/by-id?id=${user.id}`, { credentials: 'include' })
          if(r.ok) setProfile(await r.json())
          else setProfile(user)
        }catch(e){ setProfile(user) }
      }catch(e){ console.error(e); setProfile(null) }
      if(mounted) setLoading(false)
    }
    load()
    return ()=>{ mounted = false }
  },[])

  if(loading) return <div className="min-h-screen py-12 container-wide text-slate-300">Loading profile...</div>
  if(!profile) return <div className="min-h-screen py-12 container-wide text-slate-300">No profile available.</div>

  return (
    <DashboardLayout>
      <div className="glass p-6 rounded-lg text-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="w-40 h-40 bg-slate-700 rounded-md flex items-center justify-center text-4xl">{profile.username?.charAt(0)?.toUpperCase()}</div>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold">{profile.username || profile.name}</h2>
            <div className="text-slate-300 mt-2">Email: {profile.email}</div>
            <div className="text-slate-300 mt-2">User ID: {profile.id}</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
