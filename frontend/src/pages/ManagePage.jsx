import { useState, useEffect } from 'react'
import { parcelAPI } from '../services/api'
import { StatusBadge, PageSpinner, Empty, Modal } from '../components/ui'
import { toast } from 'react-toastify'
import { MdInventory2, MdSearch, MdDeleteOutline, MdEditNote, MdRefresh, MdAdd } from 'react-icons/md'

const MOCK = [
  { _id:'1', trackingId:'SP-20260409-001', customerId:'C-1001', senderName:'Ravi Shankar', receiverName:'Meena Devi',   receiverAddress:'45, Anna Nagar', receiverCity:'Chennai',   parcelType:'Electronics', weight:2.3, status:'In Transit',       assignedAdmin:'Ramesh (S-001)' },
  { _id:'2', trackingId:'SP-20260409-002', customerId:'C-1002', senderName:'Priya Reddy',  receiverName:'Arun Patel',   receiverAddress:'12, Bandra',     receiverCity:'Mumbai',    parcelType:'Clothing',    weight:1.1, status:'Out for Delivery', assignedAdmin:'Suresh (S-002)' },
  { _id:'3', trackingId:'SP-20260408-089', customerId:'C-1003', senderName:'Suresh Kumar', receiverName:'Lakshmi Rao',  receiverAddress:'8, Koramangala', receiverCity:'Bangalore', parcelType:'Documents',   weight:0.5, status:'Delivered',        assignedAdmin:'Anita (S-003)'  },
  { _id:'4', trackingId:'SP-20260408-088', customerId:'C-1004', senderName:'Kavitha Nair', receiverName:'Deepak Joshi', receiverAddress:'22, CP',         receiverCity:'Delhi',     parcelType:'Books',       weight:3.2, status:'Picked Up',        assignedAdmin:'Ramesh (S-001)' },
  { _id:'5', trackingId:'SP-20260408-087', customerId:'C-1005', senderName:'Mohan Das',    receiverName:'Sita Ram',     receiverAddress:'5, Banjara Hills',receiverCity:'Hyderabad',parcelType:'Fragile Items',weight:4.0,status:'Delivered',         assignedAdmin:'Suresh (S-002)' },
]

export default function ManagePage() {
  const [parcels,  setParcels]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [edit,     setEdit]     = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await parcelAPI.getAll()
      setParcels(data.parcels || [])
    } catch { setParcels(MOCK) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this parcel?')) return
    setDeleting(id)
    try {
      await parcelAPI.delete(id)
    } catch {}
    setParcels(prev => prev.filter(p => p._id !== id))
    toast.success('Parcel deleted')
    setDeleting(null)
  }

  const handleSaveEdit = async () => {
    try {
      await parcelAPI.update(edit._id, edit)
    } catch {}
    setParcels(prev => prev.map(p => p._id === edit._id ? edit : p))
    toast.success('Parcel updated')
    setEdit(null)
  }

  const rows = parcels.filter(p =>
    !search ||
    p.trackingId?.toLowerCase().includes(search.toLowerCase()) ||
    p.senderName?.toLowerCase().includes(search.toLowerCase()) ||
    p.receiverName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 page-in">
      <div className="card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <MdInventory2 className="text-p-400 text-lg" />
          <span className="text-sm font-semibold text-slate-300">All Parcels</span>
          <span className="text-[10px] font-mono bg-dark-500 text-slate-600 px-2 py-0.5 rounded-md border border-white/[0.05]">
            {rows.length} records
          </span>
          <span className="text-[10px] text-slate-700 font-mono hidden md:block">Full CRUD · Admin only</span>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-base" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search parcels…" className="field pl-9 text-xs h-9 w-52" />
          </div>
          <button onClick={load} className="btn-ghost text-xs h-9 gap-1.5">
            <MdRefresh className="text-base" /> Refresh
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? <PageSpinner /> : rows.length === 0
          ? <Empty icon={MdInventory2} title="No parcels found" />
          : (
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Tracking ID</th><th>Customer</th><th>Sender</th>
                    <th>Receiver</th><th>Destination</th><th>Type</th>
                    <th>Wt.</th><th>Status</th><th>Admin</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(p => (
                    <tr key={p._id} className="group">
                      <td><span className="tid">{p.trackingId}</span></td>
                      <td>
                        <span className="font-mono text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg">
                          {p.customerId || 'C-100' + p._id?.slice(-1)}
                        </span>
                      </td>
                      <td className="text-slate-400">{p.senderName}</td>
                      <td className="font-medium text-slate-200">{p.receiverName}</td>
                      <td className="text-slate-500 max-w-[130px]">
                        <span className="truncate block text-xs">{p.receiverCity}</span>
                      </td>
                      <td className="text-slate-500 text-xs">{p.parcelType}</td>
                      <td className="font-mono text-xs text-slate-600">{p.weight}kg</td>
                      <td><StatusBadge status={p.status} /></td>
                      <td className="text-xs text-slate-600">{p.assignedAdmin}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setEdit({ ...p })} className="btn-icon">
                            <MdEditNote className="text-sm" />
                          </button>
                          <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                            className="btn-danger !px-2 !py-1.5 rounded-lg disabled:opacity-40">
                            {deleting === p._id
                              ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                              : <MdDeleteOutline className="text-sm" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* Edit Modal */}
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Edit Parcel">
        {edit && (
          <div className="space-y-4">
            {[
              { k:'receiverName',    l:'Receiver Name' },
              { k:'receiverAddress', l:'Destination Address' },
              { k:'receiverCity',    l:'Destination City' },
              { k:'specialInstructions', l:'Special Instructions' },
            ].map(({ k, l }) => (
              <div key={k}>
                <label className="field-label">{l}</label>
                <input className="field" value={edit[k] || ''}
                  onChange={e => setEdit({ ...edit, [k]: e.target.value })} />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEdit(null)} className="btn-ghost flex-1 text-sm h-10">Cancel</button>
              <button onClick={handleSaveEdit} className="btn-primary flex-1 text-sm h-10">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
