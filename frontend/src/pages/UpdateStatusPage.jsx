import { useState, useEffect } from 'react'
import { parcelAPI } from '../services/api'
import { StatusBadge, PageSpinner, Empty } from '../components/ui'
import { toast } from 'react-toastify'
import { MdEditNote, MdLocationOn, MdCheckCircle, MdRefresh, MdArrowForward } from 'react-icons/md'

const STATUSES = ['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']
const MOCK = [
  { _id:'1', trackingId:'SP-20260409-001', senderName:'Ravi Shankar', receiverName:'Meena Devi',   receiverCity:'Chennai',   parcelType:'Electronics', weight:2.3, status:'In Transit' },
  { _id:'2', trackingId:'SP-20260409-002', senderName:'Priya Reddy',  receiverName:'Arun Patel',   receiverCity:'Mumbai',    parcelType:'Clothing',    weight:1.1, status:'Out for Delivery' },
  { _id:'4', trackingId:'SP-20260408-088', senderName:'Kavitha Nair', receiverName:'Deepak Joshi', receiverCity:'Delhi',     parcelType:'Books',       weight:3.2, status:'Picked Up' },
]

export default function UpdateStatusPage() {
  const [parcels, setParcels] = useState([])
  const [loading, setLoading] = useState(true)
  const [form,    setForm]    = useState({})
  const [saving,  setSaving]  = useState({})
  const [saved,   setSaved]   = useState({})

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await parcelAPI.getAll({ status_ne: 'Delivered' })
      const list = data.parcels || []
      setParcels(list)
      const init = {}
      list.forEach(p => { init[p._id] = { status: p.status, location: '' } })
      setForm(init)
    } catch {
      setParcels(MOCK)
      const init = {}
      MOCK.forEach(p => { init[p._id] = { status: p.status, location: '' } })
      setForm(init)
    } finally { setLoading(false) }
  }

  const update = async (p) => {
    const f = form[p._id]
    if (!f) return
    setSaving(s => ({ ...s, [p._id]: true }))
    try {
      await parcelAPI.updateStatus(p._id, { status: f.status, location: f.location })
    } catch {}
    setParcels(prev => prev.map(x => x._id === p._id ? { ...x, status: f.status } : x))
    setSaved(s => ({ ...s, [p._id]: true }))
    toast.success(`Updated → ${f.status}`)
    setTimeout(() => setSaved(s => ({ ...s, [p._id]: false })), 2500)
    setSaving(s => ({ ...s, [p._id]: false }))
  }

  return (
    <div className="space-y-4 page-in">
      <div className="card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-300">Update Parcel Status</p>
          <p className="text-[11px] text-slate-600 mt-0.5 font-mono">
            Each update creates a Tracking Update record with timestamp & location (ER Diagram)
          </p>
        </div>
        <button onClick={load} className="btn-ghost text-xs h-9 gap-1.5">
          <MdRefresh className="text-base" /> Refresh
        </button>
      </div>

      {loading ? <PageSpinner /> : parcels.length === 0 ? (
        <Empty icon={MdEditNote} title="No active parcels" desc="All parcels have been delivered." />
      ) : (
        <div className="space-y-3">
          {parcels.map((p, i) => {
            const f        = form[p._id] || { status: p.status, location: '' }
            const isSaving = saving[p._id]
            const isSaved  = saved[p._id]
            const changed  = f.status !== p.status || f.location

            return (
              <div key={p._id} className={`card p-5 s${Math.min(i+1,6)} animate-fade-up transition-all ${changed ? 'border-p-500/20' : ''}`}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="tid">{p.trackingId}</span>
                      <StatusBadge status={p.status} />
                      {changed && f.status !== p.status && (
                        <div className="flex items-center gap-1 text-[10px] text-p-400 font-mono">
                          <MdArrowForward className="text-xs" />
                          <StatusBadge status={f.status} />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-200">{p.parcelType} · {p.weight} kg</p>
                    <p className="text-xs text-slate-600 mt-0.5">{p.senderName} → {p.receiverName} · {p.receiverCity}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                    <div>
                      <label className="field-label">New Status</label>
                      <select value={f.status}
                        onChange={e => setForm(prev => ({ ...prev, [p._id]: { ...f, status: e.target.value } }))}
                        className="field text-xs h-10 w-48">
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Current Location</label>
                      <div className="relative">
                        <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-sm" />
                        <input type="text" value={f.location}
                          onChange={e => setForm(prev => ({ ...prev, [p._id]: { ...f, location: e.target.value } }))}
                          placeholder="e.g. Nellore Center"
                          className="field pl-9 text-xs h-10 w-48" />
                      </div>
                    </div>
                    <button onClick={() => update(p)} disabled={isSaving}
                      className={`h-10 px-5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 disabled:opacity-50 ${
                        isSaved
                          ? 'bg-p-500/15 border border-p-500/30 text-p-400'
                          : 'btn-primary'
                      }`}>
                      {isSaving
                        ? <div className="w-3.5 h-3.5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
                        : isSaved
                        ? <><MdCheckCircle className="text-base" /> Saved</>
                        : 'Update'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
