import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full py-6">
        <div className="container-wide flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center font-bold text-slate-900">BB</div>
            <div className="text-white font-semibold text-lg">BidBuy</div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>

      <header className="flex-1 flex items-center">
        <div className="container-wide grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">Buy smarter. Bid better.</h1>
            <p className="mt-6 text-slate-300 text-lg">Join BidBuy — the professional, modern auction platform. Discover unique items, compete in live auctions, and get the best deals.</p>

            <div className="mt-8 flex items-center gap-4">
              <Link to="/signup" className="btn-primary">Get Started</Link>
              <a href="#features" className="btn-outline">See Features</a>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-slate-300">Trusted Sellers</div>
                <div className="font-semibold mt-1">Verified identities</div>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-slate-300">Secure Payments</div>
                <div className="font-semibold mt-1">Protected transactions</div>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="w-full h-80 bg-gradient-to-tr from-slate-700 to-slate-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="text-center text-slate-200">
                <div className="text-2xl font-bold">Live auction preview</div>
                <div className="mt-4 text-slate-300">Beautiful responsive bidding cards, real-time updates and more.</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="py-12">
        <div className="container-wide">
          <h3 className="text-2xl font-bold mb-6">Why BidBuy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-xl">
              <h4 className="font-semibold">Real-time Bidding</h4>
              <p className="mt-2 text-slate-300 text-sm">Place bids with millisecond updates and fair closing rules.</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <h4 className="font-semibold">Curated Collections</h4>
              <p className="mt-2 text-slate-300 text-sm">Find high-quality items across categories.</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <h4 className="font-semibold">Secure Escrow</h4>
              <p className="mt-2 text-slate-300 text-sm">Funds are protected until the item is delivered.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8">
        <div className="container-wide flex items-center justify-between text-slate-400">
          <div>© {new Date().getFullYear()} BidBuy</div>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#">Terms</a>
            <a className="hover:underline" href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
