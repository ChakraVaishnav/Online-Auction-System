export async function checkAuth(){
  try{
    const res = await fetch('http://localhost:8082/api/auth/me', { credentials: 'include' })
    if(res.ok){
      const u = await res.json()
      try{ localStorage.setItem('bidbuy_user', JSON.stringify(u)) }catch(e){}
      return { ok: true, user: u }
    }
    // not ok (401 or other)
    try{ localStorage.removeItem('bidbuy_user') }catch(e){}
    return { ok: false }
  }catch(e){
    try{ localStorage.removeItem('bidbuy_user') }catch(e){}
    return { ok: false }
  }
}

export async function ensureAuth(navigate){
  const r = await checkAuth()
  if(!r.ok){
    // redirect to login
    navigate('/login')
    return null
  }
  return r.user
}
