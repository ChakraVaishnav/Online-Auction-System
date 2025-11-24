import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AddProductForm({ onCreate, creating }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  // Convert uploaded file → Base64
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result); // Base64 string
    };
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    if (!title || !startingPrice) {
      alert("Please provide title and starting price");
      return;
    }

    onCreate({ title, description, startingPrice, imageBase64 });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm text-slate-300">Title</label>
        <input
          className="form-input mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-slate-300">Description</label>
        <textarea
          className="form-input mt-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm text-slate-300">Starting Price</label>
        <input
          className="form-input mt-1"
          type="number"
          step="0.01"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-slate-300">Upload Image</label>
        <input
          className="form-input mt-1"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
        />
      </div>

      {imageBase64 && (
        <div className="mt-2">
          <img
            src={imageBase64}
            alt="preview"
            className="h-28 w-auto object-contain rounded-md"
          />
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button className="btn-primary" disabled={creating}>
          {creating ? "Creating..." : "Create product"}
        </button>
      </div>
    </form>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidderNames, setBidderNames] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const res = await fetch("http://localhost:8082/api/products/all", {
          credentials: "include",
        });

        const data = res.ok ? await res.json() : [];
        setProducts(data);

        const ids = Array.from(
          new Set(data.map((p) => p.highestBidderId).filter(Boolean))
        );

        const names = {};
        await Promise.all(
          ids.map(async (id) => {
            const r = await fetch(
              `http://localhost:8082/api/auth/by-id?id=${id}`,
              { credentials: "include" }
            );
            names[id] = r.ok ? (await r.json()).username : `#${id}`;
          })
        );

        setBidderNames(names);
      } catch {
        setProducts([]);
      }

      setLoading(false);
    }

    load();
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
        status: "LIVE",
        imageBase64: form.imageBase64 || null,
      };

      const res = await fetch("http://localhost:8082/api/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setToast("Failed to create product");
        setCreating(false);
        return;
      }

      setToast("Product created");
      setShowAdd(false);

      const refreshed = await fetch("http://localhost:8082/api/products/all", {
        credentials: "include",
      });

      setProducts(refreshed.ok ? await refreshed.json() : []);
    } catch {
      setToast("Network error");
    }

    setCreating(false);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="text-slate-400 text-sm">
              Your auctions and marketplace overview
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-outline" onClick={() => navigate("/")}>
              Back
            </button>
            <button className="btn-primary" onClick={() => setShowAdd(true)}>
              Add Product
            </button>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="text-slate-300">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 && (
              <div className="glass p-6 rounded-lg text-slate-300">
                No products found.
              </div>
            )}

            {products.map((p) => (
              <div key={p.id} className="glass p-4 rounded-lg flex flex-col">
                <div className="h-52 bg-slate-700 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                  {p.imageBase64 ? (
                    <img
                      src={p.imageBase64}
                      alt={p.title}
                      className="max-h-48 max-w-full object-contain rounded-md"
                    />
                  ) : (
                    <span className="text-slate-400">No image</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-lg">{p.title}</div>
                  <div className="text-slate-300 text-sm mt-2">
                    {p.description}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-white/5 rounded">
                    <div className="text-slate-400">Base Bid</div>
                    <div className="font-semibold">
                      ${p.startingPrice?.toFixed(2)}
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 rounded">
                    <div className="text-slate-400">Current Bid</div>
                    <div className="font-semibold">
                      ${p.currentBid?.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-300">
                  Highest bidder:{" "}
                  <span className="text-slate-100 font-medium">
                    {p.highestBidderId
                      ? bidderNames[p.highestBidderId] ||
                        `#${p.highestBidderId}`
                      : "—"}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Status:
                    <span className="text-slate-200 ml-1">{p.status}</span>
                  </div>
                    <button className="btn-primary" onClick={() => navigate(`/product/${p.id}`, { state: { product: p } })}>View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAdd(false)}
          />
          <div className="relative w-full max-w-lg bg-slate-900 rounded-xl p-6 glass z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Add Product</h3>
              <button className="btn-outline" onClick={() => setShowAdd(false)}>
                Close
              </button>
            </div>

            <AddProductForm onCreate={handleCreate} creating={creating} />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}
