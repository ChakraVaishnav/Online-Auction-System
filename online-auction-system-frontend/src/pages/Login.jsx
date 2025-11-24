import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const location = useLocation()
  const [toast, setToast] = useState(location.state?.toast || null)

  useEffect(()=>{
    if(toast){
      const t = setTimeout(()=>setToast(null), 4000)
      return ()=>clearTimeout(t)
    }
  },[toast])

  async function handleSubmit(e){
    e.preventDefault()
    if(!email || !password){
      alert('Please provide email and password')
      return
    }

    try{
      const res = await fetch('http://localhost:8082/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      if(!res.ok){
        const text = await res.text()
        alert(text || 'Login failed')
        return
      }

      // on success the backend sets httpOnly cookie; just navigate to dashboard
      navigate('/dashboard')
    }catch(err){
      console.error(err)
      alert('Login failed - network error')
    }
  }

  return (
    <div className="min-h-screen flex items-center">
      <div className="container-wide mx-auto">
        <div className="max-w-md mx-auto bg-transparent glass p-8 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn-outline btn-back" aria-label="Back to landing">← Back</Link>
            <div className="text-slate-300 text-sm">Need help? <a className="underline" href="#">Contact</a></div>
          </div>

          {toast && (
            <div className="mb-4 p-3 rounded-md bg-emerald-600 text-white">{toast}</div>
          )}

          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-slate-300 mb-6">Log in to your BidBuy account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input className="form-input mt-1" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
            </div>

            <div>
              <label className="text-sm text-slate-300">Password</label>
              <input className="form-input mt-1" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            <div className="flex items-center justify-between">
              <button className="btn-primary" type="submit">Sign in</button>
              <Link to="/signup" className="text-sm text-slate-300 hover:underline">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
