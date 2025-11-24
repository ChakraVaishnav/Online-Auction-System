import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Signup(){
  const [email,setEmail] = useState('')
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    if(!email || !username || !password){
      alert('Please fill all fields')
      return
    }

    try{
      const res = await fetch('http://localhost:8082/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, username, password })
      })

      if(!res.ok){
        const text = await res.text()
        alert(text || 'Signup failed')
        return
      }

      // on success, navigate to login with a toast message
      navigate('/login', { state: { toast: 'Account created. Please log in.' } })
    }catch(err){
      console.error(err)
      alert('Signup failed - network error')
    }
  }

  return (
    <div className="min-h-screen flex items-center">
      <div className="container-wide mx-auto">
        <div className="max-w-md mx-auto bg-transparent glass p-8 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn-outline btn-back" aria-label="Back to landing">← Back</Link>
            <div className="text-slate-300 text-sm">Already have an account? <Link to="/login" className="underline">Sign in</Link></div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Create your account</h2>
          <p className="text-slate-300 mb-6">Signup to start bidding on items</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input className="form-input mt-1" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
            </div>

            <div>
              <label className="text-sm text-slate-300">Username</label>
              <input className="form-input mt-1" type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="yourname" />
            </div>

            <div>
              <label className="text-sm text-slate-300">Password</label>
              <input className="form-input mt-1" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create a password" />
            </div>

            <div className="flex items-center justify-between">
              <button className="btn-primary" type="submit">Create account</button>
              <Link to="/login" className="text-sm text-slate-300 hover:underline">Have an account?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
