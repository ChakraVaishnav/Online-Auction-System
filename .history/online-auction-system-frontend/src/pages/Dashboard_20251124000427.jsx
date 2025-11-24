import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddProductForm from "../components/AddProductForm";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidderNames, setBidderNames] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('bidbuy_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [section, setSection] = useState('all'); // 'all' | 'mine' | 'profile'
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        let res;
        if (section === 'all') {
          res = await fetch('http://localhost:8082/api/products/all', { credentials: 'include' });
        } else if (section === 'mine') {
          const ownerId = user?.id;
          if (!ownerId) {
            setProducts([]);
            setLoading(false);
            return;
          }
          // try correct endpoint, fall back to common misspelling
          res = await fetch(`http://localhost:8082/api/products/owner/${ownerId}`, { credentials: 'include' });
          if (!res.ok) {
            res = await fetch(`http://localhost:8082/api/products/ower/${ownerId}`, { credentials: 'include' });
          }
        } else {
          // profile section
          setProducts([]);
          setLoading(false);
          return;
        }

        const data = res && res.ok ? await res.json() : [];
        setProducts(data);

        const ids = Array.from(new Set(data.map((p) => p.highestBidderId).filter(Boolean)));
        const names = {};
        await Promise.all(ids.map(async (id) => {
          try {
            const r = await fetch(`http://localhost:8082/api/auth/by-id?id=${id}`, { credentials: 'include' });
            if (r.ok) {
              const u = await r.json();
              names[id] = u.username || u.name || `#${id}`;
            } else {
              names[id] = `#${id}`;
            }
          } catch (e) {
            names[id] = `#${id}`;
          }
        }));

        setBidderNames(names);
      } catch (e) {
        console.error(e);
        setProducts([]);
      }

      setLoading(false);
    }

    load();
  }, [section, user]);

  // refresh current user from server and persist to localStorage
  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      try {
        const res = await fetch('http://localhost:8082/api/auth/me', { credentials: 'include' });
        if (!res.ok) return;
        const u = await res.json();
        if (mounted) {
          setUser(u);
          try { localStorage.setItem('bidbuy_user', JSON.stringify(u)); } catch (e) {}
        }
      } catch (e) {
        // ignore
      }
    }

    fetchUser();
    return () => { mounted = false; };
  }, []);

  async function handleCreate(form) {
    setCreating(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        startingPrice: Number(form.startingPrice),
        currentBid: Number(form.startingPrice),
        highestBidderId: null,
        status: 'LIVE',
        imageBase64: form.imageBase64 || null,
      };

      const res = await fetch('http://localhost:8082/api/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setToast('Failed to create product');
        setCreating(false);
        return;
      }

      setToast('Product created');
      setShowAdd(false);

      const refreshed = await fetch('http://localhost:8082/api/products/all', { credentials: 'include' });
      setProducts(refreshed.ok ? await refreshed.json() : []);
    } catch (e) {
      console.error(e);
      setToast('Network error');
    }

    setCreating(false);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleLogout() {
    try {
      await fetch('http://localhost:8082/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) { /* ignore */ }
    try { localStorage.removeItem('bidbuy_user'); } catch (e) {}
    setUser(null);
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top nav */}
      <div className="bg-slate-800/60 py-3 glass">
        <div className="container-wide flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center font-bold text-slate-900">BB</div>
            <div className="text-white font-semibold text-lg">BidBuy</div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-slate-200">{user.username || user.name || user.email}</div>
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
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="glass p-4 rounded-lg">
            <nav className="flex flex-col gap-2">
              <button className={`text-left px-3 py-2 rounded ${section==='all' ? 'bg-slate-700 text-white' : 'text-slate-300'}`} onClick={()=>setSection('all')}>All Products</button>
              <button className={`text-left px-3 py-2 rounded ${section==='mine' ? 'bg-slate-700 text-white' : 'text-slate-300'}`} onClick={()=>setSection('mine')}>My Products</button>
              <button className={`text-left px-3 py-2 rounded ${section==='profile' ? 'bg-slate-700 text-white' : 'text-slate-300'}`} onClick={async ()=>{
                setSection('profile');
                const uid = user?.id;
                if(uid){
                  try{
                    const r = await fetch(`http://localhost:8082/api/auth/by-id?id=${uid}`, { credentials: 'include' });
                    if(r.ok){ setProfileData(await r.json()); }
                  }catch(e){/* ignore */}
                }
              }}>Profile</button>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{section==='all' ? 'All Products' : section==='mine' ? 'My Products' : 'Profile'}</h1>
              <div className="text-slate-400 text-sm">{section==='all' ? 'Browse all active auctions' : section==='mine' ? 'Your created products' : 'Your profile details'}</div>
            </div>

            <div className="flex items-center gap-3">
              <button className="btn-primary" onClick={()=>setShowAdd(true)}>Add Product</button>
            </div>
          </div>

          {section === 'profile' ? (
            <div className="glass p-6 rounded-lg text-slate-100">
              {profileData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="w-40 h-40 bg-slate-700 rounded-md flex items-center justify-center">{profileData.username?.charAt(0)?.toUpperCase()}</div>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold">{profileData.username || profileData.name}</h3>
                    <div className="text-slate-300 mt-2">Email: {profileData.email}</div>
                    <div className="text-slate-300 mt-2">User ID: {profileData.id}</div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-300">Profile not available.</div>
              )}
            </div>
          ) : (
            <div>
              {loading ? (
                <div className="text-slate-300">Loading products...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.length === 0 && (
                    <div className="glass p-6 rounded-lg text-slate-300">No products found.</div>
                  )}

                  {products.map((p) => (
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
                        <div className="p-3 bg-white/5 rounded">
                          <div className="text-slate-400">Base Bid</div>
                          <div className="font-semibold">₹{Number(p.startingPrice || 0).toFixed(2)}</div>
                        </div>

                        <div className="p-3 bg-white/5 rounded">
                          <div className="text-slate-400">Current Bid</div>
                          <div className="font-semibold">₹{Number(p.currentBid || p.startingPrice || 0).toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-slate-300">Highest bidder: <span className="text-slate-100 font-medium">{p.highestBidderId ? bidderNames[p.highestBidderId] || `#${p.highestBidderId}` : '—'}</span></div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-xs text-slate-400">Status: <span className="text-slate-200 ml-1">{p.status}</span></div>
                        <button className="btn-primary" onClick={() => navigate(`/product/${p.id}`, { state: { product: p } })}>View</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-lg bg-slate-900 rounded-xl p-6 glass z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Add Product</h3>
              <button className="btn-outline" onClick={() => setShowAdd(false)}>Close</button>
            </div>

            <AddProductForm onCreate={handleCreate} creating={creating} />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2 rounded shadow">{toast}</div>
      )}
    </div>
  );
}
