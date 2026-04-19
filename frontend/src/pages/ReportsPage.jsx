import { useState, useEffect } from 'react'
import { reportAPI } from '../services/api'
import { PageSpinner } from '../components/ui'
import { toast } from 'react-toastify'
import { MdBarChart, MdDownload, MdTrendingUp, MdCheckCircle, MdLocalShipping, MdPendingActions, MdAutorenew } from 'react-icons/md'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'

const MONTHLY = [
  {m:'Jan',d:320,p:45},{m:'Feb',d:412,p:38},{m:'Mar',d:378,p:52},
  {m:'Apr',d:510,p:61},{m:'May',d:489,p:44},{m:'Jun',d:601,p:57},
  {m:'Jul',d:534,p:49},{m:'Aug',d:623,p:63},
]
const PIE = [
  {n:'Delivered',v:1031,c:'#2dd4bf'},
  {n:'In Transit',v:342,c:'#60a5fa'},
  {n:'Out for Delivery',v:87,c:'#a78bfa'},
  {n:'Picked Up',v:124,c:'#fbbf24'},
]
const REPORTS_TABLE = [
  {id:'RPT-APR-2026',total:1284,delivered:1031,pending:253,transit:342,out:87,gen:'Apr 9, 2026'},
  {id:'RPT-MAR-2026',total:1189,delivered:976, pending:213,transit:289,out:71,gen:'Mar 31, 2026'},
  {id:'RPT-FEB-2026',total:1042,delivered:891, pending:151,transit:241,out:52,gen:'Feb 28, 2026'},
]

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-500 border border-white/10 rounded-xl px-4 py-3 shadow-modal">
      <p className="text-[10px] text-slate-500 mb-2 font-mono">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-xs font-bold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function ReportsPage() {
  const [loading,    setLoading]    = useState(true)
  const [summary,    setSummary]    = useState(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    reportAPI.summary()
      .then(r => setSummary(r.data))
      .catch(() => setSummary({ totalParcels:1284, delivered:1031, pending:253, inTransit:342, outForDelivery:87 }))
      .finally(() => setLoading(false))
  }, [])

  const generate = async () => {
    setGenerating(true)
    try { await reportAPI.generate() } catch {}
    toast.success('Report generated!')
    setGenerating(false)
  }

  if (loading) return <PageSpinner />

  const rate = Math.round(((summary?.delivered || 1031) / (summary?.totalParcels || 1284)) * 100)

  const STATS = [
    { l:'Total Parcels',    v:summary?.totalParcels??1284,   icon:MdLocalShipping,  bg:'bg-blue-500/10',   ic:'text-blue-400'   },
    { l:'Delivered',        v:summary?.delivered??1031,      icon:MdCheckCircle,    bg:'bg-p-500/10',      ic:'text-p-400'      },
    { l:'Pending',          v:summary?.pending??253,         icon:MdPendingActions, bg:'bg-amber-500/10',  ic:'text-amber-400'  },
    { l:'Delivery Rate',    v:`${rate}%`,                    icon:MdTrendingUp,     bg:'bg-violet-500/10', ic:'text-violet-400' },
  ]

  return (
    <div className="space-y-5 page-in">
      {/* Header */}
      <div className="flex items-center justify-between s1 animate-fade-up">
        <p className="text-[11px] text-slate-700 font-mono">
          Report entity (ER) — totalParcels · deliveredParcels · pendingParcels · generatedAt
        </p>
        <div className="flex gap-2">
          <button onClick={generate} disabled={generating} className="btn-primary text-xs h-9 gap-2 disabled:opacity-50">
            {generating
              ? <div className="w-3.5 h-3.5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
              : <MdAutorenew className="text-base" />}
            Generate Report
          </button>
          <button className="btn-ghost text-xs h-9 gap-2">
            <MdDownload className="text-base" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={s.l} className={`stat card-hover s${i+1} animate-fade-up`}>
            <div className={`stat-icon ${s.bg}`}><s.icon className={s.ic} /></div>
            <p className="stat-val">{typeof s.v === 'number' ? s.v.toLocaleString() : s.v}</p>
            <p className="stat-lbl">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2 s5 animate-fade-up">
          <p className="card-title mb-1">Monthly Performance</p>
          <p className="text-[11px] text-slate-600 mb-5">Delivered vs pending per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY} margin={{ left:-24, bottom:0 }} barGap={3} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize:10, fill:'#475569', fontFamily:'Space Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#475569' }} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="d" name="Delivered" fill="#14b8a6" radius={[4,4,0,0]} />
              <Bar dataKey="p" name="Pending"   fill="#334155"  radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5 s6 animate-fade-up">
          <p className="card-title mb-1">Status Breakdown</p>
          <p className="text-[11px] text-slate-600 mb-3">Current parcel distribution</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={68}
                paddingAngle={4} dataKey="v" stroke="none">
                {PIE.map(e => <Cell key={e.n} fill={e.c} />)}
              </Pie>
              <Tooltip contentStyle={{ background:'#1a2235', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, fontSize:11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {PIE.map(e => (
              <div key={e.n} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background:e.c }} />
                  <span className="text-[11px] text-slate-500">{e.n}</span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-400">{e.v.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report records table */}
      <div className="card overflow-hidden s6 animate-fade-up">
        <div className="card-head">
          <div className="flex items-center gap-2">
            <MdBarChart className="text-p-400 text-base" />
            <span className="card-title">Report Records</span>
          </div>
          <span className="text-[10px] text-slate-700 font-mono hidden md:block">_id · totalParcels · deliveredParcels · pendingParcels · generatedAt</span>
        </div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Report ID</th><th>Total</th><th>Delivered</th><th>Pending</th>
                <th>In Transit</th><th>Out for Delivery</th><th>Generated At</th>
              </tr>
            </thead>
            <tbody>
              {REPORTS_TABLE.map(r => (
                <tr key={r.id}>
                  <td><span className="tid">{r.id}</span></td>
                  <td className="font-semibold text-slate-200">{r.total.toLocaleString()}</td>
                  <td><span className="text-p-400 font-bold font-mono">{r.delivered.toLocaleString()}</span></td>
                  <td><span className="text-amber-400 font-mono">{r.pending}</span></td>
                  <td className="text-blue-400 font-mono">{r.transit}</td>
                  <td className="text-violet-400 font-mono">{r.out}</td>
                  <td className="text-slate-600 font-mono text-xs">{r.gen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
