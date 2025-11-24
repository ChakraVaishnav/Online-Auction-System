import { useState } from 'react'

export default function AddProductForm({ onCreate, creating }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startingPrice, setStartingPrice] = useState('')
  const [imageBase64, setImageBase64] = useState('')

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setImageBase64(reader.result)
    reader.readAsDataURL(file)
  }

  function submit(e) {
    e.preventDefault()
    if (!title || !startingPrice) {
      alert('Please provide title and starting price')
      return
    }

    onCreate({ title, description, startingPrice, imageBase64 })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm text-slate-300">Title</label>
        <input className="form-input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label className="text-sm text-slate-300">Description</label>
        <textarea className="form-input mt-1" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>

      <div>
        <label className="text-sm text-slate-300">Starting Price</label>
        <input className="form-input mt-1" type="number" step="0.01" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} />
      </div>

      <div>
        <label className="text-sm text-slate-300">Upload Image</label>
        <input className="form-input mt-1" type="file" accept="image/*" onChange={handleFileUpload} />
      </div>

      {imageBase64 && (
        <div className="mt-2">
          <img src={imageBase64} alt="preview" className="h-28 w-auto object-contain rounded-md" />
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button className="btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Create product'}</button>
      </div>
    </form>
  )
}
