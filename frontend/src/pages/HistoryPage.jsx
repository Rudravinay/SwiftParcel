import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { parcelAPI } from '../services/api'
import { StatusBadge, PageSpinner, Empty } from '../components/ui'
import { toast } from 'react-toastify'
import { MdHistory, MdSearch, MdGpsFixed, MdFilterList } from 'react-icons/md'

const FILTERS = ['All', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']
const MOCK = [
  { _id:'1', trackingId:'SP-20260409-001', senderName:'Ravi Shankar', receiverName:'Meena Devi',   receiverAddress:'45, Anna Nagar', receiverCity:'Chennai',   parcelType:'Electronics',  weight:2.3, status:'In Transit',       createdAt:new Date() },
  { _id:'2', trackingId:'SP-20260409-002', senderName:'Priya Reddy',  receiverName:'Arun Patel',   receiverAddress:'12, Bandra',     receiverCity:'Mumbai',    parcelType:'Clothing',     weight:1.1, status:'Out for Delivery', createdAt:new Date() },
  { _id:'3', trackingId:'SP-20260408-089', senderName:'Suresh Kumar', receiverName:'Lakshmi Rao',  receiverAddress:'8, Koramangala', receiverCity:'Bangalore', parcelType:'Documents',    weight:0.5, status:'Delivered',        createdAt:new Date(Date.now()-86400000) },
  { _id:'4', trackingId:'SP-20260408-088', senderName:'Kavitha Nair', receiverName:'Deepak Joshi', receiverAddress:'22, CP',         receiverCity:'Delhi',     parcelType:'Books',        weight:3.2, status:'Picked Up',        createdAt:new Date(Date.now()-86400000) },
  { _id:'5', trackingId:'SP-20260408-087', senderName:'Mohan Das',    receiverName:'Sita Ram',     receiverAddress:'5, Banjara Hills',receiverCity:'Hyderabad',parcelType:'Fragile Items',weight:4.0, status:'Delivered',        createdAt:new Date(Date.now()-172800000) },
]

export default function HistoryPage() {
  const navigate = useNavigate()
  const [parcels, setParcels] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('All')
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    parcelAPI.getMine()
      .then(r => setParcels(r.data.parcels || []))
      .catch(() => setParcels(MOCK))
      .finally(() => setLoading(false))
  }, [])

  const rows = parcels.filter(p => {
    const fOk = filter === 'All' || p.status === filter
    const sOk = !search ||
      p.trackingId?.toLowerCase().includes(search.toLowerCase()) ||
      p.receiverName?.toLowerCase().includes(search.toLowerCase()) ||
      p.receiverCity?.toLowerCase().includes(search.toLowerCase())
    return fOk && sOk
  })

  return (
    <div className="space-y-4 page-in">
      {/* Filter bar */}
      <div className="card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <MdFilterList className="text-slate-600 text-lg" />
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-p-500 text-dark-900 shadow-glow'
                  : 'bg-dark-500 text-slate-500 border border-white/[0.06] hover:border-white/10 hover:text-slate-300'
              }`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-base" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search ID or receiver…"
            className="field pl-9 text-xs w-52 h-9" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="card-head">
          <div className="flex items-center gap-2">
            <MdHistory className="text-p-400 text-base" />
            <span className="card-title">Shipment History</span>
            <span className="text-[10px] font-mono bg-dark-500 text-slate-600 px-2 py-0.5 rounded-md border border-white/[0.05]">{rows.length}</span>
          </div>
          <span className="text-[10px] text-slate-700 hidden md:block font-mono">statusHistory array · ER</span>
        </div>

        {loading ? <PageSpinner /> : rows.length === 0 ? (
          <Empty icon={MdHistory} title="No shipments found" desc="Try a different filter or book your first parcel." />
        ) : (
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Tracking ID</th><th>Sender</th><th>Receiver</th>
                  <th>Destination</th><th>Contents</th><th>Weight</th>
                  <th>Status</th><th>Booked</th><th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(p => (
                  <tr key={p._id} className="group">
                    <td><span className="tid">{p.trackingId}</span></td>
                    <td className="text-slate-400">{p.senderName}</td>
                    <td className="font-medium text-slate-200">{p.receiverName}</td>
                    <td className="text-slate-500 max-w-[160px]">
                      <span className="truncate block">{p.receiverAddress}, {p.receiverCity}</span>
                    </td>
                    <td className="text-slate-500">{p.parcelType}</td>
                    <td className="font-mono text-xs text-slate-500">{p.weight} kg</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className="font-mono text-[11px] text-slate-600">
                      {new Date(p.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                    </td>
                    <td>
                      <button onClick={() => navigate('/track')}
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] text-p-400 font-semibold transition-all">
                        <MdGpsFixed className="text-sm" /> Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
