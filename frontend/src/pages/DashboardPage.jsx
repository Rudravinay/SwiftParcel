import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { parcelAPI, reportAPI } from '../services/api'
import { StatusBadge, PageSpinner } from '../components/ui'
import { MdLocalShipping, MdCheckCircle, MdPendingActions, MdTrendingUp, MdArrowForward, MdAddBox, MdRefresh, MdGpsFixed } from 'react-icons/md'
import { HiSparkles } from 'react-icons/hi2'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const MONTHLY = [
  {m:'Jan',v:320},{m:'Feb',v:412},{m:'Mar',v:378},{m:'Apr',v:510},
  {m:'May',v:489},{m:'Jun',v:601},{m:'Jul',v:534},{m:'Aug',v:623},
]
const PIE_DATA = [
  {name:'Delivered',v:1031,c:'#2dd4bf'},
  {name:'In Transit',v:342,c:'#60a5fa'},
  {name:'Out for Delivery',v:87,c:'#a78bfa'},
  {name:'Picked Up',v:124,c:'#fbbf24'},
]
const MOCK_PARCELS = [
  {_id:'1',trackingId:'SP-20260409-001',receiverName:'Meena Devi',   receiverCity:'Chennai',   status:'In Transit',       createdAt:new Date()},
  {_id:'2',trackingId:'SP-20260409-002',receiverName:'Arun Patel',   receiverCity:'Mumbai',    status:'Out for Delivery', createdAt:new Date()},
  {_id:'3',trackingId:'SP-20260408-089',receiverName:'Lakshmi Rao',  receiverCity:'Bangalore', status:'Delivered',        createdAt:new Date(Date.now()-86400000)},
  {_id:'4',trackingId:'SP-20260408-088',receiverName:'Deepak Joshi', receiverCity:'Delhi',     status:'Picked Up',        createdAt:new Date(Date.now()-86400000)},
  {_id:'5',trackingId:'SP-20260408-087',receiverName:'Sita Ram',     receiverCity:'Hyderabad', status:'Delivered',        createdAt:new Date(Date.now()-172800000)},
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-500 border border-white/10 rounded-xl px-4 py-3 shadow-modal">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-bold text-p-400">{payload[0].value} deliveries</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user }  = useAuth()
  const [parcels, setParcels] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const [p, r] = await Promise.all([
        parcelAPI.getMine({ limit: 5, sort: '-createdAt' }),
        reportAPI.summary(),
      ])
      setParcels(p.data.parcels || [])
      setSummary(r.data)
    } catch {
      setParcels(MOCK_PARCELS)
      setSummary({ totalParcels:1584, inTransit:342, outForDelivery:87, delivered:1031, pickedUp:124 })
    } finally { setLoading(false) }
  }

  if (loading) return <PageSpinner />

  const STATS = [
    { label:'Total Shipments', val: summary?.totalParcels ?? 1584,  icon:MdLocalShipping,  bg:'bg-blue-500/10',   ic:'text-blue-400',   trend:'+12%' },
    { label:'In Transit',      val: summary?.inTransit   ?? 342,    icon:MdTrendingUp,     bg:'bg-amber-500/10',  ic:'text-amber-400',  trend:'Active' },
    { label:'Out for Delivery',val: summary?.outForDelivery ?? 87,  icon:MdPendingActions, bg:'bg-violet-500/10', ic:'text-violet-400', trend:'Today' },
    { label:'Delivered',       val: summary?.delivered   ?? 1031,   icon:MdCheckCircle,    bg:'bg-p-500/10',      ic:'text-p-400',      trend:'+8%' },
  ]

  return (
    <div className="space-y-5 page-in">
      {/* Welcome bar */}
      <div className="flex items-center justify-between s1 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HiSparkles className="text-p-400 text-sm" />
            <span className="text-xs font-semibold text-p-400 font-mono uppercase tracking-wider">Dashboard</span>
          </div>
          <h2 className="font-display text-xl font-bold text-white">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">Here's your shipment overview for today.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost text-xs gap-2 h-9">
            <MdRefresh className="text-base" /> Refresh
          </button>
          <Link to="/book" className="btn-primary text-xs h-9">
            <MdAddBox className="text-base" /> Book Parcel
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={s.label} className={`stat card-hover s${i+1} animate-fade-up`}>
            <div className={`stat-icon ${s.bg}`}>
              <s.icon className={s.ic} />
            </div>
            <div>
              <p className="stat-val">{s.val.toLocaleString()}</p>
              <p className="stat-lbl">{s.label}</p>
            </div>
            <span className="stat-trend">{s.trend}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="card p-5 xl:col-span-2 s5 animate-fade-up">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="card-title">Monthly Deliveries</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Completed shipments per month</p>
            </div>
            <span className="text-[10px] font-mono text-slate-700 bg-dark-500 px-2 py-1 rounded-lg border border-white/[0.05]">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MONTHLY} margin={{ top:0, right:0, left:-28, bottom:0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#14b8a6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="m" tick={{ fontSize:10, fill:'#475569', fontFamily:'Space Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#475569' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke:'rgba(20,184,166,0.3)', strokeWidth:1 }} />
              <Area type="monotone" dataKey="v" stroke="#14b8a6" strokeWidth={2}
                fill="url(#grad)" dot={false} activeDot={{ r:5, fill:'#14b8a6', stroke:'#0a0f1e', strokeWidth:2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-5 s6 animate-fade-up">
          <p className="card-title mb-1">Status Breakdown</p>
          <p className="text-[11px] text-slate-600 mb-4">Current distribution</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={62}
                paddingAngle={3} dataKey="v" stroke="none">
                {PIE_DATA.map(e => <Cell key={e.name} fill={e.c} />)}
              </Pie>
              <Tooltip contentStyle={{ background:'#1a2235', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, fontSize:11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {PIE_DATA.map(e => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: e.c }} />
                  <span className="text-slate-500">{e.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-400">{e.v.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent shipments */}
      <div className="card animate-fade-up">
        <div className="card-head">
          <div className="flex items-center gap-2">
            <MdLocalShipping className="text-p-400 text-base" />
            <span className="card-title">Recent Shipments</span>
            <span className="text-[10px] font-mono bg-dark-500 text-slate-600 px-2 py-0.5 rounded-md border border-white/[0.05]">
              {parcels.length} records
            </span>
          </div>
          <Link to="/history" className="flex items-center gap-1 text-xs text-p-400 hover:text-p-300 font-semibold transition-colors">
            View all <MdArrowForward />
          </Link>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Tracking ID</th><th>Receiver</th><th>Destination</th>
              <th>Status</th><th>Booked</th><th></th>
            </tr>
          </thead>
          <tbody>
            {parcels.map(p => (
              <tr key={p._id}>
                <td><span className="tid">{p.trackingId}</span></td>
                <td className="font-medium text-slate-200">{p.receiverName}</td>
                <td className="text-slate-500">{p.receiverCity}</td>
                <td><StatusBadge status={p.status} /></td>
                <td className="text-[11px] text-slate-600 font-mono">
                  {new Date(p.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                </td>
                <td>
                  <Link to="/track"
                    className="flex items-center gap-1 text-[11px] text-p-500 hover:text-p-400 font-semibold opacity-0 group-hover:opacity-100">
                    <MdGpsFixed /> Track
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
