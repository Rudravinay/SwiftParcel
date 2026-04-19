import { useState } from 'react'
import { parcelAPI } from '../services/api'
import { StatusBadge, PageSpinner } from '../components/ui'
import { toast } from 'react-toastify'
import {
  MdSearch, MdLocalShipping, MdLocationOn, MdCheckCircle,
  MdInventory, MdPerson, MdSchedule, MdGpsFixed, MdContentCopy
} from 'react-icons/md'

const STAGES = ['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']
const STAGE_COLORS = {
  'Picked Up':        { bg:'bg-amber-500',  ring:'ring-amber-500/30',  icon:'text-dark-900' },
  'In Transit':       { bg:'bg-blue-500',   ring:'ring-blue-500/30',   icon:'text-dark-900' },
  'Out for Delivery': { bg:'bg-violet-500', ring:'ring-violet-500/30', icon:'text-dark-900' },
  'Delivered':        { bg:'bg-p-500',      ring:'ring-p-500/30',      icon:'text-dark-900' },
}
const STAGE_ICONS = {
  'Picked Up':        MdInventory,
  'In Transit':       MdLocalShipping,
  'Out for Delivery': MdLocationOn,
  'Delivered':        MdCheckCircle,
}
const MOCK = {
  _id:'1', trackingId:'SP-20260409-001',
  senderName:'Ravi Shankar',   senderCity:'Kurnool',
  receiverName:'Meena Devi',   receiverCity:'Chennai',
  parcelType:'Electronics',    weight:2.3, contents:'Laptop & accessories',
  status:'In Transit',         createdAt:new Date(),
  specialInstructions:'Handle with care',
  trackingUpdates:[
    { status:'Picked Up',  location:'Kurnool Hub',           updatedAt:new Date(Date.now()-18000000), updatedBy:'Ramesh (S-001)' },
    { status:'In Transit', location:'Nellore Sorting Center', updatedAt:new Date(Date.now()-7200000),  updatedBy:'Suresh (S-002)' },
  ],
}

export default function TrackPage() {
  const [tid,     setTid]     = useState('')
  const [parcel,  setParcel]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied,  setCopied]  = useState(false)

  const track = async (e) => {
    e?.preventDefault()
    if (!tid.trim()) return toast.warning('Enter a tracking ID')
    setLoading(true)
    try {
      const { data } = await parcelAPI.getByTid(tid.trim())
      setParcel(data.parcel || data)
    } catch {
      setParcel(MOCK)
      toast.info('Showing demo parcel data')
    } finally { setLoading(false) }
  }

  const demo = () => { setTid('SP-20260409-001'); setTimeout(track, 80) }

  const copy = (text) => {
    navigator.clipboard?.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  const stageIdx = parcel ? STAGES.indexOf(parcel.status) : -1
  const pct      = stageIdx < 0 ? 0 : (stageIdx / (STAGES.length - 1)) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-4 page-in">

      {/* Search card */}
      <div className="card p-5">
        <p className="text-xs text-slate-600 mb-4 font-mono uppercase tracking-wider">Enter Tracking ID</p>
        <form onSubmit={track} className="flex gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-lg" />
            <input
              value={tid} onChange={e => setTid(e.target.value)}
              placeholder="e.g. SP-20260409-001"
              className="field pl-10 font-mono text-sm h-11"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary h-11 px-6 text-sm">
            {loading
              ? <div className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
              : <><MdGpsFixed className="text-base" /> Track</>}
          </button>
        </form>
        <p className="mt-3 text-[11px] text-slate-700">
          Try demo:{' '}
          <button onClick={demo} className="font-mono text-p-500 hover:text-p-400 transition-colors">
            SP-20260409-001
          </button>
        </p>
      </div>

      {parcel && (
        <>
          {/* Parcel header */}
          <div className="card p-5 s1 animate-fade-up">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-p-500/10 border border-p-500/20 flex items-center justify-center shrink-0">
                  <MdLocalShipping className="text-p-400 text-2xl" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="tid text-sm">{parcel.trackingId}</span>
                    <button onClick={() => copy(parcel.trackingId)}
                      className={`transition-colors ${copied ? 'text-p-400' : 'text-slate-600 hover:text-slate-400'}`}>
                      <MdContentCopy className="text-sm" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-slate-200">{parcel.parcelType} · {parcel.weight} kg</p>
                  <p className="text-xs text-slate-600 mt-0.5">{parcel.contents}</p>
                </div>
              </div>
              <StatusBadge status={parcel.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-white/[0.05]">
              {[
                { k:'Sender',           v:parcel.senderName,   s:parcel.senderCity },
                { k:'Receiver',         v:parcel.receiverName, s:parcel.receiverCity },
                { k:'Booked',           v:new Date(parcel.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}), s:'' },
                { k:'Est. Delivery',    v: parcel.status==='Delivered' ? 'Delivered ✓' : 'Apr 11, 2026', s: parcel.status==='Delivered' ? '' : 'Estimated' },
              ].map(({ k, v, s }) => (
                <div key={k} className="bg-dark-500 rounded-xl p-3 border border-white/[0.04]">
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1 font-mono">{k}</p>
                  <p className="text-xs font-semibold text-slate-200 leading-snug">{v}</p>
                  {s && <p className="text-[10px] text-slate-600 mt-0.5">{s}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="card p-5 s2 animate-fade-up">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-6">Delivery Progress</p>

            {/* Bar */}
            <div className="relative mb-8">
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-dark-400" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-p-500 transition-all duration-700 shadow-glow"
                style={{ width: `calc(${pct}% - ${pct > 0 ? '10px' : '0px'})` }}
              />
              <div className="relative grid grid-cols-4">
                {STAGES.map((stage, i) => {
                  const done    = i < stageIdx
                  const current = i === stageIdx
                  const idle    = i > stageIdx
                  const cfg     = STAGE_COLORS[stage]
                  const Icon    = STAGE_ICONS[stage]
                  return (
                    <div key={stage} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                        done    ? `${cfg.bg} shadow-glow` :
                        current ? `${cfg.bg} ring-4 ${cfg.ring} shadow-glow animate-pulse-glow` :
                                  'bg-dark-400 border border-white/[0.08]'
                      }`}>
                        <Icon className={`text-lg ${done||current ? cfg.icon : 'text-slate-600'}`} />
                      </div>
                      <p className={`text-[10px] font-semibold text-center leading-tight ${
                        done||current ? 'text-slate-300' : 'text-slate-700'
                      }`}>{stage}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Tracking timeline */}
          <div className="card p-5 s3 animate-fade-up">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-5">
              Tracking Timeline — Tracking Update entity (ER)
            </p>
            <div className="space-y-0">
              {(parcel.trackingUpdates?.length ? parcel.trackingUpdates : []).map((u, i, arr) => {
                const Icon = STAGE_ICONS[u.status] || MdCheckCircle
                const cfg  = STAGE_COLORS[u.status] || STAGE_COLORS['Delivered']
                const last = i === arr.length - 1
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`tl-dot-done ${cfg.bg}`}>
                        <Icon className={`text-base ${cfg.icon}`} />
                      </div>
                      {!last && <div className="tl-line-done" />}
                    </div>
                    <div className={`${last ? 'pb-0' : 'pb-5'} flex-1`}>
                      <p className="text-sm font-semibold text-slate-200">{u.status}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        {u.location && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <MdLocationOn className="text-p-500 text-sm" />{u.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-slate-600 font-mono">
                          <MdSchedule className="text-sm" />
                          {u.updatedAt
                            ? new Date(u.updatedAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})
                            : '—'}
                        </span>
                        {u.updatedBy && (
                          <span className="flex items-center gap-1 text-xs text-slate-600">
                            <MdPerson className="text-sm" />{u.updatedBy}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Pending stages */}
              {STAGES.slice(stageIdx + 1).map((stage, i, arr) => {
                const Icon = STAGE_ICONS[stage]
                const last = i === arr.length - 1
                return (
                  <div key={stage} className="flex gap-4 opacity-30">
                    <div className="flex flex-col items-center">
                      <div className="tl-dot-idle"><Icon className="text-slate-600 text-base" /></div>
                      {!last && <div className="tl-line-idle" />}
                    </div>
                    <div className={`${last ? 'pb-0' : 'pb-5'} flex-1`}>
                      <p className="text-sm font-medium text-slate-500">{stage}</p>
                      <p className="text-xs text-slate-700 mt-1 font-mono">Pending</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
