import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e){
    e.preventDefault()
    // placeholder: no backend yet
    if(!email || !password){
      alert('Please provide email and password')
      return
    }
    alert('Logged in (demo): ' + email)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center">
      <div className="container-wide mx-auto">
        <div className="max-w-md mx-auto bg-transparent glass p-8 rounded-xl">
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
