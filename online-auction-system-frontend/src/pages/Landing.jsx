import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full py-6">
        <div className="container-wide flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center font-bold text-slate-900 text-lg">BB</div>
            <div className="text-white font-semibold text-lg">BidBuy</div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>

      <header className="flex-1 flex items-center py-16">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">Buy smarter. Bid better.<br/><span className="text-teal-300">Experience auctions reimagined.</span></h1>
            <p className="mt-6 text-slate-300 text-lg">BidBuy is a premium auction marketplace built for collectors, sellers and bargain hunters. Join live auctions, set alerts, and buy with confidence.</p>

            <div className="mt-8 flex items-center gap-4">
              <Link to="/signup" className="btn-primary">Get Started</Link>
              <a href="#how" className="btn-outline">How it works</a>
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

          {/* preview card removed to keep clean professional hero layout */}
        </div>
      </header>

      <section id="how" className="py-10">
        <div className="container-wide">
          <h3 className="text-3xl font-bold mb-6">How BidBuy Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-xl">
              <div className="text-sm text-teal-300 font-semibold">1. Discover</div>
              <h4 className="font-semibold mt-2">Browse curated auctions</h4>
              <p className="mt-2 text-slate-300 text-sm">Explore hand-picked items across categories and follow collections you love.</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <div className="text-sm text-teal-300 font-semibold">2. Bid</div>
              <h4 className="font-semibold mt-2">Real-time bidding</h4>
              <p className="mt-2 text-slate-300 text-sm">Compete in live auctions with instant updates and clear closing rules.</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <div className="text-sm text-teal-300 font-semibold">3. Secure</div>
              <h4 className="font-semibold mt-2">Safe checkout</h4>
              <p className="mt-2 text-slate-300 text-sm">Payments held in escrow until delivery is confirmed — buyer and seller protection.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-slate-800/40 to-transparent">
        <div className="container-wide">
          <h3 className="text-2xl font-bold mb-6">Popular Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-lg text-center">Watches</div>
            <div className="glass p-4 rounded-lg text-center">Collectibles</div>
            <div className="glass p-4 rounded-lg text-center">Electronics</div>
            <div className="glass p-4 rounded-lg text-center">Art & Antiques</div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-wide">
          <h3 className="text-2xl font-bold mb-6">What our users say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-xl">
              <div className="font-semibold">A. Carter</div>
              <div className="text-slate-300 text-sm mt-2">"BidBuy made collecting so simple. The escrow system is trustworthy and the community is great."</div>
            </div>
            <div className="glass p-6 rounded-xl">
              <div className="font-semibold">M. Singh</div>
              <div className="text-slate-300 text-sm mt-2">"Love the real-time bidding and clear UI. I never miss an auction now."</div>
            </div>
            <div className="glass p-6 rounded-xl">
              <div className="font-semibold">J. Lopez</div>
              <div className="text-slate-300 text-sm mt-2">"Great selection of items and excellent seller verification."</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between text-slate-400 gap-4">
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
