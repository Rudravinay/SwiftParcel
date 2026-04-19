import { MdInbox } from 'react-icons/md'

/* ── Status Badge ────────────────────── */
const MAP = {
  'Picked Up':        'badge-picked',
  'In Transit':       'badge-transit',
  'Out for Delivery': 'badge-out',
  'Delivered':        'badge-delivered',
}
const DOT = {
  'Picked Up':'#f59e0b','In Transit':'#60a5fa',
  'Out for Delivery':'#a78bfa','Delivered':'#2dd4bf',
}
export function StatusBadge({ status }) {
  const cls = MAP[status] || 'badge-pending'
  return (
    <span className={`badge ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: DOT[status] || '#64748b' }} />
      {status || 'Pending'}
    </span>
  )
}

/* ── Spinners ────────────────────────── */
export function Spinner({ size = 6 }) {
  return <div className={`w-${size} h-${size} border-2 border-p-800 border-t-p-400 rounded-full animate-spin`} />
}
export function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={10} />
        <p className="text-xs text-slate-600 font-mono animate-pulse">Loading…</p>
      </div>
    </div>
  )
}

/* ── Empty state ─────────────────────── */
export function Empty({ icon: Icon = MdInbox, title = 'Nothing here', desc = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-14 h-14 rounded-2xl bg-dark-500 border border-white/[0.06] flex items-center justify-center">
        <Icon className="text-2xl text-slate-600" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-400">{title}</p>
        {desc && <p className="text-xs text-slate-600 mt-1">{desc}</p>}
      </div>
    </div>
  )
}

/* ── Modal ───────────────────────────── */
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}>
      <div className="card shadow-modal w-full max-w-md p-6 page-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white font-display">{title}</h3>
          <button onClick={onClose} className="btn-icon text-slate-500 hover:text-white">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ── Form field ──────────────────────── */
export function Field({ label, error, icon: Icon, children }) {
  return (
    <div>
      {label && <label className="field-label">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-base z-10 pointer-events-none" />}
        <div className={Icon ? '[&>input]:pl-10 [&>select]:pl-10 [&>textarea]:pl-10' : ''}>
          {children}
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}
